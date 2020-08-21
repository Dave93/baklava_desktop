const Store = require('electron-store');

const eStore = new Store();

const state = {
    webHook: '',
    authUserId: ''
}

const getters = {
    webHook: (state) => state.webHook,
    authUserId: (state) => state.authUserId
}

const mutations = {
    SET_WEBHOOK(state, { val }) {
        state.webHook = val
        eStore.set('webHook', JSON.stringify(val))
    },
    SET_USER_ID(state, { val }) {
        state.authUserId = val
        eStore.set('authUserId', JSON.stringify(val))
    }
}

const actions = {
    initWebHook(store) {
        store.dispatch('setWebHook', JSON.parse(eStore.get('webHook') || ''))
    },
    setWebHook({ commit }, { val }) {
        commit('SET_WEBHOOK', { val })
    },
    setUserId({ commit }, { val }) {
        commit('SET_USER_ID', { val })
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}