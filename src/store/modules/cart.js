// init state
const state = {
    items: [],
    selectItems: [],
}

//getters
const getters = {
    cartProducts: (state, getters, rootState) => {
        // return state.items.map(({id, quantity}) => {
        //     const product = rootState.purchaseGood.all.find(product => product.id === id)
        //     return {
        //         ...product,
        //         quantity
        //     }
        // })
        return state.items
    },
    cartTotalPrice: (state, getters) => {
        return getters.cartSelectItems.reduce((total, product) => {
          return total + product.salePrice * product.quantity
        },0)
    },
    cartSelectItems: (state, getters) => {
        getters.cartProducts.forEach((item, index) => {
            state.selectItems.forEach((item02, index02) => {
                item02 = (item02.id == item.id) ? item : item02; 
            });
        });
        return state.selectItems
    }
}

//actions
const actions = {
    addProductToCart({state, commit}, product){
        const cartItem = state.items.find(item => item.id === product.id)
        if (!cartItem) {
            commit('pushProductToCart', product)
        } else {
            commit('incrementItemQuantity', product)
        }
    },
    delectProductCart({state, commit}, product){
        commit('delectProduct',{ id: product.id})
    },
    getSelectItem({state, commit}, items){
        commit('setItems', items)
    },
    checkout({state, commit}, products){
        commit('delProductOfItems', products)
        commit('setItems', [])  //清空购物车
    }
}

//mutations
const mutations = {
    pushProductToCart (state, product) {
        state.items.push({
          ...product,
          quantity: 1
        })
        state.selectItems.push({
            ...product,
            quantity: 1
        })
    },
    //增加或者减少
    incrementItemQuantity (state, { id, quantity }) {
        const cartItem = state.items.find(item => item.id === id)
        //当在商品列表页添加进购物车是，购物车商品 ++ 
        //当在购物车列表增减时直接赋值给quantity
        !!quantity ? cartItem.quantity = quantity : cartItem.quantity++
    },
    //删除购物车中的商品
    delectProduct(state, {id}){
        state.items.forEach((item, index) => {
            if(item.id == id){
                state.items.splice(index, 1)
            }
        });
        state.selectItems.forEach((item, index) => {
            if(item.id == id){
                state.selectItems.splice(index, 1)
            }
        })
    },
    //获取保存选中的商品
    setItems(state, items){
        state.selectItems = items
    },
    //获取保存到本地的购物车数据
    getLocalStoreCartItem(state, items){
        state.items = items;
    },
    getLocalStoreCartSelectItem(state, items){
        state.selectItems = items;
    },
    delProductOfItems(state, products){  //删除购物车中选中的部分
        products.forEach((item, index) => {
            state.items.forEach((item02, index02) => {
                if(item.id == item02.id){
                    state.items.splice(index02, 1)
                }
            });
        });
    } 
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}