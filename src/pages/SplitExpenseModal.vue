<template>
  <div v-if="isVisible" class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" @click.self="closeModal">
    <div class="bg-white rounded-xl shadow-xl p-6 min-w-[400px] max-w-[90vw] text-gray-900">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-navy-900">Split Expense</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Transaction Info -->
      <div class="mb-6 p-4 bg-navy-50 rounded-lg">
        <p class="text-sm text-navy-600 mb-1">Transaction</p>
        <p class="font-semibold text-navy-900">{{ transaction.narrative }}</p>
        <p class="text-sm text-navy-500 mt-1">{{ formatDate(transaction.transactionDate) }}</p>
        <p class="text-lg font-bold text-red-600 mt-2">{{ transaction.transactionAmount }}</p>
      </div>

      <!-- Phone Number Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-navy-700 mb-2">
          Enter Phone Number
        </label>
        <div class="flex gap-2">
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="e.g., 91234567"
            class="flex-1 border border-navy-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="addPhoneNumber"
          />
          <button
            @click="addPhoneNumber"
            :disabled="!phoneNumber || isChecking"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isChecking ? 'Checking...' : 'Add' }}
          </button>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 text-sm mt-2">{{ successMessage }}</p>
      </div>

      <!-- Added Phone Numbers List -->
      <div v-if="phoneNumbers.length > 0" class="mb-6">
        <p class="text-sm font-medium text-navy-700 mb-2">Split with:</p>
        <div class="space-y-2">
          <div
            v-for="(phone, index) in phoneNumbers"
            :key="index"
            class="flex items-center justify-between p-3 bg-navy-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">{{ phone.name ? phone.name.charAt(0).toUpperCase() : phone.number.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-medium text-navy-900">{{ phone.name || 'Unknown' }}</p>
                <p class="text-sm text-navy-500">{{ phone.number }}</p>
              </div>
            </div>
            <button
              @click="removePhoneNumber(index)"
              class="text-red-500 hover:text-red-700 p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Split Amount Info -->
      <div v-if="phoneNumbers.length > 0" class="mb-6 p-4 bg-blue-50 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-sm text-navy-700">Amount per person:</span>
          <span class="text-lg font-bold text-blue-600">{{ splitAmount }}</span>
        </div>
        <p class="text-xs text-navy-500 mt-1">
          Total: {{ transaction.transactionAmount }} ÷ {{ phoneNumbers.length + 1 }} people
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-navy-200 text-navy-700 rounded-lg hover:bg-navy-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmSplit"
          :disabled="phoneNumbers.length === 0 || isSubmitting"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Processing...' : 'Confirm Split' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPhoneNumberExists } from '@/api/outsystems';
import { formatDate } from '@/utils/date';

export default {
  name: 'SplitExpenseModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    transaction: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      phoneNumber: '',
      phoneNumbers: [],
      errorMessage: '',
      successMessage: '',
      isChecking: false,
      isSubmitting: false
    };
  },
  computed: {
    splitAmount() {
      if (!this.transaction.transactionAmount || this.phoneNumbers.length === 0) {
        return '$0.00';
      }
      
      // Extract numeric value from transaction amount (e.g., "-$5000" -> 5000)
      const amountStr = this.transaction.transactionAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr);
      
      if (isNaN(amount)) {
        return '$0.00';
      }
      
      // Split between user + all added phone numbers
      const totalPeople = this.phoneNumbers.length + 1;
      const splitValue = amount / totalPeople;
      
      return `$${splitValue.toFixed(2)}`;
    },
    
    // Get numeric split amount for API
    numericSplitAmount() {
      if (!this.transaction.transactionAmount || this.phoneNumbers.length === 0) {
        return 0;
      }
      
      const amountStr = this.transaction.transactionAmount.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr);
      
      if (isNaN(amount)) {
        return 0;
      }
      
      const totalPeople = this.phoneNumbers.length + 1;
      return amount / totalPeople;
    },
    
    // Get total numeric amount
    totalNumericAmount() {
      if (!this.transaction.transactionAmount) {
        return 0;
      }
      
      const amountStr = this.transaction.transactionAmount.replace(/[^0-9.]/g, '');
      return parseFloat(amountStr) || 0;
    }
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) {
        // Reset form when modal closes
        this.phoneNumber = '';
        this.phoneNumbers = [];
        this.errorMessage = '';
        this.successMessage = '';
      }
    }
  },
  methods: {
    formatDate,
    
    async addPhoneNumber() {
      if (!this.phoneNumber.trim()) {
        this.errorMessage = 'Please enter a phone number';
        return;
      }

      // Check if already added
      if (this.phoneNumbers.some(p => p.number === this.phoneNumber.trim())) {
        this.errorMessage = 'This phone number is already added';
        return;
      }

      this.isChecking = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const phoneNum = this.phoneNumber.trim();
        const customerData = await checkPhoneNumberExists(phoneNum);
        
        if (customerData) {
          // Phone number exists, add to list
          // Store MemberId - try different possible field names
          const memberId = customerData.MemberId || 
                          customerData.memberId || 
                          customerData.CustomerId || 
                          customerData.customerId || 
                          customerData.Id || 
                          customerData.id || 
                          null;
          
          this.phoneNumbers.push({
            number: phoneNum,
            name: customerData.name || customerData.customerName || customerData.FullName || null,
            customerId: memberId,
            memberId: memberId, // Store both for compatibility
            email: customerData.email || customerData.Email || customerData.emailAddress || null,
            phone: customerData.phone || customerData.Phone || customerData.PhoneNumber || customerData.phoneNumber || phoneNum
          });
          this.phoneNumber = '';
          this.successMessage = 'Phone number added successfully';
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        } else {
          this.errorMessage = 'Phone number not found in database';
        }
      } catch (error) {
        console.error('Error checking phone number:', error);
        this.errorMessage = 'Error checking phone number. Please try again.';
      } finally {
        this.isChecking = false;
      }
    },

    removePhoneNumber(index) {
      this.phoneNumbers.splice(index, 1);
    },

    async confirmSplit() {
      if (this.phoneNumbers.length === 0) {
        this.errorMessage = 'Please add at least one phone number';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';

      try {
        // Emit event with split data including numeric values
        this.$emit('confirm-split', {
          transaction: this.transaction,
          phoneNumbers: this.phoneNumbers,
          splitAmount: this.splitAmount,
          numericSplitAmount: this.numericSplitAmount,
          totalAmount: this.totalNumericAmount,
          totalPeople: this.phoneNumbers.length + 1
        });
        
        // Don't close modal here - let parent handle it after API call
      } catch (error) {
        console.error('Error confirming split:', error);
        this.errorMessage = 'Error processing split. Please try again.';
        this.isSubmitting = false;
      }
    },

    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

