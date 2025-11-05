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

          <!-- Date Range Fields -->
          <div class="mt-4 flex gap-4 items-center">
            <label class="text-sm font-medium text-navy-600">
              Start Date:
              <input type="date" v-model="startDate" class="ml-2 border border-navy-200 rounded px-3 py-1" />
            </label>
            <label class="text-sm font-medium text-navy-600">
              End Date:
              <input type="date" v-model="endDate" class="ml-2 border border-navy-200 rounded px-3 py-1" />
            </label>
            <button @click="fetchTransactionData(currentAccNumber, startDate, endDate)"
              class="ml-4 bg-blue-500 text-white px-3 py-1 rounded">
              Filter
            </button>
          </div>
          <!-- End date range fields -->
        </div>

        <div class="divide-y divide-navy-100">
          <template>
            <div>
              <div v-for="(tx, idx) in paginatedTransactions" :key="idx" class="p-6 hover:bg-navy-50 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div :class="tx.iconBg + ' w-12 h-12 rounded-xl flex items-center justify-center'">
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
                    <!-- <span class="inline-block px-2 py-1" :class="[
                      tx.statusBg,
                      tx.statusColor,
                      'text-xs font-medium rounded-full mt-1',
                    ]">
                      {{ tx.status }}
                    </span> -->
                    <button
                      class="px-6 py-3 rounded-lg font-bold text-white shadow transition transform hover:scale-105 focus:outline-none"
                      style="background: linear-gradient(90deg, #ff5e62 50%, #ffc371 50%); border: none;">
                      Split Expenses
                    </button>

                  </div>
                </div>
              </div>

              <!-- Pagination controls -->
              <div class="flex items-center justify-center gap-6 mt-4 mb-5">
                <button @click="prevPage" :disabled="currentPage === 1"
                  class="px-4 py-1 rounded bg-gray-300 disabled:opacity-50">
                  Previous
                </button>

                <span class="text-sm font-medium">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-4 py-1 rounded bg-gray-300 disabled:opacity-50">
                  Next
                </button>
              </div>

            </div>
          </template>

          <!-- Show "No transactions" if empty -->
          <div v-if="transactions.length === 0" class="p-6 text-navy-500 font-medium">
            No transactions for this period
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div v-if="currentTab === 'insights'" class="bg-white rounded-2xl shadow-sm border border-navy-100 p-4">
        <div class="p-4 border-b border-navy-100">
          <!-- Month Tabs -->
          <div class="flex gap-2 mb-4 overflow-x-auto">
            <button v-for="month in months" :key="month" @click="selectMonth(month)" :class="currentMonth === month
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
          <!-- Show "No transactions" if empty -->
          <div v-if="spendingSummary.length === 0" class="p-6 text-navy-500 font-medium">
            No transactions for this month
          </div>
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
import { fetchTransactionData, getAccountDetails as fetchAccountDetails, fetchMonthlyTransactionData } from "@/api/outsystems";
import { formatDate } from "../utils/date";
import { getAccountId } from "../router/auth";
export default {
  data() {
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    return {
      // hard coded for now pls change
      currentAccNumber: getAccountId(),
      balance: "$0.00",
      hiddenBalance: "$••••••••",
      balanceVisible: false,
      income: "$0.00",
      expenses: "$0.00",
      transactions: [],
      currentTab: "transactions",
      totalSpending: "$0.00",
      spendingSummary: [],
      currentMonth: null,
      months: [],
      startDate: lastMonth.toLocaleDateString('en-CA'),
      endDate: now.toLocaleDateString('en-CA'),
      currentPage: 1,
      itemsPerPage: 4, // adjust per page count here
      // transactions: [], // your fetched transactions
    };

  },
  // Used to fetch data from api
  mounted() {
    this.getAccountDetails(this.currentAccNumber)
      .then((data) => {
        // console.log(data); //dont show on console
        this.balance = "$" + (data.Balance).toFixed(2);
      })
      .catch((error) => {
        console.error(error);
      });

    this.fetchTransactionData(this.currentAccNumber, this.startDate, this.endDate)
      .then((data) => {
        // console.log(data); // See your API response structure
        // Extract available months
        const now = new Date();
        const last6Months = [];
        for (let i = 0; i < 6; i++) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          last6Months.push(monthStr);
        }

        // Extract months from transactions
        const transactionMonths = new Set(
          this.transactions.map((tx) => tx.transactionDate.slice(0, 7))
        );

        // Merge (to include months even if no transactions)
        const allMonths = Array.from(new Set([...last6Months, ...transactionMonths]));
        this.months = allMonths.sort((a, b) => b.localeCompare(a)); // latest first
        this.currentMonth = this.months[0] || null;

        // Compute insights
        this.computeSpendingSummary();

      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch all transactions for insights (ignores date filter)
    this.fetchAllTransactionsForInsights();
    this.fetchMonthlyTransaction();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.transactions.length / this.itemsPerPage);
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.transactions.slice(start, end);
    },
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

    formatDate,
    toggleBalance() {
      this.balanceVisible = !this.balanceVisible;
    },

    selectMonth(month) {
      this.currentMonth = month;
      const summary = this.getMonthSummary(month);
      this.spendingSummary = summary.categories; // could be empty array if no data
      this.totalSpending = summary.totalSpending || "$0.00";
    },

    getMonthSummary(month) {
      if (!this.monthlySummaries || this.monthlySummaries.length === 0) return { categories: [], totalSpending: "$0.00" };
      const summary = this.monthlySummaries.find(s => s.month === month);
      return summary || { categories: [], totalSpending: "$0.00" };
    },

    // Fetch transactions by date filter
    fetchTransactionData(currentAccNumber, startDate, endDate) {
      return fetchTransactionData(currentAccNumber, startDate, endDate)
        .then((data) => {
          // 2. Set transactions
          this.transactions = data.map(tx => enrichTransaction(tx, currentAccNumber));


        });
    },

    // Fetch all transactions for Insights
    fetchAllTransactionsForInsights() {
      const earliestDate = '1900-01-01';
      const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

      return fetchTransactionData(this.currentAccNumber, earliestDate, today)
        .then((data) => {
          const enrichedTx = data.map(tx => enrichTransaction(tx, this.currentAccNumber));

          // Store in a separate property for insights
          this.allTransactions = enrichedTx;

          // Extract all months
          const transactionMonths = new Set(
            enrichedTx.map(tx => tx.transactionDate.slice(0, 7))
          );

          const now = new Date();
          const last6Months = [];
          for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            last6Months.push(monthStr);
          }

          const allMonths = Array.from(new Set([...last6Months, ...transactionMonths]));
          this.months = allMonths.sort((a, b) => b.localeCompare(a));
          this.currentMonth = this.months[0] || null;

          // Compute insights using all transactions
          this.computeSpendingSummary(this.allTransactions);
        })
        .catch(console.error);
    },

    fetchMonthlyTransaction() {
      const nowDate = new Date(); // Date object for current date
      const now = nowDate.toLocaleDateString('en-CA'); // formatted string

      const lastMonthDate = new Date(nowDate); // copy Date object
      lastMonthDate.setMonth(nowDate.getMonth() - 1); // set to one month earlier
      const lastMonth = lastMonthDate.toLocaleDateString('en-CA');

      return fetchTransactionData(this.currentAccNumber, lastMonth, now)
        .then((data) => {
          // Enrich each transaction with account number context
          this.transactions = data.map(tx => enrichTransaction(tx, this.currentAccNumber));

          // Calculate income (inflow)
          this.income = "$" + this.transactions
            .reduce((sum, tx) => sum + calculateIncome(tx, this.currentAccNumber), 0)
            .toFixed(2);

          // Calculate expenses (outflow)
          this.expenses = "$" + this.transactions
            .reduce((sum, tx) => sum + calculateExpenses(tx, this.currentAccNumber), 0)
            .toFixed(2);
        });

    },


    getAccountDetails(currentAccNumber) {
      return fetchAccountDetails(currentAccNumber);
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

    computeSpendingSummary(transactionsArray) {
      const txArray = transactionsArray || this.transactions;

      if (!txArray || txArray.length === 0) {
        this.monthlySummaries = [];
        this.spendingSummary = [];
        this.totalSpending = "$0.00";
        return;
      }

      const categoryKeywords = {
        Food: ['mcdonald', 'kfc', 'burger', 'restaurant', 'foodpanda', 'grabfood', 'dinner', 'lunch', 'breakfast'],
        Transportation: ['mrt', 'bus', 'grab', 'taxi', 'ezlink', 'ride', 'train'],
        Shopping: ['shopee', 'lazada', 'uniqlo', 'zara', 'mall', 'store', 'retail', 'clothes', 'fashion'],
      };

      const monthlyData = {};

      txArray.forEach(tx => {
        const txMonth = tx.transactionDate?.slice(0, 7);
        if (!txMonth) return;

        if (!monthlyData[txMonth]) monthlyData[txMonth] = { categories: {}, totalSpending: 0 };

        // Only outflows
        if (tx.accountTo === this.currentAccNumber) return;

        const narrative = (tx.narrative || '').toLowerCase();
        let category = 'Others';
        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(word => narrative.includes(word))) {
            category = cat;
            break;
          }
        }

        const amt = parseFloat(tx.transactionAmount?.replace(/[^0-9.]/g, '')) || 0;

        if (!monthlyData[txMonth].categories[category]) {
          monthlyData[txMonth].categories[category] = { amount: 0, count: 0 };
        }

        monthlyData[txMonth].categories[category].amount += amt;
        monthlyData[txMonth].categories[category].count += 1;
        monthlyData[txMonth].totalSpending += amt;
      });

      const summaries = Object.entries(monthlyData).map(([month, data]) => {
        const categories = Object.entries(data.categories).map(([category, info]) => ({
          category,
          amount: `$${info.amount.toFixed(2)}`,
          count: info.count,
          percentage: data.totalSpending ? (info.amount / data.totalSpending) * 100 : 0
        }));
        categories.sort((a, b) => b.percentage - a.percentage);

        return {
          month,
          totalSpending: `$${data.totalSpending.toFixed(2)}`,
          categories
        };
      }).sort((a, b) => b.month.localeCompare(a.month)); // latest first

      this.monthlySummaries = summaries;

      // Set current month summary for display
      const currentSummary = summaries.find(s => s.month === this.currentMonth) || summaries[0];
      this.spendingSummary = currentSummary?.categories || [];
      this.totalSpending = currentSummary?.totalSpending || "$0.00";

      // Update months array for tabs
      // this.months = summaries.map(s => s.month);
      if (!this.months || this.months.length === 0) {
        this.months = summaries.map(s => s.month);
      }
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

function calculateExpenses(tx, currentAccNumber) {
  // Transaction is an inflow if accountTo matches the current account number
  if (tx.accountTo !== currentAccNumber) {
    let incomeAmt = tx.transactionAmount?.toString().replace(/[^0-9.]/g, "")
    const amountValue = parseFloat(incomeAmt);
    // Return the amount if it's a valid number, otherwise 0
    return !isNaN(amountValue) ? amountValue : 0;
  }
  // Not an inflowD
  return 0;
}

function calculateIncome(tx, currentAccNumber) {
  // Transaction is an inflow if accountTo matches the current account number
  if (tx.accountTo == currentAccNumber) {
    let incomeAmt = tx.transactionAmount?.toString().replace(/[^0-9.]/g, "")
    const amountValue = parseFloat(incomeAmt);
    // Return the amount if it's a valid number, otherwise 0
    return !isNaN(amountValue) ? amountValue : 0;
  }
  // Not an inflowD
  return 0;
}
</script>
