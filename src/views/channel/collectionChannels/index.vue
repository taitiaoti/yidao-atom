<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="searchInfo.payType" style="width: 180px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入渠道ID" clearable></el-input>
      <el-input v-model="searchInfo.payName" style="width: 180px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入渠道名称" clearable></el-input>
      <el-button type="success" icon="el-icon-plus" @click="createChannel('')">添加渠道</el-button>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!-- 列表 -->
    <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="渠道ID">
          <template slot-scope="scope">
            <span>{{scope.row.payType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="渠道名称">
          <template slot-scope="scope">
            <span>{{scope.row.payName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | fitlerTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改时间" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.updateTime ? scope.row.updateTime : scope.row.createTime | fitlerTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size='mini' type='primary' @click="createChannel(scope.row)">编辑</el-button>
            <el-button size='mini' type='danger' @click="handDelete(scope.row.id)">删除</el-button>
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
        <!-- 添加编辑渠道对话框 -->
        <el-dialog
          :title="channelDialogStatus == 'create' ? '添加渠道' : '编辑渠道' "
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form label-width="80px" :model="channelInfo" :rules="rules" ref="from" >
            <el-form-item label="渠道 I D" prop='payType'>
              <el-input v-model="channelInfo.payType" :disabled='payTypeDisabled'></el-input>
            </el-form-item>
            <el-form-item label="渠道名称" prop='payName'>
              <el-input v-model="channelInfo.payName"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="affirmChannelInfo">确 定</el-button>
          </span>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import { queryPaymentPage,addPayChannel,putPayChannel,deletePayChannel } from "@/api/franchisee/channel";
import { formartTime } from "@/util/util";
export default {
  data(){
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      searchInfo: {
        payType: '',
        payName: ''
      },
      // 渠道信息
      channelInfo: {
        payType: '',
        payName: '',
        id: ''
      },
      list: [],
      listLoading: false,
      total: 0,
      channelDialogStatus: 'create',
      dialogVisible: false,
      rules: {
        payType: [
          { required: true, message: '请输入渠道ID', trigger: 'blur' }
        ],
        payName: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' }
        ],
      },
      payTypeDisabled: false
    }
  },
  created(){
    this.getList();
  },
  methods: {
    // 获取数据
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        ...this.searchInfo
      }
      queryPaymentPage(postData).then((res)=>{
        this.total = res.data.total;
        this.list = res.data.records;
        this.listLoading = false;
        console.log(res,'渠道列表')
      })
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
    },
    // 添加编辑渠道
    createChannel(obj){
      if(obj){
        // 编辑
        this.channelDialogStatus = 'update';
        this.channelInfo.payName = obj.payName;
        this.channelInfo.payType = obj.payType;
        this.payTypeDisabled = true;
        this.channelInfo.id = obj.id;
      }else{
        // 添加
        this.channelDialogStatus = 'create';
        this.payTypeDisabled = false;
      }
      this.dialogVisible = true;
    },
    // 确定编辑新增
    affirmChannelInfo(){
       this.$refs['from'].validate((valid) => {
         if(valid){
           let postData = this.channelInfo;
          if(this.channelDialogStatus == 'create'){
            // 新增
            addPayChannel(postData).then((res)=>{
              this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
              });
              if(res.data.code == 0){
                this.handleClose();
                this.getList()
              }
            })
          }else{
            // 编辑
            putPayChannel(postData).then((res)=>{
             this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
              });
              if(res.data.code == 0){
                this.handleClose();
                this.getList()
              }
            })
          }
         }
       })
    },
    // 删除渠道
    handDelete(id){
      this.$alert('确定要删除该渠道吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            deletePayChannel(id).then((res)=>{
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
          }else{
            this.$message({
              type: 'info',   
              message: '取消操作'
            });
          }
        }
      });
    },
    // 关闭弹框
    handleClose(){
      this.dialogVisible = false;
      this.channelInfo.payType = '';
      this.channelInfo.payName = '';
      this.channelInfo.id = '';
      this.$refs['from'].clearValidate();
    }
  },
  filters: {
    fitlerTime(value){
        return formartTime(new Date(value), 5);
    },
  }
}
</script>

<style>

</style>