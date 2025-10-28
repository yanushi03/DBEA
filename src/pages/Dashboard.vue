<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Account Overview -->
      <div class="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-navy-300 text-sm mb-1">Total Balance</p>
            <div class="flex items-center gap-3">
              <h1 class="text-4xl font-bold">{{ balanceVisible ? balance : hiddenBalance }}</h1>
              <button class="p-2 hover:bg-navy-700 rounded-lg transition-colors" @click="toggleBalance">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <template v-if="balanceVisible">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                    </path>
                  </template>
                  <template v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21">
                    </path>
                  </template>
                </svg>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="text-navy-300 text-sm mb-1">Account Number</p>
            <p class="text-lg font-mono">**** 4829</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-navy-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
              </div>
              <span class="text-navy-300 text-sm">Income</span>
            </div>
            <p class="text-2xl font-bold">{{ income }}</p>
            <p class="text-green-400 text-sm mt-1">+12.5% from last month</p>
          </div>
          <div class="bg-navy-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                </svg>
              </div>
              <span class="text-navy-300 text-sm">Expenses</span>
            </div>
            <p class="text-2xl font-bold">{{ expenses }}</p>
            <p class="text-red-400 text-sm mt-1">+5.2% from last month</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <!-- ...shortened for brevity: copy your quick actions code from above here... -->
      </div>

      <!-- Transaction History -->
      <div class="bg-white rounded-2xl shadow-sm border border-navy-100">
        <div class="p-6 border-b border-navy-100">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-navy-900">Transaction History</h2>
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
                <span class="inline-block px-2 py-1"
                      :class="[tx.statusBg, tx.statusColor, 'text-xs font-medium rounded-full mt-1']">
                      {{ tx.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      balance: '$24,582.50',
      hiddenBalance: '••••••••',
      balanceVisible: true,
      income: '$8,420.00',
      expenses: '$3,280.00',
      transactions: [
        {
          title: 'Salary Deposit',
          date: 'Jan 15, 2025 • 09:30 AM',
          amount: '+$5,200.00',
          amountColor: 'text-green-600',
          status: 'Completed',
          statusColor: 'text-green-700',
          statusBg: 'bg-green-100',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          svg: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>`
        },
        // ...put your other transaction objects here...
      ]
    };
  },
  methods: {
    toggleBalance() {
      this.balanceVisible = !this.balanceVisible;
    }
  }
};
</script>
