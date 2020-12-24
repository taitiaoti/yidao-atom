<template>
    <div style="padding: 10px;">
        <div>
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
            <el-input v-model="invitedPhone" clearable style="width: 200px;" placeholder="请输入推荐人手机号码"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-download" :loading="loading" @click="exportLog">{{loading ? '正在导出...' : '导出'}}</el-button>
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
                label="账号">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="UID">
                <template slot-scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="红包余额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.balance | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="红包总额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="推荐人账号">
                <template slot-scope="scope">
                    <span>{{scope.row.invitedPhone}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button slot="reference" type="primary" size="small"  @click="update(scope.row)">调整</el-button>                    
                </template>
            </el-table-column> -->
            <!-- <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status ? '': 'info'">{{scope.row.status | filterStatus}}</el-tag>
                </template>
            </el-table-column> -->
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="listQuery.page"
                            :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- <el-dialog title="调整红包积分" :visible.sync="dialogFormVisible" width="25%">
            <el-form :model="form">
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>                    
                </el-form-item>
                <el-form-item label="红包金额" :label-width="formLabelWidth">
                    <el-input v-model="form.amount" placeholder="请输入红包金额"></el-input>
                </el-form-item>
                <el-form-item label="操作类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.action">
                        <el-radio :label="'increase'">增加</el-radio>
                        <el-radio :label="'subtract'" :disabled="isSubstract">扣除</el-radio>
                    </el-radio-group>               
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth">
                    <el-input v-model="form.remark" type="textarea" placeholder="调整红包积分说明"></el-input>                    
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpdate">确 定</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
    import { userInviteRedPackList, fetchWalletExport } from '@/api/inviteRedPack/index'
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
                invitedPhone: '',
                dialogFormVisible: false,
                formLabelWidth: '75px',
                form: {
                    appId: '',
                    amount: '',
                    phone: '',
                    action: 'increase',
                    remark: ''
                },
                isSubstract: false
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
                    phone: this.phone,
                    invitedPhone: this.invitedPhone
                }
                const res = await userInviteRedPackList(postData);
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
            update(row){
                this.dialogFormVisible = true;
                console.log(row,'111');
                this.form.phone = row.phone;
                this.form.action = 'increase';
                this.form.amount = '';
                this.form.appId = this.appId;
                row.balance != 0 ? this.isSubstract = false : this.isSubstract = true;
                //  form: {
                //     appId: 'dongdong',
                //     amount: '',
                //     phone: '',
                //     action: 'increase',
                //     remark: ''
                // },
            },
            // async submitUpdate(){
            //     if(Number(this.form.amount) > 0){
            //         let postData = {
            //             appId: this.form.appId,
            //             amount: Number(this.form.amount),
            //             phone: this.form.phone,
            //             action: this.form.action,
            //             remark: this.form.remark
            //         }
            //         const res = await updateUserWallet(postData);
            //         console.log(res,'调整');
            //         if(res.data.data) {
            //             this.resetFrom();
            //             this.getList();
            //         }
            //         this.$notify({
            //             title: res.data.data ? res.statusText : res.data.msg,
            //             message: res.data.msg,
            //             type: res.data.data ? 'success' : 'error',
            //             duration: 2000
            //         });
            //     }else {
            //         this.$message('充值金额输入有误');
            //     }
            //     this.dialogFormVisible = false;
            // },
            resetFrom(){
               this.form.remark = '';
               this.form.amount = '';
            },
            search(){
                this.getList();
            },
            async exportLog(){
                let postData = {
                    appId: this.appId,
                    invitedPhone: this.invitedPhone,
                    phone: this.phone,
                }
                this.loading = true;
                const res = await fetchWalletExport(postData);
                this.loading = false;
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                    this.orderStatus = '';
                    this.$notify({
                        title: '成功',
                        message: '正在处理数据，请稍等...',
                        type: 'success',
                        duration: 4000
                    });
                }
            },
            getDataByAppId(){
               this.getList(); 
            },
        },
        filters: {
            filterMoney(value){
                return bcdiv(Number(value), 10000, 2);
            },
            filterStatus(value){
                let statusMap = {
                    "0": "充值失败",
                    "1": "充值成功"
                }
                return statusMap[value]
            },
            fitlerTime(value){
                return formartTime(new Date(value), 5);
            },
            filterAppName(appId){
                return getAppName(appId)
            }
        }
    }
</script>
