const Store = require('electron-store');

const eStore = new Store();

const state = {
    webHook: '',
    authUserId: '',
    managerData: {},
    chosenPrinter: ''
}

const getters = {
    webHook: (state) => state.webHook,
    authUserId: (state) => state.authUserId,
    managerData: (state) => state.managerData,
    chosenPrinter: (state) => state.chosenPrinter
}

const mutations = {
    SET_WEBHOOK(state, { val }) {
        state.webHook = val
        eStore.set('webHook', JSON.stringify(val))
    },
    SET_USER_ID(state, { val }) {
        state.authUserId = val
        eStore.set('authUserId', JSON.stringify(val))
    },
    SET_MANAGER_DATA(state, { val }) {
        state.managerData = val
        eStore.set('manageData', JSON.stringify(val))
    },
    SET_PRINTER(state, { val }) {
        state.chosenPrinter = val
        eStore.set('chosenPrinter', JSON.stringify(val))
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
    },
    setManagerData({ commit }, { val }) {
        commit('SET_MANAGER_DATA', { val })
    },
    setPrinter({ commit }, { val }) {
        commit('SET_PRINTER', { val })
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}