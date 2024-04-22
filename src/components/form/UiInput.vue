<template>
  <div class="ui-input" :class="{ 'ui-input--error': error }">
    <label class="ui-input-label" v-if="label">
      {{ label }}
    </label>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
    <div
      class="ui-input-field"
      :class="{ 'ui-input-field--with-icon': hasIcon }"
    >
      <div class="ui-input-field-icon" v-if="hasIcon">
        <slot name="icon"></slot>
      </div>
      <input
        class="ui-input-content"
        :type="inputType"
        :value="fieldValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="updateVal($event.target.value)"
        @keyup.enter="$emit('on-set')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: { default: null },
    label: { type: String, default: null },
    mask: { type: String, default: null },
    value: { default: null },
    modelValue: { default: null },
    placeholder: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    inputType: {
      default: 'text',
      validator(value) {
        const types = ['text', 'email', 'password', 'number']
        if (types.includes(value)) {
          return true
        }

        throw new Error(
          `UiInput. Неизвестный тип поля, доступные типы: ${types.join(', ')}`
        )
      }
    }
  },
  computed: {
    hasIcon() {
      return !!this.$slots.icon
    },
    errorMessage() {
      switch (this.error) {
        case 'empty-value':
          return 'Пожалуйста, заполните это поле'

        default:
          return this.error
      }
    },
    fieldValue() {
      return this.value !== null ? this.value : this.modelValue
    }
  },
  methods: {
    updateVal(val) {
      this.$emit('update:modelValue', val)
      this.$emit('on-change')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-input {
  &-content {
    @include inputField;
  }
  &--error {
    .ui-input-content {
      border-color: $color-red;
    }
  }
  &-label {
    display: block;
    font-size: 11px;
    line-height: 1.1;
    margin-bottom: 7px;
  }
  &-field {
    position: relative;
    &--with-icon {
      .ui-input-content {
        padding-left: 55px;
      }
    }
    &-icon {
      top: 0;
      left: 0;
      width: 55px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        fill: $color-gray-dark;
      }
    }
  }
  &-error {
    font-size: 14px;
    line-height: 1.1;
    margin: 0 0 5px;
    color: $color-red;
  }
}
</style>
