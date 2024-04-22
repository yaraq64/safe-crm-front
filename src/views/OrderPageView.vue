<template>
  <div class="order-page">
    <div class="order-page-back" @click="$router.push('/')">
      <inlineSvg :src="require('@/assets/images/icons/arrow-left-icon.svg')" />
      Назад к заказам
    </div>
    <div class="order-page-group">
      <div class="order-page-header">
        <div class="order-page-header-left">
          <div class="page-title">Заказ id {{ orderId }}</div>
          <div class="order-page-options" v-if="orderData">
            <div class="order-page-option" v-if="orderData.deliveryDate">
              {{ orderData.deliveryDate }}
            </div>
            <div class="order-page-option" v-if="orderData.deliveryTime">
              {{ orderData.deliveryTime }}
            </div>
            <div class="order-page-option" v-if="orderData.deliveryType">
              {{ orderData.deliveryType }}
            </div>
          </div>
        </div>
        <div class="order-page-header-right" v-if="userRole === 'admin'">
          <ui-popup :options="deleteOrderOptions">
            <template #popupButton>
              <div class="order-page-remove">
                <inlineSvg
                  :src="require('@/assets/images/icons/delete-icon.svg')"
                />
                Удалить
              </div>
            </template>
          </ui-popup>
        </div>
      </div>
    </div>
    <template v-if="this.orderId">
      <OrdersForm :order-number="this.orderId" v-model="orderFields" />
    </template>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import UiPopup from '@/components/popups/UiPopup'
import OrdersForm from '@/components/orders/OrdersForm'
import userStore from '@/store/user'
import Formatter from '@/plugins/formatter'

export default {
  components: {
    UiPopup,
    InlineSvg,
    OrdersForm
  },
  data() {
    return {
      orderFields: null,
      deleteOrderOptions: [
        {
          id: true,
          name: 'Да',
          action: this.deleteOrder
        },
        {
          id: false,
          name: 'Нет',
          action: 'empty'
        }
      ]
    }
  },
  computed: {
    orderId() {
      return this.$route.params.id
    },
    orderData() {
      if (!this.orderFields) {
        return null
      }

      const data = {
        deliveryDate: '',
        deliveryTime: '',
        deliveryType: ''
      }

      for (const field of this.orderFields) {
        if (field.id === 'delivery_date') {
          data.deliveryDate = Formatter.date(new Date(field.value))
        } else if (field.id === 'delivery_time') {
          data.deliveryTime = field.value?.id
        } else if (field.id === 'delivery_type') {
          data.deliveryType = field.options[field.value ? 1 : 0]
        }
      }

      return data
    },
    userRole() {
      return userStore.getters.userRole
    }
  },
  methods: {
    deleteOrder() {
      this.$axios.post(`/orders/delete/${this.orderNumber}`)
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.order-page {
  position: relative;
  border-radius: 5px;
  border: 1px solid $color-gray;
  &-back {
    top: -9px;
    left: 20px;
    cursor: pointer;
    padding: 4px 10px;
    user-select: none;
    position: absolute;
    color: $color-red;
    stroke: $color-red;
    line-height: 1;
    font-size: 14px;
    font-weight: bold;
    background-color: $color-white;
    transition: color $main-transition, stroke $main-transition;
    svg {
      width: 13px;
      height: 10px;
      flex-shrink: 0;
      margin-right: 12px;
      transition: transform $main-transition;
    }
    &:hover {
      color: $color-main;
      stroke: $color-main;
      svg {
        transform: translate3d(-5px, 0, 0);
      }
    }
    &:active {
      color: $color-gray-dark;
      stroke: $color-gray-dark;
      svg {
        transform: translate3d(-9px, 0, 0);
      }
    }
  }
  &-group {
    padding: 30px;
    border-bottom: 1px solid $color-gray;
    &:last-child {
      border-bottom: 0;
    }
  }
  &-header {
    display: flex;
    padding-top: 10px;
    &-left {
      flex-grow: 1;
    }
    &-right {
      flex-shrink: 0;
      margin-left: 30px;
    }
  }
  &-options {
    display: flex;
    padding-top: 5px;
  }
  &-option {
    font-size: 18px;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
  &-remove {
    display: flex;
    align-items: center;
    fill: $color-red;
    color: $color-red;
    cursor: pointer;
    user-select: none;
    line-height: 1;
    font-size: 14px;
    font-weight: bold;
    transition: color $main-transition, fill $main-transition;
    &:hover {
      fill: $color-main;
      color: $color-main;
    }
    &:active {
      fill: $color-red-dark;
      color: $color-red-dark;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-right: 12px;
      fill: inherit;
    }
  }
  .orders {
    &-form {
      &-group {
        padding-top: 40px;
        padding-bottom: 40px;
      }
    }
    &-products {
      padding-top: 0;
    }
  }
}
</style>
