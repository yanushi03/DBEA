<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Account Overview -->
      <div class="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-navy-300 text-sm mb-1">Total Balance</p>
            <div class="flex items-center gap-3">
              <h1 class="text-4xl font-bold">
                {{ balanceVisible ? balance : hiddenBalance }}
              </h1>
              <button class="p-2 hover:bg-navy-700 rounded-lg transition-colors" @click="toggleBalance">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <template v-if="balanceVisible">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
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
            <p class="text-lg font-mono">{{ currentAccNumber }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-navy-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12">
                  </path>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6">
                  </path>
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
      <!-- Tabs -->
      <div class="flex border-b border-navy-100 mb-4">
        <button @click="currentTab = 'transactions'" :class="currentTab === 'transactions'
          ? 'border-b-2 border-blue-500 text-navy-900'
          : 'text-navy-500'
          " class="px-4 py-2 font-medium">
          Transactions
        </button>
        <button @click="currentTab = 'insights'" :class="currentTab === 'insights'
          ? 'border-b-2 border-blue-500 text-navy-900'
          : 'text-navy-500'
          " class="px-4 py-2 font-medium">
          Insights
        </button>
      </div>

      <!-- Transaction History -->
      <div v-if="currentTab === 'transactions'" class="bg-white rounded-2xl shadow-sm border border-navy-100">
        <div class="p-6 border-b border-navy-100">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-navy-900">
              Transaction History
            </h2>
            <button class="text-navy-600 hover:text-navy-900 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div class="divide-y divide-navy-100">
          <div v-for="(tx, idx) in transactions" :key="idx" class="p-6 hover:bg-navy-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div :class="tx.iconBg +
                  ' w-12 h-12 rounded-xl flex items-center justify-center'
                  ">
                  <svg class="w-6 h-6" :class="tx.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <g v-html="tx.svg"></g>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-navy-900">{{ tx.narrative }}</p>
                  <p class="text-sm text-navy-500">
                    {{ formatDate(tx.transactionDate) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p :class="['font-bold', tx.amountColor]">
                  {{ tx.transactionAmount }}
                </p>
                <span class="inline-block px-2 py-1" :class="[
                  tx.statusBg,
                  tx.statusColor,
                  'text-xs font-medium rounded-full mt-1',
                ]">
                  {{ tx.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div v-if="currentTab === 'insights'" class="bg-white rounded-2xl shadow-sm border border-navy-100 p-4">
        <div class="p-4 border-b border-navy-100">
          <!-- Month Tabs -->
          <div class="flex gap-2 mb-4 overflow-x-auto">
            <button v-for="month in months" :key="month" @click="currentMonth = month; computeSpendingSummary()" :class="currentMonth === month
              ? 'bg-blue-500 text-white px-4 py-1 rounded-full'
              : 'bg-navy-100 text-navy-700 px-4 py-1 rounded-full'">
              {{ formatMonthLabel(month) }}
            </button>
          </div>
          <!-- Total Spending with "Spent this month" -->
          <div class="mt-6">
            <h2 class="text-3xl font-bold text-navy-900">{{ totalSpending }}</h2>
            <p class="mt-2 text-base text-navy-500">Spent this month</p>
          </div>
        </div>

        <div class="divide-y divide-navy-100">
          <!-- Spending Categories with Icons and Progress Bars -->
          <div v-for="(item, idx) in spendingSummary" :key="idx"
            class="mb-4 flex items-center gap-2 p-6 hover:bg-navy-50 transition-colors">
            <!-- Icon based on category -->
            <span class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              <i v-if="item.category === 'Food'" class="fas fa-utensils text-red-500 text-2xl"></i>
              <i v-else-if="item.category === 'Transportation'" class="fas fa-bus text-blue-500 text-2xl"></i>
              <i v-else class="fas fa-circle text-gray-500 text-2xl"></i>
            </span>

            <div class="flex-1 mb-4">
              <!-- Category Info -->
              <div class="flex justify-between items-center mb-1">
                <!-- Category name and count -->
                <div class="ml-2">
                  <p class="text-2xl font-semibold text-navy-900 flex items-center gap-2">
                    {{ item.category }}
                  </p>
                  <p class="text-lg text-navy-600">{{ item.count }} transactions</p>
                </div>

                <!-- Total spending -->
                <p class="text-navy-600 font-medium">{{ item.amount }}</p>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-navy-100 rounded-full h-3 mt-2 ml-2">
                <div class="bg-blue-500 h-3 rounded-full" :style="{ width: item.percentage + '%' }"></div>
              </div>

              <!-- Percentage (optional, below the bar) -->
              <p class="text-right text-sm text-navy-500 mt-1">{{ item.percentage.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { fetchTransactionData } from "@/api/outsystems";
import { formatDate } from "../main";
import { getAccountId } from "../router/auth";
export default {
  data() {
    return {
      // hard coded for now pls change
      currentAccNumber: getAccountId(),
      balance: "$24,582.50",
      hiddenBalance: "••••••••",
      balanceVisible: true,
      income: "$8,420.00",
      expenses: "$3,280.00",
      transactions: [],
      currentTab: "transactions",
      totalSpending: "$0.00",
      spendingSummary: [],
      currentMonth: null,
      months: [],
    };
  },
  // Used to fetch data from api
  mounted() {
    this.fetchTransactionData(this.currentAccNumber)
      .then((data) => {
        console.log(data); // See your API response structure
        this.transactions = data.map((tx) =>
          enrichTransaction(tx, this.currentAccNumber)
        );

        // Extract available months
        const monthSet = new Set(
          this.transactions.map((tx) => tx.transactionDate.slice(0, 7)) // "YYYY-MM"
        );
        this.months = Array.from(monthSet).sort((a, b) => b.localeCompare(a)); // latest first
        this.currentMonth = this.months[0] || null;

        this.computeSpendingSummary();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  watch: {
    transactions: {
      handler() {
        this.computeSpendingSummary();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    formatDate,
    toggleBalance() {
      this.balanceVisible = !this.balanceVisible;
    },
    fetchTransactionData(currentAccNumber) {
      // Your fetch function, e.g.
      return fetchTransactionData(currentAccNumber); // Promise
    },

    formatMonthLabel(monthStr) {
      // monthStr is "YYYY-MM"
      const [year, month] = monthStr.split("-");
      const date = new Date(year, month - 1); // months are 0-indexed
      const now = new Date();

      if (year == now.getFullYear() && month == (now.getMonth() + 1).toString().padStart(2, '0')) {
        return "This month";
      }

      return date.toLocaleString("default", { month: "short", year: "numeric" });
    },

    computeSpendingSummary() {
      const categories = [
        { name: "Food", keywords: ["dinner", "lunch", "breakfast"] },
        { name: "Transportation", keywords: ["bus", "mrt"] },
        // add more categories here
      ];

      const summary = {};
      let totalSpending = 0;

      this.transactions
        .filter(tx => this.currentMonth ? tx.transactionDate.startsWith(this.currentMonth) : true)
        .forEach((tx) => {
          let category = "Other"; // default to "Other"

          if (tx.narrative && tx.narrative.trim() !== "") {
            const narrative = tx.narrative.toLowerCase();
            for (const cat of categories) {
              if (cat.keywords.some(keyword => narrative.includes(keyword.toLowerCase()))) {
                category = cat.name;
                break;
              }
            }
          }

          const amount = parseFloat(tx.transactionAmount.replace(/[$+-]/g, "")) || 0;

          // only count outflow as spending
          if (tx.transactionAmount.startsWith("-")) {
            totalSpending += amount;
            if (!summary[category]) summary[category] = { amount: 0, count: 0 };
            summary[category].amount += amount;
            summary[category].count += 1;
          }
        });

      this.totalSpending = `$${totalSpending.toFixed(2)}`;

      this.spendingSummary = Object.keys(summary).map((category) => ({
        category,
        amount: `$${summary[category].amount.toFixed(2)}`,
        count: summary[category].count,
        percentage: totalSpending > 0 ? (summary[category].amount / totalSpending) * 100 : 0,
      }));
    }
  },
};

function enrichTransaction(tx, currentAccNumber) {
  const isOutflow = tx.accountTo !== currentAccNumber;

  // Ensure amount is a string and strip any existing sign
  let amountValue =
    tx.transactionAmount?.toString().replace(/^[-+]/, "") || "0";

  // Add + for inflows, - for outflows
  let transactionAmount = (isOutflow ? "-" : "+") + "$" + amountValue;

  const svg = isOutflow
    ? // Arrow up (outflow)
    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 13l5-5m0 0l5 5m-5-5v12"></path>`
    : // Arrow down (inflow)
    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 11l-5 5m0 0l-5-5m5 5V4"></path>`;

  return {
    ...tx,
    transactionAmount,
    amountColor: isOutflow ? "text-red-600" : "text-green-600",
    statusColor:
      tx.status === "Completed"
        ? isOutflow
          ? "text-red-700"
          : "text-green-700"
        : "text-yellow-700",
    statusBg:
      tx.status === "Completed"
        ? isOutflow
          ? "bg-red-100"
          : "bg-green-100"
        : "bg-yellow-100",
    iconBg: isOutflow ? "bg-red-100" : "bg-green-100",
    iconColor: isOutflow ? "text-red-600" : "text-green-600",
    svg,
  };
}
</script>
