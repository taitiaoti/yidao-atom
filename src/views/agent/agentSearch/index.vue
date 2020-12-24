<template>
    <div class="app-container calendar-list-container">
        <div style="margin-bottom: 10px;">    
            <el-input v-model="agentId" clearable style="width: 200px;" placeholder="代理商账号"></el-input>        
            <el-input v-model="agentName" clearable style="width: 200px;" placeholder="代理商名称"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="add" v-if="gent_add">新增代理商</el-button>
        </div>   
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                width="50"
                label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.seq}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="代理商账号">
                <template slot-scope="scope">
                    <span>{{scope.row.agentId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="代理商名称">
                <template slot-scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="手机号码">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="上级代理商">
                <template slot-scope="scope">
                    <span>{{scope.row.superName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100"
                label="代理商级别">
                <template slot-scope="scope">
                    <span>{{scope.row.level}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="100"
                align="center"
                label="账号状态">
                <template slot-scope="scope">
                    <el-tag>{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="备注信息">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.remark}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="角色名称">
                <template slot-scope="scope">
                    <span>{{scope.row.roleName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="审核状态">
                <template slot-scope="scope">
                    <el-tag>{{scope.row.auditStatus | filterAuditStatus}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="拒绝理由">
                <template slot-scope="scope">
                    <span>{{scope.row.reason}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.cTimeStr}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="agent_again_submit"
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.auditStatus == 2" size="small" @click="editor(scope.row)">重新提交审核</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form" :rules="rules" ref="ruleForm">
                <el-form-item label="应用名称" v-if="submitType == 'add'" :label-width="formLabelWidth">
                    <el-select v-model="form.appIds"  placeholder="请选择">
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
                <el-form-item label="代理账号" :label-width="formLabelWidth" prop="agentId">
                    <el-input v-model="form.agentId" clearable placeholder="请输入代理账号"></el-input>
                </el-form-item>
                <el-form-item label="代理商名称" :label-width="formLabelWidth" prop="agentName">
                    <el-input v-model="form.agentName" clearable placeholder="请输入代理商名称"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" v-if="submitType == 'add'" prop="psw">
                    <el-input v-model="form.psw" :type="passwordType" placeholder="请输入密码">
                         <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" type="number" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                    <el-input v-model="form.remark" clearable placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
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
    import { agentInfo, addAgent, agentIdValid, againSubmit } from '@/api/saas/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime,getAppName } from "@/util/util";
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
                    start: 1,
                    length: 10
                },
                agentId: '',
                agentName: '',
                currentAppList: [],
                total: null,
                dialogFormVisible: false,
                form: {
                    appIds: this.appId,
                    agentId: '',
                    agentName: '',
                    psw: '',
                    phone: '',
                    remark: '',
                    email: '',
                    company: '',
                    address: ''
                },
                formLabelWidth: '100px',
                passwordType: 'password',
                submitType: 'add',
                dialogTitle: '新增代理商',
                loading: false,
                gent_add: false,
                agent_again_submit: false,
                rules: {
                    agentId: [
                        { required: true, message: '请输入代理账号'},
                    ],
                    agentName: [
                        { required: true, message: '请输入代理商名称' },
                    ],
                    psw: [
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
                    agentId: this.agentId,
                    agentName: this.agentName
                }
                const res = await agentInfo(postData);
                this.list = res.data.aaData;
                this.total = res.data.iTotalRecords;
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
                this.listQuery.start = 0;
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
            add(){
                if(this.submitType != 'add'){
                    this.resetForm();
                }
                this.submitType = 'add';
                this.dialogTitle = '新增代理商';
                this.dialogFormVisible = true;
                this.form.appIds = this.appId;
            },
            editor(row){
                this.submitType = 'editor';
                this.dialogTitle = '重新提交审核';
                let postData = {
                    appId: row.appId,
                    agentId: row.agentId,
                    agentName: row.agentName,
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
                        this.loading = true;
                        const res = await agentIdValid({agentId: this.form.agentId});
                        if(res.data){
                            const res02 = await addAgent(this.form);
                            this.getList();
                            this.dialogFormVisible = false;
                            if(res02.data.data){
                                this.resetForm();
                            }
                            this.$notify({
                                title: res02.data.code == '0' ? '成功' : '错误',
                                message: res02.data.message,
                                type: res02.data.code == '0' ? 'success' : 'error',
                                duration: 2000
                            });
                            this.loading = false;
                        }else {
                            this.$notify({
                                title: '错误',
                                message: '该账号已存在',
                                type: 'error',
                                duration: 2000
                            });
                            this.loading = false;
                        }
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
                    appIds: '',
                    agentId: '',
                    agentName: '',
                    psw: '',
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
            }
        }
    }
</script>
<style lang="scss">

</style>
