import request from '@/router/axios'
//获取用户签到的方法
// export function fetchUserWalletRecords(obj){
export function getRecordList(obj){
    return request({
        // url:'/benefit/web/exchangePointWallet/rechargeRecords',
        // url:'/benefit/web/userWallet/walletRecords',
        url:'/benefit/web/exchangePointWallet/page',
        // url:'http://39.108.108.99:9999/benefit/web/exchangePointWallet/page',
        
        method:'get',
        params: obj
    })
}