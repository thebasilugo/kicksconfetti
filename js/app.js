import {
	getProducts,
	getFeaturedProducts,
	getNewArrivals,
	getPromotions,
	getDailyDeal,
} from "./productManager.js";

// State management
const state = {
	products: [],
	cart: [],
	wishlist: [],
	user: {
		name: "John Doe",
		email: "john@example.com",
		phone: "",
		address: "",
		preferences: [],
		birthdate: "",
		gender: "",
	},
	currentPage: "home",
	dailyDeal: null,
	darkMode: false,
	isEditingProfile: false,
};

// DOM Elements
const elements = {
	pageContent: document.getElementById("page-content"),
	searchInput: document.getElementById("search-input"),
	wishlistBtn: document.getElementById("wishlist-btn"),
	cartBtn: document.getElementById("cart-btn"),
	profileBtn: document.getElementById("profile-btn"),
	cartItems: document.getElementById("cart-items"),
	cartTotal: document.getElementById("cart-total"),
	checkoutBtn: document.getElementById("checkout-btn"),
	mainContent: document.getElementById("main-content"),
	homeLink: document.getElementById("home-link"),
	shopLink: document.getElementById("shop-link"),
	aboutLink: document.getElementById("about-link"),
	contactLink: document.getElementById("contact-link"),
	wishlistCount: document.getElementById("wishlist-count"),
	cartCount: document.getElementById("cart-count"),
	mobileMenuButton: document.getElementById("mobile-menu-button"),
	mobileMenu: document.getElementById("mobile-menu"),
	currentYear: document.getElementById("current-year"),
	breadcrumbs: document.getElementById("breadcrumbs"),
	darkModeToggle: document.getElementById("dark-mode-toggle"),
};

// Event Listeners
function setupEventListeners() {
	elements.searchInput.addEventListener("input", debounce(handleSearch, 300));
	elements.cartBtn.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("cart");
	});
	elements.profileBtn.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("profile");
	});
	elements.checkoutBtn.addEventListener("click", handleCheckout);
	elements.homeLink.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("home");
	});
	elements.shopLink.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("shop");
	});
	elements.aboutLink.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("about");
	});
	elements.contactLink.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("contact");
	});
	elements.mobileMenuButton.addEventListener("click", toggleMobileMenu);
	elements.wishlistBtn.addEventListener("click", (e) => {
		e.preventDefault();
		navigateTo("wishlist");
	});
	elements.darkModeToggle.addEventListener("click", toggleDarkMode);

	// Event delegation for dynamically added elements
	document.addEventListener("click", handleDocumentClick);
}

// Fetch products
async function fetchProducts() {
	try {
		state.products = await getProducts();
		state.dailyDeal = await getDailyDeal(state.products);
		renderPage(state.currentPage);
	} catch (error) {
		console.error("Error fetching products:", error);
		showNotification(
			"Failed to load products. Please try again later.",
			"error"
		);
	}
}

// Render products
function renderProducts(products = state.products) {
	const productGrid = document.createElement("div");
	productGrid.className =
		"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
	products.forEach((product) => {
		const productElement = createProductElement(product);
		productGrid.appendChild(productElement);
	});
	elements.pageContent.innerHTML = "";
	elements.pageContent.appendChild(productGrid);
}

// Create product element
function createProductElement(product) {
	const isInWishlist = state.wishlist.some((item) => item.id === product.id);
	const productElement = document.createElement("div");
	productElement.className =
		"bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 flex flex-col justify-between h-full";
	productElement.innerHTML = `
    <div>
      <img src="${product.image}" alt="${
		product.title
	}" class="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer" onclick="showProductDetails(${
		product.id
	})">
      <h3 class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-50">${
				product.title
			}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-2">${product.description.slice(
				0,
				100
			)}...</p>
    </div>
    <div>
      <div class="flex justify-between items-center mb-4">
        <span class="font-bold text-xl text-gray-800 dark:text-gray-50">$${product.price.toFixed(
					2
				)}</span>
        <div class="flex space-x-2">
          <button class="add-to-cart p-2 bg-blue-500 text-gray-50 rounded-full hover:bg-blue-600 transition duration-300" data-id="${
						product.id
					}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 004 0z" />
            </svg>
          </button>
          <button class="add-to-wishlist p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300" data-id="${
						product.id
					}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="${
							isInWishlist ? "currentColor" : "none"
						}" viewBox="0 0 24 24" stroke="currentColor" style="color: ${
		isInWishlist ? "red" : "currentColor"
	}">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
	return productElement;
}

// Show product details
function showProductDetails(productId) {
	const product = state.products.find((p) => p.id === productId);
	if (!product) return;

	state.breadcrumbs.push({
		name: product.title,
		path: `product/${product.id}`,
	});
	updateBreadcrumbs();

	const content = `
    <div class="flex flex-col md:flex-row bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <img src="${product.image}" alt="${
		product.title
	}" class="w-full md:w-1/2 h-64 md:h-auto object-cover">
      <div class="p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2 dark:text-gray-50">${
						product.title
					}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${
						product.description
					}</p>
          <p class="text-xl font-bold mb-4 dark:text-gray-50">$${product.price.toFixed(
						2
					)}</p>
          <div class="mb-4">
            <h3 class="font-semibold mb-2 dark:text-gray-50">Colors:</h3>
            <div class="flex space-x-2">
              ${product.colors
								.map(
									(color) => `
                <button class="w-8 h-8 rounded-full" style="background-color: ${color};" aria-label="${color}"></button>
              `
								)
								.join("")}
            </div>
          </div>
          <div class="mb-4">
            <h3 class="font-semibold mb-2 dark:text-gray-50">Sizes:</h3>
            <div class="flex flex-wrap gap-2">
              ${product.sizes
								.map(
									(size) => `
                <button class="px-3 py-1 border dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 dark:text-gray-50">${size}</button>
              `
								)
								.join("")}
            </div>
          </div>
        </div>
        <div class="mt-6">
          <button class="add-to-cart bg-blue-500 text-gray-50 px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300" data-id="${
						product.id
					}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

	elements.pageContent.innerHTML = content;
}

// Handle search
function handleSearch() {
	const searchTerm = elements.searchInput.value.toLowerCase();
	const filteredProducts = state.products.filter(
		(product) =>
			product.title.toLowerCase().includes(searchTerm) ||
			product.description.toLowerCase().includes(searchTerm)
	);
	renderProducts(filteredProducts);
}

// Toggle mobile menu
function toggleMobileMenu() {
	elements.mobileMenu.classList.toggle("hidden");
}

// Render cart
function renderCart() {
	const cartContent = `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Your Cart</h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      ${
				state.cart.length > 0
					? renderCartItems()
					: '<p class="text-gray-500 dark:text-gray-400">Your cart is empty.</p>'
			}
      ${
				state.cart.length > 0
					? `
        <div class="mt-6 flex justify-between items-center">
          <span class="text-xl font-bold dark:text-white">Total:</span>
          <span class="text-xl font-bold dark:text-white">$${calculateCartTotal(
						state.cart
					).toFixed(2)}</span>
        </div>
        <button onclick="handleCheckout()" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          Proceed to Checkout
        </button>
      `
					: ""
			}
    </div>
  `;
	elements.pageContent.innerHTML = cartContent;
}

// Render cart items
function renderCartItems() {
	return state.cart
		.map(
			(item) => `
    <div class="flex items-center justify-between mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <div class="flex items-center">
        <img src="${item.image}" alt="${
				item.title
			}" class="w-16 h-16 object-cover rounded-md mr-4">
        <div>
          <h3 class="font-semibold dark:text-white">${item.title}</h3>
          <p class="text-gray-600 dark:text-gray-300">Size: ${
						item.size || "N/A"
					}, Color: ${item.color || "N/A"}</p>
          <button class="edit-cart-item text-blue-500 hover:text-blue-700 text-sm mt-1" data-id="${
						item.id
					}">Edit</button>
        </div>
      </div>
      <div class="flex items-center">
        <div class="flex items-center mr-4">
          <button class="decrease-quantity bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-l-md" data-id="${
						item.id
					}">-</button>
          <span class="bg-white dark:bg-gray-800 px-3 py-1">${
						item.quantity
					}</span>
          <button class="increase-quantity bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-r-md" data-id="${
						item.id
					}">+</button>
        </div>
        <span class="font-bold mr-4 dark:text-white">$${(
					item.price * item.quantity
				).toFixed(2)}</span>
        <button class="remove-from-cart text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600" data-id="${
					item.id
				}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  `
		)
		.join("");
}

// Handle checkout
function handleCheckout() {
	navigateTo("checkout");
}

// Handle document click (event delegation)
function handleDocumentClick(event) {
	if (event.target.closest(".add-to-cart")) {
		const productId = event.target.closest(".add-to-cart").dataset.id;
		addToCart(state, productId);
		updateCartBadge();
		showNotification("Item added to cart", "success");
	} else if (event.target.closest(".add-to-wishlist")) {
		const productId = event.target.closest(".add-to-wishlist").dataset.id;
		const isInWishlist = state.wishlist.some(
			(item) => item.id.toString() === productId
		);
		if (isInWishlist) {
			removeFromWishlist(state, productId);
			showNotification("Item removed from wishlist", "info");
		} else {
			addToWishlist(state, productId);
			showNotification("Item added to wishlist", "success");
		}
		updateWishlistBadge();
		renderPage(state.currentPage);
	} else if (event.target.closest(".remove-from-cart")) {
		const productId = event.target.closest(".remove-from-cart").dataset.id;
		removeFromCart(state, productId);
		renderCart();
		updateCartBadge();
		showNotification("Item removed from cart", "info");
	} else if (event.target.closest(".increase-quantity")) {
		const productId = event.target.closest(".increase-quantity").dataset.id;
		increaseCartItemQuantity(state, productId);
		renderCart();
		updateCartBadge();
	} else if (event.target.closest(".decrease-quantity")) {
		const productId = event.target.closest(".decrease-quantity").dataset.id;
		decreaseCartItemQuantity(state, productId);
		renderCart();
		updateCartBadge();
	} else if (event.target.closest(".edit-cart-item")) {
		const productId = event.target.closest(".edit-cart-item").dataset.id;
		editCartItem(productId);
	}
}

// Update cart badge
function updateCartBadge() {
	const cartCount = state.cart.reduce(
		(total, item) => total + item.quantity,
		0
	);
	elements.cartCount.textContent = cartCount;
}

// Update wishlist badge
function updateWishlistBadge() {
	elements.wishlistCount.textContent = state.wishlist.length;
}

// Navigate to page
function navigateTo(page) {
	if (
		(page === "wishlist" || page === "cart" || page === "profile") &&
		state.currentPage === page
	) {
		state.currentPage = "home";
	} else {
		state.currentPage = page;
	}
	updateBreadcrumbs();
	renderPage(state.currentPage);
	if (!elements.mobileMenu.classList.contains("hidden")) {
		toggleMobileMenu();
	}
}

// Update breadcrumbs
function updateBreadcrumbs() {
	const breadcrumbs = [{ name: "Home", path: "home" }];
	if (state.currentPage !== "home") {
		breadcrumbs.push({
			name:
				state.currentPage.charAt(0).toUpperCase() + state.currentPage.slice(1),
			path: state.currentPage,
		});
	}

	elements.breadcrumbs.innerHTML = breadcrumbs
		.map((crumb, index) => {
			if (index === breadcrumbs.length - 1) {
				return `<span class="text-gray-500 dark:text-gray-400">${crumb.name}</span>`;
			}
			return `<a href="#" class="text-blue-500 dark:text-blue-400 hover:underline" data-path="${crumb.path}">${crumb.name}</a> / `;
		})
		.join("");

	elements.breadcrumbs.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.tagName === "A") {
			const path = e.target.dataset.path;
			navigateTo(path);
		}
	});
}

// Render page
async function renderPage(pageId) {
	try {
		let content = "";
		switch (pageId) {
			case "home":
				content = await renderHomePage();
				break;
			case "shop":
				content = await renderShopPage();
				break;
			case "wishlist":
				content = await renderWishlistPage();
				break;
			case "cart":
				content = renderCart();
				break;
			case "profile":
				content = renderProfilePage();
				break;
			case "about":
				content = renderAboutPage();
				break;
			case "contact":
				content = renderContactPage();
				break;
			case "checkout":
				content = renderCheckoutPage();
				break;
			default:
				content = "<p class='dark:text-white'>Page not found</p>";
		}
		elements.pageContent.innerHTML = content;
		if (pageId === "contact") {
			document
				.getElementById("contact-form")
				.addEventListener("submit", handleContactForm);
		}
		if (pageId === "checkout") {
			document
				.getElementById("checkout-form")
				.addEventListener("submit", handleCheckoutSubmit);
		}
	} catch (error) {
		console.error(`Error loading ${pageId} page:`, error);
		elements.pageContent.innerHTML = `<p class='text-red-500'>Failed to load ${pageId} page. Please try again later.</p>`;
	}
}

async function renderHomePage() {
	const featuredProducts = await getFeaturedProducts(4);
	const newArrivals = await getNewArrivals(4);
	const promotions = await getPromotions(4);

	return `
    <section id="hero" class="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-4 rounded-lg">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to KicksConfetti</h1>
        <p class="text-xl mb-8">Discover the latest trends in sneakers and sportswear</p>
        <a href="#featured-products" class="bg-white text-blue-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300">Shop Now</a>
      </div>
    </section>
    <section id="daily-deal" class="mb-12">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Daily Deals</h2>
      ${renderDailyDeals()}
    </section>
    <section id="featured-products" class="mb-12">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Featured Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${featuredProducts
					.map((product) => createProductElement(product).outerHTML)
					.join("")}
      </div>
    </section>
    <section id="new-arrivals" class="mb-12">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">New Arrivals</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${newArrivals
					.map((product) => createProductElement(product).outerHTML)
					.join("")}
      </div>
    </section>
    <section id="promotions" class="mb-12">
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Special Promotions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${promotions
					.map((product) => createProductElement(product).outerHTML)
					.join("")}
      </div>
    </section>
  `;
}

async function renderShopPage() {
	const allProducts = await getProducts();
	const displayedProducts = allProducts.slice(0, 6);

	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Shop All Products</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${displayedProducts
				.map((product) => createProductElement(product).outerHTML)
				.join("")}
    </div>
  `;
}

async function renderWishlistPage() {
	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Your Wishlist</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      ${
				state.wishlist.length > 0
					? state.wishlist
							.map((product) => createProductElement(product).outerHTML)
							.join("")
					: '<p class="text-gray-500 dark:text-gray-400">Your wishlist is empty.</p>'
			}
    </div>
  `;
}

function renderAboutPage() {
	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">About KicksConfetti</h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <p class="mb-4 dark:text-gray-300">KicksConfetti is your ultimate destination for premium sports merchandise. We offer a wide range of high-quality products including sneakers, jerseys, caps, socks, and more!</p>
      <p class="mb-4 dark:text-gray-300">Our mission is to provide sports enthusiasts with the best gear to support their favorite teams and athletes. We pride ourselves on our extensive selection, competitive prices, and exceptional customer service.</p>
      <p class="dark:text-gray-300">Founded in 2023, KicksConfetti has quickly become a go-to source for sports fans around the world. We're constantly updating our inventory to bring you the latest and greatest in sports fashion and equipment.</p>
    </div>
  `;
}

function renderContactPage() {
	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Contact Us</h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <p class="mb-4 dark:text-gray-300">We'd love to hear from you! Whether you have a question about a product, need help with an order, or just want to say hello, don't hesitate to reach out.</p>
      <form id="contact-form" class="space-y-4">
        <div>
          <label for="name" class="block mb-1 dark:text-white">Name</label>
          <input type="text" id="name" name="name" required class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>
        <div>
          <label for="email" class="block mb-1 dark:text-white">Email</label>
          <input type="email" id="email" name="email" required class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>
        <div>
          <label for="message" class="block mb-1 dark:text-white">Message</label>
          <textarea id="message" name="message" required rows="4" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Send Message</button>
      </form>
    </div>
  `;
}

function renderCheckoutPage() {
	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4 dark:text-white">Your Items</h2>
        ${state.cart
					.map(
						(item) => `
            <div class="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span class="font-medium dark:text-white">${item.title} (x${
							item.quantity
						})</span>
              <span class="font-bold dark:text-white">$${(
								item.price * item.quantity
							).toFixed(2)}</span>
            </div>
          `
					)
					.join("")}
        <div class="font-bold mt-4 text-xl dark:text-white">Total: $${calculateCartTotal(
					state.cart
				).toFixed(2)}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4 dark:text-white">Shipping Information</h2>
        <form id="checkout-form" class="space-y-4">
          <div>
            <label for="name" class="block mb-1 font-medium dark:text-white">Name</label>
            <input type="text" id="name" name="name" value="${
							state.user.name
						}" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>
          <div>
            <label for="email" class="block mb-1 font-medium dark:text-white">Email</label>
            <input type="email" id="email" name="email" value="${
							state.user.email
						}" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>
          <div>
            <label for="address" class="block mb-1 font-medium dark:text-white">Address</label>
            <textarea id="address" name="address" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${
							state.user.address
						}</textarea>
          </div>
          <div>
            <label for="phone" class="block mb-1 font-medium dark:text-white">Phone</label>
            <input type="tel" id="phone" name="phone" value="${
							state.user.phone
						}" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300 font-bold text-lg">Place Order</button>
        </form>
      </div>
    </div>
  `;
}

function renderDailyDeals() {
	const deals = [
		{ product: state.products[0], discountPercentage: 20 },
		{ product: state.products[1], discountPercentage: 15 },
		{ product: state.products[2], discountPercentage: 25 },
	];

	return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${deals
				.map(
					(deal) => `
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <h3 class="text-xl font-boldmb-4">${deal.product.title}</h3>
          <img src="${deal.product.image}" alt="${
						deal.product.title
					}" class="w-full h-48 object-cover rounded-lg mb-4">
          <p class="text-lg mb-2"><span class="line-through">$${deal.product.price.toFixed(
						2
					)}</span> <span class="font-bold text-yellow-300">$${(
						deal.product.price *
						(1 - deal.discountPercentage / 100)
					).toFixed(2)}</span></p>
          <p class="mb-4">Save ${deal.discountPercentage}%</p>
          <button class="add-to-cart bg-white text-blue-500 font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition duration-300" data-id="${
						deal.product.id
					}">Add to Cart</button>
        </div>
      `
				)
				.join("")}
    </div>
  `;
}

function renderProfilePage() {
	const isEditing = state.isEditingProfile;
	return `
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Your Profile</h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form id="profile-form" class="space-y-4">
        ${Object.entries(state.user)
					.map(([key, value]) => {
						if (key === "preferences") return "";
						return `
            <div>
              <label for="profile-${key}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">${
							key.charAt(0).toUpperCase() + key.slice(1)
						}</label>
              <input type="${
								key === "email"
									? "email"
									: key === "birthdate"
									? "date"
									: "text"
							}" 
                     id="profile-${key}" 
                     name="${key}" 
                     value="${value}" 
                     ${!isEditing ? "readonly" : ""}
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
          `;
					})
					.join("")}
        <div>
          <label for="profile-gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
          <select id="profile-gender" name="gender" ${
						!isEditing ? "disabled" : ""
					} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Prefer not to say</option>
            <option value="male" ${
							state.user.gender === "male" ? "selected" : ""
						}>Male</option>
            <option value="female" ${
							state.user.gender === "female" ? "selected" : ""
						}>Female</option>
            <option value="other" ${
							state.user.gender === "other" ? "selected" : ""
						}>Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
          <div id="preferences-container" class="flex flex-wrap gap-2 mt-2">
            ${state.user.preferences
							.map(
								(pref) => `
              <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                ${pref}
                ${
									isEditing
										? `<button type="button" class="ml-1 text-blue-800 dark:text-blue-300" onclick="removePreference('${pref}')">&times;</button>`
										: ""
								}
              </span>
            `
							)
							.join("")}
          </div>
          ${
						isEditing
							? `
            <div class="mt-2">
              <input type="text" id="new-preference" placeholder="Add new preference" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <button type="button" onclick="addPreference()" class="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300">Add</button>
            </div>
          `
							: ""
					}
        </div>
      </form>
      <div class="mt-6 flex justify-end space-x-4">
        ${
					isEditing
						? `
          <button onclick="saveProfileChanges()" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Save Changes</button>
          <button onclick="cancelProfileEdit()" class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
        `
						: `
          <button onclick="editProfile()" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Edit Profile</button>
        `
				}
      </div>
    </div>
  `;
}

function editProfile() {
	state.isEditingProfile = true;
	renderPage("profile");
}

function cancelProfileEdit() {
	state.isEditingProfile = false;
	renderPage("profile");
}

function saveProfileChanges() {
	const form = document.getElementById("profile-form");
	const formData = new FormData(form);

	for (const [key, value] of formData.entries()) {
		if (key !== "preferences") {
			state.user[key] = value;
		}
	}

	state.isEditingProfile = false;
	renderPage("profile");
	showNotification("Profile updated successfully", "success");
}

function addPreference() {
	const newPref = document.getElementById("new-preference").value.trim();
	if (newPref && !state.user.preferences.includes(newPref)) {
		state.user.preferences.push(newPref);
		renderPage("profile");
	}
}

function removePreference(pref) {
	state.user.preferences = state.user.preferences.filter((p) => p !== pref);
	renderPage("profile");
}

function toggleDarkMode() {
	document.documentElement.classList.toggle("dark");
	state.darkMode = !state.darkMode;
	localStorage.setItem("darkMode", state.darkMode);
	updateDarkModeButton();
}

function updateDarkModeButton() {
	const darkModeToggle = document.getElementById("dark-mode-toggle");
	if (state.darkMode) {
		darkModeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    `;
	} else {
		darkModeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    `;
	}
}

// Initialize the application
async function init() {
	setupEventListeners();
	await fetchProducts();
	updateCartBadge();
	updateWishlistBadge();
	await renderPage("home");
	updateFooterYear();

	// Check for saved dark mode preference
	const savedDarkMode = localStorage.getItem("darkMode");
	if (savedDarkMode === "true") {
		document.documentElement.classList.add("dark");
		state.darkMode = true;
	}
	updateDarkModeButton();
}

// Update footer year dynamically
function updateFooterYear() {
	elements.currentYear.textContent = new Date().getFullYear();
}

// Helper functions
function debounce(func, delay) {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
}

function showNotification(message, type = "info") {
	const notification = document.createElement("div");
	notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
		type === "error"
			? "bg-red-500"
			: type === "success"
			? "bg-green-500"
			: "bg-blue-500"
	} transition-opacity duration-300`;
	notification.textContent = message;
	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.opacity = "0";
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

function addToCart(state, productId) {
	const product = state.products.find((p) => p.id.toString() === productId);
	if (product) {
		const existingItem = state.cart.find((item) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity++;
		} else {
			state.cart.push({ ...product, quantity: 1 });
		}
		return true;
	}
	return false;
}

function removeFromCart(state, productId) {
	const index = state.cart.findIndex(
		(item) => item.id.toString() === productId
	);
	if (index !== -1) {
		state.cart.splice(index, 1);
		return true;
	}
	return false;
}

function increaseCartItemQuantity(state, productId) {
	const item = state.cart.find((item) => item.id.toString() === productId);
	if (item) {
		item.quantity++;
		return true;
	}
	return false;
}

function decreaseCartItemQuantity(state, productId) {
	const item = state.cart.find((item) => item.id.toString() === productId);
	if (item) {
		if (item.quantity > 1) {
			item.quantity--;
		} else {
			removeFromCart(state, productId);
		}
		return true;
	}
	return false;
}

function calculateCartTotal(cart) {
	return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function addToWishlist(state, productId) {
	const product = state.products.find((p) => p.id.toString() === productId);
	if (product && !state.wishlist.some((item) => item.id === product.id)) {
		state.wishlist.push(product);
		return true;
	}
	return false;
}

function removeFromWishlist(state, productId) {
	const index = state.wishlist.findIndex(
		(item) => item.id.toString() === productId
	);
	if (index !== -1) {
		state.wishlist.splice(index, 1);
		return true;
	}
	return false;
}

//Handle Contact Form Submission
async function handleContactForm(event) {
	event.preventDefault();
	//rest of the code for handling contact form submission
	const form = event.target;
	const formData = new FormData(form);
	//Process form data and send it to the server
	try {
		const response = await fetch("/submit-contact", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.success) {
			showNotification("Message sent successfully!", "success");
			form.reset();
		} else {
			showNotification(
				"Error sending message. Please try again later.",
				"error"
			);
		}
	} catch (error) {
		console.error("Error submitting contact form:", error);
		showNotification(
			"An unexpected error occurred. Please try again later.",
			"error"
		);
	}
}

//Handle Checkout Form Submission
async function handleCheckoutSubmit(event) {
	event.preventDefault();
	//rest of the code for handling checkout form submission
	const form = event.target;
	const formData = new FormData(form);
	//Process form data and send it to the server
	try {
		const response = await fetch("/submit-checkout", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (data.success) {
			showNotification("Order placed successfully!", "success");
			state.cart = []; //Clear the cart after successful checkout
			renderCart();
			updateCartBadge();
			navigateTo("home");
		} else {
			showNotification("Error placing order. Please try again later.", "error");
		}
	} catch (error) {
		console.error("Error submitting checkout form:", error);
		showNotification(
			"An unexpected error occurred. Please try again later.",
			"error"
		);
	}
}

// Run the initialization
init();

function editCartItem(productId) {
	const item = state.cart.find((item) => item.id.toString() === productId);
	if (!item) return;

	const product = state.products.find((p) => p.id === item.id);
	if (!product) return;

	const editForm = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 dark:text-white">Edit Item</h2>
        <form id="edit-cart-item-form" class="space-y-4">
          <div>
            <label for="edit-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <select id="edit-size" name="size" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              ${product.sizes
								.map(
									(size) =>
										`<option value="${size}" ${
											item.size === size ? "selected" : ""
										}>${size}</option>`
								)
								.join("")}
            </select>
          </div>
          <div>
            <label for="edit-color" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <select id="edit-color" name="color" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              ${product.colors
								.map(
									(color) =>
										`<option value="${color}" ${
											item.color === color ? "selected" : ""
										}>${color}</option>`
								)
								.join("")}
            </select>
          </div>
          <div>
            <label for="edit-quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <input type="number" id="edit-quantity" name="quantity" value="${
							item.quantity
						}" min="1" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" onclick="closeEditForm()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

	document.body.insertAdjacentHTML("beforeend", editForm);

	document
		.getElementById("edit-cart-item-form")
		.addEventListener("submit", (e) => {
			e.preventDefault();
			const formData = new FormData(e.target);
			updateCartItem(productId, {
				size: formData.get("size"),
				color: formData.get("color"),
				quantity: Number.parseInt(formData.get("quantity"), 10),
			});
			closeEditForm();
			renderCart();
			updateCartBadge();
		});
}

function closeEditForm() {
	const editForm = document
		.querySelector("#edit-cart-item-form")
		.closest("div.fixed");
	if (editForm) {
		editForm.remove();
	}
}

function updateCartItem(productId, updates) {
	const itemIndex = state.cart.findIndex(
		(item) => item.id.toString() === productId
	);
	if (itemIndex !== -1) {
		state.cart[itemIndex] = { ...state.cart[itemIndex], ...updates };
	}
}
