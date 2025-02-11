import { sampleProducts } from "./products.js";

let products = [...sampleProducts];

export async function getProducts() {
	if (products.length === 0) {
		// Simulating API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		products = [...sampleProducts];
	}
	return products;
}

export async function getFeaturedProducts(count = 4) {
	const allProducts = await getProducts();
	return allProducts.sort((a, b) => b.rating - a.rating).slice(0, count);
}

export async function getNewArrivals(count = 4) {
	const allProducts = await getProducts();
	return allProducts
		.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
		.slice(0, count);
}

export async function getRecommendedProducts(preferences, count = 4) {
	const allProducts = await getProducts();
	return allProducts
		.filter((product) =>
			preferences.some(
				(pref) => product.category === pref || product.brand === pref
			)
		)
		.sort(() => Math.random() - 0.5)
		.slice(0, count);
}

export async function getPromotions(count = 4) {
	const allProducts = await getProducts();
	return allProducts
		.filter((product) => product.onSale)
		.sort(() => Math.random() - 0.5)
		.slice(0, count);
}

export async function getDailyDeal() {
	const allProducts = await getProducts();
	const eligibleProducts = allProducts.filter((product) => !product.onSale);
	if (eligibleProducts.length === 0) return null;

	const randomProduct =
		eligibleProducts[Math.floor(Math.random() * eligibleProducts.length)];
	const discountPercentage = Math.floor(Math.random() * (30 - 10 + 1) + 10); // Random discount between 10% and 30%

	return {
		product: randomProduct,
		discountPercentage: discountPercentage,
	};
}
