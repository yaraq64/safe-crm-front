<template>
  <div class="ui-table" :class="{ 'ui-table--loading': loading }">
    <UiLoader v-if="loading" />
    <div class="ui-table-header" @click="scrollToTop()">
      <slot name="header" />
    </div>
    <div class="ui-table-body">
      <slot name="body" />
    </div>
  </div>
</template>

<script>
import UiLoader from '@/components/form/UiLoader'

export default {
  components: {
    UiLoader
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-table {
  width: 100%;
  display: table;
  line-height: 1.1;
  border-radius: 10px;
  border-spacing: 0 3px;
  border-collapse: separate;
  border: solid 1px $color-gray;
  &--loading {
    min-height: 100px;
    position: relative;
    .ui-loader {
      top: 0;
      right: 0;
      left: -3px;
      z-index: 6;
      height: 100%;
      padding-top: 20px;
      position: absolute;
      background-color: rgba($color-white, 0.9);
    }
  }
  &-header {
    top: 0;
    z-index: 4;
    position: sticky;
    font-size: 11px;
    display: table-header-group;
    background-color: $color-white;
    .ui-table-cell {
      padding-top: 12px;
      padding-bottom: 12px;
      border-bottom: solid 1px $color-gray;
    }
  }
  &-body {
    font-size: 13px;
    font-weight: 500;
    display: table-row-group;
    .ui-table-cell {
      padding-top: 25px;
      padding-bottom: 25px;
      border-bottom: solid 1px $color-gray;
      transition: border-color $main-transition;
    }
    .ui-table-row:last-child .ui-table-cell {
      border-bottom: 0;
      &:first-child {
        border-bottom-left-radius: 10px;
      }
      &:last-child {
        border-bottom-right-radius: 10px;
      }
    }
  }
  &-row {
    display: table-row;
    position: relative;
    &::before {
      content: '';
      width: 3px;
      height: 24px;
      top: 20px;
      left: -1.5px;
      border-radius: 8px;
      position: absolute;
      user-select: none;
    }
    &--state {
      @include orderStates;
    }
  }
  &-cell {
    padding-left: 12px;
    padding-right: 12px;
    display: table-cell;
    &:first-child {
      padding-left: 24px;
      border-left: solid 3px $color-white;
    }
    &:last-child {
      padding-right: 24px;
      border-right: solid 3px $color-white;
    }
    &--state {
      @include orderTextStates;
    }
    &--right-align {
      text-align: right;
    }
    &--short {
      width: 90px;
    }
  }
  &-body &-row:hover &-cell {
    border-bottom-color: $color-gray-dark;
  }
  &-normal {
    font-size: 90%;
    font-weight: normal;
  }
  &-line {
    margin-bottom: 8px;
    &--aline {
      min-height: 26px;
      display: flex;
      align-items: center;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    margin-right: 6px;
    border-radius: 4px;
    display: inline-flex;
    vertical-align: middle;
    background-color: $color-main;
    &--green {
      background-color: $color-green;
    }
    &--orange {
      background-color: $color-orange;
    }
  }
  &-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    fill: $color-main;
    transition: fill $main-transition;
    svg {
      width: 16px;
      height: 16px;
      fill: inherit;
    }
    &:hover {
      fill: $color-red;
    }
    &:active {
      fill: $color-gray-dark;
    }
  }
}
</style>
