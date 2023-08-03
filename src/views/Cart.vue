<template>
	<div class="bg-white">
		<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">購物車</h1>
			<form class="mt-12" @submit.prevent="submit">
				<div>
					<ul role="list" class="divide-y divide-gray-200 border-b border-t border-gray-200">
						<li v-for="(product, productIdx) in products" :key="product.id" class="flex py-6 sm:py-10">
							<div class="flex-shrink-0">
								<img :src="product.imageSrc"
								     class="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"/>
							</div>

							<div class="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
								<div>
									<div class="flex justify-between sm:grid sm:grid-cols-2">
										<div class="pr-6">
											<h3 class="text-sm">
												<a :href="product.href"
												   class="font-medium text-gray-700 hover:text-gray-800">{{
														product.name
													}}</a>
											</h3>
										</div>

										<p class="text-right text-sm font-medium text-gray-900">NTD${{
												product.price
											}}</p>
									</div>

									<div
										class="mt-4 flex items-center sm:absolute sm:left-1/2 sm:top-0 sm:mt-0 sm:block">
										<label :for="`quantity-${productIdx}`" class="sr-only">Quantity, {{
												product.name
											}}</label>
										<select :id="`quantity-${productIdx}`" :name="`quantity-${productIdx}`"
										        v-model="product.quantity"
										        class="block max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
											<option
												v-for="(quantity, i) in (new Array(Number(product.quantity)+3).fill())"
												:key="product.id+String(i)">
												{{ i + 1 }}
											</option>
										</select>

										<button type="button"
										        :id="`remove-${productIdx}`"
										        @click="removeCart(product.id)"
										        class="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3">
											<span>刪除</span>
										</button>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>

				<div class="pt-8 sm:ml-32 sm:pl-6">
					<label for="coupon" class="block text-sm font-medium leading-6 text-gray-900">
						有優惠卷？
					</label>
					<div class="mt-2 flex rounded-md shadow-sm">
						<div class="relative flex flex-grow items-stretch focus-within:z-10">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<TagIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
							</div>
							<input type="text" name="coupon" id="coupon" v-model="coupon"
							       class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							       placeholder="優惠卷代碼 （YMK 開頭）"/>
						</div>
						<button type="button"
						        @click="applyCoupon"
						        class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
							使用
						</button>
					</div>
					<span v-if="icoupon && coupon_result">
						✅ 優惠卷可使用： {{ icoupon.coupon.message }}
					</span>
					<span v-else>
					{{ message }}
					</span>
				</div>

				<!-- Order summary -->
				<div class="mt-10 sm:ml-32 sm:pl-6">
					<div class="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
						<h2 class="sr-only">Order summary</h2>

						<div class="flow-root">
							<dl class="-my-4 divide-y divide-gray-200 text-sm">
								<div class="flex items-center justify-between py-4">
									<dt class="text-gray-600">小計</dt>
									<dd class="font-medium text-gray-900">NTD$ {{ subtotal }}</dd>
								</div>
								<div class="flex items-center justify-between py-4">
									<dt class="text-gray-600">運費</dt>
									<dd class="font-bold text-red-500 line-through" v-if="shipping === 0">免運
										NTD$ {{ shipping }}
									</dd>
									<dd class="font-medium text-gray-900" v-else>NTD$ {{ shipping }}</dd>
								</div>
								<div class="flex items-center justify-between py-4">
									<dt class="text-gray-600">優惠卷</dt>
									<dd class="font-bold text-red-500" v-if="coupon_result">- NTD$ {{
											coupon_discount
										}}
									</dd>
									<dd class="font-medium text-gray-900" v-else>無</dd>
								</div>
								<div class="flex items-center justify-between py-4">
									<dt class="text-gray-600">5% 營業稅</dt>
									<dd class="font-medium text-gray-900">NTD$ {{ tax }}</dd>
								</div>
								<div class="flex items-center justify-between py-4">
									<dt class="text-base font-medium text-gray-900">總價</dt>
									<dd class="text-base font-medium text-gray-900">NTD$ {{ total }}</dd>
								</div>
							</dl>
						</div>
					</div>
					<div class="mt-10">
						<button type="submit"
						        class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
							送出訂單
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import {TagIcon} from '@heroicons/vue/20/solid'
import products_list from '@/assets/items'
import {computed, onMounted, ref} from "vue";
import Coupon, {COUPON_TYPE} from "@/views/Coupon";
import Swal from 'sweetalert2'
import router from "@/router";

const products = ref([])
const coupon = ref('')

const removeCart = (id) => {
	products.value = products.value.filter(product => product.id !== id)
	localStorage.setItem('cart', JSON.stringify(products.value))
}

const icoupon = ref(null)
const message = ref('')

const applyCoupon = () => {
	try {
		icoupon.value = new Coupon(coupon.value)
	} catch (e) {
		icoupon.value = null
		message.value = e.message
	}
}

onMounted(() => {
	localStorage.getItem('cart') && (
		products.value = JSON.parse(localStorage.getItem('cart')).map(item => ({
			...products_list.find(product => product.id === item.id),
			quantity: item.quantity
		}))
	)
})

const subtotal = computed(() => {
	return products.value.reduce((acc, product) => acc + product.price * product.quantity, 0)
})
const coupon_result = computed(() => {
	let result = null
	try {
		if (icoupon.value)
			result = icoupon.value.apply(subtotal.value)
		else result = null
	} catch (e) {
		message.value = e.message
		result = null
	}
	return result
})
const shipping = computed(() => subtotal.value >= 250 || coupon_result?.value?.[2] === COUPON_TYPE.SHIP ? 0 : 50)
const coupon_discount = computed(() => coupon_result.value ?
	(coupon_result.value[2] !== COUPON_TYPE.SHIP ? coupon_result.value[0] : 0)
	: 0)
const tax = computed(() => subtotal.value * 0.05)
const total = computed(() => Math.ceil(subtotal.value + tax.value + shipping.value - coupon_discount.value))

const submit = () => {
	if (products.value.length === 0) {
		alert('購物車為空')
		return
	}

	Swal.fire({
		title: '確定要送出訂單嗎？',
		text: "送出後將無法修改訂單",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: '送出',
		cancelButtonText: '取消'
	}).then((result) => {
		if (result.isConfirmed) {
			localStorage.removeItem('cart')
			const order_history = JSON.parse(localStorage.getItem('order_history')) || []
			order_history.push({
				products: products.value,
				coupon: coupon_result.value,
				shipping: shipping.value,
				tax: tax.value,
				total: total.value,
				date: new Date().toLocaleString()
			})
			localStorage.setItem('order_history', JSON.stringify(order_history))
			Swal.fire(
				'訂單已送出',
				'感謝您的購買',
				'success'
			).then(() => {
				router.push('/')
			})
		}
	})
}

</script>