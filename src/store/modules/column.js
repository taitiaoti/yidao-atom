const column = {
    state: {
        columnQueryList: {
            page: 1,
            limit: 10
        },
        storeColumnQueryList: {
            page: 1,
            limit: 10
        },
        businessEnterpriseQueryList: {
            page: 1,
            limit: 10
        }
    },
    mutations: {
        set_column_page: (state, page) => {
            state.columnQueryList.page = page
        },
        set_column_limit: (state, limit) => {
            state.columnQueryList.limit = limit
        },
        set_storeColumn_page: (state, page) => {
            state.storeColumnQueryList.page = page
        },
        set_storeColumn_limit: (state, limit) => {
            state.storeColumnQueryList.limit = limit
        },
        set_businessEnterprise_page: (state, page) => {
            state.businessEnterpriseQueryList.page = page
        },
        set_businessEnterprise_limit: (state, limit) => {
            state.businessEnterpriseQueryList.limit = limit
        }
    }
}

export default column 