<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
          <p class="font-medium">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="text-red-700 hover:text-red-900">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl mb-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <div class="flex items-center gap-4 mb-4">
            <svg class="w-7 h-7 text-purple-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            <div class="flex flex-col justify-center">
              <span class="text-purple-400 text-xs font-medium leading-tight mb-[2px]">
                ID:
                <span class="font-mono">{{ walletId ?? "-" }}</span>
              </span>
              <span class="text-purple-100 text-base font-bold leading-tight truncate">{{ walletName }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <h1 class="text-4xl font-bold">
              {{ sharedBalanceVisible ? formattedBalance : hiddenSharedBalance }}
            </h1>
            <button class="p-2 hover:bg-purple-700 rounded-lg transition-colors" @click="toggleSharedBalance">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <template v-if="sharedBalanceVisible">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274
                    4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </template>
                <template v-else>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97
                    9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88
                    l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478
                    0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </template>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex gap-3 items-start">
          <button v-if="isOwner"
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm"
            @click="openModal" :disabled="!walletId">
            Add Member
          </button>
          <button
            class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm"
            @click="openTopUpModal">
            Add Funds to Wallet
          </button>

          <!-- Add New Member Modal -->
          <ModalComponent v-if="showModal" :modal-title="'Add User to Wallet'" @close="closeModal">
            <form @submit.prevent="addMemberToWallet" class="space-y-4">
              <label class="block text-sm font-medium">
                User Phone Number:
                <input v-model="newUserPhone" type="tel" placeholder="Enter Phone Number"
                  class="block w-full mt-2 p-2 border rounded text-black" required />
                <div v-if="customerName" class="mt-2 text-sm text-green-600">
                  {{ customerName }}
                </div>
              </label>
              <div class="flex gap-3 mt-6">
                <button type="submit"
                  class="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                  Add User
                </button>
                <button type="button" @click="closeModal"
                  class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                  Cancel
                </button>
              </div>
            </form>
          </ModalComponent>
          <!-- End of Add New Member Modal -->

          <!-- Top Up Wallet Modal -->
          <ModalComponent v-if="showTopUpModal" :modal-title="'Top Up Wallet'" @close="closeTopUpModal">
            <form class="space-y-4" @submit.prevent="topUpWalletBalance">
              <label class="block text-sm font-medium">
                Top Up Amount:
                <input v-model="topUpBal" class="block w-full mt-2 p-2 border rounded text-black" required
                  :disabled="loading" />
              </label>

              <div class="flex gap-3 mt-6">
                <button type="submit"
                  class="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition flex items-center justify-center"
                  :disabled="topUpLoading">
                  <span v-if="!topUpLoading">Top Up</span>
                  <span v-else class="flex items-center gap-2">
                    <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Processing...
                  </span>
                </button>

                <button type="button" @click="closeTopUpModal"
                  class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition" :disabled="loading">
                  Cancel
                </button>
              </div>
            </form>
          </ModalComponent>
          <!-- End of Top Up Modal -->

          <div class="overlay" v-if="showModal"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-purple-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p class="text-purple-200 text-sm mb-1">Total Balance</p>
          <p class="text-2xl font-bold">{{ formattedBalance }}</p>
        </div>
        <div class="bg-purple-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p class="text-purple-200 text-sm mb-1">Total Members</p>
          <p class="text-2xl font-bold">{{ members.length }}</p>
        </div>
        <div class="bg-purple-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p class="text-purple-200 text-sm mb-1">Owner</p>
          <p class="text-2xl font-bold">{{ ownerName }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-navy-100 mb-8">
      <div class="p-6 border-b border-navy-100">
        <h2 class="text-2xl font-bold text-navy-900">Wallet Members</h2>
      </div>
      <div v-if="members.length === 0" class="p-6 text-center text-navy-500">
        No members yet.
      </div>
      <div v-else class="divide-y divide-navy-100">
        <div v-for="member in members" :key="member.accId" class="p-6 hover:bg-navy-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center', member.bgClass]">
                <span class="text-white font-semibold">{{ member.initials }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-navy-900">{{ member.name }}</p>
                  <span
                    :class="['px-2 py-0.5 text-xs font-medium rounded-full', member.roleBgClass, member.roleTextClass]">
                    {{ member.role }}
                  </span>
                </div>
                <p class="text-sm text-navy-500">{{ member.email || "No email provided" }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-navy-900">{{ member.amount }}</p>
              <p class="text-sm text-navy-500">Contributed</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="bg-white rounded-2xl shadow-sm border border-navy-100">
      <div class="p-6 border-b border-navy-100">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-navy-900">Recent Transactions</h2>
          <button class="text-navy-600 hover:text-navy-900 text-sm font-medium" disabled>Coming Soon</button>
        </div>
      </div>
    </div> -->

    <!-- Shared Wallet Transactions -->
    <div class="bg-white rounded-2xl shadow-sm border border-navy-100 mt-8" v-if="transactions.length > 0">
      <!-- Header -->
      <div class="p-6 border-b border-navy-100">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-navy-900">Recent Transactions</h2>
          <button class="text-navy-600 hover:text-navy-900 text-sm font-medium">
            View All
          </button>
        </div>
      </div>

      <!-- Transactions -->
      <div class="divide-y divide-navy-100">
        <!-- 👇 changed to use paginatedTransactions -->
        <div v-for="(tx, idx) in paginatedTransactions" :key="idx" class="p-6 hover:bg-navy-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="tx.iconBg + ' w-12 h-12 rounded-xl flex items-center justify-center'">
                <svg class="w-6 h-6" :class="tx.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <g v-html="tx.svg"></g>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-navy-900">{{ tx.title }}</p>
                <p class="text-sm text-navy-500">{{ tx.date }}</p>
              </div>
            </div>

            <div class="text-right">
              <p :class="['font-bold', tx.amountColor]">{{ tx.amount }}</p>
              <span :class="[
                tx.statusBg,
                tx.statusColor,
                'inline-block px-2 py-1 text-xs font-medium rounded-full mt-1',
              ]">
                {{ tx.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 👇 Pagination now inside the card -->
      <div class="flex justify-between items-center p-6 border-t border-navy-100" v-if="totalPages > 1">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Previous
        </button>

        <span class="text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-navy-100 p-6 text-center text-navy-500">
      No recent transactions found.
    </div>

  </main>
</template>

<script>
import ModalComponent from "./ModalComponent.vue";
import { getUsers, addMember, getWallet, getCustomerByPhone, GetWalletDetails, sendNotifications, topUpWallet, getWalletTransactions, getAccountDetails } from "@/api/outsystems";
import { getAccountId } from "../router/auth";

export default {
  name: "WalletDetails",
  components: { ModalComponent },
  data() {
    return {
      sharedBalanceVisible: true,
      hiddenSharedBalance: "••••••••",
      walletName: "Loading wallet...",
      walletId: null,
      walletBalance: 0,
      walletDetails: {},
      members: [],
      accounts: [],
      showModal: false,
      showTopUpModal: false,
      newUserPhone: "",
      lookupLoading: false,
      customerName: null,
      currentAccount: getAccountId(),
      loadingWallet: false,
      error: null,
      isOwner: false,
      errorMessage: "",
      topUpBal: "",
      depositAccountId: null,
      customerId: null,
      transactions: [],
      loading: false,
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.transactions.length / this.pageSize);
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.transactions.slice(start, end);
    },
    formattedBalance() {
      return this.formatCurrency(this.walletBalance);
    },
    availableUsers() {
      return this.accounts.filter((account) =>
        !this.members.some((member) => member.accId === account.AccountId)
      );
    },
    ownerName() {
      const owner = this.members.find((member) => member.role === "Owner");
      return owner ? owner.name : "N/A";
    },
  },
  watch: {
    currentPage(val) {
      if (val < 1) this.currentPage = 1;
      else if (val > this.totalPages) this.currentPage = this.totalPages;
    },
    "$route.params.walletId": {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadWallet(newVal);
        }
      },
    },
    newUserPhone(newVal) {
      if (newVal && newVal.trim().length > 0) {
        this.lookupName(newVal.trim());
      } else {
        this.customerName = null;
      }
    },
  },
  mounted() {
    this.fetchUsers();
    this.customerId = sessionStorage.getItem("customerId");
    this.depositAccountId = sessionStorage.getItem("accountId");

    if (this.$route.params.walletId) {
      this.initWallet(this.$route.params.walletId);
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToLastPage() {
      this.currentPage = this.totalPages;
    },
    async initWallet(walletId) {
      try {
        // Load wallet details
        await this.loadWallet(walletId);

        // Load wallet transactions
        await this.loadWalletTransactions(walletId);
      } catch (error) {
        console.error("Failed to initialize wallet:", error);
        this.errorMessage = "Failed to load wallet information.";
      }
    },
    async loadWalletTransactions(walletId) {
      if (!walletId) return;
      try {
        const response = await getWalletTransactions(walletId);

        console.log("Raw transactions fetched:", response.data);

        if (response.success && Array.isArray(response.data)) {
          this.transactions = response.data
            .sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate))
            .map((tx) => this.formatTransaction(tx));

          console.log("Formatted transactions:", this.transactions);
        } else {
          this.transactions = [];
          console.warn("No transactions or unexpected response format");
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
        this.transactions = [];
      }
    },

    formatTransaction(tx) {
      const amountNum = Number(tx.Amount ?? 0); // ensure numeric
      const isTopUp = tx.Type?.toLowerCase() === "top-up";
      const isWithdrawal = tx.Type?.toLowerCase() === "withdrawal";
      const sign = isTopUp ? "+" : isWithdrawal ? "-" : "";

      const title = tx.Narrative || (isTopUp ? "Wallet Top-Up" : "Wallet Withdrawal");

      // SVG icons
      const iconSvg = isTopUp
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4m8 8V4" />`;

      return {
        title: `${title} by ${tx.PerformedBy || "Unknown"}`, // <-- show performed by
        date: new Date(tx.TransactionDate).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" }),
        amount: `${sign}$${amountNum.toFixed(2)}`, // fix NaN issue
        status: "Completed",
        iconBg: isTopUp ? "bg-green-100" : "bg-red-100",
        iconColor: isTopUp ? "text-green-600" : "text-red-600",
        amountColor: isTopUp ? "text-green-600" : "text-red-600",
        statusBg: "bg-navy-50",
        statusColor: "text-navy-700",
        svg: iconSvg,
      };
    },
    toggleSharedBalance() {
      this.sharedBalanceVisible = !this.sharedBalanceVisible;
    },
    openModal() {
      if (!this.isOwner) {
        return;
      }
      this.errorMessage = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newUserPhone = "";
      this.customerName = null;
      // Keep error message visible after closing modal
    },
    async openTopUpModal() {
      if (!this.walletId) return;
      await this.loadWallet(this.walletId);
      this.showTopUpModal = true;
    },
    closeTopUpModal() {
      this.showTopUpModal = false;
      this.topUpBal = "";
    },
    async lookupName(phoneNumber) {
      try {
        const customer = await getCustomerByPhone(phoneNumber);
        this.customerName = customer?.FullName || null;
      } catch (error) {
        this.customerName = null;
      }
    },
    async addMemberToWallet() {
      if (!this.walletId) {
        return;
      }
      this.errorMessage = "";
      const trimmedPhone = this.newUserPhone.trim();
      if (!trimmedPhone) {
        this.errorMessage = "Please enter a valid phone number";
        return;
      }
      this.lookupLoading = true;
      try {
        const customer = await getCustomerByPhone(trimmedPhone);
        if (!customer || !customer.AccountId) {
          this.errorMessage = "User not found";
          return;
        }

        await addMember(this.walletId, customer.AccountId, "Member", this.currentAccount);
        await this.notifyNewMember(customer, this.walletName);

        this.closeModal();
        await this.loadWallet(this.walletId);
      } catch (error) {
        console.error("Add Member failed:", error);
        // Extract error message from response
        // API returns: { Success: false, Message: "..." }
        if (error && typeof error === 'object') {
          // Prioritize Message field (capital M) as that's what the API returns
          this.errorMessage = error.Message || error.message || error.error || error.Error ||
            (error.response && error.response.data && (error.response.data.Message || error.response.data.message || error.response.data.error || error.response.data.Error)) ||
            "Failed to add member. Please try again.";
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else {
          this.errorMessage = "Failed to add member. Please try again.";
        }
      } finally {
        this.lookupLoading = false;
      }
    },
    async loadWallet(id) {
      this.loadingWallet = true;
      this.error = null;
      this.walletId = id;
      try {
        const data = await getWallet(id);
        const details = data?.GetWalletDetails ?? {};
        this.walletName = details.Name ?? "Untitled Wallet";
        this.walletBalance = details.Balance ?? 0;
        const members = Array.isArray(details.Members) ? details.Members : [];
        this.members = members.map((member) => {
          const fullName = member.Fullname || member.FullName || "Unknown User";
          const amountContributed = member.AmountContributed ?? 0;
          return {
            initials: getInitials(fullName),
            name: fullName,
            email: member.Email || member.email || "",
            amount: this.formatCurrency(amountContributed),
            role: member.Role || "Member",
            bgClass: member.Role === "Owner" ? "bg-yellow-600" : "bg-navy-600",
            roleBgClass: member.Role === "Owner" ? "bg-yellow-100" : "bg-purple-100",
            roleTextClass: member.Role === "Owner" ? "text-yellow-700" : "text-purple-700",
            accId: member.AccountId || member.accountId,
          };
        });
        this.isOwner = this.members.some(
          (member) => member.role === "Owner" && member.accId === this.currentAccount
        );
      } catch (error) {
        console.error("Unable to fetch wallet details:", error);
        this.error = "We couldn't load the wallet details. Please try again later.";
      } finally {
        this.loadingWallet = false;
      }
    },
    async fetchUsers() {
      try {
        const data = await getUsers();
        this.accounts = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Unable to fetch users:", error);
      }
    },
    formatCurrency(amount) {
      const numeric = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number.isNaN(numeric) ? 0 : numeric);
    },
    getInviterName() {
      if (this.ownerName && this.ownerName !== "N/A") {
        return this.ownerName;
      }
      const currentMember = this.members.find(
        (member) => member.accId === this.currentAccount
      );
      if (currentMember && currentMember.name) {
        return currentMember.name;
      }
      return "Wallet Owner";
    },
    async notifyNewMember(customer, walletName) {
      const inviterName = this.getInviterName();

      const recipientEmail = customer?.Email || customer?.email || null;
      const recipientPhone = customer?.PhoneNumber || customer?.phoneNumber || customer?.MobileNumber || customer?.phone || null;
      const recipientName = customer?.FullName || customer?.Name || null;

      if (!recipientEmail && !recipientPhone) {
        console.warn("No contact details available for new member")
        return;
      }

      const subject = `You've been added to ${walletName}`;
      const emailBody = `Hello ${recipientName},\n\nYou've been added to a shared wallet: "${walletName}" by ${inviterName}.\n\nPlease sign in to your account to review and manage your wallet.\n\nThank you`;
      const smsBody = `Hello ${recipientName},\n\nYou've been added to a shared wallet: "${walletName}" by ${inviterName}.\nCheck your account to view details.`;

      try {
        await sendNotifications({
          receipientEmail: recipientEmail,
          subject,
          emailBody,
          receipientPhoneNumber: recipientPhone,
          smsBody,
          notificationType: "NEW_MEMBER_ADDED"
        });
      } catch (error) {
        console.error("Failed to send notification to new member:", error);
      }
    },
    async notifyTopUpSuccess(accountDetails, amount, walletName) {
      const recipientEmail = accountDetails?.Email || accountDetails?.email || null;
      const recipientPhone = accountDetails?.PhoneNumber || accountDetails?.MobileNumber || accountDetails?.phone || null;
      const recipientName = accountDetails?.FullName || accountDetails?.Name || "there";

      if (!recipientEmail && !recipientPhone) {
        console.warn("No contact details available to send top-up notification");
        return;
      }

      const formattedAmount = `$${amount.toFixed(2)}`;
      const subject = `Wallet Top-Up Successful: ${walletName}`;
      const emailBody = `Hello ${recipientName},\n\nYou have successfully added ${formattedAmount} to the shared wallet "${walletName}".\n\nThe wallet balance has been updated.\n\nThank you`;
      const smsBody = `Hello ${recipientName},\n\nYour wallet top-up was successful!\nYou added ${formattedAmount} to "${walletName}".\nCheck your account for details.`;

      try {
        await sendNotifications({
          receipientEmail: recipientEmail,
          subject,
          emailBody,
          receipientPhoneNumber: recipientPhone,
          smsBody,
          notificationType: "WALLET_TOP_UP"
        });
      } catch (error) {
        console.error("Failed to send top-up notification:", error);
      }
    },

    //---------------------- TOP UP WALLET FUNCTION -------------------------------------//
    async topUpWalletBalance() {
      this.topUpLoading = true; // start loading spinner
      try {
        if (!this.topUpBal || isNaN(this.topUpBal) || this.topUpBal <= 0) {
          this.errorMessage = "Please enter a valid top-up amount.";
          return;
        }

        const customerId = this.customerId;
        const depositAccountId = this.depositAccountId;
        const walletId = this.walletId;

        if (!customerId || !depositAccountId || !walletId) {
          this.errorMessage = "Missing required account or wallet details.";
          return;
        }

        if (!confirm(`Confirm to top up $${this.topUpBal}? This will withdraw from your deposit account.`)) {
          return;
        }

        // Get full name for PerformedBy
        const accountDetails = await getAccountDetails(this.currentAccount);
        const performedBy = accountDetails?.FullName || "Unknown User";

        // --- Optimistic UI: prepend transaction immediately ---
        const newTx = {
          title: `Wallet Top-Up by ${performedBy}`,
          date: new Date().toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" }),
          amount: `+$${parseFloat(this.topUpBal).toFixed(2)}`,
          status: "Completed",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          amountColor: "text-green-600",
          statusBg: "bg-navy-50",
          statusColor: "text-navy-700",
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />`,
        };
        this.transactions.unshift(newTx);
        this.walletBalance += parseFloat(this.topUpBal); // instant balance update

        // Call API (parallelized inside topUpWallet)
        const response = await topUpWallet(
          customerId,
          depositAccountId,
          walletId,
          parseFloat(this.topUpBal),
          "Wallet Top-Up",
          performedBy
        );

        // Show message
        if (!response.success) {
          this.errorMessage = response.message || "Failed to top up wallet.";
        } else {
          this.successMessage = response.message;
          // Send notification to the person who added funds
          await this.notifyTopUpSuccess(accountDetails, parseFloat(this.topUpBal), this.walletName);
        }

        // Refresh wallet and transactions from backend
        await this.loadWallet(walletId);            // <--- this updates balance & member contributions
        await this.loadWalletTransactions(walletId);
        this.goToLastPage();

        // Close modal after completion
        this.closeTopUpModal();
      } catch (error) {
        console.error("Top-up failed:", error);
        this.errorMessage = error.message || "Failed to process top-up.";
      } finally {
        this.topUpLoading = false; // stop spinner
      }
    }
    //------------------------------- END OF TOP UP WALLET FUNCTION ------------------ //
  },
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>
