// ===signup===

function saveData() {
    let name, email, password;
    name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    if (name === "" || email === "" || password === "") {
        Swal.fire({
            icon: 'error',
            title: 'Input fields must be filled.',
            text: 'Name, Email, and Password cannot be empty.',
        });
        return false;
    }

    let user_record = JSON.parse(localStorage.getItem("user")) || [];
    if (user_record.some((v) => v.email === email)) {
        Swal.fire({
            icon: 'error',
            title: 'Credentials Error',
            text: 'Email Already Exists!',
        });
    } else {
        user_record.push({
            name: name,
            email: email,
            password: password
        });
        Swal.fire({
            icon: 'success',
            title: 'Sign up successfully',
            text: 'Your account has been created.',
        }).then(function () {
            localStorage.setItem("user", JSON.stringify(user_record));
            window.location.href = "login.html";
        });
    }
}


//===login=== 


function login() {
    let email, password;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    let user_record = JSON.parse(localStorage.getItem("user")) || [];
    if (user_record.some((v) => v.email === email && v.password === password)) {
        Swal.fire({
            icon: 'success',
            title: 'Login Successfully',
            text: 'Welcome...!',
        }).then(function () {
            let current_user = user_record.find((v) => v.email === email && v.password === password);
            localStorage.setItem("name", current_user.name);
            localStorage.setItem("email", current_user.email);
            window.location.href = "home.html";
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid Credentials...!',
        });
    }
}


//===home.html===


var addToCartButtons = document.querySelectorAll('.btn-dark');
addToCartButtons.forEach(function (button) {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    var card = event.target.closest('.card');

    var itemName = card.querySelector('.card-text').textContent;
    var itemPrice = card.querySelector('.card-title i').innerHTML;

    var item = {
        name: itemName,
        price: itemPrice
    };

    var cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    cartItems.push(item);

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

}


//===page.html===


var cartItems = localStorage.getItem('cartItems');
cartItems = cartItems ? JSON.parse(cartItems) : [];

var cartItemsContainer = document.getElementById('cartItems');
var totalAmountElement = document.getElementById('totalAmount');
var totalAmount = 0;

cartItems.forEach(function (item) {
    var itemRow = document.createElement('tr');
    var itemName = document.createElement('td');
    var itemPrice = document.createElement('td');
    var deleteButtonCell = document.createElement('td');
    var deleteButton = document.createElement('button');

    itemName.textContent = item.name;
    itemPrice.textContent = item.price;
    deleteButton.textContent = 'Delete';

    itemRow.appendChild(itemName);
    itemRow.appendChild(itemPrice);

    deleteButtonCell.appendChild(deleteButton);
    itemRow.appendChild(deleteButtonCell);

    cartItemsContainer.appendChild(itemRow);

    totalAmount += Number(item.price);

    deleteButton.addEventListener('click', function () {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This item will be permanently deleted from your cart.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                var itemIndex = cartItems.indexOf(item);
                if (itemIndex > -1) {
                    cartItems.splice(itemIndex, 1);
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));

                cartItemsContainer.removeChild(itemRow);

                totalAmount -= item.price;
                totalAmountElement.textContent = totalAmount;

                Swal.fire({
                    title: 'Deleted!',
                    text: 'The item has been deleted from your cart.',
                    icon: 'success',
                });
            }
        });
    });
});

totalAmountElement.textContent = totalAmount;

document.addEventListener('DOMContentLoaded', function () {
    var orderButton = document.getElementById('orderButton');

    orderButton.addEventListener('click', function () {
        Swal.fire({
            title: 'Thank you for your order!',
            icon: 'success',
        }).then(function () {
            cartItems = [];
            localStorage.removeItem('cartItems');
            cartItemsContainer.innerHTML = '';
            totalAmount = 0;
            totalAmountElement.textContent = totalAmount;
        });
    });
});