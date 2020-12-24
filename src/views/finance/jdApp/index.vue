<template>
    <div class="app-container calendar-list-container">
        <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="handleAdd">添 加</el-button>
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
                width="260"
                label="公司名称">
                <template slot-scope="scope">
                    <span>{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="已使用金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.totalUseMoney | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="余额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.balance | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="总金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.totalMoney | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100"
                label="启用状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isActive == 'n' ? 'info' : ''">{{scope.row.isActive | fitlerIsActive}}</el-tag>
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
                width="300"
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleRecharge(scope.row)">充 值</el-button>                    
                    <el-button type="success" size="small" @click="handleEditor(scope.row)">编 辑</el-button>                    
                    <el-button :type="scope.row.isActive  == 'n' ? 'primary' : 'danger'" size="small" @click="handleIsActive(scope.row)">{{scope.row.isActive  == 'n' ? '启用' : '禁用' }}</el-button>                    
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删 除</el-button>                    
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
        <el-dialog title="添加应用" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form" ref="ruleForm" :rules="rules">
                  <el-form-item label="应用ID" :label-width="formLabelWidth" prop="appId">
                    <el-input v-model="form.appId" placeholder="请输入应用ID"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" :label-width="formLabelWidth" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSumbitAdd('ruleForm')" v-if="handleType == 'add'" :loading="loading">确 定</el-button>
                <el-button type="primary" @click="handleSumbitEditor('ruleForm')" v-else :loading="loading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="充值" :visible.sync="dialogFormVisible02" width="400px">
            <el-form :model="form02" ref="ruleForm02" :rules="rules02">
                <el-form-item label="充值金额" :label-width="formLabelWidth" prop="money">
                    <el-input v-model="form02.money" placeholder="请输入充值金额"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible02 = false">取 消</el-button>
                <el-button type="primary" @click="handleSumbitRecharge('ruleForm02')" :loading="loading02">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { fetchList, add, fetchDetailById, editor, deleteItem, recharge, updateActive } from '@/api/finance/jdApp'
    import { formartTime, getAppName, bcdiv } from "@/util/util";
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data() {
            return {
                appId: '',
                currentAppList: [],
                listQuery:{
                    page: 1,
                    limit: 10
                },
                list: [],
                total: null,
                listLoading: true,
                loading: false,
                loading02: false,
                form: {
                    appId: '',
                    companyName: '',
                    username: ''
                },
                form02: {
                    money: ''
                },
                dialogFormVisible: false,
                dialogFormVisible02: false,
                formLabelWidth: '80px',
                rules: {
                    appId: [{ required: true, message: '请输入应用ID'}],
                    username: [{ required: true, message: '请输入用户名'}],
                    companyName: [{ required: true, message: '请输入公司名称'}],
                },
                rules02: {
                    money: [{ required: true, message: '请输入充值金额'}]
                },
                handleType: 'add',
                id: ''
            }
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
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
                    ...this.listQuery
                }
                const res = await fetchList(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = res.data.total;
            },
            handleAdd(){
                if(this.handleType != 'add'){
                    this.resetForm();
                }
                this.handleType = 'add';
                this.dialogFormVisible = true;
            },
            handleSumbitAdd(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        this.loading = true;
                        const res = await add(this.form);
                        this.loading = false;
                        this.dialogFormVisible = false;
                        this.getList();
                        this.$notify({
                            title: res.data.data ? '成功' : '错误',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
                        });
                        if(res.data.data){
                            this.resetForm();
                        }
                    }
                });
            },
            async handleEditor({id}){
                this.id = id;
                this.handleType = 'editor';
                if(id){
                    this.dialogFormVisible = true;
                    const res = await fetchDetailById(id);
                    this.form['appId'] = res.data.appId;
                    this.form['username'] = res.data.username;
                    this.form['companyName'] = res.data.companyName;
                }else {
                    this.$notify({
                        title: '错误',
                        message: 'ID不存在',
                        type: 'error',
                        duration: 3000
                    });
                }
            },
            async handleSumbitEditor(){
                this.loading = true;
                let postData = {
                    id: this.id,
                    ...this.form
                }
                const res = await editor(postData);
                this.loading = false;
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                    title: res.data.data ? '成功' : '错误',
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 3000
                });
                if(res.data.data){
                    this.resetForm();
                }
            },
            handleDelete({id}) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(async () => {
                    if(id){
                        const res = await deleteItem(id)
                        this.$notify({
                            title: res.data.data ? '成功' : '错误',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
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
                });
            },
            handleRecharge({id}){
                this.id = id;
                if(id){
                    this.dialogFormVisible02 = true;
                }
            },
            async handleSumbitRecharge(formName){
                this.$refs[formName].validate(async (valid) => {       
                    if(valid){
                        this.loading02 = true;
                        const res = await recharge(this.id, this.form02);
                        this.loading02 = false;
                        this.dialogFormVisible02 = false;
                        this.getList();
                        this.$notify({
                            title: res.data.data ? '成功' : '错误',
                            message: res.data.msg,
                            type: res.data.data ? 'success' : 'error',
                            duration: 3000
                        });
                        if(res.data.data){
                            this.resetForm02();
                        }
                    }
                });
            },
            async handleIsActive({id, isActive}){
                if(id){
                    let postData = {
                        id: id,
                        isActive: isActive === 'n' ? 'y' : 'n'
                    }
                    const res = await updateActive(postData)
                    this.$notify({
                        title: res.data.data ? '成功' : '错误',
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 3000
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
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            resetForm() {
                this.form = {
                    appId: '',
                    companyName: '',
                    username: ''
                }
            },
            resetForm02(){
                this.form02 = {
                    money: ''
                }
            }
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId)
            },
            filterMoney(value){
                return bcdiv(value, 10000, 2);
            },
            fitlerTime(value){
                return formartTime(new Date(value), 5);
            },
            fitlerIsActive(value){
                let mapList = {
                    y: '启用',
                    n: '禁用'
                }
                return mapList[value]
            }
        }
    }
</script>