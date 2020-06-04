<template>
  <!-- 公司 油站审核 -->
  <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-input v-model="gasUsername" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="gasAgentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <el-input v-model="gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加油站名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="gasType" placeholder="请选择油站品牌" clearable>
            <el-option
              v-for="item in gasTypeData"
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

      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        :span-method="objectSpanMethod"
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
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
        <el-table-column align="center" label="创建时间" width="100">
          <template scope="scope">
            <span>{{ scope.row.createTime | sendTimeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否上架">
          <template scope="scope">
            <el-tag>{{ scope.row.framesState | filterFramesState }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template scope="scope">
            <el-tag>{{ scope.row.auditStatus | filterAudit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300" v-if='role_examineGas'>
          <template scope="scope">
            <div v-if=" scope.row.auditStatus == '1001' ">
              <el-button type="success" size="mini" @click="adopt(scope.row.gasId,'1002')">通过</el-button>
              <el-button type="primary" size="mini" @click="audit(scope.row.gasId)">审核</el-button>
              <el-button type="danger" size="mini" @click="refuseDialog(scope.row.gasId)">拒绝</el-button>
            </div>
            <div v-else>
              <el-tag>{{ scope.row.auditStatus | filterAudit }}</el-tag>
            </div>
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
      <!-- 拒绝审核弹框 -->
      <el-dialog
        title="拒绝通过审核"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form label-width="100px">
          <el-form-item label="拒绝理由">
            <el-input type="textarea" v-model="auditRemark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="affirmRefuse('1003')">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { auditGasList,updateAuditStatus } from '@/api/franchisee/index';
import { formartTime,resolveUrlPath } from "@/util/util";
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      userId: '',
      type: '1002',   //公司油站审核
      gasUsername: '',     //加盟商ID
      gasAgentName: '',     //加盟商名称
      gasName: '',      //油站名称
      time: '',
      startTime: '',
      endTime: '',
      gasType: '',
      gasTypeData: [
        { label: '中石油', value: '1' },
        { label: '中石化', value: '2' },
        { label: '壳牌', value: '3' },
        { label: '其他', value: '4' }
      ],
      listLoading: false,
      total: 0,
      list: [],
      baseUrl:"http://qiniu.edawtech.com/",
      userId: '',
      auditRemark: '',          //拒绝理由
      dialogVisible: false,
      gasId: '',                //油站id
      role_examineGas: false
    }
  },
  computed: {
      ...mapGetters(['permissions'])
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.role_examineGas = this.permissions['role_examineGas'];
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
        startTime: this.startTime,
        gasUsername: this.gasUsername,
        gasType: this.gasType,
        gasName: this.gasName,
        gasAgentName: this.gasAgentName,
        // source: '1001',
        endTime: this.endTime
      }
      auditGasList(postData).then((res)=>{
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
       if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 12 || columnIndex === 10 || columnIndex === 11 || columnIndex === 9) {
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
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    // 通过审核
    adopt(id,status){
      this.$alert('是否通过审核？', '审核', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            let postData = {
              userId: this.userId,
              gasId: id,
              auditStatus: status
            }
            updateAuditStatus(postData).then(res => {
              console.log(res,'通过审核')
              if(res.data.code == 0){
                this.getList();
              }
              this.$notify({
                title: res.data.code == 0 ? "成功" : "失败",
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : "error",
                duration: 1500
              });
            });
          }
        }
      });
    },
    // 拒绝审核弹框
    refuseDialog(id){
      this.dialogVisible = true;
      this.gasId = id;
    },
    // 取消拒绝
    handleClose(){
      this.dialogVisible = false;
      this.auditRemark = '';
    },
    // 确认拒绝审核通过
    affirmRefuse(status){
      let postData = {
        userId: this.userId,
        gasId: this.gasId,
        auditStatus: status,
        auditRemark: this.auditRemark
      }
      updateAuditStatus(postData).then(res => {
        console.log(res,'拒绝审核')
        if(res.data.code == 0){
          this.getList();
          this.handleClose();
        }
        this.$notify({
          title: res.data.code == 0 ? "成功" : "失败",
          message: res.data.msg,
          type: res.data.code == 0 ? "success" : "error",
          duration: 1500
        });
      });
    },
    // 审核油站信息
    audit(id){
      this.$router.push({
        path: resolveUrlPath("/oilStation/auditInfo"),
        query: {
          id: id, 
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
        1003: '审核失败'
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