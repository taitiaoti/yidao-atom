<template>
  <!-- 公司 油站管理 -->
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="searchObj.gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加油站名称" clearable></el-input>
      <el-input v-model="searchObj.gasUsername" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
      <el-input v-model="searchObj.username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入合伙人ID" clearable></el-input>
      <el-input v-model="searchObj.deviceId" style="width:250px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入打印机终端编号" clearable></el-input>
      <div class="s-category">
        <el-select v-model="searchObj.source" placeholder="请选择油站来源" clearable>
          <el-option
            v-for="item in sourceData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
        <el-select v-model="searchObj.preDeposit" placeholder="是否预存款" clearable>
          <el-option
            v-for="item in preStorageData"
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
        <el-select v-model="searchObj.framesState" placeholder="请选择是否上下架" clearable>
          <el-option
            v-for="item in framesStateData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addOilStation" v-if='role_companyGasAdd'>新增</el-button>
    </div>
    <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        :span-method="objectSpanMethod"
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="序号">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
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
        <el-table-column align="center" label="加油站图片" width='120'>
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
        <el-table-column align="center" label="成本价（元）">
          <template scope="scope">
            <span>{{scope.row.priceGas}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="嘟嘟价（元）">
          <template scope="scope">
            <span>{{scope.row.priceYfq}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否预存款">
          <template scope="scope">
            <el-tag>{{ scope.row.preDeposit | filterPreDeposit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="油站来源">
          <template scope="scope">
            <el-tag>{{ scope.row.source | filterSource }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商ID(加油站)">
          <template scope="scope">
            <span>{{scope.row.gasUsername}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合伙人ID(投资人)">
          <template scope="scope">
            <span>{{scope.row.parUsername}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打印机终端编号">
          <template scope="scope">
            <span>{{scope.row.deviceId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否上架">
          <template scope="scope">
            <el-tag>{{ scope.row.framesState | filterFramesState }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template scope="scope">
            <el-button size="mini" type="primary"
              v-if="role_companyGasSale"
              @click="handleIsOnSale(scope.row,scope.row.framesState == '1001' ? '1002' : '1001')">{{ scope.row.framesState == '1001' ? '下架' : '上架' }}
            </el-button> 
            <el-button size="mini" type="success"
              v-if="role_companyGasUpdate"
              @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger"
              v-if="role_companyGasDelete"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
    </el-table>

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
import { mapGetters } from 'vuex';
import { queryOilStationInfoList,framesState,deleteGasStation } from '@/api/franchisee/index';
import { resolveUrlPath } from "@/util/util";
export default {
  data(){
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      rowAndColumn: [],
      baseUrl:"http://qiniu.edawtech.com/",
      total: 0,
      userId: '',
      type: '1001',   //公司油站管理
      searchObj: {
        source: '',           //油站来源
        gasName: '',          //油站名称
        gasUsername: '',        //加盟商ID
        username: '',           //合伙人ID
        preDeposit: '',       //是否预存款
        deviceId: '',         //打印机编号
        oilNo: '',           //油号
        gasType: '',          //油站品牌
      },
      listLoading: false,
      list: [],
      sourceData: [
        { label: '嘟嘟', value: '1001'},
        { label: '团油', value: '1002'}
      ],
      gasTypeData: [
        { label: '中石油', value: '1' },
        { label: '中石化', value: '2' },
        { label: '壳牌', value: '3' },
        { label: '其他', value: '4' }
      ],
      preStorageData: [
        { label: '是', value: '1002'},
        { label: '否', value: '1001'}
      ],
      oilNumerData:[
        {label:'92#',value: '92#'},
        {label:'95#',value: '95#'},
        {label:'98#',value: '98#'},
        {label:'0#',value: '0#'}
      ],
      framesStateData: [
        { label: '上架', value: '1001'},
        { label: '下架', value: '1002'}
      ],
      role_companyGasSale: false,     //上下架权限按钮
      role_companyGasAdd: false,     //新增 
      role_companyGasUpdate: false,     //编辑
      role_companyGasDelete: false,     //删除
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.role_companyGasAdd = this.permissions['role_companyGasAdd'];
    this.role_companyGasUpdate = this.permissions['role_companyGasUpdate'];
    this.role_companyGasDelete = this.permissions['role_companyGasDelete'];
    this.role_companyGasSale = this.permissions['role_companyGasSale'];
    this.getList();
  },
  computed: {
      ...mapGetters(['permissions'])
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
        ...this.searchObj,
        type: this.type
      }
      queryOilStationInfoList(postData).then((res)=>{
        console.log(res,'油站列表')
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
       if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 ||  columnIndex === 9 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14 || columnIndex === 15) {
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
    //页码改变事件
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    // 上下架操作
    handleIsOnSale(row,status){
      let text = status == '1002' ? '下架' : '上架';
      let postData = {
        userId: this.userId,
        gasId: row.gasId,
        source: row.source,
        framesState: status
      }
      this.$alert('确定要' + text + '吗？', '操作', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            framesState(postData).then((res)=>{
              console.log(res,'上下架')
              if(res.data.code == 0){
                this.getList();
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
      console.log(status)
    },
    // 新增
    addOilStation(){
      this.$router.push({
        path: resolveUrlPath("/oilStation/add")
      });
    },
    // 编辑
    handleUpdate(row){
      this.$router.push({
        path: resolveUrlPath("/oilStation/add"),
        query: {
          gasId: row.gasId,
          id: row.id,
          framesState: row.framesState,
          source: row.source
        }
      });
    },
    // 删除
    handleDelete(obj){
      console.log(obj)
      let postData = {
        userId: this.userId,
        gasId: obj.gasId,
        id: obj.id
      }
      this.$alert('确定要删除该油站吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            deleteGasStation(postData).then((res)=>{
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
  filters: {
    // 预存款
    filterPreDeposit(val){
      let data = {
        1001: '无',
        1002: '有'
      }
      if(val){
        return data[val]
      }
    },
    // 来源
    filterSource(val){
      let data = {
        1001: '嘟嘟',
        1002: '团油'
      }
      if(val){
        return data[val]
      }
    },
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
    }
  }
}
</script>

<style lang='scss' scoped>
  .s-category {
    width: 200px;
    margin-right:10px;
    margin-bottom: 10px;
    display: inline-block;
  }
</style>