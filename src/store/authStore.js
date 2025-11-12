import { reactive } from "vue";

export const authStore = reactive({
  initials: null,
  isLoggedIn: false,
});
