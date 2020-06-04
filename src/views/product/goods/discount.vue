<template>
    <div class="app-container calendar-list-container">
        <div>
            <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                </el-option>
            </el-select>
         </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="会员等级">
                <template scope="scope">
                    <span>{{ scope.row.level | levelFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="折扣">
                <template scope="scope">
                    <el-input :disabled="scope.row.disabled" v-model="scope.row.discount" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
                <template scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="操作" width="100">
                <template scope="scope">
                    <el-button v-show="scope.row.disabled" size="small" type="primary"
                               @click="profitEditor(scope.$index, scope.row)">
                               编辑
                    </el-button>
                    <el-button size="small" v-show="!scope.row.disabled" type="success"
                               @click="changeProfit(scope.$index, scope.row)">
                               修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>

    import { fetchList,updataDiscount } from '@/api/product/discount'
    import {mapGetters} from "vuex";
    export default {
        data() {
            return {
                appId: '',
                currentAppList: [],
                listQuery: {
                    page: 1,
                    limit: 30
                },
                listLoading: true,
                list: [],
            }
        },
        filters: {
            levelFilter(level){ 
                let levelMap = {
                    1: '钻石',
                    2: '白金',
                    3: '银卡',
                    4: '水晶'
                }
                return levelMap[level];
            }
        },
        computed: {
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
        },
        methods: {
            getList(){
                this.listLoading = true;
                
                let postData = {
                    ...this.listQuery,
                    appId: this.appId
                }

                fetchList(postData).then(res => {
                    this.listLoading = false;
                    this.list = [];
                    res.data.records.forEach((item, index) => {
                        this.list.push({
                            appId: item.appId,
                            discount: item.discount,
                            id: item.id,
                            level: item.level,
                            remark: item.remark,
                            disabled: true
                        })
                    });
                });
            },
            getDataByAppId(){
               this.getList(); 
            },
            profitEditor(_index, row){
                this.list.forEach((item, index) => {
                    if(_index == index){
                        item.disabled = !row.disabled;
                    }
                });
            },
            changeProfit(index, row){
                let postData = {
                    level: row.level,
                    discount: row.discount,
                    id: row.id,
                    appId: this.appId
                }
                if(postData.id && postData.appId){
                    updataDiscount(postData).then(res => {
                        console.log(res);
                        this.getList();
                        this.handleTip(res.statusText, res.data.msg);
                    })
                }else {
                    this.$notify({
                        title: "失败",
                        message: "id为空或appId为空",
                        type: "error",
                        duration: 2000
                    });
                }
            },
            handleTip(statusText,msg){
                this.$notify({
                    title: statusText,
                    message: msg,
                    type: "success",
                    duration: 2000
                });
            },
        },
    }
</script>