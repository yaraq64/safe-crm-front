<template>
  <div class="filters">
    <div class="filters-row">
      <div
        class="filters-col filters-col--50"
        v-for="field in fields"
        :key="field.id"
      >
        <UiFieldset :field="field" v-model="field.value" />
      </div>
    </div>
    <div class="filters-actions">
      <div class="filters-actions-item">
        <ui-button
          :label="userId ? 'Сохранить' : 'Добавить'"
          :classes="['red']"
          :states="submitLoading ? ['loading'] : []"
          @click="submit()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/form/UiButton'
import CollectValues from '@/plugins/CollectValues'
import UiFieldset from '@/components/form/UiFieldset'

export default {
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  components: {
    UiButton,
    UiFieldset
  },
  data() {
    return {
      fields: [],
      submitLoading: false
    }
  },
  methods: {
    async submit() {
      this.submitLoading = true
      try {
        const { data } = await this.$axios.post('/users/submit', {
          userId: this.userId,
          mode: this.userId ? 'update' : 'create',
          fields: CollectValues(this.fields)
        })

        if (data.success) {
          this.$bus.trigger('showNotification', {
            type: 'success',
            message: this.userId
              ? 'Пользователь обновлён'
              : 'Пользователь создан'
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
    async loadFields() {
      try {
        const { data } = await this.$axios.get('/users/form-fields', {
          params: {
            userId: this.userId
          }
        })

        if (typeof data === 'object') {
          this.fields = data
        }
      } catch (error) {
        this.$bus.trigger('showNotification', {
          type: 'error',
          message: error.message,
          description: error.stack
        })
      }
    }
  },
  created() {
    this.loadFields()
  }
}
</script>
