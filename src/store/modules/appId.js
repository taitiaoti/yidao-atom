const state = {
    appIdList: []
}

const getters = {
    appList(state){
        return state.appIdList
    }
}

const actions = {
}

const mutations = {
    setAppIdList(state, appIdList) {
        state.appIdList = appIdList
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}