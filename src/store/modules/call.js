const call = {
    state: {
        rechargeRecordsSearch: {
            page: 1,
            limit: 10,
            appId: '',
            startTime: '',
            endTime: ''
        },
        callRecordsSearch: {
            page: 1,
            limit: 10,
            appId: '',
            startTime: '',
            endTime: '',
            caller: '',
            callee: ''
        }
    },
    mutations: {
        setRechargeRecordPage: (state, page) => {
            state.rechargeRecordsSearch.page = page
        },
        setRechargeRecordLimit: (state, limit) => {
            state.rechargeRecordsSearch.limit = limit
        },
        setRechargeRecordAppId: (state, appId) => {
            state.rechargeRecordsSearch.appId = appId
        },
        setRechargeRecordStartTime: (state, startTime) => {
            state.rechargeRecordsSearch.startTime = startTime
        },
        setRechargeRecordEndTime: (state, endTime) => {
            state.rechargeRecordsSearch.endTime = endTime
        },

        setCallRecordsPage: (state, page) => {
            state.callRecordsSearch.page = page
        },
        setCallRecordsLimit: (state, limit) => {
            state.callRecordsSearch.limit = limit
        },
        setCallRecordsAppId: (state, appId) => {
            state.callRecordsSearch.appId = appId
        },
        setCallRecordsStartTime: (state, startTime) => {
            state.callRecordsSearch.startTime = startTime
        },
        setCallRecordsEndTime: (state, endTime) => {
            state.callRecordsSearch.endTime = endTime
        },
        setCallRecordsCaller: (state, caller) => {
            state.callRecordsSearch.caller = caller
        },
        setCallRecordsCallee: (state, callee) => {
            state.callRecordsSearch.callee = callee
        },
    }
}

export default call 