<template>
  <div class="login-form">
    <div class="login-form-logo">
      <inlineSvg :src="require('@/assets/images/layout/logo.svg')" />
    </div>
    <div class="login-form-title">
      {{ formMode.title }}
    </div>
    <template v-if="formMode.view === 'phone-code'">
      <div class="login-form-text">
        <div class="login-form-text-line">
          Мы отправили код подтверждения на номер
          {{ fields.phone.value }}
          <a href="" @click.prevent="setMode('phone')">Изменить</a>
        </div>
        <div class="login-form-text-line">
          <template v-if="timer.text">
            {{ timer.text }}
          </template>
          <a v-else href="" @click.prevent="requestCode()">
            Отправить код еще раз
          </a>
        </div>
      </div>
      <div class="form-field">
        <ui-input
          v-model="fields.code.value"
          input-type="text"
          :placeholder="fields.code.placeholder"
          :error="fields.code.error"
          @on-set="submit()"
        />
      </div>
    </template>
    <ui-tabs v-else :tabs="tabs" v-model="mode">
      <template v-slot:tabs-content-phone>
        <div class="form-field">
          <ui-input
            v-model="fields.phone.value"
            input-type="text"
            :placeholder="fields.phone.placeholder"
            :error="fields.phone.error"
            @on-set="submit()"
          />
        </div>
      </template>
      <template v-slot:tabs-content-login>
        <div class="form-field">
          <ui-input
            v-model="fields.login.value"
            input-type="text"
            :placeholder="fields.login.placeholder"
            :error="fields.login.error"
            @on-set="submit()"
          />
        </div>
        <div class="form-field">
          <ui-input
            v-model="fields.password.value"
            input-type="password"
            :placeholder="fields.password.placeholder"
            :error="fields.password.error"
            @on-set="submit()"
          />
        </div>
      </template>
    </ui-tabs>
    <ui-message :message="message" v-if="message" />
    <div class="form-actions form-actions--ot">
      <ui-button
        @click="submit()"
        :label="formMode.buttonLabel"
        :classes="['block', 'red']"
        :states="loading ? ['loading'] : []"
      />
    </div>
    <div class="form-description" v-if="formMode.description">
      <inlineSvg :src="require('@/assets/images/icons/message-icon.svg')" />
      {{ formMode.description }}
    </div>
    <div class="form-links" v-if="formMode.view === 'phone-code'">
      <a href="" @click.prevent="setMode('login')">
        Войти через логин и пароль
      </a>
    </div>
  </div>
</template>
<script>
import UiInput from '@/components/form/UiInput'
import UiButton from '@/components/form/UiButton.vue'
import UiMessage from '@/components/form/UiMessage.vue'
import UiTabs from '@/components/tabs/UiTabs.vue'
import InlineSvg from 'vue-inline-svg'
import store from '@/store/user'

export default {
  components: {
    UiInput,
    UiButton,
    UiTabs,
    UiMessage,
    InlineSvg
  },
  data() {
    return {
      mode: 'phone',
      step: 'first',
      tabs: [
        {
          name: 'Телефон',
          key: 'phone'
        },
        {
          name: 'Логин и пароль',
          key: 'login'
        }
      ],
      fields: {
        phone: {
          value: '79814258215',
          error: '',
          placeholder: 'Введите номер телефона'
        },
        code: {
          value: '',
          error: '',
          placeholder: 'Введите код из СМС'
        },
        login: {
          value: 'developer',
          error: '',
          placeholder: 'Логин'
        },
        password: {
          value: '1992JqDctDmysql!',
          error: '',
          placeholder: 'Пароль'
        }
      },
      timer: {
        text: '',
        endTime: null,
        interval: null
      },
      loading: false,
      message: ''
    }
  },
  computed: {
    formMode() {
      const data = {
        view: '',
        buttonLabel: '',
        title: '',
        description: ''
      }

      if (this.mode === 'phone') {
        if (this.step === 'first') {
          data.view = 'phone-number'
          data.buttonLabel = 'Получить СМС'
          data.title = 'Выберите способ авторизации на сайте'
          data.description =
            'Для изменения номера в системе необходимо обратиться к администратору'
        } else {
          data.view = 'phone-code'
          data.buttonLabel = 'Авторизоваться'
          data.title = 'Введите код'
          data.description = ''
        }
      } else if (this.mode === 'login') {
        data.view = 'login'
        data.buttonLabel = 'Войти'
        data.title = 'Выберите способ авторизации на сайте'
        data.description = 'Логин и пароль можно узнать у администратора'
      }

      if (this.loading) {
        data.buttonLabel = 'Подождите'
      }

      return data
    }
  },
  methods: {
    async submit() {
      if (!this.validate()) {
        return
      }

      if (this.formMode.view === 'phone-number') {
        this.requestCode()
      } else if (this.formMode.view === 'phone-code') {
        this.sendCode()
      } else {
        this.login()
      }
    },
    validate() {
      if (this.formMode.view === 'phone-number') {
        this.fields.phone.error = !this.fields.phone.value ? 'empty-value' : ''
        return !this.fields.phone.error
      } else if (this.formMode.view === 'login') {
        for (const field of ['login', 'password']) {
          this.fields[field].error = !this.fields[field].value
            ? 'empty-value'
            : ''
          if (this.fields[field].error) {
            return false
          }
        }

        return true
      } else if (this.formMode.view === 'phone-code') {
        this.fields.code.error = !this.fields.code.value ? 'empty-value' : ''
        return !this.fields.code.error
      }
    },
    async requestCode() {
      this.loading = true
      this.fields.phone.error = ''

      try {
        const { data } = await this.$axios.post('/auth', {
          action: 'code',
          phone: this.fields.phone.value
        })

        if (data.success) {
          this.step = 'code'
          this.startTimer(data.timeout)
        } else {
          this.fields.phone.error = data.message
          if (data.errorKey === 'timeout' && data.timeout) {
            this.step = 'code'
            this.startTimer(data.timeout)
          }
        }
      } catch (error) {
        this.message = error.message
      }

      this.loading = false
    },
    async sendCode() {
      this.loading = true

      try {
        const { data } = await this.$axios.post('/auth', {
          action: 'code-login',
          code: this.fields.code.value,
          phone: this.fields.phone.value
        })

        if (data.success) {
          this.loginUser(data.message)
        } else {
          this.fields.code.error = data.message
        }
      } catch (error) {
        this.message = error.message
      }

      this.loading = false
    },
    async login() {
      this.loading = true

      try {
        const { data } = await this.$axios.post('/auth', {
          action: 'login',
          login: this.fields.login.value,
          password: this.fields.password.value
        })

        if (data.success) {
          this.loginUser(data.message)
        } else {
          if (data.errorKey && data.errorKey in this.fields) {
            this.fields[data.errorKey].error = data.message
          } else {
            this.fields.login.error = data.message
          }
        }
      } catch (error) {
        this.message = error.message
      }

      this.loading = false
    },
    async loginUser(message) {
      await store.dispatch('loginUser', {
        token: message,
        axios: this.$axios
      })
      this.mode = 'phone'
      this.step = 'first'
    },
    startTimer(timeout) {
      this.timer.endTime = timeout * 1000
      this.timer.interval = setInterval(this.moveTimer, 1000)
      this.moveTimer()
    },
    moveTimer() {
      const timeLeft = this.timer.endTime - Date.now()
      if (timeLeft < 0) {
        this.timer.text = 0
        return
      }

      const secondsLeft = Math.round(timeLeft / 1000)
      const minutes = Math.floor(secondsLeft / 60)
      const seconds = secondsLeft - minutes * 60

      this.timer.text = `${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
      }`
    },
    setMode(key) {
      this.mode = key
      this.step = 'first'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/variables';
.login-form {
  &-logo {
    max-width: 110px;
    margin: 0 auto 65px;
  }
  &-title {
    font-size: 24px;
    line-height: 1.1;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20px;
  }
  &-text {
    font-size: 12px;
    margin-bottom: 27px;
    color: $color-gray-dark;
    &-line {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    a {
      @include boldLink;
      margin-left: 5px;
    }
  }
}
</style>
