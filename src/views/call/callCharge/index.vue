<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center"  label="应用名称">
        <template scope="scope">
            <span>{{ scope.row.appId | filterAppName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总金额 / （元）">
        <template scope="scope">
          <span>{{scope.row.totalMoney | filterMoney}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="已使用金额 / （元）">
        <template scope="scope">
          <span>{{scope.row.totalUseMoney | filterMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="话费余额 / （元）">
        <template scope="scope">
          <span>{{scope.row.balance | filterMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220px">
        <template scope="scope">
          <el-button size="small" type="success"
                     @click="handleUpdate(scope.row)">充值
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
          <el-input :disabled="disabled" v-model="form.appId" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="充值金额（元）" :label-width="formLabelWidth">
          <el-input v-model="form.rechargeMoney" placeholder=""></el-input>
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
  import { fetchBalanceList, fetchRechargeMoney} from "@/api/call/index"
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
        formLabelWidth: '120px',
        total: null,
        disabled: true
      }
    },
    created(){
      this.getList();
    },
    filters: {
      filterMoney(money){
          return money/100
      },
      filterAppName(appId){
        return getAppName(appId)
      }
    },
    computed: {
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    methods:{
      getList(){
        this.resetForm();
        this.listLoading = true;
        fetchBalanceList(this.listQuery).then(res => {
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
          this.listLoading = false;
          this.total = res.data.total;
        });
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
        this.form.appId = row.appId;
      },
      update(formName){
          fetchRechargeMoney(this.form).then(res => {
            this.dialogFormVisible = false;
            this.handleTip(res.statusText, res.data.msg);
            this.getList();
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
          appId: '',
          rechargeMoney: ''
        };
      },
    },
  };
</script>
