<template>
  <div>
    <div class="page-header">
      <div class="page-title">Список заказов</div>
      <div class="page-header-right">
        <ui-button
          label="Фильтровать заказы"
          :classes="['bordered-light']"
          @click="$bus.trigger('openModal', { id: 'filterOrdersModal' })"
        >
          <template #icon>
            <inlineSvg
              :src="require('@/assets/images/icons/filter-icon.svg')"
            />
          </template>
        </ui-button>
        <ui-popup :options="exportButtons.list">
          <template #popupButton>
            <ui-button
              label="Выгрузить"
              :classes="['bordered-light']"
              :states="exportButtons.loading ? ['loading'] : []"
            >
              <template #icon>
                <inlineSvg
                  :src="require('@/assets/images/icons/document-icon.svg')"
                />
              </template>
            </ui-button>
          </template>
        </ui-popup>
      </div>
    </div>
    <UiLoader v-if="loading" />
    <ui-message :message="emptyMessage" type="info" v-else-if="emptyMessage" />
    <OrdersGroup v-else v-for="(group, key) in list" :data="group" :key="key" />
    <ui-modal modalID="filterOrdersModal" title="Фильтровать заказы">
      <template v-slot:modalBody>
        <div class="filters">
          <div class="filters-row">
            <div
              class="filters-col"
              :class="{
                'filters-col--long': [
                  'buyer_name',
                  'courier_id',
                  'florist_id',
                  'product'
                ].includes(field.id)
              }"
              v-for="field in filters"
              :key="field.id"
            >
              <UiFieldset :field="field" v-model="field.value" />
            </div>
          </div>
          <div class="filters-actions">
            <div class="filters-actions-item">
              <ui-button
                label="Фильтровать"
                :classes="['red']"
                @click="newQuery()"
              />
            </div>
            <div class="filters-actions-item">
              <ui-button
                label="Сбросить"
                :classes="['bordered-light']"
                @click="loadFilters()"
              />
            </div>
          </div>
        </div>
      </template>
    </ui-modal>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import UiLoader from '@/components/form/UiLoader'
import OrdersGroup from '@/components/orders/OrdersGroup'
import CollectValues from '@/plugins/CollectValues'
import UiFieldset from '@/components/form/UiFieldset'
import UiModal from '@/components/popups/UiModal'
import UiPopup from '@/components/popups/UiPopup'
import UiButton from '@/components/form/UiButton'
import UiMessage from '@/components/form/UiMessage.vue'

export default {
  components: {
    UiModal,
    UiLoader,
    UiPopup,
    UiButton,
    UiMessage,
    InlineSvg,
    UiFieldset,
    OrdersGroup
  },
  data() {
    return {
      list: [],
      filters: [],
      exportButtons: {
        loading: false,
        list: [
          {
            id: 'excel',
            name: 'Excel',
            icon: 'excel-icon.svg',
            action: this.export
          },
          {
            id: 'pdf',
            name: 'PDF',
            icon: 'pdf-icon.svg',
            action: this.export
          }
        ]
      },
      loading: false,
      loaded: false
    }
  },
  computed: {
    emptyMessage() {
      if (this.loaded && !this.list.length) {
        return 'Нет результатов'
      }

      return null
    }
  },
  methods: {
    async loadData(append) {
      this.loading = true

      try {
        const { data } = await this.$axios.get('/orders/load', {
          params: {
            filters: CollectValues(this.filters)
          }
        })

        if (append) {
          this.list = this.list.concat(data.list ?? [])
        } else {
          this.list = data.list ?? []
        }
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }

      this.loading = false
      this.loaded = true
    },
    async loadFilters() {
      try {
        const { data } = await this.$axios.get('/orders/filters')

        if (typeof data.list === 'object') {
          this.filters = data.list
        }
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }
    },
    newQuery() {
      this.loaded = false
      this.loadData(false)

      this.$bus.trigger('closeModal', { id: 'filterOrdersModal' })
    },
    async export(key) {
      this.exportButtons.loading = true

      try {
        const { data } = await this.$axios.get('/orders/export', {
          params: {
            key,
            filters: CollectValues(this.filters)
          }
        })

        window.open(data.url, '_blank').focus()
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }

      this.exportButtons.loading = false
    }
  },
  created() {
    this.loadData(false)
    this.loadFilters()
  }
}
</script>
