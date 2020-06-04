<template>
    <div class="app-container calendar-list-container">
        <div style="margin-bottom: 10px;">
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
            <!-- <el-select v-model="level" clearable  placeholder="请选择" style="display: inline-block; width: auto;margin-bottom:20px;">
                <el-option
                v-for="(item, index) in levelList"
                :key="index"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                </el-option>
            </el-select> -->
            <el-input v-model="makerId" clearable style="width: 200px;" placeholder="请输入创客账户"></el-input>        
            <el-input v-model="makerName" clearable style="width: 200px;" placeholder="请输入创客姓名"></el-input>        
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
        </div>   
        <el-table
            v-loading="listLoading"
            :data="list"
            border
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                width="100"
                label="创客ID">
                <template scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="账号">
                <template scope="scope">
                    <span>{{scope.row.makerId}}</span>
                </template>
            </el-table-column>
             <el-table-column
                align="center"
                label="名称">
                <template scope="scope">
                    <span>{{scope.row.makerName}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="上级代理商">
                <template scope="scope">
                    <span>{{scope.row.superName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100"
                label="代理商级别">
                <template scope="scope">
                    <span>{{scope.row.level}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                label="备注信息">
                <template scope="scope">
                    <span>
                        {{scope.row.remark}}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="账号状态">
                <template scope="scope">
                    <el-tag>{{scope.row.status | filterStatus}}</el-tag>
                </template>
            </el-table-column> -->
             <el-table-column
                align="center"
                label="审核状态">
                <template scope="scope">
                    <el-tag>{{scope.row.auditStatus | filterAuditStatus}}</el-tag>
                </template>
            </el-table-column>
            <!-- <el-table-column
                align="center"
                label="角色名称">
                <template scope="scope">
                    <span>{{scope.row.roleName}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                align="center"
                width="160"
                label="创建时间">
                <template scope="scope">
                    <span>{{scope.row.ctime | filterTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="160"
                label="修改时间">
                <template scope="scope">
                    <span>{{scope.row.mtime | filterTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="300"
                label="操作">
                <template scope="scope">
                    <el-button type="success" @click="findAgent(scope.row)" size="small">查看详情</el-button>
                    <el-button type="primary" :disabled="scope.row.auditStatus != 0" @click="pass(scope.row)" v-if="agent_pass" size="small">通过审核</el-button>
                    <el-button type="danger" :disabled="scope.row.auditStatus != 0" @click="refuse(scope.row)" v-if="agent_refuse" size="small">拒绝通过</el-button>
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
        <div class="agent-dialog">
            <el-dialog
                title="创客详情"
                :visible.sync="dialogVisible"
                width="600px">
                <el-row>
                    <el-col :span="12">
                        <div class="agent-dialog-item">
                            <span class="item-left">创客账号：</span>
                            <span class="item-right">{{agentDetail.makerId}}</span>
                        </div>
                    </el-col>
                    <el-col :span="12"> 
                        <div class="agent-dialog-item">
                            <span class="item-left">创客姓名：</span>
                            <span class="item-right">{{agentDetail.makerName}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="agent-dialog-item">
                            <span class="item-left">手机号码：</span>
                            <span class="item-right">{{agentDetail.phone}}</span>
                        </div>
                    </el-col>
                    <el-col :span="12"> 
                        <div class="agent-dialog-item">
                            <span class="item-left">E-mail：</span>
                            <span class="item-right">{{agentDetail.email}}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="agent-dialog-item">
                            <span class="item-left">公司名：</span>
                            <span class="item-right">{{agentDetail.company}}</span>
                        </div>
                    </el-col>
                    <el-col :span="12"> 
                        <div class="agent-dialog-item">
                            <span class="item-left">联系地址：</span>
                            <span class="item-right">{{agentDetail.address}}</span>
                        </div>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="12">
                        <div class="agent-dialog-item">
                            <span class="item-left">备注信息：</span>
                            <span class="item-right">{{agentDetail.remark}}</span>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>    
        <el-dialog title="拒绝通过审核" :visible.sync="dialogFormVisible" width="600px">
          <el-form>
            <el-form-item label="拒绝理由：" :label-width="formLabelWidth">
              <el-input v-model="reason" :autosize="autosize" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitRefuse">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
    import { checkAgentList, agentPass, agentRefuse, findAgentById } from '@/api/saas/index'
    import { makerCheckList, findMakerById, makerPass, makerRefuse } from '@/api/maker/index'
    import {mapGetters, mapMutations} from 'vuex';
    import {bcdiv, formartTime,getAppName } from "@/util/util";

    export default{
        data(){
            return {
                appId: '',
                listLoading: true,
                list: [],
                listQuery:{
                    page: 0,
                    limit: 10
                },
                phone: '',
                makerId: '',
                makerName: '',
                startTime: '',
                endTime: '',
                searchTime: '',
                currentAppList: [],
                total: null,
                level: '',
                levelList: [{
                    label: '一级代理商',
                    value: 1
                },{
                    label: '二级代理商',
                    value: 2
                }],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                agent_pass: false,
                agent_refuse: false,
                dialogVisible: false,
                agentDetail: {},
                dialogFormVisible: false,
                tempAgentId: '',
                reason: '',
                autosize: {minRows:4, maxRows: 6},
                formLabelWidth: '90px',
            }
        },
        computed:{
            ...mapGetters(['permissions']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        created(){
            this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.agent_pass = this.permissions['agent_pass'];
            this.agent_refuse = this.permissions['agent_refuse'];
            this.getList();
        },
        methods: {
            async getList(){
                let postData = {
                    appId: this.appId,
                    ...this.listQuery,
                    makerId: this.makerId,
                    makerName: this.makerName,
                    // level: this.level,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
                const res = await makerCheckList(postData);
                this.list = res.data.records;
                this.total = res.data.total;
                this.listLoading = false;
            },
            async findAgent({id}){
                this.dialogVisible = true;
                const res = await findMakerById(id);
                this.agentDetail = res.data;
            },
            async pass({id}){
                this.$alert('请确认是否补全审核信息', '通过', {
                    confirmButtonText: '确定',
                    callback: async action => {
                        if(action == 'confirm'){
                            const res = await makerPass(id);
                            this.$notify({
                                title: res.data.data ? '成功' : '错误',
                                message: res.data.msg,
                                type: res.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                            this.getList();
                        }
                    }
                });
            },
            refuse({id}){
                if(id){
                    this.tempAgentId = id;
                    this.dialogFormVisible = true;
                }else {
                    this.$notify({
                        title: '错误',
                        message: '代理商ID不存在',
                        type: 'error',
                        duration: 2000
                    });
                }
            },
            async submitRefuse(){
                const res = await makerRefuse(this.tempAgentId,{reason: this.reason});
                this.$notify({
                    title: res.data.data ? '成功' : '错误',
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 2000
                });
                this.dialogFormVisible = false;
                this.getList();
            },
            search(){
                if(this.searchTime){
                    this.startTime = formartTime(this.searchTime[0],5);
                    this.endTime = formartTime(this.searchTime[1],5);
                }else {
                    this.startTime = "";
                    this.endTime = "";
                }
                this.listQuery.page = 0;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            getDataByAppId(){
               this.getList(); 
            },
        },
        filters: {
            filterAppName(appId){
                return getAppName(appId);
            },
            filterAuditStatus(value){
                let mapList = {
                    '0': '等待审核',
                    '1': '已通过',
                    '2': '已拒绝',
                    'null': '已通过'
                }
                return mapList[value];
            },
            filterStatus(value){
                let mapList = {
                    'y': '正常',
                    'n': '冻结'
                }
                return mapList[value];
            },
            filterTime(value){
                return formartTime(new Date(value), 5)
            }
        }
    }
</script>
<style lang="scss">
    .agent-dialog{
        .el-dialog__body{
            padding: 5px 20px 20px 20px;
        }
        .agent-dialog-item{
            padding: 10px 0;
            .item-left{
                font-size: 16px;
            }
            .item-right{

            }
        }
    }
</style>
