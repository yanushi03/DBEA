import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import '@fortawesome/fontawesome-free/css/all.css';
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"


Vue.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');

Vue.config.warnHandler = function (msg, vm, trace) {
  if (
    msg.includes("$attrs is readonly") ||
    msg.includes("$listeners is readonly")
  ) {
    return; // ignore
  }
  console.warn(msg + trace);
};