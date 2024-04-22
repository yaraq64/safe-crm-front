<template>
  <div>
    <ui-message :message="emptyMessage" type="info" v-if="emptyMessage" />
    <ui-table v-else :loading="loading">
      <template v-slot:header>
        <div class="ui-table-row">
          <UiTableHeadCell
            :name="column.name"
            v-for="(column, key) in columns"
            :key="key"
          />
        </div>
      </template>
      <template v-slot:body>
        <div class="ui-table-row" v-for="(row, key) in list" :key="key">
          <div
            class="ui-table-cell"
            :class="{ 'ui-table-cell--short': column.id === 'id' }"
            v-for="column in row"
            :key="column.id"
          >
            <template v-if="columns[column.id].type === 'select'">
              <ui-select
                @on-set="rowChanged(row)"
                v-model="column.value"
                :field-id="column.id"
                :options="columns[column.id].options"
                :searchable="columns[column.id].searchable"
                :placeholder="columns[column.id].placeholder"
              />
            </template>
            <template v-else>
              <ui-input
                @on-change="rowChanged(row)"
                v-model="column.value"
                :disabled="columns[column.id].disabled"
                :input-type="
                  columns[column.id].type === 'number-input' ? 'number' : 'text'
                "
                :placeholder="columns[column.id].placeholder"
              />
            </template>
          </div>
        </div>
      </template>
    </ui-table>
    <div
      class="filters-actions filters-actions--offset-top filters-actions--sticky filters-actions--sticky-bottom"
    >
      <div class="filters-actions-item">
        <ui-button :classes="['bordered']" @click="addRow()">
          <template #icon>
            <inlineSvg :src="require('@/assets/images/icons/plus-icon.svg')" />
          </template>
        </ui-button>
      </div>
      <div class="filters-actions-item">
        <ui-button
          label="Сохранить"
          :classes="['bordered']"
          :states="submitLoading ? ['loading'] : []"
          @click="submit()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import UiInput from '@/components/form/UiInput'
import UiSelect from '@/components/form/UiSelect'
import UiButton from '@/components/form/UiButton'
import UiMessage from '@/components/form/UiMessage'
import UiTable from '@/components/table/UiTable'
import UiTableHeadCell from '@/components/table/UiTableHeadCell'

export default {
  props: {
    type: {
      type: String,
      default: null
    }
  },
  components: {
    InlineSvg,
    UiInput,
    UiSelect,
    UiButton,
    UiMessage,
    UiTable,
    UiTableHeadCell
  },
  data() {
    return {
      list: [],
      columns: [],
      changedRows: {},
      newRows: [],
      loading: false,
      loaded: false,
      submitLoading: false
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
    async loadData() {
      this.newRows = []
      this.changedRows = {}
      this.loading = true

      try {
        const { data } = await this.$axios.get('/directories/load', {
          params: { type: this.type }
        })

        if (typeof data.list === 'object') {
          this.list = data.list
          this.columns = data.columns
        }

        this.loaded = true
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }

      this.loading = false
    },
    async submit() {
      this.submitLoading = true

      try {
        const { data } = await this.$axios.post('/directories/save', {
          type: this.type,
          list: this.changedRows,
          newRows: this.newRows,
          columns: this.columns
        })

        if (data.success) {
          this.$bus.trigger('showNotification', {
            type: 'success',
            message: 'Словарь обновлён'
          })
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
    async addRow() {
      const row = []
      for (const key in this.columns) {
        const fieldData = {
          id: key,
          value: ''
        }

        if (key === 'id') {
          fieldData.isNew = true
        }

        row.push(fieldData)
      }

      this.list.push(row)
      this.newRows.push(row)
      await this.$nextTick()

      window.scrollTo({
        top: document.body.offsetHeight,
        behavior: 'smooth'
      })
    },
    rowChanged(row) {
      for (const field of row) {
        if (field.id === 'id' && !field.isNew) {
          this.changedRows[field.value] = row
          break
        }
      }
    }
  },
  watch: {
    type(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loadData()
      }
    }
  },
  created() {
    this.loadData()
  }
}
</script>
