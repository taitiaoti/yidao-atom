<template>
    <div class="app-container calendar-list-container">
        <div style="margin-bottom: 10px;">
            <el-select v-model="loginAgentId" @change="changeAgent" v-if="this.isProAgent == 'y'" style="width: 180px;" placeholder="请选择省代理商">
                <el-option
                    v-for="item in agentProList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="uid" clearable style="width: 180px;" placeholder="请输入UID"></el-input>        
            <el-input v-model="phone" clearable style="width: 180px;" placeholder="请输入手机号"></el-input>        
            <el-input v-model="agentId" clearable style="width: 180px;" placeholder="请输入渠道号"></el-input>        
            <el-input v-model="agentName" clearable style="width: 180px;" placeholder="请输入渠道名称"></el-input> 
            <el-date-picker
                style="width: 400px;"
                v-model="searchTime"
                type="datetimerange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>    
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
                label="代理渠道号">
                <template scope="scope">
                    <span>{{scope.row.agentId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="代理渠道名">
                <template scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="充值账号">
                <template scope="scope">
                    <span>{{scope.row.account}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="充值手机号">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="充值时间">
                <template scope="scope">
                    <span>{{scope.row.payTime}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="充值金额">
                <template scope="scope">
                    <span>{{scope.row.payMoney | filterFixed}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="分润金额">
                <template scope="scope">
                    <span>{{scope.row.splitMoney | filterFixed}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="分润时间">
                <template scope="scope">
                    <span>{{scope.row.splitTime}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="充值订单号">
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
    import { userBenefit, findAgentUserByProAgent } from '@/api/saas/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime,getAppName } from "@/util/util";

    export default{
        data(){
            return {
                appId: '',
                listLoading: true,
                list: [],
                listQuery:{
                    start: 1,
                    length: 10
                },
                phone: '',
                uid: '',
                agentId: '',
                agentName: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                currentAppList: [],
                total: null,
                isProAgent: '',
                agentProList: [],
                loginAgentId: '',
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            }),
            ...mapGetters(['userInfo'])
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
        },
        methods: {
            async getList(){
                await this.getProAgent();
                let postData = {
                    appId: this.appId,
                    ...this.listQuery,
                    uid: this.uid,
                    phone: this.phone,
                    agentId: this.agentId,
                    agentName: this.agentName,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
                if(this.isProAgent == 'y'){
                    this.loginAgentId = this.loginAgentId ? this.loginAgentId : this.agentProList[0].value;
                    postData.loginAgentId = this.loginAgentId;
                }else {
                    postData.loginAgentId = this.userInfo.username;
                }
                const res = await userBenefit(postData);
                this.list = res.data.aaData;
                this.total = res.data.iTotalRecords;
                this.listLoading = false;
            },
            async getProAgent(){
                let postData = {
                    appId: this.appId,
                }
                const res = await findAgentUserByProAgent(postData);
                this.isProAgent = res.data.isProAgent;
                this.agentProList = [];
                if(res.data.agents && res.data.agents.length !== 0){
                    res.data.agents.forEach(item => {
                        this.agentProList.push({
                            label: item.agentName,
                            value: item.agentId
                        });
                    });
                }
            },
            search(){
                if(this.searchTime){
                    this.startTime = formartTime(this.searchTime[0],5);
                    this.endTime = formartTime(this.searchTime[1],5);
                }else {
                    this.startTime = "";
                    this.endTime = "";
                }
                this.listQuery.start = 0;
                this.getList();
            },
            changeAgent(){
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
            },
            // 保留两位
            filterFixed(val){
                if(val){
                    return Number(val).toFixed(2)
                }
            }
        }
    }
</script>
<style lang="scss">

</style>
