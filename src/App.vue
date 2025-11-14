<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen">
    <!-- Header -->
    <header v-if="!isLoginPage" class="bg-white border-b border-navy-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </div>
              <span class="text-xl font-bold text-navy-900">MyBank</span>
            </div>
            <nav class="hidden md:flex gap-6">
              <router-link 
                to="/dashboard" 
                class="text-navy-600 hover:text-navy-900 transition-colors pb-1"
                active-class="font-bold border-b-2 border-navy-600 text-navy-900"
                exact>
                Dashboard
              </router-link>
              <router-link 
                to="/my-wallets" 
                class="text-navy-600 hover:text-navy-900 transition-colors pb-1"
                active-class="font-bold border-b-2 border-navy-600 text-navy-900">
                My Shared Wallets
              </router-link>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-navy-50 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                </path>
              </svg>
            </button>
            <div class="relative group">
              <!-- Profile Circle -->
              <div class="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center cursor-pointer">
                <span class="text-white text-sm font-medium">{{ authStore.initials }}</span>
              </div>

              <!-- Dropdown Menu -->
              <div
                class="absolute right-0 mt-2 w-40 bg-white border border-navy-200 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <router-link to="/profile" class="block px-4 py-2 text-navy-900 hover:bg-navy-50 transition-colors">
                  Profile
                </router-link>
                <a @click.prevent="handleLogout" href="#"
                  class="block px-4 py-2 text-navy-900 hover:bg-navy-50 transition-colors">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- Vue Router outlet for page content -->
    <RouterView />
  </div>
</template>

<script>
import { authStore } from "./store/authStore";
import { getUserInitials, logout } from './router/auth';

export default {
  name: "App",
  data() {
    return {
      authStore, // expose store to template
    };
  },
  computed: {
    isLoginPage() {
      return this.$route.name === "Login";
    }
  },
  mounted() {
    // restore state on page reload
    const saved = getUserInitials();
    if (saved) {
      authStore.initials = saved;
      authStore.isLoggedIn = true;
    }
  },
  methods: {
    handleLogout() {
      logout();
      this.$router.push("/");
    }
  }
};
</script>
