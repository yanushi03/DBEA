<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen py-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-navy-100">
        <div class="bg-gradient-to-r from-navy-600 to-navy-700 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-white">My Shared Wallets</h1>
            <p class="text-navy-100 mt-2">
              Access quick snapshots of every wallet you're part of.
            </p>
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition"
            @click="fetchWallets"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <template v-else>
              <i class="fas fa-rotate-right"></i>
              Refresh
            </template>
          </button>
        </div>

        <div class="p-8">
          <div v-if="loading" class="flex items-center justify-center py-16">
            <i class="fas fa-spinner fa-spin text-navy-600 text-3xl"></i>
          </div>

          <div
            v-else-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {{ error }}
          </div>

          <div v-else-if="wallets.length === 0" class="text-center py-16">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-navy-50 text-navy-400">
              <i class="fas fa-wallet text-2xl"></i>
            </div>
            <h2 class="text-xl font-semibold text-navy-900">No shared wallets yet</h2>
            <p class="text-navy-500 mt-2">When you're added to a wallet, it will appear here.</p>
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2">
            <article
              v-for="wallet in wallets"
              :key="wallet.WalletId"
              class="border border-navy-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="goToWallet(wallet.WalletId)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-navy-900">{{ wallet.Name }}</h3>
                  <p class="text-sm text-navy-500 mt-1">Wallet ID: {{ wallet.WalletId }}</p>
                </div>
                <div class="px-3 py-1 rounded-full bg-navy-50 text-sm font-medium text-navy-700">
                  Active
                </div>
              </div>
              <div class="mt-6">
                <p class="text-sm text-navy-500 uppercase tracking-wide">Balance</p>
                <p class="text-2xl font-semibold text-navy-900">{{ formatCurrency(wallet.Balance) }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWalletList } from "../api/outsystems";
import { getAccountId } from "../router/auth";

export default {
  name: "MySharedWallets",
  data() {
    return {
      wallets: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchWallets();
  },
  methods: {
    async fetchWallets() {
      const accountId = getAccountId();

      if (!accountId) {
        this.error = "We couldn't determine your account. Please log in again.";
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await getWalletList(accountId);
        this.wallets = Array.isArray(response) ? response : [];
      } catch (err) {
        console.error("Failed to load wallet list:", err);
        this.error = "Unable to load your wallets right now. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(amount) {
      const numericAmount = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number.isNaN(numericAmount) ? 0 : numericAmount);
    },
    goToWallet(walletId) {
      this.$router.push({ name: "WalletDetails", params: { walletId } });
    },
  },
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.2);
}
</style>

