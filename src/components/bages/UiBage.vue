<template>
  <div
    class="ui-bage"
    :class="['ui-bage--' + state, { 'ui-bage--colored': colored }]"
  >
    <inlineSvg
      class="ui-bage-icon"
      :src="require(`@/assets/images/icons/bage-${icon}-icon.svg`)"
    />
    {{ name }}
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    colored: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/variables';
.ui-bage {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  padding: 5px 7px;
  border-radius: 5px;
  stroke: $color-main;
  background-color: $color-white;
  &-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    fill: none;
    stroke: inherit;
    flex-shrink: 0;
  }
  &--green {
    color: $color-green;
    stroke: $color-green;
    &.ui-bage--colored {
      background-color: #e9f4f5;
    }
  }
  &--yellow {
    color: #7aa500;
    stroke: #7aa500;
    &.ui-bage--colored {
      background-color: #eff4e0;
    }
  }
  &--blue {
    color: #0444de;
    stroke: #0444de;
    &.ui-bage--colored {
      background-color: #e9edff;
    }
  }
  &--orange {
    color: $color-orange;
    stroke: $color-orange;
    &.ui-bage--colored {
      background-color: #fff1e1;
    }
  }
}
</style>
