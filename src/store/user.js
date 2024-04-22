import { createStore } from 'vuex'
import router from '@/router'
import CheckUserAccess from '@/plugins/CheckUserAccess'

const stateFields = {
  name: '',
  secondName: 'К.',
  patronymic: 'Викторовна',
  role: {
    id: '',
    name: 'Администратор'
  },
  systemRole: 'Логист',
  position: 'Специалист по логистике',
  email: '',
  phone: '',
  login: '',
  authToken: '',
  loaded: false,
  loggedIn: false
}

export default createStore({
  state: { ...stateFields },
  getters: {
    loggedIn(state) {
      return state.loggedIn
    },
    loaded(state) {
      return state.loaded
    },
    user(state) {
      return {
        name: state.name,
        email: state.email,
        secondName: state.secondName,
        patronymic: state.patronymic,
        role: state.role,
        systemRole: state.systemRole,
        position: state.position,
        phone: state.phone,
        login: state.login
      }
    },
    userRole(state) {
      return state.role.id
    }
  },
  mutations: {
    setToken(state, value) {
      state.authToken = value
      localStorage.setItem('auth-token', value)
    },
    setUser(state, data) {
      if (data && typeof data === 'object') {
        for (const key in data) {
          if (key in state) {
            state[key] = data[key]
          }
        }

        state.loggedIn = true
        this.commit('seUserLoaded')
      }
    },
    logout(state) {
      for (const field in stateFields) {
        state[field] = stateFields[field]
      }

      this.commit('seUserLoaded')
      router.push('/login')
    },
    seUserLoaded(state) {
      state.loaded = true
      const redirect = CheckUserAccess(
        {
          userRole: state.role.id,
          loggedIn: state.loggedIn,
          userLoaded: true
        },
        router.currentRoute.value.name
      )

      if (redirect) {
        router.push(redirect)
      }
    }
  },
  actions: {
    async loginUser({ commit, dispatch }, { token, axios }) {
      commit('setToken', token)
      axios.defaults.headers.common['X-Token-Auth'] = token
      if (
        (await dispatch('loadUser', { axios })) &&
        router.currentRoute.value.name === 'login'
      ) {
        router.push('/')
      }
    },
    async loadUser({ commit }, { axios }) {
      try {
        const { data } = await axios.get('/user')
        if (typeof data === 'object') {
          commit('setUser', data)
          return true
        } else {
          router.push('/login')
          return false
        }
      } catch (error) {
        localStorage.removeItem('auth-token')
        commit('seUserLoaded')
        console.error(error)
        return false
      }
    },
    async checkUser({ dispatch, commit }, { axios }) {
      const token = localStorage.getItem('auth-token')
      if (token) {
        await dispatch('loginUser', { token, axios })
      } else {
        commit('seUserLoaded')
      }
    },
    logout({ commit }) {
      localStorage.removeItem('auth-token')
      commit('logout')
    }
  }
})
