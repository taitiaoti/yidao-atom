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
            <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入手机号码"></el-input>
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
            <el-button type="primary" icon="el-icon-plus" v-if="user_voucher_manage" @click="voucherUser('user')">用户充值</el-button>
            <el-button type="primary" icon="el-icon-plus" v-if="agent_voucher_manage" @click="voucherAgent('agent')">代理商充值</el-button>
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
                label="账号">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="UID">
                <template scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="充值金额（元）">
                <template scope="scope">
                    <span>{{scope.row.amount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作时间">
                <template scope="scope">
                    <span>{{scope.row.createTime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="说明">
                <template scope="scope">
                    <span>{{scope.row.remark}}</span>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="25%">
            <el-form :model="form">
                <el-form-item label="购物券" v-if="dialogTitle == '普通用户充值'" :label-width="formLabelWidth" >
                    <span style="color: #ff4242;">{{userInfo.coupon | filterCoupon}}</span>                   
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" clearable placeholder="请输入手机号码"></el-input>                    
                </el-form-item>
                <el-form-item label="购物券数量" :label-width="formLabelWidth">
                    <el-input v-model="form.amount" clearable placeholder="请输入购物券数量"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="voucherSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { fecthRechargeRecords, fecthRecharge } from '@/api/shoppingVoucher/voucher';
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
                phone: '',
                startTime: '',
                endTime: '',
                searchTime: '',
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
                formLabelWidth: '110px',
                dialogFormVisible: false,
                dialogTitle: '',
                form: {
                    phone: '',
                    amount: '',
                    type: ''
                },
                user_voucher_manage: false,
                agent_voucher_manage: false
            }
        },
        computed:{
            ...mapGetters(['permissions','userInfo']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
            this.user_voucher_manage = this.permissions['user_voucher_manage'];
            this.agent_voucher_manage = this.permissions['agent_voucher_manage'];
        },
        methods: {
            async getList(){
                let postData = {
                    ...this.listQuery,
                    appId: this.appId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    phone: this.phone
                }
                const res = await fecthRechargeRecords(postData);
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
            voucherUser(value){
                this.form.type = value;
                this.dialogTitle = '普通用户充值';
                this.dialogFormVisible = true;
            },
            voucherAgent(value){
                this.form.type = value;
                this.dialogTitle = '代理商充值';
                this.dialogFormVisible = true;
            },
            async voucherSubmit(){
                if(Number(this.form.amount) > 0){
                    let postData = {
                        appId: this.appId,
                        ...this.form
                    }
                    const res = await fecthRecharge(postData);
                    if(res.data.data) {
                        this.resetFrom();
                        this.getList();
                    }
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                }else {
                    this.$message('充值金额输入有误');
                }
                this.dialogFormVisible = false;
            },
            resetFrom(){
                this.form = {
                    phone: '',
                    amount: '',
                    type: ''
                };                
            },
        },
        filters: {
            filterMoney(value){
                return bcdiv(value, 10000, 3);
            },
            filterCoupon(value){
                return value/10000
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
