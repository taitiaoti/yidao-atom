<template>
  <div>
      <!-- 员工交接班 -->
      <div class="filter-container filter-staff">
            <div class="flex_table">
                <span class="flex_label">当班员：</span>
                <div class="s-category">
                  <el-input v-model="oneDutyName" disabled></el-input>
                </div>
            </div>
            <div class="flex_table">
                <span>接班员：</span>
                <div class="s-category">
                    <el-select v-model="successionName" placeholder="请选择接班员" clearable>
                        <el-option
                            v-for="item in allUser"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </div>
                <el-button type='primary' @click="userDialog">员工管理</el-button>
            </div>
      </div>
      <!-- 确认交接班 -->
      <div class="filter-container filter-staff">
            <div class="flex_table">
                <span class="flex_label">接班时间：</span>
                <el-input v-model="startTime" disabled></el-input>
            </div>
            <div class="flex_table">
                <el-button type='primary' @click="bindStartWoke" :disabled='billBtn'>{{ oneDutyName ? '确认交班' : '开始上班' }}</el-button>
            </div>
      </div>
      <!-- 搜索查询交接班记录 -->
      <div class="filter-container searchInfo">
        <div class="s-category">
            <el-select v-model="searchInfo.oneDutyName" placeholder="请选择当班员" clearable>
                <el-option
                    v-for="item in allUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                </el-option>
            </el-select>
        </div>
        <div class="s-category">
            <el-select v-model="searchInfo.successionName" placeholder="请选择接班员" clearable>
                <el-option
                    v-for="item in allUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
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
        <el-button type='primary' @click="search" icon="el-icon-search">搜索</el-button>
        <el-button type='primary' @click="exportInfo" :loading="exportLoading" icon="el-icon-download">导出</el-button>
      </div>
      <!-- 交接班记录列表 -->
      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="班结流水序号">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.serialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当班员">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.oneDutyName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="接班员">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.successionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="接班时间" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.startTime | filterTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交班时间" width='100'>
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.endTime | filterTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加油原价金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.originalTotalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.realTotalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结算金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.settlementTotalPeice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款原价金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.refundOriginalTotalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款实付金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.refundRealTotalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款结算金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.refundSettlementTotalPeice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实收金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.totalAmountPay}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可结算金额汇总（元）">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.canBeSettledPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="班结流水明细">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
              @click="seeDetail(scope.row)">查看
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
      <!-- 员工管理弹窗 -->
      <el-dialog
        title="员工管理"
        :visible.sync="dialogFormVisible"
        width="30%"
        :before-close="handleClose">
        <el-form ref="form">
          <el-form-item>
            <el-button type="primary" @click="addUser">添加员工</el-button>
          </el-form-item>
          <div class="title">
            <span>员工名称</span>
          </div>
          <el-form-item v-for="(item, index) in allUser" :key="index">
            <el-input v-model="item.label"></el-input>
            <el-button type="danger" style="margin-left:10px" @click="removeStaff(index)">删除</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog_footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="affirmDialog">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 账单记录 -->
      <el-dialog
        :title="billTitle"
        :visible.sync="billDialog"
        width="80%"
        center
        :before-close="billClose">
        <div v-if='billInfo'>
          <div class="billInfo">
            <div class="billUser billUserName">
              <div class="detail_bill_li">当班员：{{ billInfo.tSuccessionOrder.oneDutyName }}</div>
              <div></div>
              <div class="detail_bill_li">接班员：{{ billInfo.tSuccessionOrder.successionName }}</div>
            </div>

            <div class="billUser">
              <div class="detail_bill_li">开始时间：{{ billInfo.tSuccessionOrder.startTime | filterTime }}</div>
              <div></div>
              <div class="detail_bill_li"></div>
            </div>
            <div class="billUser">
              <div class="detail_bill_li">结束时间：{{ billInfo.tSuccessionOrder.endTime | filterTime }}</div>
              <div></div>
              <div class="detail_bill_li"></div>
            </div>

            <div class="dashed"></div>

            <div class="billUser">
              <div class="detail_bill_li">加油原价金额汇总：{{ billInfo.tSuccessionOrder.originalTotalPrice }}元</div>
              <div></div>
              <div class="detail_bill_li">退款原价金额汇总：{{ billInfo.refundcombinedamountGun }}元</div>
            </div>
            <div class="billUser">
              <div class="detail_bill_li">实付金额汇总：{{ billInfo.tSuccessionOrder.realTotalPrice }}元</div>
              <div></div>
              <div class="detail_bill_li">退款实付金额汇总：{{ billInfo.refundcombinedamountPay }}元</div>
            </div>
            <div class="billUser">
              <div class="detail_bill_li">结算金额汇总：{{ billInfo.tSuccessionOrder.settlementTotalPeice }}元</div>
              <div></div>
              <div class="detail_bill_li">退款结算金额汇总：{{ billInfo.refundcombinedamountGas }}元</div>
            </div>
            <div class="billUser">
              <div class="detail_bill_li">加油笔数汇总：{{ billInfo.tSuccessionOrder.number }}笔</div>
              <div></div>
              <div class="detail_bill_li">退款笔数汇总：{{ billInfo.refundcombinednumber }}笔</div>
            </div>
            <div class="billUser">
              <div class="detail_bill_li">加油升数汇总：{{ billInfo.tSuccessionOrder.lTotal }}升</div>
              <div></div>
              <div class="detail_bill_li">退款升数汇总：{{ billInfo.refundcombinedlTotal }}升</div>
            </div>
            <div class="billUser billUser_margin">
              <div class="detail_bill_li">实收金额汇总：{{ billInfo.tSuccessionOrder.totalAmountPay }}元</div>
              <div></div>
              <div class="detail_bill_li">可结算金额汇总：{{ billInfo.tSuccessionOrder.canBeSettledPrice }}元</div>
            </div>
          </div>

          <div class="detail_li">
            <div class="dashed detail_dashed"></div>
            <div class="detail_title">交易明细</div>
            <div class="dashed detail_dashed"></div>
          </div>
          <!-- 交易明细 -->
          <el-table
            :data="billInfo.tSuccessionOrderDetails"
            border
            fit
            highlight-current-row
            style="width:100%;margin-bottom:20px;">
            <el-table-column align="center" label="油号">
              <template slot-scope="scope">
                <span>{{ scope.row.oilNo }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="枪价">
              <template slot-scope="scope">
                <span>{{ scope.row.priceGun }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="结算价">
              <template slot-scope="scope">
                <span>{{ scope.row.priceGas }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="零售价">
              <template slot-scope="scope">
                <span>{{ scope.row.priceUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="笔数">
              <template slot-scope="scope">
                <span>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="升数">
              <template slot-scope="scope">
                <span>{{ scope.row.litre }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="原价总额">
              <template slot-scope="scope">
                <span>{{ scope.row.originalTotalPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="结算总额">
              <template slot-scope="scope">
                <span>{{ scope.row.settlementTotalPeice }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="实付总额">
              <template slot-scope="scope">
                <span>{{ scope.row.totalAmountPay }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <span>合计：</span>
            <span class="total_li"> 笔数汇总 {{ billInfo.totalnumber }}笔  </span>
            <span class="total_li"> 升数汇总 {{ billInfo.totalLitre }}升</span>
            <span class="total_li"> 原价金额汇总 {{ billInfo.combinedOriginalTotalPrice | filterNull }}元 </span>
            <span class="total_li"> 结算金额汇总 {{ billInfo.combinedSettlementTotalPeices | filterNull }}元 </span>
            <span class="total_li"> 实付金额汇总{{ billInfo.combinedtotalAmountPay | filterNull }}元 </span>
          </div>
          <div class="detail_li">
            <div class="dashed detail_dashed"></div>
            <div class="detail_title">退款明细</div>
            <div class="dashed detail_dashed"></div>
          </div>
          <!-- 退款明细 -->
          <el-table
            :data="billInfo.tSuccessionOrderRefunds"
            border
            fit
            highlight-current-row
            style="width:100%;margin-bottom:20px;">
            <el-table-column align="center" label="油号">
              <template slot-scope="scope">
                <span>{{ scope.row.oilNo }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="笔数">
              <template slot-scope="scope">
                <span>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="升数">
              <template slot-scope="scope">
                <span>{{ scope.row.lTotal }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="原价">     
              <template slot-scope="scope">
                <span>{{ scope.row.amountGun }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="结算额">
              <template slot-scope="scope">
                <span>{{ scope.row.amountGas }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="实付">
              <template slot-scope="scope">
                <span>{{ scope.row.amountPay }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <span>合计：</span>
            <span class="total_li"> 笔数 {{ billInfo.refundcombinednumber | filterNull }}笔 </span>
            <span class="total_li"> 升数{{ billInfo.refundcombinedlTotal | filterNull }}升 </span>
            <span class="total_li"> 原价 {{ billInfo.refundcombinedamountGun }}元  </span>
            <span class="total_li"> 结算额 {{ billInfo.refundcombinedamountGas | filterNull }}元 </span>
            <span class="total_li"> 实付 {{ billInfo.refundcombinedamountPay | filterNull }}元 </span>
          </div>
          <div class="time" v-if='billSattus == 2'>{{ billInfo.tSuccessionOrder.endTime | filterTime }}</div>
        </div>
        <div slot="footer" class="dialog_footer" v-if='billSattus == 1'>
          <el-button @click="billClose()">重新选择</el-button>
          <el-button type="primary" @click="affirmBill()">交班完毕</el-button>
        </div>
        <div slot="footer" class="dialog_footer" v-else>
          <el-button @click="billClose()">知道了</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { timestampToTime,formartTime } from "@/util/util";
import { queryAllUser, addStaff, deleteStaff, queryNowStaff, startWork, queryWorkFlow,queryList,exportBill } from "@/api/franchisee/changeShifts";
export default {
    data(){
        return {
            listQuery: {
              page: 1,
              limit: 10
            },
            oneDutyName: null,
            successionName: null,
            nowStaffInfo: '',
            allUser: [],
            dialogFormVisible: false,
            gasUserName: '',      //加盟商id
            gasAgentName: '',     //加盟商名称
            userId: '',
            startTime: '',        //开始上班时间
            searchInfo: {         //搜索参数
              oneDutyName: '',
              successionName: '',
              startTime: '',
              endTime: ''
            },
            list: [],
            time: [],
            listLoading: false,
            total: 0,
            billDialog: false,      //账单流水
            billInfo: null,           //账单
            billSattus: 1,          //1交班 2查看
            billTitle: '',
            exportLoading: false,
            billBtn: true
        }
    },
    created(){
      let userInfo = getStore({name: 'userInfo'});
      console.log(userInfo)
      this.gasUserName = userInfo.username;
      this.gasAgentName = userInfo.agentName;
      this.userId = userInfo.userId;
      this.getUser();
      this.getNowStaff();
      this.getList();
    },
    methods: {
        search(){
          this.getList();
        },
        // 导出
        exportInfo(){
          let postData = {
            ...this.listQuery,
            ...this.searchInfo,
            userId: this.userId,
            gasUserName: this.gasUserName
          }
          this.exportLoading = true;                
          exportBill(postData).then(res => {
              this.exportLoading = false;                    
              if(res.status == 200){
                window.location.href = res.request.responseURL;
              }
          });
        },
        getList(){
          this.listLoading = true;
          let postData = {
            ...this.listQuery,
            ...this.searchInfo,
            userId: this.userId,
            gasUserName: this.gasUserName
          }
          queryList(postData).then((res)=>{
            this.list = res.data.records;
            this.total = res.data.total;
            this.listLoading = false;
            console.log(res,'记录')
          })
        },
        // 时间段查询
        selectTime(res){
            console.log(res)
            if(res){
                this.time = [];
                this.searchInfo.startTime = formartTime(res[0], 5);
                this.searchInfo.endTime = formartTime(res[1], 5);
                this.time.push(formartTime(res[0], 5));
                this.time.push(formartTime(res[1], 5));
            }else {
                this.searchInfo.startTime = null;
                this.searchInfo.endTime = null;
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
        // 获取所有员工
        getUser(){
            let postData = {
                type: '',
                gasUserName: this.gasUserName
            }
            queryAllUser(postData).then((res)=>{
                console.log(res,'所有员工')
                this.allUser = [];
                let data = res.data;
                data.forEach(i => {
                    let obj = {
                        label: i.name,
                        value: i.id
                    }
                    this.allUser.push(obj);
                });
            })
        },
        // 查询当前上班的人员和时间
        getNowStaff(){
          queryNowStaff(this.gasUserName).then((res)=>{
           this.billBtn = false;
           if(res.data){
              this.oneDutyName = res.data.oneDutyName;
              this.startTime = timestampToTime(res.data.startTime);
           }
          })
        },
        // 员工管理弹窗
        userDialog(){
            this.dialogFormVisible = true;
        },
        handleClose(){
            this.dialogFormVisible = false;
            this.getUser()
        },
        // 添加员工
        addUser(){
            let obj = {
                label: '',
                value: ''
            }
            this.allUser.push(obj)
        },
        // 确定添加员工
        affirmDialog(){
            let user = [];
            this.allUser.forEach((i)=>{
                let obj = {
                    name: i.label,
                    gasUserName: this.gasUserName
                }
                user.push(obj)
            })
            let postData = {
                tEmployees: user
            }
            addStaff(postData).then((res)=>{
                this.$notify({
                  title: res.data.code == 0 ? '成功' : '失败',
                  message: res.data.msg,
                  type:  res.data.code == 0 ? 'success' : 'error',
                  duration: 2000
                });
                if(res.data.code == 0){
                  this.handleClose();
                }
            })
        },
        // 删除员工
        removeStaff(index){
          this.$alert('是否删除该员工？', '删除', {
            confirmButtonText: '确定',
            callback: action => {
              if(action == 'confirm'){   
                this.allUser.splice(index, 1);
              }
            }
          });
        },
        // 查看明细
        seeDetail(obj){
          this.billInfo = obj;
          this.billSattus = 2;
          this.billTitle = '嘟嘟班结流水（' + obj.tSuccessionOrder.serialNumber + '）'
          this.billDialog = true;
          console.log(obj,'obj')
        },
        // 开始上班
        bindStartWoke(){
          if(this.successionName){
            if(this.oneDutyName){
              let nowTime = Date.now();
              // 交班流水
              let postData = {
                gasUserName: this.gasUserName,
                successionName: this.successionName,
                endTime: timestampToTime(nowTime)
              }
              queryWorkFlow(postData).then((res)=>{
                this.billInfo = res.data;
                this.billSattus = 1;
                this.billTitle = '嘟嘟班结流水（' + res.data.tSuccessionOrder.serialNumber + '）'
                this.billDialog = true;
                console.log(res,'上班流水')
              })
            }else{
              // 上班
              let postData = {
                tSuccessionOrder: {
                  oneDutyName: this.successionName,
                  gasUserName: this.gasUserName,
                  gasAgentName: this.gasAgentName
                }
              }
              startWork(postData).then((res)=>{
                this.$notify({
                  title: res.data.code == 0 ? '成功' : '失败',
                  message: res.data.msg,
                  type:  res.data.code == 0 ? 'success' : 'error',
                  duration: 2000
                });
                if(res.data.code == 0){
                  this.getNowStaff();
                }
              })
            }
          }else{
            this.$notify({
              title: '失败',
              message: '请选择接班员',
              type: 'error',
              duration: 2000
            });
          }
        },
        // 关闭账单流水
        billClose(){
          this.billDialog = false;
        },
        // 确认交班
        affirmBill(){
          let postData = this.billInfo;
          startWork(postData).then((res)=>{
            this.$notify({
              title: res.data.code == 0 ? '成功' : '失败',
              message: res.data.msg,
              type:  res.data.code == 0 ? 'success' : 'error',
              duration: 2000
            });
            if(res.data.code == 0){
              this.successionName = '';
              this.getNowStaff();
              this.getList();
              this.billClose();
            }
          })
        }
    },
    filters: {
      filterTime(val){
        if(val){
          return timestampToTime(val)
        }
      },
      filterNull(val){
        if(val){
          return val
        }else{
          return 0
        }
      }
    }
}
</script>

<style lang='scss' scoped>
  .filter-staff{
      display: flex;
      padding-left: 100px;
      box-sizing: border-box;
  }
  .s-category{
    display: inline-block;
  }
  .title {
    width: 50%;
    height: 40px;
    display: flex;
    justify-content: space-between;
  }
  .el-input{
    width: 220px;
  }
  .flex_table{
      width: 40%;
  }
  .flex_label{
      display: inline-block;
      width: 100px;
      text-align: right;
  }
  .searchInfo{
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #999;
    box-sizing: border-box;
  }
  .s-time{
    width: 400px;
    margin-right:10px;
    display: inline-block;
  }
  .billUser{
    display: flex;
    justify-content: space-around;
    width: 50%;
  }
  .billUser_margin{
    margin-top: 10px;
  }
  .time{
    margin-top: 30px;
    text-align: center;
  }
  .dashed{
    width: 100%;
    height: 6px;
    border-top: 1px solid #999;
    // border-bottom: 1px dashed #999;
    box-sizing: border-box;
    margin: 10px 0;
  }
  .detail_dashed{
    width: 40%;
  }
  .detail_li{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 10px 0;
    font-weight: bold;
  }
  .total_li{
    margin-left: 20px;
    font-weight: bold;
  }
  .detail_bill_li{
    width: 50%;
  }
  .billInfo{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .billUserName{
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>