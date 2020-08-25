const state = {
    items: [],
    categories: [],
    cartItems: []
}

const getters = {
  items: (state) => state.items,
  categories: (state) => state.categories,
  cartItems: (state) => state.cartItems
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
  },
  TOGGLE_PRODUCT(state, { item }) {
    state.items = state.items.map(prod => {
      if(prod.id === item.id) {
        prod.selected = !prod.selected
      }
      return prod
    })
  },
  TOGGLE_PRODUCT_CART(state, {item}) {
    const foundIndex = state.cartItems.findIndex(prod => {
      return item.id === prod.id
    });
    console.log(foundIndex)
    if (foundIndex < 0) {
      state.cartItems.push({
        id: item.id,
        name: item.name,
        barcode: item.barcode,
        img: item.image,
        price: item.price,
        totalPrice: 0,
        weight: 0
      })
    } else {
      state.cartItems.splice(foundIndex, 1)
    }
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
  },
  toggleProduct({ commit }, { item }) {
    commit('TOGGLE_PRODUCT', { item })
  },
  toggleProductCart({commit}, {item}) {
    commit('TOGGLE_PRODUCT_CART', {item})
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}
