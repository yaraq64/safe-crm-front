<template>
  <div class="orders-form">
    <div class="orders-form-group">
      <div class="filters" v-if="!orderNumber">
        <div class="filters-row filters-row--nowrap">
          <div
            class="filters-col"
            :class="{
              'filters-col--long': field.id === 'product_extended'
            }"
            v-for="field in productFields"
            :key="field.id"
          >
            <UiFieldset :field="field" v-model="field.value" />
          </div>
          <div class="filters-col filters-col--short">
            <ui-input
              input-type="text"
              label="Стоимость за еденицу"
              :disabled="true"
              :value="productForm.price"
            />
          </div>
          <div class="filters-col filters-col--short">
            <ui-input
              input-type="text"
              label="Сумма"
              :disabled="true"
              :value="productForm.amount"
            />
          </div>
          <div class="filters-col filters-col--short filters-col--bottom">
            <ui-button
              label="Добавить"
              @click="addProduct()"
              :classes="['bordered-red', 'small']"
              :states="products.loading ? ['loading'] : []"
            />
          </div>
        </div>
      </div>
      <div class="orders-products" v-if="products.list.length || orderNumber">
        <div class="orders-products-label" v-if="orderNumber">
          Состав заказа
        </div>
        <div class="orders-products-row">
          <div
            class="orders-products-col"
            v-for="product in products.list"
            :key="product.id"
          >
            <OrdersProduct
              :data="product"
              :is-readonly="!!orderNumber"
              :remove-function="removeProduct"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="orders-form-group">
      <div class="filters">
        <div class="filters-row">
          <template v-for="field in fieldsByDelivery" :key="field.id">
            <div
              class="filters-col"
              :class="{
                'filters-col--full': field.id === 'post_card_text',
                'filters-col--75': field.id === 'address'
              }"
            >
              <UiFieldset :field="field" v-model="field.value" />
            </div>
            <div class="filters-col" v-if="field.id === 'delivery_time'"></div>
          </template>
        </div>
        <div class="filters-actions">
          <template v-if="userRole === 'admin'">
            <div class="filters-actions-item">
              <ui-button
                :label="orderNumber ? 'Сохранить' : 'Создать заказ'"
                :classes="['red']"
                :states="submitLoading ? ['loading'] : []"
                @click="submit()"
              />
            </div>
          </template>
          <template v-else-if="userRole === 'florist' && orderNumber">
            <div class="filters-actions-item" v-if="!orderState">
              <ui-button
                label="Принять в работу"
                :classes="['bordered']"
                :states="submitLoading ? ['loading'] : []"
                @click="setOrderState('takeTheJob')"
              />
            </div>
            <div
              class="filters-actions-item"
              v-else-if="
                ['takeTheJob', 'assembledAndCompleted', 'sendToPrint'].includes(
                  orderState
                )
              "
            >
              <ui-button
                label="Принят в работу"
                :classes="[
                  'bordered',
                  'bordered-green',
                  'bordered-green-disabled'
                ]"
              >
                <template #icon>
                  <inlineSvg
                    :src="
                      require('@/assets/images/icons/check-circle-icon.svg')
                    "
                  />
                </template>
              </ui-button>
            </div>
            <div
              class="filters-actions-item"
              v-if="orderState === 'takeTheJob'"
            >
              <ui-button
                label="Собран и укомплектован"
                :classes="['bordered']"
                :states="submitLoading ? ['loading'] : []"
                @click="setOrderState('assembledAndCompleted')"
              />
            </div>
            <template
              v-else-if="
                ['assembledAndCompleted', 'sendToPrint'].includes(orderState)
              "
            >
              <div class="filters-actions-item">
                <ui-button
                  label="Собран и укомплектован"
                  :classes="[
                    'bordered',
                    'bordered-green',
                    'bordered-green-disabled'
                  ]"
                >
                  <template #icon>
                    <inlineSvg
                      :src="
                        require('@/assets/images/icons/check-circle-icon.svg')
                      "
                    />
                  </template>
                </ui-button>
              </div>
              <div class="filters-actions-item">
                <ui-button
                  v-if="orderState === 'assembledAndCompleted'"
                  label="Отправить на печать"
                  :classes="['bordered']"
                  :states="submitLoading ? ['loading'] : []"
                  @click="setOrderState('sendToPrint')"
                />
                <ui-button
                  v-else
                  label="Отправлен на печать"
                  :classes="['bordered', 'bordered-green']"
                  :states="submitLoading ? ['loading'] : []"
                  @click="setOrderState('sendToPrint')"
                >
                  <template #icon>
                    <inlineSvg
                      :src="
                        require('@/assets/images/icons/check-circle-icon.svg')
                      "
                    />
                  </template>
                </ui-button>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import CollectValues from '@/plugins/CollectValues'
import UiButton from '@/components/form/UiButton'
import UiInput from '@/components/form/UiInput'
import UiFieldset from '@/components/form/UiFieldset'
import OrdersProduct from '@/components/orders/OrdersProduct'
import userStore from '@/store/user'

export default {
  components: {
    UiInput,
    UiButton,
    InlineSvg,
    UiFieldset,
    OrdersProduct
  },
  props: {
    modelValue: { type: Object, default: null },
    orderNumber: { type: String, default: null }
  },
  data() {
    return {
      fields: [],
      productFields: {
        product: {
          id: 'product_extended',
          name: 'Наименование товара',
          placeholder: 'Введите название товара илии ссылку',
          type: 'select',
          searchable: true,
          options: [],
          error: false,
          value: ''
        },
        quantity: {
          id: 'quantity',
          name: 'Количество',
          placeholder: 'Введите кол-во',
          type: 'number-input',
          error: false,
          value: ''
        }
      },
      products: {
        list: []
      },
      orderState: '',
      submitLoading: false
    }
  },
  computed: {
    productForm() {
      const data = {
        price: 0,
        amount: 0
      }

      if (this.productFields.product.value) {
        data.price = this.productFields.product.value.price
        data.amount =
          this.productFields.product.value.price *
          this.productFields.quantity.value
      }

      return data
    },
    fieldsByDelivery() {
      const deliveryField = this.fields.find(
        (field) => field.id === 'delivery_type'
      )
      if (!deliveryField) {
        return this.fields
      }

      if (deliveryField.value) {
        return this.fields.filter(
          (field) => !field.tag || field.tag === 'courier'
        )
      }

      return this.fields.filter((field) => field.tag !== 'courier')
    },
    userRole() {
      return userStore.getters.userRole
    }
  },
  methods: {
    async loadFields() {
      const { data } = await this.$axios.get('/orders/form-fields', {
        params: {
          orderNumber: this.orderNumber
        }
      })

      if (typeof data.list === 'object') {
        this.fields = data.list
        this.products.list = data.products || []
        this.orderState = data.orderState || 'sendToPrint'
        this.$emit('update:modelValue', this.fields)
      }
    },
    async submit() {
      this.submitLoading = true

      try {
        const { data } = await this.$axios.post('/orders/submit', {
          orderNumber: this.orderNumber,
          mode: this.orderNumber ? 'update' : 'create',
          fields: CollectValues(this.fields),
          products: this.products.list.map(({ id, quantity }) => {
            return {
              id,
              quantity
            }
          })
        })

        if (data.success) {
          this.$bus.trigger('showNotification', {
            type: 'success',
            message: 'Заказ создан'
          })

          this.$bus.trigger('closeModal', { id: 'addOrderModal' })
        } else {
          this.$bus.trigger('showNotification', {
            type: 'error',
            message: data.message
          })
        }
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }

      this.submitLoading = false
    },
    async setOrderState(mode) {
      this.submitLoading = true

      try {
        const { data } = await this.$axios.post('/orders/submit', {
          orderNumber: this.orderNumber,
          mode
        })

        if (data.success) {
          this.$bus.trigger('showNotification', {
            type: 'success',
            message: 'Заказ принят в работу'
          })

          this.$bus.trigger('closeModal', { id: 'addOrderModal' })
        } else {
          this.$bus.trigger('showNotification', {
            type: 'error',
            message: data.message
          })
        }
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }

      this.submitLoading = false
    },
    async addProduct() {
      this.products.list.push({
        id: this.productFields.product.value.id,
        name: this.productFields.product.value.name,
        url: this.productFields.product.value.url,
        quantity: this.productFields.quantity.value,
        price: this.productFields.product.value.price,
        image: this.productFields.product.value.image
      })
    },
    removeProduct(id) {
      for (let index = 0; index < this.products.list.length; index++) {
        const element = this.products.list[index]
        if (element.id === id) {
          this.products.list.splice(index, 1)
          break
        }
      }
    }
  },
  created() {
    this.loadFields()
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.orders {
  &-form {
    &-group {
      padding: 20px 30px;
      border-bottom: 1px solid $color-gray;
      &:last-child {
        border-bottom: 0;
      }
      .filters-row:last-child {
        margin-bottom: -20px;
      }
    }
  }
  &-products {
    padding-top: 20px;
    &-label {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    &-row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -10px -20px;
    }
    &-col {
      display: flex;
      flex-direction: column;
      width: 33.333%;
      padding: 0 10px;
      margin-bottom: 20px;
    }
  }
}
</style>
