<template>
  <transition name="ui-modal-animation">
    <div
      class="ui-modal"
      @click.self="close()"
      v-if="modalActive"
      :class="'ui-modal--' + modalID"
    >
      <transition name="ui-modal-animation-inner">
        <div class="ui-modal-inner" v-if="modalActive">
          <div class="ui-modal-close" @click="close()">
            <inlineSvg :src="require('@/assets/images/icons/close-icon.svg')" />
          </div>
          <div class="ui-modal-overlay">
            <div class="ui-modal-header">
              <div class="ui-modal-title" v-if="title" v-html="title"></div>
            </div>
            <div
              class="ui-modal-body"
              :class="{ 'ui-modal-body--no-padding': noBodyPadding }"
            >
              <slot name="modalBody" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  props: {
    modalID: { type: String, required: true },
    title: { type: String, default: '' },
    noBodyPadding: { type: Boolean, default: false }
  },
  data() {
    return {
      modalActive: false
    }
  },
  methods: {
    close() {
      this.modalActive = false
      document.body.classList.remove('deny-overflow')
    },
    openEvent(data) {
      if (data.id === this.modalID) {
        setTimeout(() => {
          this.modalActive = true
          document.body.classList.add('deny-overflow')
        })
      }
    },
    closeEvent(data) {
      if (data.id === this.modalID) {
        this.close()
      }
    }
  },
  created() {
    this.$bus.on('openModal', this.openEvent)
    this.$bus.on('closeModal', this.closeEvent)
  },
  beforeUnmount() {
    this.$bus.off('openModal', this.openEvent)
    this.$bus.off('closeModal', this.closeEvent)
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 15;
  position: fixed;
  top: 0;
  left: 0;
  padding-right: 54px;
  background-color: rgba($color-main, 0.14);
  &-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    border-radius: 12px;
    position: relative;
    margin: -5px;
    padding: 5px;
    background-color: $color-white;
  }
  &-overlay {
    overflow: auto;
    max-height: calc(100vh - 60px);
    @include scrollBar;
  }
  &--addOrderModal &-inner {
    max-width: 1220px;
  }
  &--filterOrdersModal &-inner {
    max-width: 1020px;
  }
  &--addUserModal &-inner {
    max-width: 820px;
  }
  &--ScheduleForm &-inner {
    max-width: 500px;
  }
  &-close {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: $color-white;
    cursor: pointer;
    user-select: none;
    top: 0;
    left: calc(100% + 10px);
    position: absolute;
    transition: background-color $main-transition;
    svg {
      width: 20px;
      height: 20px;
      fill: $color-main;
      transition: transform $main-transition;
    }
    &:hover {
      background-color: $color-gray-medium;
      svg {
        transform: rotate(90deg);
      }
    }
    &:active {
      background-color: $color-gray;
    }
  }
  &-header {
    display: flex;
    padding: 40px 40px 6px;
  }
  &-body {
    padding: 20px 40px 40px;
    &--no-padding {
      padding-top: 0;
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 20px;
    }
  }
  &-title {
    font-size: 30px;
    line-height: 1.1;
    font-weight: bold;
  }
}
</style>
