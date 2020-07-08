<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="orderDetailNo" style="width: 250px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入订单编号" clearable></el-input>
            <el-input v-model="storeName" style="width: 250px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商铺名称" clearable></el-input>
            <el-input v-model="phone" style="width: 250px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入手机号码" clearable></el-input>
            <el-input v-model="consignee" style="width: 250px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入收货人" clearable></el-input>
            <div style="width:250px;display:inline-block;margin-bottom:10px;">
                <el-select v-model="orderStatus" placeholder="请选择类型">
                    <el-option
                        v-for="item in orderStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto; margin-left: 5px;">
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
        </div>
        <el-table :data="expressInfoList" v-loading="listLoading" border fit
            highlight-current-row style="width: 100%">
            <el-table-column align="center" label="订单号">
                <template scope="scope">
                    <span>{{ scope.row.orderNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="120">
                <template scope="scope">
                    <span>{{ scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商铺名称" width="120">
                <template scope="scope">
                    <span>{{ scope.row.storeName | filterStoreName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品图" width="120">
                <template scope="scope">
                    <img :src="pictureLink(scope.row.picture)" width="100" height="80"/>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品规格" width="100">
                <template scope="scope">
                    <span>{{ scope.row.productModeDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总数量" width="80">
                <template scope="scope">
                    <span>{{ scope.row.productNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" width="110">
                <template scope="scope">
                    <span>{{ scope.row.phone}}</span>
                </template>
            </el-table-column>  
            <el-table-column align="center" label="收货人">
                <template scope="scope">
                    <span>{{ scope.row.consignee}}</span>
                </template>
            </el-table-column>  
            <el-table-column align="center" label="收货地址" width="150">
                <template scope="scope">
                    <span>{{ scope.row.address}}</span>
                </template>
            </el-table-column>  
            <el-table-column align="center" label="运送方式">
                <template scope="scope">
                    <span>{{ scope.row.deliveryType | filterDeliveryType}}</span>
                </template>
            </el-table-column>  
            <!-- <el-table-column align="center" label="邮编">
                <template scope="scope">
                    <span>{{ scope.row.zipCode}}</span>
                </template>
            </el-table-column>  -->
            <el-table-column align="center" label="创建时间" >
                <template scope="scope">
                    <span>{{ scope.row.createTime | timeFilter}}</span>
                </template>
            </el-table-column>  
            <el-table-column align="center" label="快递公司" >
                <template scope="scope">
                    <span>{{ scope.row.expressName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="物流单号" width="110">
                <template scope="scope">
                    <span>{{ scope.row.expressNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单状态">
                <template scope="scope">
                    <span>{{ scope.row.orderDetailStatus | orderStatusFilter}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="操作" align="center"  width="320px">
                <template scope="scope">
                    <el-button v-if="order_ship" size="mini" type="primary"
                            @click="sendGoods(scope.row)">
                            发货
                    </el-button>
                    <el-button v-if="order_editor" size="mini" type="primary"
                            @click="update(scope.row)">
                            编辑
                    </el-button>
                    <el-button v-if="order_del" size="mini" type="danger"
                            @click="deleteLogistics(scope.row)">
                            删除
                    </el-button>
                    <el-button size="mini" v-if="order_look_logistics && scope.row.expressNo" type="success"
                            @click="viewLogistics(scope.row)">
                            查看物流
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
        <el-dialog :title="isShipper ? '发货' : '编辑发货信息'" :visible.sync="dialogFormVisible" @close="closeDialog">
            <el-form :model="form">
                <el-form-item label="订单号" :label-width="formLabelWidth">
                    <el-input v-model="form.orderNo" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收件人" :label-width="formLabelWidth">
                    <el-input v-model="form.consignee" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收件号码" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" :disabled="isShipper" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="物流公司" :label-width="formLabelWidth" class="shipper-wrapper">
                    <el-select v-model="expressObj" value-key="value" filterable @change="getCnameCode" placeholder="请选择物流公司">
                        <el-option
                            v-for="item in shipperNameList"
                            :key="item.value"   
                            :label="item.value"
                            :value="item">
                            </el-option>
                    </el-select>
                    <!-- <div class="close-shipper">
                        <i class="el-icon-circle-close" @click="clearExporessCompany"></i>
                    </div> -->
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth">
                    <el-input v-model="form.expressNo" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">{{isShipper ? '发货' : '确定'}}</el-button>
            </div>
        </el-dialog>
        <dialogLogistics ref="dialogLogis" :isShow="isShowDialog" :expressId="expressId" @transferDialogState="DialogState"></dialogLogistics>
    </div>
</template>
<script>
    import { fetchExpress ,updateLogistics, fetchDeleteLogistics, fetchExpressInfoById} from '@/api/order/express'
    import { fetchShipper, fetchExpressInfo, addExpressInfo, fetchOrderExport } from '@/api/order/index'
    import { formartTime, resolveUrlPath, getPictureLink } from "@/util/util"
    import { deliveryType } from "@/util/data"
    import dialogLogistics from "../../../components/dialogLogistics.vue"
    import { mapGetters, mapMutations } from 'vuex'

    export default {
        data(){
            return {
                appId: '',
                currentAppList: [],
                expressInfoList: [],
                listLoading: true,
                formLabelWidth: '120px',
                dialogFormVisible: false,
                baseUrl: "http://qiniu.edawtech.com/",
                form: {
                    id: '',
                    orderNo: '',
                    consignee: '',
                    address: '',
                    expressName: '',
                    shipperCode: '',
                    phone: ''
                },
                listQuery: {
                    page: 1,
                    limit: 10
                },
                expressObj: '',
                shipperNameList: [],
                isShowDialog: false,
                expressId: '',
                total: null,
                order_ship: false,
                order_editor: false,
                order_del: false,
                order_look_logistics: false,
                orderDetailNo: '',  //订单号
                phone: '',          //电话
                consignee: '',      //收货人
                storeName: '',      //商铺名称
                isShipper: false,
                orderStatus: '',
                // 订单状态
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
                        label: '已退款'
                    },
                    {
                        value: -1,
                        label: '已取消'
                    },
                    {
                        value: 6,
                        label: '出库中'
                    },
                    {
                        value: '',
                        label: '全部'
                    },
                ]
            }
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.appId = !!this.expressEditor['appId'] ? this.expressEditor['appId'] : this.appId;
            this.getList();
            this.listQuery.limit = this.expressEditor["limit"];
            this.listQuery.page = this.expressEditor["page"];
            this.order_ship = this.permissions['order_ship']
            this.order_editor = this.permissions['order_editor']
            this.order_del = this.permissions['order_del']
            this.order_look_logistics = this.permissions['order_look_logistics']
        },
        computed: {
            ...mapGetters(['expressEditor','permissions']),
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
            timeFilter(time){
                if(time){
                    return formartTime(new Date(time), 5);
                }
            },
            filterDeliveryType(val){
                return deliveryType[val];
            },
            // 订单状态过滤器
            orderStatusFilter(status){
                const statusMap = {
                    '-1' : '已取消',
                    '0' : '未付款',
                    '1' : '已付款',
                    '2' : '已发送',
                    '3' : '已签收',
                    '4' : '已评价,订单完成',
                    '5' : '已退款',
                    '6' : '出库中'
                };
                return statusMap[status]
            }
        },
        methods: {
            ...mapMutations({
                savePage: 'SET_EXPRESSEDITORPAGE',
                saveLimit: 'SET_EXPRESSEDITORLIMIT',
                saveAppId: 'SET_EXPRESSEDITORAPPID',
            }),
            getList(){
                this.listLoading = true;
                let postData = {
                    ...this.listQuery,
                    appId: this.appId
                }
                fetchExpress(postData).then(res => {
                   console.log(res, '发货管理信息');
                   this.expressInfoList = res.data.records;
                   this.total = res.data.total
                   this.listLoading = false;
                }); 
            },
            pictureLink(url){
                return getPictureLink(url);
            },
            getDataByAppId(){
                this.saveAppId(this.appId);
                this.getList();
            },
            update(row){
                console.log(row);
                this.form.id = row.id;
                this.form.orderNo = row.orderNo;
                this.form.expressNo = row.expressNo;
                this.form.expressName = row.expressName;
                this.form.shipperCode = row.shipperCode;
                this.form.consignee = row.consignee;
                this.form.address = row.address;
                this.form.phone = row.phone;
                this.form.appId = row.appId;
                this.dialogFormVisible = true;
                this.expressObj = row.expressName;
                if(this.shipperNameList.length == 0){
                    this.getShipper();
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
                    // this.shipperNameList.push({
                    //     lable: 'others',
                    //     value: '其它',
                    // });
                })
            },
            deleteLogistics(row){
                this.$alert('你确定删除该商品规格库存', '删除', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if(action == 'confirm'){
                            if(row.id){
                                fetchDeleteLogistics(row.id).then(res => {
                                    this.getList();
                                    this.handleTip(res.statusText, res.data.msg);
                                });
                            }else {
                                this.$notify({
                                    title: "失败",
                                    message: "id为空",
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        }
                    }
                
                });
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.saveLimit(val)
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.savePage(val);
                this.getList()
            },
            viewLogistics(row){
                console.log(row,'物流信息')
                this.isShowDialog = true;
                this.expressId = row.id;
                // 父组件触发子组件的方法
                this.$refs.dialogLogis.getExpressInfo(this.expressId);
            },
            sendGoods(row){
                this.dialogFormVisible = true;
                this.form.id = row.id;
                this.form.orderNo = row.orderNo;
                this.form.expressNo = row.expressNo;
                this.form.expressName = row.expressName;
                this.form.shipperCode = row.shipperCode;
                this.form.consignee = row.consignee;
                this.form.address = row.address;
                this.form.phone = row.phone;
                this.form.appId = row.appId;
                this.dialogFormVisible = true;
                this.expressObj = row.expressName;
                if(this.shipperNameList.length == 0){
                    this.getShipper();
                }
                let postData = {
                    orderNo: row.orderNo,
                    expressNo: row.expressNo,
                    expressName: row.expressName,
                    id: row.id,
                    shipperCode: row.shipperCode
                }
                this.isShipper = true;
              
                // fetchExpressInfoById(row.id).then(res => {
                //     console.log(res, '根据Id获取发货信息');
                // });
            },
             submit(){
                this.dialogFormVisible = false;   
                console.log(this.form,'修改。。。。');
                console.log(this.isShipper);
                if(this.isShipper){
                    let postData = {
                        orderNo: this.form.orderNo,
                        expressNo: this.form.expressNo,
                        expressName: this.form.expressName,
                        id: this.form.id,
                        shipperCode: this.form.shipperCode,
                        appId: this.form.appId
                    }
                    if(this.form.expressNo &&  this.form.shipperCode){
                        updateLogistics(this.form).then(res => {
                            addExpressInfo(postData,this.form.orderNo).then(res => {
                                this.handleTip(res.statusText, res.data.msg);
                                // this.getList();
                                this.search();
                            });
                        }); 
                    }else {
                        this.$notify({
                            title: '请完善发货信息',
                            message: '参数有误',
                            type: "error",
                            duration: 2000
                        });
                    }
                }else {
                    updateLogistics(this.form).then(res => {
                        // this.getList();
                        this.search();
                        this.handleTip(res.statusText, res.data.msg);
                    });        
                }
            },
            // getExpressId(){
            //     fetchExpressInfo(this.form.orderNo).then(res => {
            //         this.form.id = res.data.expressInfo.id;
            //     });
            // },
            DialogState(){
                // console.log(msg,'msg')
                this.isShowDialog = false;
            },
            getCnameCode(e){
                console.log(e);
                this.form.expressName = e.value;
                this.form.shipperCode = e.lable;
            },
            handleTip(statusText,msg){
                this.$notify({
                    title: statusText,
                    message: msg,
                    type: "success",
                    duration: 2000
                });
            },
            // 发货管理点击搜索
            search(){
                let postData = {
                    ...this.listQuery,
                    orderDetailNo: this.orderDetailNo,
                    storeName: this.storeName,
                    phone: this.phone,
                    consignee: this.consignee,
                    orderDetailStatus: this.orderStatus,
                    appId: this.appId
                }
                this.listLoading = true;
                fetchExpress(postData).then(res => {
                   console.log(res, '发货管搜索信息');
                   this.expressInfoList = res.data.records;
                   this.total = res.data.total
                   this.listLoading = false;
                }); 
            },
            closeDialog(){
                this.isShipper = false;
                console.log(this.isShipper,'21312312');
            },
            // clearExporessCompany(){
            //     this.form.expressName = ' ';
            //     this.form.shipperCode = ' ';
            //     this.expressObj = ''
            // }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                console.log(to.query.id);
            });
        },
        components: {
            dialogLogistics
        }
    }
</script>
<style lang="scss">
    .export-wrapper{
        margin-bottom: 20px;
    }
    .options{
        width: 200px;
    }
    .shipper-wrapper{
        position: relative;
        .close-shipper{ 
            position: absolute;
            top: 0;
            right: 40px;
            .el-icon-circle-close:before{
                color: #666;
            }
        }
    }
</style>

