<template>
    <div style="padding: 10px;">
        <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="jumpAdd">添加</el-button>
        </div>
        <div>
            <el-input v-model="templateName" style="width:250px;margin-bottom: 20px;" prefix-icon="el-icon-search" placeholder="请输入运费模板名称" clearable></el-input>
            <el-button type="primary" @click="seachTemplate">搜索</el-button>
        </div>
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                label="序号">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="模板名称">
                <template slot-scope="scope">
                    <span>{{scope.row.templateName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="运送方式">
                <template slot-scope="scope">
                    <span>{{scope.row.shipperName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="是否包邮">
                <template slot-scope="scope">
                    <span>{{scope.row.isPost | filterIspost}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220px">
                <template slot-scope="scope">
                    <el-button size="small" @click="editor(scope.row)">编辑</el-button>
                    <!-- <el-button size="mini" type="danger"
                                @click="handleDelete(scope.row)">删除
                    </el-button> -->
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
    import { getTemplateList,seachTemplateList } from '@/api/freight/index'
    import { fetchShipper } from '@/api/order/index'
    import { resolveUrlPath } from "@/util/util";

    export default {
        data(){
            return {
                listQuery:{
                    page: 1,
                    limit: 10
                },
                list: [],
                total: null,
                listLoading: true,
                templateName: ''
            }
        },
        created(){
            this.getList();
            this.getShipper();
        },
        methods: {
            async getList(){
                let postData = {
                    ...this.listQuery
                }
                const resArr = await Promise.all([getTemplateList(postData), fetchShipper()]);
                this.listLoading = false;
                this.list = resArr[0].data.records;
                this.total = resArr[0].data.total;
                resArr[0].data.records.forEach(item => {
                    resArr[1].data.forEach(item02 => {
                        if(item.shipperCode == item02.shipperCode){
                            item.shipperName = item02.shipperName;
                        }
                    });
                });
            },
            async seachTemplate(){
                if(this.templateName){
                    let postData = {
                        ...this.listQuery,
                        templateName: this.templateName
                    }
                    const resArr = await Promise.all([seachTemplateList(postData), fetchShipper()]);
                    this.listLoading = false;
                    this.list = resArr[0].data.records;
                    this.total = resArr[0].data.total;
                    resArr[0].data.records.forEach(item => {
                        resArr[1].data.forEach(item02 => {
                            if(item.shipperCode == item02.shipperCode){
                                item.shipperName = item02.shipperName;
                            }
                        });
                    });
                }else{
                    this.getList();
                }
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            editor(row){
                this.$router.push({
                    path: resolveUrlPath("/freight/add"),
                    query: {
                        id: row.id, 
                    }
                });
            },
            jumpAdd(){
                this.$router.push({
                    path: resolveUrlPath("/freight/add"),
                });
            }
        },
        beforeRouteEnter(to,from,next) {
            next(vm => {
                if(to.query.isAdd){
                    vm.getList(); 
                }
            });
        },
        filters: {
            filterIspost(val){
                let statusMap = {
                    0: '自定义运费',
                    1: '卖家承担运费'
                }
                return statusMap[val]
            }
        }
    }
</script>
