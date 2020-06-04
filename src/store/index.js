import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import errLog from './modules/errLog'
import goods from './modules/goods'
import goodsJd from './modules/goodsJd'
import order from './modules/order'
import column from './modules/column'
import merchants from './modules/merchants'
import columnData from './modules/columnData'
import call from './modules/call'
import cart from './modules/cart'
import cartBusiness from './modules/cartBusiness'
import cartJd from './modules/cartJd'
import purchaseGood from './modules/purchaseGood'
import appId from './modules/appId'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    errLog,
    tags,
    goods,
    goodsJd,
    order,
    column,
    merchants,
    columnData,
    call,
    cart,
    cartBusiness,
    cartJd,
    purchaseGood,
    appId
  },
  getters,
})

export default store
