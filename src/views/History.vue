<template>
	<ul role="list" class="divide-y divide-gray-100 p-16">
		<li v-for="history in histories" :key="history.date" class="flex justify-between gap-x-6 py-5">
			<div class="flex gap-x-4">
				<div class="min-w-0 flex-auto">
					<p class="text-sm font-semibold leading-6 text-gray-900">{{ history.date }}</p>
					<p class="mt-1 truncate text-xs leading-5 text-gray-500">{{
							history?.products?.map(x => x.name + 'x' + x.quantity).join(',')
						}}</p>
				</div>
			</div>
			<div class="hidden sm:flex sm:flex-col sm:items-end">
				<p class="text-sm leading-6 text-gray-900">NT${{ history.total }}</p>
			</div>
		</li>
	</ul>
</template>

<script setup>
const histories = JSON.parse(localStorage.getItem('order_history') || '[]')
</script>