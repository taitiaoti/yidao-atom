const goods = {
    state: {
        productNo: '',
        searchProp: {
            storeName: '',      //商铺名
            productName: '',
            type: '',
            isFreePostage: '',
            isOnSale: '',
            productNo: '',
            startTime: '',
            endTime: '',
            limit: 10,
            page: 1,
            categoryId: ''
        },
        propertyValue: '',
        goodsJdSearch: {
            page: 1,
            limit: 12,
            productName: '',
            minDiscount: 0,
            maxDiscount: 10
        }
    },
    mutations: {
        SET_PRODUCTNO: (state, payload) =>{
            state.productNo = payload.productNo
        },
        SET_PRODUCTNAME: (state, productName) =>{
            state.searchProp.productName = productName
        },
        // 商铺名
        SET_STORENAME: (state, storeName) =>{
            state.searchProp.storeName = storeName
        },
        SET_PRODUCTNO: (state, productNo) => {
            state.searchProp.productNo = productNo
        },
        SET_TYPE: (state, type) => {
            state.searchProp.type = type
        },
        SET_ISFREEPOSTAGE: (state, isFreePostage) => {
            state.searchProp.isFreePostage = isFreePostage
        },
        SET_ISONSALE: (state, isOnSale) => {
            state.searchProp.isOnSale = isOnSale
        },
        SET_GOODSTIME: (state, payload) => {
            state.searchProp.startTime = payload.startTime;
            state.searchProp.endTime = payload.endTime;
        },
        SET_CATEGORYID: (state, categoryId) => {
            state.searchProp.categoryId = categoryId
        },
        SET_GOODLIMIT: (state, limit) => {
            state.searchProp.limit = limit;
        },
        SET_GOODPAGE: (state, page) => {
            state.searchProp.page = page;
        },
        SET_PROPERTY: (state, propertyValue) => {
            state.propertyValue = propertyValue
        },
        set_goodJdPage: (state, page) => {
            state.goodsJdSearch.page = page;
        },
        set_goodJdLimit: (state, limit) => {
            state.goodsJdSearch.limit = limit;
        },
        set_goodJdProductName: (state, productName) => {
            state.goodsJdSearch.productName = productName;
        },
        set_goodJdMinDiscount: (state, minDiscount) => {
            state.goodsJdSearch.minDiscount = minDiscount;
        },
        set_goodJdMaxDiscount: (state, maxDiscount) => {
            state.goodsJdSearch.maxDiscount = maxDiscount;
        }
    }
}
export default goods 