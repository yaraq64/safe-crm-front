<template>
  <div class="ui-input" :class="{ 'ui-input--error': error }">
    <label class="ui-input-label" v-if="label">
      {{ label }}
    </label>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
    <div class="ui-input-field">
      <VueDatePicker
        v-model="value"
        :range="multiple"
        :multi-calendars="multiple"
        :format="options.format"
        :locale="options.locale"
        @update:model-value="updateVal"
        :teleport="true"
        :clearable="false"
        :readonly="disabled"
        :auto-apply="true"
        :month-picker="monthPicker"
        :hide-input-icon="true"
        :enable-time-picker="false"
        :menu-class-name="menuClasses"
        placeholder="Выберите дату"
        month-name-format="long"
        input-class-name="ui-input-content"
      >
        <template #arrow-left>
          <inlineSvg
            :src="require('@/assets/images/icons/arrow-left-icon.svg')"
          />
        </template>
        <template #arrow-right>
          <inlineSvg
            :src="require('@/assets/images/icons/arrow-right-icon.svg')"
          />
        </template>
        <template v-if="!monthPicker" #top-extra>
          <inlineSvg
            class="dp__select-arrow"
            :src="require('@/assets/images/icons/select-arrow-icon.svg')"
          />
        </template>
      </VueDatePicker>
      <div class="ui-input-date-icon">
        <inlineSvg :src="require('@/assets/images/icons/calendar-icon.svg')" />
      </div>
    </div>
  </div>
</template>

<script>
import Formatter from '@/plugins/formatter'
import InlineSvg from 'vue-inline-svg'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: { InlineSvg, VueDatePicker },
  props: {
    modelValue: { type: [String, Array, Date], default: null },
    multiple: { type: Boolean, default: false },
    monthPicker: { type: Boolean, default: false },
    error: { type: [String, Boolean], default: null },
    label: { type: String, default: null },
    minDate: { type: String, default: '' },
    maxDate: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null }
  },
  data() {
    return {
      value: ''
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
    },
    options() {
      const options = {
        format: 'dd.MM.yyyy',
        locale: 'ru-ru'
      }

      if (this.monthPicker) {
        options.format = Formatter.dateMonthYear
      }

      return options
    },
    menuClasses() {
      const classes = ['ui-calendar']
      if (this.monthPicker) {
        classes.push('ui-calendar--month-picker')
      }

      if (this.multiple) {
        classes.push('ui-calendar--multiple')
      }

      return classes.join(' ')
    }
  },
  methods: {
    updateVal(modelData) {
      this.$emit('update:modelValue', modelData)
      this.$emit('on-set')
    }
  },
  created() {
    if (this.modelValue) {
      if (typeof this.modelValue === 'string') {
        this.value = new Date(this.modelValue)
      } else if (
        typeof this.modelValue === 'object' &&
        this.modelValue.length === 2
      ) {
        this.value = [
          new Date(this.modelValue[0]),
          new Date(this.modelValue[1])
        ]
      } else {
        this.value = this.modelValue
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui {
  &-input {
    &-date {
      &-icon {
        top: 1px;
        right: 1px;
        bottom: 1px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        border-radius: 6px;
        pointer-events: none;
        fill: rgba($color-main, 0.3);
        background-color: $color-white;
        transition: fill $main-transition;
        svg {
          width: 17px;
          height: 17px;
          flex-shrink: 0;
          fill: inherit;
        }
      }
    }
    &:hover .ui-input-date-icon {
      fill: rgba($color-main, 0.7);
    }
  }
  &-calendar {
    &--month-picker {
      .dp__overlay {
        padding-left: 20px;
        padding-right: 20px;
        &_cell_active {
          color: $color-white;
          background-color: $color-red;
        }
      }
    }
  }
}
.dp {
  &--header-wrap {
    align-items: center;
    justify-content: center;
    flex-direction: row-reverse;
  }
  &--arrow-btn-nav {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: $color-white;
    box-shadow: 0px 0.74px 7.36px 0px rgba($color-black, 0.14);
    top: 50%;
    left: -16px;
    cursor: pointer;
    position: absolute;
    transition: background-color $main-transition;
    &:last-child {
      left: auto;
      right: -16px;
    }
    .ui-calendar--multiple & {
      left: -40px;
    }
    &:hover {
      background-color: $color-gray;
      .dp__inner_nav {
        background-color: transparent;
      }
    }
    &:active {
      background-color: $color-gray-medium;
    }
    svg {
      width: 12px;
      height: 12px;
      stroke: $color-main;
    }
  }
  &__instance_calendar:nth-child(2) {
    .dp--arrow-btn-nav {
      left: auto;
      right: -40px;
    }
  }
  &__input {
    @include inputField;
  }
  &__menu {
    font-size: 12px;
    font-family: inherit;
    border-radius: 5px;
    border: 1px solid $color-gray;
    box-shadow: 0px 7px 15px 0px rgba($color-black, 0.1);
    &_inner {
      padding-left: 24px;
      padding-right: 24px;
      padding-bottom: 20px;
    }
  }
  &__cell_offset {
    opacity: 0;
  }
  &__select-arrow {
    width: 9px;
    height: 5px;
    margin-left: 3px;
    stroke: $color-main;
    top: -1px;
    position: relative;
  }
  &__month_year_wrap {
    width: auto;
    justify-content: center;
    .dp__month_year_select {
      width: auto;
      padding: 0 2px;
      font-weight: bold;
    }
  }
  &__calendar {
    &_header {
      margin-bottom: 5px;
      font-weight: normal;
      text-transform: capitalize;
      color: $color-gray-dark;
      &_separator {
        display: none;
      }
      &_item {
        height: 20px;
      }
    }
    &_row {
      margin: 0;
      .dp__range_between {
        background-color: $color-gray;
      }
      .dp__cell_inner {
        border: 0;
        width: 38px;
        height: 38px;
      }
      .dp__range_start,
      .dp__range_end,
      .dp__active_date {
        color: $color-white;
        background-color: $color-red;
      }
    }
  }
}
</style>
