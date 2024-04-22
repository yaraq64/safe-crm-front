<template>
  <div
    class="ui-table-cell"
    :class="[{ 'ui-table-cell--sortable': sortable }, sortClass]"
  >
    {{ name }}
    <svg viewBox="0 0 5 10" class="ui-table-cell-sort" v-if="sortable">
      <path d="M2.5 0L0 4H5L2.5 0Z" class="ui-table-cell-sort-up" />
      <path d="M2.5 10L0 6H5L2.5 10Z" class="ui-table-cell-sort-down" />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String
    },
    sortable: {
      type: Boolean,
      default: false
    },
    sorted: {
      type: String,
      default: ''
    }
  },
  computed: {
    sortClass() {
      if (this.sorted) {
        return this.sorted === 'desc'
          ? 'ui-table-cell--sortable-down'
          : 'ui-table-cell--sortable-up'
      }

      return ''
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/variables';

.ui-table-cell {
  &--sortable {
    cursor: pointer;
    user-select: none;
    transition: color $main-transition;
    &:hover {
      color: $color-red;
    }
  }
  &-sort {
    width: 5px;
    height: 10px;
    flex-shrink: 0;
    opacity: 0.7;
    margin-left: 3px;
    vertical-align: middle;
    fill: $color-gray-dark;
    transition: opacity $main-transition, fill $main-transition;
  }
  &--sortable:hover &-sort {
    opacity: 1;
  }
  &--sortable-up .ui-table-cell-sort-up,
  &--sortable-down .ui-table-cell-sort-down {
    opacity: 1;
    fill: $color-main;
  }
}
</style>
