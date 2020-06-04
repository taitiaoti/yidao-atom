<template>
    <div style="padding: 10px;">
        <div>
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
            <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入手机号码"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                label="应用名称">
                <template scope="scope">
                    <span>{{scope.row.appId | filterAppName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="账号">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="余额（元）">
                <template scope="scope">
                    <span>{{scope.row.balance | filterMoney}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="操作时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | fitlerTime}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                align="center"
                label="状态">
                <template scope="scope">
                     <el-tag :type="scope.row.status ? '': 'info'">{{scope.row.status | filterStatus}}</el-tag>
                </template>
            </el-table-column> -->
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="listQuery.page"
                            :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { fecthCouponWallet } from '@/api/shoppingVoucher/voucher'
    import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data(){
            return {
                listQuery:{
                    page: 1,
                    limit: 10
                },
                appId: '',
                currentAppList: [],
                list: [],
                total: null,
                listLoading: true,
                phone: '',
            }
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
        },
        methods: {
            async getList(){
                let postData = {
                    ...this.listQuery,
                    appId: this.appId,
                    phone: this.phone
                }
                const res = await fecthCouponWallet(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.list.forEach(item => {
                    this.$set(item, 'money', null); //响应式添加根对象属性 
                });
               
                this.total = res.data.total;
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            search(){
                this.getList();
            },
            getDataByAppId(){
               this.getList(); 
            },
        },
        filters: {
            filterMoney(value){
                return bcdiv(value, 10000, 2);
            },
            filterStatus(value){
                let statusMap = {
                    "0": "处理中",
                    "1": "发放成功"
                }
                return statusMap[value]
            },
            fitlerTime(value){
                return formartTime(new Date(value), 5);
            },
            filterAppName(appId){
                return getAppName(appId)
            },
            fitlerAction(value){
                let actionMap = {
                    increase: '增加',
                    subtract: '扣除'
                }
                return actionMap[value]
            }
        }
    }
</script>
