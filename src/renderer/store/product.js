export const state = () => {
  return {
    items: [
      {
        id: 1,
        name: 'item',
        barcode: 4444555,
        categoryId: 1,
        selected: false
      },
      {
        id: 2,
        name: 'item 2',
        barcode: 808,
        categoryId: 1,
        selected: false
      },
      {
        id: 3,
        name: 'item 3',
        barcode: 97979,
        categoryId: 2,
        selected: false
      }
    ],
    categories: [
      {
        id: 1,
        name: 'Category'
      },
      {
        id: 2,
        name: 'Category 2'
      }
    ]
  }
}

export const getters = {
  items: (state) => state.items,
  categories: (state) => state.categories
}

export const mutations = {
  CHANGE_ITEM(state, { index, key, val }) {
    state.items = state.items.map((item, i) => {
      if (i === index) {
        item[key] = val
      }
      return item
    })
  }
}

export const actions = {
  changeItem({ commit }, { index, key, val }) {
    commit('CHANGE_ITEM', { index, key, val })
  }
}
