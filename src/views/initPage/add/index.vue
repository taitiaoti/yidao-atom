<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="display:flex;">
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
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 25px;" @click="handleCreate"
                 type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="图片">
        <template slot-scope="scope">
          <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" height="150" width="100" >
        </template>
      </el-table-column>
      <el-table-column align="center" label="展示时间">
        <template slot-scope="scope">
          <el-tag>{{scope.row.duration}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="展示位置">
        <template slot-scope="scope">
          <el-tag>{{scope.row.sort}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="所属类型">
        <template slot-scope="scope">
          <el-tag>{{scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column align="center" label="安卓对应类名">
        <template slot-scope="scope">
          <span>{{ scope.row.androidClassName }}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="安卓对应参数">
        <template slot-scope="scope">
          <span>{{ scope.row.androidParams }}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="ios对应类名">
        <template slot-scope="scope">
          <span>{{ scope.row.iosClassName }}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="ios对应参数">
        <template slot-scope="scope">
          <span>{{ scope.row.iosParams }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- <el-form-item label="所属类型" width="70%" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="绑定APP" prop="file" :label-width="formLabelWidth">
          <el-select v-model="form.appId" @change="refreshAppId" placeholder="请选择需要绑定的APP">
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
        <el-form-item label="图片" prop="file" :label-width="formLabelWidth">
          <el-upload class="upload-demo" :limit="1" action="/shop/web/initPage/upload" :on-success="uploadSuccess"
                    :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="file" :label-width="formLabelWidth">
          <el-input v-model="form.sort" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="启动时间" prop="file" :label-width="formLabelWidth">
          <el-input v-model="form.duration" type="number" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="安卓对应类名" :label-width="formLabelWidth">
          <el-input v-model="form.androidClassName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="安卓对应参数"  :label-width="formLabelWidth">
          <el-input v-model="form.androidParams" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ios对应类名"  :label-width="formLabelWidth">
          <el-input v-model="form.iosClassName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ios对应参数" :label-width="formLabelWidth">
          <el-input v-model="form.iosParams" placeholder=""></el-input>
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
  import {
    getInitPageList,
    addInitPage,
    putInitPage,
    deleteInitPage
  } from "@/api/initPage/index";
  import {mapGetters, mapMutations} from 'vuex';

  export default {
    data(){
      return {
        appId: '',
        currentAppList: [],
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        form:{
          type: '1',
          imageUrl: '',
          sort: ''
        },
        listLoading: true,
        fileList: [],
        baseUrl:"http://qiniu.edawtech.com/",
        options: [{
          value: '1',
          label: '启动页'
        }, {
          value: '2',
          label: '引导页'
        }],
        list: [],
        tableKey: 0,
        dialogStatus: "",
        bannerId: '',
        formLabelWidth: '100px'
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
    filters: {
      typeFilter(status){
        const statusMap = {
          1: "启动页",
          2: "引导页"
        };
        return statusMap[status];
      },
    },
    methods:{
      getList(){
        this.resetForm();
        this.listLoading = true;
        
        let postData = {
          ...this.listQuery,
          appId: this.appId
        }
        getInitPageList(postData).then(res => {
          console.log(res,'获取启动页面图列表');
          this.list = res.data.records;
          this.listLoading = false;
        });
      },
      getDataByAppId(){
        this.getList(); 
      },
      refreshAppId(){
        this.form = Object.assign({},this.form);
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
        this.form.type = '1';
        addInitPage(this.form).then( res => {
          this.dialogFormVisible = false;
          this.getList();
          this.handleTip(res.statusText, res.data.msg);
        });
      },
      handleUpdate(row){
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.form.sort = row.sort;
        this.form.type = row.type;
        this.form.androidClassName = row.androidClassName;
        this.form.androidParams = row.androidParams;
        this.form.iosClassName = row.iosClassName;
        this.form.iosParams = row.iosParams;
        this.form.duration = row.duration;
        this.form.appId = row.appId;
        this.bannerId = row.id;
        if(row.imageUrl.indexOf('http')==0)
          this.form.imageUrl=row.imageUrl;
        else
          this.form.imageUrl=this.baseUrl+row.imageUrl;
        this.fileList = [];
        this.fileList.push({name:this.form.imageUrl,url:this.form.imageUrl});
      },
      update(formName){
          //this.dialogFormVisible = false;
          console.log(this.form,'9090');
          let postData = {
            appId: this.form.appId,
            id: this.bannerId,
            type: this.form.type,
            sort: this.form.sort,
            imageUrl: this.imageUrlFilter(this.form.imageUrl),
            androidClassName: this.form.androidClassName,
            androidParams: this.form.androidParams,
            iosClassName: this.form.iosClassName,
            iosParams: this.form.iosParams,
            duration: this.form.duration
          }
          putInitPage(postData).then(res => {
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
        this.$alert('你确定删除该图片', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if(action == 'confirm'){
              if(row.id){
                deleteInitPage(row.id).then(res => {
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
      resetForm() {
        this.fileList=[];
        this.form = {
          type: '',
          imageUrl: '',
          sort: ''
        };
      },
    },
  };
</script>
