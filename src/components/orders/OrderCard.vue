<template>
  <div
    class="order-card"
    @click="
      $router.push({ name: 'orderPage', params: { id: orderData.number } })
    "
  >
    <div
      class="order-card-content"
      :class="'order-card-content--state-' + orderData.state"
    >
      <div class="order-card-section">
        <div class="order-card-section-item">
          <div class="order-card-section-label">Номер заказа</div>
          <div
            class="order-card-section-value"
            :class="'order-card-section-value--state-' + orderData.state"
          >
            id {{ orderData.number }}
          </div>
        </div>
        <div class="order-card-section-item">
          <div class="order-card-section-label">Статус администратора</div>
          <div class="order-card-section-value">
            {{ orderData.adminStatus }}
          </div>
        </div>
        <div class="order-card-section-item order-card-section-item--full">
          <div class="order-card-section-label">Товар</div>
          <div
            class="order-card-section-value"
            v-for="(product, key) in orderData.products"
            :key="key"
          >
            <a :href="product.url" @click.stop target="_blank">
              {{ product.name }}
            </a>
          </div>
        </div>
      </div>
      <div class="order-card-section">
        <div class="order-card-section-item order-card-section-item--full">
          <div class="order-card-section-label">Склад</div>
          <div class="order-card-section-value">
            {{ orderData.store || '-' }}
          </div>
        </div>
        <div class="order-card-section-item">
          <div class="order-card-section-label">Дата оформления</div>
          <div class="order-card-section-value">
            {{ orderData.created.date }}
            <span class="order-card-section-normal">{{
              orderData.created.time
            }}</span>
          </div>
        </div>
        <div class="order-card-section-item">
          <div class="order-card-section-label">Дата доставки/самовывоза</div>
          <div class="order-card-section-value">
            {{ orderData.delivery.date }}
            <span class="order-card-section-normal">{{
              orderData.delivery.time
            }}</span>
          </div>
        </div>
        <div class="order-card-section-item">
          <UiBage
            icon="location"
            :colored="orderData.state === 'green'"
            :name="orderData.courier.status.name"
            :state="orderData.courier.status.state"
          />
        </div>
        <div class="order-card-section-item">
          <UiBage
            icon="box"
            :colored="orderData.state === 'green'"
            :name="orderData.florist.status.name"
            :state="orderData.florist.status.state"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiBage from '@/components/bages/UiBage'

export default {
  components: {
    UiBage
  },
  props: {
    orderData: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.order-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
  position: relative;
  border-radius: 5px;
  background-color: $color-white;
  box-shadow: 0px 1px 2px 0px rgba($color-black, 0.08);
  transition: box-shadow $main-transition, opacity $main-transition;
  &:hover {
    z-index: 4;
    box-shadow: 0px 5px 20px 0px rgba($color-black, 0.01);
  }
  &:active {
    opacity: 0.7;
  }
  &-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px 18px 5px;
    border-radius: 3px;
    &::before {
      content: '';
      width: 2px;
      top: 30px;
      bottom: 30px;
      left: -1.5px;
      border-radius: 8px;
      position: absolute;
      user-select: none;
    }
    &--state {
      @include orderStates;
    }
  }
  &-section {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
    &-item {
      flex-grow: 1;
      min-width: 40%;
      max-width: 60%;
      padding: 0 10px;
      margin-bottom: 17px;
      &--full {
        width: 100%;
        max-width: 100%;
      }
    }
    &-label {
      color: $color-gray-dark;
      font-size: 11px;
      margin-bottom: 3px;
    }
    &-value {
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0.02em;
      margin-bottom: 2px;
      &:last-child {
        margin-bottom: 0;
      }
      &--state {
        @include orderTextStates;
      }
      a {
        border-bottom: solid 1px rgba($color-main, 0.3);
        transition: color $main-transition, border-color $main-transition;
        &:hover {
          color: $color-black;
          border-color: transparent;
        }
        &:active {
          color: $color-gray-dark;
        }
      }
    }
    &-normal {
      font-size: 90%;
      font-weight: normal;
      white-space: nowrap;
    }
  }
}
</style>
