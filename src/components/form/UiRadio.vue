<template>
  <div class="ui-input" :class="{ 'ui-input--error': error }">
    <label class="ui-input-label" v-if="label">
      {{ label }}
    </label>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
    <div class="ui-radio">
      <div
        class="ui-radio-option"
        :class="{ 'ui-radio-option--active': !!modelValue }"
        @click="choseOption(true)"
      >
        {{ options[1] }}
      </div>
      <div
        class="ui-radio-toggler"
        :class="
          modelValue ? 'ui-radio-toggler--left' : 'ui-radio-toggler--right'
        "
        @click="choseOption(!modelValue)"
      ></div>
      <div
        class="ui-radio-option"
        :class="{ 'ui-radio-option--active': !modelValue }"
        @click="choseOption(false)"
      >
        {{ options[0] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: { type: String, default: null },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    modelValue: { type: Boolean },
    options: {
      type: Array,
      validator(value) {
        if (value.length !== 2) {
          throw new Error('UiRadio. Количество значений должно быть = 2')
        }

        return true
      }
    }
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
    choseOption(value) {
      if (this.disabled) {
        return
      }

      this.$emit('update:modelValue', value)
      this.$emit('on-set')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-radio {
  display: flex;
  align-items: center;
  min-height: 44px;
  &-option {
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    letter-spacing: 0.2px;
    color: $color-gray-dark;
    transition: color $main-transition;
    &:hover {
      color: $color-main;
    }
    &:active {
      color: $color-red-dark;
    }
    &--active {
      font-weight: bold;
      letter-spacing: 0;
      color: $color-main;
    }
  }
  &-toggler {
    width: 30px;
    height: 18px;
    flex-shrink: 0;
    position: relative;
    cursor: pointer;
    user-select: none;
    margin: 0 6px;
    border-radius: 11px;
    background-color: rgba($color-black, 0.05);
    transition: background-color $main-transition;
    &:hover {
      background-color: rgba($color-black, 0.14);
    }
    &:active {
      background-color: rgba($color-black, 0.21);
    }
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 6px;
      top: 3px;
      left: 3px;
      position: absolute;
      background-color: $color-main;
      transition: transform $main-transition;
    }
    &--right::before {
      transform: translate3d(12px, 0, 0);
    }
  }
}
</style>
