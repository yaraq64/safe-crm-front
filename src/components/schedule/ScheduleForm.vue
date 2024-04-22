<template>
  <ui-modal
    modalID="ScheduleForm"
    :title="editCell ? 'Изменить рабочее время' : 'Добавить рабочее время'"
  >
    <template v-slot:modalBody>
      <div class="schedule-form">
        <div class="schedule-form-options" v-if="user">
          <div class="schedule-form-option">
            {{ user.name }}
          </div>
          <div class="schedule-form-option">
            {{ date }}
          </div>
        </div>
      </div>
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
              :label="
                editCell ? 'Изменить рабочее время' : 'Добавить рабочее время'
              "
              :classes="['red']"
              :states="submitLoading ? ['loading'] : []"
              @click="submit()"
            />
          </div>
        </div>
      </div>
    </template>
  </ui-modal>
</template>

<script>
import UiModal from '@/components/popups/UiModal'
import UiButton from '@/components/form/UiButton'
// import CollectValues from '@/plugins/CollectValues'
import UiFieldset from '@/components/form/UiFieldset'

export default {
  components: {
    UiModal,
    UiButton,
    UiFieldset
  },
  data() {
    return {
      fields: {
        timeStart: {
          id: 'timeStart',
          type: 'string-input',
          value: '',
          mask: '##:##',
          name: 'Время начала работы'
        },
        hours: {
          id: 'hours',
          type: 'number-input',
          value: '',
          name: 'Количество часов работы'
        }
      },
      date: null,
      user: null,
      editCell: null,
      submitLoading: false
    }
  },
  methods: {
    showForm({ cell, data }) {
      this.date = cell.date
      this.user = cell.user
      this.editCell = data
      if (this.editCell) {
        this.fields.timeStart.value = this.editCell.start.time

        const startHour = this.editCell.start.hour
        const endHour = this.editCell.end.hour

        const hours = (() => {
          if (startHour === endHour) {
            return 24
          }

          if (endHour < startHour) {
            return 24 - startHour + endHour
          }

          return endHour - startHour
        })()
        this.fields.hours.value = hours
      }

      this.$bus.trigger('openModal', { id: 'ScheduleForm' })
    }
  },
  created() {}
}
</script>
