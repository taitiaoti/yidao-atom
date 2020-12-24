<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <div class="s-category">
        <el-select v-model="searchObj.appId" placeholder="请选择渠道名称" clearable>
          <el-option
            v-for="item in channelData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="success" icon="el-icon-plus" @click="createPayConfig('')">添加支付配置</el-button>
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
        class="tableBox"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="渠道ID">
          <template slot-scope="scope">
            <span>{{scope.row.appId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="渠道名称">
          <template slot-scope="scope">
            <span>{{scope.row.payName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | filterPayType }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信appId/支付宝appId">
          <template slot-scope="scope">
            <span>{{scope.row.acctId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信商户号/支付宝PID">
          <template slot-scope="scope">
            <span>{{scope.row.partner}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信Secret">
          <template slot-scope="scope">
            <span>{{scope.row.secert}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信证书地址/支付宝公钥">
          <template slot-scope="scope">
            <span>{{scope.row.publicCerPwd}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信API密钥/支付宝私钥">
          <template slot-scope="scope">
            <span>{{scope.row.privateCerPwd}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付宝秘钥类型">
          <template slot-scope="scope">
            <span>{{scope.row.signType}}</span>
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
        <el-table-column align="center" label="操作" width='180'>
          <template slot-scope="scope">
            <el-button size='mini' type='primary' @click="createPayConfig(scope.row)">编辑</el-button>
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
          :title="channelDialogStatus == 'create' ? '添加支付配置' : '编辑支付配置' "
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form label-width="100px" :model="payConfigInfo" :rules="rules" ref="form" >
            <el-form-item label="渠道名称" prop='appId'>
              <el-select v-model="payConfigInfo.appId" placeholder="请选择渠道名称" @change="changeChannel">
                <el-option
                  v-for="item in channelData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select v-model="payConfigInfo.payType" placeholder="请选择支付方式" @change="changePayType">
                <el-option
                  v-for="item in payTypeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label=" payConfigInfo.payType == 'alipay' ? '支付宝appId' : '微信appId' " prop='acctId'>
              <el-input v-model="payConfigInfo.acctId"></el-input>
            </el-form-item>
            <el-form-item label="微信Secret" v-if=" payConfigInfo.payType !== 'alipay' " prop="secert">
              <el-input v-model="payConfigInfo.secert"></el-input>
            </el-form-item>
            <el-form-item  :label=" payConfigInfo.payType == 'alipay' ? '支付宝PID' : '微信商户号' " prop="partner">
              <el-input v-model="payConfigInfo.partner"></el-input>
            </el-form-item>
            <el-form-item label="秘钥类型" v-if=" payConfigInfo.payType == 'alipay' ">
              <el-input v-model="payConfigInfo.signType"></el-input>
            </el-form-item>
            <el-form-item :label=" payConfigInfo.payType == 'alipay' ? '支付宝公钥' : '微信证书地址' " prop="publicCerPwd">
              <el-input type="textarea" v-model="payConfigInfo.publicCerPwd"></el-input>
            </el-form-item>
            <el-form-item :label=" payConfigInfo.payType == 'alipay' ? '支付宝私钥' : '微信API密钥' " prop="privateCerPwd">
              <el-input type="textarea" v-model="payConfigInfo.privateCerPwd"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="affirmPayConfigInfo">保 存</el-button>
          </span>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import { queryPayChannelList,queryPayConstant,addPayConstant,putPayConstant,deletePayConstant } from "@/api/franchisee/channel";
import { formartTime } from "@/util/util";
export default {
  data(){
    var validateAccId = (rule, value, callback)=>{
      if(!value){
        if(this.payConfigInfo.payType == 'alipay'){
          return callback(new Error('支付宝appId不能为空'));
        }else{
          return callback(new Error('微信appId不能为空'));
        }
      }else{
        callback();
      }
    }
    var validatePartner = (rule, value, callback)=>{
      if(!value){
        if(this.payConfigInfo.payType == 'alipay'){
          return callback(new Error('支付宝PID不能为空'));
        }else{
          return callback(new Error('微信商户号不能为空'));
        }
      }else{
        callback();
      }
    }
    var validatePublicCerPwd = (rule, value, callback)=>{
      if(this.payConfigInfo.payType == 'alipay'){
        if(!value){
          return callback(new Error('支付宝公钥不能为空'));
        }else{
          callback();
        }
      }else{
        callback();
      }
    }
    var validatePrivateCerPwd = (rule, value, callback)=>{
      if(!value){
        if(this.payConfigInfo.payType == 'alipay'){
          return callback(new Error('支付宝私钥不能为空'));
        }else{
          return callback(new Error('微信API密钥不能为空'));
        }
      }else{
        callback();
      }
    }
    var validateSecert = (rule, value, callback)=>{
      if(this.payConfigInfo.payType !== 'alipay'){
        if(!value){
          return callback(new Error('微信secert不能为空'));
        }else{
          callback();
        }
      }else{
        callback();
      }
    }
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      searchObj: {
        appId: ''
      },
      list: [],
      listLoading: false,
      total: 0,
      channelDialogStatus: 'create',
      dialogVisible: false,
      channelData: [],
      payTypeData: [
        { label: 'APP-微信支付', value: 'wxpay' },
        { label: 'APP-支付宝支付', value: 'alipay' },
        { label: '微信小程序支付', value: 'wxsmallpay' },
        { label: 'H5-微信支付', value: 'wxpayh5' },
        { label: 'H5-支付宝支付', value: 'alipayh5' }
      ],
      payConfigInfo: {
        appId: '',                     //渠道id
        paymentId: '',              //渠道数据id
        payType: 'wxpay',           //支付方式
        acctId: '',                 //微信appid、支付宝账号
        secert: '',                 //微信Secret
        partner: '',                //微信商户号
        publicCerPwd: '',           //支付宝公钥
        privateCerPwd: '',          //支付宝私钥、微信key
        signType: '',               //支付宝秘钥类型
        id: ''
      },
      rules: {
        appId: [
          { required: true, message: '请选择支付渠道', trigger: 'change' }
        ],
        acctId: [
          { validator: validateAccId, trigger: 'blur' }
        ],
        secert: [
          { validator: validateSecert, trigger: 'blur' }
        ],
        partner: [
          { validator: validatePartner, trigger: 'blur' }
        ],
        publicCerPwd: [
          { validator: validatePublicCerPwd, trigger: 'blur' }
        ],
        privateCerPwd: [
          { validator: validatePrivateCerPwd, trigger: 'blur' }
        ],
      }
    }
  },
  created(){
    this.getChannelData();
    this.getList();
  },
  methods: {
    // 获取所有渠道
    getChannelData(){
      this.channelData = [];
      queryPayChannelList().then((res)=>{
        res.data.forEach((i)=>{
          let obj = {
            label: i.payName,
            value: i.payType,
            id: i.id
          }
          this.channelData.push(obj)
        })
      })
    },
    // 选择渠道
    changeChannel(value){
      this.channelData.forEach((i)=>{
        if(value == i.value){
          this.payConfigInfo.paymentId = i.id;
          return;
        }
      })
    },
    // 切换支付类型
    changePayType(){
      this.restFrom();
    },
    // 获取数据
    getList(){
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        ...this.searchObj
      }
      queryPayConstant(postData).then((res)=>{
        this.total = res.data.total;
        this.list = res.data.records;
        this.listLoading = false;
        console.log(res,'支付配置参数列表')
      })
    },
    // 搜索
    search(){
      this.listQuery.page = 1;
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
    createPayConfig(obj){
      if(obj){
        // 编辑
        this.channelDialogStatus = 'update';
        this.payConfigInfo.id = obj.id;
        this.payConfigInfo.appId = obj.appId;
        this.payConfigInfo.paymentId = obj.paymentId;
        this.payConfigInfo.payType = obj.payType;
        this.payConfigInfo.acctId = obj.acctId;
        this.payConfigInfo.secert = obj.secert;
        this.payConfigInfo.partner = obj.partner;
        this.payConfigInfo.publicCerPwd = obj.publicCerPwd;
        this.payConfigInfo.privateCerPwd = obj.privateCerPwd;
        this.payConfigInfo.signType = obj.signType;
      }else{
        // 添加
        this.channelDialogStatus = 'create'
      }
      this.dialogVisible = true;
    },
    // 确定编辑新增
    affirmPayConfigInfo(){
       this.$refs.form.validate((valid) => {
         if(valid){
           let postData = this.payConfigInfo;
          if(this.channelDialogStatus == 'create'){
            // 新增
            addPayConstant(postData).then((res)=>{
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
            putPayConstant(postData).then((res)=>{
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
         }else{
           console.log('error')
         }
       })
    },
    // 删除渠道
    handDelete(id){
      this.$alert('确定要删除该配置参数吗？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            deletePayConstant(id).then((res)=>{
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
      this.restFrom();
      this.payConfigInfo.appId = '';
      this.payConfigInfo.paymentId = '';
      this.payConfigInfo.id = '';
      this.payConfigInfo.payType = 'wxpay';
    },
    //清空输入框
    restFrom(){
      this.payConfigInfo.acctId = '';
      this.payConfigInfo.secert = '';
      this.payConfigInfo.partner = '';
      this.payConfigInfo.publicCerPwd = '';
      this.payConfigInfo.privateCerPwd = '';
      this.payConfigInfo.signType = '';
      this.$refs['form'].clearValidate();
    } 
  },
  filters: {
    // 支付方式
    filterPayType(val){
      if(val){
        let data = {
          alipay: 'APP-支付宝支付',
          alipayh5: 'H5-支付宝支付',
          wxpayh5: 'H5-微信支付',
          wxpay: 'APP-微信支付',
          wxsmallpay: '微信小程序支付'
        }
        return data[val]
      }
    },
    fitlerTime(value){
        return formartTime(new Date(value), 5);
    },
  }
}
</script>

<style lang="scss">
  .s-category{
    display: inline-block;
  }
  .tableBox{
    .cell{
      max-height: 200px;
      overflow-y: scroll;
    }
    .cell::-webkit-scrollbar {
        display: none;
    }
  }
</style>