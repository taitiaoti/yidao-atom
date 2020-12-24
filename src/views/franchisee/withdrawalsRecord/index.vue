<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="roleName" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in rouleArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="examineState" placeholder="请选择提现状态" clearable>
            <el-option
              v-for="item in drawalStatusArr"
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
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="加盟商ID">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商名称">
          <template slot-scope="scope">
            <span>{{scope.row.agentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现金额（元）">
          <template slot-scope="scope">
            <span>{{scope.row.caseAmount | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户名">
          <template slot-scope="scope">
            <span>{{scope.row.bankName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行开户行">
          <template slot-scope="scope">
            <span>{{scope.row.bankDeposit}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账号">
          <template slot-scope="scope">
            <span>{{scope.row.bankCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现状态">
          <template slot-scope="scope">
            <el-tag>{{scope.row.examineState | filterStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="转账信息" width="120">
          <template slot-scope="scope">
            <img  v-if="scope.row.cashwithImg" :src="scope.row.cashwithImg.indexOf('http')==0?scope.row.cashwithImg:(baseUrl+scope.row.cashwithImg)" height="100" width="100" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="补充信息">
          <template slot-scope="scope">
            <span>{{scope.row.supplement}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.examineState !== '1001'">{{scope.row.examineState | filterStatus }}</el-tag>
            <el-button v-show="scope.row.examineState == '1001'" type="danger" size="small" @click="cancel(scope.row.caseNo,'1005')">取消提现</el-button>
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
import { queryCashwithList,updataCashwith } from '@/api/franchisee/index';
import { formartTime } from "@/util/util";
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      userId: '',         //账号id
      username: '',       //加盟商id
      agentName: '',     //加盟商名字
      time: '',
      startTime: '',
      endTime: '',
      examineState: '',         //提现状态
      roleName: '',                //角色
      listLoading: false,
      total: 0,
      baseUrl:"http://qiniu.edawtech.com/",
      drawalStatusArr:[
        {label:'未处理',value: '1001'},
        {label:'处理中',value: '1002'},
        {label:'提现成功',value: '1003'},
        {label:'已驳回',value: '1004'},
        {label:'已取消',value: '1005'},
        // {label:'全部',value: ''}
      ],
      rouleArr: [
        { label: '加油站',value: '加油站公司'},
        { label: '合伙人',value: '合伙人'},
        // { label: '全部',value: ''}
      ],
      list: []
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.getList();
  },
  methods: {
    // 获取提现列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        username: this.username,
        agentName: this.agentName,
        roleName: this.roleName,
        examineState: this.examineState,
        startTime: this.startTime,
        endTime: this.endTime
      }
      console.log(postData,'提现列表参数')
      queryCashwithList(postData).then((res)=>{
        console.log(res,'提现列表')
        this.list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      })
    },
    // 搜索
    search(){
      this.getList()
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
    // 操作 取消提现
    cancel(caseNo, status){
      let postData = {
        caseNo: caseNo,
        userId: this.userId,
        examineState: status
      }
      this.$alert('你确定要取消提现吗？', '提现', {
        confirmButtonText: '确定',
        callback: action => {
            if(action == 'confirm'){
              updataCashwith(postData).then((res)=>{
                console.log(res)
                this.$notify({
                  title: res.data.code == 0 ? '成功' : '失败',
                  message: res.data.msg,
                  type:  res.data.code == 0 ? 'success' : 'error',
                  duration: 2000
                });
                if(res.data.code == 0){
                  this.getList()
                }
              })
            }
          }
      });
    }
  },
  filters:{
    filterStatus(val){
      let data = {
        1001: '未处理',
        1002: '处理中',
        1003: '提现成功',
        1004: '已驳回',
        1005: '已取消'
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
</style>