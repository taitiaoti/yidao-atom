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
            <el-input v-model="orderNo" clearable style="width: 260px;" placeholder="请输入订单号"></el-input>
            <el-input v-model="productName" clearable style="width: 260px;" placeholder="请输入商品名称"></el-input>
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
            <el-button class="filter-item" @click="handleExport" type="primary" :loading="loading" icon="el-icon-download"> 导出</el-button>
        </div>
        <el-table
            v-loading="listLoading"
            :data="tableData"
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
                label="订单号">
                <template scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="商品名称">
                <template scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="商品规格">
                <template scope="scope">
                    <span>{{scope.row.productModeDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="总数量（件）">
                <template scope="scope">
                    <span>{{scope.row.productNum}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="商城价格（元）">
                <template scope="scope">
                    <span>{{scope.row.totalAmount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="京东价（元）">
                <template scope="scope">
                    <span>{{scope.row.amount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作时间">
                <template scope="scope">
                    <span>{{scope.row.payTime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="备注">
                <template scope="scope">
                    <span>{{scope.row.orderJdStatus}}</span>
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
    import { fetchList, fetchExport } from '@/api/finance/jdConsume'
    import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data(){
            return {
                listQuery:{
                    page: 1,
                    limit: 10
                },
                pageNum: 1,
                pageSize: 10,
                appId: '',
                currentAppList: [],
                tableData: [],
                total: null,
                listLoading: true,
                loading: false,
                orderNo: '',
                productName: '',
                startTime: '',
                endTime: '',
                searchTime: [new Date(1970, 11, 1, 10, 10), new Date(2100, 1, 1, 10, 10)],
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
                            console.log(start,end)

                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                spanArr:[],
                position: 0
            }
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            // this.getList();
            this.getTime();
        },
        methods: {
            getTime(){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                console.log(start,end)
                this.searchTime = [start,end]
                this.startTime = formartTime(start,5);
                this.endTime = formartTime(end,5);
                this.getList();
            },
            async getList(){
                this.listLoading = true;
                let postData = {
                    ...this.listQuery,
                    appId: this.appId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    orderNo: this.orderNo,
                    productName: this.productName
                }
                const res = await fetchList(postData);
                console.log(res,'jd')
                this.listLoading = false;
                this.tableData = res.data.records;
                this.total = res.data.total;
            },
                // 导出商品信息
            async handleExport(){
                this.loading = true;
                let postData = {
                    orderNo: this.orderNo,
                    productName: this.productName,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    appId: this.appId
                }
                const res = await fetchExport(postData);
                console.log(res,'导出数据')
                this.loading = false;
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                }
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
            getDataByAppId(){
               this.getList(); 
            },
        },
        filters: {
            filterMoney(value){
                if(value){
                    return bcdiv(value, 10000, 2);
                }else{
                    return 0
                }
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
