<template>
    <div>
        <!-- 帮购记录 -->
        <!-- 筛选 -->
        <div class="filter-container">
            <el-input
                v-model="searchObj.orderNo"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入订单号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.storeName"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入所属店铺名称"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.productName"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入商品名称"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.productNo"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入商品编号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.helpUser"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入发起用户手机号"
                clearable
            >
            </el-input>
            <el-input
                v-model="searchObj.shareAccount"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入砍价用户手机号"
                clearable
            >
            </el-input>
            <el-select v-model="searchObj.state"
                placeholder="请选择订单状态"
                clearable
                style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                    v-for="(item, index) in orderStatusData"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
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
            <el-button type="primary" icon="el-icon-search" @click="search"
                >搜索</el-button
            >
            <el-button type="primary" @click="orderExport" :loading="exportLoading" icon="el-icon-download">导出</el-button>
        </div>
        <!-- 表格数据 -->
        <el-table
            :data="list"
            border
            v-loading="listLoading"
            fit
            highlight-current-row
            element-loading-text="给我一点时间"
            style="width:100%;margin-bottom:20px;">
            <el-table-column 
                align="center" 
                label="订单号">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="所属店铺">
                <template slot-scope="scope">
                    <span>{{ scope.row.storeName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="活动发起用户">
                <template slot-scope="scope">
                    <span>{{ scope.row.helpUser }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.productNo }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品主图"
                width='120'>
                <template slot-scope="scope">
                    <img :src=" scope.row.picture && scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="100" width="100"/>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="原价">
                <template slot-scope="scope">
                    <span>{{ scope.row.originalPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="成交价">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="参与砍价用户">
                <template slot-scope="scope">
                    <span>{{ scope.row.shareAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="砍价（元）">
                <template slot-scope="scope">
                    <span>{{ scope.row.helpPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="订单状态">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.state | filterState }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作时间"
                width='100'>
                <template slot-scope="scope">
                    <span>{{ scope.row.addTime | fitlerTime }}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页插件 -->
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
            <div class="footer_total">砍价金额合计：<span class="total_money">￥{{ totalMoney }}</span></div>
        </div>
    </div>
</template>

<script>
import { shareUserHelpBuy } from '@/api/helpBuy';
import { formartTime } from "@/util/util";
export default {
    data(){
        return {
            listQuery: {
                page: 1,
                limit: 10
            },
            formLabelWidth: '120px',
            totalMoney: 0,      //砍价金额合计
            searchObj: {
                orderNo: '',        //订单号
                productName: '',    //发起用户账号
                helpUser: '',
                startTime: '',
                endTime: '',
                storeName: '',               //所属店铺
                productNo: '',
                state: ''
            },
            orderStatusData: [                  //订单状态
                { label: '砍价中', value: '1' },
                { label: '砍价成功', value: '2' },
                { label: '已领取', value: '3' },
                { label: '砍价失败', value: '4' }
            ],
            list: [],
            listLoading: false,
            total: 0,
            activityTypeInfo: {             //活动信息
                appId: '',
                activityType: '',
                activityName: '',
                placeholder: ''
            },         
            baseUrl:"http://qiniu.edawtech.com/", 
            time: [],
            exportLoading: false
        }
    },
    computed:{},
    created(){
        this.getList()
    },
    methods: {
        // 获取列表数据
        getList(){
            this.listLoading = true;
            let postData = {
                ...this.searchObj,
                ...this.listQuery
            }
            shareUserHelpBuy(postData).then((res)=>{
                console.log(res,'用户帮购记录')
                this.list = res.data.records;
                this.total = res.data.total;
                this.totalMoney = res.data.condition.prices;
                this.listLoading = false;
                // this.getListDataForRowAndColumn(res.data.records)
            })
        },
        // 导出
        orderExport(){
            this.$notify({
                title: '导出中',
                message: '导出中，请稍等。。。',
                type: 'success',
                duration: 2000
            });
            this.exportLoading = true;                
            fetchOrderExport(this.searchObj).then(res => {
                this.exportLoading = false;                    
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                }
            });
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
                    if (data[i].nper === data[i - 1].nper && data[i].productNo === data[i - 1].productNo) {
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
            if ( columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13) {
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
        // 搜索
        search(){
            this.getList();
        },
        // 时间段查询
        selectTime(res){
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
        // 弹窗提示
        notify(res){
            if(res.data.code == 0){
                this.handleClose();
                this.getList();
            }
            this.$notify({
                title: res.data.code == 0 ? "成功" : '失败',
                message: res.data.msg,
                type: res.data.code == 0 ? "success" : 'error',
                duration: 1500
            });
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
    },
    filters: {
        fitlerTime(value){
            if(value){
                return formartTime(new Date(value), 5);
            }else{
                return ''
            }
        },
        filterState(val){
            if(val){
                let data = {
                    1: '砍价中',
                    2: '砍价成功',
                    3: '已领取',
                    4: '砍价失败'
                }
                return data[val]
            }
        }
    }
};
</script>

<style lang='scss' scoped>
  .pagination-container{
    display: flex;
  }
  .footer_total{
    margin-left: 50px;
  }
</style>