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
            <el-table-column align="center" label="分润等级">
                <template scope="scope">
                    <span>{{ scope.row.grade }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="分润比例">
                <template scope="scope">
                    <el-input :disabled="scope.row.disabled" v-model="scope.row.profit" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" label="单位" width="100">
                <template scope="scope">
                    <span>%</span>
                </template>
            </el-table-column>
            <el-table-column v-if="rate_mange_editor"  align="center" label="操作" width="100">
                <template scope="scope">
                    <el-button v-if="rate_mange_editor" v-show="scope.row.disabled" size="small" type="primary"
                               @click="profitEditor(scope.$index, scope.row)">
                               编辑
                    </el-button>
                    <el-button v-if="rate_mange_editor" size="small" v-show="!scope.row.disabled" type="success"
                               @click="changeProfit(scope.$index, scope.row)">
                               修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { fetchRate, updateRate } from '@/api/order/index'
    import {mapGetters} from 'vuex'


    export default {
        data(){
            return {
                appId: '',
                currentAppList: [],
                list: [],
                listLoading: true,
                gradeList: ["白金","钻石"],
                rate_mange_editor: false
            }
        },
        computed: {
            ...mapGetters(['permissions']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getList();
            this.rate_mange_editor = this.permissions['rate_mange_editor']
        },
        methods: {
            getList(){
                this.listLoading = true
                 let postData = {
                    appId: this.appId
                }
                fetchRate(postData).then(res => {
                    this.listLoading = false;
                    this.appId = res.data.appId;
                    this.list = [];
                    JSON.parse(res.data.value).forEach( (item, index) => {
                        this.list.push({
                            grade: this.gradeList[index],
                            profit: item,
                            disabled: true,
                        })
                    });
                });
            },
            getDataByAppId(){
               this.getList(); 
            },
            profitEditor(_index, row) {
                this.list.forEach((item, index) => {
                    if(_index == index){
                        item.disabled = !row.disabled;
                    }
                });
            },
            changeProfit(_index, row){
                let postData = {};
                let tempArr = [];
                this.list.forEach((item, index) => {
                    tempArr.push(Number(item.profit));
                    if(_index == index){
                        item.disabled = !row.disabled;
                    }
                });
                postData.appId = this.appId;
                postData.value = JSON.stringify(tempArr);
                updateRate(postData).then(res => {
                    console.log(res);
                    this.getList();
                });
            },
        }
    }
</script>