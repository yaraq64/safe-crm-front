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
        <ui-button
          label="Добавить заказ"
          :classes="['bordered']"
          @click="$bus.trigger('openModal', { id: 'addOrderModal' })"
        >
          <template #icon>
            <inlineSvg :src="require('@/assets/images/icons/plus-icon.svg')" />
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
    <ui-message :message="emptyMessage" type="info" v-if="emptyMessage" />
    <ui-table v-else :loading="loading">
      <template v-slot:header>
        <div class="ui-table-row">
          <UiTableHeadCell name="Номер заказа" />
          <UiTableHeadCell
            name="Дата оформления"
            :sortable="true"
            :sorted="sortDirection('created')"
            @click="choseSort('created')"
          />
          <UiTableHeadCell name="Заказчик" />
          <UiTableHeadCell
            name="Сумма"
            :sortable="true"
            :sorted="sortDirection('amount')"
            @click="choseSort('amount')"
          />
          <UiTableHeadCell name="Флорист" />
          <UiTableHeadCell name="Курьер" />
          <UiTableHeadCell name="Статус администратора" />
          <UiTableHeadCell name="Тип доставки" />
          <UiTableHeadCell
            name="Дата доставки/самовывоза"
            :sortable="true"
            :sorted="sortDirection('deliveryDate')"
            @click="choseSort('deliveryDate')"
          />
        </div>
      </template>
      <template v-slot:body>
        <div
          class="ui-table-row"
          :class="'ui-table-row--state-' + order.state"
          v-for="order in list"
          :key="order.number"
          @click="
            $router.push({ name: 'orderPage', params: { id: order.number } })
          "
        >
          <div
            class="ui-table-cell"
            :class="'ui-table-cell--state-' + order.state"
          >
            id {{ order.number }}
          </div>
          <div class="ui-table-cell">
            {{ order.created.date }}
            <span class="ui-table-normal">{{ order.created.time }}</span>
          </div>
          <div class="ui-table-cell">
            <div class="ui-table-line">
              {{ order.customer.name }}
            </div>
            <div class="ui-table-line ui-table-line--aline ui-table-normal">
              {{ order.customer.phone }}
            </div>
          </div>
          <div class="ui-table-cell">
            <div class="ui-table-line">{{ order.amount }} ₽</div>
            <div class="ui-table-line ui-table-line--aline">
              <UiBage
                icon="amount"
                :colored="order.state === 'green'"
                :name="order.status.name"
                :state="order.status.state"
              />
            </div>
          </div>
          <div class="ui-table-cell">
            <div class="ui-table-line">{{ order.florist.name }}</div>
            <div class="ui-table-line ui-table-line--aline">
              <UiBage
                icon="box"
                :colored="order.state === 'green'"
                :name="order.florist.status.name"
                :state="order.florist.status.state"
              />
            </div>
          </div>
          <div class="ui-table-cell">
            <div class="ui-table-line">{{ order.courier.name }}</div>
            <div class="ui-table-line ui-table-line--aline">
              <UiBage
                icon="location"
                :colored="order.state === 'green'"
                :name="order.courier.status.name"
                :state="order.courier.status.state"
              />
            </div>
          </div>
          <div class="ui-table-cell">
            {{ order.adminStatus }}
          </div>
          <div class="ui-table-cell">
            {{ order.delivery.type }}
          </div>
          <div class="ui-table-cell">
            {{ order.delivery.date }}
            <span class="ui-table-normal">{{ order.delivery.time }}</span>
          </div>
        </div>
      </template>
    </ui-table>
    <ui-pagination
      v-model="page"
      :pages="pages"
      :click-handler="loadData"
      :loading="loading"
    />
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
import CollectValues from '@/plugins/CollectValues'
import UiFieldset from '@/components/form/UiFieldset'
import UiBage from '@/components/bages/UiBage'
import UiTable from '@/components/table/UiTable'
import UiTableHeadCell from '@/components/table/UiTableHeadCell'
import UiModal from '@/components/popups/UiModal'
import UiPopup from '@/components/popups/UiPopup'
import UiButton from '@/components/form/UiButton'
import UiMessage from '@/components/form/UiMessage'
import UiPagination from '@/components/nav/UiPagination'

export default {
  components: {
    UiBage,
    UiModal,
    UiPopup,
    UiTable,
    UiTableHeadCell,
    UiButton,
    UiMessage,
    InlineSvg,
    UiFieldset,
    UiPagination
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
      sort: {
        by: 'amount',
        dir: 'desc'
      },
      page: 0,
      pages: 0,
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
            page: this.page,
            sortBy: this.sort.by,
            sortDir: this.sort.dir,
            filters: CollectValues(this.filters)
          }
        })

        if (append) {
          this.list = this.list.concat(data.list ?? [])
        } else {
          this.list = data.list ?? []
          this.pages = data.pages ?? 0
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
    choseSort(field) {
      if (this.sort.by === field) {
        this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc'
      } else {
        this.sort.by = field
        this.sort.dir = 'desc'
      }

      this.newQuery()
    },
    newQuery() {
      this.page = 0
      this.loaded = false
      this.loadData(false)

      this.$bus.trigger('closeModal', { id: 'filterOrdersModal' })
    },
    sortDirection(field) {
      if (this.sort.by === field) {
        return this.sort.dir
      }

      return ''
    },
    async export(key) {
      this.exportButtons.loading = true

      try {
        const { data } = await this.$axios.get('/orders/export', {
          params: {
            key,
            sortBy: this.sort.by,
            sortDir: this.sort.dir,
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
