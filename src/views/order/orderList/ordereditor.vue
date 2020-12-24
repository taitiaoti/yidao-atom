<template>
    <div class="app-container calendar-list-container">
        <el-tabs type="border-card">
            <el-tab-pane label="订单信息" v-if="jumpType != 'agent'">
                <el-table :key='tableKey' :data="orderInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="订单号">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderNo}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="商品名称">
                        <template slot-scope="scope">
                            <span>{{ scope.row.productName}}</span>
                        </template>
                    </el-table-column>   -->
                    <el-table-column align="center" v-if='jumpType != "agent"' label="原价(元)" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.originalAmount | moneyFilter}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column align="center" label="数量(件)" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.productNum}}</span>
                        </template>
                    </el-table-column>   
                    <el-table-column align="center" label="商品金额(元)" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.totalAmount | moneyFilter}}</span>
                        </template>
                    </el-table-column>   
                    <!-- <el-table-column align="center" label="商品图" width="120">
                        <template slot-scope="scope">
                            <img :src="baseUrl+scope.row.picture" width="100" height="80"/>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="商品规格" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.productModeDesc}}</span>
                        </template>
                    </el-table-column>  -->
                    <!-- <el-table-column align="center" label="分润">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isBenefit | judgmentFilter}}</span>
                        </template>
                    </el-table-column>  -->
                    <el-table-column align="center" label="分润金额(元)" v-if='jumpType != "agent"'>
                        <template slot-scope="scope">
                            <span>{{ scope.row.benefit | moneyFilter}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="包邮">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isFreePostage | judgmentFilter}}</span>
                        </template>
                    </el-table-column>  -->
                    <el-table-column align="center" label="邮费(元)">
                        <template slot-scope="scope">
                            <span>{{ scope.row.postage | moneyFilter}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column align="center" label="订单状态">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderStatus | orderStatusFilter}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="发货时间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.sendTime | timeFilter}}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="jumpType != 'agent' ? '商品信息' : '订单信息'">
                <el-table :key='tableKey' :data="productInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="订单号">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderDetailNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品名称">
                        <template slot-scope="scope">
                            <span>{{ scope.row.productName}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="商品图" width="120">
                        <template slot-scope="scope">
                            <img :src="pictureLink(scope.row.picture)" width="100" height="80"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品规格" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.productModeDesc}}</span>
                        </template>
                    </el-table-column>  
                    <!-- <el-table-column align="center" label="京东价格">
                        <template slot-scope="scope">
                            <span>{{ scope.row.jdPrice | moneyFilter}}</span>
                        </template>
                    </el-table-column>  -->
                    <el-table-column align="center"  :label="jumpType == 'agent' ? '销售价(元)' : '价格(元)'">
                        <template slot-scope="scope">
                            <span>{{ scope.row.productPrice | moneyFilter}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column align="center" label="数量(件)">
                        <template slot-scope="scope">
                            <span>{{ scope.row.number}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column align="center" :label="jumpType == 'agent' ? '合计(元)' : '商品金额(元)'">
                        <template slot-scope="scope">
                            <span>{{ scope.row.totalMoney | moneyFilter}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="收款信息" v-if="jumpType != 'agent'">
                <el-table :data="payLog" border fit
                  highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="订单号">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付账户">
                        <template slot-scope="scope">
                            <span>{{ scope.row.phone}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="支付方式" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.payChannel | payChannelFilter}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="邮费(元)" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.postage | moneyFilter}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="收款金额(元)" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.totalAmount | moneyFilter}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="收款时间" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.createTime | timeFilter}}</span>
                        </template>
                    </el-table-column>  
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="发货信息">
                <el-table :data="shipInfo" border fit
                  highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="订单号">
                        <template slot-scope="scope">
                            <span>{{ scope.row.orderNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机号码">
                        <template slot-scope="scope">
                            <span>{{ scope.row.phone}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="收货人">
                        <template slot-scope="scope">
                            <span>{{ scope.row.consignee}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="收货地址">
                        <template slot-scope="scope">
                            <span>{{ scope.row.address}}</span>
                        </template>
                    </el-table-column>  
                    <!-- <el-table-column align="center" label="创建时间" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.createTime | timeFilter}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="创建人编号" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.createUser}}</span>
                        </template>
                    </el-table-column>     -->
                    <el-table-column align="center" label="快递公司" v-if='orderType != "5"'>
                        <template slot-scope="scope">
                            <span>{{ scope.row.expressName}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column align="center" label="物流单号" v-if='orderType != "5"'>
                        <template slot-scope="scope">
                            <span>{{ scope.row.expressNo}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column align="center" label="发货时间" v-if='orderType != "5"'>
                        <template slot-scope="scope">
                            <span>{{ scope.row.sendTime | timeFilter}}</span>
                        </template>
                    </el-table-column> 
                    <el-table-column label="操作" align="center" width="185" v-if='orderType == "5"'>
                        <template slot-scope="scope">
                            <el-button size="small" type="primary" v-if="scope.row.riderId > 0 && orderStatus < 3"
                                @click="viewTracks(scope.row)">
                                查看轨迹
                            </el-button>
                            <el-button size="small" type="danger" v-if="!scope.row.riderId || scope.row.riderId == '-1'">
                                暂未接单
                            </el-button>
                            <el-button size="small" type="danger" v-if="orderStatus > 2">
                                已完成
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="185" v-else>
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.expressNo" size="small" type="primary"
                                @click="sendGoods(scope.row)">
                                发货
                            </el-button>
                            <el-button v-if="scope.row.expressNo" size="small" :disabled="true" type="success"
                                @click="sendGoods(scope.row)">
                                已发货
                            </el-button>
                            <el-button v-if="isExpressBtn" size="small" type="primary"
                                @click="viewLogistics(scope.row)">
                                物流信息
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item label="物流单号" :label-width="formLabelWidth">
                            <el-input v-model="form.expressNo" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="物流公司" :label-width="formLabelWidth">
                            <el-select v-model="expressObj" filterable value-key="value" @change="getCnameCode" placeholder="请选择物流公司">
                                <el-option
                                    v-for="item in shipperNameList"
                                    :key="item.value"   
                                    :label="item.value"
                                    :value="item">
                                    </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="物流公司编号" :label-width="formLabelWidth">
                            <el-select v-model="form02.shipperCode" placeholder="请选择物流公司">
                                <el-option
                                    v-for="item in shipperCodeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel02">取 消</el-button>
                        <el-button type="primary" @click="submit">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
        <dialogLogistics ref="dialogLogis" :isShow="isShowDialog" :expressId="expressId" @transferDialogState="DialogState"></dialogLogistics>
        
        <el-dialog
            title="骑手轨迹"
            :visible.sync="isRiderMap"
            width="50%"
            :before-close="closeRiderDialog"
            >
            <dialogRiderMap ref="dialogRider" :mapCenter='mapCenter'></dialogRiderMap>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchOrderInfoById, 
        fetchProductInfo, 
        fetchPayLog, 
        fetchShipInfo, 
        fetchShipper ,
        fetchExpressInfo, 
        addExpressInfo,
        logisticsInfo
    } from '@/api/order/index'
    
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import { mapGetters } from 'vuex' 
    import { formartTime, resolveUrlPath, getPictureLink } from "@/util/util"
    import dialogLogistics from "../../../components/dialogLogistics.vue"
    import dialogRiderMap from "../../../components/dialogRiderMap.vue"
    import AMap from 'vue-amap'
    Vue.use(AMap)
    // 初始化vue-amap
    AMap.initAMapApiLoader({
        // 申请的高德key
        key: 'a090dc8ce8841d6c8870e8515decf762',
        // 插件集合
        plugin: ['Riding']
    })
    export default {
        name: 'table_t_order',
        directives: {
            waves
        },
        data() {
            return {
                id: '',
                orderNo: '',
                listLoading: true,
                productInfo: [],
                payLog: [],
                shipInfo: [],
                orderInfo: [],
                orderType: '',              //订单类型
                tableKey: 0,
                form: {
                    expressNo: '',
                    expressName: '',
                    shipperCode: '',
                    orderNo: '',
                    id: ''
                },
                shipperNameList: [],
                expressObj: {},
                dialogFormVisible: false,
                formLabelWidth: '120px',
                orderStatus: '',
                baseUrl: "http://qiniu.edawtech.com/",
                isShowDialog: false,
                expressId: '',
                isExpressBtn: false,
                jumpType: '',
                isRiderMap: false,              //骑手轨迹模态
                mapCenter: [],
            } 
        },
        created() {
            this.jumpType = this.$route.query.jumpType //获取是从订单管理进来的还是商家订单管理进来的
        },
        filters: {
            moneyFilter(money){
                if(money){
                    return money/10000
                }
            },
            payFilter([val01,val02]){
                console.log(val01,val02,val01+val02);
                if(val01){
                    return (Number(val01)+Number(val02)) / 10000
                }
            },
            timeFilter(time){
                if(time){
                    return formartTime(new Date(time), 5);
                }
            },
            payChannelFilter(payChannel){
                const statusMap = {
                    redpay: '红包支付',
                    wxpay: '微信支付',
                    alipay: '支付宝支付'
                }
                return statusMap[payChannel]
            },
             orderStatusFilter(status) {
                const statusMap = {
                    '-1': '已取消',
                    '0': '未付款',
                    '1': '已付款',
                    '2': '已发货',
                    '3': '已签收',
                    '4': '已评价，订单完成',
                    '5': '已退款',
                    '6': '出库中'
                }
                return statusMap[status]
            },
            judgmentFilter(state){
                return state == 'y' ? '是' : '否';
            }
        },
        methods: {
            getOrderInfoById(){
                fetchOrderInfoById(this.id).then( res => {
                    console.log(res,'订单信息');
                    this.orderInfo = [];
                    this.orderType = res.data.orderType;
                    this.orderStatus = res.data.orderStatus;
                    this.orderInfo.push(res.data)
                } );
            },
            getProductInfo(){
                this.listLoading = true;
                fetchProductInfo(this.orderNo).then( res => {
                    this.listLoading = false;
                    console.log(res, '订单商品信息');
                    this.productInfo = []
                    this.productInfo = res.data;
                } );
            },
            pictureLink(url){
                return getPictureLink(url);
            },
            getPayLog(){
                fetchPayLog(this.orderNo).then(res => {
                    console.log(res, '订单收款信息');
                    this.payLog = []
                    this.payLog.push(res.data)
                });
            },
            getShipInfo(){
                fetchShipInfo(this.orderNo).then(res => {
                    this.shipInfo = [];
                    console.log(res, '发货信息');
                    this.expressId = res.data.id;
                    this.mapCenter = [res.data.longitude, res.data.latitude];
                    this.shipInfo.push(res.data);
                    this.initLogistics(this.expressId);
                });
            },
            sendGoods(row){
                this.dialogFormVisible = true;
                this.form.orderNo = row.orderNo;
                console.log(row.orderNo);
            },
            getShipper(){
                fetchShipper().then(res => {
                    console.log(res, 'shipper');
                    res.data.forEach((item, index) => {
                        this.shipperNameList.push({
                            lable: item.shipperCode,
                            value: item.shipperName,
                        });
                        //this.$set(this.checkedSpecifition, [])
                        // this.shipperCodeList.push({
                        //     label: item.shipperName,
                        //     value: item.shipperCode 
                        // });
                    });
                })
            },
            getCnameCode(e){
                console.log(e);
                this.form.expressName = e.value;
                this.form.shipperCode = e.lable;
            },
            submit(){
                fetchExpressInfo(this.form.orderNo).then(res => {
                    this.form.id = res.data.expressInfo.id;
                    this.form.appId = res.data.expressInfo.appId;
                    console.log(this.form,'订单发货接口参数');
                    addExpressInfo(this.form,this.form.orderNo).then(res02 => {
                        this.handleTip(res02.statusText, res02.data.msg);
                        this.dialogFormVisible = false;
                        this.form = {};
                        this.getShipInfo();
                    });
                });
            },
            viewLogistics(row){
                this.isShowDialog = true;
                this.$refs.dialogLogis.getExpressInfo(row.id);
            },
            // 查看骑手轨迹
            viewTracks(row){
                this.riderId = row.riderId;
                this.isRiderMap = true;
                this.$nextTick(()=>{
                    this.$refs.dialogRider.getRiderAddress(row);
                })
            },
            // 关闭骑手轨迹模态
            closeRiderDialog(){
                this.isRiderMap = false;
            },
            initLogistics(expressId){
                logisticsInfo(expressId).then( res => {
                    // if(res.data.msg){
                    //     // console.log(JSON.parse(res.data.msg), '物流信息');
                        // console.log(res.data)
                    //     if(JSON.parse(res.data.msg).Traces.length != 0){
                    //         this.isExpressBtn = true;
                    //     }else {
                    //         this.isExpressBtn = false;
                    //     }
                    // }else {
                    //         this.isExpressBtn = false;                        
                    // }
                    if(res.data.data){
                        this.isExpressBtn = true;
                    }else{
                        this.isExpressBtn = false;
                    }
                });
            },
            DialogState(msg){
                this.isShowDialog = msg;
            },
            cancel02(){
                this.dialogFormVisible = false;
                //this.form02 = [];
            },
            handleTip(statusText,msg){
                this.$notify({
                    title: statusText,
                    message: msg,
                    type: "success",
                    duration: 2000
                });
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                console.log(to.query.id);
                vm.id = to.query.id;
                vm.orderNo = to.query.orderNo;
                vm.orderStatus = to.query.orderStatus;
                vm.getOrderInfoById();
                vm.getProductInfo();
                vm.getPayLog();
                vm.getShipInfo();
                vm.getShipper();
            });
        },
        components: {
            dialogLogistics,
            dialogRiderMap
        }
    }
</script>
