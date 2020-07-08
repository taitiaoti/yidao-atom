<template>
    <div>
        <div style="margin-bottom: 10px;">
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
            <el-input v-model="uid" clearable style="width: 200px;" placeholder="请输入UID"></el-input>        
            <el-input v-model="cardNo" clearable style="width: 200px;" placeholder="请输入卡号"></el-input>        
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
                label="应用名">
                <template scope="scope">
                    <span>{{scope.row.appId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="用户账号（UID）">
                <template scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="充值卡信息">
                <template scope="scope">
                    <span>{{scope.row.account}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="卡号">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="卡密">
                <template scope="scope">
                    <span>{{scope.row.payTime}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="=卡状态">
                <template scope="scope">
                    <span>{{scope.row.payMoney}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="提卡时间">
                <template scope="scope">
                    <span>{{scope.row.splitMoney}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="过期时间">
                <template scope="scope">
                    <span>{{scope.row.splitTime}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="是否充值">
                <template scope="scope">
                    <span>{{scope.row.payNo}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="listQuery.start"
                            :page-sizes="[10,20,30, 50]" :page-size="listQuery.length"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { userCartRecharge } from '@/api/saas/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime,getAppName } from "@/util/util";

    export default{
        data(){
            return {
                appId: '',
                listLoading: true,
                list: [],
                listQuery: {
                    start: 1,
                    length: 10,
                },
                uid: '',
                cardNo: '',
                currentAppList: [],
                total: null,
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
                    appId: this.appId,
                    ...this.listQuery,
                    uid: this.uid,
                    cardNo: this.cardNo
                }
                const res = await userCartRecharge(postData);
                this.list = res.data.aaData;
                this.total = res.data.iTotalRecords;
                this.listLoading = false;
                console.log(res, '个人分润查询'); 
            },
            search(){
                if(this.searchTime){
                    this.startTime = formartTime(this.searchTime[0],5);
                    this.endTime = formartTime(this.searchTime[1],5);
                }else {
                    this.startTime = "";
                    this.endTime = "";
                }
                this.getList();
            },
            getDataByAppId(){
               this.getList(); 
            },
            handleCurrentChange(val) {
                this.listQuery.start = val;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.length = val;
                this.getList()
            },
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId)
            }
        }
    }
</script>
<style lang="scss">

</style>
