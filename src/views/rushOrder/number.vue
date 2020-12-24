<template>
    <div>
        <!-- 抢购期数 -->
        <!-- 筛选 -->
        <div class="filter-container">
            <el-input
                v-model="searchObj.nper"
                style="width: 200px; margin-right: 10px; margin-bottom: 10px"
                prefix-icon="el-icon-search"
                placeholder="请输入抢购期数"
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
            <el-select v-model="searchObj.state"
                placeholder="请选择开奖状态"
                style="display: inline-block; width: auto;margin-bottom:20px;"
                clearable>
                <el-option
                    v-for="(item, index) in drawingStatusData"
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
        </div>
        <!-- 表格数据 -->
        <el-table
            :data="list"
            border
            v-loading="listLoading"
            fit
            highlight-current-row
            :span-method="objectSpanMethod"
            element-loading-text="给我一点时间"
            style="width:100%;margin-bottom:20px;">
            <el-table-column 
                align="center" 
                label="期数">
                <template slot-scope="scope">
                    <span>{{ scope.row.nper }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品名称">
                <template slot-scope="scope">
                    <span>{{scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品编号">
                <template slot-scope="scope">
                    <span>{{scope.row.productNo}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="商品主图"
                width='120'>
                <template slot-scope="scope">
                    <img :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="100" width="100"/>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="规格">
                <template slot-scope="scope">
                    <span>{{scope.row.specification}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="数量（件）">
                <template slot-scope="scope">
                    <span>{{ scope.row.number }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="金额（元）">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="需拼满团人数">
                <template slot-scope="scope">
                    <span>{{ scope.row.groupNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="可中奖人数">
                <template slot-scope="scope">
                    <span>{{ scope.row.winningNum }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="参与奖奖金">
                <template slot-scope="scope">
                    <span>{{ scope.row.bonus }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="开奖状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.state | filterState }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="结束时间"
                width='100'>
                <template slot-scope="scope">
                    <span>{{ scope.row.activityEndTime | fitlerTime }}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作">
                <template slot-scope="scope">
                    <el-button size='mini' type='primary' @click="seeDetail(scope.row)">查看</el-button>
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
        </div>
        <!-- 添加修改对话框 -->
        <el-dialog
            title="参与抢购详情"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-table
            :data="info"
            border
            fit
            highlight-current-row
            style="width:100%;margin-bottom:20px;">
                <el-table-column 
                    align="center" 
                    label="用户">
                    <template slot-scope="scope">
                        <span>{{ scope.row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    align="center" 
                    label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderState | filterStatus }}</span>
                    </template>
                </el-table-column>
            </el-table>
            
            <div slot="footer" class="dialog-footer" v-if='nperStatus == 1'>
                <el-button type="primary" @click="closeNper">取消拼团</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { selectNper, selectUserPhone, canelNper } from '@/api/rushOrder/index'
import { formartTime } from "@/util/util";
export default {
    data(){
        return {
            listQuery: {
                page: 1,
                limit: 10
            },
            searchObj: {
                productName: '',
                nper: '',
                state: '',
                startTime: '',
                endTime: '',
                productNo: ''
            },
            list: [],
            listLoading: false,
            total: 0,      
            dialogVisible: false, 
            activityIdDisabled: false,
            drawingStatusData: [            //开奖状态
                { label: '抢购中', value: '1' },
                { label: '已开奖', value: '2' },
                { label: '拼团失败', value: '3' }
            ],
            time: [],
            baseUrl:"http://qiniu.edawtech.com/",
            info: [],
            rowAndColumn: [],
            rowRoomColumn: [],
            nperStatus: '',
            nperId: ''
        }
    },
    computed:{
    },
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
            selectNper(postData).then((res)=>{
                this.list = res.data.data.records;
                this.total = res.data.data.total;
                this.listLoading = false;
                this.getListDataForRowAndColumn(res.data.data.records)
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
                    if (data[i].productNo === data[i - 1].productNo) {
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
            if ( columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 ) {
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
        // 查看
        seeDetail(obj){
            this.nperStatus = obj.state;
            this.nperId = obj.id;
            let postData = {
                nper: obj.nper,
                productNo: obj.productNo
            }
            selectUserPhone(postData).then((res)=>{
                this.info = res.data.data;
                console.log(this.info,'期数详情')
            })
            this.dialogVisible = true;
        },
        // 取消拼团
        closeNper(){
            let postData = {
                id: this.nperId
            }
            canelNper(postData).then((res)=>{
                console.log(res)
                this.$notify({
                    title: res.data.code == 0 ? '成功' : '失败',    
                    message: res.data.msg,
                    type: res.data.code == 0 ? 'success' : 'error',
                    duration: 2000
                });
                if(res.data.code == 0){
                    this.getList();
                    this.handleClose();
                }
            })
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
        // 关闭对话框
        handleClose(){
            this.dialogVisible = false;
            this.nperStatus = '';
            this.nperId = '';
        }
    },
    filters: {
        fitlerTime(value){
            return formartTime(new Date(value), 5);
        },
        // 中将状态
        filterStatus(val){
            let data = {
                0: '待支付',
                1: '已支付',
                2: '未中奖',
                3: '已中奖',
                4: '已发货',
                5: '已退款',
                6: '拼团失败'
            }
            return data[val]
        },
        // 开奖状态
        filterState(val){
            let data = {
                1: '抢购中',
                2: '已开奖',
                3: '拼团失败'
            }
            return data[val]
        }
    }
};
</script>

<style>
</style>