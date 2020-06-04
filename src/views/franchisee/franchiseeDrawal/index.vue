<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input v-model="username" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="agentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <div class="s-category">
          <el-select v-model="roleName" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in rouleArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="s-category">
          <el-select v-model="examineState" placeholder="请选择提现状态" clearable>
            <el-option
              v-for="item in drawalStatusArr"
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
        <el-table-column align="center" label="角色">
          <template scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现金额（元）">
          <template scope="scope">
            <span>{{ Number(scope.row.caseAmount).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账户名">
          <template scope="scope">
            <span>{{scope.row.bankName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行开户行">
          <template scope="scope">
            <span>{{scope.row.bankDeposit}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行账号">
          <template scope="scope">
            <span>{{scope.row.bankCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间" width="100">
          <template scope="scope">
            <span>{{scope.row.createTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提现状态">
          <template scope="scope">
            <el-tag>{{ scope.row.examineState | filterStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" width="100">
          <template scope="scope">
            <span>{{scope.row.updateTime | sendTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="转账信息" width="120">
          <template scope="scope">
            <img  v-if="scope.row.cashwithImg" :src="scope.row.cashwithImg.indexOf('http')==0?scope.row.cashwithImg:(baseUrl+scope.row.cashwithImg)" height="100" width="100" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="补充信息">
          <template scope="scope">
            <span>{{scope.row.supplement}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220px" v-if='role_drawal'>
          <template scope="scope">
            <el-button v-show="scope.row.examineState == '1001'" type="primary" size="mini" class="btn" @click="updataStatus(scope.row.caseNo,'1002')">通过审核</el-button>
            <el-button v-show="scope.row.examineState == '1001'" type="warning" size="mini" class="btn" @click="updataStatus(scope.row.caseNo,'1004')">驳回申请</el-button>
            <el-button v-show="scope.row.examineState == '1002'" type="danger" size="mini" class="btn" @click="updataStatus(scope.row.caseNo,'1001')">取消审核</el-button>
            <el-button v-show="scope.row.examineState == '1002'" type="success" size="mini" class="btn" @click="updataStatus(scope.row,'1003')">确认结算</el-button>
            <el-tag v-show="scope.row.examineState == '1004'">已驳回</el-tag>
            <el-tag v-show="scope.row.examineState == '1003'">提现成功</el-tag>
            <el-tag v-show="scope.row.examineState == '1005'">已取消</el-tag>
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
      <!-- 确认结算dislog -->
      <el-dialog
        title="确认结算"
        :visible.sync="dialogVisible"
        width="25%"
        :before-close="handleClose">
        <div>
            <span class="balanceTitle">加盟商ID：</span>
            <span>{{ cashWithInfo.username }}</span>
        </div>
        <div>
            <span class="balanceTitle">加盟商名称：</span>
            <span>{{ cashWithInfo.agentName }}</span>
        </div>
        <div>
            <span class="balanceTitle">提现金额（元）：</span>
            <span>{{ cashWithInfo.caseAmount }}</span>
        </div>
        <div>
            <span class="balanceTitle">申请时间：</span>
            <span>{{ cashWithInfo.createTime | sendTimeFilter }}</span>
        </div>
        <div>
            <span class="balanceTitle">申请备注：</span>
            <span>{{ cashWithInfo.remark }}</span>
        </div>
        <div>
            <span class="balanceTitle">审核时间：</span>
            <span>{{ cashWithInfo.updateTime | sendTimeFilter }}</span>
        </div>
        <el-form :model="form" label-width="140px">
            <el-form-item label="银行转账截图：">
                <el-upload
                 :limit="1"
                 action="/shop/web/product/uploadMain" 
                 :on-success="uploadSuccess"
                 :file-list="fileList"
                 list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="补充信息：">
                <el-input v-model="form.supplement" style="width: 80%;" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog_footer">
          <el-button size="small" @click="handleClose()">取 消</el-button>
          <el-button type="primary" size="small" @click="affirmCashWith()">确 认</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { queryCashwithList, updataCashwith } from '@/api/franchisee/index';
import { formartTime } from "@/util/util";
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
      //页码和条数
      listQuery: {
        page: 1,
        limit: 10
      },
      userId: '',         //账号id
      username: '',       //加盟商id
      agentName: '',     //加盟商名字
      // 确认结算的参数
      cashWithInfo: {},
      dialogVisible: false,
      time: '',
      startTime: '',
      endTime: '',
      examineState: '',         //提现状态
      roleName: '',                //角色
      listLoading: false,
      total: 0,
      fileList: [],
      baseUrl:"http://qiniu.edawtech.com/",
      drawalStatusArr:[
        {label:'未处理',value: '1001'},
        {label:'处理中',value: '1002'},
        {label:'提现成功',value: '1003'},
        {label:'已驳回',value: '1004'},
        {label:'已取消',value: '1005'},
        // {label:'全部',value: ''}
      ],
      rouleArr: [
        { label: '加油站',value: '加油站公司'},
        { label: '合伙人',value: '合伙人'},
        // { label: '全部',value: ''}
      ],
      list: [],
      form: {
        cashwithImg: '',        //转账截图
        supplement: ''          //补充信息
      },
      role_drawal: false,
    }
  },
  created(){
    let userInfo = getStore({name: 'userInfo'});
    this.userId = userInfo.userId;
    this.getList();
    this.role_drawal = this.permissions['role_drawal'];
  },
  computed: {
      ...mapGetters(['permissions'])
  },
  methods: {
     // 获取提现列表
    getList(){
      this.listLoading = true;
      let postData = {
        userId: this.userId,
        username: this.username,
        agentName: this.agentName,
        roleName: this.roleName,
        examineState: this.examineState,
        startTime: this.startTime,
        endTime: this.endTime
      }
      console.log(postData,'提现列表参数')
      queryCashwithList(postData).then((res)=>{
        console.log(res,'提现列表')
        this.list = res.data.records;
        this.total = res.data.total;
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
    updataStatus(caseNo, status){
      if(status == 1003){
        // 确认结算填写信息
        this.cashWithInfo = caseNo;
        this.dialogVisible = true;
      }else{
        let text;
        if( status == 1002 ){
          text = '通过审核'
        }else if( status == 1004 ){
          text = '驳回审核'
        }else if( status == 1001 ){
          text = '取消审核'
        }
        let postData = {
          caseNo: caseNo,
          examineState: status,
          userId: this.userId
        }
        this.$alert('你确定要' + text + '？', '审核', {
          confirmButtonText: '确定',
          callback: action => {
              if(action == 'confirm'){
                updataCashwith(postData).then((res)=>{
                  console.log(res)
                  this.$notify({
                    title: res.data.code == 0 ? '成功' : '失败',
                    message: res.data.msg,
                    type:  res.data.code == 0 ? 'success' : 'error',
                    duration: 2000
                  });
                  if(res.data.code == 0){
                    this.getList()
                  }
                })
              }
            }
        });
      }
    },
    // 确认结算
    affirmCashWith(){
      let postData = {
        caseNo: this.cashWithInfo.caseNo,
        examineState: 1003,
        supplement: this.form.supplement,
        cashwithImg: this.form.cashwithImg,
        userId: this.userId
      }
      updataCashwith(postData).then((res)=>{
        console.log(res)
        this.$notify({
          title: res.data.code == 0 ? '成功' : '失败',
          message: res.data.msg,
          type:  res.data.code == 0 ? 'success' : 'error',
          duration: 2000
        });
        if(res.data.code == 0){
          this.dialogVisible = false;
          this.getList()
        }
      })
    },
    // 取消结算
    handleClose(){
      this.dialogVisible = false;
      this.form = {};
    },
    // 上传银行转账截图
    uploadSuccess(res, file){
      this.form.cashwithImg = res.imagePath;
      // this.fileList = [{ name: this.baseUrl + res.imagePath, url: this.baseUrl + res.imagePath }];
    }
  },
   filters:{
    filterStatus(val){
      let data = {
        1001: '未处理',
        1002: '处理中',
        1003: '提现成功',
        1004: '已驳回',
        1005: '已取消'
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
  .btn{
    margin: 0 10px 10px 0;
  }
  .balanceTitle{
    display: inline-block;
    width: 140px;
    text-align: right;
    margin-bottom: 10px;
    padding-right: 12px;
    box-sizing: border-box;
  }
</style>