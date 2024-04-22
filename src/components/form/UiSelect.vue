<template>
  <div
    class="ui-input"
    :class="{ 'ui-input--error': error }"
    @click.stop="clickHandler()"
  >
    <label class="ui-input-label" v-if="label">
      {{ label }}
    </label>
    <div class="ui-input-error" v-if="errorMessage" v-html="errorMessage"></div>
    <div
      class="ui-select"
      :class="{ 'ui-select--show': showOptions }"
      @click="toggleOptions()"
    >
      <input
        type="text"
        ref="searchField"
        :disabled="disabled"
        class="ui-input-content"
        v-if="searchable && search.action"
        v-model="search.query"
        placeholder="Введите запрос для поиска"
        @input="searchOptions()"
      />
      <div
        v-else
        class="ui-input-content"
        :class="{ 'ui-input-content--placeholder': !modelValue }"
      >
        {{ modelValue?.name ?? placeholder }}
      </div>
      <inlineSvg
        :src="require('@/assets/images/icons/select-arrow-icon.svg')"
        class="form-select-shape"
      />
      <div class="ui-select-options" v-if="showOptions">
        <template v-if="!optionsList.length"> Список пуст </template>
        <div
          v-else
          class="ui-select-option"
          :class="{ 'ui-select-option--chosen': option.id == modelValue?.id }"
          v-for="option in optionsList"
          :key="option.id"
          @click.stop="choseOption(option)"
        >
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: { InlineSvg },
  props: {
    modelValue: { type: [Object, null], default: null },
    fieldId: { type: String, default: null },
    error: { default: false },
    searchable: { type: Boolean, default: false },
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    options: { type: Array }
  },
  data() {
    return {
      search: {
        query: '',
        action: false,
        timeout: null
      },
      optionsList: [],
      uuid: '',
      showOptions: false
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
    choseOption(option) {
      this.$emit('update:modelValue', option)
      this.$emit('on-set')
      this.hideOptions()
    },
    async toggleOptions() {
      if (this.disabled) {
        return
      }

      if (this.searchable) {
        this.showOptions = true
        this.search.action = true
        await this.$nextTick()
        this.$refs.searchField.focus()
      } else {
        this.showOptions = !this.showOptions
      }
    },
    hideOptions(data = null) {
      if (data && data.uuid === this.uuid) {
        return
      }

      this.showOptions = false
      this.search.action = false
    },
    searchOptions() {
      clearTimeout(this.search.timeout)

      this.search.timeout = setTimeout(async () => {
        const { data } = await this.$axios.get(
          '/orders/load-searchable-options',
          {
            params: {
              field: this.fieldId,
              needle: this.search.query
            }
          }
        )

        this.optionsList = data || []
      }, 600)
    },
    clickHandler() {
      this.uuid = crypto.randomUUID()
      this.$bus.trigger('hidePopups', { uuid: this.uuid })
    }
  },
  created() {
    this.optionsList = this.options
    this.$bus.on('hidePopups', this.hideOptions)
    document.addEventListener('click', this.hideOptions)
  },
  beforeUnmount() {
    this.$bus.off('hidePopups', this.hideOptions)
    document.removeEventListener('click', this.hideOptions)
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';
.ui-select {
  cursor: pointer;
  user-select: none;
  position: relative;
  &-options {
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    min-width: 150px;
    position: absolute;
    padding: 10px 15px;
    overflow: auto;
    @include scrollBar;
    max-height: 200px;
    font-size: 14px;
    border-radius: 6px;
    border: solid 1px $color-gray;
    background-color: $color-white;
  }
  &-option {
    padding: 3px 0;
    transition: color $main-transition;
    &--chosen {
      font-weight: bold;
      color: $color-red;
    }
    &:hover {
      color: $color-red;
    }
    &:active {
      color: $color-red-dark;
    }
  }
  .ui-input-content {
    padding-right: 48px;
  }
  .form-select-shape {
    pointer-events: none;
    top: calc(50% - 2px);
    right: 21px;
    position: absolute;
  }
  &:hover .form-select-shape {
    transform: translate3d(0, 2px, 0);
  }
  &:active .form-select-shape {
    transform: translate3d(0, 4px, 0);
  }
  &--show {
    z-index: 5;
    .form-select-shape {
      transform: rotate(180deg);
    }
    &:hover .form-select-shape {
      transform: rotate(180deg) translate3d(0, 2px, 0);
    }
    &:active .form-select-shape {
      transform: rotate(180deg) translate3d(0, 4px, 0);
    }
  }
}
</style>
