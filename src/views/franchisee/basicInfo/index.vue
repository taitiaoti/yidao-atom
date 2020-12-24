<template>
  <div class="container">
      <div class="basicInfo_view" v-loading="loading">
        <div class="basicInfo_li">
            <div class="basicInfo_title">
                <span class="title_xian"></span>
                <span class="title_text">基本信息</span>
            </div>
            <div class="basicInfo_content">
                <div>
                    <div>角色： {{ basicInfo.roleName }}</div>
                </div>
                <div style="margin: 10px 0;">
                    <span class="detail">加盟商ID：{{ basicInfo.username }}</span>
                    <span>加盟商名称：{{ basicInfo.agentName }}</span>
                </div>
                <div>
                    <span class="detail">账号状态：{{ basicInfo.delFlag | filterDelFlag }}</span>
                    <span>联系电话：{{ basicInfo.phone }}</span>
                </div>
            </div>
        </div>
        <div class="xian"></div>
        <div class="basicInfo_li">
            <div class="basicInfo_title">
                <span class="title_xian"></span>
                <span class="title_text">账户信息</span>
                <el-button type="success" size="small" class="btn" @click="applyDrawal">申请提现</el-button>
                <el-button type="primary" size="small" class="btn" @click="intelligentCash">智能提现</el-button>
            </div>
            <div class="basicInfo_content">
                <span class="detail">账户余额：{{ basicInfo.amount ? Number(basicInfo.amount).toFixed(2) : 0.00  }}元</span>
                <span>提现中金额：{{ basicInfo.cashInAmount ? Number(basicInfo.cashInAmount).toFixed(2) : 0.00 }}元</span>
            </div>
        </div>
        <div class="xian"></div>
        <div class="basicInfo_li">
            <div class="basicInfo_title">
                <span class="title_xian"></span>
                <span class="title_text">银行信息</span>
                <el-button type="success" size="small" class="btn" @click="bankDislog()">{{ bankStatus == 'add' ? '添加银行信息' : '更新银行信息' }}</el-button>
            </div>
            <div class="basicInfo_content" style="margin-left:60px;" v-if=" bankStatus == 'add' ">还未添加银行信息</div>
            <div v-else class="basicInfo_content">
                <div>审核状态：{{ basicInfo.examineState | filterExamine }}</div>
                <div style="margin:10px 0;">银行账户名：{{ basicInfo.bankName }}</div>
                <div style="margin-bottom:10px;">银行开户行：{{ basicInfo.bankDeposit }}</div>
                <div>银行账号（卡号）：{{ basicInfo.bankCode }}</div>
            </div>
        </div>
        <!-- 申请提现对话框 -->
        <el-dialog
            title="申请提现"
            :visible.sync="dialogVisible"
            width="25%"
            :before-close="cancelDrawal">
            <div>
                <div style="font-size:12px;color:#FB6041;margin-bottom:30px;">提现提示：申请之后我们会在1个工作日之内审核</div>
                <div>
                    <span class="balanceTitle">账户余额：</span>
                    <span>{{ basicInfo.amount ? Number(basicInfo.amount).toFixed(2) : 0.00 }}元</span>
                </div>
                <el-form :model="form" label-width="140px" :rules="rules" ref="gasCashwith">
                    <el-form-item label="申请提现金额：" prop="caseAmount" style="margin: 20px 0;">
                        <el-input v-model.number="form.caseAmount" style="width:80%;" class="el_input"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="form.remark" style="width:80%;" class="el_input"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" @click="cancelDrawal()">取 消</el-button>
                <el-button size="small" type="primary" @click="affirmDrawal()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 智能提现对话框 -->
        <el-dialog
            title="智能提现"
            :visible.sync="intelligentCashDislog"
            width="25%"
            :before-close="cancelIntelligentCash">
            <div style="margin-top:30px;">
                <el-form :model="form" label-width="140px">
                    <el-form-item label="状态：">
                        <el-select v-model="form.inteState" style="width:80%;" class="el_input" placeholder="请选择状态">
                            <el-option label="开启" value="1002"></el-option>
                            <el-option label="关闭" value="1001"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select v-model="form.inteType" placeholder="请选择类型" style="width:80%;" class="el_input">
                            <el-option label="定时" value="1002"></el-option>
                            <el-option label="满额" value="1001"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show='form.inteType == "1001"' label="设定金额（元）：">
                        <el-input v-model.number="form.setAmount" class="el_input" style="width:80%;"></el-input>
                    </el-form-item>
                    <el-form-item v-show='form.inteType == "1002"' label="设定日期：" class="fuck">
                        <el-select v-model="form.setTime" placeholder="请选择时间" class="el_input" style="width:80%;">
                            <el-option label='每日' value="1001"></el-option>
                            <el-option label="每周" value="1002"></el-option>
                            <el-option label="每月" value="1003"></el-option>
                        </el-select>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <div slot="content">注：设定日期为“每日”则系统会自动每日<br/>的10点整自动提交提现申请；“每周”则<br/>系统自动每周五的上午10点整自动提交提现<br/>申请：“每月”则系统自动每个月的1号<br/>上午10点整自动提交提现申请。</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" @click="cancelIntelligentCash()">取 消</el-button>
                <el-button type="primary" size="small" @click="affirmIntelligentCash()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 更新银行信息 -->
        <el-dialog
            :title=" bankStatus == 'add' ? '添加银行卡信息' : '修改银行卡信息' "
            :visible.sync="bankInfoDislog"
            width="25%"
            :before-close="handleClose">
            <div>
                <div style="font-size:12px;color:#FB6041;margin-bottom:30px;">提示：已经审核的再修改需要重新审核，审核通过才能提现！</div>
                <div style="margin-bottom:20px;">
                    <span class="balanceTitle">加盟商ID：</span>
                    <span>{{ basicInfo.username }}</span>
                </div>
                <div style="margin-bottom:20px;">
                    <span class="balanceTitle">加盟商名称：</span>
                    <span>{{ basicInfo.agentName }}</span>
                </div>
                <el-form :model="bankForm" label-width="140px" :rules="rules" ref="bankForm">
                    <el-form-item label="银行账户名：" prop="bankName" style="margin-bottom:20px;">
                        <el-input v-model="bankForm.bankName" class="el_input" style="width:80%;" placeholder='请输入账户名'></el-input>
                    </el-form-item>
                    <el-form-item label="银行开户行：" prop="bankDeposit" style="margin-bottom:20px;">
                        <el-input type="textarea" v-model="bankForm.bankDeposit" class="el_input" placeholder="例：xx银行xx支行" style="width:80%;"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号(卡号)：" prop="bankCode" style="margin-bottom:20px;">
                        <el-input v-model="bankForm.bankCode" class="el_input" style="width:80%;" placeholder='请输入银行卡号' onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" @click="handleClose()">取 消</el-button>
                <el-button type="primary" size="small" @click="affirmBankInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { queryUserInfo,putGasBank,gasCashwith,queryInterule,updateInterule } from '@/api/franchisee/index';
export default {
    data(){
        return {
            userInfo: '',               //用户信息
            // 基本信息
            basicInfo: '',
            dialogVisible: false,
            bankInfoDislog: false,      //银行信息弹框
            intelligentCashDislog: false,     //智能提现弹框
            form: {                     //申请提现信息
                caseAmount: '',         //提现金额
                remark: '',               //备注
                inteState: '',         //状态
                inteType: '',           //类型
                setAmount: 0,  //设定金额
                setTime: '',            //定时时间
            },
            loading: true,
            // 银行信息
            bankForm: {
                bankName: '',               //账户名
                bankDeposit: '',               //开户行
                bankCode: null,               //卡号
            },
            tooltipContent: '',
            bankStatus: '',                 //是否绑定银行
            rules: {
                bankName: [
                    { required: true, message: '请输入银行账户名', trigger: 'blur' }
                ],
                bankDeposit: [
                    { required: true, message: '请输入银行开户行', trigger: 'blur' }
                ],
                bankCode: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' }
                    // { type: 'number', message: '必须为数字值', trigger: 'blur' }
                ],
                caseAmount: [
                    { required: true, message: '请输入提现金额', trigger: 'blur' },
                    { type: 'number', message: '必须为数字值', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        let userInfo = getStore({name: 'userInfo'});
        this.userInfo = userInfo;
        this.getUserInfo();
        console.log(userInfo,'用户信息')
    },
    methods:{
        // 获取用户基本信息
        getUserInfo(){
            this.loading = true;
            let postData = {
                userId: this.userInfo.userId
            }
            queryUserInfo(postData).then((res)=>{
                console.log(res,'基本信息')
                if(res.data.data){
                    this.basicInfo = res.data.data;
                    this.form.settingMpney = res.data.data.amount;
                    this.bankForm.bankName = res.data.data.bankName;
                    this.bankForm.bankDeposit = res.data.data.bankDeposit;
                    this.bankForm.bankCode = Number(res.data.data.bankCode) == 0 ? '' : Number(res.data.data.bankCode);
                    this.bankStatus = res.data.data.bankCode ? 'updata' : 'add' 
                    this.loading = false;
                }
            })
        },
        // 申请提现
        applyDrawal(){
            this.dialogVisible = true;
        },
        // 取消提现
        cancelDrawal(){
            this.dialogVisible = false;
            this.form.caseAmount = '';
            this.form.remark = '';
        },
        // 确定提现
        affirmDrawal(){
            this.$refs['gasCashwith'].validate((valid) => {
                if (valid) {
                    // 效验通过
                    let postData = {
                        userId: this.userInfo.userId,
                        userName: this.basicInfo.username,
                        agentName: this.basicInfo.agentName,
                        roleName: this.basicInfo.roleName,
                        caseAmount: this.form.caseAmount,
                        remark: this.form.remark,
                        bankCode: this.basicInfo.bankCode
                    }
                    gasCashwith(postData).then((res)=>{
                        console.log(res,'申请提现')
                        this.$notify({
                            title: res.data.code == 0 ? '成功' : '失败',
                            message: res.data.msg,
                            type:  res.data.code == 0 ? 'success' : 'error',
                            duration: 2000
                        });
                        if(res.data.code == 0){
                            this.getUserInfo();
                            this.dialogVisible = false;
                        }
                    })
                } else {
                    console.log('申请提现效验失败!!');
                    return false;
                }
            });
        },
        // 添加 更新银行信息
        bankDislog(){
            this.bankInfoDislog = true
        },
        // 取消 更新银行信息
        handleClose(){
            if(this.bankStatus == 'add'){
                this.bankForm = {
                    bankName: '',               //账户名
                    bankDeposit: '',               //开户行
                    bankCode: '',               //卡号
                }
            }else{
                this.bankForm = {
                    bankName: this.basicInfo.bankName,               //账户名
                    bankDeposit:  this.basicInfo.bankDeposit,               //开户行
                    bankCode:  this.basicInfo.bankCode               //卡号
                }
            }
            this.bankInfoDislog = false;
        },
        // 确定添加更新银行信息
        affirmBankInfo(){
            this.$refs['bankForm'].validate((valid) => {
                if (valid) {
                    // 效验通过
                    let postData = {
                        userId: this.userInfo.userId,
                        userName: this.basicInfo.username,
                        agentName: this.basicInfo.agentName,
                        roleName: this.basicInfo.roleName,
                        bankName: this.bankForm.bankName,
                        bankDeposit: this.bankForm.bankDeposit,
                        bankCode: this.bankForm.bankCode
                    }
                    putGasBank(postData).then((res)=>{
                        console.log(res,'更新')
                        let text = this.bankStatus == 'add' ? '添加' : '更新';
                        this.$notify({
                            title: res.data.code == 0 ? '成功' : '失败',
                            message: res.data.msg,
                            type:  res.data.code == 0 ? 'success' : 'error',
                            duration: 2000
                        });
                        if(res.data.code == 0){
                            this.getUserInfo();
                            this.bankInfoDislog = false;
                        }
                    })
                } else {
                    console.log('效验失败!!');
                    return false;
                }
            });
        },
        // 查询用户智能提现规则
        getInterule(){
            let postData = {
                userId: this.userInfo.userId
            }
            console.log(postData,'llll')
            queryInterule(postData).then((res)=>{
                console.log(res,'当前选择的智能提现')
                if(res.data){
                    this.form.inteState = res.data.inteState,
                    this.form.inteType = res.data.inteType,
                    this.form.setAmount = res.data.setAmount,
                    this.form.setTime = res.data.setTime
                }
            })
        },
        // 智能提现
        intelligentCash(){
            this.intelligentCashDislog = true;
            this.form.setAmount = this.basicInfo.amount;
            this.getInterule();
        },
        // 取消智能提现
        cancelIntelligentCash(){
            this.intelligentCashDislog = false;
            this.form.setAmount = '';
            this.form.inteType = '';
            this.form.setTime = '';
            this.form.inteState = '';
        },
        // 确定设置智能提现
        affirmIntelligentCash(){
            console.log(this.form,'参数')
            let postData = {
                userId: this.userInfo.userId,
                inteState: this.form.inteState,
                inteType: this.form.inteType,
                setAmount: this.form.setAmount,
                setTime: this.form.setTime
            }
            updateInterule(postData).then((res)=>{
                console.log(res,'设置智能提现')
                this.$notify({
                    title: res.data.code == 0 ? '成功' : '失败',
                    message: res.data.msg,
                    type:  res.data.code == 0 ? 'success' : 'error',
                    duration: 2000
                });
                if(res.data.code == 0){
                    this.cancelIntelligentCash()
                }
            })
        }
    },
    filters:{
        // 账户状态
        filterDelFlag(val){
            let delFlag;
            if(val == 0){
                delFlag = '正常'
            }else{
                delFlag = '删除'
            }
            return delFlag;
        },
        // 银行审核状态
        filterExamine(val){
            let data = {
                1001: '待审核',
                1002: '已审核',
                1003: '审核失败'
            };
            return data[val];
        }
    }
}
</script>

<style lang="scss">
    .router{
        position: relative;
    }
    .el-dialog{
        min-width: 300px;
    }
    .xian{
        height: 10px;
        background: #f4f4f4;
    }
    .basicInfo_view{
        // padding-left: 100px;
        // box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f4f4f4;
        overflow: scroll;
    }
    .basicInfo_li{
        color: #333;
        border-radius: 10px; 
        background: #fff;
    }
    .basicInfo_title{
       display: flex;
       height: 90px;
       border-bottom: 1px solid #E4E4E4;
       padding-left: 30px;
       box-sizing: border-box;
       align-items: center;
    //    margin-bottom: 20px; 
    }
    .title_xian{
        width: 6px;
        height: 30px;
        background: #3E9BFC;
    }
    .title_text{
        padding-left: 12px;
        box-sizing: border-box;
        color: #333;
        font-size: 24px;
        margin-right: 60px;
    }
    .basicInfo_content{
        padding: 40px;
        box-sizing: border-box;
        color: #333;
    }
    .detail{
        display: inline-block;
        min-width: 300px;
    }
    .balanceTitle{
        display: inline-block;
        width: 140px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
    }
    .el-dialog__header{
        background: #F2F2F2;
    }
    .el_input{
        width: 80%;
        z-index: 999;
    }
    .dialog_footer{
        display: flex;
        justify-content: space-around;
    }
    .el-dialog__body{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>