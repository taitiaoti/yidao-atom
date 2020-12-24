<template>
  <div>
    <div>
      <el-select 
      v-model="searchObj.appId" 
      placeholder="请选择APP渠道" 
      style="display: inline-block; width: auto;margin-bottom:20px;"
      @change="getList">
        <el-option
          v-for="(item, index) in appIdList"
          :key="index"
          :label="item.appName"
          :value="item.appId">
          <span style="float: left">{{ item.appName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
        </el-option>
      </el-select>
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
        label="活动名称">
        <template slot-scope="scope">
            <span>{{scope.row.activityName}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="过期时间(小时)">
        <template slot-scope="scope">
            <span>{{scope.row.effectiveDuration}}</span>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="活动状态">
        <template slot-scope="scope">
            <el-tag type='success'>{{ scope.row.state | filterState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        align="center" 
        label="操作">
        <template slot-scope="scope">
            <el-button size='mini' :type=' scope.row.state == 1 ? "danger" : "success" ' @click="updateState(scope.row.id, scope.row.state)">{{ scope.row.state == 1 ? '下架' : '上架' }}</el-button>
            <el-button size='mini' type='primary' @click="addActivity(scope.row)">编辑</el-button>
            <el-button size='mini' type='danger' @click="handDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label='活动名称'>
          <el-input v-model="activityInfo.activityName" placeholder='请输入活动名称'></el-input>
        </el-form-item>
        <el-form-item label='过期时间'>
          <el-input v-model="activityInfo.effectiveDuration" placeholder='请输入可退团时长（小时）'></el-input>
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
import { activityList, addActivity, updateActivity } from '@/api/helpBuy'
import { formartTime, getAppName } from "@/util/util";
export default {
  data(){
    return {
      searchObj: {
        appId: ''
      },
      activityTypeData: [],
      list: [],
      listLoading: false,
      activityInfo: {
        appId: '',
        effectiveDuration: '',      //过期时间
        activityName: '',       //活动名称
        state: 1,
        id: ''
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
    this.searchObj.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
    this.getList();
  },
  methods: {
    // 数据列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.searchObj
      }
      activityList(postData).then((res)=>{
        console.log(res,'帮购活动列表')
        this.list = res.data.data;
        this.listLoading = false;
      })
    },
    // 添加活动
    addActivity(obj){
      this.activityInfo.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
      if(obj){
        // 修改
        this.dialogType = 'update';
        this.activityInfo = JSON.parse(JSON.stringify(obj));
      }else{
        // 添加
        this.dialogType = 'create';
      }
      this.dialogVisible = true;
    },
    // 上下架
    updateState(id,state){
      let postData = {
        id: id,
        state: state == 1 ? 2 : 1
      }
      updateActivity(postData).then((res)=>{
          this.notify(res)
        })
    },
    // 删除活动
    handDelete(id){
      let postData = {
        state: 3,
        id: id
      }
      this.$alert('确定要删除吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            updateActivity(postData).then((res)=>{
              this.notify(res)
            })
          }
        }
      });
    },
    // 关闭对话
    handleClose(){
      this.dialogVisible = false;
      this.activityInfo = {
        appId: '',
        activityName: '',
        state: 1,
        effectiveDuration: null,
        id: ''
      }
    },
    // 确认添加修改
    affirmActivity(){
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
    filterState(value){
      let text;
      if(value == 1){
        text = '上架'
      }else if(value == 2){
        text = '下架'
      }else if(value == 3){
        text = '删除'
      }
      return text;
    },
  }
};
</script>

<style>
</style>