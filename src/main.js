import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import '@fortawesome/fontawesome-free/css/all.css';




new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
