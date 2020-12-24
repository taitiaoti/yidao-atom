<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-select v-model="appId" placeholder="请选择" style="width: 200px;margin-bottom:10px;">
            <el-option
            v-for="(item, index) in currentAppList"
            :key="index"
            :label="item.appName"
            :value="item.appId">
            <span style="float: left">{{ item.appName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
            </el-option>
        </el-select>
        <el-input v-model="uid" style="width:200px;" prefix-icon="el-icon-search" placeholder="请输入用户UID" clearable></el-input>
        <el-input v-model="phone" style="width:200px;" prefix-icon="el-icon-search" placeholder="请输入用户手机号" clearable></el-input>
        <div class="s-category">
          <el-select v-model="status" placeholder="请选择提现状态">
            <el-option
              v-for="item in cashStatusArr"
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
      </div>
        <!--主体展示部分的开始 -->
      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
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
        <el-table-column align="center" label="提现金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.money | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信交易流水号">
          <template slot-scope="scope">
            <span>{{scope.row.wxTradingId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status | filterStatus }}</el-tag>
          </template> 
        </el-table-column>
        <el-table-column align="center" label="操作" v-if="role_riderWithDrawal">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '2'">{{ scope.row.status | filterStatus }}</el-tag>
            <el-button v-else type="primary" size="mini" @click="cashWithdrawal(scope.row.id)">手动处理</el-button>
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
        <div class="footer_total">提现金额合计：<span class="total_money">￥{{ totalMoney | filterFixed }}</span></div>
      </div>
  </div>
</template>

<script>
import { getRiderWithdrawal,riderCash } from '@/api/riderManagement/index'
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
      appId: '',
      currentAppList: [],     //appId列表
      uid: '',       //uid
      phone: '',     //手机号
      status: '',   //提现状态
      time: '',
      startTime: '',
      endTime: '',
      listLoading: false,
      total: 0,
      cashStatusArr:[
        {label:'未处理',value: '0'},
        {label:'处理中',value: '1'},
        {label:'提现成功',value: '2'},
        {label:'提现失败',value: '3'}
      ],
      list: [],
      totalMoney: 0,
      role_riderWithDrawal: false
    }
  },
  computed:{
      ...mapGetters('appId',{
          appIdList: 'appList'
      }),
      ...mapGetters(['permissions'])
  },
  created(){
      this.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      this.role_riderWithDrawal = this.permissions['role_riderWithDrawal'];
      this.getList();
  },
  methods: {
    // 搜索
    search(){
      this.getList()
    },
    // 获取提现列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        appId: this.appId,
        phone: this.phone,
        uid: this.uid,
        status: this.status,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getRiderWithdrawal(postData).then((res)=>{
        console.log(res,'骑手提现列表')
        this.list = res.data.records;
        this.total = res.data.total;
        this.totalMoney = res.data.condition.totalMoney;
        this.listLoading = false;
      })
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
    // 操作 手动处理
    cashWithdrawal(id){
      let postData = {
        id: id
      }
      this.$alert('确定要手动处理吗？', '操作', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            riderCash(postData).then((res)=>{
              console.log(res,'提现')
              if(res.data.data){
                this.getList()
              }
              this.$notify({
                title: res.data.data ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.data ? "success" : 'error',
                duration: 1500
              });
            })
          }
        }
      });
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
    // 状态
    filterStatus(val){
      let data = {
        '0': '未处理',
        '1': '处理中',
        '2': '提现成功',
        '3': '提现失败'
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
  .s-category {
    width: 200px;
    display: inline-block;
  }
  .s-time{
    width: 400px;
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