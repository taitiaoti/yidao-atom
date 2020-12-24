<template>
    <div>
        <!-- 用户抢购订单 -->
        <!-- 筛选 -->
        <div class="filter-container">
            <el-input
                v-model="searchObj.orderNum"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入订单号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.productName"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入商品名称"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.productNo"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入商品编号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.storeName"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入所属店铺名称"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.phone"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入参与用户手机号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.nper"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入开奖期数"
                clearable
            >
            </el-input>
            <!-- <el-select v-model="searchObj.orderState"
                placeholder="请选择开奖状态"
                style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                    v-for="(item, index) in drawingStatusData"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select> -->
            <el-select v-model="searchObj.orderState"
                placeholder="请选择订单状态"
                clearable
                style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                    v-for="(item, index) in orderStatusData"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <div class="s-time">
                <el-date-picker 
                    v-model="time" 
                    type="datetimerange" 
                    range-separator="至" 
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期"
                    @change="selectTime">
                </el-date-picker>
            </div>
            <el-button type="primary" icon="el-icon-search" @click="search"
                >搜索</el-button
            >
            <el-button type="primary" @click="orderExport" :loading="exportLoading" icon="el-icon-download">导出</el-button>
        </div>
        <!-- 表格数据 -->
        <el-table
            :data="list"
            border
            v-loading="listLoading"
            fit
            highlight-current-row
            :span-method="objectSpanMethod"
            element-loading-text="给我一点时间"
            style="width:100%;margin-bottom:20px;">
            <el-table-column 
                align="center" 
                label="订单号">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.productNo }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="所属店铺">
                <template slot-scope="scope">
                    <span>{{ scope.row.storeName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品主图"
                width='120'>
                <template slot-scope="scope">
                    <img :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="100" width="100"/>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="规格">
                <template slot-scope="scope">
                    <span>{{ scope.row.specification }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="数量（件）">
                <template slot-scope="scope">
                    <span>{{ scope.row.number }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="成本价">
                <template slot-scope="scope">
                    <span>{{ scope.row.costPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="金额（元）">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="运费">
                <template slot-scope="scope">
                    <span>{{ scope.row.logisticsPostage ? scope.row.logisticsPostage : scope.row.postage }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="需拼满团人数">
                <template slot-scope="scope">
                    <span>{{ scope.row.groupNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="可中奖人数">
                <template slot-scope="scope">
                    <span>{{ scope.row.winningNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="参与奖奖金">
                <template slot-scope="scope">
                    <span>{{ scope.row.bonus }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="期数">
                <template slot-scope="scope">
                    <span>{{ scope.row.nper }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="参与用户手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column 
                align="center" 
                label="开奖状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column> -->
            <el-table-column 
                align="center" 
                label="订单状态">
                <template slot-scope="scope">
                    <el-tag :type=" scope.row.orderState == 3 ? 'danger' : 'info' ">{{ scope.row.orderState | filterOrderStatus }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="支付时间"
                width='100'>
                <template slot-scope="scope">
                    <span>{{ scope.row.payTime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="退款时间"
                width='100'>
                <template slot-scope="scope">
                    <span>{{ scope.row.refundTime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="发货时间"
                width='100'>
                <template slot-scope="scope">
                    <span>{{ scope.row.shipmentsTime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作"
                width='200'>
                <template slot-scope="scope">
                    <el-button size='mini' @click="sendGood(scope.row.id, scope.row.orderState)" v-if="scope.row.orderState == 5">查看</el-button>
                    <el-button size='mini' v-if="scope.row.orderState == 5">已退款</el-button>
                    <el-button size='mini' type='primary' v-else @click="sendGood(scope.row.id, scope.row.orderState)">{{ scope.row.orderState == 4 ? '编辑' : '发货' }}</el-button>
                    <el-button size='mini' type='primary' v-if="scope.row.orderState == 4" @click="seeExpressInfo(scope.row.id)">查看物流</el-button>
                    <el-button size='mini' type='danger' v-if="scope.row.orderState !== 5" @click="handDelete(scope.row.transactionId, scope.row.price)">退货</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页插件 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
        <!-- 添加修改对话框 -->
        <el-dialog
            title="发货"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-form label-width="100px" :model="deliveryInfo" ref="form" >
                <el-form-item label="订单号" :label-width="formLabelWidth">
                    <el-input v-model="deliveryInfo.orderNo" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收件人" :label-width="formLabelWidth">
                    <el-input v-model="deliveryInfo.consignee" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收件号码" :label-width="formLabelWidth">
                    <el-input v-model="deliveryInfo.phone" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" :label-width="formLabelWidth">
                    <el-input v-model="deliveryInfo.address" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="物流公司" :label-width="formLabelWidth" class="shipper-wrapper">
                    <el-select v-model="expressObj" value-key="value" filterable placeholder="请选择物流公司" :disabled='orderStatus == 5'>
                        <el-option
                            v-for="item in shipperNameList"
                            :key="item.value"   
                            :label="item.value"
                            :value="item">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input v-model="deliveryInfo.expressNo" auto-complete="off" :disabled='orderStatus == 5'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="orderStatus !== 5">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="affirmSend">发 货</el-button>
            </span>
        </el-dialog>
        <!-- 物流信息 -->
        <el-dialog title="物流信息" :visible.sync="expressInfoDialogVisible" :before-close="closeDialog">
            <div style="height: 500px;position:relative;overflow:auto;">
                <div class="order-process" stlye="position:absolute;top: 0;left:0;">
                    <el-steps direction="vertical" :active="1" :finish-status="finishStatus">
                        <el-step v-for="(item,index) in expressInfo" :key="index" :title="item.AcceptStation" 
                            :description="item.AcceptTime" ></el-step>
                    </el-steps>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="closeDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { selectUserOrder, selectUserDelivery, handSendGood, rushOrderInfo, returnGoods, fetchOrderExport } from '@/api/rushOrder/index';
import { fetchShipper } from '@/api/order/index'
import { formartTime } from "@/util/util";
export default {
    data(){
        return {
            listQuery: {
                page: 1,
                limit: 10
            },
            formLabelWidth: '120px',
            isShipper: true,
            searchObj: {
                orderNum: '',
                productName: '',
                nper: '',
                phone: '',
                orderState: '',
                startTime: '',
                endTime: '',
                storeName: '',               //所属店铺
                productNo: ''
            },
            list: [],
            listLoading: false,
            total: 0,
            activityTypeInfo: {             //活动信息
                appId: '',
                activityType: '',
                activityName: '',
                placeholder: ''
            },         
            baseUrl:"http://qiniu.edawtech.com/", 
            dialogVisible: false, 
            drawingStatusData: [            //开奖状态
                { label: '抢购中', value: '1' },
                { label: '已开奖', value: '2' },
                { label: '未开奖', value: '2' },
                { label: '拼团失败', value: '3' }
            ],
            orderStatusData: [                  //订单状态
                { label: '待支付', value: '0' },
                { label: '已支付', value: '1' },
                { label: '未中奖', value: '2' },
                { label: '已中奖', value: '3' },
                { label: '已发货', value: '4' },
                { label: '已退款', value: '5' },
                { label: '拼团失败', value: '6' }
            ],
            time: [],
            deliveryInfo: {
                orderNo: '',            //订单号
                consignee: '',               //收货人
                phone: '',               //联系电话
                address: '',               //收货地址
                id: '',
                expressNo: ''
            },               //收货信息
            shipperNameList: [],            //快递列表
            expressObj: '',                 //快递公司
            expressInfoDialogVisible: false,
            finishStatus: 'success',
            expressInfo: [],
            rowAndColumn: [],
            rowRoomColumn: [],
            orderStatus: null,
            exportLoading: false
        }
    },
    computed:{},
    created(){
        this.getList()
    },
    methods: {
        // 获取列表数据
        getList(){
            this.listLoading = true;
            let postData = {
                ...this.searchObj,
                ...this.listQuery
            }
            selectUserOrder(postData).then((res)=>{
                this.list = res.data.data.records;
                this.total = res.data.data.total;
                this.listLoading = false;
                console.log(res,'订单列表')
                this.getListDataForRowAndColumn(res.data.data.records)
            })
        },
        // 导出
        orderExport(){
            this.$notify({
                title: '导出中',
                message: '导出中，请稍等。。。',
                type: 'success',
                duration: 2000
            });
            this.exportLoading = true;                
            fetchOrderExport(this.searchObj).then(res => {
                this.exportLoading = false;                    
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                }
            });
        },
        getListDataForRowAndColumn(data){
            let self = this;
            self.rowAndColumn = [];
            self.rowRoomColumn = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    // 如果是第一条记录（即索引是0的时候），向数组中加入１
                        self.rowAndColumn.push(1);
                        self.pos = 0;
                        self.rowRoomColumn.push(1);
                        self.posT = 0;
                } else {
                    if (data[i].nper === data[i - 1].nper && data[i].productNo === data[i - 1].productNo) {
                        // 如果id相等就累加，并且push 0
                        self.rowAndColumn[self.pos] += 1
                        self.rowAndColumn.push(0)
                    } else {
                        // 不相等push 1
                        self.rowAndColumn.push(1)
                        self.pos = i;
                        self.rowRoomColumn.push(1)
                        self.posT = i
                    }
                }
            }
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            let self = this
            if ( columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13) {
                if (self.rowAndColumn[rowIndex]) {
                    let rowNum = self.rowAndColumn[rowIndex];
                    return {
                        rowspan: rowNum,
                        colspan: rowNum > 0 ? 1 : 0
                    }                                                   
                }
                return {
                    rowspan: 0,
                    colspan: 0
                }
            }
        },
        // 搜索
        search(){
            this.getList();
        },
        // 时间段查询
        selectTime(res){
            if(res){
                this.time = [];
                this.searchObj.startTime = formartTime(res[0], 5);
                this.searchObj.endTime = formartTime(res[1], 5);
                this.time.push(formartTime(res[0], 5));
                this.time.push(formartTime(res[1], 5));
            }else {
                this.searchObj.startTime = null;
                this.searchObj.endTime = null;
            }
        },
        // 发货
        sendGood(id, status){
            selectUserDelivery(id).then((res)=>{
                console.log(res,'lll')
                if(res.data.code == 0){
                    let info = res.data.data;
                    this.deliveryInfo.orderNo = info.order;
                    this.deliveryInfo.consignee = info.name;
                    this.deliveryInfo.phone = info.phone;
                    this.deliveryInfo.id = id;
                    this.deliveryInfo.address = info.address;
                    this.deliveryInfo.expressNo = info.courier_number;
                    this.expressObj = {
                        lable: info.courier,
                        value: info.express_name
                    }
                    this.orderStatus = status;
                    console.log(res)
                    if(this.shipperNameList.length == 0){
                        this.getShipper();
                    }
                    this.dialogVisible = true;
                }
            })
        },
        // 物流信息
        getShipper(){
            fetchShipper().then(res => {
                res.data.forEach((item, index) => {
                    this.shipperNameList.push({
                        lable: item.shipperCode,
                        value: item.shipperName,
                    });
                });
            })
        },
        // 退货
        handDelete(id,money){
            this.$alert('确定要退货吗？', '退货', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action == 'confirm'){   
                        returnGoods(id, money).then((res)=>{
                            if(res.data.data.resultCode == 'SUCCESS'){
                                this.getList()
                            }
                            this.$notify({
                                title: res.data.data.resultCode == 'SUCCESS' ? "成功" : '失败',
                                message: res.data.msg,
                                type: res.data.data.resultCode == 'SUCCESS' ? "success" : 'error',
                                duration: 1500
                            });
                        })
                    }
                }
            });
        },
        // 确定发货
        affirmSend(id){
            let postData = {
                id: this.deliveryInfo.id,
                expressNo: this.deliveryInfo.expressNo,
                expressName: this.expressObj.value,
                shipperCode: this.expressObj.lable
            }
            console.log(postData)
            if(this.deliveryInfo.expressNo &&  this.expressObj.lable){
                handSendGood(postData).then(res => {
                    console.log(res,'发货')
                    this.$notify({
                        title: res.data.code == 0 ? '成功' : '失败',    
                        message: res.data.msg,
                        type: res.data.code == 0 ? 'success' : 'error',
                        duration: 2000
                    });
                    if(res.data.code == 0){
                        this.getList();
                        this.handleClose();
                    }
                });
            }else {
                this.$notify({
                    title: '请完善发货信息',
                    message: '参数有误',
                    type: "error",
                    duration: 2000
                });
            }
        },
        // 弹窗提示
        notify(res){
            if(res.data.code == 0){
                this.handleClose();
                this.getList();
            }
            this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
            });
        },
        //页码改变事件
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        // 关闭对话框
        handleClose(){
            this.deliveryInfo= {
                orderNo: '',            //订单号
                consignee: '',               //收货人
                phone: '',               //联系电话
                address: '',               //收货地址
                expressNo: ''
            };               //收货信息
            this.expressObj = '';                 //快递公司
            this.expressNo = '',                  //物流单号
            this.dialogVisible = false;
        },
        // 关闭物流信息
        closeDialog(){
            this.expressInfoDialogVisible = false;
        },
        // 查看物流
        seeExpressInfo(id){
            rushOrderInfo(id).then((res)=>{
                console.log(res,'订单详情')
                let info = res.data.data;
                if(info.traces){
                    this.expressInfo = JSON.parse(info.traces);
                    this.expressInfoDialogVisible = true
                }else{
                    this.$notify({
                        title: '暂无物流信息',
                        message: '请稍后',
                        type: "info",
                        duration: 2000
                    });
                }
            })
        }
    },
    filters: {
        fitlerTime(value){
            if(value){
                return formartTime(new Date(value), 5);
            }else{
                return ''
            }
        },
        filterOrderStatus(val){
            if(val){
                let data = {
                    0: '待支付',
                    1: '已支付',
                    2: '未中奖',
                    3: '已中奖',
                    4: '已发货',
                    5: '已退款',
                    6: '拼团失败',
                    7: '已签收'
                }
                return data[val]
            }
        }
    }
};
</script>

<style>
</style>