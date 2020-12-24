<template>
    <div class="app-container calendar-list-container">
        <!-- <div class="filter-container">
            <el-button v-if="t_order_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加
            </el-button>
        </div> -->
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <!-- <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="订单编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="appID">
                <template slot-scope="scope">
                    <span>{{ scope.row.appId }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="用户ID">
                <template slot-scope="scope">
                    <span>{{ scope.row.uid }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="商品名称" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品图" width="120">
                <template slot-scope="scope">
                    <img :src="baseUrl+scope.row.picture" width="100" height="80"/>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品规格" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.productModeDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总数量">
                <template slot-scope="scope">
                    <span>{{ scope.row.productNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总金额">
                <template slot-scope="scope">
                    <span>{{ scope.row.totalAmount | moneyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付渠道">
                <template slot-scope="scope">
                    <span>{{ scope.row.payChannel | payChannelFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交易流水号">
                <template slot-scope="scope">
                    <span>{{ scope.row.outTradeNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付时间" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.payTime | sendTimeFilter}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="最后一次更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime }}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="订单状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderStatus | orderStatusFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="包邮">
                <template slot-scope="scope">
                    <span>{{ scope.row.isFreePostage | judgmentFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="邮费">
                <template slot-scope="scope">
                    <span>{{ scope.row.postage | moneyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发货时间" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.sendTime | sendTimeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分润">
                <template slot-scope="scope">
                    <span>{{ scope.row.isBenefit | judgmentFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分润金额">
                <template slot-scope="scope">
                    <span>{{ scope.row.benefit | moneyFilter}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="备注">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.orderStatus == 1" size="small" type="primary"
                               @click="sendGoods(scope.row)">
                               发货
                    </el-button>
                    <el-button v-if="scope.row.orderStatus >= 2" size="small" :disabled="true" type="success"
                               @click="sendGoods(scope.row)">
                               已发货
                    </el-button>
                    <!-- <el-button v-if="t_order_upd" size="small" type="success"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="t_order_del" size="mini" type="danger"
                               @click="handleDelete(scope.row)">删除
                    </el-button> -->
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.id" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.orderNo" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.appId" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.uid" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.productNum" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.totalAmount" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="交易流水号" prop="username">
                        <el-input v-model="form.outTradeNo" placeholder="交易流水号"></el-input>
                    </el-form-item>
                    <el-form-item label="支付渠道" prop="username">
                        <el-input v-model="form.payChannel" placeholder="支付渠道"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.payTime" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.createTime" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.sendTime" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.updateTime" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="0-未付款 1-已付款 2-已发送 3-已签收" prop="username">
                        <el-input v-model="form.orderStatus" placeholder="0-未付款 1-已付款 2-已发送 3-已签收"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.remark" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.updateUser" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.isFreePostage" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.postage" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.ip" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.isBenefit" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="username">
                        <el-input v-model="form.benefit" placeholder=""></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
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
    </div>
</template>

<script>
    import { fetchList, send, addObj, putObj, delObj,fetchShipper,fetchExpressInfo,addExpressInfo } from '@/api/order/index'
    import waves from '@/directive/waves/index.js' // 水波纹指令
    import { mapGetters } from 'vuex' 
    import { formartTime } from "@/util/util"

    export default {
        name: 'table_t_order',
        directives: {
            waves
        },
        data() {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20
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
            }
        },
        computed: {
            // ...mapGetters([
            //     'permissions'
            // ])
        },
        filters: {
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
                    '2': '已发送',
                    '3': '已签收',
                    '4': '已评价，订单完成'
                }
                return statusMap[status]
            },
            sendTimeFilter(time){
                if(time){
                    return formartTime(new Date(time), 5);
                }
            },
            moneyFilter(money){
                return money/10000
            },
            payChannelFilter(payChannel){
                const statusMap = {
                    redpay: '红包支付',
                    wxpay: '微信支付',
                    alipay: '支付宝支付'
                }
                return statusMap[payChannel]
            },
            judgmentFilter(state){
                return state == 'y' ? '是' : '否';
            }
        },
        created() {
            this.getList()
            this.getShipper();
            // this.t_order_add = this.permissions['t_order_add']
            // this.t_order_upd = this.permissions['t_order_upd']
            // this.t_order_del = this.permissions['t_order_del']
        },
        methods: {
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    console.log(response, '订单列表');
                    this.list = response.data.records
                    this.total = response.data.total
                    this.listLoading = false 
                })
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
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.getList()
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
            // handleDelete(row) {
            //     delObj(row.id)
            //         .then(response => {
            //             this.dialogFormVisible = false
            //             this.getList()
            //             this.$notify({
            //                 title: '成功',
            //                 message: '删除成功',
            //                 type: 'success',
            //                 duration: 2000
            //             })
            //         })
            // },
            handleCreate() {
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
            },
            // create(formName) {
            //     const set = this.$refs
            //             set[formName].validate(valid => {
            //         if (valid) {
            //             addObj(this.form)
            //                     .then(() => {
            //                         this.dialogFormVisible = false
            //                         this.getList()
            //                         this.$notify({
            //                             title: '成功',
            //                             message: '创建成功',
            //                             type: 'success',
            //                             duration: 2000
            //                         })
            //                     })
            //         } else {
            //             return false
            //         }
            //     })
            // },
            cancel(formName) {
                this.dialogFormVisible = false
                const set = this.$refs
                set[formName].resetFields()
            },
            // update(formName) {
            //     const set = this.$refs
            //             set[formName].validate(valid => {
            //         if (valid) {
            //             this.dialogFormVisible = false
            //             this.form.password = undefined
            //             putObj(this.form).then(() => {
            //                 this.dialogFormVisible = false
            //                 this.getList()
            //                 this.$notify({
            //                     title: '成功',
            //                     message: '修改成功',
            //                     type: 'success',
            //                     duration: 2000
            //                 })
            //             })
            //         } else {
            //             return false
            //         }
            //     })
            // },
        }
    }
</script>
