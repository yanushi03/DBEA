<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Shared Wallet Overview -->
    <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl mb-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <!-- ... SVG path unchanged ... -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="text-purple-200 text-sm">Family Shared Wallet</p>
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
        <button class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm">
          Add Member
        </button>
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
          <p class="text-2xl font-bold">{{ activeMembers }}</p>
        </div>
      </div>
    </div>

    <!-- Wallet Members -->
    <div class="bg-white rounded-2xl shadow-sm border border-navy-100 mb-8">
      <div class="p-6 border-b border-navy-100">
        <h2 class="text-2xl font-bold text-navy-900">Wallet Members</h2>
      </div>
      <div class="divide-y divide-navy-100">
        <div
          v-for="(member, idx) in members"
          :key="idx"
          class="p-6 hover:bg-navy-50 transition-colors">
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
        <div
          v-for="(tx, idx) in transactions"
          :key="idx"
          class="p-6 hover:bg-navy-50 transition-colors">
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
              <span :class="[tx.statusBg, tx.statusColor, 'inline-block px-2 py-1 text-xs font-medium rounded-full mt-1']">
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
export default {
  data() {
    return {
      sharedBalanceVisible: true,
      sharedBalance: '$12,450.75',
      hiddenSharedBalance: '••••••••',
      totalContributions: '$18,200.00',
      totalSpending: '$5,749.25',
      activeMembers: 4,
      members: [
        { initials: 'JD', name: 'John Doe', email: 'john.doe@email.com', amount: '$6,500.00', role: 'Owner', bgClass: 'bg-navy-600', roleBgClass: 'bg-purple-100', roleTextClass: 'text-purple-700' },
        { initials: 'SM', name: 'Sarah Miller', email: 'sarah.m@email.com', amount: '$5,200.00', role: 'Admin', bgClass: 'bg-pink-500', roleBgClass: 'bg-blue-100', roleTextClass: 'text-blue-700' },
        { initials: 'MJ', name: 'Mike Johnson', email: 'mike.j@email.com', amount: '$4,100.00', role: 'Member', bgClass: 'bg-green-500', roleBgClass: 'bg-navy-100', roleTextClass: 'text-navy-700' },
        { initials: 'EW', name: 'Emily Wilson', email: 'emily.w@email.com', amount: '$2,400.00', role: 'Member', bgClass: 'bg-orange-500', roleBgClass: 'bg-navy-100', roleTextClass: 'text-navy-700' },
      ],
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
        {
          title: 'Rent Payment',
          date: 'Jan 15, 2025 • 09:00 AM • By Sarah',
          amount: '-$1,800.00',
          amountColor: 'text-red-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>`
        },
        {
          title: 'Electricity Bill',
          date: 'Jan 14, 2025 • 02:15 PM • By Mike',
          amount: '-$245.50',
          amountColor: 'text-red-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`
        },
        {
          title: 'Emily added funds',
          date: 'Jan 13, 2025 • 11:45 AM',
          amount: '+$1,500.00',
          amountColor: 'text-green-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>`
        },
        {
          title: 'Grocery Shopping',
          date: 'Jan 12, 2025 • 06:30 PM • By John',
          amount: '-$324.75',
          amountColor: 'text-red-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>`
        },
      ]
    }
  },
  methods: {
    toggleSharedBalance() {
      this.sharedBalanceVisible = !this.sharedBalanceVisible
    }
  }
}
</script>
