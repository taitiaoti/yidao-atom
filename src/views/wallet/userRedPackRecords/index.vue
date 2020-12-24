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
            <!-- <el-select v-model="action" clearable @change="changeAction" placeholder="请选择红包类型" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                v-for="(item, index) in actionList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
            <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入用户账户"></el-input>
            <el-input v-model="invitedPhone" clearable style="width: 200px;" placeholder="请输入支付用户账户"></el-input>
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
            <!-- <el-button type="primary" icon="el-icon-download" :loading="loading" @click="exportLog">导出</el-button> -->
        </div>
        <el-table
            v-loading="listLoading"
            element-loading-text="给我一点时间" 
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
                label="所属代理商名称">
                <template slot-scope="scope">
                    <span>{{scope.row.agentName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="用户UID">
                <template slot-scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="用户账号">
                <template slot-scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="推荐人手机号">
                <template slot-scope="scope">
                    <span>{{scope.row.invitedPhone}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="红包金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="红包类型">
                <template slot-scope="scope">
                    <el-tag>{{scope.row.action | fitlerAction}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.ctime | fitlerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="支付用户账号">
                <template slot-scope="scope">
                    <span>{{ scope.row.invitedPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="说明">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
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
    </div>
</template>
<script>
    import { fetchUserRecords } from '@/api/dongdong/userWallet'
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
                startTime: '',
                endTime: '',
                searchTime: '',
                invitedPhone: '',           //推荐人手机号
                // action: '',
                // actionList: [{
                //     label: '购物',
                //     value: 'shop'
                // },{
                //     label: '提现',
                //     value: 'draw'
                // },{
                //     label: '购物分润',
                //     value: 'shopSplit'
                // },{
                //     label: '充值分润',
                //     value: 'split'
                // }],
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
            this.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
        },
        methods: {
            async getList(){
                this.listLoading = true;
                let postData = {
                    ...this.listQuery,
                    appId: this.appId,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    phone: this.phone,
                    invitedPhone: this.invitedPhone
                    // action: this.action
                }
                const res = await fetchUserRecords(postData);
                console.log(res,'红包明细')
                this.list = res.data.records;
                // this.list.forEach(item => {
                //     this.$set(item, 'money', null); //响应式添加根对象属性 
                // });
                this.total = res.data.total;
                this.listLoading = false;
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
            // async exportLog(){
            //     if(this.searchTime){
            //         let postData = {
            //             appId: this.appId,
            //             startTime: formartTime(this.searchTime[0],5),
            //             endTime: formartTime(this.searchTime[1],5),
            //             phone: this.phone,
            //             action: this.action
            //         }
            //         this.loading = true;
            //         const res = await fetchLogExport(postData);
            //         this.loading = false;
            //         if(res.status == 200){
            //             window.location.href = res.request.responseURL;
            //             this.$notify({
            //                 title: '成功',
            //                 message: '正在处理数据，请稍等...',
            //                 type: 'success',
            //                 duration: 4000
            //             });
            //         }
            //     }else {
            //         this.$notify({
            //             title: '导出警告！',
            //             message: '请选择要日期时间',
            //             type: 'warning'
            //         });
            //     }
            // },
            getDataByAppId(){
               this.getList(); 
            },
            // changeAction(){
            //    this.getList();
            // },
        },
        filters: {
            filterMoney(value){
                if(value || value == 0){
                    let num = (value / 10000).toFixed(2);
                    return num;
                }
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
                    charge: '充值',
                    deduct: '扣减',
                    split: '分润',
                    draw: '提现',
                    refund: '订单退款',
                    shop: '购买商品',
                    shopSplit:'购物分润',
                    redPacket: '加油分润'
                }
                return actionMap[value]
            }
        }
    }
</script>
