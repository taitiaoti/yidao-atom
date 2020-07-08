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
          <el-select v-model="lave" placeholder="请选择工作状态" clearable>
            <el-option
              v-for="item in workStatusArr"
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
        <el-button type="primary" icon="el-icon-plus" @click="addCity">添加意向工作城市</el-button>
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
        <el-table-column align="center" label="工作状态">
          <template scope="scope">
            <el-tag>{{ scope.row.lave | filterLave }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="100">
          <template scope="scope">
            <span>{{scope.row.ctime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核通过时间">
          <template scope="scope">
            <span>{{scope.row.auditTime | sendTimeFilter}}</span>
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
      <!-- 意向工作城市弹框 -->
      <el-dialog
        title="添加意向工作城市"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox v-for="item in cities" :label="item" :key="item.id">{{ item.cityName }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="affirmAddCitys">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/riderManagement/index'
import { getCityList, addCitys } from '@/api/riderManagement/index'
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
      dialogVisible: false,
      appId: '',
      currentAppList: [],     //appId列表
      uid: '',       //uid
      phone: '',     //手机号
      name: '',     //姓名
      userPhone: '',    //联系电话
      time: '',
      startTime: '',
      endTime: '',
      lave: '',         //上班状态
      status: 'y',      //审核状态默认已通过
      checkedCities: [],      //选中城市
      backCitys: [],          //备份选择城市
      cities: [],             //所有的城市列表
      listLoading: false,
      total: 0,
      workStatusArr:[
        {label:'上班中',value: 'y'},
        {label:'休息中',value: 'n'}
      ],
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
      this.getCitys();
  },
  methods: {
    // 获取展示列表
    getList(){
      let postData = {
        startTime: this.startTime,
        endTime: this.endTime,
        appId: this.appId,
        ...this.listQuery,
        userPhone: this.userPhone,
        phone: this.phone,
        name: this.name,
        uid: this.uid,
        lave: this.lave,
        status: this.status
      }
      fetchList(postData).then(res => {
          console.log(res, '骑手列表')
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false 
      })
    },
    // 获取所有城市列表
    getCitys(){
      this.listLoading = true;
      getCityList().then((res)=>{
        console.log(res,'城市列表')
        this.checkedCities = [];
        this.backCitys = [];
        let citys = res.data.data.cities;
        this.cities = citys;
        citys.forEach((item)=>{
          if(item.status == 'y'){
            this.checkedCities.push(item);
            this.backCitys.push(item);
          }
        })
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
    // 操作 取消提现
    cancel(){
      
    },
    // 添加意向工作城市
    addCity(){
      this.dialogVisible = true;
    },
    // 确认添加城市
    affirmAddCitys(){
      let obj;
      let citiesRiders = [];
      if(this.checkedCities.length !== 0){
        this.checkedCities.forEach((item)=>{
          obj = {
            appId: this.appId,
            cityCode: item.cityCode,
            cityName: item.cityName
          }
          citiesRiders.push(obj)
        })
      }
      let postData = {
        citiesRiders: citiesRiders
      }
      console.log(citiesRiders,'选择的城市')
      addCitys(postData).then((res)=>{
        console.log(res,'添加')
        if(res.data.code == 0){
          this.dialogVisible = false;
          this.getCitys();
        }
        this.$notify({
          title: res.data.code == 0 ? '成功' : '失败',
          message: res.data.msg,
          type: res.data.code == 0 ? "success" : "error",
          duration: 2000
        });
      })
    },
    // 关闭城市弹框
    handleClose(){
      this.dialogVisible = false;
      this.checkedCities = this.backCitys;
      console.log('关闭')
    }
  },
  filters: {
    // appId
    filterAppName(appId){
        return getAppName(appId)
    },
    // 上班状态
    filterLave(val){
      let data = {
        'y': '上班中',
        'n': '休息中'
      }
      if(val){
        return data[val]
      }
    },
    // 时间戳
    sendTimeFilter(time){
        if(time){
            return formartTime(new Date(time), 5);
        }
    },
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
    display: inline-block;
  }
  .el-checkbox{
    display: inline-block;
  }
</style>