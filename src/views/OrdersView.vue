<template>
  <component :is="ordersComponent"></component>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import userStore from '@/store/user'

const ordersComponent = computed(() => {
  if (!userStore.getters.userRole) {
    return null
  }

  switch (userStore.getters.userRole) {
    case 'florist':
      return defineAsyncComponent(() =>
        import('@/components/orders/OrdersFlorist.vue')
      )

    default:
      return defineAsyncComponent(() =>
        import('@/components/orders/OrdersAdmin.vue')
      )
  }
})
</script>
