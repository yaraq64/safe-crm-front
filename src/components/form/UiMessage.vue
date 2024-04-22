<template>
  <div
    class="form-message"
    :class="['form-message--' + type, { 'form-message--single': isSingle }]"
    v-html="message"
  ></div>
</template>
<script>
export default {
  props: {
    message: {
      type: String
    },
    type: {
      type: String,
      default: 'error'
    },
    isSingle: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/variables';
.form-message {
  font-size: 14px;
  line-height: 1.15;
  margin: 20px 0;
  padding: 12px 15px;
  border-radius: 6px;
  color: $color-white;
  background-color: $color-gray-dark;
  &--error {
    background-color: $color-red-dark;
  }
  &--info {
    color: $color-main;
    background-color: $color-gray-medium;
  }
  &--single {
    margin: 0;
  }
}
</style>
