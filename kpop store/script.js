// Cart object to store cart items
const cart = JSON.parse(localStorage.getItem('cart')) || [];

/// Add item to cart function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
        alert(`Item already present in cart: ${product.name}`);
    } else {
        cart.push({...product, quantity: 1});
        alert(`Item added to cart: ${product.name}`);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Function to handle "Add to Cart" button clicks
function handleAddToCartClick(event) {
    if (event.target.classList.contains('add-to-cart')) {
        const productElement = event.target.closest('.product');
        const product = {
            id: productElement.getAttribute('data-id'),
            name: productElement.getAttribute('data-name'),
            price: parseFloat(productElement.getAttribute('data-price')),
            image: productElement.getAttribute('data-image')
        };
        addToCart(product);
    }
}

// Function to handle "Buy Now" button clicks
function handleBuyNowClick(event) {
    if (event.target.classList.contains('buy-now')) {
        const productElement = event.target.closest('.product');
        const product = {
            id: productElement.getAttribute('data-id'),
            name: productElement.getAttribute('data-name'),
            price: parseFloat(productElement.getAttribute('data-price')),
image: productElement.getAttribute('data-image') 
        };
        addToCart(product);
        alert(`Redirecting to checkout for ${product.name}`);
        // Redirect to checkout page if needed
        // window.location.href = 'checkout.html';
    }
}

/// Function to handle search functionality
function searchProducts() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const products = document.querySelectorAll('.product');
    let visibleProduct = false; // Flag to check if any product is visible

    products.forEach(product => {
        const name = product.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
            product.style.display = 'block'; // Show the product if it matches
            visibleProduct = true; // Set the flag to true if a product matches
        } else {
            product.style.display = 'none'; // Hide the product if it does not match
        }
    });

    // Show or hide the "Product Unavailable" message and "Featured Products" heading
    const noResultsMessage = document.getElementById('no-results');
    const featuredProductsHeading = document.getElementById('featured-products-heading');

    if (visibleProduct) {
        noResultsMessage.style.display = 'none'; // Hide the message if products are visible
        featuredProductsHeading.style.display = 'block'; // Show the heading if products are visible
    } else {
        noResultsMessage.style.display = 'block'; // Show the message if no products are visible
        featuredProductsHeading.style.display = 'none'; // Hide the heading if no products are visible
    }
}

// Function to clear the search bar and show all products
function clearSearch() {
    document.getElementById('search-bar').value = ''; // Clear the search input
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.style.display = 'block'; // Show all products
    });

    // Hide the "Product Unavailable" message and show the "Featured Products" heading
    document.getElementById('no-results').style.display = 'none';
    document.getElementById('featured-products-heading').style.display = 'block';
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', searchProducts);

// Event listener for clear button
document.getElementById('clear-search').addEventListener('click', clearSearch);

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', function(){
document.querySelector('#shop').addEventListener('click', handleAddToCartClick);
document.querySelector('#shop').addEventListener('click', handleBuyNowClick);
});
