<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="display: flex;" v-if="column_mange_add">
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
      <el-table-column align="center"  label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center"  label="栏目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.columnName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type | filterType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目位置" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.sort}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标地址" width="140">
        <template slot-scope="scope">
          <img  :src="scope.row.iconUrl.indexOf('http')==0?scope.row.iconUrl:(baseUrl+scope.row.iconUrl)" height="100" width="100" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="安卓对应类名" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.androidClassName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="安卓最小版本号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.minAndroidVersion}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="安卓最大版本号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maxAndroidVersion}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="ios对应类名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.iosClassName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="ios最小版本号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.minIosVersion}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="ios最大版本号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.maxIosVersion}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="web对应类名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.weChatClassName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否兑换">
        <template slot-scope="scope">
          <span>{{ scope.row.isExchange | filterExchange}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否属于京东" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.isJd | filterExchange}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240px">
        <template slot-scope="scope">
          <el-button size="small" :type="scope.row.isShow == 'y' ? 'danger' : 'primary'"
                     @click="updateOnShow(scope.row)">
              {{scope.row.isShow == 'y' ? '下架' : '上架'}}
          </el-button>
          <el-button v-if="column_mange_editor" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="column_mange_delete" size="mini" type="danger"
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
        <el-form-item label="栏目类型">
          <el-select v-model="columnInfo.type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input v-model="columnInfo.columnName"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" v-if="columnInfo.type == 2">
          <el-input v-model="columnInfo.skipUrl"></el-input>
        </el-form-item>
        <el-form-item label="栏目图标" prop="file">
            <el-upload class="upload-demo" :limit="1" action="/shop/web/column/upload" :on-success="uploadSuccess"
                        :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="栏目位置">
          <el-input v-model="columnInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label="是否兑换">
          <el-select v-model="columnInfo.isExchange" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否属于京东">
          <el-select v-model="columnInfo.isJd" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安卓对应类名">
          <el-input v-model="columnInfo.androidClassName"></el-input>
        </el-form-item>
        <el-form-item label="安卓最小版本号">
          <el-input v-model="columnInfo.minAndroidVersion"></el-input>
        </el-form-item>
        <el-form-item label="安卓最大版本号">
          <el-input v-model="columnInfo.maxAndroidVersion"></el-input>
        </el-form-item>
        <el-form-item label="ios对应类名">
          <el-input v-model="columnInfo.iosClassName"></el-input>
        </el-form-item>
        <el-form-item label="ios最小版本号">
          <el-input v-model="columnInfo.minIosVersion"></el-input>
        </el-form-item>
        <el-form-item label="ios最大版本号">
          <el-input v-model="columnInfo.maxIosVersion"></el-input>
        </el-form-item>
        <el-form-item label="web对应类名">
          <el-input v-model="columnInfo.weChatClassName"></el-input>
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
  import {
    fetchColumn,
    addColumn,
    getColumnById,
    delColumnIcon,
    editorColumn,
    delColumn,
    editorColumnOnshow
  } from "@/api/category/index";
  import {mapGetters, mapMutations} from "vuex";
  // import { handleTip } from "@/util/util";

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
        typeList: [{
          value: 0,
          label: '商品'
        },{
          value: 1,
          label: '店铺'
        },{
          value: 2,
          label: '跳转地址'
        }],
        fileList: [],
        id: '',
        column_mange_add:false,
        column_mange_editor: false,
        column_mange_delete: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        total: null,
        options: [
          {label: '是', value: 'y'},
          {label: '否', value: 'n'}
        ],
      }
    },
    computed:{
      ...mapGetters(['permissions','columnQueryList']),
      ...mapGetters('appId',{
        appIdList: 'appList'
      })
    },
    created(){
      this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      this.listQuery.limit = this.columnQueryList['limit'];
      this.listQuery.page = this.columnQueryList['page'];
      this.column_mange_add = this.permissions["column_mange_add"];
      this.column_mange_editor = this.permissions["column_mange_editor"];
      this.column_mange_delete = this.permissions["column_mange_delete"];
      this.getList();
    },
    filters: {
      filterType(value){
        let MapList = {
          0: '商品',
          1: '店铺',
          2: '跳转地址',
        }
        return MapList[value]
      },
      filterExchange(value){
        let MapList = {
          'n': '否',
          'y': '是'
        }
        return MapList[value]
      }
    },
    methods:{
      ...mapMutations({
        setPage: 'set_column_page',
        setLimit: 'set_column_limit'
      }),
      getList(){
        this.listLoading = true;
        let postData = {
          ...this.listQuery,
          appId: this.appId
        }
        fetchColumn(postData).then(res => {
          console.log(res, '首页栏目列表');
          this.cartgoryList = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
        });
      },
      handleUpdate(row){
        this.dialogFormVisible = true
        this.id = row.id
        getColumnById(row.id).then(res => {
          console.log(res, '通过Id获取栏目信息');
          this.fileList = [];
          this.fileList.push({name:this.baseUrl+res.data.iconUrl, url:this.baseUrl+res.data.iconUrl});
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
        this.dialogFormVisible = false
        editorColumn(this.columnInfo).then(res => {
          console.log(res, '修改成功');
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
          iconUrl: this.columnInfo.iconUrl,
          parent: 0,
          sort: this.columnInfo.sort,
          iosClassName: this.columnInfo.iosClassName,
          weChatClassName: this.columnInfo.weChatClassName,
          androidClassName: this.columnInfo.androidClassName,
          type: this.columnInfo.type,
          skipUrl: this.columnInfo.skipUrl,
          minIosVersion: this.columnInfo.minIosVersion,
          maxIosVersion: this.columnInfo.maxIosVersion,
          minAndroidVersion: this.columnInfo.minAndroidVersion,
          maxAndroidVersion: this.columnInfo.maxAndroidVersion,
          isExchange: this.columnInfo.isExchange
        }
        addColumn(postData).then(res => {
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
      getDataByAppId(){
        this.getList();
      },
      handleDelete(row){
        this.$alert('你确定删除该栏目', '删除', {
          confirmButtonText: '确定',
          callback: action => {
            if(action == 'confirm'){
              if(row.id){
                delColumn(row.id).then(res => {
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
        editorColumnOnshow(postData).then(res => {
          this.$notify({
            title: res.statusText,
            message: res.data.msg,
            type: "success",
            duration: 2000
          });
        });
      },
    },
  };
</script>
