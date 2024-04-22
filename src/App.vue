<template>
  <div class="page" :class="pageClasses">
    <PageSidebar v-if="loggedIn" />
    <div class="page-content">
      <PageNotifications />
      <PageHeader v-if="loggedIn" />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <PagePopups v-if="loggedIn" />
    </div>
  </div>
</template>

<script setup>
import userStore from '@/store/user'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageSidebar from '@/components/layout/PageSidebar'
import PageHeader from '@/components/layout/PageHeader'
import PagePopups from '@/components/layout/PagePopups'
import PageNotifications from '@/components/layout/PageNotifications'

const route = useRoute()
const router = useRouter()
const currentRoute = ref()

onMounted(async () => {
  await router.isReady()
  currentRoute.value = route.name ?? 'home'
})

watch(route, () => {
  currentRoute.value = route.name
})

const loggedIn = computed(() => {
  return userStore.getters.loggedIn
})
const pageClasses = computed(() => {
  return `page--route-${currentRoute.value}`
})
</script>
