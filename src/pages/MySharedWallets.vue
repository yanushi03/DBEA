<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen py-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-navy-100">
        <div class="bg-gradient-to-r from-navy-600 to-navy-700 px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-white">My Shared Wallets</h1>
            <p class="text-navy-100 mt-2">
              Access quick snapshots of every wallet you're part of.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-navy-700 border border-white/80 rounded-lg text-sm font-medium hover:bg-white/90 transition"
              @click="openCreateWalletModal"
              :disabled="creatingWallet"
            >
              <i v-if="creatingWallet" class="fas fa-spinner fa-spin"></i>
              <template v-else>
                <i class="fas fa-plus"></i>
                Create Wallet
              </template>
            </button>
            <button
              class="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition"
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
        </div>

        <div class="p-8">
          <div
            v-if="createWalletSuccess"
            class="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700"
          >
            {{ createWalletSuccess }}
          </div>

          <div
            v-if="createWalletError"
            class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
          >
            {{ createWalletError }}
          </div>

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
                <div :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getWalletStatus(wallet) === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]">
                  {{ getWalletStatus(wallet) === 'active' ? 'Active' : 'Inactive' }}
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

    <transition name="fade">
      <div
        v-if="showCreateWalletModal"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 class="text-lg font-semibold text-navy-900">Create a new wallet</h2>
            <button
              class="text-slate-400 hover:text-slate-600 transition"
              @click="closeCreateWalletModal"
              :disabled="creatingWallet"
              aria-label="Close create wallet dialog"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="submitCreateWallet" class="px-6 py-6 space-y-5">
            <div>
              <label for="wallet-name" class="block text-sm font-medium text-slate-700">
                Wallet Name
              </label>
              <input
                id="wallet-name"
                v-model.trim="createWalletForm.name"
                type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
                placeholder="Family Savings"
                required
                :disabled="creatingWallet"
              />
            </div>
            <div>
              <label for="wallet-description" class="block text-sm font-medium text-slate-700">
                Description <span class="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="wallet-description"
                v-model.trim="createWalletForm.description"
                rows="3"
                class="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-navy-500 focus:ring-2 focus:ring-navy-200"
                placeholder="Shared wallet for family expenses"
                :disabled="creatingWallet"
              ></textarea>
            </div>
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                @click="closeCreateWalletModal"
                :disabled="creatingWallet"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center justify-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition disabled:opacity-70"
                :disabled="creatingWallet"
              >
                <i v-if="creatingWallet" class="fas fa-spinner fa-spin"></i>
                <template v-else>
                  <i class="fas fa-check"></i>
                  Create Wallet
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getWalletList, createWallet as createWalletApi, getAccountDetails as fetchAccountDetails, sendNotifications, getWallet } from "../api/outsystems";
import { getAccountId } from "../router/auth";

export default {
  name: "MySharedWallets",
  data() {
    return {
      wallets: [],
      loading: true,
      error: null,
      showCreateWalletModal: false,
      creatingWallet: false,
      createWalletForm: {
        name: "",
        description: "",
      },
      createWalletError: null,
      createWalletSuccess: null,
      accountDetails: null,
    };
  },
  created() {
    this.fetchWallets();
    this.loadAccountDetails();
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
        const walletsArray = Array.isArray(response) ? response : [];
        
        const firstWallet = walletsArray[0];
        const hasStatus = firstWallet && (firstWallet.Status || firstWallet.status);
        
        if (!hasStatus && walletsArray.length > 0) {
          const walletsWithStatus = await Promise.all(
            walletsArray.map(async (wallet) => {
              try {
                const walletData = await getWallet(wallet.WalletId);
                const details = walletData?.GetWalletDetails ?? {};
                const status = (details.Status || details.status || "active").toLowerCase();
                return {
                  ...wallet,
                  Status: status,
                  status: status
                };
              } catch (error) {
                console.error(`Failed to fetch status for wallet ${wallet.WalletId}:`, error);
                return {
                  ...wallet,
                  Status: 'active',
                  status: 'active'
                };
              }
            })
          );
          this.wallets = walletsWithStatus;
        } else {
          this.wallets = walletsArray.map(wallet => ({
            ...wallet,
            Status: (wallet.Status || wallet.status || 'active').toLowerCase(),
            status: (wallet.Status || wallet.status || 'active').toLowerCase()
          }));
        }
      } catch (err) {
        console.error("Failed to load wallet list:", err);
        this.error = "Unable to load your wallets right now. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
    openCreateWalletModal() {
      this.createWalletError = null;
      this.createWalletSuccess = null;
      this.createWalletForm = {
        name: "",
        description: "",
      };
      this.showCreateWalletModal = true;
    },
    closeCreateWalletModal() {
      if (this.creatingWallet) {
        return;
      }
      this.showCreateWalletModal = false;
    },
    async submitCreateWallet() {
      const trimmedName = this.createWalletForm.name.trim();
      if (!trimmedName) {
        this.createWalletError = "Please provide a wallet name.";
        return;
      }

      const accountId = getAccountId();
      if (!accountId) {
        this.createWalletError = "We couldn't determine your account. Please log in again.";
        return;
      }

      this.creatingWallet = true;
      this.createWalletError = null;

      try {
        const response = await createWalletApi({
          Name: trimmedName,
          Description: this.createWalletForm.description?.trim() || "",
          AccountId: accountId,
        });

        if (!response || response.Success === false) {
          const message =
            response?.Message ||
            "We couldn't create the wallet right now. Please try again later.";
          this.createWalletError = message;
          return;
        }

        const walletName = response.WalletName || trimmedName;
        const walletId = response.WalletId;

        this.createWalletSuccess = `Wallet "${walletName}" created successfully.`;
        this.showCreateWalletModal = false;
        await this.fetchWallets();
        await this.notifyWalletCreator({ walletName, walletId });
      } catch (error) {
        const message =
          error?.Message ||
          error?.message ||
          "We couldn't create the wallet right now. Please try again later.";
        this.createWalletError = message;
      } finally {
        this.creatingWallet = false;
      }
    },
    async loadAccountDetails() {
      const accountId = getAccountId();
      if (!accountId) {
        return null;
      }

      try {
        const details = await fetchAccountDetails(accountId);
        this.accountDetails = details;
        return details;
      } catch (error) {
        console.error("Failed to load account details:", error);
        return null;
      }
    },
    getWalletCreatorContact() {
      const details = this.accountDetails || {};
      return {
        email:
          details?.Email ||
          details?.email ||
          null,
        phone:
          details?.PhoneNumber ||
          details?.MobileNumber ||
          details?.phone ||
          details?.PrimaryPhone ||
          null,
        name:
          details?.FullName ||
          details?.Name ||
          details?.FirstName ||
          null,
      };
    },
    async notifyWalletCreator({ walletName, walletId }) {
      if (!walletName) {
        return;
      }

      if (!this.accountDetails) {
        await this.loadAccountDetails();
      }

      const contact = this.getWalletCreatorContact();

      if (!contact.email && !contact.phone) {
        console.warn("Wallet created but no contact details available to send notifications.");
        return;
      }

      const walletIdLine = walletId ? ` with ID ${walletId}` : "";
      const subject = `Wallet created: ${walletName}`;
      const emailBody = `Hello ${contact.name},\n\nYour wallet "${walletName}" has been created successfully!\n Wallet ID: ${walletIdLine}.\n\nYou can now add members and start managing expenses.\n\nThank you`;
      const smsBody = `Hello ${contact.name}, \n\nYour wallet "${walletName}" has been created successfully! Wallet ID: ${walletId}.\nPlease review in your account.`;

      try {
        await sendNotifications({
          receipientEmail: contact.email,
          subject,
          emailBody,
          receipientPhoneNumber: contact.phone,
          smsBody,
          notificationType: "WALLET_CREATED",
        });
      } catch (error) {
        console.error("Failed to send wallet creation notification:", error);
      }
    },
    formatCurrency(amount) {
      const numericAmount = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number.isNaN(numericAmount) ? 0 : numericAmount);
    },
    getWalletStatus(wallet) {
      return wallet.Status || wallet.status || 'active';
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

