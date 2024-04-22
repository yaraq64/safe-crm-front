<template>
  <div class="ui-tabs">
    <div class="ui-tabs-nav">
      <div
        class="ui-tabs-nav-item"
        :class="{ 'ui-tabs-nav-item--chosen': tab.key === chosenTab }"
        v-for="tab in tabs"
        :key="tab.key"
        @click="setTab(tab)"
      >
        {{ tab.name }}
      </div>
    </div>
    <div class="ui-tabs-content">
      <div class="ui-tabs-item" v-if="showedTab">
        <slot :name="`tabs-content-${showedTab.key}`"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array
    },
    modelValue: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chosenTab: null
    }
  },
  computed: {
    showedTab() {
      return this.tabs.find((tab) => tab.key === this.chosenTab)
    }
  },
  methods: {
    setTab(tab) {
      this.$emit('update:modelValue', tab.key)
    }
  },
  created() {
    if (this.modelValue) {
      const tabIsExists = this.tabs.find((tab) => tab.key === this.modelValue)
      if (tabIsExists) {
        this.chosenTab = this.modelValue
        this.setTab(tabIsExists)
      } else {
        this.setTab(this.tabs[0])
      }
    } else {
      this.setTab(this.tabs[0])
    }
  },
  watch: {
    modelValue: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.chosenTab = newValue
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-tabs {
  &-nav {
    display: flex;
    padding: 0 3px;
    margin-bottom: 24px;
    &-item {
      width: 100%;
      flex-grow: 1;
      margin: 0 -3px;
      cursor: pointer;
      user-select: none;
      padding: 7px 20px;
      font-size: 12px;
      text-align: center;
      border-radius: 6px;
      position: relative;
      border: solid 1px $color-gray-medium;
      background-color: $color-gray-medium;
      transition: border-color $main-transition,
        background-color $main-transition;
      &:hover {
        border-color: $color-gray;
        background-color: rgba($color-gray, 0.35);
      }
      &:active {
        background-color: $color-gray-medium;
      }
      &--chosen,
      &--chosen:hover {
        z-index: 2;
        font-weight: 500;
        border-color: $color-main;
        background-color: $color-white;
      }
    }
  }
}
</style>
