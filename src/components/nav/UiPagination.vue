<template>
  <div
    class="ui-pagination"
    :class="{ 'ui-pagination--with-button': showNextButton }"
    v-if="pages > 1"
  >
    <div class="ui-pagination-list">
      <div
        v-for="page in pagination"
        class="ui-pagination-item"
        :key="page.index"
        @click="handlePageSelected(page, false)"
      >
        <span class="ui-pagination-break" v-if="page.breakView">...</span>
        <a
          v-else
          :href="currentPath + '?page=' + page.index"
          class="ui-pagination-link"
          :class="{
            'ui-pagination-link--current': page.selected
          }"
          @click.prevent
        >
          {{ page.content }}
        </a>
      </div>
    </div>
    <div class="ui-pagination-button" v-if="showNextButton">
      <ui-button
        @click="handlePageSelected({ index: modelValue + 1 }, true)"
        label="Показать ещё"
        :classes="['bordered']"
        :states="loading ? ['loading'] : []"
      />
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/form/UiButton'

export default {
  components: {
    UiButton
  },
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    pages: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    clickHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      currentPath: window.location.pathname
    }
  },
  computed: {
    pagination() {
      const items = {}
      const marginPages = 1
      const pageRange = 6
      const currentPage = this.modelValue + 1

      if (this.pages <= pageRange) {
        for (let index = 0; index < this.pages; index++) {
          items[index] = {
            index: index,
            content: index + 1,
            selected: index === currentPage - 1
          }
        }
      } else {
        const halfPageRange = Math.floor(pageRange / 2)

        const setPageItem = (index) => {
          items[index] = {
            index: index,
            content: index + 1,
            selected: index === currentPage - 1
          }
        }

        const setBreakView = (index) => {
          items[index] = {
            disabled: true,
            breakView: true
          }
        }

        for (let i = 0; i < marginPages; i++) {
          setPageItem(i)
        }

        let selectedRangeLow = 0
        if (currentPage - halfPageRange > 0) {
          selectedRangeLow = currentPage - 1 - halfPageRange
        }

        let selectedRangeHigh = selectedRangeLow + pageRange - 1
        if (selectedRangeHigh >= this.pages) {
          selectedRangeHigh = this.pages - 1
          selectedRangeLow = selectedRangeHigh - pageRange + 1
        }

        for (
          let i = selectedRangeLow;
          i <= selectedRangeHigh && i <= this.pages - 1;
          i++
        ) {
          setPageItem(i)
        }

        if (selectedRangeLow > marginPages) {
          setBreakView(selectedRangeLow - 1)
        }

        if (selectedRangeHigh + 1 < this.pages - marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }

        for (let i = this.pages - 1; i >= this.pages - marginPages; i--) {
          setPageItem(i)
        }
      }
      return items
    },
    showNextButton() {
      return this.modelValue + 1 < this.pages
    }
  },
  methods: {
    handlePageSelected(page, append) {
      if (page.breakView) {
        return
      }

      if (page.content && this.modelValue + 1 === page.content) {
        return
      }

      this.$emit('update:modelValue', page.index)
      this.clickHandler(append)

      if (!append) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';

.ui-pagination {
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-top: 30px;
  &--with-button {
    padding-left: 270px;
  }
  &-list {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
  &-button {
    flex-shrink: 0;
    margin-left: 20px;
  }
  &-item {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
  &-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    min-width: 56px;
    border-radius: 5px;
    border: solid 1px transparent;
    transition: background-color $main-transition, border-color $main-transition;
    &:hover {
      background-color: $color-gray-medium;
    }
    &:active {
      background-color: $color-gray;
    }
    &--current {
      font-weight: 500;
      border-color: $color-main;
    }
  }
  &-break {
    height: 56px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ui-button {
    min-width: 250px;
  }
}
</style>
