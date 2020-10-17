const Store = require('electron-store');

const eStore = new Store();

const state = {
    webHook: '',
    authUserId: '',
    managerData: {},
    chosenPrinter: '',
    isOldScale: false,
    comPortName: 'COM1'
}

const getters = {
    webHook: (state) => state.webHook,
    authUserId: (state) => state.authUserId,
    managerData: (state) => state.managerData,
    chosenPrinter: (state) => state.chosenPrinter,
    isOldScale: (state) => state.isOldScale,
    comPortName: (state) => state.comPortName
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
    },
    SET_OLD_SCALE_CHECKBOX(state, { val }) {
        state.isOldScale = val
        eStore.set('isOldScale', JSON.stringify(val))
    },
    SET_COM_PORT_NAME(state, { val }) {
        state.comPortName = val
        eStore.set('comPortName', JSON.stringify(val))
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
    },
    setOldScaleCheckbox({ commit }, { val }) {
        commit('SET_OLD_SCALE_CHECKBOX', { val })
    },
    setComPortName({ commit }, { val }) {
        commit('SET_COM_PORT_NAME', { val })
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}