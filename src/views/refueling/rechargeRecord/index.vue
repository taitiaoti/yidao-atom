<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
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
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="序号">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商ID">
          <template scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商名称">
          <template scope="scope">
            <span>{{scope.row.agentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值金额（元）">
          <template scope="scope">
            <span>{{ Number(scope.row.rechargeAmount).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行转账截图" width="120">
          <template scope="scope">
            <img :src="scope.row.img.indexOf('http')==0?scope.row.img:(baseUrl+scope.row.img)" height="100" width="100"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值时间">
          <template scope="scope">
            <span>{{scope.row.createTime}}</span>
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
import { getStore } from '@/util/store';
import { queryRechargeList } from '@/api/franchisee/index';
import { formartTime } from "@/util/util";
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      baseUrl:"http://qiniu.edawtech.com/",
      userId: '',
      username: '',       //加盟商id
      agentName: '',     //加盟商名字
      time: '',
      startTime: '',
      endTime: '',
      listLoading: false,
      total: 0,
      list: []
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.getList();
  },
  methods: {
    // 充值记录列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        username: this.username,
        agentName: this.agentName,
        startTime: this.startTime,
        endTime: this.endTime
      }
      queryRechargeList(postData).then((res)=>{
        console.log(res,'充值记录')
        this.list = res.data.records;
        this.total = res.data.total;
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
    }
  }
}
</script>

<style lang='scss' scoped>
  // .filter-container{
  //   display: flex;
  //   margin-bottom: 20px;
  // }
  .s-time{
    width: 400px;
    margin-right:10px;
    display: inline-block;
  }
  .s-category {
    width: 200px;
    display: inline-block;
    margin-right:10px;
  }
</style>