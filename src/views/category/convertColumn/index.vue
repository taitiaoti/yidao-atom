<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="display: flex;" v-if="convert_add">
      <el-button class="filter-item" @click="openAdd"
            type="primary" icon="edit">添加
      </el-button>
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
    </div>
    <el-table :data="cartgoryList" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center"  label="序号" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="栏目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.columnName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目位置" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sort}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" :type="scope.row.isShow == 'y' ? 'danger' : 'primary'"
                     @click="updateOnShow(scope.row)">
              {{scope.row.isShow == 'y' ? '下架' : '上架'}}
          </el-button>
          <el-button v-if="convert_editor" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="convert_delete" size="mini" type="danger"
                     @click="handleDelete(scope.row)">删除
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
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form :model="columnInfo" label-width="115px">
        <el-form-item label="绑定APP">
          <el-select v-model="columnInfo.appId" placeholder="请选择需要绑定的APP">
            <el-option
              v-for="(item, index) in currentAppList"
              :key="index"
              :label="item.appName"
              :value="item.appId">
              <span style="float: left">{{ item.appName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input v-model="columnInfo.columnName"></el-input>
        </el-form-item>
        <el-form-item label="栏目位置">
          <el-input v-model="columnInfo.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="!!this.id" @click="comfirmUpdate">修改</el-button>
        <el-button type="primary" v-if="!this.id" @click="fecthAddColumn">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//   import {
//     fetchBusinessEnterprise,
//     fetchBusinessEnterpriseById,
//     addBusinessEnterprise,
//     editorBusinessEnterprise,
//     deleteBusinessEnterprise,
//     editorSamqiColumnOnshow
//   } from "@/api/category/businessEnterprise";
  import { 
    fetchConvert,
    fetchConvertById,
    addConvert,
    editorConvert,
    deleteConvert,
    editorConvertOnshow
  } from "@/api/category/convert"
  import {mapGetters, mapMutations} from "vuex";

  export default {
    data(){
      return {
        appId: '',
        currentAppList: [],
        cartgoryList: [],
        listLoading: true,
        baseUrl:"http://qiniu.edawtech.com/",
        dialogFormVisible: false,
        columnInfo: {},
        fileList: [],
        id: '',
        convert_add:false,
        convert_editor: false,
        convert_delete: false,      
        listQuery: {
          page: 1,
          limit: 10
        },
        total: null
      }
    },
    computed:{
      ...mapGetters(['permissions','businessEnterpriseQueryList']),
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    created(){
      this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      this.listQuery.limit = this.businessEnterpriseQueryList['limit'];
      this.listQuery.page = this.businessEnterpriseQueryList['page'];
      this.convert_add = this.permissions["convert_add"];
      this.convert_editor = this.permissions["convert_editor"];
      this.convert_delete = this.permissions["convert_delete"];
      this.getList();
    },
    filters: {
    },
    methods:{
      ...mapMutations({
        setPage: 'set_businessEnterprise_page',
        setLimit: 'set_businessEnterprise_limit'
      }),
      getList(){
        this.listLoading = true;
        let postData = {
          ...this.listQuery,
          appId: this.appId
        }

        fetchConvert(postData).then(res => {
          console.log(res, '兑换栏目列表');
          this.cartgoryList = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
        });
      },
      getDataByAppId(){
        this.getList();
      },
      handleUpdate(row){
        this.dialogFormVisible = true
        this.id = row.id
        fetchConvertById(row.id).then(res => {
          console.log(res, '通过Id获取栏目信息');
          this.columnInfo = res.data
        });
      },
      uploadSuccess(res, file) {
        console.log(res,'上传成功');
        this.columnInfo.iconUrl = res.imagePath;
      },
      handleRemove(file,fileList){
        this.columnInfo.iconUrl = ''
        delColumnIcon(this.id).then(res => {
          console.log(res, '删除图标');
        });
      },
      comfirmUpdate(){
        this.dialogFormVisible = false;
        let postData = {
            appId: this.columnInfo.appId,
            id: this.columnInfo.id,
            columnName: this.columnInfo.columnName,
            parent: this.columnInfo.parent,
            sort: this.columnInfo.sort,
        }
        editorConvert(postData).then(res => {
            this.$notify({
                title: res.statusText,
                message: res.data.msg,
                type: "success",
                duration: 2000
            });
            this.getList();
        });
      },
      openAdd(){
        this.dialogFormVisible = true
      },
      fecthAddColumn(){
        let postData = {
          appId: this.columnInfo.appId,
          columnName: this.columnInfo.columnName,
          parent: 0,
          sort: this.columnInfo.sort,
        }
        addConvert(postData).then(res => {
          this.$notify({
            title: res.statusText,
            message: res.data.msg,
            type: "success",
            duration: 2000
          });
          this.dialogFormVisible = false
          this.getList()
        });
      },
      handleDelete(row){
        this.$alert('你确定删除该商企栏目？', '删除', {
          confirmButtonText: '确定',
          callback: action => {
            if(action == 'confirm'){
              if(row.id){
                deleteConvert(row.id).then(res => {
                  this.$notify({
                    title: res.statusText,
                    message: res.data.msg,
                    type: "success",
                    duration: 2000
                  });
                  this.getList();
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
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.setLimit(val)
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.setPage(val)
        this.getList()
      },
      resetForm(){
        this.fileList=[];
        this.columnInfo = {}
      },
      closeDialog(){
        this.id = ''
        this.resetForm()
      },
      updateOnShow(row){
        row.isShow = row.isShow == 'y' ? 'n' : 'y'
        let postData = {
          appId: this.appId,
          id: row.id,
          isShow: row.isShow
        }
        editorConvertOnshow(postData).then(res => {
          this.$notify({
            title: res.statusText,
            message: res.data.msg,
            type: "success",
            duration: 2000
          });
        });
      }
    } 
  };
</script>
