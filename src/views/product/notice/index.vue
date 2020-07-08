<template>
    <div class="app-container calendar-list-container">
        <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto; margin-bottom:10px;">
            <el-option
            v-for="(item, index) in currentAppList"
            :key="index"
            :label="item.appName"
            :value="item.appId">
            <span style="float: left">{{ item.appName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
            </el-option>
        </el-select>
        <el-table
            :data="list"
            height="600"
            v-loading="listLoading" 
            border
            style="width: 100%">
            <el-table-column
                align="center"
                label="序号">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="应用名称">
                <template scope="scope">
                    <span>{{scope.row.appId | filterAppName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="通知内容">
                <template scope="scope">
                    <span>{{scope.row.notice}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="通知时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | fitlterTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="是否处理">
                <template scope="scope">
                    <el-tag :type="scope.row.status == 0 ? 'info' : 'success'">{{scope.row.status | filterStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220px">
                <template scope="scope">
                    <el-button size="small"
                                @click="handleUpdate(scope.row)">处理
                    </el-button>
                    <el-button size="mini" type="danger"
                                @click="handleDelete(scope.row)">删除
                    </el-button>
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
    import { fetchNoticeList, editorNotice, deleteNotice } from "@/api/product/notice";
    import { getAppName, timestampToTime } from "@/util/util";
    import {mapGetters, mapMutations} from "vuex";
    export default {
        data(){
            return {
                listQuery: {
                    page: 1,
                    limit: 12
                },
                currentAppList: [],
                appId: '',
                listLoading: true,
                list: [],
                total: null
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
                    appId: this.appId
                }
                this.listLoading = true;
                const res = await fetchNoticeList(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = res.data.total;
                console.log(res, '通知');
            },
            getDataByAppId(){
                this.getList();
            },
            async handleUpdate({id}){
                const res = await editorNotice(id);
                this.$notify({
                    title: res.statusText,
                    message: res.data.msg,
                    type: res.data.data ? "success" : 'error',
                    duration: 2000
                });
                this.getList();
            },
            handleDelete({id}){
                this.$alert('你确定删除该通知记录？', '删除', {
                    confirmButtonText: '确定',
                    callback:async action => {
                        if(action == 'confirm'){
                            if(id){
                                const res = await deleteNotice(id);
                                this.$notify({
                                    title: res.statusText,
                                    message: res.data.msg,
                                    type: res.data.data ? "success" : 'error',
                                    duration: 2000
                                });
                                this.getList();
                            }else {
                                this.$notify({
                                    title: "失败",
                                    message: "id为空",
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        }   
                    }
                });
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            timestampToTime(timestamp){
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D+h+m+s;
            },
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId)
            },
            filterStatus(value){
                let statusMap = {
                    0: '未处理',
                    1: '已处理'
                }
                return statusMap[value]
            },
            fitlterTime(timestamp){
                return timestampToTime(timestamp);
            }
        },
    }
</script>
