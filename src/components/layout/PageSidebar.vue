<template>
  <div class="page-sidebar">
    <router-link to="/" class="page-sidebar-logo">
      <inlineSvg :src="require('@/assets/images/layout/logo.svg')" />
    </router-link>
    <div class="page-sidebar-content">
      <div class="page-sidebar-nav">
        <div class="nav">
          <router-link
            class="nav-item"
            v-for="item in navbar"
            :to="{ name: item.route }"
            :class="{ 'nav-item--active': currentRoute === item.route }"
            :key="item.link"
          >
            <div class="nav-item-content">
              <div class="nav-item-icon" v-html="item.icon"></div>
              <div class="nav-item-label">
                {{ item.name }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <ui-button
        v-if="allowAddOrder"
        label="Добавить заказ"
        :classes="['block', 'white']"
        @click="$bus.trigger('openModal', { id: 'addOrderModal' })"
      >
        <template #icon>
          <inlineSvg :src="require('@/assets/images/icons/plus-icon.svg')" />
        </template>
      </ui-button>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/form/UiButton'
import InlineSvg from 'vue-inline-svg'
import userStore from '@/store/user'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const currentRoute = ref()
const allowAddOrder = ref(false)
const navbar = ref([
  {
    name: 'Список заказов',
    route: 'home',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M11 4H21V6H11V4ZM11 8H17V10H11V8ZM11 14H21V16H11V14ZM11 18H17V20H11V18ZM3 4H9V10H3V4ZM5 6V8H7V6H5ZM3 14H9V20H3V14ZM5 16V18H7V16H5Z" />
      </svg>
    `
  }
])

onMounted(async () => {
  await router.isReady()
  currentRoute.value = route.name ?? 'home'
  if (userStore.getters.userRole !== 'florist') {
    const navLinks = [
      {
        name: 'Пользователи',
        route: 'users',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z" />
          </svg>
        `
      },
      {
        name: 'График работы',
        route: 'workSchedule',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z" />
          </svg>
        `
      },
      {
        name: 'Справочники',
        route: 'directories',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 18H6C5.44772 18 5 18.4477 5 19C5 19.5523 5.44772 20 6 20H21V22H6C4.34315 22 3 20.6569 3 19V4C3 2.89543 3.89543 2 5 2H21V18ZM5 16.05C5.16156 16.0172 5.32877 16 5.5 16H19V4H5V16.05ZM16 9H8V7H16V9Z" />
          </svg>
        `
      },
      {
        name: 'Печать наклеек',
        route: '',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 15L15 20.996L4.00221 21C3.4487 21 3 20.5551 3 20.0066V3.9934C3 3.44476 3.44495 3 3.9934 3H20.0066C20.5552 3 21 3.45576 21 4.00247V15ZM19 5H5V19H13V14C13 13.4872 13.386 13.0645 13.8834 13.0067L14 13L19 12.999V5ZM18.171 14.999L15 15V18.169L18.171 14.999Z" />
            <path d="M7 8C7 7.44772 7.44772 7 8 7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H8C7.44772 9 7 8.55228 7 8Z" />
            <path d="M7 12C7 11.4477 7.44772 11 8 11H10C10.5523 11 11 11.4477 11 12C11 12.5523 10.5523 13 10 13H8C7.44772 13 7 12.5523 7 12Z" />
          </svg>
        `
      },
      {
        name: 'Задания',
        route: '',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8.5 7C8.5 5.89543 7.60457 5 6.5 5C5.39543 5 4.5 5.89543 4.5 7C4.5 8.10457 5.39543 9 6.5 9C7.60457 9 8.5 8.10457 8.5 7ZM10.5 7C10.5 9.20914 8.70914 11 6.5 11C4.29086 11 2.5 9.20914 2.5 7C2.5 4.79086 4.29086 3 6.5 3C8.70914 3 10.5 4.79086 10.5 7ZM21 4H13V6H21V4ZM21 11H13V13H21V11ZM21 18H13V20H21V18ZM6.5 19C5.39543 19 4.5 18.1046 4.5 17C4.5 15.8954 5.39543 15 6.5 15C7.60457 15 8.5 15.8954 8.5 17C8.5 18.1046 7.60457 19 6.5 19ZM6.5 21C8.70914 21 10.5 19.2091 10.5 17C10.5 14.7909 8.70914 13 6.5 13C4.29086 13 2.5 14.7909 2.5 17C2.5 19.2091 4.29086 21 6.5 21ZM6.5 8C7.05228 8 7.5 7.55228 7.5 7C7.5 6.44772 7.05228 6 6.5 6C5.94772 6 5.5 6.44772 5.5 7C5.5 7.55228 5.94772 8 6.5 8Z" />
          </svg>
        `
      }
    ]

    navbar.value = [...navbar.value, ...navLinks]
    allowAddOrder.value = true
  }
})

watch(route, () => {
  currentRoute.value = route.name
})
</script>
