<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="roleName" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in rouleArr"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="examineState" placeholder="请选择审核状态" clearable>
            <el-option
              v-for="item in examineStatusArr"
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
          <template scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商名称">
          <template scope="scope">
            <span>{{scope.row.agentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户名">
          <template scope="scope">
            <span>{{scope.row.bankName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行开户行">
          <template scope="scope">
            <span>{{scope.row.bankDeposit}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账号">
          <template scope="scope">
            <span>{{scope.row.bankCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" width="100">
          <template scope="scope">
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template scope="scope">
            <el-tag>{{scope.row.examineState | filterStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template scope="scope">
            <el-tag v-if="scope.row.examineState == '1002'">已通过</el-tag>
            <div v-else>
              <el-button v-if="role_approved" type="primary" size="mini" @click="updataStatus(scope.row.id,'1002')">通过审核</el-button>
              <el-button v-if="role_cancelAudit" type="danger" size="mini" @click="updataStatus(scope.row.id,'1003')">撤销审核</el-button>
            </div>
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
import { formartTime } from "@/util/util";
import { mapGetters } from 'vuex';
import { queryBankInfoList, updataBankStatus } from '@/api/franchisee/index';
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      userId: '',
      username: '',       //加盟商id
      agentName: '',     //加盟商名字
      time: '',
      startTime: '',
      endTime: '',
      examineState: '',         //审核状态
      roleName: '',                //角色
      listLoading: false,
      total: 0,
      examineStatusArr:[
        {label:'待审核',value: '1001'},
        {label:'已审核',value: '1002'},
        {label:'审核失败',value: '1003'},
        // {label:'全部',value: ''}
      ],
      rouleArr: [
        { label: '加油站',value: '加油站'},
        { label: '合伙人',value: '合伙人'},
        // { label: '全部', value: ''}
      ],
      list: [],
      role_approved: false,       //通过审核
      role_cancelAudit: false,       //撤销审核
    }
  },
  computed: {
      ...mapGetters(['permissions'])
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.role_approved = this.permissions['role_approved'];
    this.role_cancelAudit = this.permissions['role_cancelAudit'];
    this.getList();
  },
  methods: {
    // 审核列表
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
      console.log(postData,'请求参数')
      queryBankInfoList(postData).then((res)=>{
        console.log(res,'银行审核列表')
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
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    // 操作
    updataStatus(id,status){
      let postData = {
        id: id,
        userId: this.userId,
        examineState: status
      }
      let text = status == '1002' ? '通过' : '拒绝';
      this.$alert('你确定要' + text + '审核？', '审核', {
          confirmButtonText: '确定',
          callback: action => {
              if(action == 'confirm'){
                updataBankStatus(postData).then((res)=>{
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
    },
  },
  filters:{
    filterStatus(val){
      let data = {
        1001: '待审核',
        1002: '已审核',
        1003: '审核失败'
      }
      return data[val]
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