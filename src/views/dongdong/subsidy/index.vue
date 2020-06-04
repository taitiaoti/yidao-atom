<template>
    <div style="padding: 10px;">
        <div style="margin-bottom: 10px; position:relative;">
            <el-select v-model="position" clearable style="width:260px;" @change="selectPosition" placeholder="请选择职级">
                <el-option
                    v-for="item in rankList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <div style="display: inline-block;">
                <el-button slot="reference" type="primary" :disabled="!position" @click="allSend">根据职级批量发送补贴</el-button>
            </div>
        </div>
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            @selection-change="selectData"
            style="width: 100%">
            <!-- <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column> -->
            <el-table-column
                align="center"
                label="账号">
                <template scope="scope">
                    <span>{{scope.row.phone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="UID">
                <template scope="scope">
                    <span>{{scope.row.uid}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="职级">
                <template scope="scope">
                    <span>{{scope.row.position}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="开发顾客">
                <template scope="scope">
                    <span>{{scope.row.developmentCustomer}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="服务顾客">
                <template scope="scope">
                    <span>{{scope.row.serviceCustomer}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="拨比（%）">
                <template scope="scope">
                    <span>{{scope.row.ratio}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="每日补贴（大概数）">
                <template scope="scope">
                    <span>{{scope.row.subsidyMoney | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="补贴总额（不叠加）">
                <template scope="scope">
                    <span>{{scope.row.subsidyTotalMoney | filterMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240px">
                <template scope="scope">
                    <el-input v-model="scope.row.money" @change="getMoney(scope.row)" style="width:110px;margin-right: 5px;" placeholder="输入补贴金额" size="small"></el-input>
                    <el-button slot="reference" type="primary" size="small"  @click="send(scope.row)">发送补贴</el-button>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
            <el-form>
                <el-form-item label="补贴人数" :label-width="formLabelWidth">
                    <el-tag type="info">{{personNumber}}</el-tag>
                </el-form-item>
                <el-form-item label="补贴金额" :label-width="formLabelWidth">
                    <el-input v-model="batchMoney" style="width:200px;" placeholder="请输入补贴金额"></el-input>
                    <span>（元 / 个人）</span>
                </el-form-item>
                <el-form-item label="不补贴账号列表" :label-width="formLabelWidth">
                    <div class="tag-wrappper">
                        <el-tag
                            :key="tag"
                            v-for="tag in dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag"  @click="showInput" style="width:100px; margin-left: 0;">+ 添加账号</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitRecharge">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { fetchSubsidy, sendSubsidy, fetchUidByPhone, batchSendSubsidy, fetchCountByPosition } from '@/api/dongdong/spread'
    import { resolveUrlPath, bcdiv } from "@/util/util";
    import { rankMap, rankList } from "@/util/data";
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data(){
            return {
                listQuery:{
                    page: 1,
                    limit: 10
                },
                appId: '',
                list: [],
                total: null,
                listLoading: true,
                isShowPopover: false,
                selectedList: [],
                position: '',
                rankList: rankList,
                dialogFormVisible: false,
                form: {

                },
                formLabelWidth: '150px',
                dialogTitle: '',
                dynamicTags: [],
                blacklist: [],
                inputVisible: false,
                inputValue: '',
                batchMoney: '',
                personNumber: ""
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
                    appId: 'dongdong',
                    position: this.position,
                    ...this.listQuery,
                }
                const res = await fetchSubsidy(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.list.forEach(item => {
                    this.$set(item, 'money', null); //响应式添加根对象属性 
                });
               
                this.total = res.data.total;
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList()
            },
            selectPosition(val){
                this.dialogTitle = '为' + rankMap[val] + '级别员工批量发送补贴'
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            async handleInputConfirm() {
                let isSubmit = true;
                if(this.dynamicTags.length != 0){
                    this.dynamicTags.forEach(item => {
                        if(item == this.inputValue){
                            this.$notify({
                                title: '该用户已存在',
                                type: 'error',
                                duration: 2000
                            });
                            isSubmit = false;
                            this.inputVisible = false;
                            this.inputValue = '';
                        }
                    });
                }
                if(isSubmit){
                    let postData = {
                        appId: 'dongdong',
                        phone: this.inputValue
                    }
                    const res = await fetchUidByPhone(postData);
                    if(res.data.data){
                        let inputValue = this.inputValue;
                        if (inputValue) {
                            this.dynamicTags.push(inputValue);
                            this.blacklist.push(res.data.msg);
                        }
                    }
                    this.inputVisible = false;
                    this.inputValue = '';
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.data ? '添加成功':res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                }
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.blacklist.splice(this.blacklist.indexOf(tag), 1);
            },
            async send(row){
                let postArr = []
                let postData = {
                    appId: row.appId,
                    uid: row.uid,
                    money: row.money,
                    phone: row.phone
                }
                if(postData.money){
                    postArr.push(postData);
                    const res = await sendSubsidy(postArr)
                    if(res.data.data){
                        this.getList();
                    }
                    this.$notify({
                        title: res.data.data ? res.statusText : res.data.msg,
                        message: res.data.msg,
                        type: res.data.data ? 'success' : 'error',
                        duration: 2000
                    });
                }else {
                    this.$notify({
                        title: '请输入补贴金额',
                        message: '操作有误',
                        type: 'warning',
                        duration: 3000
                    });
                }
            },
            selectData(selection){
                this.selectedList = selection;
            },
            getMoney(row){
                if(this.selectedList.length != 0){
                    this.selectedList.forEach(item => {
                        if(item.uid == row.uid){
                            item.money = row.money
                        }
                    })
                }
            },
            async allSend(){
                this.dialogFormVisible = true;
                let postData = {
                    appId: 'dongdong',
                    position:this.position
                }
                const res = await fetchCountByPosition(postData);
                this.personNumber = res.data.msg;
                // if(this.selectedList.length != 0){
                //     let postArr = [];
                //     this.selectedList.forEach(item => {
                //         postArr.push({
                //             appId: item.appId,
                //             uid: item.uid,
                //             money: item.money,
                //             phone: item.phone
                //         });
                //     });
                //     const res = await sendSubsidy(postArr)
                //     if(res.data.data){
                //         this.getList();
                //     }
                //     this.$notify({
                //         title: res.data.data ? res.statusText : res.data.msg,
                //         message: res.data.msg,
                //         type: res.data.data ? 'success' : 'error',
                //         duration: 2000
                //     });
                // }else {
                //     this.$notify({
                //         title: '发送无效',
                //         message: '未选择用户',
                //         type: 'warning',
                //         duration: 2000
                //     });
                // }
            },
            async submitRecharge(){
                let postData = {
                    appId: 'dongdong',
                    position: this.position,
                    money: Number(this.batchMoney),
                    blacklist: this.blacklist
                }
                const res = await batchSendSubsidy(postData);
                if(res.data.data){
                    this.getList();
                    this.dialogFormVisible = false;
                    this.dynamicTags = [];
                    this.blacklist = [];
                    this.batchMoney = '';
                }
                this.$notify({
                    title: res.data.data ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 2000
                });
                console.log(res, '66767999');
            },
            search(){
                this.getList();
            }
        },
        filters: {
            filterRank(value){
                if(value){
                    return rankMap[value];
                }
            },
            filterMoney(value){
                return bcdiv(Number(value), 10000, 2);
            }
        }
    }
</script>
<style lang="scss">
    .tag-wrappper{
        .el-tag + .el-tag {
            margin-left: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
    }
</style>

