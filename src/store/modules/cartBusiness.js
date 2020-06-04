// init state
const state = {
    items: [],
    selectItems: [],
    orderInfo: {}
}

//getters
const getters = {
    cartProducts: (state, getters, rootState) => {
        return state.items
    },
    cartSelectItems: (state, getters) => {
        // getters.cartProducts.forEach((item, index) => {
        //     state.selectItems.forEach((item02, index02) => {
        //         item02 = (item02.id == item.id && item02.property == item.property) ? item : item02; 
        //     });
        // });
        let tempArr = [];
        state.selectItems.forEach(item => {
            getters.cartProducts.forEach(item02 => {
                if(item.productId == item02.productId && item.property == item02.property && item.deliveryType === item02.deliveryType){
                    item = item02
                    tempArr.push(item02)
                }
            });
        });
        state.selectItems = tempArr;
        return state.selectItems
    },
    cartTotalPrice: (state, getters) => {
        return getters.cartSelectItems.reduce((total, product) => {
          return total + product.price * product.quantity
        },0)
    },
    getOrderInfo: (state) => {
        return state.orderInfo
    }
}

//actions
const actions = {
    addProductToCart({state, commit}, product){
        const cartItem = state.items.find(item => (item.productId === product.productId && item.property === product.property && item.deliveryType === product.deliveryType))
        if (!cartItem) {
            commit('pushProductToCart', product)
        } else {
            commit('incrementItemQuantity', product)
        }
    },
    getSelectItem({state, commit}, items){
        commit('setItems', items)
    },
    delectProductCart({state, commit}, product){
        commit('delectProduct',{ productId: product.productId, property: product.property, deliveryType: product.deliveryType})
    },
    checkout({state, commit}, products){
        commit('delProductOfItems', products)
        commit('setItems', [])  //清空购物车
    },
    //分发订单信息
    setOrderInfo({state, commit}, obj){
        commit('orderInfo', obj)
    }
}

//mutations
const mutations = {
    pushProductToCart (state, product) {
        state.items.push({
          ...product,
        //   quantity: 1
        })
        state.selectItems.push({
            ...product,
            // quantity: 1
        })
    },
     //增加或者减少
    incrementItemQuantity (state, { productId, quantity, property, handleType, deliveryType }) {
        const cartItem = state.items.find(item => (item.productId === productId && item.property === property && item.deliveryType === deliveryType))
        //当在商品列表页添加进购物车是，购物车商品 ++ 
        //当在购物车列表增减时直接赋值给quantity
        console.log(cartItem.deliveryType,'cartItem.deliveryType333');
        if(handleType === 'add'){
            cartItem.deliveryType == 'express' ? cartItem.quantity++ : cartItem.quantity += cartItem.addNum;
        }else {
            cartItem.deliveryType == 'express' ? cartItem.quantity-- : cartItem.quantity -= cartItem.addNum;
        }
        // !!quantity ? cartItem.quantity = quantity : cartItem.quantity++
    },
    //获取保存选中的商品
    setItems(state, items){
        state.selectItems = items
    },
    //保存订单信息
    orderInfo(state, obj){
        state.orderInfo = obj
    },
    //获取保存到本地的购物车数据
    getLocalStoreCartItem(state, items){
        state.items = items;
    },
    getLocalStoreCartSelectItem(state, items){
        state.selectItems = items;
    },
    getLocalStoreSingleOrderInfo(state, obj){
        state.orderInfo = obj;
    },
    //删除购物车中的商品
    delectProduct(state, {productId, property, deliveryType}){
        state.items.forEach((item, index) => {
            if(item.productId == productId && item.property == property && item.deliveryType == deliveryType){
                state.items.splice(index, 1)
            }
        });
        state.selectItems.forEach((item, index) => {
            if(item.productId == productId && item.property == property && item.deliveryType == deliveryType){
                state.selectItems.splice(index, 1)
            }
        })
    },
    delProductOfItems(state, products){  //删除购物车中选中的部分
        products.forEach((item, index) => {
            state.items.forEach((item02, index02) => {
                if(item.productId == item02.productId && item.property == item02.property && item.deliveryType == item02.deliveryType){
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