<template>
  <div
    class="schedule-interval"
    :class="{ 'schedule-interval--small': parameters.hours < 5 }"
    :style="{ left: parameters.left + '%', width: parameters.width + '%' }"
  >
    <template v-if="parameters.hours > 9">
      <div>{{ parameters.hours }} ч</div>
      <div>
        {{ data.start.time }}
      </div>
      <div>
        {{ data.end.time }}
      </div>
    </template>
    <template v-else-if="parameters.hours > 4">
      {{ parameters.hours }}ч
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    parameters() {
      const startHour = this.data.start.hour
      const endHour = this.data.end.hour
      const hourWidth = 100 / 24
      const hours = (() => {
        if (startHour === endHour) {
          return 24
        }

        if (endHour < startHour) {
          return 24 - startHour + endHour
        }

        return endHour - startHour
      })()

      return {
        hours: hours,
        width: hourWidth * hours,
        left: startHour * hourWidth
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.schedule-interval {
  top: 5px;
  bottom: 5px;
  z-index: 4;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  position: absolute;
  border-radius: 5px;
  color: $color-green;
  font-size: 13px;
  line-height: 1.1;
  font-weight: bold;
  background-color: $color-green-light;
  border-left: solid 3px $color-green;
  &:hover {
    z-index: 5;
  }
  &--small {
    padding: 0;
  }
}
</style>
