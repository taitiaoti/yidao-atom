<template>
<!-- 骑手账户 -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-select v-model="appId" placeholder="请选择" style="width: auto;margin-right:10px;">
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
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="应用名">
          <template scope="scope">
            <span>{{scope.row.appId | filterAppName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户UID">
          <template scope="scope">
            <span>{{scope.row.uid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户手机号">
          <template scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="总收入（元）">
          <template scope="scope">
            <span>{{scope.row.totalRedPacket | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="待提现金额（元）">
          <template scope="scope">
            <span>{{scope.row.notWithdrawal | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已提现金额（元）">
          <template scope="scope">
            <span>{{scope.row.haveWithdrawal | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="冻结金额（元）">
          <template scope="scope">
            <span>{{scope.row.freezeWithdrawal | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号状态">
          <template scope="scope">
            <el-tag>{{ scope.row.status | filterStatus }}</el-tag>
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
      </div>
  </div>
</template>

<script>
import { getRiderAcount } from "@/api/riderManagement/index"
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
      this.getList();
  },
  methods: {
    // 搜索
    search(){
      this.getList();
    },
    // 获取骑手账户列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        appId: this.appId,
        phone: this.phone,
        uid: this.uid
      }
      getRiderAcount(postData).then((res)=>{
        console.log(res,'骑手账户列表')
        this.total = res.data.total;
        this.list = res.data.records;
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
  },
  filters: {
    // appId
    filterAppName(appId){
        return getAppName(appId)
    },
    // 状态
    filterStatus(val){
      let data = {
        'y': '激活',
        'n': '冻结'
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
  .filter-container{
    display: flex;
    margin-bottom: 20px;
  }
  .s-time{
    width: 400px;
    margin-right:10px;
  }
  .s-category {
    width: 200px;
    margin-right:10px;
  }
</style>