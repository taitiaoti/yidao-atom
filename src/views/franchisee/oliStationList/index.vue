<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <el-input v-model="gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加油站名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="oilNo" placeholder="请选择油号" clearable>
            <el-option
              v-for="item in oilNumerData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        :span-method="objectSpanMethod"
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
        <el-table-column align="center" label="加油站名称">
          <template scope="scope">
            <span>{{scope.row.gasName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油站图片" width="120">
          <template scope="scope">
            <img :src="scope.row.gasLogoSmall.indexOf('http')==0?scope.row.gasLogoSmall:(baseUrl+scope.row.gasLogoSmall)" width="100" height="100"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="油号">
          <template scope="scope">
            <span>{{scope.row.oilNo ? scope.row.oilNo + '#' : scope.row.oilNo }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="国标价（元）">
          <template scope="scope">
            <span>{{scope.row.priceOfficial}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="枪价（元）">
          <template scope="scope">
            <span>{{scope.row.priceGun}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="来源">
          <template scope="scope">
            <el-tag>{{scope.row.source | filterSource }}</el-tag>
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
import { queryGasInfoList } from '@/api/franchisee/index';
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
      gasName: '',            //油站名称
      oilNo: '',          //油号
      listLoading: false,
      total: 0,
      baseUrl:"http://qiniu.edawtech.com/",
      oilNumerData:[
        {label:'92#',value: '92#'},
        {label:'95#',value: '95#'},
        {label:'98#',value: '98#'},
        {label:'0#',value: '0#'},
        // {label:'全部',value: ''}
      ],
      list: [],
      rowAndColumn: []
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.getList();
  },
  methods: {
    // 油站列表
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        username: this.username,
        agentName: this.agentName,
        gasName: this.gasName,
        oilNo: this.oilNo
      }
      queryGasInfoList(postData).then((res)=>{
        console.log(res,'油站列表')
        this.list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
        this.getListDataForRowAndColumn(res.data.records);
      })
    },
    getListDataForRowAndColumn(data){
      let self = this;
      self.rowAndColumn = [];
      self.rowRoomColumn = [];
       for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          self.rowAndColumn.push(1);
          self.pos = 0;
           self.rowRoomColumn.push(1);
          self.posT = 0;
        } else {
          if (data[i].id === data[i - 1].id) {
            // 如果id相等就累加，并且push 0
            self.rowAndColumn[self.pos] += 1
            self.rowAndColumn.push(0)
          } else {
            // 不相等push 1
            self.rowAndColumn.push(1)
            self.pos = i;
            self.rowRoomColumn.push(1)
            self.posT = i
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
       let self = this
       if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 8) {
         if (self.rowAndColumn[rowIndex]) {
           let roomNum = self.rowAndColumn[rowIndex];
           return {
               rowspan: roomNum,
               colspan: roomNum > 0 ? 1 : 0
             }                                                   
         }
         return {
            rowspan: 0,
            colspan: 0
          }  
       }
     },
    // 搜索
    search(){
      this.getList();
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
  },
  filters: {
    filterSource(val){
      let data = {
        1001: '嘟嘟',
        1002: '团油'
      }
      if(val){
        return data[val]
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