<template>
<!-- 骑手收入记录 -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-select v-model="appId" placeholder="请选择" style="width: 200px;margin-right:10px;margin-bottom:10px;">
            <el-option
            v-for="(item, index) in currentAppList"
            :key="index"
            :label="item.appName"
            :value="item.appId">
            <span style="float: left">{{ item.appName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
            </el-option>
        </el-select>
        <el-input v-model="uid" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入用户UID" clearable></el-input>
        <el-input v-model="phone" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入用户手机号" clearable></el-input>
        <el-input v-model="serialNumber" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入订单号" clearable></el-input>
        <el-input v-model="productName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入商品名称" clearable></el-input>
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
        :span-method="objectSpanMethod"
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;padding-top:1px;">
        <el-table-column align="center" label="应用名">
          <template slot-scope="scope">
            <span>{{scope.row.appId | filterAppName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户UID">
          <template slot-scope="scope">
            <span>{{scope.row.uid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="本单收入金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.money | filterFixed }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总订单号">
          <template slot-scope="scope">
            <span>{{scope.row.merchantsNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.serialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称">
          <template slot-scope="scope">
            <span>{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品主图">
          <template slot-scope="scope">
            <img :src="scope.row.productImage.indexOf('http')==0?scope.row.productImage:(baseUrl+scope.row.productImage)" height="100" width="100"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品规格">
          <template slot-scope="scope">
            <span>{{scope.row.productSpecification}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="数量（件）">
          <template slot-scope="scope">
            <span>{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付总金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.actualPayment | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下单支付时间" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.payTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="配送完成时间" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="店家地址">
          <template slot-scope="scope">
            <span>{{scope.row.storeAddress}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="配送地址">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
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
        <div class="footer_total">收入金额合计：<span class="total_money">￥{{ totalMoney | filterFixed }}</span></div>
      </div>
  </div>
</template>

<script>
import { getRiderIncome,riderExport } from '@/api/riderManagement/index'
import { formartTime,getAppName } from "@/util/util";
import {mapGetters} from 'vuex';
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      totalMoney: 0,          //总金额
      rowAndColumn: [],
      loading: false,
      baseUrl:"http://qiniu.edawtech.com/",
      appId: '',
      currentAppList: [],     //appId列表
      uid: '',       //uid
      phone: '',     //手机号
      serialNumber: '',            //订单号
      productName: '',      //商品名称
      time: '',
      startTime: '',
      endTime: '',
      listLoading: false,
      total: 0,
      list: []
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
      this.getList()
  },
  methods: {
    // 搜索
    search(){
      this.getList()
    },
    // 获取骑手收入记录
    getList(){
      this.listLoading = true;
      let postData = {
        appId: this.appId,
        phone: this.phone,
        uid: this.uid,
        serialNumber: this.serialNumber,
        startTime: this.startTime,
        endTime: this.endTime,
        productName: this.productName,
        ...this.listQuery
      }
      getRiderIncome(postData).then((res)=>{
        console.log(res,'骑手收入记录')
        this.total = res.data.total;
        this.totalMoney = res.data.condition.totalMoney;
        this.list = res.data.records;
        this.listLoading = false;
        this.getListDataForRowAndColumn(res.data.records)
      })
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
          if (data[i].merchantsNumber === data[i - 1].merchantsNumber) {
            //  如果订单号相等就累加，并且push0
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
       if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14) {
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
        appId: this.appId,
        phone: this.phone,
        uid: this.uid,
        serialNumber: this.serialNumber,
        startTime: this.startTime,
        endTime: this.endTime,
        productName: this.productName
      }
      riderExport(postData).then((res)=>{
        console.log(res,'导出')
        this.loading = false;
        if(res.status == 200){
            window.location.href = res.request.responseURL;
        }
      })
    }
  },
  filters: {
    // appId
    filterAppName(appId){
        return getAppName(appId)
    },
    // 时间戳
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
  .s-time{
    width: 400px;
    display: inline-block;
    margin-right:10px;
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