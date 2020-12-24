<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto; margin-left: 5px;">
                <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
            <el-input v-model="searchObj.productName"  clearable style="width:300px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品名称"></el-input>
            <el-input v-model="searchObj.productNo" clearable style="width:300px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品编号"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="商品编号" width="300">
                <template slot-scope="scope">
                    <span>{{ scope.row.productNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.productName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品主图" width="120">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                        <img  :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="100" width="100" >
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品销量">
                <template slot-scope="scope">
                    <span>{{ scope.row.saleNum }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { getGoodsStatistics } from "@/api/statistics/index";
    import {mapGetters, mapMutations} from "vuex";
    export default {
        data() {
            return {
                appId: '',
                currentAppList: [],
                listQuery: {
                    page: 1,
                    limit: 10
                },
                list: [],
                baseUrl:"http://qiniu.edawtech.com/",
                listLoading: true,
                total: 0,
                searchObj: {
                    productName: '',
                    productNo: ''
                }
            }
        },
        created() {
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
        },
        computed:{
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        methods: {
            async getList(){
                let postData = {
                    appId: this.appId,
                    ...this.listQuery,
                    ...this.searchObj
                }
                this.listLoading = true;
                const res = await getGoodsStatistics(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = res.data.total;
            },
            search(){
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            getDataByAppId(){
                this.getList();
            },
        },
    }
</script>
<style lang="scss">
    
</style>
