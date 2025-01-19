// app.js

// Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope
(function () {
	"use strict";

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
		},
		currentPage: "home",
		purchaseHistory: [],
		// dealOfTheDay: null,
	};

	// DOM Elements
	const elements = {
		pageContent: document.getElementById("page-content"),
		searchInput: document.getElementById("search-input"),
		wishlistBtn: document.getElementById("wishlist-btn"),
		cartBtn: document.getElementById("cart-btn"),
		profileBtn: document.getElementById("profile-btn"),
		cartModal: document.getElementById("cart-modal"),
		profileModal: document.getElementById("profile-modal"),
		genericModal: document.getElementById("generic-modal"),
		closeCart: document.getElementById("close-cart"),
		closeProfile: document.getElementById("close-profile"),
		closeGenericModal: document.getElementById("close-generic-modal"),
		cartItems: document.getElementById("cart-items"),
		cartTotal: document.getElementById("cart-total"),
		checkoutBtn: document.getElementById("checkout-btn"),
		profileInfo: document.getElementById("profile-info"),
		purchaseHistoryList: document.getElementById("purchase-history-list"),
		suggestionForm: document.getElementById("suggestion-form"),
		newsletterForm: document.getElementById("newsletter-form"),
		mainContent: document.getElementById("main-content"),
		shopNowBtn: document.getElementById("shop-now-btn"),
		homeLink: document.getElementById("home-link"),
		shopLink: document.getElementById("shop-link"),
		aboutLink: document.getElementById("about-link"),
		contactLink: document.getElementById("contact-link"),
		wishlistCount: document.getElementById("wishlist-count"),
		cartCount: document.getElementById("cart-count"),
		mobileMenuButton: document.getElementById("mobile-menu-button"),
		mobileMenu: document.getElementById("mobile-menu"),
		profileForm: document.getElementById("profile-form"),
		currentYear: document.getElementById("current-year"),
		// dealOfTheDay: document.getElementById("deal-of-the-day"),
		checkoutSummary: document.getElementById("checkout-summary"),
	};

	// Event Listeners
	function setupEventListeners() {
		elements.searchInput.addEventListener("input", debounce(handleSearch, 300));
		elements.cartBtn.addEventListener("click", toggleCartModal);
		elements.profileBtn.addEventListener("click", toggleProfileModal);
		elements.closeCart.addEventListener("click", toggleCartModal);
		elements.closeProfile.addEventListener("click", toggleProfileModal);
		elements.closeGenericModal.addEventListener("click", toggleGenericModal);
		elements.checkoutBtn.addEventListener("click", handleCheckout);
		elements.shopNowBtn.addEventListener("click", () => navigateTo("shop"));
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
		elements.profileForm.addEventListener("submit", handleProfileUpdate);
		elements.wishlistBtn.addEventListener("click", (e) => {
			e.preventDefault();
			navigateTo("wishlist");
		});
		elements.checkoutBtn.addEventListener("mouseover", showCheckoutSummary);
		elements.checkoutBtn.addEventListener("mouseout", hideCheckoutSummary);

		// Event delegation for dynamically added elements
		document.addEventListener("click", handleDocumentClick);
	}

	// Fetch products from API
	async function fetchProducts() {
		try {
			// Simulating API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			state.products = sampleProducts;
			renderProducts(state.products);
			// setupDealOfTheDay();
		} catch (error) {
			console.error("Error fetching products:", error);
			showNotification(
				"Failed to load products. Please try again later.",
				"error"
			);
		}
	}

	// // Setup Deal of the Day
	// function setupDealOfTheDay() {
	// 	const randomProduct =
	// 		state.products[Math.floor(Math.random() * state.products.length)];
	// 	const discountPercentage = 20;
	// 	const discountedPrice =
	// 		randomProduct.price * (1 - discountPercentage / 100);
	// 	state.dealOfTheDay = {
	// 		...randomProduct,
	// 		discountedPrice: discountedPrice.toFixed(2),
	// 		originalPrice: randomProduct.price,
	// 		endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
	// 	};
	// 	renderDealOfTheDay();
	// }

	// // Render Deal of the Day
	// function renderDealOfTheDay() {
	// 	const deal = state.dealOfTheDay;
	// 	const timeLeft = getTimeLeft(deal.endTime);
	// 	elements.dealOfTheDay.innerHTML = `
	// 				<h2>Deal of the Day</h2>
	// 				<img src="${deal.image}" alt="${deal.title}" />
	// 				<h3>${deal.title}</h3>
	// 				<p>Price: <span class="discounted-price">$${deal.discountedPrice}</span> <span class="original-price">$${deal.originalPrice}</span></p>
	// 				<p>Time left: ${timeLeft}</p>
	// 				<button class="add-to-cart" data-id="${deal.id}">Add to Cart</button>
	// 		`;
	// 	setTimeout(renderDealOfTheDay, 1000); // Update every second
	// }

	// // Get time left for deal
	// function getTimeLeft(endTime) {
	// 	const total = Date.parse(endTime) - Date.parse(new Date());
	// 	const seconds = Math.floor((total / 1000) % 60);
	// 	const minutes = Math.floor((total / 1000 / 60) % 60);
	// 	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	// 	return `${hours}h ${minutes}m ${seconds}s`;
	// }

	// Render products
	function renderProducts(products) {
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
		const productElement = document.createElement("div");
		productElement.className =
			"bg-background-offset rounded-lg p-4 hover:shadow-md transition duration-300";
		productElement.innerHTML = `
					<img src="${product.image}" alt="${
			product.title
		}" class="w-full h-48 object-cover rounded-lg mb-4">
					<h3 class="font-semibold mb-2">${product.title}</h3>
					<p class="text-text-offset mb-2">${product.description.slice(0, 100)}...</p>
					<div class="flex justify-between items-center">
							<span class="font-bold">$${product.price.toFixed(2)}</span>
							<div>
									<button class="add-to-cart mr-2" data-id="${product.id}">
											<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 004 0z"></path></svg>
									</button>
									<button class="add-to-wishlist" data-id="${product.id}">
											<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
									</button>
							</div>
					</div>
			`;
		productElement
			.querySelector("img")
			.addEventListener("click", () => showProductDetails(product));
		return productElement;
	}

	// Show product details
	function showProductDetails(product) {
		const similarProducts = state.products
			.filter((p) => p.category === product.category && p.id !== product.id)
			.slice(0, 4);
		elements.genericModal.innerHTML = `
					<h2>${product.title}</h2>
					<img src="${product.image}" alt="${product.title}" />
					<p>${product.description}</p>
					<p>Price: $${product.price.toFixed(2)}</p>
					<div>
							<h3>Colors:</h3>
							${product.colors
								.map(
									(color) =>
										`<button style="background-color: ${color};">${color}</button>`
								)
								.join("")}
					</div>
					<div>
							<h3>Sizes:</h3>
							${product.sizes.map((size) => `<button>${size}</button>`).join("")}
					</div>
					<div>
							<h3>Reviews:</h3>
							<p>Rating: ${product.rating} (${product.reviews} reviews)</p>
					</div>
					<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
					<button class="add-to-wishlist" data-id="${product.id}">Add to Wishlist</button>
					<div>
							<h3>You May Also Like:</h3>
							${similarProducts
								.map(
									(p) => `
									<div>
											<img src="${p.image}" alt="${p.title}" />
											<p>${p.title}</p>
											<p>$${p.price.toFixed(2)}</p>
									</div>
							`
								)
								.join("")}
					</div>
			`;
		toggleGenericModal();
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

	// Toggle modal
	function toggleModal(modal) {
		modal.classList.toggle("hidden");
		document.body.classList.toggle("overflow-hidden");
	}

	// Toggle cart modal
	function toggleCartModal() {
		toggleModal(elements.cartModal);
		if (!elements.cartModal.classList.contains("hidden")) {
			renderCart();
		}
	}

	// Toggle profile modal
	function toggleProfileModal() {
		toggleModal(elements.profileModal);
		if (!elements.profileModal.classList.contains("hidden")) {
			renderProfile();
		}
	}

	// Toggle generic modal
	function toggleGenericModal() {
		toggleModal(elements.genericModal);
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		elements.mobileMenu.classList.toggle("hidden");
	}

	// Render cart
	function renderCart() {
		elements.cartItems.innerHTML = state.cart
			.map(
				(item) => `
					<div class="flex items-center justify-between">
							<span>${item.title} (${item.quantity})</span>
							<div>
									<span>$${(item.price * item.quantity).toFixed(2)}</span>
									<button class="remove-from-cart ml-2 text-red-500 hover:text-red-700" data-id="${
										item.id
									}">Remove</button>
							</div>
					</div>
			`
			)
			.join("");
		elements.cartTotal.textContent = `$${calculateCartTotal().toFixed(2)}`;
	}

	// Render profile
	function renderProfile() {
		if (state.user) {
			elements.profileForm.elements["name"].value = state.user.name;
			elements.profileForm.elements["email"].value = state.user.email;
			elements.profileForm.elements["phone"].value = state.user.phone;
			elements.profileForm.elements["address"].value = state.user.address;
		}
		renderPurchaseHistory();
	}

	// Render purchase history
	function renderPurchaseHistory() {
		elements.purchaseHistoryList.innerHTML = state.purchaseHistory
			.map(
				(purchase) => `
					<li class="border-b border-border pb-2">
							<p><strong>Date:</strong> ${new Date(purchase.date).toLocaleDateString()}</p>
							<p><strong>Total:</strong> $${purchase.total.toFixed(2)}</p>
							<ul class="ml-4">
									${purchase.items
										.map(
											(item) => `
											<li>${item.title} (${item.quantity}) - $${(item.price * item.quantity).toFixed(
												2
											)}</li>
									`
										)
										.join("")}
							</ul>
							<button class="repurchase-btn mt-2 bg-secondary text-white py-1 px-3 rounded-full hover:bg-secondary-hover transition duration-300" data-purchase-id="${
								purchase.id
							}">Repurchase</button>
					</li>
			`
			)
			.join("");
	}

	// Calculate cart total
	function calculateCartTotal() {
		return state.cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	}

	// Handle checkout
	function handleCheckout() {
		navigateTo("checkout");
	}

	// Show checkout summary
	function showCheckoutSummary() {
		elements.checkoutSummary.innerHTML = `
					<h3>Checkout Summary</h3>
					<p>Total Items: ${state.cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
					<p>Total Price: $${calculateCartTotal().toFixed(2)}</p>
			`;
		elements.checkoutSummary.classList.remove("hidden");
	}

	// Hide checkout summary
	function hideCheckoutSummary() {
		elements.checkoutSummary.classList.add("hidden");
	}

	// Handle profile update
	function handleProfileUpdate(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		state.user = {
			name: formData.get("name"),
			email: formData.get("email"),
			phone: formData.get("phone"),
			address: formData.get("address"),
		};
		renderProfile();
		showNotification("Profile updated successfully", "success");
	}

	// Handle document click (event delegation)
	function handleDocumentClick(event) {
		if (event.target.classList.contains("add-to-cart")) {
			addToCart(event.target.dataset.id);
		} else if (event.target.classList.contains("add-to-wishlist")) {
			addToWishlist(event.target.dataset.id);
		} else if (event.target.classList.contains("remove-from-cart")) {
			removeFromCart(event.target.dataset.id);
		} else if (event.target.classList.contains("repurchase-btn")) {
			repurchase(event.target.dataset.purchaseId);
		}
	}

	// Add to cart
	function addToCart(productId) {
		const product = state.products.find((p) => p.id.toString() === productId);
		if (product) {
			const existingItem = state.cart.find((item) => item.id === product.id);
			if (existingItem) {
				existingItem.quantity++;
			} else {
				state.cart.push({ ...product, quantity: 1 });
			}
			showNotification(`${product.title} added to cart`, "success");
			updateCartBadge();
		}
	}

	// Remove from cart
	function removeFromCart(productId) {
		const index = state.cart.findIndex(
			(item) => item.id.toString() === productId
		);
		if (index !== -1) {
			state.cart.splice(index, 1);
			renderCart();
			updateCartBadge();
			showNotification("Item removed from cart", "info");
		}
	}

	// Add to wishlist
	function addToWishlist(productId) {
		const product = state.products.find((p) => p.id.toString() === productId);
		if (product && !state.wishlist.some((item) => item.id === product.id)) {
			state.wishlist.push(product);
			showNotification(`${product.title} added to wishlist`, "success");
			updateWishlistBadge();
		}
	}

	// Repurchase
	function repurchase(purchaseId) {
		const purchase = state.purchaseHistory.find(
			(p) => p.id.toString() === purchaseId
		);
		if (purchase) {
			purchase.items.forEach((item) => {
				addToCart(item.id);
			});
			showNotification(
				"Items added to cart. You can modify quantities before checkout.",
				"success"
			);
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

	// Show notification
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

	// Debounce function
	function debounce(func, delay) {
		let timeoutId;
		return function (...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(this, args), delay);
		};
	}

	// Navigate to page
	function navigateTo(page) {
		state.currentPage = page;
		renderPage(page);
		if (!elements.mobileMenu.classList.contains("hidden")) {
			toggleMobileMenu();
		}
	}

	// Render page
	async function renderPage(pageId) {
		try {
			let content = "";
			switch (pageId) {
				case "home":
					content = `
											<section id="featured-products" class="mb-12">
													<h2 class="text-2xl font-bold mb-6">Featured Products</h2>
													<div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
															<!-- Product cards will be inserted here by JavaScript -->
													</div>
											</section>
									`;
					break;
				case "shop":
					content = `
											<h1 class="text-3xl font-bold mb-6">Shop All Products</h1>
											<div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
													<!-- Product cards will be inserted here by JavaScript -->
											</div>
									`;
					break;
				case "wishlist":
					content = `
											<h1 class="text-3xl font-bold mb-6">Your Wishlist</h1>
											<div id="wishlist-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
													${state.wishlist
														.map(
															(product) =>
																createProductElement(product).outerHTML
														)
														.join("")}
											</div>
									`;
					break;
				case "checkout":
					content = `
											<h1 class="text-3xl font-bold mb-6">Checkout</h1>
											<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
													<div>
															<h2 class="text-2xl font-semibold mb-4">Your Items</h2>
															${state.cart
																.map(
																	(item) => `
																	<div class="flex justify-between items-center mb-2">
																			<span>${item.title} (x${item.quantity})</span>
																			<span>$${(item.price * item.quantity).toFixed(2)}</span>
																	</div>
															`
																)
																.join("")}
															<div class="font-bold mt-4">Total: $${calculateCartTotal().toFixed(2)}</div>
													</div>
													<div>
															<h2 class="text-2xl font-semibold mb-4">Shipping Information</h2>
															<form id="checkout-form" class="space-y-4">
																	<div>
																			<label for="name" class="block mb-1">Name</label>
																			<input type="text" id="name" name="name" required class="w-full p-2 border rounded">
																	</div>
																	<div>
																			<label for="email" class="block mb-1">Email</label>
																			<input type="email" id="email" name="email" required class="w-full p-2 border rounded">
																	</div>
																	<div>
																			<label for="address" class="block mb-1">Address</label>
																			<textarea id="address" name="address" required class="w-full p-2 border rounded"></textarea>
																	</div>
																	<button type="submit" class="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover">Place Order</button>
															</form>
													</div>
											</div>
									`;
					break;
				case "about":
					content = `
											<h1 class="text-3xl font-bold mb-6">About KicksConfetti</h1>
											<p class="mb-4">KicksConfetti is your ultimate destination for premium sports merchandise. We offer a wide range of high-quality products including sneakers, jerseys, caps, socks, and more!</p>
											<p class="mb-4">Our mission is to provide sports enthusiasts with the best gear to support their favorite teams and athletes. We pride ourselves on our extensive selection, competitive prices, and exceptional customer service.</p>
											<p>Founded in 2023, KicksConfetti has quickly become a go-to source for sports fans around the world. We're constantly updating our inventory to bring you the latest and greatest in sports fashion and equipment.</p>
									`;
					break;
				case "contact":
					content = `
											<h1 class="text-3xl font-bold mb-6">Contact Us</h1>
											<p class="mb-4">We'd love to hear from you! Whether you have a question about a product, need help with an order, or just want to say hello, don't hesitate to reach out.</p>
											<form id="contact-form" class="space-y-4">
													<div>
															<label for="name" class="block mb-1">Name</label>
															<input type="text" id="name" name="name" required class="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
													</div>
													<div>
															<label for="email" class="block mb-1">Email</label>
															<input type="email" id="email" name="email" required class="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
													</div>
													<div>
															<label for="message" class="block mb-1">Message</label>
															<textarea id="message" name="message" required rows="4" class="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
													</div>
													<button type="submit" class="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition duration-300">Send Message</button>
											</form>
									`;
					break;
				default:
					content = "<p>Page not found</p>";
			}
			elements.pageContent.innerHTML = content;
			if (pageId === "home" || pageId === "shop") {
				renderProducts(state.products);
			}
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
			showNotification(
				`Failed to load ${pageId} page. Please try again later.`,
				"error"
			);
		}
	}

	// Handle contact form submission
	async function handleContactForm(event) {
		event.preventDefault();
		const name = event.target.elements["name"].value;
		const email = event.target.elements["email"].value;
		const message = event.target.elements["message"].value;

		try {
			// Simulating API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			showNotification(
				"Thank you for your message! We'll get back to you soon.",
				"success"
			);
			event.target.reset();
		} catch (error) {
			console.error("Error submitting contact form:", error);
			showNotification(
				"Failed to send your message. Please try again later.",
				"error"
			);
		}
	}

	// Handle checkout form submission
	async function handleCheckoutSubmit(event) {
		event.preventDefault();
		const name = event.target.elements["name"].value;
		const email = event.target.elements["email"].value;
		const address = event.target.elements["address"].value;

		try {
			// Simulating API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const purchase = {
				id: Date.now(),
				date: new Date(),
				total: calculateCartTotal(),
				items: [...state.cart],
			};

			state.purchaseHistory.push(purchase);
			state.cart = [];
			updateCartBadge();
			showNotification(
				"Thank you for your purchase! Check your email for order details.",
				"success"
			);
			navigateTo("home");
		} catch (error) {
			console.error("Error processing checkout:", error);
			showNotification(
				"Failed to process your order. Please try again later.",
				"error"
			);
		}
	}

	// Initialize the application
	async function init() {
		setupEventListeners();
		await fetchProducts();
		updateCartBadge();
		updateWishlistBadge();
		renderPage("home");
		updateFooterYear();
	}

	// Update footer year dynamically
	function updateFooterYear() {
		elements.currentYear.textContent = new Date().getFullYear();
	}

	// Run the initialization
	init();
})();

// Sample products data
const sampleProducts = [
	{
		id: 1,
		title: "Asics Gel-Nimbus 23",
		price: 150,
		image: "https://via.placeholder.com/300x300?text=Asics+Gel-Nimbus+23",
		description: "Premium running shoes with excellent cushioning.",
		category: "sneakers",
	},
	{
		id: 2,
		title: "Asics GT-2000 9",
		price: 120,
		image: "https://via.placeholder.com/300x300?text=Asics+GT-2000+9",
		description: "Stable and comfortable running shoes for daily training.",
		category: "sneakers",
	},
	{
		id: 3,
		title: "Nike Air Zoom Pegasus 38",
		price: 120,
		image: "https://via.placeholder.com/300x300?text=Nike+Air+Zoom+Pegasus+38",
		description: "Versatile running shoes with responsive cushioning.",
		category: "sneakers",
	},
	{
		id: 4,
		title: "Nike React Infinity Run Flyknit 2",
		price: 160,
		image: "https://via.placeholder.com/300x300?text=Nike+React+Infinity+Run+2",
		description: "Designed to help reduce injury with a smooth ride.",
		category: "sneakers",
	},
	{
		id: 5,
		title: "Adidas Ultraboost 21",
		price: 180,
		image: "https://via.placeholder.com/300x300?text=Adidas+Ultraboost+21",
		description: "High-performance running shoes with energy return.",
		category: "sneakers",
	},
	{
		id: 6,
		title: "Adidas Supernova",
		price: 100,
		image: "https://via.placeholder.com/300x300?text=Adidas+Supernova",
		description: "Comfortable and responsive shoes for long runs.",
		category: "sneakers",
	},
	{
		id: 7,
		title: "Liverpool Home Jersey 21/22",
		price: 90,
		image: "https://via.placeholder.com/300x300?text=Liverpool+Home+Jersey",
		description: "Official Liverpool FC home jersey for the 21/22 season.",
		category: "jerseys",
	},
	{
		id: 8,
		title: "Liverpool Away Jersey 21/22",
		price: 90,
		image: "https://via.placeholder.com/300x300?text=Liverpool+Away+Jersey",
		description: "Official Liverpool FC away jersey for the 21/22 season.",
		category: "jerseys",
	},
	{
		id: 9,
		title: "Yeezy Boost 350 V2",
		price: 220,
		image: "https://via.placeholder.com/300x300?text=Yeezy+Boost+350+V2",
		description: "Iconic Yeezy design with Boost technology.",
		category: "sneakers",
	},
	{
		id: 10,
		title: "Yeezy Foam Runner",
		price: 80,
		image: "https://via.placeholder.com/300x300?text=Yeezy+Foam+Runner",
		description: "Unique and futuristic Yeezy design.",
		category: "sneakers",
	},
	{
		id: 11,
		title: "Nike Mercurial Vapor 14 Elite",
		price: 250,
		image: "https://via.placeholder.com/300x300?text=Nike+Mercurial+Vapor+14",
		description: "High-end soccer cleats for speed and agility.",
		category: "sneakers",
	},
	{
		id: 12,
		title: "Adidas Predator Freak.1",
		price: 280,
		image: "https://via.placeholder.com/300x300?text=Adidas+Predator+Freak.1",
		description: "Advanced soccer cleats for ultimate control.",
		category: "sneakers",
	},
	{
		id: 13,
		title: "Asics Gel-Kayano 28",
		price: 160,
		image: "https://via.placeholder.com/300x300?text=Asics+Gel-Kayano+28",
		description: "Premium stability running shoes for overpronators.",
		category: "sneakers",
	},
	{
		id: 14,
		title: "Nike Phantom GT Elite",
		price: 250,
		image: "https://via.placeholder.com/300x300?text=Nike+Phantom+GT+Elite",
		description: "Top-tier soccer cleats for precise touch and control.",
		category: "sneakers",
	},
	{
		id: 15,
		title: "Adidas X Speedflow.1",
		price: 250,
		image: "https://via.placeholder.com/300x300?text=Adidas+X+Speedflow.1",
		description: "Lightweight soccer cleats designed for speed.",
		category: "sneakers",
	},
	{
		id: 16,
		title: "Liverpool Third Jersey 21/22",
		price: 90,
		image: "https://via.placeholder.com/300x300?text=Liverpool+Third+Jersey",
		description: "Official Liverpool FC third jersey for the 21/22 season.",
		category: "jerseys",
	},
	{
		id: 17,
		title: "Yeezy 700 V3",
		price: 200,
		image: "https://via.placeholder.com/300x300?text=Yeezy+700+V3",
		description: "Futuristic Yeezy design with unique aesthetics.",
		category: "sneakers",
	},
	{
		id: 18,
		title: "Nike Air Max 90",
		price: 120,
		image: "https://via.placeholder.com/300x300?text=Nike+Air+Max+90",
		description: "Classic Nike sneakers with timeless style.",
		category: "sneakers",
	},
	{
		id: 19,
		title: "Adidas Stan Smith",
		price: 80,
		image: "https://via.placeholder.com/300x300?text=Adidas+Stan+Smith",
		description: "Iconic tennis-inspired sneakers for everyday wear.",
		category: "sneakers",
	},
	{
		id: 20,
		title: "Asics Gel-Cumulus 23",
		price: 120,
		image: "https://via.placeholder.com/300x300?text=Asics+Gel-Cumulus+23",
		description: "Comfortable neutral running shoes for daily use.",
		category: "sneakers",
	},
];
