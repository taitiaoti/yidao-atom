const order = {
    state: {
        orderSearch: {
            orderNo: '',
            uid: '',
            orderStatus: '',
            limit: 10,
            page: 1,
            startTime: '',
            endTime: '',
            orderType:''
        },
        expressEditor: {
            limit: 10,
            page: 1,
            appId: ''
        }
    },
    mutations: {
        SET_ORDERNO: (state, orderNo) => {
            state.orderSearch.orderNo = orderNo
        },
        SET_UID: (state, uid) => {
            state.orderSearch.uid = uid
        },
        SET_STORENAME: (state, storeName) => {
            state.orderSearch.storeName = storeName
        },
        SET_ORDERSTATUS: (state, orderStatus) => {
            state.orderSearch.orderStatus = orderStatus
        },
        //订单类型
        SET_ORDERTYPE: (state,orderType) => {
            state.orderSearch.orderType = orderType
        },
        SET_TIME: (state, payload) => {
            state.orderSearch.startTime = payload.startTime;
            state.orderSearch.endTime = payload.endTime;
        },
        SET_ORDERLIMIT: (state, limit) => {
            state.orderSearch.limit = limit;
        },
        SET_ORDERPAGE: (state, page) => {
            state.orderSearch.page = page;
        },
        SET_EXPRESSEDITORPAGE: (state, page) => {
            state.expressEditor.page = page;
        },
        SET_EXPRESSEDITORLIMIT: (state, limit) => {
            state.expressEditor.limit = limit;
        },
        SET_EXPRESSEDITORAPPID: (state, appId) => {
            state.expressEditor.appId = appId
        }
    }
}

export default order