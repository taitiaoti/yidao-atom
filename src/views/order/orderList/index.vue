<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="searchObj.orderNo" @change="onOrderNo" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入订单编号" clearable></el-input>
            <el-input v-model="searchObj.uid" @change="onUid" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入手机号码" clearable></el-input>
            <el-input v-model="searchObj.storeName" @change="onStoreName" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请请输入商铺名称" clearable></el-input>
            <div class="s-category" style="width:180px;display:inline-block;margin-bottom:10px;">
                <el-select v-model="searchObj.orderStatus" @change="onOrderStatus" placeholder="请选择类型">
                <el-option
                    v-for="item in orderStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>
            </div>
            <!-- 订单类型 -->
             <div class="s-category" style="width:180px;display:inline-block;margin-bottom:10px;">
                <el-select v-model="searchObj.orderType" @change="onOrderType" placeholder="请选择订单类型">
                <el-option
                    v-for="item in orderTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>
            </div>
            <!-- 订单时间 -->
            <div style="width:390px;display:inline-block;margin-bottom:10px; margin-right: 5px;">
                <el-date-picker 
                v-model="time" 
                type="datetimerange" 
                range-separator="至" 
                start-placeholder="开始日期" 
                end-placeholder="结束日期"
                @change="selectTime">
                </el-date-picker>
            </div> 
            
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择APP" style="display: inline-block; width: auto; margin-left: 5px;">
                <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" @click="orderExport" :loading="exportLoading" icon="el-icon-download">导出</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="订单编号">
                <template scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单类型">
                <template scope="scope">
                    <span>{{ scope.row.orderType | filtersOrderType }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="120">
                <template scope="scope">
                    <span>{{ scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商铺名称" width="120">
                <template scope="scope">
                    <span>{{ scope.row.storeName | filterStoreName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品图" width="140">
                <template scope="scope">
                    <img  :src="pictureLink(scope.row.picture)" height="100" width="120" >
                    <!-- <img :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" width="100" height="80"/> -->
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品规格" width="100">
                <template scope="scope">
                    <span>{{ scope.row.productModeDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总数量(件)" width="100">
                <template scope="scope">
                    <span>{{ scope.row.productNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总金额(元)" width="110">
                <template scope="scope">
                    <span>{{ scope.row.totalAmount | moneyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付渠道" width="100">
                <template scope="scope">
                    <span>{{ scope.row.payChannel | payChannelFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交易流水号" width="100">
                <template scope="scope">
                    <span>{{ scope.row.outTradeNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付时间" width="100">
                <template scope="scope">
                    <span>{{ scope.row.payTime | sendTimeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单状态" width="100">
                <template scope="scope">
                    <span>{{ scope.row.orderStatus | orderStatusFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="京东订单号" width="100">
                <template scope="scope">
                    <span>{{ scope.row.jdChildrenOrderId ? scope.row.jdChildrenOrderId : '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="运送方式" width="80">
                <template scope="scope">
                    <span>{{ scope.row.deliveryType | filterDeliveryType}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="包邮">
                <template scope="scope">
                    <span>{{ scope.row.isFreePostage | judgmentFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="邮费">
                <template scope="scope">
                    <span>{{ scope.row.postage | moneyFilter}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="发货时间" width="100">
                <template scope="scope">
                    <span>{{ scope.row.sendTime | sendTimeFilter}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="分润">
                <template scope="scope">
                    <span>{{ scope.row.isBenefit | judgmentFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分润金额">
                <template scope="scope">
                    <span>{{ scope.row.benefit | moneyFilter}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" v-if="order_manage_look || order_manage_returnGoods" label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" v-if="order_manage_look" type="primary"
                               @click="jumpEditor(scope.row)">
                               查看
                    </el-button>
                    <el-button v-if="order_manage_returnGoods" size="small" type="danger"
                               @click="returnGoods(scope.row)">
                               退货
                    </el-button>
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
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible02">
            <el-form :model="form02">
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                <el-input v-model="form02.expressNo" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="物流公司" :label-width="formLabelWidth">
                    <el-select v-model="expressObj" value-key="value" @change="getCnameCode" placeholder="请选择物流公司">
                        <el-option
                            v-for="item in shipperNameList"
                            :key="item.value"   
                            :label="item.value"
                            :value="item">
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  size="mini" @click="cancel02">取 消</el-button>
                <el-button  size="mini" type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchList,fetchShipper,fetchExpressInfo,addExpressInfo, fetchOrderExport,fetchReturnGoods } from '@/api/order/index'
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import { mapGetters, mapMutations } from 'vuex' 
    import { formartTime,resolveUrlPath, getPictureLink } from "@/util/util"
    import { deliveryType } from "@/util/data"


    export default {
        name: 'table_t_order',
        directives: {
            waves
        },
        data() {
            return {
                appId: '',
                currentAppList: [],
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10
                },
                rules: {
                },
                form: {
                },
                form02: {
                    expressNo: '',
                    expressName: '',
                    shipperCode: '',
                    orderNo: '',
                    id: ''
                },
                expressObj: {},
                dialogFormVisible: false,
                dialogFormVisible02: false,
                dialogStatus: '',
                // t_order_add: false,
                // t_order_upd: false,
                // t_order_del: false,
                t_order_add: true,
                t_order_upd: true,
                t_order_del: true,
                textMap: {
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0,
                formLabelWidth: '120px',
                shipperNameList: [],
                shipperCodeList: [],
                baseUrl: "http://qiniu.edawtech.com/",
                time: [],
                searchObj: {
                    orderNo: '',
                    uid: '',
                    orderStatus: '',
                    //订单类型
                    orderType:''
                },
                orderStatusOptions: [
                    {
                        value: 0,
                        label: '未付款'
                    },
                    {
                        value: 1,
                        label: '已付款，未发货'
                    },
                    {
                        value: 2,
                        label: '已发货，未签收'
                    },
                    {
                        value: 3,
                        label: '已签收，未评价'
                    },
                    {
                        value: 4,
                        label: '已完成'
                    },
                    {
                        value: 5,
                        label: '退货'
                    },
                    {
                        value: 6,
                        label: '出库中'
                    },
                    {
                        value: '',
                        label: '全部'
                    },
                ],
                //搜索订单类型的数据
                orderTypeOptions:[
                     {
                        value: 1,
                        label: '普通订单'
                    },
                     {
                        value: 2,
                        label: '新会员订单'
                    },
                     {
                        value: 3,
                        label: '京东订单'
                    },
                    {
                        value: 4,
                        label: '秒杀订单'
                    },
                    {
                        value: 5,
                        label: '当日达订单'
                    },
                     {
                        value: '',
                        label: '全部订单'
                    },
                ],
                order_manage_look: false,
                order_manage_returnGoods: false,
                exportLoading: false,
            }
        },
        computed: {
            ...mapGetters(['orderSearch','permissions']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        filters: {
            // 过滤店铺名
            filterStoreName(value){
                if(value == null){
                    return '无'
                }else{
                    return value
                }
            },
            statusFilter(status) {
                const statusMap = {
                    0: '有效',
                    1: '无效'
                }
                return statusMap[status]
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
            sendTimeFilter(time){
                if(time){
                    return formartTime(new Date(time), 5);
                }
            },
            moneyFilter(money){
                return (money/10000).toFixed(2)
            },
            payChannelFilter(payChannel){
                const statusMap = {
                    redpay: '红包支付',
                    wxpay: '微信支付',
                    alipay: '支付宝支付',
                    balance: '在线余额',
                    wxsmallpay: '微信小程序支付'
                }
                return statusMap[payChannel]
            },
            judgmentFilter(state){
                return state == 'y' ? '是' : '否';
            },
            filtersOrderType(type) {
                const statusMap = {
                    1: '普通订单',
                    2: '新会员订单',
                    3: '京东订单',
                    4: '秒杀订单',
                    5: '当日达订单'
                }
                return statusMap[type];
            },
            filterDeliveryType(val) {
                return deliveryType[val];
            }
        },
        created() {
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            console.log(this.currentAppList,123456)
            this.getList()
            this.getShipper();
            // this.t_order_add = this.permissions['t_order_add']
            // this.t_order_upd = this.permissions['t_order_upd']
            // this.t_order_del = this.permissions['t_order_del']
            this.listQuery.limit = this.orderSearch["limit"];
            this.listQuery.page = this.orderSearch["page"];
            this.time.push(this.orderSearch["startTime"]);
            this.time.push(this.orderSearch["endTime"]);
            this.searchObj = this.orderSearch;
            this.search();
            this.order_manage_look = this.permissions['order_manage_look']
            this.order_manage_returnGoods = this.permissions['order_manage_returnGoods']
        },
        methods: {
            ...mapMutations({
                setOrderNo: 'SET_ORDERNO',
                setUid: 'SET_UID',
                setStoreName: 'SET_STORENAME',
                setOrderSatus: 'SET_ORDERSTATUS',
                setTime: 'SET_TIME',
                setLimit: 'SET_ORDERLIMIT',
                setPage: 'SET_ORDERPAGE',
                //订单类型
                setOrderType:'SET_ORDERTYPE'
            }),
            getList() {
                this.listLoading = true;
                let postData = {
                    ...this.listQuery,
                    appId: this.appId
                }
                fetchList(postData).then(response => {
                    console.log(response, '订单列表');
                    this.list = response.data.records
                    this.total = response.data.total
                    this.listLoading = false 
                })
            },
            pictureLink(url){
                return getPictureLink(url);
            },
            getDataByAppId(){
                this.getList();
            },
            //搜索
            search(){
                console.log('sss')
                console.log('status',this.searchObj.orderStatus)
                let postData = {
                        page: this.listQuery.page,
                        limit: this.listQuery.limit,
                        orderNo: this.searchObj.orderNo === '' ? null : this.searchObj.orderNo,
                        phone: this.searchObj.uid === '' ? null : this.searchObj.uid,
                        storeName: this.searchObj.storeName === ''? null : this.searchObj.storeName,
                        orderStatus: this.searchObj.orderStatus === '' ? null : this.searchObj.orderStatus,
                        startTime: this.searchObj.startTime === '' ? null : this.searchObj.startTime,
                        endTime: this.searchObj.endTime === '' ? null : this.searchObj.endTime,
                        appId: this.appId,
                        //订单类型
                        orderType:this.searchObj.orderType === ''? null : this.searchObj.orderType
                };
                console.log(postData)
                fetchList(postData).then(response => {
                    console.log(response, '搜索');
                    this.list = response.data.records
                    this.total = response.data.total
                    this.listLoading = false 
                });
            },
            orderExport(){
                let postData = {
                  orderStatus:  this.searchObj.orderStatus,
                  orderNo: this.searchObj.orderNo,
                  phone: this.searchObj.uid,
                  appId: this.appId,
                  startTime: this.searchObj.startTime,
                  endTime: this.searchObj.endTime,
                  //订单类型
                  orderType:this.searchObj.orderType
                };
                this.$notify({
                    title: '导出中',
                    message: '导出中，请稍等。。。',
                    type: 'success',
                    duration: 2000
                });
                this.exportLoading = true;                
                fetchOrderExport(postData).then(res => {
                    this.exportLoading = false;                    
                    if(res.status == 200){
                        window.location.href = res.request.responseURL;
                        this.orderStatus = '';
                    }
                });
                // if(!!this.searchObj.orderStatus || !!this.searchObj.orderNo || !!this.searchObj.uid || !!this.searchObj.startTime || !!this.searchObj.endTime){
                // }else {
                //     this.$notify.error({
                //         title: '错误',
                //         message: '请选择或输入导出数据的条件'
                //     });
                // }
            },
            selectTime(res){
                if(res){
                    this.time = [];
                    this.setTime({startTime: formartTime(res[0], 5), endTime: formartTime(res[1], 5)});
                    this.searchObj.startTime = formartTime(res[0], 5);
                    this.searchObj.endTime = formartTime(res[1], 5);
                    this.time.push(formartTime(res[0], 5));
                    this.time.push(formartTime(res[1], 5));
                }else {
                    this.searchObj.startTime = null;
                    this.searchObj.endTime = null;
                }
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
                this.form02.expressName = e.value;
                this.form02.shipperCode = e.lable;
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                 this.setLimit(val);
                this.search();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.setPage(val);
                this.search();
            },
            sendGoods(row){
                this.dialogFormVisible02 = true;
                this.form02.orderNo = row.orderNo;
            },
            submit(){
                fetchExpressInfo(this.form02.orderNo).then(res => {
                    this.form02.id = res.data.expressInfo.id;
                    console.log(this.form02,'订单发货接口参数');
                    addExpressInfo(this.form02,this.form02.orderNo).then(res02 => {
                        this.handleTip(res02.statusText, res02.data.msg);
                        this.dialogFormVisible02 = false;
                        this.form02 = {};
                        this.getList();
                    });
                });
            },
            cancel02(){
                this.dialogFormVisible02 = false;
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
            handleUpdate(row){

            },
            handleCreate() {
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
            },
            jumpEditor(row){
                this.$router.push({
                    path: resolveUrlPath("/order/orderEdit"),
                    query: {
                        id: row.id, 
                        orderNo: row.orderNo,
                        orderStatus: row.orderStatus,
                        jumpType: 'self'
                    }
                });
            },
            cancel(formName) {
                this.dialogFormVisible = false
                const set = this.$refs
                set[formName].resetFields()
            },
            onOrderNo(e){
                this.setOrderNo(e);
            },
            onUid(e){
                this.setUid(e);
            },
            onStoreName(e){
                this.setStoreName(e)
            },
            onOrderStatus(e){
                this.setOrderSatus(e)
            },
            //订单类型
            onOrderType(e){
                this.setOrderType(e)
            },
            // 退货按钮
            returnGoods(row){
                this.$alert('你确定要执行退货操作？', '退货', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if(action == 'confirm'){
                            if(row.orderNo){
                                fetchReturnGoods(row.orderNo).then(res => {
                                    this.$notify({
                                        title: res.statusText,
                                        message: res.data.msg,
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.search();
                                });
                            }else {
                                this.$notify({
                                    title: "失败",
                                    message: "orderNo(订单编号)为空",
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        }
                    }
                
                });
            }
        }
    }
</script>
