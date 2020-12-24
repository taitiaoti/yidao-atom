<template>
  <div class="app-container calendar-list-container">
    <div style="margin-bottom: 20px;">
      <!-- <el-input style="width:200px;" @change="saveAppId" v-model="searchObj.appId" placeholder="应用名称">
        <i slot="suffix" style="cursor:pointer;" class="el-input__icon el-icon-circle-close" v-show="searchObj.appId" @click="clearAppId"></i>
      </el-input> -->
      <el-input style="width:200px;" @change="saveCaller" v-model="searchObj.caller" placeholder="主叫号码">
        <i slot="suffix" style="cursor:pointer;" class="el-input__icon el-icon-circle-close" v-show="searchObj.caller" @click="clearCaller"></i>
      </el-input>
      <el-input style="width:200px;" @change="saveCallee" v-model="searchObj.callee" placeholder="被叫号码">
        <i slot="suffix" style="cursor:pointer;" class="el-input__icon el-icon-circle-close" v-show="searchObj.callee" @click="clearCallee"></i>
      </el-input>
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
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="应用名称">
        <template slot-scope="scope">
            <span>{{ scope.row.appId | filterAppName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主叫号码">
        <template slot-scope="scope">
          <span>{{scope.row.caller}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被叫号码">
        <template slot-scope="scope">
          <span>{{scope.row.callee}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="费率" width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.rate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通话时间段">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | filtersTime}}</span><br/>
          <span>{{scope.row.endTime | filtersTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通话时长">
        <template slot-scope="scope">
          <span>{{scope.row.callTime | filtersCallTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="话费金额 /（元）">
        <template slot-scope="scope">
          <span>{{scope.row.money | filterMoney}}</span>
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
  import {fetchList, fetchCallList} from "@/api/call/index"

  import {mapGetters, mapMutations} from "vuex"
  import { handleTip, formartTime, getAppName } from "@/util/util";

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
          endTime: null,
          caller: null,
          callee: null
        }
      }
    },
    created(){
      this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      this.appId = !!this.callRecordsSearch['appId'] ? this.callRecordsSearch['appId'] : this.appId;
      this.listQuery.limit = this.callRecordsSearch["limit"];
      this.listQuery.page = this.callRecordsSearch["page"];
      this.searchObj = this.callRecordsSearch;
      this.time.push(this.callRecordsSearch["startTime"]);
      this.time.push(this.callRecordsSearch["endTime"]);

      this.getList();
    },
    computed: {
      ...mapGetters(["callRecordsSearch"]),
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    filters: {
      // 过滤通话时间段
        filtersTime(time){
            return formartTime(new Date(time), 5);
        },
        // 过滤话费金额
        filterMoney(money){
          return money/100
        },
        filterAppName(appId){
          return getAppName(appId)
        },
        // 过滤通话时长
        filtersCallTime(value){
          // console.log(value)
          if(value < 60){
            return value + 's'
          }else{
            let m = parseInt(value/60);
            let s = value%60 == 0?'':value%60 + 's';
            return m + 'm' + s;
          }
        }
    },
    methods:{
      ...mapMutations({
        setPage: 'setCallRecordsPage',
        setLimit: 'setCallRecordsLimit',
        setAppId: 'setCallRecordsAppId',
        setStartTime: 'setCallRecordsStartTime',
        setEndTime: 'setCallRecordsEndTime',
        setCaller: 'setCallRecordsCaller',
        setCallee: 'setCallRecordsCallee',
      }),
      getList(){
        let postData = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          startTime: this.searchObj.startTime,
          endTime: this.searchObj.endTime,
          appId: this.appId,
          caller: this.searchObj.caller,
          callee: this.searchObj.callee,
        }
        this.listLoading = true;
        fetchCallList(postData).then(res => {
            console.log(res,'分页获取应用');
            this.list = res.data.records;
            this.total = res.data.total;
            this.listLoading = false;
        });
      },
      getDataByAppId(){
        this.setAppId(this.appId);
        this.getList();
      },
      search(){
        this.getList();
      },
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
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.setPage(val);
        this.getList()
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
      saveCaller(val){
        this.searchObj.caller = val;
        this.setCaller(val);
      },
      saveCallee(val){
        this.searchObj.callee = val;
        this.setCallee(val);
      },
      clearAppId(){
        this.searchObj.appId = "";
      },
      clearCaller(){
        this.searchObj.caller = "";
      },
      clearCallee(){
        this.searchObj.callee = "";
      }
    },
  };
</script>
