<template>
  <div class="ui-checkbox" :class="{ 'ui-checkbox--error': error }">
    <div class="ui-checkbox-content" @click="toggleValue()">
      <div
        class="ui-checkbox-field"
        :class="{ 'ui-checkbox-field--on': !!modelValue }"
      >
        <inlineSvg :src="require('@/assets/images/icons/check-icon.svg')" />
      </div>
      <div class="ui-checkbox-label" v-if="label">
        {{ label }}
      </div>
    </div>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: { InlineSvg },
  props: {
    error: { default: null },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    modelValue: { type: Boolean }
  },
  computed: {
    errorMessage() {
      switch (this.error) {
        case 'empty-value':
          return 'Пожалуйста, заполните это поле'

        default:
          return this.error
      }
    }
  },
  methods: {
    toggleValue() {
      if (this.disabled) {
        return
      }

      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-set')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-checkbox {
  flex-grow: 1;
  display: flex;
  padding-bottom: 10px;
  flex-direction: column;
  justify-content: flex-end;
  &-content {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition: color $main-transition;
    &:hover {
      color: $color-red;
    }
    &:active {
      color: $color-black;
    }
  }
  &-label {
    font-size: 13px;
    font-weight: bold;
    padding-top: 2px;
  }
  &-field {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 8px;
    border-radius: 4px;
    border: solid 1px $color-main;
    background-color: $color-white;
    transition: background-color $main-transition, border-color $main-transition;
    &--on {
      background-color: $color-main;
    }
    svg {
      width: 12px;
      height: 8px;
      flex-shrink: 0;
      fill: $color-white;
    }
  }
  .ui-input-error {
    padding-top: 10px;
  }
  .form-filters-field & {
    flex-grow: 0;
    display: block;
    padding-bottom: 0;
  }
}
</style>
