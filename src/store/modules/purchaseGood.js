import { fetchList } from "@/api/product/goodsJd";
import { getSaleProduct } from "@/api/product/purchase";

const state = {
    all: [],
    listQuery: {
        page: 1,
        limit: 12
    },
    total: null,
    getProductParams: {
        provinceCode: 19,
        cityCode: 1607,
        countyCode: 3155,
        townCode: 0,
        page: 1,
        limit: 12,
        productName: ''
    },
    defaultAddress: {},
}

//getters
const getters = {}

//actions
const actions = {
    async getAllProducts({state, commit }, postData){
        
        if(postData){
            state.getProductParams['provinceCode'] = postData.provinceCode;
            state.getProductParams['cityCode'] = postData.cityCode;
            state.getProductParams['countyCode'] = postData.countyCode;
            state.getProductParams['townCode'] = postData.townCode;
            state.getProductParams['productName'] = postData.productName;
        }
        const res = await getSaleProduct(state.getProductParams);
        state.total = res.data.total;
        console.log(res, '获取商品');
        commit('setProducts', res.data.records);
    },
    handleSizeChange({state, commit}, obj){
        commit('setLimit', obj.val);
    },
    handleCurrentChange({state, commit}, obj){
        commit('setPage', obj.val);
    }
}

//mutations
const mutations = {
    setProducts (state, products) {
        state.all = products
    },
    setPage (state, page) {
        state.getProductParams['page'] = page
    },
    setLimit (state, limit) {
        state.getProductParams['limit'] = limit
    },
    setParams (state, paramsObj){
        state.getProductParams = paramsObj
    },
    setDefaultAddress(state, address) {
        state.defaultAddress = address
    }
} 

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}