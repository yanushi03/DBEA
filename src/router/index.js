import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/Dashboard.vue'; // your homepage component
import SharedWallet from '../pages/SharedWallet.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home }, // Homepage at "/"
    { path: '/shared-wallet', component: SharedWallet}
    // Add more pages here
  ]
});
