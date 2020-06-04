<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="display: flex;">
      <el-button-group>
        <el-button class="filter-item" v-if="home_children_add" :disabled="!!selsectObj.parentColumnId" @click="openAdd"
              type="primary" icon="edit">添加
        </el-button>
        <el-button class="filter-item" @click="hEditor" v-if="home_children_editor"
              type="primary" :disabled="!selsectObj.parentColumnId" icon="edit">编辑
        </el-button>
        <el-button type="primary" :type="columnInfo.isShow == 'y' ? 'danger' : 'primary'" :disabled="!selsectObj.parentColumnId"  class="filter-item"
            @click="updateOnShow">
            {{columnInfo.isShow == 'y' ? '下架' : '上架'}}
        </el-button>
        <el-button class="filter-item" @click="handleDelete(selsectObj)" v-if="home_children_delete"
              type="primary" :disabled="!selsectObj.parentColumnId" icon="edit">删除
        </el-button>
      </el-button-group>
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
    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree 
          :data="cartgoryList"
          node-key="id" 
          highlight-current 
          :props="defaultProps" 
          @node-click="handleNodeClick">
        </el-tree>
      </el-col> 
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :model="columnInfo" label-width="80px">
            <el-form-item label="父级栏目">
                <!-- <el-input v-model="columnInfo.parentColumnId" :disabled="!isEditor"></el-input> -->
                <el-select v-model="columnInfo.parentColumnId" placeholder="请选择父级栏目" :disabled="!isEditor">
                  <el-option
                    v-for="(item, index) in parentList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
                  </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="绑定APP">
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
            </el-form-item> -->
            <el-form-item label="栏目名称">
              <el-input v-model="columnInfo.columnName" placeholder="请输入栏目名称" :disabled="!isEditor"></el-input>
            </el-form-item>
            <el-form-item label="栏目位置">
              <el-input v-model="columnInfo.sort" placeholder="请输入栏目位置" :disabled="!isEditor"></el-input>
            </el-form-item>
            <el-form-item v-if="isEditor">
              <el-button @click="cancleEditor">取 消</el-button>
              <el-button type="primary" v-if="handleType == 'add'" @click="fecthAddColumn">添加</el-button>
              <el-button type="primary" v-if="handleType != 'add'" @click="comfirmUpdate">修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row> 
    
    <!-- <el-table :data="cartgoryList" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center"  label="序号" width="300">
        <template scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="栏目名称">
        <template scope="scope">
          <span>{{ scope.row.columnName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center"  label="所属父级栏目">
        <template scope="scope">
          <span>{{filterParentColumn(scope.row.parentColumnId)}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目位置" width="100">
        <template scope="scope">
          <span>{{ scope.row.sort}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-button size="small" :type="scope.row.isShow == 'y' ? 'danger' : 'primary'"
                     @click="updateOnShow(scope.row)">
              {{scope.row.isShow == 'y' ? '下架' : '上架'}}
          </el-button>
          <el-button v-if="home_children_editor" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="home_children_delete" size="mini" type="danger"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <!-- <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.page"
                        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div> -->
    <!-- <el-dialog title="编辑" :visible.sync="dialogFormVisible" @close="closeDialog" width="500px">
      <el-form :model="columnInfo" label-width="80px">
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
        <el-form-item label="父级栏目">
          <el-select v-model="columnInfo.parentColumnId" placeholder="请选择所属父级栏目">
            <el-option
              v-for="(item, index) in parentList"
              :key="index"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="!!this.id" @click="comfirmUpdate">修改</el-button>
        <el-button type="primary" v-if="!this.id" @click="fecthAddColumn">添加</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import { 
    fetchList,
    fetchItemById,
    add,
    editorItem,
    deleteItem,
    fetchParentList,
    editorIsShow
  } from "@/api/category/homeChildren"
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
        columnInfo: {
          parentColumnId: '',
          columnName: '',
          id: '',
          sort: ''
        },
        fileList: [],
        id: '',
        home_children_add:false,
        home_children_editor: false,
        home_children_delete: false,  
        listQuery: {
          page: 1,
          limit: 10
        },
        total: null,
        parentList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        isEditor: false,
        handleType: 'add',
        selsectObj: {}
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
      this.home_children_add = this.permissions["home_children_add"];
      this.home_children_editor = this.permissions["home_children_editor"];
      this.home_children_delete = this.permissions["home_children_delete"];
      this.getList();
      this.getParentList();
    },
    methods:{
      ...mapMutations({
        setPage: 'set_businessEnterprise_page',
        setLimit: 'set_businessEnterprise_limit'
      }),
      async getList(){
        this.listLoading = true;
        let postData = {
          // ...this.listQuery,
          appId: this.appId
        }
        const res = await fetchList(postData);
        console.log(res, '栏目列表');
        // this.cartgoryList = res.data;
        this.total = res.data.total;
        this.listLoading = false;

        let tempArr = [];
        res.data.forEach(item => {
          if(tempArr.length != 0){
            let isHaveItem = false;
            tempArr.forEach(item02 => {
              if(item02.id == item.parentColumnId){
                isHaveItem = true;
                item02.children.push({
                  id: item.id,
                  parentColumnId: item.parentColumnId,
                  name: item.columnName,
                  sort: item.sort,
                  isShow: item.isShow
                })
              }
            })
            if(!isHaveItem){
              tempArr.push({
                id: item.parentColumnId,
                name: item.parentColumnName,
                children: [{
                  id: item.id,
                  parentColumnId: item.parentColumnId,
                  name: item.columnName,
                  sort: item.sort,
                  isShow: item.isShow
                }]
              })
            }
          }else {
            tempArr.push({
              id: item.parentColumnId,
              name: item.parentColumnName,
              children: [{
                id: item.id,
                parentColumnId: item.parentColumnId,
                name: item.columnName,
                sort: item.sort,
                isShow: item.isShow
              }]
            })
          }
        })
        this.cartgoryList = tempArr;
      },
      async getParentList(){
            let postData = {
                appId: this.appId
            }
            const res = await fetchParentList(postData);
            this.parentList = [];
            res.data.forEach(item => {
                this.parentList.push({
                    label: item.columnName,
                    value: item.id
                })
            });
            console.log(this.parentList,'this.parentList');
      },
      getDataByAppId(){
        this.getList();
      },
      handleUpdate(row){
        this.dialogFormVisible = true
        this.id = row.id
        fetchItemById(row.id).then(res => {
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
            appId: this.appId,
            id: this.columnInfo.id,
            columnName: this.columnInfo.columnName,
            sort: this.columnInfo.sort,
            parentColumnId: this.columnInfo.parentColumnId
        }
        editorItem(postData).then(res => {
            this.$notify({
                title: res.statusText,
                message: res.data.msg,
                type: "success",
                duration: 2000
            });
            this.isEditor = false;
            this.getList();
        });
      },
      openAdd(){
        this.columnInfo.parentColumnId = this.selsectObj.id;
        this.columnInfo.columnName = "";
        this.isEditor = true;
        this.handleType = 'add';
      },
      hEditor(){
        this.isEditor = true;
        this.handleType = 'editor';
      },
      fecthAddColumn(){
        let postData = {
          appId: this.appId,
          columnName: this.columnInfo.columnName,
          sort: this.columnInfo.sort,
          parentColumnId: this.columnInfo.parentColumnId
        }
        add(postData).then(res => {
          this.$notify({
            title: res.statusText,
            message: res.data.msg,
            type: "success",
            duration: 2000
          });
          if(res.data.data){
            this.columnInfo = {}
            this.isEditor = false;
          }
          this.getList()
        });
      },
      handleDelete({id}){
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if(id){
            deleteItem(id).then(res => {
              this.$notify({
                title: res.statusText,
                message: res.data.msg,
                type: "success",
                duration: 2000
              });
              this.resetForm();
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
        this.columnInfo = {
          parentColumnId: '',
          columnName: '',
          id: '',
          sort: ''
        };
        this.selsectObj = {
          columnName: '',
          id: '',
          sort: ''
        };
      },
      closeDialog(){
        this.id = ''
        this.resetForm()
      },
      async updateOnShow(){
        let postData = {
          appId: this.appId,
          id: this.columnInfo.id,
          isShow: this.columnInfo.isShow == 'n' ? 'y' : 'n'
        }
        const res = await editorIsShow(postData);
        if(res.data.data){
          this.cartgoryList.forEach(item => {
            if(item.id == this.columnInfo.parentColumnId){
              item.children.every(item02 => {
                if(item02.id == this.columnInfo.id){
                  item02.isShow = this.columnInfo.isShow == 'n' ? 'y' : 'n';
                  console.log(item02.isShow ,'item02.isShow ');
                  return true;
                }
              })
            }
          });
          this.columnInfo.isShow = this.columnInfo.isShow == 'n' ? 'y' : 'n';
        }
        this.$notify({
          title: res.statusText,
          message: res.data.msg,
          type: "success",
          duration: 2000
        });
        console.log(res, '12312');
      },
      filterParentColumn(value){
          let tempValue = ''
          if(this.parentList){
              this.parentList.forEach(item => {
                  if(item.value == value) {
                      tempValue = item.label;
                  }
              })
          }
          return tempValue;
      },
      handleNodeClick(data){
        console.log(data.isShow,'data.isShow');
        this.selsectObj = data;
        this.columnInfo.parentColumnId = data.parentColumnId;
        this.columnInfo.id = data.id;
        this.columnInfo.columnName = data.name;
        this.columnInfo.sort = data.sort ? data.sort : '';
        this.columnInfo.isShow = data.isShow;
        let tempObj = {
          parentColumnId: data.id,
          columnName: '',
          id: '',
          sort: ''
        }
        if(data.parentColumnId){
          this.handleType = 'editor'
          this.columnInfo = Object.assign({},this.columnInfo);
        }else {
          this.handleType = 'add'
          this.columnInfo = Object.assign({},tempObj);
        }
      },
      cancleEditor(){
        this.isEditor = false;
      }
    },
    filters: {
    },
  };
</script>
