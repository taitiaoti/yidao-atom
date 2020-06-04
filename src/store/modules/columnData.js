//let appList = [];
// import user from './user'
// var username = user.state.userInfo.username
// if(localStorage.getItem(username+'App')) { appList = JSON.parse(localStorage.getItem(username+'App'));}

// import appIdStore from './appId'
// console.log(appIdStore.state.appIdList,'66666666666666666666666666666');
// appList = appIdStore.state.appIdList;
const columnData = {
    state: {
      selectData: [],
      columnDataMap: [],
      localShopMap: [],
      businessEnterpriseMap: []
    },
    getters: {
        someData(state, getters, rootState, rootGetters){
            state.columnDataMap = rootState.appId.appIdList;
            state.localShopMap = rootState.appId.appIdList;
            state.businessEnterpriseMap = rootState.appId.appIdList;
        }
    },
    mutations: {
        save_selectData: (state, data) => {
            state.selectData = data
        },
        seve_columnDataMap: (state, obj) => {
            state.columnDataMap.forEach((item, index) => {
                if(obj.appId == item.appId){
                    item.columnId = obj.columnId;
                    item.currentIndex = obj.currentIndex;
                    item.type = obj.type;
                }
            });
        },
        seve_localShopMap: (state, obj) => {
            state.localShopMap.forEach((item, index) => {
                if(obj.appId == item.appId){
                    item.columnId = obj.columnId;
                    item.currentIndex = obj.currentIndex;
                }
            });
        },
        save_businessEnterpriseMap: (state, obj) => {
            state.businessEnterpriseMap.forEach((item, index) => {
                if(obj.appId == item.appId){
                    item.columnId = obj.columnId;
                    item.currentIndex = obj.currentIndex;
                }
            });
        }
    }
}

export default columnData