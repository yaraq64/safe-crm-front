<template>
  <div>
    <div class="page-header">
      <div class="page-title">Пользователи</div>
      <div class="page-header-right">
        <ui-button
          label="Добавить пользователя"
          :classes="['bordered']"
          @click="showUserForm()"
        >
          <template #icon>
            <inlineSvg :src="require('@/assets/images/icons/plus-icon.svg')" />
          </template>
        </ui-button>
      </div>
    </div>
    <UsersList @call-user-modal="callUserModal" />
    <ui-modal
      modalID="addUserModal"
      :title="editUserId ? 'Изменить пользователя' : 'Добавить пользователя'"
    >
      <template v-slot:modalBody>
        <UsersForm :user-id="editUserId" />
      </template>
    </ui-modal>
  </div>
</template>

<script>
import UsersForm from '@/components/users/UsersForm'
import UsersList from '@/components/users/UsersList'
import UiButton from '@/components/form/UiButton'
import UiModal from '@/components/popups/UiModal'
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    UiModal,
    UiButton,
    InlineSvg,
    UsersList,
    UsersForm
  },
  data() {
    return {
      editUserId: null
    }
  },
  methods: {
    showUserForm() {
      this.editUserId = null
      this.$bus.trigger('openModal', { id: 'addUserModal' })
    },
    callUserModal(data) {
      this.$bus.trigger('openModal', { id: 'addUserModal' })
      this.editUserId = data.user
    }
  }
}
</script>
