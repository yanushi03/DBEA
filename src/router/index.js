import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../pages/Dashboard.vue'; // your homepage component
import SharedWallet from '../pages/SharedWallet.vue';
import Login from "../pages/Login.vue";
import { isAuthenticated } from './auth';


Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    { path: "/", name: "Login", component: Login }, // Homepage at "/"
    { path: "/dashboard", name: "Dashboard" ,component: Dashboard },
    { path: "/shared-wallet", component: SharedWallet },
    // Add more pages here
  ],
});

// Route guard: protect all pages except Login
router.beforeEach((to, from, next) => {
  const publicPages = ["Login"];
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !isAuthenticated()) {
    // Redirect to login if user is not authenticated
    next({ name: "Login" });
  } else if (to.name === "Login" && isAuthenticated()) {
    // Redirect to dashboard if already logged in
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;



