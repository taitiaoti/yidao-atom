import request from '@/router/axios'
//获取用户签到的方法
export function getRecordDetail(obj){
// export function getRecordList(obj){
    return request({
        url:'/benefit/web/exchangePointWallet/rechargeRecords',
        // // url:'/benefit/web/userWallet/walletRecords',
        // url:'/benefit/web/exchangePointWallet/page',
        
        method:'get',
        params: obj
    })
}