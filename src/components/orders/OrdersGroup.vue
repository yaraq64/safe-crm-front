<template>
  <div class="orders-group" :class="{ 'orders-group--show-body': showBody }">
    <div class="orders-group-header" @click="toggleBody()">
      <div class="orders-group-header-title">
        {{ data.title }}
      </div>
      <div class="orders-group-header-description">
        заказов: {{ data.orders.length }}
      </div>
      <inlineSvg
        :src="require('@/assets/images/icons/select-arrow-icon.svg')"
        class="orders-group-header-arrow"
      />
    </div>
    <transition name="ui-modal-animation">
      <div class="orders-group-body" v-if="showBody">
        <div class="orders-group-row">
          <div
            class="orders-group-col"
            v-for="order in data.orders"
            :key="order.number"
          >
            <OrderCard :orderData="order" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import OrderCard from '@/components/orders/OrderCard'

export default {
  components: {
    InlineSvg,
    OrderCard
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      showBody: false
    }
  },
  methods: {
    toggleBody() {
      this.showBody = !this.showBody
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.orders-group {
  margin-bottom: 10px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f5f4f3 0%, #f1f2f6 100%);
  &-header {
    display: flex;
    align-items: center;
    font-size: 24px;
    padding: 18px 30px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color $main-transition;
    &:hover {
      background-color: $color-gray;
    }
    &:active {
      background-color: $color-gray-medium;
    }
    &-title {
      min-width: 200px;
      margin-right: 40px;
    }
    &-description {
      margin-right: 40px;
    }
    &-arrow {
      width: 16px;
      height: 9px;
      flex-shrink: 0;
      margin-left: auto;
      stroke: rgba($color-main, 0.8);
      transition: transform $main-transition;
    }
    &:hover &-arrow {
      transform: translate3d(0, 3px, 0);
    }
  }
  &-body {
    padding: 10px 30px 30px;
    background-color: transparent;
  }
  &--show-body {
    .orders-group {
      &-header-arrow {
        transform: rotate(180deg) !important;
      }
    }
  }
  &-row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px -10px;
  }
  &-col {
    display: flex;
    flex-direction: column;
    width: 25%;
    padding: 0 5px;
    margin-bottom: 10px;
  }
}
</style>
