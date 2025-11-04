<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">MyB</span>
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-navy-900 mb-6">Login to Your Account</h2>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-navy-900 font-medium mb-1" for="email">Account ID</label>
          <input
            v-model="accountId"
            id="accountId"
            type="text"
            placeholder="0000001234"
            class="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            required
          />
        </div>

        <div>
          <label class="block text-navy-900 font-medium mb-1" for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="********"
            class="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-navy-600 hover:bg-navy-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>

      <!-- Links -->
      <div class="mt-4 text-center">
        <!-- <router-link to="/forgot-password" class="text-navy-600 hover:text-navy-900 text-sm">
          Forgot password?
        </router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../api/outsystems.js"

export default {
  name: "Login",
  data() {
    return {
      accountId: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
     try{
      const data = await loginUser(this.accountId, this.password);
      console.log("Login success:", data)
      this.$router.push("/dashboard")
     }catch(err){
      this.error = "Invalid account ID or password.";
     }
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 50px auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
