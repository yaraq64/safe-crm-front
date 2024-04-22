<template>
  <div>
    <div class="form-filters">
      <div class="form-filters-field form-filters-field--long">
        <ui-input
          v-model="filters.search.value"
          input-type="text"
          :placeholder="filters.search.placeholder"
          @on-set="newQuery()"
        >
          <template #icon>
            <inlineSvg
              :src="require('@/assets/images/icons/search-icon.svg')"
            />
          </template>
        </ui-input>
      </div>
      <div class="form-filters-field form-filters-field--short">
        <ui-select
          v-model="filters.role.value"
          :options="filters.role.options"
          :placeholder="filters.role.placeholder"
          @on-set="newQuery()"
        />
      </div>
      <div class="form-filters-field form-filters-field--short">
        <div class="form-filters-field-content">
          <ui-checkbox
            v-model="filters.activity.value"
            :label="filters.activity.placeholder"
            @on-set="newQuery()"
          />
        </div>
      </div>
    </div>
    <ui-message :message="emptyMessage" type="info" v-if="emptyMessage" />
    <ui-table v-else :loading="loading">
      <template v-slot:header>
        <div class="ui-table-row">
          <UiTableHeadCell name="ФИО" />
          <UiTableHeadCell name="Номер телефона" />
          <UiTableHeadCell name="Должность" />
          <UiTableHeadCell name="Роль в системе" />
          <UiTableHeadCell name="Активность" />
          <UiTableHeadCell name="" />
        </div>
      </template>
      <template v-slot:body>
        <div class="ui-table-row" v-for="user in list" :key="user.id">
          <div class="ui-table-cell">
            {{ user.name }}
          </div>
          <div class="ui-table-cell">
            {{ user.phone }}
          </div>
          <div class="ui-table-cell">
            {{ user.state }}
          </div>
          <div class="ui-table-cell">
            {{ user.role }}
          </div>
          <div class="ui-table-cell">
            <template v-if="user.status === 'active'">
              <div class="ui-table-dot ui-table-dot--green"></div>
              Активен
            </template>
            <template v-else>
              <div class="ui-table-dot ui-table-dot--orange"></div>
              Не активен
            </template>
          </div>
          <div class="ui-table-cell ui-table-cell--right-align">
            <div
              class="ui-table-edit"
              @click="$emit('call-user-modal', { user: user.id })"
            >
              <inlineSvg
                :src="require('@/assets/images/icons/pencil-icon.svg')"
              />
            </div>
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
  </div>
</template>

<script>
import CollectValues from '@/plugins/CollectValues'
import UiInput from '@/components/form/UiInput'
import UiSelect from '@/components/form/UiSelect'
import UiCheckbox from '@/components/form/UiCheckbox'
import UiMessage from '@/components/form/UiMessage.vue'
import UiPagination from '@/components/nav/UiPagination.vue'
import UiTable from '@/components/table/UiTable'
import UiTableHeadCell from '@/components/table/UiTableHeadCell'
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    UiInput,
    UiSelect,
    UiMessage,
    UiCheckbox,
    UiTable,
    UiTableHeadCell,
    UiPagination,
    InlineSvg
  },
  data() {
    return {
      list: [],
      filters: {
        search: {
          id: 'search',
          type: 'string-input',
          value: '',
          placeholder: 'Поиск по ФИО или номеру телефона'
        },
        activity: {
          id: 'activity',
          type: 'checkbox',
          value: false,
          placeholder: 'Активность'
        },
        role: {
          id: 'role',
          type: 'select',
          options: [
            {
              id: 'admin',
              name: 'Администратор'
            },
            {
              id: 'courier',
              name: 'Курьер'
            },
            {
              id: 'logistician',
              name: 'Логист'
            }
          ],
          value: null,
          placeholder: 'Роль'
        }
      },
      page: 0,
      pages: 0,
      loaded: false,
      loading: false
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
        const { data } = await this.$axios.get('/users/load', {
          params: {
            page: this.page,
            filters: CollectValues(Object.values(this.filters))
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
    newQuery() {
      this.page = 0
      this.loaded = false
      this.loadData(false)
    }
  },
  created() {
    this.loadData(false)
  }
}
</script>
