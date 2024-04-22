<template>
  <div class="ui-popup" @click.stop>
    <div
      class="ui-popup-button"
      @click="toggleOptions()"
      ref="button"
      v-if="hasButtonSlot"
    >
      <slot name="popupButton" />
    </div>
    <div class="ui-popup-field" @click="toggleOptions()" ref="button" v-else>
      <div class="ui-popup-field-icon" v-if="icon">
        <inlineSvg :src="require('@/assets/images/icons/' + icon)" />
      </div>
      <div class="ui-popup-field-content">
        {{ modelValue?.name ?? placeholder }}
      </div>
      <inlineSvg
        :src="require('@/assets/images/icons/select-arrow-icon.svg')"
        class="form-select-shape"
      />
    </div>
    <transition name="ui-modal-animation">
      <div
        class="ui-popup-body"
        ref="popup"
        v-if="showOptions"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
      >
        <div class="ui-popup-chosen" v-if="modelValue" @click="toggleOptions()">
          <div class="ui-popup-option ui-popup-option--disabled">
            <div class="ui-popup-option-icon" v-if="modelValue.icon || icon">
              <inlineSvg
                v-if="modelValue.icon"
                :src="require('@/assets/images/icons/' + modelValue.icon)"
              />
              <inlineSvg
                v-else
                :src="require('@/assets/images/icons/' + icon)"
              />
            </div>
            <div class="ui-popup-option-name">
              {{ modelValue?.name }}
            </div>
            <inlineSvg
              :src="require('@/assets/images/icons/select-arrow-icon.svg')"
              class="form-select-shape"
            />
          </div>
        </div>
        <div class="ui-popup-list">
          <ui-message
            message="Список пуст"
            type="info"
            :is-single="true"
            v-if="!options.length"
          />
          <template v-else>
            <div
              class="ui-popup-option"
              v-for="option in options"
              @click="choseOption(option)"
              :key="option.id"
            >
              <div class="ui-popup-option-icon" v-if="option.icon || icon">
                <inlineSvg
                  v-if="option.icon"
                  :src="require('@/assets/images/icons/' + option.icon)"
                />
                <inlineSvg
                  v-else
                  :src="require('@/assets/images/icons/' + icon)"
                />
              </div>
              <div class="ui-popup-option-name">
                {{ option.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
    <transition name="ui-modal-animation">
      <div class="page-overlay" v-if="showOptions" @click="hideOptions()"></div>
    </transition>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import UiMessage from '@/components/form/UiMessage'

export default {
  components: { InlineSvg, UiMessage },
  props: {
    options: { type: Array },
    icon: { type: String, default: null },
    placeholder: { type: String, default: null },
    modelValue: { type: Object }
  },
  data() {
    return {
      uuid: null,
      showOptions: false,
      position: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    hasButtonSlot() {
      return !!this.$slots.popupButton
    }
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions
      if (this.showOptions) {
        document.body.classList.add('deny-overflow')
        this.setPosition()
      } else {
        document.body.classList.remove('deny-overflow')
      }
    },
    choseOption(option) {
      this.$emit('update:modelValue', option)
      this.$emit('on-set')
      this.hideOptions()
      if (typeof option.action === 'function') {
        option.action(option.id)
      }
    },
    hideOptions(data = null) {
      if (data && data.uuid === this.uuid) {
        return
      }

      this.showOptions = false
      document.body.classList.remove('deny-overflow')
    },
    clickHandler() {
      this.uuid = crypto.randomUUID()
      this.$bus.trigger('hidePopups', { uuid: this.uuid })
    },
    async setPosition() {
      await this.$nextTick()
      const buttonPosition = this.$refs.button.getBoundingClientRect()
      if (!this.hasButtonSlot) {
        this.$refs.popup.style.width = `${buttonPosition.width}px`
        await this.$nextTick()
      }

      const popupPosition = this.$refs.popup.getBoundingClientRect()

      const windowSize = { x: window.innerWidth, y: window.innerHeight }
      const popupSize = { x: popupPosition.width, y: popupPosition.height }
      const basePosition = {
        x: buttonPosition.left,
        y: buttonPosition.top
      }
      const position = { x: basePosition.x, y: basePosition.y }

      if (basePosition.x + popupSize.x > windowSize.x) {
        position.x = basePosition.x + buttonPosition.width - popupSize.x
      }

      if (window.innerHeight < popupPosition.height + position.y) {
        this.$refs.popup.style.height = `${
          window.innerHeight - position.y - 60
        }px`
      }

      this.position = position
    }
  },
  created() {
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

.ui-popup {
  position: relative;
  &-body {
    display: flex;
    flex-direction: column;
    width: 160px;
    z-index: 10;
    position: fixed;
    border-radius: 5px;
    background-color: $color-white;
    box-shadow: 0px 18px 90px 0px #00387726;
  }
  &-chosen {
    padding: 7px 15px;
    border-bottom: solid 1px $color-gray;
    .form-select-shape {
      transform: rotate(180deg);
    }
  }
  &-list {
    overflow: auto;
    @include scrollBar;
    padding: 16px 12px;
  }
  &-option {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    cursor: pointer;
    user-select: none;
    border-radius: 5px;
    transition: color $main-transition, background-color $main-transition,
      fill $main-transition;
    &-icon {
      width: 18px;
      height: 20px;
      display: flex;
      flex-shrink: 0;
      margin-right: 15px;
      align-items: center;
      justify-content: center;
      svg {
        fill: inherit;
        max-width: 100%;
        max-height: 100%;
      }
    }
    &-name {
      flex-grow: 1;
      font-size: 14px;
      font-weight: bold;
    }
    &:hover {
      fill: $color-blue;
      color: $color-blue;
      background-color: $color-gray-medium;
    }
    &:active {
      background-color: $color-gray;
    }
    &--disabled:hover {
      background-color: transparent;
    }
  }
  &-field {
    display: flex;
    align-items: center;
    padding: 17px 22px;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
    border: solid 1px $color-gray;
    transition: color $main-transition, border-color $main-transition,
      background-color $main-transition;
    .page-header & {
      min-width: 490px;
    }
    &-icon {
      width: 18px;
      height: 20px;
      flex-shrink: 0;
      fill: $color-main;
      margin-right: 15px;
    }
    &-content {
      flex-grow: 1;
      font-size: 14px;
      line-height: 1.15;
      font-weight: bold;
    }
    &:hover {
      border-color: rgba($color-black, 0.4);
    }
    &:active {
      background-color: $color-gray;
    }
    .form-select-shape {
      margin-left: 50px;
    }
  }
}
</style>
