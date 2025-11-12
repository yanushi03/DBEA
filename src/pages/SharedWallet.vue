<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Error Message Banner -->
    <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <p class="font-medium">{{ errorMessage }}</p>
        </div>
        <button @click="errorMessage = ''" class="text-red-700 hover:text-red-900">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
    <!-- Shared Wallet Overview -->
    <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl mb-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <!-- Wallet Info Header -->
          <div class="flex items-center gap-4 mb-4">
            <svg class="w-7 h-7 text-purple-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true">
              <!-- SVG path unchanged -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            <div class="flex flex-col justify-center">
              <span class="text-purple-400 text-xs font-medium leading-tight mb-[2px]">ID: <span class="font-mono">{{
                walletId }}</span></span>
              <span class="text-purple-100 text-base font-bold leading-tight truncate">{{ walletName }}</span>
            </div>
          </div>


          <div class="flex items-center gap-3">
            <h1 class="text-4xl font-bold">
              {{ sharedBalanceVisible ? sharedBalance : hiddenSharedBalance }}
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
        <div>

          <button
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm"
            @click="openModal">Add Member</button>

          <ModalComponent v-if="showModal" :modal-title="'Add User to Wallet'" @close="closeModal">
            <form @submit.prevent="handleAddMember" class="space-y-4">
              <label class="block text-sm font-medium">
                User Account ID:
                <input
                  v-model="newUserID"
                  type="text"
                  placeholder="Enter Account ID"
                  class="block w-full mt-2 p-2 border rounded text-black"
                  required
                />
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
          <p class="text-purple-200 text-sm mb-1">Total Contributions</p>
          <p class="text-2xl font-bold">{{ totalContributions }}</p>
        </div>
        <div class="bg-purple-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p class="text-purple-200 text-sm mb-1">Total Spending</p>
          <p class="text-2xl font-bold">{{ totalSpending }}</p>
        </div>
        <div class="bg-purple-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p class="text-purple-200 text-sm mb-1">Active Members</p>
          <p class="text-2xl font-bold">{{ members.length }}</p>
        </div>
      </div>
    </div>

    <!-- Wallet Members -->
    <div class="bg-white rounded-2xl shadow-sm border border-navy-100 mb-8">
      <div class="p-6 border-b border-navy-100">
        <h2 class="text-2xl font-bold text-navy-900">Wallet Members</h2>
      </div>
      <div class="divide-y divide-navy-100">
        <div v-for="(member, idx) in members" :key="idx" class="p-6 hover:bg-navy-50 transition-colors">
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
                <p class="text-sm text-navy-500">{{ member.email }}</p>
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

    <!-- Shared Wallet Transactions -->
    <div class="bg-white rounded-2xl shadow-sm border border-navy-100">
      <div class="p-6 border-b border-navy-100">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-navy-900">Recent Transactions</h2>
          <button class="text-navy-600 hover:text-navy-900 text-sm font-medium">View All</button>
        </div>
      </div>
      <div class="divide-y divide-navy-100">
        <div v-for="(tx, idx) in transactions" :key="idx" class="p-6 hover:bg-navy-50 transition-colors">
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
              <span
                :class="[tx.statusBg, tx.statusColor, 'inline-block px-2 py-1 text-xs font-medium rounded-full mt-1']">
                {{ tx.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ModalComponent from './ModalComponent.vue';
import { getUsers, addMember, getWallet } from "@/api/outsystems";
import { getAccountId } from "../router/auth";


export default {
  components: { ModalComponent },

  data() {
    return {
      sharedBalanceVisible: true,
      sharedBalance: '$12,450.75',
      hiddenSharedBalance: '••••••••',
      totalContributions: '$18,200.00',
      totalSpending: '$5,749.25',
      activeMembers: 0,
      members: [],
      walletName: 'T-Bank Wallet',
      walletId: '4',
      transactions: [
        {
          title: 'John added funds',
          date: 'Jan 16, 2025 • 10:30 AM',
          amount: '+$2,000.00',
          amountColor: 'text-green-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>`
        },
      ],

      accounts: [],

      // Add New Member to Wallet
      showModal: false,
      newUserID: '',
      currentAccount: getAccountId(),
      errorMessage: '',

    }
  },
  computed: {
    availableUsers() {
      return this.accounts.filter(accountId =>
        !this.members.some(member => member.accId === accountId.AccountId)
      );
    }
  },
  mounted() {
    this.getUsers(),
      this.getWalletDetails()
  },
  methods: {
    toggleSharedBalance() {
      this.sharedBalanceVisible = !this.sharedBalanceVisible
    },
    openModal() { 
      this.errorMessage = "";
      this.showModal = true; 
    },
    closeModal() { 
      this.showModal = false; 
      // Keep error message visible after closing modal
    },

    handleAddMember() {
      this.errorMessage = "";
      addMember(this.walletId, this.newUserID, "Member", this.currentAccount)
        .then(() => {
          this.closeModal();
          this.getWalletDetails()
        })
        .catch(error => {
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
        });
    },

    getWalletDetails() {
      return getWallet(this.walletId)
        .then((data) => {
          console.log(data.GetWalletDetails)
          this.walletId = data.GetWalletDetails.WalletId
          this.walletName = data.GetWalletDetails.Name
          // this.sharedBalance =data.GetWalletDetails.Balance
          this.members = data.GetWalletDetails.Members.map(user => {
            const amountContributed = user.AmountContributed ?? 0;
            return {
              initials: user.initials || getInitials(user.Fullname),
              name: user.Fullname,
              email: user.Email,
              amount: this.formatCurrency(amountContributed),
              role: user.Role || 'Member',
              bgClass: user.Role === 'Owner' ? 'bg-yellow-600' : (user.bgClass || 'bg-navy-600'),
              roleBgClass: user.Role === 'Owner' ? 'bg-yellow-100' : (user.roleBgClass || 'bg-purple-100'),
              roleTextClass: user.Role === 'Owner' ? 'text-yellow-700' : (user.roleTextClass || 'text-purple-700'),
              accId: user.AccountId
            };
          });
        })

    },
    getUsers() {
      return getUsers()
        .then((data) => {
          for (let index = 0; index < data.length; index++) {
            this.accounts.push(data[index])
          }
        });
    },
    formatCurrency(amount) {
      const numeric = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number.isNaN(numeric) ? 0 : numeric);
    }
  }
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

</script>

<style>
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
