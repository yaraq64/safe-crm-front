<template>
  <div class="header">
    <div class="header-search">
      <div class="header-search-select">
        <div class="header-search-select-field">
          {{ searchType.name }}
          <inlineSvg
            :src="require('@/assets/images/icons/select-arrow-icon.svg')"
            class="form-select-shape"
          />
        </div>
      </div>
      <input
        class="header-search-field"
        type="text"
        v-model="searchField.value"
        :placeholder="searchField.placeholder"
      />
      <div class="header-search-button">
        <inlineSvg :src="require('@/assets/images/icons/search-icon.svg')" />
      </div>
    </div>
    <div class="header-actions">
      <div class="header-notifications" @click.stop="toggleNotifications()">
        <inlineSvg
          class="header-notifications-icon"
          :src="require('@/assets/images/icons/notifications-icon.svg')"
        />
        <transition name="ui-modal-animation">
          <div
            class="header-notifications-list"
            @click.stop
            v-if="showNotifications && notifications.length"
          >
            <div class="header-notifications-list-title">Уведомления</div>
            <div
              class="header-notification"
              v-for="notification in notifications"
              :key="notification.id"
            >
              <div
                class="header-notification-message"
                v-html="notification.message"
              ></div>
              <div class="header-notification-date" v-if="notification.date">
                {{ notification.date }}
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="header-profile" @click.stop="showProfile()">
        <inlineSvg
          :src="require('@/assets/images/icons/profile-icon.svg')"
          class="header-profile-icon"
        />
        <div class="header-profile-name">
          {{ userData.name }} {{ userData.secondName }}
        </div>
        <inlineSvg
          :src="require('@/assets/images/icons/select-arrow-icon.svg')"
          class="form-select-shape"
        />
        <transition name="ui-modal-animation">
          <div class="header-profile-popup" v-if="showProfilePopup" @click.stop>
            <div class="header-profile-popup-top">
              <div class="header-profile-popup-title">
                {{ userData.name }} {{ userData.secondName }}
                {{ userData.patronymic }}
              </div>
              <div class="header-profile-popup-label">
                {{ userData.role.name }}
              </div>
            </div>
            <div class="header-profile-popup-body">
              <div class="header-profile-popup-group">
                <div class="header-profile-popup-group-label">
                  Номер телефона
                </div>
                <div class="header-profile-popup-group-text">
                  {{ userData.phone }}
                </div>
              </div>
              <div class="header-profile-popup-group">
                <div class="header-profile-popup-group-label">Логин</div>
                <div class="header-profile-popup-group-text">
                  {{ userData.login }}
                </div>
              </div>
              <div class="header-profile-popup-group">
                <div class="header-profile-popup-group-label">
                  Роль в системе
                </div>
                <div class="header-profile-popup-group-text">
                  {{ userData.systemRole }}
                </div>
              </div>
              <div class="header-profile-popup-group">
                <div class="header-profile-popup-group-label">Должность</div>
                <div class="header-profile-popup-group-text">
                  {{ userData.position }}
                </div>
              </div>
            </div>
            <div class="header-profile-popup-footer">
              <div class="header-profile-popup-logout" @click="userLogout()">
                <inlineSvg
                  :src="require('@/assets/images/icons/logout-icon.svg')"
                  class="header-profile-popup-logout-icon"
                />
                <div class="header-profile-popup-logout-title">
                  Выйти из системы
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="ui-modal-animation">
      <div
        class="page-overlay"
        v-if="showNotifications || showProfilePopup"
      ></div>
    </transition>
  </div>
</template>

<script>
import userStore from '@/store/user'
import notificationsStore from '@/store/notifications'
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  data() {
    return {
      searchPlace: {
        chosen: 'all',
        list: [
          {
            key: 'all',
            name: 'Везде'
          },
          {
            key: 'not-all',
            name: 'Не везде'
          }
        ]
      },
      searchField: {
        value: '',
        placeholder: 'Поиск по разделам'
      },
      showNotifications: false,
      showProfilePopup: false
    }
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    closeNotifications() {
      this.showNotifications = false
    },
    showProfile() {
      this.showProfilePopup = true
    },
    closeProfile() {
      this.showProfilePopup = false
    },
    userLogout() {
      userStore.dispatch('logout')
    }
  },
  computed: {
    searchType() {
      for (const item of this.searchPlace.list) {
        if (item.key === this.searchPlace.chosen) {
          return item
        }
      }

      return {}
    },
    userData() {
      return userStore.getters.user
    },
    notifications() {
      return notificationsStore.getters.list
    }
  },
  mounted() {
    document.addEventListener('click', this.closeNotifications)
    document.addEventListener('click', this.closeProfile)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeNotifications)
    document.removeEventListener('click', this.closeProfile)
  }
}
</script>
