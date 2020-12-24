<template>
    <div>
        <!-- 分账配置 -->
        <!-- 筛选 -->
        <div class="filter-container">
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
            placeholder="请输入公司名称" 
            clearable>
            </el-input>
            <div class="s-category">
                <el-select 
                v-model="searObj.accountMethod" 
                placeholder="请选择分账方式" 
                clearable>
                    <el-option
                        v-for="item in accountMethodData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <el-input 
            v-model="searObj.subAccountNo" 
            style="width:200px;margin-right:10px;margin-bottom:10px" 
            prefix-icon="el-icon-search" 
            placeholder="请输入分账账号" 
            clearable>
            </el-input>
            <el-input 
            v-model="searObj.receiverName" 
            style="width:200px;margin-right:10px;margin-bottom:10px" 
            prefix-icon="el-icon-search" 
            placeholder="请输入接收方名称" 
            clearable>
            </el-input>
            <el-input 
            v-model="searObj.receiverNo" 
            style="width:200px;margin-right:10px;margin-bottom:10px" 
            prefix-icon="el-icon-search" 
            placeholder="请输入接收方账号" 
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
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="createConfig">添加分账配置</el-button>
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
                label="公司名全称">
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
                label="分账账号">
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
                label="接收方类型">
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
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="修改时间">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column 
                align="center" 
                label="操作" 
                width="200">
                <template slot-scope="scope">
                    <el-button 
                        type="primary" 
                        size="mini" 
                        @click="handleUpdate(scope.row)"
                        >编辑</el-button>
                    <el-button 
                        type="danger" 
                        size="mini" 
                        @click="handleDelete(scope.row)"
                        >删除</el-button>
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
                channelName: '',            //渠道名称
                name: '',                   //公司名称
                accountMethod: '',          //分账方式
                subAccountNo: '',           //分账账号
                receiverName: '',           //接收方名称
                receiverNo: '',             //接收方账号
                remarks: '',                //备注
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
            total: 0
        }
    },
    methods: {
        // 搜索
        search(){

        },
        // 添加分账配置
        createConfig(){

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
    }
};
</script>

<style>
</style>