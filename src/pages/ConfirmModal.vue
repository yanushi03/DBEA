<template>
  <div v-if="isVisible" class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[90vw] text-gray-900">
      <h3 class="text-lg font-semibold mb-3">{{ title }}</h3>
      <div class="mb-4 text-sm text-gray-700">{{ message }}</div>
      <div class="flex justify-end gap-2">
        <button @click="$emit('cancel')" class="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
        <button @click="$emit('confirm')" class="px-4 py-2 rounded bg-blue-600 text-white">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    isVisible: { type: Boolean, default: false },
    message: { type: String, default: '' },
    title: { type: String, default: 'Confirm' }
  }
};
</script>
