<template>
	<div class="bg-white">
		<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
			<h2 class="text-2xl font-bold tracking-tight text-gray-900">年輕麥肯</h2>

			<div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				<div v-for="product in products" :key="product.id" class="group relative cursor-pointer"
				     @click="addToCart(product.id)">
					<div
						class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
						<img :src="product.imageSrc"
						     class="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
					</div>
					<div class="mt-4 flex justify-between">
						<div>
							<h3 class="text-sm text-gray-700">
								<a>
									<span aria-hidden="true" class="absolute inset-0"/>
									{{ product.name }}
								</a>
							</h3>
						</div>
						<p class="text-sm font-medium text-gray-900">NTD${{ product.price }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<nav class="fixed h-20 border-t bg-gray-50 left-0 right-0 bottom-0 flex items-center justify-end px-4">
		<RouterLink class="flex items-center cursor-pointer" to="/history">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			     stroke="currentColor" class="w-10 h-10 text-blue-500 ">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
		</RouterLink>

		<RouterLink class="flex items-center relative w-10" to="/cart">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			     stroke="currentColor" class="absolute w-10 h-10 text-blue-500 left-0">
				<path stroke-linecap="round" stroke-linejoin="round"
				      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
			</svg>
			<div class="absolute left-0  right-0 top-[-4px] text-sm flex items-center justify-center">
				{{ cart.length }}
			</div>
		</RouterLink>
	</nav>
</template>
<script>
import products from '@/assets/items.js'

export default {
	data() {
		return {
			products: products,
			cart: []
		}
	},
	methods: {
		addToCart(product) {
			if (this.cart.find(item => item.id === product)) {
				this.cart.find(item => item.id === product).quantity++
			} else {
				this.cart.push({
					id: product,
					quantity: 1
				})
			}
		}
	},
	beforeUnmount() {
		localStorage.setItem('cart', JSON.stringify(this.cart))
	}
}
</script>