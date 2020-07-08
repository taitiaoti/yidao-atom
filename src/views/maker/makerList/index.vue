<template>
    <div class="app-container calendar-list-container">
        <div style="margin-bottom: 10px;">    
            <el-input v-model="makerId" clearable style="width: 200px;" placeholder="请输入创客账号"></el-input>        
            <el-input v-model="makerName" clearable style="width: 200px;" placeholder="请输入创客姓名"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="add">新增创客</el-button>
        </div>   
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                width="80"
                label="ID">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="账户">
                <template scope="scope">
                    <span>{{scope.row.makerId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="名称">
                <template scope="scope">
                    <span>{{scope.row.makerName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="手机号码">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="上级代理商">
                <template scope="scope">
                    <span>{{scope.row.superName}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                width="100"
                label="代理商级别">
                <template scope="scope">
                    <span>{{scope.row.level}}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                width="100"
                align="center"
                label="账号状态">
                <template scope="scope">
                    <el-tag>{{scope.row.status}}</el-tag>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="备注信息">
                <template scope="scope">
                    <span>
                        {{scope.row.remark}}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="角色名称">
                <template scope="scope">
                    <span>{{scope.row.roleName}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="审核状态">
                <template scope="scope">
                    <el-tag>{{scope.row.auditStatus | filterAuditStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="拒绝理由">
                <template scope="scope">
                    <span>{{scope.row.reason}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="创建时间">
                <template scope="scope">
                    <span>{{scope.row.ctime | filterTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="agent_again_submit"
                align="center"
                label="操作">
                <template scope="scope">
                    <el-button type="primary" v-if="scope.row.auditStatus == 2" size="small" @click="editor(scope.row)">重新提交审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="listQuery.page"
                            :page-sizes="[10,20,30, 50]" :page-size="listQuery.length"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="应用名称" v-if="submitType == 'add'" :label-width="formLabelWidth">
                    <el-select v-model="form.appId"  placeholder="请选择">
                        <el-option
                            v-for="(item, index) in currentAppList"
                            :key="index"
                            :label="item.appName"
                            :value="item.appId">
                            <span>{{ item.appName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用名称" v-if="submitType == 'editor'" :label-width="formLabelWidth">
                    <el-select v-model="form.appId"  placeholder="请选择">
                        <el-option
                            v-for="(item, index) in currentAppList"
                            :key="index"
                            :label="item.appName"
                            :value="item.appId">
                            <span>{{ item.appName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创客账户" :label-width="formLabelWidth" prop="makerId">
                    <el-input v-model="form.makerId" clearable placeholder="请输入创客账户"></el-input>
                </el-form-item>
                <el-form-item label="创客姓名" :label-width="formLabelWidth" prop="makerName">
                    <el-input v-model="form.makerName" clearable placeholder="请输入创客姓名"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" v-if="submitType == 'add'" prop="password">
                    <el-input v-model="form.password" :type="passwordType" placeholder="请输入密码">
                         <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" type="number" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="备        注" :label-width="formLabelWidth" prop="remark">
                    <el-input v-model="form.remark" clearable placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="邮        箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="form.email" clearable placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
                    <el-input v-model="form.company" clearable placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item label="联系地址" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="form.address" clearable placeholder="请输入联系地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd('ruleForm')" v-if="submitType == 'add'" :loading="loading">确 定</el-button>
                <el-button type="primary" @click="agentSubmitAdd('ruleForm')" v-else :loading="loading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { fetchList, add, againSubmit } from '@/api/maker/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime, getAppName } from "@/util/util";
    import {isvalidatemobile} from '@/util/validate';
    var validPhone = (rule, value, callback) => {
        if(!value){
            callback(new Error('请输入电话号码'))
        }else if(isvalidatemobile(value)[0]){
            callback(new Error(isvalidatemobile(value)[1]))
        }else {
            callback();
        }
    }

    export default{
        data(){
            return {
                appId: '',
                listLoading: true,
                list: [],
                listQuery:{
                    page: 1,
                    limit: 10
                },
                makerId: '',
                makerName: '',
                currentAppList: [],
                total: null,
                dialogFormVisible: false,
                form: {
                    appId: this.appId,
                    makerId: '',
                    makerName: '',
                    password: '',
                    phone: '',
                    remark: '',
                    email: '',
                    company: '',
                    address: ''
                },
                formLabelWidth: '100px',
                passwordType: 'password',
                submitType: 'add',
                dialogTitle: '新增创客',
                loading: false,
                gent_add: false,
                agent_again_submit: false,
                rules: {
                    makerId: [
                        { required: true, message: '请输入创客账户'},
                    ],
                    makerName: [
                        { required: true, message: '请输入创客姓名' },
                    ],
                    password: [
                        { required: true, message: '请输入密码'},
                    ],
                    phone: [
                        { required: true, trigger:['blur', 'change'], validator:validPhone },
                    ],
                    remark: [
                        { required: true, message: '请输入备注' },
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    company: [
                        { required: true, message: '请输入公司名称'},
                    ],
                    address: [
                        { required: true, message: '请输入联系地址'},
                    ],
                }
            }
        },
        computed:{
            ...mapGetters(['permissions']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.gent_add = this.permissions['gent_add'];
            this.agent_again_submit = this.permissions['agent_again_submit'];
            this.getList();
        },
        methods: {
            async getList(){
                let postData = {
                    appId: this.appId,
                    ...this.listQuery,
                    makerId: this.makerId,
                    makerName: this.makerName,
                    startTime: '',
                    endTime: ''
                }
                const res = await fetchList(postData);
                this.list = res.data.records;
                this.total = res.data.total;
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
                this.listQuery.page = 0;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            add(){
                if(this.submitType != 'add'){
                    this.resetForm();
                }
                this.submitType = 'add';
                this.dialogTitle = '新增创客';
                this.dialogFormVisible = true;
                this.form.appId = this.appId;
            },
            editor(row){
                this.submitType = 'editor';
                this.dialogTitle = '重新提交审核';
                let postData = {
                    appId: row.appId,
                    makerId: row.makerId,
                    makerName: row.makerName,
                    phone: row.phone,
                    remark: row.remark,
                    email: row.email,
                    company: row.company,
                    address: row.address,
                    id: row.id
                }
                this.form = postData
                this.dialogFormVisible = true;
            },
            submitAdd(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        const res02 = await add(this.form);
                        this.getList();
                        this.dialogFormVisible = false;
                        if(res02.data.data){
                            this.resetForm();
                        }
                        this.$notify({
                            title: res02.data.data ? '成功' : '错误',
                            message: res02.data.msg,
                            type: res02.data.data ? 'success' : 'error',
                            duration: 2000
                        });
                        this.loading = false;


                        // this.loading = true;
                        // const res = await agentIdValid({makerId: this.form.makerId});
                        // if(res.data){
                        //     const res02 = await add(this.form);
                        //     this.getList();
                        //     this.dialogFormVisible = false;
                        //     if(res02.data.data){
                        //         this.resetForm();
                        //     }
                        //     this.$notify({
                        //         title: res02.data.code == '0' ? '成功' : '错误',
                        //         message: res02.data.message,
                        //         type: res02.data.code == '0' ? 'success' : 'error',
                        //         duration: 2000
                        //     });
                        //     this.loading = false;
                        // }else {
                        //     this.$notify({
                        //         title: '错误',
                        //         message: '该账号已存在',
                        //         type: 'error',
                        //         duration: 2000
                        //     });
                        //     this.loading = false;
                        // }
                    }else {
                        return false;
                    }
                });
            },
            async agentSubmitAdd(formName){
                 this.$refs[formName].validate(async (valid) => {
                     if(valid){
                         this.loading = true;
                         const res = await againSubmit(this.form);
                         this.loading = false;
                         this.$notify({
                             title: res.data.data ? '成功' : '错误',
                             message: res.data.msg,
                             type: res.data.data ? 'success' : 'error',
                             duration: 3000
                         });
                         this.dialogFormVisible = false;
                         this.getList();
                     }else {
                         return false;
                     }
                 });
            },
            showPassword() {
                this.passwordType == ""
                    ? (this.passwordType = "password")
                    : (this.passwordType = "");
            },
            resetForm() {
                this.form = {
                    appId: '',
                    makerId: '',
                    makerName: '',
                    password: '',
                    phone: '',
                    remark: '',
                    email: '',
                    company: ''
                }
            }
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId)
            },
            filterAuditStatus(value){
                let mapList = {
                    '0': '等待审核',
                    '1': '已通过',
                    '2': '已拒绝',
                    'null': '已通过'
                }
                return mapList[value]
            },
            filterTime(time){
                if(time){
                    return formartTime(new Date(time), 5);
                }
            },
        }
    }
</script>
<style lang="scss">

</style>
