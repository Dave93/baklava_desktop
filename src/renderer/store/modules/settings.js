const state = {
    webHook: ''
}


const getters = {
    webHook: (state) => state.webHook
}

const mutations = {
    SET_WEBHOOK(state, { val }) {
        state.webHook = val
    }
}

const actions = {
    setWebHook({ commit }, { val }) {
        commit('SET_WEBHOOK', { val })
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}