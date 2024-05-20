import { createRouter, createWebHistory } from 'vue-router'
import routes from "@/router/routes.js";
import axios from "axios";



axios.defaults.baseURL = "https://zoyirbek.pro/api/";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
