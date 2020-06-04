<template>
    <div style="padding: 10px;">
        <div >
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
            <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入账号"></el-input>
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
            <el-button type="primary" icon="el-icon-download" :loading="loading" @click="exportLog">导出</el-button>
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
                label="UID">
                <template scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="红包金额（元）">
                <template scope="scope">
                    <span>{{scope.row.amount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="提现方式">
                <template scope="scope">
                    <span>{{scope.row.way | filterWay}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="操作类型">
                <template scope="scope">
                    <span>{{scope.row.action | fitlerAction}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="操作时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="说明">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                align="center"
                label="状态">
                <template scope="scope">
                     <el-tag :type="scope.row.status ? '': 'info'">{{scope.row.status | filterStatus}}</el-tag>
                </template>
            </el-table-column> -->
             <el-table-column
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button v-if="scope.row.status != 1" type="primary" slot="reference" size="small" :loading="scope.row.loading" @click="send(scope.row)">发送提现</el-button>
                    <el-tag v-else>已提现</el-tag>
                </template>
            </el-table-column>
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
    import { fetchList, sendToDraw, fetchFrawExport } from '@/api/inviteRedPack/index'
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
                loading: false,
                phone: '',
                startTime: '',
                endTime: '',
                searchTime: '',
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
                    startTime: this.startTime,
                    endTime: this.endTime,
                    phone: this.phone
                }
                const res = await fetchList(postData);
                res.data.records.forEach(item => {
                    item.loading = false;
                });
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
                if(this.searchTime){
                    this.startTime = formartTime(this.searchTime[0],5);
                    this.endTime = formartTime(this.searchTime[1],5);
                }else {
                    this.startTime = "";
                    this.endTime = "";
                }
                this.getList();
            },
            async exportLog() {
                if(this.searchTime){
                    let postData = {
                        appId: this.appId,
                        startTime: formartTime(this.searchTime[0],5),
                        endTime: formartTime(this.searchTime[1],5),
                        phone: this.phone,
                    }
                    this.loading = true;
                    const res = await fetchFrawExport(postData);
                    this.loading = false;
                    if(res.status == 200){
                        window.location.href = res.request.responseURL;
                        this.orderStatus = '';
                    }
                }else {
                    this.$notify({
                        title: '导出警告！',
                        message: '请选择要日期时间',
                        type: 'warning'
                    });
                }
            },
            getDataByAppId(){
               this.getList(); 
            },
            async send({id}){
                if(id){
                    this.isShowLoading(this.list, id);
                    const res = await sendToDraw(id); 
                    this.isShowLoading(this.list, id);
                    this.$notify({
                        title: res.data.data ? '成功' : '失败',
                        message: res.data.msg,
                        type: res.data.data ? "success" : "error",
                        duration: 2000
                    });
                }else {
                    this.$notify({
                        title: "失败",
                        message: "id为空",
                        type: "error",
                        duration: 2000
                    });
                }
            },
            isShowLoading(list,id){
                list.forEach(item => {
                    if(item.id == id){
                        item.loading = !item.loading
                    }
                }); 
            }
        },
        filters: {
            filterMoney(value){
                return bcdiv(value, 10000, 3);
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
            },
            filterWay(value) {
                let mapList = {
                    wxpay_draw: '微信提现'
                }
                return mapList[value]
            }
        }
    }
</script>
