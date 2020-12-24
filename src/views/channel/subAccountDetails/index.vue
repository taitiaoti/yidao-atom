<template>
    <div>
        <!-- 分账明细 -->
        <!-- 筛选 -->
        <div class="filter-container">
            <el-input 
                v-model="searObj.orderNo" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入订单号" 
                clearable>
            </el-input>
            <el-input 
                v-model="searObj.channelId" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入渠道ID" 
                clearable>
            </el-input>
            <div class="s-category">
                <el-select
                v-model="searObj.channelName" 
                placeholder="请选择渠道名称" 
                clearable>
                    <el-option
                        v-for="item in channelData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <el-input 
                v-model="searObj.name" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入分账公司全名称" 
                clearable>
            </el-input>
            <el-input 
                v-model="searObj.subAccountNo" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入分账方账号" 
                clearable>
            </el-input>
            <el-input 
                v-model="searObj.receiverName" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入接收方全称" 
                clearable>
            </el-input>
            <el-input 
                v-model="searObj.receiverNo" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入接收方账号" 
                clearable>
            </el-input>
            <el-input 
                v-model="searObj.serialNumber" 
                style="width:200px;margin-right:10px;margin-bottom:10px" 
                prefix-icon="el-icon-search" 
                placeholder="请输入分账流水号" 
                clearable>
            </el-input>
            <div class="s-category">
                <el-select 
                v-model="searObj.remarks" 
                placeholder="请选择备注" 
                clearable>
                    <el-option
                        v-for="item in remarksData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
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
        <!-- 表格主体 -->
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
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="渠道ID">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="渠道名称">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账公司名全称">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账方账号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="实收金额">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账方式">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账金额比例">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="接收方全称">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="接收方账号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="分账流水号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作时间">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页插件 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNum"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            searObj: {
                orderNo: '',                //订单号
                channelId: '',              //渠道ID
                channelName: '',            //渠道名称
                name: '',                   //公司名称
                subAccountNo: '',           //分账账号
                receiverName: '',           //接收方名称
                receiverNo: '',             //接收方账号
                remarks: '',                //备注
                serialNumber: '',           //流水号
                startTime: '',              //开始时间
                endTime: '',              //结束时间
            },
            channelData: [],
            accountMethodData: [],
            remarksData: [],
            list: [],                   //数据列表
            listLoading: false,
            // 分页
            listQuery: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            time: []
        }
    },
    methods: {
        // 搜索
        search(){

        },
        //页码改变事件
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        // 时间段查询
        selectTime(res){
            if(res){
                this.time = [];
                this.searObj.startTime = formartTime(res[0], 5);
                this.searObj.endTime = formartTime(res[1], 5);
                this.time.push(formartTime(res[0], 5));
                this.time.push(formartTime(res[1], 5));
            }else {
                this.searObj.startTime = null;
                this.searObj.endTime = null;
            }
        },
    }
};
</script>

<style>
</style>