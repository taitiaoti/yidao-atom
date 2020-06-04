import {findUserLikeUsername} from "@/api/merchants/merchants";
import { promises } from "fs";
import { resolve } from "url";
const merchants = {
    state: {
        merchantsQueryList: {
            page: 1,
            limit: 10
        },
        merchantsSearchObj: {
            storeName: '',
            storeNo: '',
            cityId: ''
        }
    },
    mutations: {
        set_merchants_page: (state, page) => {
            state.merchantsQueryList.page = page
        },
        set_merchants_limit: (state, limit) => {
            state.merchantsQueryList.limit = limit
        },
        set_storeName: (state, storeName) => {
            state.merchantsSearchObj.storeName = storeName
        },
        set_storeNo: (state, storeNo) => {
            state.merchantsSearchObj.storeNo = storeNo
        },
        set_cityId: (state, cityId) => {
            state.merchantsSearchObj.cityId = cityId
        }
    }
}

export default merchants 