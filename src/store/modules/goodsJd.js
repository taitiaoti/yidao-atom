const goodsJd = {
    state:{
        items: [],
    },
    mutations: {
        pushItem(state, good){
            if(!state.items.find(item => item.id === good.id)){
                state.items.push(good);
            }
        },
        delItem(state, good){
            state.items.forEach((item, index) => {
                if(item.id == good.id){
                    state.items.splice(index,1);
                }
            });
        },
        setLocalStorageItems(state, items){
            state.items = items
        },
    }
}
export default goodsJd