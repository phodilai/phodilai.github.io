import { db } from './firebase-config.js';
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Lấy các phần tử container từ admin.html
const pendingOrdersDiv = document.getElementById('pendingOrders');
const completedOrdersDiv = document.getElementById('completedOrders');
const archivedOrdersDiv = document.getElementById('archivedOrders');
const deletedOrdersDiv = document.getElementById('deletedOrders');
const revenueDiv = document.getElementById('dailyRevenue');
const toggleDeletedBtn = document.getElementById('toggleDeletedBtn');
const deletedOrdersSection = document.getElementById('deletedOrdersSection');

let orders = [];

// Theo dõi đơn hàng từ Firebase Firestore
onSnapshot(collection(db, "orders"), (querySnapshot) => {
    orders = [];
    querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
    });
    renderAll();
}, (error) => {
    console.error("Lỗi khi lắng nghe đơn hàng:", error);
});

function renderAll() {
    const sortedOrders = orders.sort((a, b) => {
        const dateA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
        const dateB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
        return dateB - dateA;
    });

    renderOrdersByStatus(sortedOrders);
    renderDailyRevenue(calculateDailyRevenue(orders));
}

function renderOrdersByStatus(allOrders) {
    pendingOrdersDiv.innerHTML = '';
    completedOrdersDiv.innerHTML = '';
    archivedOrdersDiv.innerHTML = '';
    deletedOrdersDiv.innerHTML = '';

    allOrders.forEach(order => {
        if (order.status === 'Đang chờ xử lý' || order.status === 'Đang chuẩn bị') {
            pendingOrdersDiv.innerHTML += createOrderHtml(order, 'Đã hoàn thành', 'Đã hoàn thành', !order.isPaid);
        } else if (order.status === 'Đã hoàn thành') {
            completedOrdersDiv.innerHTML += createOrderHtml(order, 'Lưu trữ', 'Đã lưu trữ', !order.isPaid);
        } else if (order.status === 'Đã lưu trữ') {
            archivedOrdersDiv.innerHTML += createOrderHtml(order, 'Xóa đơn', 'Đã xóa');
        } else if (order.status === 'Đã xóa') {
            deletedOrdersDiv.innerHTML += createOrderHtml(order, 'Khôi phục', 'Đang chờ xử lý');
        }
    });
}

function createOrderHtml(order, buttonText = '', action = '', showPaidBtn = false) {
    const itemsList = order.items.map(item => {
        const customizationString = item.sugar || item.ice || (item.toppings && item.toppings.length > 0) 
            ? ` (${item.sugar} đường, ${item.ice} đá${item.toppings && item.toppings.length > 0 ? `, topping: ${item.toppings.map(t => t.name).join(', ')}` : ''})`
            : '';
        return `<li>${item.name}${customizationString} x ${item.quantity}</li>`;
    }).join('');

    const createdTime = order.createdAt ? (order.createdAt.toDate ? order.createdAt.toDate().toLocaleString('vi-VN') : new Date(order.createdAt).toLocaleString('vi-VN')) : 'Không rõ';

    let customerInfo = '';
    if (order.customerInfo) {
        if (order.customerInfo.type === 'Uống tại chỗ') {
            customerInfo = `<strong>Loại đơn hàng:</strong> Uống tại chỗ<br><strong>Số bàn:</strong> ${order.customerInfo.tableNumber}`;
        } else if (order.customerInfo.type === 'Giao hàng') {
            customerInfo = `<strong>Loại đơn hàng:</strong> Giao hàng<br>
                            <strong>Tên khách hàng:</strong> ${order.customerInfo.customerName}<br>
                            <strong>SĐT:</strong> ${order.customerInfo.phone}<br>
                            <strong>Địa chỉ:</strong> ${order.customerInfo.address}`;
        }
    }

    const paidStatusHtml = order.isPaid ? `<p style="color: #27ae60; font-weight: bold; margin-top: 10px;">Đã thanh toán</p>` : '';

    let blinkingText = '';
    if (order.customerInfo?.type === 'Uống tại chỗ' && !order.isPaid && (order.status === 'Đã hoàn thành' || order.status === 'Đang chuẩn bị')) {
        blinkingText = `<p class="blinking-text">(Chưa thanh toán)</p>`;
    }

    let actionsHtml = '';
    if (action) {
        actionsHtml += `<button class="status-btn" data-id="${order.id}" data-status="${action}">${buttonText}</button>`;
    }
    if (showPaidBtn) {
        actionsHtml += `<button class="payment-btn" data-id="${order.id}">Đã thanh toán</button>`;
    }

    return `
        <div class="order-item" data-id="${order.id}">
            <div class="order-details">
                <p><strong>Thời gian tạo:</strong> ${createdTime}</p>
                <p>${customerInfo}</p>
                <p><strong>Ghi chú:</strong> ${order.note || 'Không có'}</p>
                <p><strong>Tổng tiền:</strong> ${order.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
            </div>

            ${paidStatusHtml}
            ${blinkingText}

            <div class="order-actions">
                ${actionsHtml}
                <button class="toggle-items-btn">Hiển thị món</button>
                <button class="edit-items-btn">Chỉnh sửa món</button>
            </div>

            <div class="order-items" style="display: none; margin-top: 10px;">
                <p><strong>Các món:</strong></p>
                <ul>${itemsList}</ul>
            </div>
        </div>
    `;
}

function calculateDailyRevenue(orders) {
    const revenueByDate = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const paidArchivedOrders = orders.filter(order => order.isPaid && order.status === 'Đã lưu trữ');

    paidArchivedOrders.forEach(order => {
        const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
            const dateString = orderDate.toLocaleDateString('vi-VN');
            if (!revenueByDate[dateString]) {
                revenueByDate[dateString] = 0;
            }
            revenueByDate[dateString] += order.totalPrice;
        }
    });

    return revenueByDate;
}

function renderDailyRevenue(revenueData) {
    revenueDiv.innerHTML = '';
    const sortedDates = Object.keys(revenueData).sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB - dateA;
    });

    let total = 0;

    if (sortedDates.length === 0) {
        revenueDiv.innerHTML = '<p>Không có dữ liệu doanh thu trong 3 ngày gần nhất.</p>';
        return;
    }

    sortedDates.forEach(date => {
        const revenue = revenueData[date];
        total += revenue;
        revenueDiv.innerHTML += `
            <div class="revenue-item">
                <h3>Ngày: ${date}</h3>
                <p>Tổng doanh thu: ${revenue.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        `;
    });

    revenueDiv.innerHTML += `
        <div class="revenue-item" style="font-weight:bold; color:#2c3e50;">
            <h3>Tổng doanh thu 3 ngày:</h3>
            <p>${total.toLocaleString('vi-VN')} VNĐ</p>
        </div>
    `;
}

async function updateOrderStatus(orderId, status) {
    const orderRef = doc(db, "orders", orderId);
    try {
        await updateDoc(orderRef, { status: status });
    } catch (e) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng: ", e);
    }
}

async function updateOrderPaymentStatus(orderId, isPaid) {
    const orderRef = doc(db, "orders", orderId);
    try {
        await updateDoc(orderRef, { isPaid: isPaid });
    } catch (e) {
        console.error("Lỗi khi cập nhật trạng thái thanh toán: ", e);
    }
}

document.addEventListener('click', (e) => {
    if (e.target && e.target.matches('.status-btn')) {
        const orderId = e.target.dataset.id;
        const status = e.target.dataset.status;

        let confirmMsg = "Bạn có chắc chắn muốn thay đổi trạng thái đơn này?";
        if (status === 'Đã xóa') confirmMsg = "Bạn có chắc chắn muốn xóa đơn này?";
        if (status === 'Đã lưu trữ') confirmMsg = "Bạn có muốn lưu trữ đơn này?";
        if (status === 'Đang chờ xử lý') confirmMsg = "Khôi phục đơn này?";

        if (confirm(confirmMsg)) {
            updateOrderStatus(orderId, status);
        }
    }

    if (e.target && e.target.matches('.payment-btn')) {
        const orderId = e.target.dataset.id;
        if (confirm("Bạn có chắc chắn khách đã thanh toán không?")) {
            updateOrderPaymentStatus(orderId, true);
        }
    }

    if (e.target && e.target.id === 'toggleDeletedBtn') {
        if (deletedOrdersSection.style.display === 'none') {
            deletedOrdersSection.style.display = 'block';
            toggleDeletedBtn.innerText = 'Ẩn Đơn đã xóa';
        } else {
            deletedOrdersSection.style.display = 'none';
            toggleDeletedBtn.innerText = 'Hiện Đơn đã xóa';
        }
    }

    if (e.target && e.target.classList.contains('toggle-items-btn')) {
        const orderItem = e.target.closest('.order-item');
        const itemsDiv = orderItem.querySelector('.order-items');
        if (itemsDiv.style.display === 'none') {
            itemsDiv.style.display = 'block';
            e.target.textContent = 'Ẩn món';
        } else {
            itemsDiv.style.display = 'none';
            e.target.textContent = 'Hiển thị món';
        }
    }

    if (e.target && e.target.classList.contains('edit-items-btn')) {
        const orderId = e.target.closest('.order-item').dataset.id;
        alert(`Chức năng chỉnh sửa đơn ${orderId} đang được phát triển.`);
        // Có thể mở modal tại đây nếu muốn
    }
});
