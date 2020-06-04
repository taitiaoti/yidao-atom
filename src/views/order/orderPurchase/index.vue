<template>
    <div class="order-purchase">
        <div style="margin-bottom: 10px;">
            <span style="color: #333;">搜索：</span>
            <el-select v-model="username" @change="changeAgent" v-if="this.isProAgent == 'y'" style="width: 180px;" placeholder="请选择省代理商">
                <el-option
                    v-for="item in agentProList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div v-for="(item, index) in list" :key="index">
            <div style="margin-bottom: 30px;">
                <div class="order-header">
                    <div class="order-info-item">
                        <span class="item-name">UID:</span>
                        <span class="item-value">{{item.uid}}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="item-name">订单编号:</span>
                        <span class="item-value">{{item.orderNo}}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="item-name">支付金额:</span>
                        <span class="item-value">{{item.totalAmount}}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="item-name">订单状态:</span>
                        <span class="item-value">{{item.orderStatus | orderStatusFilter}}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="item-name">下单时间:</span>
                        <span class="item-value">{{item.orderTime}}</span>
                    </div>
                    <div class="order-info-item">
                        <el-button type="primary" size="small" v-if="item.orderStatus === 0" @click="pay(item.orderNo)">去付款</el-button>
                    </div>
                </div>
                <el-table :key='index' :data="item.orderDetails" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                        highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="商品编号" width="180">
                        <template scope="scope">
                            <span>{{ scope.row.productNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品名称" width="400">
                        <template scope="scope">
                            <span>{{ scope.row.productName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品图" width="120">
                        <template scope="scope">
                            <img  :src="pictureLink(scope.row.picture)" height="100" width="80" >
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="价格（元）" width="120">
                        <template scope="scope">
                            <span>
                                {{scope.row.productPrice}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="京东价（元）" width="120">
                        <template scope="scope">
                            <span>
                                {{scope.row.jdPrice}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="数量" width="120">
                        <template scope="scope">
                            <span>
                                {{scope.row.productNum}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="选择支付方式" :visible.sync="dialogFormVisible" width="400px">
            <el-form>
                <el-form-item label="支付方式">
                    <el-select v-model="payChannel" @change="selectPayChannel" style="width: 120px;" placeholder="请选择">
                        <el-option
                        v-for="item in payChannelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="balance" style="margin-left: 10px; font-size: 16px; font-weight:bold;">余额：{{balance}} </span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" v-if="!isSubmit" :loading="balance == 0 && payChannel== 'redpay' " @click="jumpPay">确 定</el-button>
                <el-button type="primary" v-else :loading="true" @click="jumpPay">处理中...</el-button>            
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex' 
    import { findAgentUserByProAgent } from '@/api/saas/index'
    import { formartTime,resolveUrlPath, getPictureLink } from "@/util/util"
    import { fetchOrderList, getRedPackBalance, continuePay } from '@/api/product/purchaseBusiness'

    export default {
        data() {
            return {
                appId: '',
                currentAppList: [],
                listLoading: false,
                tableKey: 0,
                listQuery: {
                    page: 1,
                    limit: 10
                },
                list: [],
                total: null,
                dialogFormVisible: false,
                payChannel: 'wxpay',
                orderNo: '',
                balance: 0,
                payChannelList: [
                    {
                        value: 'alipay',
                        label: '支付宝'
                    },
                    {
                        value: 'wxpay',
                        label: '微信支付'
                    },
                    {
                        value: 'redpay',
                        label: '红包支付'
                    }
                ],
                isSubmit: false,
                isProAgent: '',
                username: '',
                agentProList: []
            }
        },
        computed: {
            ...mapGetters(['orderSearch','permissions','userInfo']),
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
                await this.getProAgent();
                this.listLoading = true;
                this.username = this.username ?  this.username : this.agentProList[0].value
                let postData = {
                    ...this.listQuery,
                    appId: this.appId,
                }
                if(this.isProAgent == 'y'){
                    postData.username = this.username;
                }else {
                    postData.username = this.userInfo.username;
                }
                const res = await fetchOrderList(postData);
                this.listLoading = false; 
                this.list = res.data.data.records;
                console.log(this.list,123)
                this.total = res.data.data.total;
            },
            async getProAgent(){
                let postData = {
                    appId: this.appId,
                }
                const res = await findAgentUserByProAgent(postData);
                this.isProAgent = res.data.isProAgent;
                this.agentProList = [{
                    label: this.userInfo.agentName,
                    value: this.userInfo.username
                }];
                if(res.data.agents.length != 0){
                    res.data.agents.forEach(item => {
                        this.agentProList.push({
                            label: item.agentName,
                            value: item.agentId
                        });
                    });
                }
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
            },
            pictureLink(url){
                return getPictureLink(url);
            },
            pay(val){
                this.balance = 0; //清空红包金额
                this.payChannel = 'wxpay'; //清空支付方式
                this.isSubmit = false; //设置为没有提交跳转付款页面
                this.orderNo = val;
                this.dialogFormVisible = true;
            },
            async selectPayChannel(val){
                if(val == 'redpay'){
                    const res = await getRedPackBalance();
                    this.balance = res.data;
                    console.log(res, '红包余额');
                }else {
                    this.balance = 0; //清空红包金额
                }
            },
            async jumpPay(val){
                this.isSubmit = true;
                let postData = {
                    payChannel: this.payChannel,
                }
                const res = await continuePay(this.orderNo, postData);
                if(this.payChannel == 'redpay'){ //红包下单成功后处理
                    this.$notify({
                        title: res.data.code === 0 ? '支付成功' : res.data.msg,
                        message: res.data.msg,
                        type: res.data.code === 0 ? 'success' : 'error',
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                }else { //微信支、付宝下单成功后处理
                    this.$notify({
                        title: res.data.code === 0 ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.code === 0 ? 'success' : 'error',
                        duration: 2000
                    });
                    if(res.data.code === 0){
                        this.$router.push({
                            path: resolveUrlPath("/product/purchaseBusinessPay"),
                            query: {
                                orderInfo: res.data.data
                            }
                        });
                    }
                }
            },
            changeAgent(){
                this.getList();
            }
        },
        filters: {
            orderStatusFilter(status) {
                const statusMap = {
                    '-1': '已取消',
                    '0': '未付款',
                    '1': '已付款',
                    '2': '已发送',
                    '3': '已签收',
                    '4': '已评价，订单完成',
                    '5': '已退款',
                    '6': '出库中'
                }
                return statusMap[status]
            },
            payChannelFilter(payChannel){
                const statusMap = {
                    redpay: '红包支付',
                    wxpay: '微信支付',
                    alipay: '支付宝支付',
                    balance: '在线余额'
                }
                return statusMap[payChannel]
            },
        }
    }
</script>
<style lang="scss">
    .order-purchase{
        padding: 20px;
        .order-header{
            display: flex;
            margin-bottom: 5px;
            .order-info-item{
                margin-right: 28px;
                .item-name{
                    color: #606266;
                }
                .item-value{
                    color: #333;
                    font-weight: bold;
                }
            }
        }
    }
</style>
