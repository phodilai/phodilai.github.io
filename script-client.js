import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const menuItems = [
    { id: 1, name: 'Trà Đá', price: 5000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/528467272_1088978119425078_2155584391935203864_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE8KngH6lQGpCaJPqs1qYepMyAC2J3e4DwzIALYnd7gPPeFYU3bIXha77SWzRvR9Zfq4X6PVEnoZsAe68Y78RQN&_nc_ohc=N_OgxAkk42oQ7kNvwHbPqIm&_nc_oc=AdkPGcUanFFqRnhWJFp6pqjFCoEDTQ_8dCq1vs9e0Zgyr_HC5AWe6fJNyAUGi1a-5Bs&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEfxzLheoCdwR9p7XPGTDnQsL1StTCc0EPXhXRainL3Zw&oe=68B7DD19' },
    { id: 2, name: 'Trà Chanh', price: 10000, image: 'https://scontent.fhan3-4.fna.fbcdn.net/v/t1.15752-9/524128035_1024804109561671_3486439221231126237_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEsWJNZoX5r7qENR-KMNqdsNIB8BQQoF6Y0gHwFBCgXpqVLEQgxgePCbmz8JdUDjis4qtEDebiBnbd1YYVmFvE3&_nc_ohc=cMokeng3_tUQ7kNvwHE_pWV&_nc_oc=AdlAVBPMg7n91B96BPaKQXyT2mlOQdbPxeGny1hOhCT5TA5cesifRWsphXCeMhb-wuA&_nc_zt=23&_nc_ht=scontent.fhan3-4.fna&oh=03_Q7cD3AH43VyG13_bu1qcNSUKgNp8q1iFliv4AvTrgbbSybyG0g&oe=68B7C42A' },
    { id: 3, name: 'Trà Quất', price: 10000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/524265289_1418211029233447_6094407288034019642_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeExb7j7q8YyGeIkfkgfmd9s4z3kLt6cJCLjPeQu3pwkIrzCSNgfuNss8SYEUCeTsLzA3Ik0tpD_SVNUS6HKl1le&_nc_ohc=OmC_javE0qAQ7kNvwHmIKWQ&_nc_oc=AdmAaGLswnvmwz0t6JpnsRdoSEZHdW61zt-_mE2JyYpbcOj1cAlpYB3vcyDcb-3R8T8&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEB_vKiItPQuCsSML7_tw9vFSyaatsmYTVGAr_-oIRx5A&oe=68B7C9BF' },
    { id: 4, name: 'Cafe Nâu', price: 20000, image: 'https://scontent.fhan3-3.fna.fbcdn.net/v/t1.15752-9/524305030_749540351005311_5762236659003573076_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGP285HNvEwXz6Z66CXmN3AQxKAqcoQUfxDEoCpyhBR_KhOc-_Qg7WG2xvOyzsFxL7MeAtbugVVajGOjiN7Xogy&_nc_ohc=NMqUUx21bnwQ7kNvwGvnU8o&_nc_oc=Adl-SP8Im4GrzcFvVnmet3Kb2E0dsH0AGog2kzJx8G3Gd2rF4UNJwtEMnB00--C04ow&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&oh=03_Q7cD3AFT_L76I2T56JIljK34tpKzdldodEar6OlPS1AI-QSjGQ&oe=68B7E5A4' },
    { id: 5, name: 'Cafe Đen', price: 20000, image: 'https://scontent.fhan4-4.fna.fbcdn.net/v/t1.15752-9/524696028_756438240304371_4802309054759004427_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeH9-1JumYAsKDP2yLHuyzTSkdmwVwrxN_GR2bBXCvE38aNiSvp-zqhmNG_JcNSZXg8zRjlPzANNmXuiHUBynmTQ&_nc_ohc=Orni7tR5jpIQ7kNvwHtnlvn&_nc_oc=Adn-Tf_xbSltep3JxHwiTb_9DqxvYLTWatbtglKe4xLxBJyG0fCTQqsUzHNK1iey6dU&_nc_zt=23&_nc_ht=scontent.fhan4-4.fna&oh=03_Q7cD3AE2StRUo0s4sncQjnNy0LWDW2uGvRcbpcxMVY4NddnmaA&oe=68B7C6E6' },
    { id: 6, name: 'Bạc Xỉu', price: 25000, image: 'https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/525252571_1830106864204410_5423043039532890250_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHnjBkIBA_3UdRC1jDny04fCxvZVSxBV8ULG9lVLEFXxYRyzDZWE7nYDDHqvBdY8aGmijtG6aHVz04ZlvhmIYGZ&_nc_ohc=DDagvseztFsQ7kNvwHGiVup&_nc_oc=AdnD_DqkO6qaD5XGOftjim1CPB5UdElnNh4Tni8LaXaR1-KuFIBpbMB-sCxsntmLKCM&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD3AFc9vADx-fyXsnap2Oa-0_xdQZvcPJd80ZiOVpArO9pQyg&oe=68B7F5FB' },
    { id: 7, name: 'Cafe Muối', price: 25000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/527701742_1652329582131347_4912877306807824192_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEi8I7vQX2E0wVVrwdZ3JsgrtWERo24LB2u1YRGjbgsHYLYJedcn6Obo6maELAgehhm59EP2Rkw1EwPg9rwrjqv&_nc_ohc=ZpukEEkKcwcQ7kNvwH99AgH&_nc_oc=Admq8nBZ6lLXCF2H8iVj8-zz42ArTq3YYskbgQ60LLIT1fQHK_IenQLoz6jiR1pzZnE&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AFWhNNMxj6VhWUwlS5J415p7hL7ElnDI0gmMb9gLOdLbA&oe=68B7D5FE' },
    { id: 8, name: 'Sữa Chua Lắc', price: 25000, image: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t1.15752-9/526441291_1269879847333066_3500046320414158270_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFyarHVjF3QnxKMb4YYwWz9F7FpOKRIH6oXsWk4pEgfqmFYv12w5gK5p9AIGLgx8QgkPg_-b0w_sdYrEQVdMw-B&_nc_ohc=5-B93Gxy0-EQ7kNvwGHfjj2&_nc_oc=Adm-4fOjPVX1QKYdRcV7_RCYCYSpIGbvEpQ_znV51k6PN9aFG_YBt2th064-0YPQAr4&_nc_zt=23&_nc_ht=scontent.fhan4-1.fna&oh=03_Q7cD3AFvXazCDxpd05IoGzWSMFeJVjzWMZNEweosl8D-vQeANQ&oe=68B7F3A9' },
    { id: 9, name: 'SC Lắc Dâu', price: 30000, image: 'https://scontent.fhan3-3.fna.fbcdn.net/v/t1.15752-9/526149395_2153801508467855_2307181939167630771_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeE-gTrGzT9cmrciA4h22iJqcAlpSjQIa5dwCWlKNAhrl5WkzMAcZdJiDR-MA6CzY8oXXlNVuQwWK9ubGPGNf5o6&_nc_ohc=dv8zo7axIxYQ7kNvwEjrO1m&_nc_oc=AdllFenUYhdF6e_5nBlcMssAlFeCLokRcqu3IF4CQi8Sn1ndbPDiVlToLsYcEcY7O7w&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&oh=03_Q7cD3AGrPA15Ejy3ZArmQ3KQPugODcHDJ3vrwnSP3vnDwDBdjg&oe=68B7CC92' },
    { id: 10, name: 'SC Lắc Việt Quất', price: 30000, image: 'https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/525416436_1665455384143810_832299445849766471_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEiSK4_5ZzuCmS8D8bfflrlMe6RtTQ623Ux7pG1NDrbdRg9YANNAfrz_JSh_p2RL89NGl1VFIRA2XBeHCTvB-23&_nc_ohc=1cc_7dVXIMQQ7kNvwHwZmZ4&_nc_oc=AdlMVtlsESWWmCt3IY3GuOCZz-IhQs_DY3JniLzbhyhM0MFCgsogvMPP7rFy7GhPkpA&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD3AHDlBQ7uaCxAju3nDTXWt7fLFyFoDY1jAg-Dh5wTxndAw&oe=68B7C4B9' },
    { id: 11, name: 'Bim Bim', price: 6000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/524654314_1855264411999774_734793370755222912_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHycIby3yHpZwC1ev7S6XtT0515WdA5WfbTnXlZ0DlZ9mwbH-ZA4qGcmyT4UxtpZ6K8eIdVCcgmfq84MRvnub67&_nc_ohc=IzVMClZJ99cQ7kNvwFLeYLP&_nc_oc=Adnp6CU4pnefUdWqB18-0ViPPWKQaRcz9CEgoAmairJNAWFsW37-61Dsvlww6Icfwlc&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AE6Gm5_ECBuQQQmvni5sP9gr4o-2O2fVzKasuFUYLWijQ&oe=68B7CBCD' },
    { id: 12, name: 'Hướng Dương', price: 10000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/527231823_1330496755315334_823293477744792975_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGeTt6nz7F4x12G5Ojg1v0tSM3XShVapZBIzddKFVqlkAJHhNymSVRHbq0we9Z6QA3JFHB_aGCEwp8VH-D9wOc3&_nc_ohc=YAkstTobzxgQ7kNvwHhsam9&_nc_oc=Adl4aSopIwhLLiwzhoytB_HIG2cgMTMwnWkjo_Mas0cEghCnlbDrpT7Qy9VYGaWbsec&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AEKJy4RVDwl_cx_6oS4dVYI7ibXxF4ygd8-yGED2bRkww&oe=68B7EAD1' },
    { id: 13, name: 'Thăng Long Cứng', price: 15000, image: 'https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/524655567_762633793162981_6459701164747945606_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEcNByng6NdTKccV05_kI8yqHKQorSebNCocpCitJ5s0O_yVn3xYuAoQY_dHuSVj4tig4t93xDF3_-uLqg8RUyy&_nc_ohc=2rAo6845W-EQ7kNvwHqDqk_&_nc_oc=AdlLigFFcdKwVsGV_VV6VubPOxTwkKdKE6uF0uCS0OrTdaINLWVjd_mDoYoiMtlLwak&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD3AFLdnqYJCKFb1PiRKB57Uot2VFQ7eZAvYEuYH_GJKSmdA&oe=68B7E56E' },
    { id: 14, name: 'Cay Cay', price: 2000, image: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t1.15752-9/524132981_1489744015716698_6781836828722093721_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeF7vfKvkHfK1bf6dVmf151lNQrvlhQa9YU1Cu-WFBr1hfTCrd46rbXFqT7TJ44VO8We8fk2gftcO3ZCV5jApdlP&_nc_ohc=H7CBZrURYxgQ7kNvwEtMQoh&_nc_oc=Adm0rrLEp8NWIkbZKOE_B4G3F5cdEYv7giZJR-DRWY7FSNP-tdDZCyOqY6mmYcL9NdU&_nc_zt=23&_nc_ht=scontent.fhan4-3.fna&oh=03_Q7cD3AHaJq_GK8osdhj1JDWGmJApcdJO3j7nQDzO4jDPpT5qlA&oe=68B7E877' }
];

const customizationOptions = {
    sugar: [100, 70, 50, 30, 0],
    ice: [100, 70, 50, 30, 0],
    toppings: [
        { name: 'Nha đam', price: 5000 }
    ]
};

let cart = [];
let currentCustomizingItem = null;

function renderMenu() {
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';
    menuItems.forEach(item => {
        const itemHtml = `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price.toLocaleString('vi-VN')} VNĐ</p>
                <button class="customize-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Thêm vào giỏ</button>
            </div>
        `;
        menuDiv.innerHTML += itemHtml;
    });
    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = {
                id: parseInt(e.target.dataset.id),
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
                image: e.target.dataset.image
            };
            showCustomizationModal(item);
        });
    });
}

function showCustomizationModal(item) {
    currentCustomizingItem = item;
    const modal = document.getElementById('customizationModal');
    document.getElementById('customizationItemName').innerText = currentCustomizingItem.name;
    
    const sugarOptionsDiv = document.getElementById('sugarOptions');
    sugarOptionsDiv.innerHTML = `
        <p>Đường:</p>
        ${customizationOptions.sugar.map(level => `
            <label>
                <input type="radio" name="sugar" value="${level}" ${level === 100 ? 'checked' : ''}>
                ${level}%
            </label>
        `).join('')}
    `;

    const iceOptionsDiv = document.getElementById('iceOptions');
    iceOptionsDiv.innerHTML = `
        <p>Đá:</p>
        ${customizationOptions.ice.map(level => `
            <label>
                <input type="radio" name="ice" value="${level}" ${level === 100 ? 'checked' : ''}>
                ${level}%
            </label>
        `).join('')}
    `;

    const toppingOptionsDiv = document.getElementById('toppingOptions');
    toppingOptionsDiv.innerHTML = '';
    if (currentCustomizingItem.name.includes('Trà Chanh') || currentCustomizingItem.name.includes('Trà Quất')) {
        toppingOptionsDiv.innerHTML = `
            <p>Topping:</p>
            ${customizationOptions.toppings.map(topping => `
                <label>
                    <input type="checkbox" name="topping" value="${topping.name}" data-price="${topping.price}">
                    ${topping.name} (+${topping.price.toLocaleString('vi-VN')} VNĐ)
                </label>
            `).join('')}
        `;
    }

    modal.style.display = 'flex';
}

function closeCustomizationModal() {
    document.getElementById('customizationModal').style.display = 'none';
    currentCustomizingItem = null;
}

function addToCartFromModal() {
    if (!currentCustomizingItem) return;

    const selectedSugar = parseInt(document.querySelector('input[name="sugar"]:checked').value);
    const selectedIce = parseInt(document.querySelector('input[name="ice"]:checked').value);
    const selectedToppings = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(cb => ({
        name: cb.value,
        price: parseInt(cb.dataset.price)
    }));

    const toppingPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    const finalPrice = currentCustomizingItem.price + toppingPrice;

    // Kiểm tra nếu món giống nhau (id, đường, đá, topping) thì cộng số lượng
    const existingIndex = cart.findIndex(item =>
        item.id === currentCustomizingItem.id &&
        item.sugar === selectedSugar &&
        item.ice === selectedIce &&
        JSON.stringify(item.toppings) === JSON.stringify(selectedToppings)
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            ...currentCustomizingItem,
            quantity: 1,
            sugar: selectedSugar,
            ice: selectedIce,
            toppings: selectedToppings,
            price: finalPrice
        });
    }

    renderCart();
    closeCustomizationModal();
}


function renderCart() {
    const cartDiv = document.getElementById('cart');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    cartDiv.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
    } else {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            let customizationString = '';
            if (item.sugar || item.ice || (item.toppings && item.toppings.length > 0)) {
                const toppingsNames = item.toppings.map(t => t.name).join(', ');
                customizationString = ` (${item.sugar} đường, ${item.ice} đá${toppingsNames ? `, Topping: ${toppingsNames}` : ''})`;
            }

            const cartItemHtml = `
                <div class="cart-item">
                    <div class="order-details">
                        <span>${item.name}${customizationString}</span>
                        <br>
                        <span>${item.price.toLocaleString('vi-VN')} VNĐ x ${item.quantity}</span>
                    </div>
                    <div class="order-actions">
                        <button class="decrease-quantity-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity-btn" data-index="${index}">+</button>
                        <button class="remove-from-cart-btn" data-index="${index}">Xóa</button>
                    </div>
                </div>
            `;
            cartDiv.innerHTML += cartItemHtml;
        });
    }
    document.getElementById('totalPrice').innerText = totalPrice.toLocaleString('vi-VN');

    document.querySelectorAll('.increase-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart[index].quantity++;
            renderCart();
        });
    });

    document.querySelectorAll('.decrease-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            renderCart();
        });
    });

    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            renderCart();
        });
    });
}

function showOrderModal(orderType) {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const modal = document.getElementById('orderModal');
    const orderModalTitle = document.getElementById('orderModalTitle');
    const orderOptionsDiv = document.getElementById('orderOptions');
    orderOptionsDiv.innerHTML = ''; 

    if (orderType === 'dine-in') {
        orderModalTitle.innerText = 'Vui lòng điền số bàn';
        orderOptionsDiv.innerHTML = `<input type="text" id="tableNumber" placeholder="Số bàn" required>`;
    } else if (orderType === 'delivery') {
        orderModalTitle.innerText = 'Thông tin Đặt Giao Hàng';
        orderOptionsDiv.innerHTML = `
            <input type="text" id="customerName" placeholder="Tên khách hàng" required>
            <input type="text" id="phone" placeholder="Số điện thoại" required>
            <textarea id="address" placeholder="Địa chỉ" required></textarea>
        `;
    }

    orderOptionsDiv.innerHTML += `<textarea id="orderNote" placeholder="Ghi chú"></textarea>`;

    modal.style.display = 'flex';
    document.getElementById('submitOrderBtn').dataset.orderType = orderType;
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

async function submitOrder() {
    const orderType = document.getElementById('submitOrderBtn').dataset.orderType;
    let customerInfo = {};
    const orderNote = document.getElementById('orderNote').value;

    if (orderType === 'dine-in') {
        const tableNumber = document.getElementById('tableNumber').value;
        if (!tableNumber) {
            alert("Vui lòng nhập số bàn!");
            return;
        }
        customerInfo = { type: 'Uống tại chỗ', tableNumber };
    } else if (orderType === 'delivery') {
        const customerName = document.getElementById('customerName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        if (!customerName || !phone || !address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }
        customerInfo = { type: 'Giao hàng', customerName, phone, address };
    } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        return;
    }

    const newOrder = {
        items: cart,
        customerInfo: customerInfo,
        totalPrice: parseFloat(document.getElementById('totalPrice').innerText.replace(/[^0-9]/g, '')),
        status: 'Đang chờ xử lý',
        isPaid: false,
        note: orderNote,
        createdAt: new Date() // Lưu dưới dạng Timestamp của Firebase
    };
    
    try {
        await addDoc(collection(db, "orders"), newOrder);
        alert("Đơn hàng của bạn đã được gửi thành công!");
        cart = [];
        renderCart();
        closeOrderModal();
    } catch (e) {
        console.error("Lỗi khi thêm đơn hàng: ", e);
        alert("Có lỗi xảy ra khi gửi đơn hàng!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    renderCart();

    document.getElementById('dineInBtn').addEventListener('click', () => showOrderModal('dine-in'));
    document.getElementById('deliveryBtn').addEventListener('click', () => showOrderModal('delivery'));

    document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
    
    document.getElementById('addToCartModalBtn').addEventListener('click', addToCartFromModal);
    
    document.getElementById('closeCustomizationModal').addEventListener('click', closeCustomizationModal);
    document.getElementById('closeOrderModal').addEventListener('click', closeOrderModal);
});
