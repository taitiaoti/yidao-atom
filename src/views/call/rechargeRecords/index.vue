<template>
  <div class="app-container calendar-list-container">
    <div style="margin-bottom: 20px;">
      <!-- <el-input style="width:200px;" @change="saveAppId" v-model="searchObj.appId" placeholder="应用名称">
        <i slot="suffix" style="cursor:pointer;" class="el-input__icon el-icon-circle-close" v-show="searchObj.appId" @click="clearAppId"></i>
      </el-input> -->
      <!-- <div style="width:200px;display: inline-block;position:relative;">
        <el-select v-model="searchObj.appId"  placeholder="请选择应用名称">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <i slot="suffix" style="cursor:pointer;" class="el-input__icon el-icon-circle-close close-recharge" v-show="searchObj.appId"  @click="clearAppId"></i>
      </div> -->
      <el-date-picker
        style="width: 400px;"
        v-model="time"
        type="datetimerange"
        range-separator="至"
        @change="selectTime"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择APP" style="display: inline-block; width: auto; margin-left: 5px;">
          <el-option
          v-for="(item, index) in currentAppList"
          :key="index"
          :label="item.appName"
          :value="item.appId">
          <span style="float: left">{{ item.appName }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
          </el-option>
      </el-select>
      <el-button type="primary"  icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="用户Id">
        <template scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="应用名称">
        <template scope="scope">
            <span>{{ scope.row.appId | filterAppName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值金额  /（元）">
        <template scope="scope">
          <span>{{scope.row.rechargeMoney | filterMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值后的金额  /（元）">
        <template scope="scope">
          <span>{{scope.row.afterMoney | filterMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前金额  /（元）">
        <template scope="scope">
          <span>{{scope.row.currentMoney | filterMoney}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.page"
                        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchRechargeList} from "@/api/call/index"
  import { formartTime, getAppName } from "@/util/util";
  import { appList } from "@/util/data";
  import {mapGetters, mapMutations} from "vuex";

  export default {
    data(){
      return {
        appId: '',
        currentAppList: [],
        listQuery: {
          page: 1,
          limit: 10
        },
        listLoading: true,
        list: [],
        tableKey: 0,
        dialogStatus: "",
        formLabelWidth: '100px',
        id: '',
        total: null,
        time: [],
        searchObj: {
          appId: null,
          startTime: null,
          endTime: null
        },
        options: appList
      }
    },
    created(){
      this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      this.appId = !!this.rechargeRecordsSearch['appId'] ? this.rechargeRecordsSearch['appId'] : this.appId;
      this.listQuery.limit = this.rechargeRecordsSearch["limit"];
      this.listQuery.page = this.rechargeRecordsSearch["page"];
      this.searchObj = this.rechargeRecordsSearch;
      this.time.push(this.rechargeRecordsSearch["startTime"]);
      this.time.push(this.rechargeRecordsSearch["endTime"]);
      this.search();
    },
    computed: {
      ...mapGetters(["rechargeRecordsSearch"]),
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    filters: {
        filtersTime(time){
            return formartTime(new Date(time), 5);
        },
        filterMoney(money){
          return money/100
        },
        filterAppName(appId){
          return getAppName(appId)
        }
    },
    methods:{
      ...mapMutations({
        setPage: 'setRechargeRecordPage',
        setLimit: 'setRechargeRecordLimit',
        setAppId: 'setRechargeRecordAppId',
        setStartTime: 'setRechargeRecordStartTime',
        setEndTime: 'setRechargeRecordEndTime',
      }),
      // getList(){
      //   this.listLoading = true;
      //   fetchRechargeList(this.listQuery).then(res => {
      //       console.log(res,'分页获取充值记录');
      //       this.list = res.data.records;
      //       this.total = res.data.total;
      //       this.listLoading = false;
      //   });
      // },
      handleTip(statusText,msg){
        this.$notify({
          title: statusText,
          message: msg,
          type: "success",
          duration: 2000
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.setLimit(val);
        this.search()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.setPage(val);
        this.search();
      },
      search(){
        let postData = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          startTime: this.searchObj.startTime,
          endTime: this.searchObj.endTime,
          appId: this.appId,
        }
        this.listLoading = true;
        fetchRechargeList(postData).then(res => {
            console.log(res,'分页获取充值记录');
            this.list = res.data.records;
            this.total = res.data.total;
            this.listLoading = false;
        });
      },
      getDataByAppId(){
        this.setAppId(this.appId);
        this.search();
      },
      selectTime(res){
        if(res){
          this.searchObj.startTime = formartTime(res[0], 5);
          this.searchObj.endTime = formartTime(res[1], 5);
          this.setStartTime(formartTime(res[0], 5));
          this.setEndTime(formartTime(res[1], 5));
        }else {
          this.searchObj.startTime = "";
          this.searchObj.endTime = "";
        }
      },
      saveAppId(val){
        this.searchObj.appId = val;
        this.setAppId(val);
      },
      clearAppId(){
        this.searchObj.appId = "";
      }
    },
  };
</script>
<style>
  .close-recharge{
    position:absolute;right: 22px;top:0;
    color: #666;
  }
</style>

