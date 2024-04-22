<template>
  <div class="ui-button" :class="outputClasses">
    <slot name="icon"></slot>
    <div class="ui-button-label" v-if="label">
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    classes: {
      type: Array,
      default: () => []
    },
    label: {
      type: String
    },
    states: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    outputClasses() {
      return [
        !this.label ? 'ui-button--short' : null,
        ...this.classes.map((item) => `ui-button--${item}`),
        ...this.states.map((item) => `ui-button--state-${item}`)
      ]
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-button {
  color: $color-main;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 500;
  min-height: 54px;
  border-radius: 6px;
  border: solid 1px transparent;
  transition: color $main-transition, background-color $main-transition,
    border-color $main-transition, fill $main-transition;
  &--block {
    width: 100%;
  }
  &--small {
    min-height: 40px;
    border-radius: 5px;
    padding-top: 9px;
    padding-bottom: 9px;
  }
  &--short {
    padding-left: 20px;
    padding-right: 20px;
  }
  &--white {
    border-color: $color-gray;
    background-color: $color-white;
    &:hover {
      fill: $color-red;
      color: $color-red;
    }
    &:active {
      background-color: $color-gray;
    }
  }
  &--red {
    fill: $color-white;
    color: $color-white;
    background-color: $color-red;
    &:hover {
      background-color: $color-red-dark;
    }
    &:active {
      background-color: lighten($color-red, 10%);
    }
  }
  &--bordered {
    fill: $color-main;
    border-color: $color-main;
    background-color: transparent;
    &:hover {
      border-color: $color-gray;
      background-color: $color-gray-medium;
    }
    &:active {
      background-color: $color-gray;
    }
    &-light {
      fill: $color-main;
      border-color: $color-gray;
      background-color: transparent;
      &:hover {
        border-color: $color-main;
        background-color: $color-gray-medium;
      }
      &:active {
        background-color: $color-gray;
      }
    }
    &-red {
      color: $color-red;
      fill: $color-red;
      border-color: $color-red;
      background-color: transparent;
      &:hover {
        color: $color-white;
        border-color: $color-red;
        background-color: $color-red;
      }
      &:active {
        background-color: $color-red-dark;
      }
    }
    &-green {
      color: $color-green;
      fill: $color-green;
      border-color: $color-green;
      background-color: transparent;
      &-disabled {
        cursor: default;
        &:hover,
        &:active {
          color: $color-green;
          fill: $color-green;
          border-color: $color-green;
          background-color: transparent;
        }
      }
    }
  }
  &--state {
    &-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &.btn {
        &--white {
          fill: $color-main;
          color: $color-main;
          border-color: $color-main;
          background-color: $color-white;
        }
        &--red {
          fill: $color-white;
          color: $color-white;
          background-color: $color-red;
        }
      }
    }
    &-loading {
      fill: $color-white;
      color: $color-white;
      overflow: hidden;
      position: relative;
      pointer-events: none;
      border-color: transparent;
      background-color: $color-gray-dark;
      &:after {
        content: '';
        display: block;
        width: 100px;
        height: 300px;
        position: absolute;
        left: -200px;
        top: -120px;
        z-index: 1;
        background-color: $color-white;
        background: linear-gradient(
          to right,
          rgba($color-white, 0) 0%,
          rgba($color-white, 0.2) 33%,
          rgba($color-white, 0.6) 50%,
          rgba($color-white, 0.2) 66%,
          rgba($color-white, 0) 100%
        );
        transform: rotate(-55deg);
        animation: glitter 2s cubic-bezier(0.4, 0, 0, 1) infinite;
      }
    }
  }
  &-label {
    padding-top: 3px;
  }
  svg {
    fill: inherit;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 14px;
    &:last-child {
      margin-right: 0;
    }
  }
}

@keyframes glitter {
  0% {
    left: -50%;
  }
  100% {
    left: 150%;
  }
}
</style>
