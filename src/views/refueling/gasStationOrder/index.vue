<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="orderId" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入订单号" clearable></el-input>
        <el-input v-model="gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加油站名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="oilNo" placeholder="请选择油号" clearable>
            <el-option
              v-for="item in oilNumerData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="orderState" placeholder="请选择订单状态" clearable>
            <el-option
              v-for="item in orderStatusData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
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
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-download" :loading="loading" @click="handleExport">导出</el-button>
      </div>
        <!--主体展示部分的开始 -->
      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="订单号">
          <template scope="scope">
            <span>{{scope.row.orderId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油站名称">
          <template scope="scope">
            <span>{{scope.row.gasName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="油号">
          <template scope="scope">
            <span>{{scope.row.oilNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油量（升）">
          <template scope="scope">
            <span>{{scope.row.litre}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="原价金额（元）">
          <template scope="scope">
            <span>{{scope.row.amountGun | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="优惠后金额（元）">
          <template scope="scope">
            <span>{{scope.row.amountGas | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额（元）">
          <template scope="scope">
            <span>{{scope.row.amountPay | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式">
          <template scope="scope">
            <el-tag>{{scope.row.paymentType | filterPayType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易流水">
          <template scope="scope">
            <span>{{scope.row.paySn}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付时间" width="100">
          <template scope="scope">
            <span>{{scope.row.payTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template scope="scope">
             <el-tag>{{scope.row.orderState | filterStatus }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--主体展示部分的结束 -->
      <!-- 分页插件的开始 -->
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
        <div class="footer_total">优惠后金额合计：<span class="total_money">￥{{ Number(totalMoney).toFixed(2) }}</span></div>
      </div>
  </div>
</template>

<script>
import { formartTime } from "@/util/util";
import { getStore } from '@/util/store';
import { queryGasOrder,exportGasOrder } from '@/api/franchisee/index';
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      orderId: '',            //订单号
      gasName: '',            //加油站名称
      oilNo: '',           //油号
      orderState: '',        //订单状态
      time: '',
      startTime: '',
      endTime: '',
      listLoading: false,
      loading: false,
      total: 0,
      oilNumerData:[
        {label:'92#',value: '92#'},
        {label:'95#',value: '95#'},
        {label:'98#',value: '98#'},
        {label:'0#',value: '0#'},
        // {label: '全部', value: ''}
      ],
      orderStatusData: [
        { label: '已退款', value: '1003'},
        { label: '已支付', value: '1002'}
      ],
      list: [],
      totalMoney: 0,            //总金额
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        startTime: this.startTime,
        endTime: this.endTime,
        orderId: this.orderId,
        oilNo: this.oilNo,
        gasName: this.gasName,
        orderState: this.orderState
      }
      console.log(postData,'请求参数')
      queryGasOrder(postData).then((res)=>{
        console.log(res,'加油订单')
        this.list = res.data.records;
        this.total = res.data.total;
        this.totalMoney = res.data.orderByField;
        this.listLoading = false;
      })
    },
    // 搜索
    search(){
      this.getList();
    },
    // 时间段查询
    selectTime(res){
        console.log(res)
        if(res){
            this.time = [];
            this.startTime = formartTime(res[0], 5);
            this.endTime = formartTime(res[1], 5);
            this.time.push(formartTime(res[0], 5));
            this.time.push(formartTime(res[1], 5));
        }else {
            this.startTime = null;
            this.endTime = null;
        }
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
    // 导出
    handleExport(){
      this.loading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        startTime: this.startTime,
        endTime: this.endTime,
        orderId: this.orderId,
        oilNo: this.oilNo,
        gasName: this.gasName,
        orderState: this.orderState
      }
      exportGasOrder(postData).then((res)=>{
          console.log(res,'导出')
          this.loading = false;
          if(res.status == 200){
              window.location.href = res.request.responseURL;
          }
      })
    },
  },
  filters:{
    filterStatus(val){
      let data = {
        1001: '未支付',
        1002: '已支付',
        1003: '已退款'
      }
      if(val){
        return data[val]
      }
    },
    // 支付方式
    filterPayType(val){
      let data = {
        1001: '微信支付',
        1002: '支付宝支付',
        1003: '微信小程序支付'
      }
      if(val){
        return data[val]
      }
    },
    // 时间戳转日期
    sendTimeFilter(time){
        if(time){
            return formartTime(new Date(time), 5);
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
  // .filter-container{
  //   display: flex;
  //   flex-wrap: wrap;
  //   margin-bottom: 20px;
  // }
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
  .pagination-container{
    display: flex;
  }
  .footer_total{
    margin-left: 50px;
  }
  .total_money{
    border-bottom: 1px solid #333;
  }
</style>