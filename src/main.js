import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import '@fortawesome/fontawesome-free/css/all.css';


export function formatDate(dateTime) {
  const date = new Date(dateTime);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }
  return date.toLocaleDateString('en-US', options)
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
