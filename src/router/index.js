import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Cart from "@/views/Cart.vue";
import History from "@/views/History.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/cart',
            name: 'cart',
            component: Cart
        },
        {
            path: '/history',
            name: 'history',
            component: History
        }
    ]
})

export default router
