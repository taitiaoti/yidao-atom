<template>
    <div style="padding: 10px;">
        <div style="margin-bottom: 10px;">
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
            <el-button type="primary" icon="el-icon-plus" @click="recharge">充值</el-button>
        </div>
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <!-- <el-table-column
                align="center"
                label="应用名称">
                <template scope="scope">
                    <span>{{scope.row.appId | filterProgramName}}</span>
                </template>
            </el-table-column> -->
             <el-table-column
                align="center"
                label="账号">
                <template scope="scope">
                    <span>{{scope.row.payee}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="UID">
                <template scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>
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
                label="状态">
                <template scope="scope">
                    <el-tag :type="scope.row.status ? '': 'info'">{{scope.row.status | filterStatus}}</el-tag>
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
        <el-dialog title="消费积分充值" :visible.sync="dialogFormVisible" width="25%">
            <el-form :model="form">
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>                    
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth">
                    <el-input v-model="form.amount" placeholder="请输入充值金额"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRecharge">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { fetchRecharge ,fetchRechargeRechords } from '@/api/dongdong/recharge'
    import { resolveUrlPath, bcdiv, formartTime } from "@/util/util";
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data(){
            return {
                listQuery:{
                    page: 1,
                    limit: 10
                },
                appId: '',
                list: [],
                total: null,
                listLoading: true,
                phone: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                dialogFormVisible: false,
                formLabelWidth: '75px',
                form: {
                    appId: 'dongdong',
                    amount: '',
                    phone: ''
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
                    appId: "dongdong",
                    startTime: this.startTime,
                    endTime: this.endTime,
                    phone: this.phone
                }
                const res = await fetchRechargeRechords(postData);
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
            recharge(){
                this.dialogFormVisible = true;
            },
            // 17620466815
            async submitRecharge(){
                if(Number(this.form.amount) > 0){
                    let postData = {
                        appId: this.form.appId,
                        amount: Number(this.form.amount),
                        phone: this.form.phone,
                    }
                    const res = await fetchRecharge(postData);
                    console.log(res,'充值');
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
                    appId: 'dongdong',
                    amount: '',
                    phone: ''
                }
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
            }
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
            filterProgramName(value){
                let programeNameMap = {
                    'dongdong': '东东'
                }
                return programeNameMap[value]
            }
        }
    }
</script>
