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
            <el-select v-model="type" clearable placeholder="请选择发送目标" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                    v-for="(item, index) in sendTargetList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
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
                <template slot-scope="scope">
                    <span>{{scope.row.appId | filterAppName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="推送标题">
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="推送内容">
                <template slot-scope="scope">
                    <span>{{scope.row.content}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="发送目标">
                <template slot-scope="scope">
                    <span>{{scope.row.type | filterType}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="平台来源">
                <template slot-scope="scope">
                    <span>{{scope.row.platform | filterPlatform}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="是否推送">
                <template slot-scope="scope">
                    <span>{{scope.row.status == 1 ? '否' : '是'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="苹果类名">
                <template slot-scope="scope">
                    <span>{{scope.row.iosClassName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="安卓类名">
                <template slot-scope="scope">
                    <span>{{scope.row.androidClassName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="苹果参数内容">
                <template slot-scope="scope">
                    <span>{{scope.row.iosParams}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="安卓参数内容">
                <template slot-scope="scope">
                    <span>{{scope.row.androidParams}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="240"
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" :disabled="scope.row.status === 2" size="mini" @click="handleSendAurora(scope.row)">推送</el-button>
                    <el-button type="primary"  size="mini" @click="handleEditor(scope.row)">编辑</el-button>
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
    import { fetchList, delAurora, sendAurora } from '@/api/push/aurora'
    import { resolveUrlPath, bcdiv, formartTime, getAppName } from "@/util/util";
    import {sendTargetMap, sendTargetList, platformMap, platformList} from '@/util/data'
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
                title: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                type: '',
                sendTargetList: sendTargetList,
                platformList: platformList,
                platform: '',
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
                    title: this.title,
                    type: this.type,
                    platform: this.platform
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
            getDataByAppId(){
               this.getList(); 
            },
            jumpAdd(){
                this.$router.push({
                    path: resolveUrlPath("/push/addAuroraPush"),
                    query: {
                        id: '',
                        type: 'add'
                    }
                })
            },
            async handleSendAurora({id}) {
                 this.$confirm('此操作修改完成后将不能再编辑, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    if(id){
                        const res = await sendAurora(id);
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
            handleEditor({id}){
                this.$router.push({
                    path: resolveUrlPath("/push/addAuroraPush"),
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
                        const res = await delAurora(id);
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
