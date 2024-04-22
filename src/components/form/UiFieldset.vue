<!-- eslint-disable vue/no-mutating-props -->
<template>
  <template v-if="field.type === 'select'">
    <ui-select
      v-model="field.value"
      :label="field.name"
      :error="field.error"
      :field-id="field.id"
      :options="field.options"
      :searchable="field.searchable"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
    />
  </template>
  <template v-else-if="field.type === 'range-input'">
    <ui-range-input
      v-model="field.value"
      input-type="number"
      :error="field.error"
      :label="field.name"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
    />
  </template>
  <template v-else-if="field.type === 'date'">
    <ui-date
      v-model="field.value"
      :label="field.name"
      :error="field.error"
      :multiple="field.multiple"
      :min-date="field.minDate"
      :max-date="field.maxDate"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
    />
  </template>
  <template v-else-if="field.type === 'radio'">
    <ui-radio
      v-model="field.value"
      :label="field.name"
      :error="field.error"
      :options="field.options"
      :disabled="field.disabled"
    />
  </template>
  <template v-else-if="field.type === 'checkbox'">
    <ui-checkbox
      v-model="field.value"
      :label="field.name"
      :error="field.error"
      :disabled="field.disabled"
    />
  </template>
  <template v-else>
    <ui-input
      v-model="field.value"
      :input-type="inputType"
      :error="field.error"
      :mask="field.mask"
      :label="field.name"
      :placeholder="field.placeholder"
      :disabled="field.disabled"
    />
  </template>
</template>

<script>
import UiDate from '@/components/form/UiDate'
import UiRadio from '@/components/form/UiRadio'
import UiInput from '@/components/form/UiInput'
import UiSelect from '@/components/form/UiSelect'
import UiCheckbox from '@/components/form/UiCheckbox'
import UiRangeInput from '@/components/form/UiRangeInput'

export default {
  components: {
    UiDate,
    UiRadio,
    UiInput,
    UiSelect,
    UiCheckbox,
    UiRangeInput
  },
  props: {
    field: { type: Object },
    modelValue: { default: null }
  },
  methods: {
    updateVal(val) {
      this.$emit('update:modelValue', val)
    }
  },
  computed: {
    inputType() {
      switch (this.field.type) {
        case 'number-input':
          return 'number'

        default:
          return 'text'
      }
    }
  }
}
</script>
