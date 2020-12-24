<template>
  <div>
     <!-- 搜索查询交接班记录 -->
    <div class="filter-container searchInfo">
        <el-input v-model="searchObj.gasUserName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商ID" clearable></el-input>
        <el-input v-model="searchObj.gasAgentName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入加盟商名称" clearable></el-input>
        <el-input v-model="searchObj.gasName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入油站名称" clearable></el-input>
        <el-input v-model="searchObj.oneDutyName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入当班员名称" clearable></el-input>
        <el-input v-model="searchObj.successionName" style="width:200px;margin-right:10px;" prefix-icon="el-icon-search" placeholder="请输入接班员名称" clearable></el-input>
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
      </div>
      <el-table
        :data="list"
        border
        v-loading="listLoading"
        fit
        highlight-current-row
        element-loading-text="给我一点时间"
        style="width:100%;margin-bottom:20px;">
        <el-table-column align="center" label="加盟商ID">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.gasUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="加盟商名称">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.gasAgentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="油站名称">
          <template slot-scope="scope">
            <span>{{scope.row.tSuccessionOrder.gasName}}</span>
          </template>
        </el-table-column>
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
          <!-- <div class="time">开始时间：{{ billInfo.tSuccessionOrder.startTime | filterTime }}</div>
          <div class="time">结束时间：{{ billInfo.tSuccessionOrder.endTime | filterTime }}</div>
          <el-form ref="billInfo" :model="billInfo" label-width="200px">
            <el-form-item label="加油原价金额汇总：" class="time">
              <span>{{ billInfo.tSuccessionOrder.originalTotalPrice }}元</span>
            </el-form-item>
            <el-form-item label="实付金额汇总：" class="time">
              <span>{{ billInfo.tSuccessionOrder.realTotalPrice }}元</span>
            </el-form-item>
            <el-form-item label="结算金额汇总：" class="time">
              <span>{{ billInfo.tSuccessionOrder.canBeSettledPrice }}元</span>
            </el-form-item>
            <el-form-item label="加油笔数汇总：" class="time">
              <span>{{ billInfo.tSuccessionOrder.number }}笔</span>
            </el-form-item>
            <el-form-item label="加油升数汇总：" class="time">
              <span>{{ billInfo.tSuccessionOrder.lTotal }}升</span>
            </el-form-item>
            <el-form-item label="退款原价金额汇总：" class="time">
              <span>{{ billInfo.refundcombinedamountGun }}元</span>
            </el-form-item>
            <el-form-item label="退款实付金额汇总：" class="time">
              <span>{{ billInfo.refundcombinedamountPay }}元</span>
            </el-form-item>
            <el-form-item label="退款结算金额汇总：" class="time">
              <span>{{ billInfo.refundcombinedamountGas }}元</span>
            </el-form-item>
            <el-form-item label="退款笔数汇总：" class="time">
              <span>{{ billInfo.refundcombinednumber }}笔</span>
            </el-form-item>
            <el-form-item label="退款升数汇总：" class="time">
              <span>{{ billInfo.refundcombinedlTotal }}升</span>
            </el-form-item>
            <el-form-item label="实收金额汇总：" class="time">
              <span>{{ billInfo.combinedtotalAmountPay }}元</span>
            </el-form-item>
            <el-form-item label="可结算金额汇总：" class="time">
              <span>{{ billInfo.combinedSettlementTotalPeices }}元</span>
            </el-form-item>
          </el-form> -->
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
            <span class="total_li"> 升数汇总 {{ billInfo.totalLitre | filterNull }}升</span>
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
          <!-- <div class="dashed"></div> -->
          <div class="time">{{ billInfo.tSuccessionOrder.endTime | filterTime }}</div>
        </div>
        <div slot="footer" class="dialog_footer">
          <el-button @click="billClose()">知道了</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getStore } from '@/util/store';
import { timestampToTime,formartTime } from "@/util/util";
import { queryList } from "@/api/franchisee/changeShifts";
export default {
    data(){
        return {
            listQuery: {
                page: 1,
                limit: 10
            },
            searchObj: {
              startTime: '',
              endTime: '',
              gasName: '',
              gasUserName: '',
              gasAgentName: '',
              oneDutyName: '',
              successionName: ''
            },
            billInfo: '',
            time: [],
            total: 0,
            list: [],
            listLoading: false,
            userId: '',
            billDialog: false,
            billTitle: ''
        }
    },
    created(){
      let userInfo = getStore({name: 'userInfo'});
      this.userId = userInfo.userId;
      this.getList();
    },
    methods: {
        search(){
          this.getList()
        },
        getList(){
          this.listLoading = true;
          let postData = {
            ...this.listQuery,
            ...this.searchObj,
            userId: this.userId
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
                this.searchObj.startTime = formartTime(res[0], 5);
                this.searchObj.endTime = formartTime(res[1], 5);
                this.time.push(formartTime(res[0], 5));
                this.time.push(formartTime(res[1], 5));
            }else {
                this.searchObj.startTime = null;
                this.searchObj.endTime = null;
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
        // 查看账单详情
        seeDetail(obj){
            this.billInfo = obj;
            this.billTitle = '嘟嘟班结流水（' + obj.tSuccessionOrder.serialNumber + '）'
            this.billDialog = true;
        },
        // 关闭账单流水
        billClose(){
          this.billDialog = false;
        },
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
      justify-content: space-around;
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