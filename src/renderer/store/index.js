import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMLocalForage from 'vuex-orm-localforage'
import ProductItems from './models/items'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const database = new VuexORM.Database()

database.register(ProductItems);

VuexORM.use(VuexORMLocalForage, {
  database,
  localforage: {
    name: 'vuex', // Name is required
  },
})

export default new Vuex.Store({
  modules,
  plugins: [
    VuexORM.install(database),
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
