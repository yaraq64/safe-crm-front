<template>
  <div class="product">
    <div class="product-image">
      <img :src="data.image" />
    </div>
    <div class="product-content">
      <div class="product-title">
        <a :href="data.url" target="_blank">
          {{ data.name }}
        </a>
      </div>
      <div class="product-options">
        <template v-if="data.quantity">
          {{ data.quantity }} шт =
          {{ $formatter.price(data.price * data.quantity) }}
        </template>
        <template v-else>
          {{ $formatter.price(data.price) }}
        </template>
      </div>
    </div>
    <div
      class="product-remove"
      v-if="!isReadonly && removeFunction"
      @click="removeFunction(data.id)"
    >
      <inlineSvg :src="require('@/assets/images/icons/close-icon.svg')" />
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: { InlineSvg },
  props: {
    data: { type: Object },
    isReadonly: { type: Boolean },
    removeFunction: { type: Function, default: null }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.product {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  position: relative;
  background-color: $color-gray-medium;
  &-image {
    width: 60px;
    flex-shrink: 0;
    margin-right: 20px;
    img {
      display: block;
      border-radius: 5px;
    }
  }
  &-content {
    flex-grow: 1;
    font-size: 14px;
    font-weight: bold;
  }
  &-title {
    margin-bottom: 10px;
    a {
      @include regularLink;
    }
  }
  &-remove {
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 10px;
    cursor: pointer;
    fill: $color-main;
    border: solid 1px $color-gray-dark;
    transition: fill $main-transition, border-color $main-transition,
      background-color $main-transition;
    &:hover {
      fill: $color-red;
      border-color: $color-red;
    }
    &:active {
      background-color: $color-gray-medium;
    }
    svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
  }
}
</style>
