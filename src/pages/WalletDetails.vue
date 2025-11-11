<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274
                    4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </template>
                <template v-else>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97
                    9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88
                    l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478
                    0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </template>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex gap-3 items-start">
          <button
            v-if="isOwner"
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm"
            @click="openModal"
            :disabled="!walletId">
            Add Member
          </button>
          <button
            class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm disabled:opacity-60"
            disabled>
            Add Funds to Wallet
          </button>

          <ModalComponent v-if="showModal" :modal-title="'Add User to Wallet'" @close="closeModal">
            <form @submit.prevent="addMemberToWallet" class="space-y-4">
              <label class="block text-sm font-medium">
                User Account ID:
                <select v-model="newUserID" class="block w-full mt-2 p-2 border rounded text-black" required>
                  <option disabled value="">-- Select User --</option>
                  <option v-for="user in availableUsers" :key="user.AccountId" :value="user.AccountId">
                    {{ user.FullName }}: {{ user.AccountId }}
                  </option>
                </select>
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
                  <span :class="['px-2 py-0.5 text-xs font-medium rounded-full', member.roleBgClass, member.roleTextClass]">
                    {{ member.role }}
                  </span>
                </div>
                <p class="text-sm text-navy-500">{{ member.email || "No email provided" }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-navy-900">{{ member.amount || "-" }}</p>
              <p class="text-sm text-navy-500">Contributed</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-navy-100">
      <div class="p-6 border-b border-navy-100">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-navy-900">Recent Transactions</h2>
          <button class="text-navy-600 hover:text-navy-900 text-sm font-medium" disabled>Coming Soon</button>
        </div>
      </div>
      <div class="p-6 text-center text-navy-500">
        Transaction history is not available yet for this wallet.
      </div>
    </div>
  </main>
</template>

<script>
import ModalComponent from "./ModalComponent.vue";
import { getUsers, addMember, getWallet } from "@/api/outsystems";
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
      members: [],
      accounts: [],
      showModal: false,
      newUserID: "",
      currentAccount: getAccountId(),
      loadingWallet: false,
      error: null,
      isOwner: false,
    };
  },
  computed: {
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
    "$route.params.walletId": {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadWallet(newVal);
        }
      },
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    toggleSharedBalance() {
      this.sharedBalanceVisible = !this.sharedBalanceVisible;
    },
    openModal() {
      if (!this.isOwner) {
        return;
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newUserID = "";
    },
    async addMemberToWallet() {
      if (!this.walletId) {
        return;
      }
      try {
        await addMember(this.walletId, this.newUserID, "Member", this.currentAccount);
        this.closeModal();
        await this.loadWallet(this.walletId);
      } catch (error) {
        console.error("Add Member failed:", error);
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
          return {
            initials: getInitials(fullName),
            name: fullName,
            email: member.Email || member.email || "",
            amount: member.amount ? this.formatCurrency(member.amount) : null,
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

