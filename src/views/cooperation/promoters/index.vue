<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="searchObj.name" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入联系人" clearable></el-input>
        <el-input v-model="searchObj.phone" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入联系电话" clearable></el-input>
        <div class="s-time">
          <el-date-picker 
            v-model="time" 
            type="datetimerange" 
            range-separator="至" 
            start-placeholder="开始时间" 
            end-placeholder="结束时间"
            @change="selectTime">
          </el-date-picker>
        </div> 
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-download" :loading="loading" @click="handleExport">导出</el-button>
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
        <el-table-column align="center" label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所在地区">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
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
import { formartTime } from "@/util/util";
import { cityPromoters,exportCityPromoters } from '@/api/franchisee/index';
export default {
    data(){
        return {
            searchObj: {
                name: '',
                phone: ''
            },
            listQuery: {
                page: 1,
                limit: 10
            },
            list: [],
            time: [],
            listLoading: false,
            startTime: '',
            endTime: '',
            total: 0,
            loading: false
        }
    },
    created(){
        this.getList()
    },
    methods: {
        // 获取数据
        getList(){
            this.listLoading = true;
            let postData = {
                ...this.listQuery,
                ...this.searchObj,
                startTime: this.startTime,
                endTime: this.endTime
            }
            cityPromoters(postData).then((res)=>{
                console.log(res,'推广人列表')
                this.list = res.data.records;
                this.total = res.data.total;
                this.listLoading = false;
            })
        },
        // 导出
        handleExport(){
          this.loading = true;
          let postData = {
              ...this.listQuery,
              ...this.searchObj,
              startTime: this.startTime,
              endTime: this.endTime
          }
          exportCityPromoters(postData).then((res)=>{
              // console.log(res,'导出')
              this.loading = false;
              if(res.status == 200){
                  window.location.href = res.request.responseURL;
              }
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
    },
    filters: {
        // 时间戳转日期
        sendTimeFilter(time){
            if(time){
                return formartTime(new Date(time), 5);
            }
        },
    }
}
</script>

<style>
  .s-time{
    width: 400px;
    margin-right:10px;
    display: inline-block;
  }
</style>