<template>
  <div class="bg-gradient-to-br from-navy-50 to-navy-100 min-h-screen py-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden border border-navy-100">
        <div class="bg-gradient-to-r from-navy-600 to-navy-700 px-8 py-6">
          <h1 class="text-2xl font-semibold text-white">My Profile</h1>
          <p class="text-navy-100 mt-2">
            Review and manage your personal and account information.
          </p>
        </div>

        <div class="p-8 space-y-8">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <i class="fas fa-spinner fa-spin text-navy-600 text-2xl"></i>
          </div>

          <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <div v-else-if="profile" class="space-y-8">
            <section>
              <h2 class="text-lg font-semibold text-navy-900 mb-4">Personal Information</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Full Name</p>
                  <p class="text-lg font-medium text-navy-900">{{ profile.FullName || "N/A" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Email</p>
                  <p class="text-lg font-medium text-navy-900">{{ profile.Email || "N/A" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Phone Number</p>
                  <p class="text-lg font-medium text-navy-900">
                    {{ formattedPhoneNumber }}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 class="text-lg font-semibold text-navy-900 mb-4">Account Details</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Account ID</p>
                  <p class="text-lg font-medium text-navy-900">{{ profile.AccountId || "N/A" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Customer ID</p>
                  <p class="text-lg font-medium text-navy-900">{{ profile.CustomerId || "N/A" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-navy-500 uppercase tracking-wide">Balance</p>
                  <p class="text-lg font-semibold text-navy-900">{{ formattedBalance }}</p>
                </div>
              </div>
            </section>
          </div>

          <div v-else class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            No profile information available.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountDetails } from "../api/outsystems";
import { getAccountId } from "../router/auth";

export default {
  name: "Profile",
  data() {
    return {
      loading: true,
      error: null,
      profile: null,
    };
  },
  computed: {
    formattedBalance() {
      if (!this.profile || this.profile.Balance === undefined || this.profile.Balance === null) {
        return "₦0.00";
      }
      const balance = Number(this.profile.Balance);
      if (Number.isNaN(balance)) {
        return "₦0.00";
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
    },
    formattedPhoneNumber() {
      if (!this.profile || !this.profile.PhoneNumber) {
        return "N/A";
      }
      const digits = this.profile.PhoneNumber.toString();
      return digits.replace(/(\d{3})(\d{3})(\d{4})(.*)/, (match, p1, p2, p3, rest) => {
        const base = `${p1} ${p2} ${p3}`;
        return rest ? `${base} ${rest}` : base;
      });
    },
  },
  async created() {
    const accountId = getAccountId();

    if (!accountId) {
      this.error = "Unable to load profile. Please log in again.";
      this.loading = false;
      return;
    }

    try {
      const response = await getAccountDetails(accountId);
      this.profile = response;
    } catch (err) {
      this.error = "We couldn't retrieve your profile information right now. Please try again later.";
      console.error("Profile fetch failed:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.2);
}
</style>

