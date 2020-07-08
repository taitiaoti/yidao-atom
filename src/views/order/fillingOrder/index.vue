<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input v-model="searchObj.orderId" style="width: 220px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入订单编号" clearable></el-input>
            <el-input v-model="searchObj.gasUserName" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
            <el-input v-model="searchObj.gasAgentName" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
            <el-input v-model="searchObj.username" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入合伙人ID" clearable></el-input>
            <el-input v-model="searchObj.agentName" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入合伙人名称" clearable></el-input>
            <div class="s-category">
                <el-select v-model="searchObj.source" placeholder="请选择油站来源" clearable>
                    <el-option
                    v-for="item in sourceData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-input v-model="searchObj.gasName" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入油站名称" clearable></el-input>
            <el-input v-model="searchObj.duduPhone" style="width: 180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入用户手机号" clearable></el-input>
            <div class="s-category">
                <el-select v-model="searchObj.payType" placeholder="请选择支付方式" clearable>
                    <el-option
                    v-for="item in paymentTypeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="s-category">
                <el-select v-model="searchObj.orderStatusName" placeholder="请选择订单状态" clearable>
                    <el-option
                    v-for="item in orderStateData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- 订单时间 -->
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
            
            <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left:10px;">搜索</el-button>
            <el-button type="primary" icon="el-icon-download" :loading="loading" @click="handleExport">导出</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="订单编号">
                <template scope="scope">
                    <span>{{ scope.row.orderId }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="加盟商ID">
                <template scope="scope">
                    <span>{{ scope.row.gasUserName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="加盟商名称">
                <template scope="scope">
                    <span>{{ scope.row.gasAgentName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="合伙人ID">
                <template scope="scope">
                    <span>{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="合伙人名称">
                <template scope="scope">
                    <span>{{ scope.row.agentName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="油站来源">
                <template scope="scope">
                    <el-tag>{{ scope.row.source | filterSource }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="用户手机号">
                <template scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="油站名称">
                <template scope="scope">
                    <span>{{ scope.row.gasName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="油号">
                <template scope="scope">
                    <span>{{ scope.row.oilNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="加油量(升)">
                <template scope="scope">
                     <span>{{ scope.row.litre }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="原价(元)">
                <template scope="scope">
                    <span>{{ scope.row.amountGun | filterFixed }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="成本价（元）">
                <template scope="scope">
                    <span>{{ scope.row.amountGas | filterFixed }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="实付金额(元)">
                <template scope="scope">
                    <span>{{ scope.row.amountPay | filterFixed }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="加油补贴(元)">
                <template scope="scope">
                    <span>{{ scope.row.amountDiscounts | filterFixed }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付方式">
                <template scope="scope">
                    <el-tag>{{ scope.row.payType }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="交易流水号" width="100">
                <template scope="scope">
                    <span>{{ scope.row.paySn }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="支付时间" width="100">
                <template scope="scope">
                    <span>{{ scope.row.payTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单状态">
                <template scope="scope">
                    <el-tag>{{ scope.row.orderStatusName }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="油站地址">
                <template scope="scope">
                    <span>{{ scope.row.pcc }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button type='danger' size='mini' v-if='scope.row.source == "1001"' @click="refundMoney(scope.row)">退款</el-button>
                    <span v-else>
                        不支持退款
                    </span>
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
    </div>
</template>

<script>
import { formartTime } from "@/util/util";
import { queryOrderInfoLis, exportOrder,refundGasOrder } from "@/api/order/index";
export default {
    data(){
        return {
            list: [],
            searchObj: {
                orderId: '',        //订单号
                duduPhone: '',      //手机号
                startTime: '',      //开始时间
                endTime: '',      //结束时间
                gasUserName: '',    //加盟商id
                gasAgentName: '',       //加盟商名称
                username: '',           //合伙人id
                agentName: '',          //合伙人名称
                source: '',             //来源
                gasName: '',            //油站名称
                payType: '',        //支付方式
                orderStatusName: '',         //订单状态
            },
            time: '',           //时间段筛选
            listLoading: true,         //请求加载状态
            listQuery: {
                page: 1,
                limit: 10
            },
            sourceData: [
                { label: '嘟嘟', value: '1001'},
                { label: '嘟嘟2', value: '1002'}
            ],
            paymentTypeData: [
                { label: '微信支付', value: '微信支付'},
                { label: '支付宝支付', value: '支付宝支付'},
                { label: '微信小程序支付', value: '微信小程序支付'}
            ],
            orderStateData: [
                { label: '已支付', value: '已支付'},
                { label: '已退款', value: '已退款'}
            ],
            total: 10,                   //总页数
            loading: false
        }
    },
    created(){
        // 查询加油订单列表
        this.getList();
    },
    methods:{
        // 查询订单
        getList(){
            this.listLoading = true;
            let postData = {
                ...this.listQuery,
                ...this.searchObj
            }
            queryOrderInfoLis(postData).then((res)=>{
                this.list = res.data.data.list;
                this.total = res.data.data.total;
                this.listLoading = false;
                console.log(res,'加油订单')
            })
        },
        // 导出
        handleExport(){
            this.loading = true;
            let postData = {
                ...this.listQuery,
                ...this.searchObj
            }
            exportOrder(postData).then((res)=>{
                console.log(res,'导出')
                this.loading = false;
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                }
            })
        },
        // 时间段查询
        selectTime(res){
            console.log(res)
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
        // 搜索按钮
        search(){
            this.listQuery.page = 1;
            this.getList();
        },
        // 页数变化
        handleSizeChange(value){
            this.listQuery.limit = value;
            this.getList();
        },
        // 页变化
        handleCurrentChange(value){
            this.listQuery.page = value;
            this.getList();
        },
        // 退款按钮
        refundMoney(row){
            this.$alert('你确定要执行退款操作？', '退款', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action == 'confirm'){
                        if(row.orderId){
                            refundGasOrder(row.orderId).then(res => {
                                console.log(res,'退款')
                                this.$notify({
                                    title: res.data.code == 0 ? '成功' : '失败',
                                    message: res.data.msg,
                                    type: res.data.code == 0 ? "success" : 'error',
                                    duration: 2000
                                });
                                if(res.data.code == 0){
                                    this.getList();
                                }
                            });
                        }else {
                            this.$notify({
                                title: "失败",
                                message: "orderId(订单编号)为空",
                                type: "error",
                                duration: 2000
                            });
                        }
                    }
                }
            
            });
        }
    },
    filters: {
        filterSource(val){
            let data = {
                1001: '嘟嘟',
                1002: '嘟嘟2'
            }
            if(val){
                return data[val]
            }
        },
        // 保留两位
        filterFixed(val){
            if(val){
                return Number(val).toFixed(2)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
  .s-time{
    width: 400px;
    margin-right:10px;
    display: inline-block;
  }
  .s-category {
    width: 200px;
    margin-right:10px;
    display: inline-block;
  }
</style>