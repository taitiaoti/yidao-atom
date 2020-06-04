<template>
    <div style="padding: 10px;">
        <div style="margin-bottom: 10px;">
            <el-button type="primary" icon="el-icon-plus" @click="jumpAdd">添加</el-button>
        </div>
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
            <el-input v-model="title" clearable style="width: 260px;" placeholder="请输入推送标题"></el-input>
            <el-select v-model="platform" clearable placeholder="请选择平台来源" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                    v-for="(item, index) in platformList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
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
                label="应用名称">
                <template scope="scope">
                    <span>{{scope.row.appId | filterAppName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="推送标题">
                <template scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="140"
                align="center"
                label="推送图片">
                <template scope="scope">
                     <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" width="120" >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="平台来源">
                <template scope="scope">
                    <span>{{scope.row.platform | filterPlatform}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="最小苹果版本号">
                <template scope="scope">
                    <span>{{scope.row.minIosVersion}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="最小安卓版本号">
                <template scope="scope">
                    <span>{{scope.row.minAndroidVersion}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="最大苹果版本号">
                <template scope="scope">
                    <span>{{scope.row.maxIosVersion}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="最大安卓版本号">
                <template scope="scope">
                    <span>{{scope.row.maxAndroidVersion}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="苹果参数内容">
                <template scope="scope">
                    <span>{{scope.row.iosParams}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="安卓参数内容">
                <template scope="scope">
                    <span>{{scope.row.androidParams}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="160"
                align="center"
                label="创建时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="220"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button :type="scope.row.isShow == 'n' ? 'primary' : 'danger'" size="mini" @click="updataOnShow(scope.row)">{{scope.row.isShow == 'n' ? '上架' : '下架'}}</el-button>                    
                    <el-button type="primary" size="mini" @click="handleEditor(scope.row)">编辑</el-button>                    
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>                    
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
    // import { fetchList } from '@/api/finance/consume'
    import { fetchList, delPush, onShow } from '@/api/push/homePage'
    import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
    import {sendTargetMap, sendTargetList, platformMap, platformList} from '@/util/data'
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data(){
            return {
                baseUrl:"http://qiniu.edawtech.com/",
                listQuery:{
                    page: 1,
                    limit: 10
                },
                appId: '',
                currentAppList: [],
                list: [],
                total: null,
                listLoading: true,
                title: '',
                platform: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                platformList: platformList,
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
                    platform: this.platform,
                    title: this.title
                }
                const res = await fetchList(postData);
                this.listLoading = false;
                this.list = res.data.records;
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
            jumpAdd(){
                this.$router.push({
                    path: resolveUrlPath("/push/addHomePagePush"),
                    query: {
                        id: '',
                        type: 'add'
                    }
                })
            },
            handleEditor({id}){
                this.$router.push({
                    path: resolveUrlPath("/push/addHomePagePush"),
                    query: {
                        id: id,
                        type: 'editor'
                    }
                })
            },
            handleDelete({id}){
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    if(id){
                        const res = await delPush(id);
                        this.$notify({
                            title: res.data.data ? '成功' : '失败',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
                        });
                        this.getList();
                    }else {
                        this.$notify({
                            title: '失败',
                            message: 'id丢失，请联系开发人员！',
                            type: 'error',
                            duration: 6000
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            async updataOnShow({id, isShow}){
                let tempIsShow = isShow == 'n' ? 'y' : 'n';
                let postData = {
                    appId: this.appId,
                    id: id,
                    isShow: tempIsShow
                }
                const res = await onShow(postData);
                this.getList();
            },
            getDataByAppId(){
               this.getList(); 
            },
        },
        filters: {
            fitlerTime(value){
                return formartTime(new Date(value), 5);
            },
            filterAppName(appId){
                return getAppName(appId);
            },
            filterType(val) {
                return sendTargetMap[val];
            },
            filterPlatform(val) {
                return platformMap[val]
            }
        }
    }
</script>
