<template>
    <div>
        <!-- 活动管理 -->
        <!-- 筛选 -->
        <div class="filter-container">
            <el-input
                v-model="searObj.activityName"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入活动类型名称"
                clearable
            >
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search"
                >搜索</el-button
            >
            <el-button type="primary" icon="el-icon-plus" @click="createType()"
                >添加活动类型</el-button
            >
        </div>
        <!-- 表格数据 -->
        <el-table
            :data="list"
            border
            v-loading="listLoading"
            fit
            highlight-current-row
            element-loading-text="给我一点时间"
            style="width:100%;margin-bottom:20px;">
            <el-table-column 
                align="center" 
                label="APP渠道">
                <template slot-scope="scope">
                    <span>{{ scope.row.appId | filterAppName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="活动类别ID">
                <template slot-scope="scope">
                    <span>{{scope.row.activityType}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="活动类别名称">
                <template slot-scope="scope">
                    <span>{{scope.row.activityName}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="展示位置">
                <template slot-scope="scope">
                    <span>{{scope.row.placeholder}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.ctime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="修改时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.utime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作">
                <template slot-scope="scope">
                    <el-button size='mini' type='primary' @click="createType(scope.row)">编辑</el-button>
                    <el-button size='mini' type='danger' @click="handDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页插件 -->
        <!-- <div v-show="!listLoading" class="pagination-container">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNum"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            ></el-pagination>
        </div> -->
        <!-- 添加修改对话框 -->
        <el-dialog
            :title="dialogType == 'create' ? '添加活动类型' : '编辑活动类型' "
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form label-width="100px" :model="activityTypeInfo" ref="form" >
                <el-form-item label="APP渠道">
                    <el-select v-model="activityTypeInfo.appId" placeholder="请选择渠道名称">
                        <el-option
                            v-for="item in appIdList"
                            :key="item.appId"
                            :label="item.appName"
                            :value="item.appId">
                            <span style="float: left">{{ item.appName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='活动类型ID'>
                    <el-input v-model="activityTypeInfo.activityType" placeholder='请输入活动类型ID' :disabled='activityIdDisabled'></el-input>
                </el-form-item>
                <el-form-item label='活动类型名'>
                    <el-input v-model="activityTypeInfo.activityName" placeholder='请输入活动类型名称'></el-input>
                </el-form-item>
                <el-form-item label='排序'>
                    <el-input v-model="activityTypeInfo.placeholder" placeholder='请输入排序'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="affirmActivityInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { activityTypeList, addActivityType, editorActivityType } from '@/api/groupPurchase/activityType'
import { formartTime, getAppName } from "@/util/util";
import { mapGetters } from 'vuex';
export default {
    data(){
        return {
            listQuery: {
                page: 1,
                limit: 20
            },
            searObj: {
                activityName: '',
                state: 1
            },
            list: [],
            listLoading: false,
            total: 0,
            appData: [],
            activityTypeInfo: {             //活动信息
                appId: '',
                activityType: '',
                activityName: '',
                placeholder: ''
            },          
            dialogVisible: false, 
            dialogType: 'create',
            activityIdDisabled: false
        }
    },
    computed:{
        ...mapGetters('appId',{
            appIdList: 'appList'
        })
    },
    created(){
        this.activityTypeInfo.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
        this.getList()
    },
    methods: {
        // 获取列表数据
        getList(){
            this.listLoading = true;
            let postData = {
                ...this.searObj,
                ...this.listQuery
            }
            activityTypeList(postData).then((res)=>{
                console.log(res,'列表')
                this.list = res.data.records;
                this.listLoading = false;
            })
        },
        // 搜索
        search(){
            this.getList();
        },
        // 添加活动类型
        createType(obj){
            if(obj){
                this.activityTypeInfo.appId = obj.appId;
                this.activityTypeInfo.activityType = obj.activityType;
                this.activityTypeInfo.placeholder = obj.placeholder;
                this.activityTypeInfo.activityName = obj.activityName;
                this.activityTypeInfo.id = obj.id;
                // 修改
                this.activityIdDisabled = true;
                this.dialogType = 'update';
            }else{
                // 添加
                this.dialogType = 'create'
            }
            this.dialogVisible = true;
        },
        // 删除活动类型
        handDelete(id){
            let postData = {
                state: 2,
                id: id
            }
            this.$alert('确定要删除吗？', '删除', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action == 'confirm'){   
                        editorActivityType(postData).then((res)=>{
                            if(res.data.code == 0){
                                this.getList()
                            }
                            this.$notify({
                                title: res.data.code == 0 ? "成功" : '失败',
                                message: res.data.msg,
                                type: res.data.code == 0 ? "success" : 'error',
                                duration: 1500
                            });
                        })
                    }
                }
            });
        },
        // 确定添加修改
        affirmActivityInfo(){
            this.activityTypeInfo.state = 1;
            if(this.dialogType == 'create'){
                // 添加
                addActivityType(this.activityTypeInfo).then((res)=>{
                    this.notify(res)
                })
            }else{
                // 修改
                editorActivityType(this.activityTypeInfo).then((res)=>{
                    this.notify(res)
                })
            }
        },
        // 弹窗提示
        notify(res){
            if(res.data.code == 0){
                this.handleClose();
                this.getList();
            }
            this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
            });
        },
        //页码改变事件
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        // 关闭对话框
        handleClose(){
            this.dialogVisible = false;
            this.activityIdDisabled = false;
            this.activityTypeInfo = {             
                appId: this.appIdList.length !== 0 ? this.appIdList[0].appId : '',
                activityType: '',
                activityName: '',
                placeholder: ''
            }
        }
    },
    filters: {
        filterAppName(appId){
            return getAppName(appId)
        },
        fitlerTime(value){
            return formartTime(new Date(value), 5);
        },
    }
};
</script>

<style>
</style>