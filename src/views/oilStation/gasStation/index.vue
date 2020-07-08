<template>
  <!-- 加油站 油站管理 -->
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-input v-model="searchObj.gasUsername" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="searchObj.gasAgentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <el-input v-model="searchObj.gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加油站名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="searchObj.gasType" placeholder="请选择油站品牌" clearable>
            <el-option
              v-for="item in gasTypeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="searchObj.oilNo" placeholder="请选择油号" clearable>
            <el-option
              v-for="item in oilNumerData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="searchObj.framesState" placeholder="请选择上架状态" clearable>
            <el-option
              v-for="item in framesData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="searchObj.auditStatus" placeholder="请选择审核状态" clearable>
            <el-option
              v-for="item in auditData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addOilStation()" v-if="role_gasStationAdd">新增</el-button>
      </div>

      <el-table
        :data="list"
        border
        v-loading="listLoading"
        :span-method="objectSpanMethod"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="序号">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商ID">
          <template scope="scope">
            <span>{{scope.row.gasUsername}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商名称">
          <template scope="scope">
            <span>{{scope.row.gasAgentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油站名称">
          <template scope="scope">
            <span>{{scope.row.gasName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油站品牌">
          <template scope="scope">
            <span>{{ scope.row.gasType | filterGasType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油站图片" width="120">
          <template scope="scope">
            <img :src="scope.row.gasLogoSmall.indexOf('http')==0?scope.row.gasLogoSmall:(baseUrl+scope.row.gasLogoSmall)" height="100" width="100"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="油号">
          <template scope="scope">
            <span>{{scope.row.oilNo ? scope.row.oilNo + '#' : ''}}</span>
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
        <el-table-column align="center" label="优惠后金额（元）">
          <template scope="scope">
            <span>{{scope.row.priceGas}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上架状态">
          <template scope="scope">
            <el-tag>{{ scope.row.framesState | filterFramesState }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template scope="scope">
            <el-tag>{{ scope.row.auditStatus | filterAudit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template scope="scope">
            <span>{{scope.row.auditRemark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width='100'>
          <template scope="scope">
            <span>{{scope.row.createTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" width='100'>
          <template scope="scope">
            <span>{{scope.row.updateTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-if="role_gasStationUpdate">编辑</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.auditStatus == '1001' &&  role_gasStationDelete" @click="handleDelete(scope.row)">删除</el-button>
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
import { getStore } from '@/util/store';
import { queryFranchiseeGasList,deleteFranchiseeGas } from '@/api/franchisee/index';
import { formartTime,resolveUrlPath } from "@/util/util";
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      userId: '',
      searchObj: {
        gasUsername: '',       //加盟商ID
        gasAgentName: '',       //加盟商名称
        gasName: '',       //加油站名称
        oilNo: '',       //油号
        framesState: '',       //上架状态
        auditStatus: '',       //审核状态
        gasType: '',            //油站品牌
      },
      oilNumerData:[
        {label:'92#',value: '92#'},
        {label:'95#',value: '95#'},
        {label:'98#',value: '98#'},
        {label:'0#',value: '0#'}
      ],
      gasTypeData: [
        { label: '中石油', value: '1' },
        { label: '中石化', value: '2' },
        { label: '壳牌', value: '3' },
        { label: '其他', value: '4' }
      ],
      auditData: [
        {label:'待审核',value: '1001'},
        {label:'已审核',value: '1002'},
        {label:'已拒绝',value: '1003'}
      ],
      framesData: [
        {label:'上架',value: '1001'},
        {label:'下架',value: '1002'}
      ],
      time: '',
      startTime: '',
      endTime: '',
      listLoading: false,
      total: 0,
      list: [],
      rowAndColumn: [],
      baseUrl:"http://qiniu.edawtech.com/",
      userId: '',
      role_gasStationAdd: false,
      role_gasStationUpdate: false,
      role_gasStationDelete: false,
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.role_gasStationAdd = this.permissions['role_gasStationAdd'];
    this.role_gasStationUpdate = this.permissions['role_gasStationUpdate'];
    this.role_gasStationDelete = this.permissions['role_gasStationDelete'];
    this.getList();
  },
  methods: {
    // 搜索
    search(){
      this.getList();
    },
    // 获取展示数据
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        userId: this.userId,
        ...this.searchObj
      }
      queryFranchiseeGasList(postData).then((res)=>{
        console.log(res,'加油站--油站列表')
        this.list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
        this.getListDataForRowAndColumn(res.data.records)
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
       if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14 || columnIndex === 15) {
         if (self.rowAndColumn[rowIndex]) {
           let rowNum = self.rowAndColumn[rowIndex];
           return {
               rowspan: rowNum,
               colspan: rowNum > 0 ? 1 : 0
             }                                                   
         }
         return {
             rowspan: 0,
             colspan: 0
           }
       }
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
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    // 新增
    addOilStation(){
      this.$router.push({
        path: resolveUrlPath("/oilStation/addGasStation")
      });
    },
    // 编辑
    handleUpdate(row){
      this.$router.push({
        path: resolveUrlPath("/oilStation/addGasStation"),
        query: {
          gasId: row.gasId,
          id: row.id,
          framesState: row.framesState,
          auditStatus: row.auditStatus,
          source: row.source
        }
      });
    },
    // 删除
    handleDelete(obj){
      let postData = {
        userId: this.userId,
        gasId: obj.gasId,
        id: obj.id
      }
      this.$alert('确定要删除该油站吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            deleteFranchiseeGas(postData).then((res)=>{
              console.log(res,'删除')
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
    }
  },
  // 过滤器
  filters: {
    // 是否上架
    filterFramesState(val){
      let data = {
        1001: '上架',
        1002: '下架'
      }
      if(val){
        return data[val]
      }
    },
    // 审核状态
    filterAudit(val){
      let data = {
        1001: '待审核',
        1002: '已审核',
        1003: '已拒绝'
      }
      if(val){
        return data[val]
      }
    },
    // 油站品牌
    filterGasType(val){
      let data = {
        '1': '中石油',
        '2': '中石化',
        '3': '壳牌',
        '4': '其他'
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
    }
  }
}
</script>

<style>
  .s-category {
    width: 200px;
    margin-right:10px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .s-time{
    width: 400px;
    margin-right:10px;
    display: inline-block;
  }
</style>