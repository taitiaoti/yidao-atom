<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto;">
                <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
            <el-date-picker
                style="width: 400px;"
                v-model="searchTime"
                type="daterange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="应用" width="300">
                <template scope="scope">
                    <span>{{ scope.row.appId | filterAppName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日期">
                <template scope="scope">
                    <span>{{ scope.row.startTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总人数">
                <template scope="scope">
                    <span>{{ scope.row.totalNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="通话总时长(秒)">
                <template scope="scope">
                    <span>{{ scope.row.totalTimes}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="通话总费用(元)">
                <template scope="scope">
                    <span>{{ scope.row.totalMoney/100 | saveFourthNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="平均通话时长(秒)">
                <template scope="scope">
                    <span>{{ scope.row.avgCallTimes | saveFourthNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="平均通话费用(分)">
                <template scope="scope">
                    <span>{{ scope.row.avgMoney | saveFourthNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="费率(分)">
                <template scope="scope">
                    <span>{{ scope.row.rate}}</span>
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
    import { getDayReport } from "@/api/statistics/index";
    import { bcdiv, formartTime, getAppName } from "@/util/util"
    import {mapGetters, mapMutations} from "vuex";
    export default {
        data() {
            return {
                appId: '',
                currentAppList: [],
                listQuery: {
                    page: 1,
                    limit: 10
                },
                list: [],
                baseUrl:"http://qiniu.edawtech.com/",
                listLoading: true,
                total: 0,
                searchTime: [],
                searchObj: {
                    startDate: '',
                    endTime: ''
                },
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
        created() {
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            //最近一星期
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.searchObj.startDate = formartTime(start,1);
            this.searchObj.endTime = formartTime(end,1);
            this.searchTime = [start, end]
            this.getList();
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        methods: {
            async getList(){
                let postData = {
                    appId: this.appId,
                    ...this.listQuery,
                    ...this.searchObj
                }
                this.listLoading = true;
                const res = await getDayReport(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = res.data.total;
            },
            search(){
                if(this.searchTime){
                    this.searchObj.startDate = formartTime(this.searchTime[0],1);
                    this.searchObj.endTime = formartTime(this.searchTime[1],1);
                }else {
                    this.searchObj.startDate = "";
                    this.searchObj.endTime = "";
                }
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            getDataByAppId(){
                this.getList();
            },
        },
        filters: {
            saveFourthNum(val){
                return Number(val).toFixed(4)
            },
            filterAppName(appId){
                return getAppName(appId)
            },
        }
    }
</script>
<style lang="scss">
    
</style>
