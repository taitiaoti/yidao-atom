<template>
    <div>
        <!-- <div style="margin-bottom: 10px;">
            <el-input v-model="uid" clearable style="width: 200px;" placeholder="请输入UID"></el-input>        
            <el-input v-model="phone" clearable style="width: 200px;" placeholder="请输入手机号"></el-input>        
            <el-input v-model="agentId" clearable style="width: 200px;" placeholder="请输入渠道号"></el-input>        
            <el-input v-model="agentName" clearable style="width: 200px;" placeholder="请输入渠道名称"></el-input> 
            <el-date-picker
                style="width: 400px;"
                v-model="searchTime"
                type="datetimerange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>    
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>    -->
        <el-table
            v-loading="listLoading"
            :data="list"
            :span-method="mergeRow"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                label="代理渠道号">
                <template slot-scope="scope">
                    <span>{{scope.row.agentId}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="300"
                align="center"
                label="拥有充值卡信息">
                <template slot-scope="scope">
                    <span>{{scope.row.minCardNo}} - {{scope.row.maxCardNo}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="充值卡数量">
                <template slot-scope="scope">
                    <span>{{scope.row.cardNum}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="180px"
                align="center"
                label="分配时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>
             <el-table-column
                width="300"
                align="center"
                label="指派下级充值卡信息">
                <template slot-scope="scope">
                    <span>{{scope.row.detailsMinCardNo}} - {{scope.row.detailsMaxCardNo}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="充值卡数量">
                <template slot-scope="scope">
                    <span>{{scope.row.detailsCardNum}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="下级代理渠道号">
                <template slot-scope="scope">
                    <span>{{scope.row.detailsAgentId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                width="180px"
                label="指派时间">
                <template slot-scope="scope">
                    <span>{{scope.row.detailsCreateTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="!scope.row.detailsAgentId" size="small" @click="batchCar">分配充值卡</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="分配充值卡" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="form">
                <el-form-item label="开始卡号" :label-width="formLabelWidth">
                    <el-input v-model="form.startCardNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="结束卡号" :label-width="formLabelWidth">
                    <el-input v-model="form.endCardNo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下级代理渠道号" :label-width="formLabelWidth">
                    <el-select v-model="form.value" @change="getLevelAgentId" value-key="id" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确定分配</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { agentCartBatch, cartBatch } from '@/api/saas/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime,getAppName } from "@/util/util";

    export default{
        data(){
            return {
                appId: '',
                listLoading: true,
                list: [],
                listQuery:{
                    start: 1,
                    length: 10
                },
                phone: '',
                uid: '',
                agentId: '',
                agentName: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                currentAppList: [],
                total: null,
                spanArr: [],
                dialogFormVisible: false,
                form: {
                    appId: '',
                    startCardNo: '',
                    endCardNo: '',
                    level: '',
                    value: ''
                },
                formLabelWidth: '110px',
                options: []
            }
        },
        computed:{
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
            async getList(){
                let postData = {
                    appId: this.appId,
                    // ...this.listQuery,
                    // uid: this.uid,
                    // phone: this.phone,
                    // agentId: this.agentId,
                    // agentName: this.agentName,
                    // startTime: this.startTime,
                    // endTime: this.endTime
                }
                const res = await agentCartBatch(postData);
                let tempArr = [];
                this.options = [];
                res.data.agents.forEach(item => {
                    this.options.push({
                        label: item.name,
                        value: {
                            id: item.id,
                            level: item
                        }
                    });
                });

                if(res.data.cards != 0){
                    res.data.cards.forEach(item => {
                        if(item.details.length != 0){
                            item.details.forEach(item02 => {
                                tempArr.push({
                                    sn: item.sn,
                                    agentId: item.agentId,
                                    agentName: item.agentName,
                                    minCardNo: item.minCardNo,
                                    maxCardNo: item.maxCardNo,
                                    cardNum: item.cardNum,
                                    createTime: item.createTime,
                                    detailsSn: item02.sn,
                                    detailsAgentId: item02.agentId,
                                    detailsAgentName: item02.agentName,
                                    detailsMinCardNo: item02.minCardNo,
                                    detailsMaxCardNo: item02.maxCardNo,
                                    detailsCardNum: item02.cardNum,
                                    detailsCreateTime: item02.createTime,
                                    detailsDetails: item02.details
                                });
                            });
                        }else {
                            tempArr.push({
                                sn: item.sn,
                                agentId: item.agentId,
                                agentName: item.agentName,
                                minCardNo: item.minCardNo,
                                maxCardNo: item.maxCardNo,
                                cardNum: item.cardNum,
                                createTime: item.createTime
                            });
                        }
                    });
                }
                this.list = tempArr;
                this.getSpanArr(tempArr);
                // this.total = res.data.iTotalRecords;
                this.listLoading = false;
                console.log(res, '个人充值卡分配'); 
            },
            mergeRow({ row, column, rowIndex, columnIndex }){
                if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            getSpanArr(data) {　
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                    // 判断当前元素与上一个元素是否相同
                        if (data[i].sn === data[i - 1].sn) {
                                this.spanArr[this.pos] += 1;
                                this.spanArr.push(0);
                            } else {
                                this.spanArr.push(1);
                                this.pos = i;
                         }
                    }
                }
            },
            getLevelAgentId(val){
           
            },
            batchCar(){
                this.resetForm();
                this.dialogFormVisible = true;
                this.form.appId = this.appId;
            },
            async submit(){
                let postData = {
                    appId: this.form.appId,
                    startCardNo: this.form.startCardNo,
                    endCardNo: this.form.endCardNo,
                    agentId: this.form.value.id,
                    level: this.form.value.level.level,
                }
                const res = await cartBatch(postData);
                this.$notify({
                    title: res.data.code == 0 ? res.statusText : res.data.message,
                    message: res.data.code == 0 ? '成功' : '失败',
                    type: res.data.code == 0 ? 'success' : 'error',
                    duration: 2000
                });
                if(res.data.code == 0){
                    this.getList();
                }
                this.dialogFormVisible = false;
            },
            resetForm(){
                this.form = {
                    appId: '',
                    startCardNo: '',
                    endCardNo: '',
                    level: '',
                    value: ''
                }
            }
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId)
            }
        }
    }
</script>
<style lang="scss">

</style>
