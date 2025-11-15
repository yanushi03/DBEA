<template>
  <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[90vw] text-gray-900">
      <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
      <div class="mb-4">
        <slot>
          <div>{{ modalContent }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    modalTitle: String,
    modalContent: String
  }
}
</script>
