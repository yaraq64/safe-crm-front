<template>
  <div>
    <div class="page-header">
      <div class="page-title">Справочники</div>
      <div class="page-header-right">
        <UiPopup
          :options="type.options"
          icon="document-icon.svg"
          v-model="type.value"
        />
      </div>
    </div>
    <DirectoriesList v-if="type.value" :type="type.value?.id" />
  </div>
</template>

<script>
import UiPopup from '@/components/popups/UiPopup'
import DirectoriesList from '@/components/directories/DirectoriesList'

export default {
  components: {
    UiPopup,
    DirectoriesList
  },
  data() {
    return {
      type: {
        options: [],
        value: null
      }
    }
  },
  methods: {
    async loadTypes() {
      try {
        const { data } = await this.$axios.get('/directories/get-types')

        if (typeof data.list === 'object') {
          this.type.options = data.list
          this.type.value = data.list[0]
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
    this.loadTypes()
  }
}
</script>
