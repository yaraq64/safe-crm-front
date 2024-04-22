<template>
  <div>
    <div class="page-header">
      <div class="page-title">График работы</div>
      <div class="page-header-right">
        <div class="page-header-right-cell">
          <UiPopup
            :options="users.options"
            placeholder="Флористы"
            v-model="users.value"
          />
        </div>
        <div class="page-header-right-cell">
          <UiDate v-model="date.value" :month-picker="true" />
        </div>
      </div>
    </div>
    <div class="schedule">
      <div class="schedule-header">
        <div class="schedule-row">
          <div class="schedule-cell schedule-cell--first">
            <div class="schedule-cell-month"></div>
            <div class="schedule-cell-hours"></div>
          </div>
          <div class="schedule-cell" v-for="cell in cells" :key="cell.name">
            <div class="schedule-cell-month">
              {{ cell.name }}
            </div>
            <div class="schedule-cell-hours">
              <div class="schedule-cell-hour">06:00</div>
              <div class="schedule-cell-hour">12:00</div>
              <div class="schedule-cell-hour">18:00</div>
            </div>
          </div>
        </div>
      </div>
      <div class="schedule-body">
        <div
          class="schedule-row"
          v-for="row in cellsContent"
          :key="row.user.id"
        >
          <div class="schedule-cell schedule-cell--first">
            <div class="schedule-user">
              {{ row.user.name }}
            </div>
          </div>
          <div
            class="schedule-cell"
            v-for="cell in row.cells"
            :key="cell.key"
            @click="openForm(cell, null)"
          >
            <div class="schedule-cell-dots">
              <div class="schedule-cell-dot"></div>
              <div class="schedule-cell-dot"></div>
              <div class="schedule-cell-dot"></div>
            </div>
            <template v-if="cell.data">
              <ScheduleCell
                @click.stop="openForm(cell, data)"
                v-for="data in cell.data"
                :data="data"
                :key="cell.key + data.key"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <ScheduleForm ref="ScheduleForm" />
  </div>
</template>

<script>
import moment from 'moment'
import ScheduleCell from '@/components/schedule/ScheduleCell'
import ScheduleForm from '@/components/schedule/ScheduleForm'
import UiDate from '@/components/form/UiDate'
import UiPopup from '@/components/popups/UiPopup'
import exampleUsers from '@/api/work-schedule/users'
import exampleTable from '@/api/work-schedule/table'

export default {
  components: {
    UiDate,
    UiPopup,
    ScheduleCell,
    ScheduleForm
  },
  data() {
    return {
      users: {
        options: [],
        value: null
      },
      date: {
        value: new Date()
      },
      table: {}
    }
  },
  computed: {
    cells() {
      const cells = []
      const dateObject = moment(this.date.value).locale('ru')
      const days = dateObject.daysInMonth()
      for (let i = 1; i <= days; i++) {
        dateObject.date(i)

        cells.push({
          id: dateObject.format('YYYY-MM-DD'),
          name: dateObject.format('DD MMMM')
        })
      }

      return cells
    },
    cellsContent() {
      const content = []
      for (const user of this.users.options) {
        const tableRows = this.table[user.id]
        const row = {
          user,
          cells: []
        }

        for (const cell of this.cells) {
          let hasCell = false
          for (const intervalKey in tableRows) {
            if (intervalKey === cell.id) {
              const cellContent = tableRows[intervalKey]
              row.cells.push({
                user,
                date: cell.id,
                key: `${user.id}${cell.id}`,
                data: cellContent
              })

              hasCell = true
              break
            }
          }

          if (!hasCell) {
            row.cells.push({
              user,
              date: cell.id,
              key: `${user.id}${cell.id}`,
              data: null
            })
          }
        }

        content.push(row)
      }

      return content
    }
  },
  methods: {
    async loadUsers() {
      this.users.options = exampleUsers
    },
    async loadTable() {
      this.table = exampleTable
    },
    openForm(cell, data) {
      this.$refs.ScheduleForm.showForm({ cell, data })
    }
  },
  created() {
    this.loadUsers()
    this.loadTable()
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.schedule {
  width: 100%;
  overflow: auto;
  @include scrollBar;
  border-radius: 10px;
  border: solid 1px $color-gray;
  &-row {
    display: flex;
    width: max-content;
  }
  &-cell {
    width: 168px;
    flex-shrink: 0;
    position: relative;
    &--first {
      width: 230px;
      left: 0;
      z-index: 5;
      position: sticky;
      position: -webkit-sticky;
      background-color: $color-white;
    }
    &-month {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 12px 10px 6px;
    }
    &-hours {
      padding: 4px 10px;
      display: flex;
      justify-content: center;
      border-top: solid 1px $color-gray;
    }
    &-hour {
      min-width: 35px;
      text-align: center;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
    &-dots {
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      z-index: 3;
      position: absolute;
      pointer-events: none;
    }
    &-dot {
      width: 25%;
      height: 100%;
      border-right: dashed 2px rgba($color-gray, 0.6);
    }
  }
  &-header {
    font-size: 11px;
    text-align: center;
    color: $color-gray-dark;
    .schedule {
      &-cell {
        border: solid $color-gray;
        border-width: 0 1px 1px 0;
      }
    }
  }
  &-body {
    .schedule {
      &-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px;
        min-height: 68px;
        border-right: solid 1px $color-gray;
        &:last-child {
          border-right: 0;
        }
        &::before {
          content: '+';
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          font-size: 13px;
          font-weight: bold;
          color: $color-green;
          z-index: 5;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          opacity: 0;
          cursor: pointer;
          user-select: none;
          background-color: $color-white;
          border: dashed 1px $color-green;
          transition: opacity $main-transition,
            background-color $main-transition;
        }
        &:hover::before {
          opacity: 1;
        }
        &:active::before {
          background-color: rgba($color-green, 0.25);
        }
        &--first::before {
          content: none;
        }
      }
      &-row {
        &:first-child {
          .schedule-cell {
            min-height: 68px;
            padding-top: 20px;
          }
        }
        &:last-child {
          .schedule-cell {
            min-height: 68px;
            padding-bottom: 20px;
          }
        }
      }
    }
  }
  &-user {
    font-size: 13px;
    font-weight: bold;
  }
}
</style>
