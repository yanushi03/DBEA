<template>
  <div v-if="isVisible" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" @click.self="closeModal">
    <div class="bg-white rounded-xl shadow-xl p-6 min-w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto text-gray-900">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-navy-900">Pay for Split Expense</h2>
          <p class="text-sm text-navy-500 mt-1">Choose which split expense you want to pay for</p>
        </div>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!splitExpenses || splitExpenses.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-navy-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <p class="text-navy-500 font-medium">No split expenses available</p>
        <p class="text-sm text-navy-400 mt-1">You don't have any split expenses to pay for</p>
      </div>

      <!-- Split Expenses List -->
      <div v-else class="space-y-3">
        <div
          v-for="(expense, idx) in splitExpenses"
          :key="idx"
          @click="selectExpense(expense)"
          class="p-4 border-2 border-navy-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-navy-900 text-lg">
                    {{ expense.Description || expense.Notes?.replace('Split expense for transaction: ', '') || 'Split Expense' }}
                  </p>
                  <p class="text-sm text-navy-500 mt-1">
                    {{ formatDate(expense.ExpenseDate) }}
                  </p>
                </div>
              </div>

              <!-- Payment Status -->
              <div class="flex items-center gap-2 mt-2">
                <span :class="getPaymentStatusClass(expense.PaymentStatus)" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ expense.PaymentStatus || 'Pending' }}
                </span>
              </div>

              <!-- Split Details Summary -->
              <div v-if="expense.SplitDetails && expense.SplitDetails.length > 0" class="mt-3 pt-3 border-t border-navy-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-navy-600">Split with {{ expense.TotalPeople || expense.SplitDetails.length }} people</span>
                  <span class="text-navy-600">Amount per person: 
                    <span class="font-semibold text-blue-600">
                      ${{ parseFloat(expense.SplitAmount || (expense.TotalAmount / expense.TotalPeople) || 0).toFixed(2) }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div class="text-right ml-4">
              <p class="text-xl font-bold text-red-600">
                ${{ parseFloat(expense.TotalAmount || 0).toFixed(2) }}
              </p>
              <p class="text-xs text-navy-500 mt-1">Total Amount</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end mt-6">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-navy-200 text-navy-700 rounded-lg hover:bg-navy-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date';

export default {
  name: 'PaySplitExpenseModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    splitExpenses: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate,
    
    selectExpense(expense) {
      this.$emit('select-expense', expense);
    },

    closeModal() {
      this.$emit('close');
    },

    getPaymentStatusClass(status) {
      if (!status) return 'bg-gray-100 text-gray-700';
      
      const statusLower = status.toLowerCase();
      if (statusLower.includes('paid') || statusLower.includes('complete')) {
        return 'bg-green-100 text-green-700';
      } else if (statusLower.includes('pending') || statusLower.includes('waiting')) {
        return 'bg-yellow-100 text-yellow-700';
      } else if (statusLower.includes('failed') || statusLower.includes('error')) {
        return 'bg-red-100 text-red-700';
      }
      return 'bg-gray-100 text-gray-700';
    }
  }
};
</script>

