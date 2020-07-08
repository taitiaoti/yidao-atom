<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号">
        <template scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="应用名称">
        <template scope="scope">
            <span>{{scope.row.appId | filterAppName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="返回地址">
        <template scope="scope">
          <el-tag>{{scope.row.domainName}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="展示位置">
        <template scope="scope">
          <el-tag>{{scope.row.sort}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="费率" width="80px">
        <template scope="scope">
          <span>{{scope.row.rate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ip">
        <template scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="应用状态" width="120px">
        <template scope="scope">
          <el-tag :type="scope.row.status === 1 ? '' : 'danger'">{{scope.row.status === 1 ? '生效' : '失效'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220px">
        <template scope="scope">
          <el-button size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger"
                     @click="handleDelete(scope.row)">失效设置
          </el-button>
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
    
    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="应用名称" prop="file" :label-width="formLabelWidth">
          <el-input v-model="form.appId" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="返回地址" :label-width="formLabelWidth">
          <el-input v-model="form.domainName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="费率"  :label-width="formLabelWidth">
          <el-input v-model="form.rate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ip"  :label-width="formLabelWidth">
          <el-input v-model="form.ip" placeholder=""></el-input>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createInitPage">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchList, fetchAppById, fetchUpdate, fetchAdd, fetchAppDelete} from "@/api/call/index"
  import { getAppName } from "@/util/util";
  import {mapGetters} from "vuex";

  export default {
    data(){
      return {
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        form:{},
        listLoading: true,
        list: [],
        tableKey: 0,
        dialogStatus: "",
        formLabelWidth: '100px',
        id: '',
        total: null
      }
    },
    computed: {
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    created(){
      this.getList();
    },
    filters: {
      typeFilter(status){
        const statusMap = {
          1: "启动页",
          2: "引导页"
        };
        return statusMap[status];
      },
      filterAppName(appId){
        return getAppName(appId)
      }
    },
    methods:{
      getList(){
        this.resetForm();
        this.listLoading = true;
        // getInitPageList(this.listQuery).then(res => {
        //   console.log(res,'获取启动页面图列表');
        //   this.list = res.data.records;
        //   this.listLoading = false;
        // });
        fetchList(this.listQuery).then(res => {
            let tempArr = [];
            this.list = res.data.records;
            this.appIdList.forEach(item => {
              this.list.forEach(item02 => {
                if(item.appId == item02.appId){
                  tempArr.push(item02);
                }
              });
            })
            this.list = tempArr;
            this.total = res.data.total;
            this.listLoading = false;
        });
      },
      handleCreate(){
        this.dialogFormVisible = true;
        this.resetForm();
        this.dialogStatus = "create";
      },
      uploadSuccess(res, file) {
        this.form.imageUrl = res.imagePath;
      },
      createInitPage(){
        // let postData = {
        //   type: this.form.type,
        //   imageUrl: this.imageUrl
        // }
        fetchAdd(this.form).then( res => {
          this.dialogFormVisible = false;
          this.getList();
          this.handleTip(res.statusText, res.data.msg);
        });
      },
      handleUpdate(row){
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.form.domainName = row.domainName;
        this.form.appId = row.appId;
        this.form.rate = row.rate;
        this.form.ip = row.ip;
        this.id = row.id;
      },
      update(formName){
          //this.dialogFormVisible = false;
          console.log(this.form,'9090');
          let postData = this.form;
          postData.id = this.id;
          fetchUpdate(postData).then(res => {
            this.dialogFormVisible = false;
            this.handleTip(res.statusText, res.data.msg);
            this.getList();
          });
      },
      imageUrlFilter(path){
        if(path.indexOf('http')==0)
          return path.split(this.baseUrl)[1];
        else
          return path;
      },
      handleDelete(row){
        this.$alert('你确定设置改项失效', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if(action == 'confirm'){
              if(row.id){
                fetchAppDelete(row.id).then(res => {
                  console.log(res);
                  this.dialogFormVisible = false;
                  this.resetForm();
                  this.getList();
                  this.handleTip(res.statusText, res.data.msg);
                });
              }else {
                this.$notify({
                  title: "失败",
                  message: "id为空",
                  type: "error",
                  duration: 2000
                });
              }
            }   
          }
        });
      },
      handleTip(statusText,msg){
        this.$notify({
          title: statusText,
          message: msg,
          type: "success",
          duration: 2000
        });
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList()
      },
      resetForm() {
        this.fileList=[];
        this.form = {
          domainName: '',
          appId: '',
          rate: '',
          ip: ''
        };
      },
    },
  };
</script>
