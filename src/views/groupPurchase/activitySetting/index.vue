<template>
  <div>
    <div>
      <el-select v-model="searchObj.appId" placeholder="请选择APP渠道" style="display: inline-block; width: auto;margin-bottom:20px;">
        <el-option
          v-for="(item, index) in appIdList"
          :key="index"
          :label="item.appName"
          :value="item.appId">
          <span style="float: left">{{ item.appName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
        </el-option>
      </el-select>
      <el-select v-model="searchObj.activityTypeName" placeholder="请选择活动类型" style="display: inline-block; width: auto;margin-bottom:20px;">
        <el-option
          v-for="(item, index) in activityTypeData"
          :key="index"
          :label="item.activityName"
          :value="item.activityName">
          <span style="float: left">{{ item.activityName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.activityType }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="primary" icon="el-icon-search" @click="addActivity()">添加活动</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="list"
      border
      v-loading="listLoading"
      fit
      highlight-current-row
      element-loading-text="给我一点时间"
      style="width:100%;margin-bottom:20px;">
      <el-table-column 
        align="center" 
        label="APP渠道">
        <template slot-scope="scope">
            <span>{{ scope.row.appId | filterAppName }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动类别ID">
        <template slot-scope="scope">
            <span>{{scope.row.activityType}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动类别名称">
        <template slot-scope="scope">
            <span>{{scope.row.activityTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动名称">
        <template slot-scope="scope">
            <span>{{scope.row.activityName}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="可退团时长">
        <template slot-scope="scope">
            <span>{{scope.row.outDate}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动开始时间">
        <template slot-scope="scope">
            <span>{{ scope.row.startTime | fitlerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动结束时间">
        <template slot-scope="scope">
            <span>{{ scope.row.endTime | fitlerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="操作">
        <template slot-scope="scope">
            <el-button size='mini' type='primary' @click="addActivity(scope.row)">编辑</el-button>
            <el-button size='mini' type='danger' @click="handDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
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
    <!-- 添加修改对话框 -->
    <el-dialog
      :title="dialogType == 'create' ? '添加活动' : '编辑活动' "
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-width="100px" :model="activityInfo" ref="form" >
        <el-form-item label="APP渠道">
          <el-select v-model="activityInfo.appId" placeholder="请选择渠道名称">
              <el-option
                v-for="item in appIdList"
                :key="item.appId"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="activityInfo.activityType" @change="activeCategary" placeholder="请选择活动类型">
              <el-option
                v-for="item in activityTypeData"
                :key="item.activityType"
                :label="item.activityName"
                :value="item.activityType">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='活动名称'>
          <el-input v-model="activityInfo.activityName" placeholder='请输入活动名称'></el-input>
        </el-form-item>
        <el-form-item label='可退团时长'>
          <el-input v-model="activityInfo.outDate" placeholder='请输入可退团时长（小时）'></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="activityTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="affirmActivity">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import {mapGetters} from 'vuex';
import { activityTypeList } from '@/api/groupPurchase/activityType'
import { activityList, addActivity, updateActivity } from '@/api/groupPurchase/activitySetting'
import { formartTime, getAppName } from "@/util/util";
export default {
  data(){
    return {
      searchObj: {
        appId: '',
        activityTypeName: '',       //活动类别名称
        state: 1
      },
      activityTypeData: [],
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      activityInfo: {
        appId: '',
        activityType: '',
        activityTypeName: '',
        activityName: '',
        state: 1,
        startTime: '',
        endTime: '',
        outDate: null
      },
      dialogType: 'create',
      dialogVisible: false,
      activityTime: []
    }
  },
  computed:{
    ...mapGetters('appId',{
        appIdList: 'appList'
    })
  },
  created(){
    this.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
    this.getActivityType();
    this.getList();
  },
  methods: {
    // 活动类型
    getActivityType(){
      let postData = {
        activityName: '',
        state: 1,
        page: 1,
        limit: 20
      }
      activityTypeList(postData).then((res)=>{
        this.activityTypeData = res.data.records;
      })
    },
    search(){
      this.getList();
    },
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.searchObj,
        ...this.listQuery
      }
      activityList(postData).then((res)=>{
        console.log(res)
        this.list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      })
    },
    activeCategary(val){
      this.activityTypeData.forEach((i)=>{
        if(i.activityType == val){
          this.activityInfo.activityTypeName = i.activityName
        }
      })
    },
    // 添加活动
    addActivity(obj){
      this.activityInfo.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
      if(obj){
        // 修改
        this.dialogType = 'update';
        this.activityInfo = JSON.parse(JSON.stringify(obj));
        this.activityTime = [obj.startTime,obj.endTime]
      }else{
        // 添加
        this.dialogType = 'create';
      }
      this.dialogVisible = true;
    },
    // 删除活动
    handDelete(id){
      let postData = {
        state: 2,
        id: id
      }
      this.$alert('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            updateActivity(postData).then((res)=>{
              if(res.data.code == 0){
                this.getList()
              }
              this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
              });
            })
          }
        }
      });
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
    // 关闭对话
    handleClose(){
      this.dialogVisible = false;
      this.activityTime = [];
      this.activityInfo = {
        appId: '',
        activityType: '',
        activityTypeName: '',
        activityName: '',
        state: 1,
        startTime: '',
        endTime: '',
        outDate: null
      }
    },
    // 确认添加修改
    affirmActivity(){
      if(this.activityTime.length !== 0){
        this.activityInfo.startTime = this.activityTime[0];
        this.activityInfo.endTime = this.activityTime[1];
      }
      if(this.dialogType == 'create'){
        addActivity(this.activityInfo).then((res)=>{
          this.notify(res)
        })
      }else{
        updateActivity(this.activityInfo).then((res)=>{
          this.notify(res)
        })
      }
    },
    // 弹窗提示
    notify(res){
      if(res.data.code == 0){
        this.handleClose();
        this.getList();
      }
      this.$notify({
        title: res.data.code == 0 ? "成功" : '失败',
        message: res.data.msg,
        type: res.data.code == 0 ? "success" : 'error',
        duration: 1500
      });
    },
  },
  filters: {
    filterAppName(appId){
      return getAppName(appId)
    },
    fitlerTime(value){
      return formartTime(new Date(value), 5);
    },
  }
};
</script>

<style>
</style>