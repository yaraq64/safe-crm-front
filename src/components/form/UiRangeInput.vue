<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="ui-range" :class="{ 'ui-input--error': error }">
    <label class="ui-input-label" v-if="label">
      {{ label }}
    </label>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
    <div class="ui-range-fields">
      <div class="ui-range-field">
        <ui-input
          v-model="modelValue.from"
          :input-type="inputType"
          :disabled="disabled"
          :placeholder="placeholder.from"
        />
      </div>
      <div class="ui-range-field">
        <ui-input
          v-model="modelValue.to"
          :input-type="inputType"
          :disabled="disabled"
          :placeholder="placeholder.to"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/form/UiInput'

export default {
  components: { UiInput },
  props: {
    modelValue: { type: Object },
    error: { default: null },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: Object, default: () => {} },
    inputType: {
      default: 'text',
      validator(value) {
        if (['text', 'email', 'password', 'number'].includes(value)) {
          return true
        }

        throw new Error('Invalid prop type')
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
    updateVal(val) {
      if (this.disabled) {
        return
      }

      this.$emit('update:modelValue', val)
      this.$emit('on-set')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-range {
  &-fields {
    display: flex;
    margin: 0 -5px;
  }
  &-field {
    flex-grow: 1;
    padding: 0 5px;
  }
}
</style>
