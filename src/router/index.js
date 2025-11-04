import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../pages/Dashboard.vue'; // your homepage component
import SharedWallet from '../pages/SharedWallet.vue';
import Login from "../pages/Login.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", name: "Login", component: Login }, // Homepage at "/"
    { path: "/dashboard", component: Dashboard },
    { path: "/shared-wallet", component: SharedWallet },
    // Add more pages here
  ],
});
