<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-select v-model="appId" placeholder="请选择" style="width: auto;margin-bottom:10px;">
            <el-option
            v-for="(item, index) in currentAppList"
            :key="index"
            :label="item.appName"
            :value="item.appId">
            <span style="float: left">{{ item.appName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
            </el-option>
        </el-select>
        <el-input v-model="uid" style="width:200px;margin-bottom:10px;" prefix-icon="el-icon-search" placeholder="请输入用户UID" clearable></el-input>
        <el-input v-model="userPhone" style="width:200px;margin-bottom:10px;" prefix-icon="el-icon-search" placeholder="请输入用户手机号" clearable></el-input>
        <el-input v-model="name" style="width:200px;margin-bottom:10px;" prefix-icon="el-icon-search" placeholder="请输入姓名" clearable></el-input>
        <el-input v-model="phone" style="width:200px;margin-bottom:10px;" prefix-icon="el-icon-search" placeholder="请输入联系电话" clearable></el-input>
        <div class="s-category">
          <el-select v-model="status" placeholder="请选择审核状态">
            <el-option
              v-for="item in auditStatusArr"
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
        style="width:100%;margin-bottom:20px;padding-top: 1px;">
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
            <span>{{scope.row.userPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="意向工作城市">
          <template scope="scope">
            <span>{{scope.row.workCity}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="意向工作地点">
          <template scope="scope">
            <span>{{scope.row.workingPlace}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template scope="scope">
            <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="100">
          <template scope="scope">
            <span>{{scope.row.ctime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200px" v-if="role_RiderReview">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="affirmAudit(scope.row.id, 'y')">通过审核</el-button>
            <el-button type="danger" size="mini" @click="affirmAudit(scope.row.id, 'n')">拒绝通过</el-button>
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
import { fetchList, updateRiderStatus } from '@/api/riderManagement/index'
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
      name: '',     //姓名
      userPhone: '',    //联系电话
      time: '',
      startTime: '',
      endTime: '',
      status: '',         //审核状态
      listLoading: false,
      total: 100,
      auditStatusArr:[
        {label:'待审核',value: 'd'},
        {label:'已拒绝',value: 'n'}
      ],
      list: [],
      role_RiderReview: false
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
      this.role_RiderReview = this.permissions['role_RiderReview'];
      this.getList()
  },
  methods: {
    // 获取数据列表
    getList(){
      this.listLoading = true;
      let postData = {
        startTime: this.startTime,
        endTime: this.endTime,
        appId: this.appId,
        ...this.listQuery,
        userPhone: this.userPhone,
        phone: this.phone,
        name: this.name,
        uid: this.uid,
        status: this.status
      }
      console.log(postData,'搜索参数')
      fetchList(postData).then(res => {
          console.log(res, '骑手列表')
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false 
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
    // 操作 审核
    affirmAudit(id, status){
      let postData = {
        id: id,
        status: status
      }
      let text = status == 'y' ? '通过' : '拒绝';
      this.$alert('你确定要' + text + '审核？', '审核', {
          confirmButtonText: '确定',
          callback: action => {
              if(action == 'confirm'){
                updateRiderStatus(postData).then((res)=>{
                  this.$notify({
                    title: '审核',
                    message: '已' + text,
                    type: res.data ? 'success' : 'error',
                    duration: 2000
                  });
                  if(res.data){
                    this.getList()
                  }
                })
              }
          }
      });
    }
  },
  filters:{
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
    statusFilter(status){
      let statusObj = {
        "y": "已通过",
        "n": "已拒绝",
        "d": "待审核"
      }
      if(status){
        return statusObj[status]
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