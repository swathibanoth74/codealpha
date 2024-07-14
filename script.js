// script.js

// Sample product data
const products = [
    { id: 1, name: 'Product 1', price: 10, image: 'https://ecommercefastlane.com/wp-content/uploads/2022/11/AdobeStock_241431868-scaled.jpeg' },
    { id: 2, name: 'Product 2', price: 15, image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: 20, image: 'product3.jpg' },
];

// Function to display products on the page
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productList.appendChild(productElement);
    });
}

// Function to add a product to the cart
function addToCart(productId) {
    const cartLink = document.getElementById('cart-link');
    let cartCount = parseInt(cartLink.textContent.match(/\d+/)) || 0;
    cartCount++;
    cartLink.textContent = `Cart (${cartCount})`;
}

// Display products when the page loads
displayProducts();
