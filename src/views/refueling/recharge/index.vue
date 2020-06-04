<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
        <el-table-column align="center" label="总金额（元）">
          <template scope="scope">
            <span>{{scope.row.totalAmount | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已使用金额（元）">
          <template scope="scope">
            <span>{{scope.row.usedAmount | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油余额（元）">
          <template scope="scope">
            <span>{{scope.row.gasAmount | filterFixed}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" v-if="role_Recharge">
          <template scope="scope">
            <el-button type="primary" size="small" @click="recharge(scope.row)">充值</el-button>
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
      <!-- 充值dislog -->
      <el-dialog
        title="加油余额充值"
        :visible.sync="dialogVisible"
        width="25%"
        :before-close="handleClose">
        <el-form :model="form" label-width="140px" :rules="rules" ref="form">
            <el-form-item label="加盟商名称：">
                <el-input v-model="form.agentName" class="el_input" disabled></el-input>
            </el-form-item>
            <el-form-item label="充值金额（元）：" prop="rechargeAmount">
                <el-input v-model.number="form.rechargeAmount" class="el_input"></el-input>
            </el-form-item>
            <el-form-item label="银行转账截图：">
                <el-upload
                 :limit="1"
                 action="/shop/web/product/uploadMain" 
                 :on-success="uploadSuccess"
                 :file-list="fileList"
                 list-type="picture"
                 :on-preview="handlePreview" 
                 :on-remove="handleRemove">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog_footer">
          <el-button @click="handleClose()" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="affirmRecharge()">充 值</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { formartTime } from "@/util/util";
import { getStore } from '@/util/store';
import { mapGetters } from 'vuex';
import { queryRechargeManagerList,rechargeBy,tGasStationCooperation } from '@/api/franchisee/index';
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        agentName: '',           //加盟商名称
        rechargeAmount: '',          //充值金额
        img: '',      //转账截图
      },
      userId: '',
      username: '',       //加盟商id
      agentName: '',     //加盟商名字
      listLoading: false,
      dialogVisible: false,   //充值弹框
      baseUrl: "http://qiniu.edawtech.com/",
      fileList: [],
      total: 0,
      list: [],
      rechargeInfo: '',           //充值账号信息
      rules: {
          rechargeAmount: [
              { required: true, message: '请输入充值金额', trigger: 'blur' },
              { type: 'number', message: '必须为数字值', trigger: 'blur' }
          ]
      },
      role_Recharge: false
    }
  },
  computed: {
      ...mapGetters(['permissions'])
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.role_Recharge = this.permissions['role_Recharge'];
    this.getList();
  },
  methods: {
    getList(){
      this.listLoading = true;
      let postData = {
        userId: this.userId,
        username: this.username,
        agentName: this.agentName,
        ...this.listQuery
      }
      console.log(postData,'请求参数')
      queryRechargeManagerList(postData).then((res)=>{
        console.log(res,'充值管理')
        this.list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      })
      let obj = {
        page: 1,
        limie: 10
      }
      // tGasStationCooperation(obj).then((i)=>{
      //   console.log(i,'iiiii')
      // })
    },
    handlePreview(){},
    handleRemove(){},
    // 搜索
    search(){
      this.getList()
    },
    //页码改变事件
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    // 操作 充值
    recharge(obj){
      this.form.agentName = obj.agentName;
      this.rechargeInfo = obj;
      this.dialogVisible = true;
    },
    // 上传银行转账截图
    uploadSuccess(res, file){
      this.form.img = res.imagePath;
      // this.fileList = [{ name: this.baseUrl + res.imagePath, url: this.baseUrl + res.imagePath }];
    },
    // 确认充值
    affirmRecharge(){
      let postData = {
        userId: this.userId,
        rechargeUserId: this.rechargeInfo.userId,
        userName: this.rechargeInfo.username,
        ...this.form
      }
      rechargeBy(postData).then((res)=>{
        console.log(res,'充值')
        this.$notify({
          title: res.data.code == 0 ? '成功' : '失败',
          message: res.data.msg,
          type:  res.data.code == 0 ? 'success' : 'error',
          duration: 2000
        });
        if(res.data.code == 0){
          this.getList();
          this.dialogVisible = false;
        }
      })
    },
    // 取消充值
    handleClose(){
      this.dialogVisible = false;
      this.form = {
        agentName: '',           //加盟商名称
        rechargeAmount: '',          //充值金额
        img: '',      //转账截图
      }
    }
  },
  filters: {
    // 保留两位
    filterFixed(val){
      if(val){
        return Number(val).toFixed(2)
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
  .el-upload-list__item {
    transition: none !important;
  }
</style>