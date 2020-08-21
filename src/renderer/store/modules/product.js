const state = {
    items: [],
    categories: [],
    cartItems: []
}

const getters = {
  items: (state) => state.items,
  categories: (state) => state.categories
}

const mutations = {
  CHANGE_ITEM(state, { index, key, val }) {
    state.items = state.items.map((item, i) => {
      if (i === index) {
        item[key] = val
      }
      return item
    })
  },
  SET_CATEGORIES(state, { val }) {
    state.categories = val
  },
  SET_ITEMS(state, { val }) {
    state.items = val
  }
}

const actions = {
  changeItem({ commit }, { index, key, val }) {
    commit('CHANGE_ITEM', { index, key, val })
  },
  setCategories({ commit }, { val }) {
    commit('SET_CATEGORIES', { val })
  },
  setProducts({ commit }, { val }) {
    commit('SET_ITEMS', { val })
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}
