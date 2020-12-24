<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="display: flex;">
      <el-button v-if="pro_banner_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate"
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
      <el-select v-model="bannerId" @change="getDataByLocation" placeholder="请选择" style="display: inline-block; width: auto; margin-left: 5px;">
        <el-option
          v-for="(item, index) in locationData"
          :key="index"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="220px" label="图片">
        <template slot-scope="scope">
          <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" height="100" width="200" >
        </template>

      </el-table-column>
      <el-table-column align="center" width="160px" label="展示位置">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.columnsId ? scope.row.columnsId : scope.row.location | locationFilter(that)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120px" label="跳转方式">
        <template slot-scope="scope">
          <el-tag>{{scope.row.skipType | skipTypeFilter}}</el-tag>
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
          <el-button v-if="pro_banner_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="pro_banner_del" size="mini" type="danger"
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="绑定APP">
          <el-select v-model="form.appId" @change="changeAppId" placeholder="请选择需要绑定的APP">
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="file">
          <el-upload class="upload-demo" :limit="1" action="/shop/web/banner/upload" :on-success="uploadSuccess"
                     :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="展示位置" prop="location">
          <el-select v-model="createLocationId"  placeholder="请选择展示位置" @change="createLocation">
            <el-option v-for="item in locationData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转方式" prop="skipType">
          <el-select v-model="form.skipType" placeholder="请选择跳转方式">
            <el-option v-for="item in skipTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- <el-input v-model="form.skipType" placeholder=""></el-input> -->
        </el-form-item>
        <el-form-item label="安卓对应类名" prop="linkUrl">
          <el-input v-model="form.androidClassName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="安卓对应参数" prop="linkUrl">
          <el-input v-model="form.androidParams" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ios对应类名" prop="linkUrl">
          <el-input v-model="form.iosClassName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ios对应参数" prop="linkUrl">
          <el-input v-model="form.iosParams" placeholder=""></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchList,
    getObj,
    addObj,
    putObj,
    delObj,
    getColumnBanner
  } from "@/api/product/banner";
  import waves from "@/directive/waves/index.js"; // 水波纹指令
  import {mapGetters} from "vuex";

  export default {
    name: "table_pro_banner",
    directives: {
      waves
    },
    data() {
      return {
        that: this,
        appId: '',
        currentAppList: [],
        options: [],
        value: "",
        baseUrl:"http://qiniu.edawtech.com/",
        list: null,
        total: null,
        fileList: [],
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        rules: {},
        form: {
          id:"",
          name: "",
          skipType: "",
          imageUrl: "",
          location: "",
          columnsId: ""
        },
        dialogFormVisible: false,
        dialogStatus: "",
        pro_banner_add: false,
        pro_banner_upd: false,
        pro_banner_del: false,
        skipTypeData: [{
          value: 0,
          label: 'App内部链接'
        }, {
          value: 1,
          label: '外部链接'
        }
        ],
        locationData: [{
          value: 0,
          label: '首页顶部Banner'
        }, {
          value: 1,
          label: '会员福利广告'
        }, {
          value: 2,
          label: '精选广告'
        },{
          value: 3,
          label: '本地商家顶部banner'
        },{
          value: 4,
          label: '秒杀列表banner'
        }
        ,{
          value: 5,
          label: '优选专区banner'
        },{
          value: 6,
          label: '秒杀专区banner'
        },
        // {
        //   value: 7,
        //   label: '1-2折专区banner'
        // },
        {
          value: 8,
          label: '嘟嘟优选banner'
        },
        // {
        //   value: 9,
        //   label: '3-5折专区banner'
        // },
        {
          value: 10,
          label: '今日爆款banner'
        },
        // {
        //   value: 11,
        //   label: '特惠百货banner'
        // },
        // {
        //   value: 12,
        //   label: '多彩兑换banner'
        // },
        // {
        //   value: 13,
        //   label: '嘟嘟加油banner'
        // },
        {
          value: 14, 
          label: '申请成为骑手banner'
        },
        {
          value: 15, 
          label: '数码banner'
        },
        // {
        //   value: 16, 
        //   label: '电器banner'
        // },
        // {
        //   value: 17, 
        //   label: '宠物banner'
        // },
        // {
        //   value: 18, 
        //   label: '中外名酒banner'
        // },
        // {
        //   value: 19, 
        //   label: '家具百货banner'
        // },
        // {
        //   value: 20, 
        //   label: '精选箱包banner'
        // },
        // {
        //   value: 22, 
        //   label: '厨房用品banner'
        // },
        // {
        //   value: 23, 
        //   label: '食品生鲜banner'
        // },
        {
          value: '',
          label: '全部位置banner'
        }],
        // 过滤展示位置
        statusMap: {
          0: "顶部Banner",
          1: "会员福利广告",
          2: "精选广告",
          3: "本地商家顶部banner",
          4: '秒杀列表banner',
          5: '优选专区banner',
          6: '秒杀专区banner',
          // 7: '1-2折专区banner',
          8: '嘟嘟优选banner',
          // 9: '3-5折专区banner',
          10: '今日爆款banner',
          // 11: '特惠百货banner',
          // 12: '多彩兑换banner',
          // 13: '嘟嘟加油banner',
          14: '申请成为骑手banner',
          15: '数码banner',
          // 16: '电器banner',
          // 17: '宠物banner',
          // 18: '中外名酒banner',
          // 19: '家具百货banner',
          // 20: '精选箱包banner',
          // 22: '厨房用品banner',
          // 23: '食品生鲜banner'
        },
        bannerId: '',
        columnsId: '',
        location: '',
        createLocationId: '',
        textMap: {
          update: "编辑",
          create: "创建"
        },
        tableKey: 0
      };
    },
    computed: {
      ...mapGetters(["permissions"]),
      ...mapGetters('appId',{
          appIdList: 'appList'
      })
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: "有效",
          1: "无效"
        };
        return statusMap[status];
      },
      skipTypeFilter(status) {
        const statusMap = {
          0: "App内部链接",
          1: "外部链接"
        };
        return statusMap[status];
      },
      locationFilter(status,that) {
        const statusMap = that.statusMap;
        return statusMap[status];
      },
      imagesFilter(val) {
        if(val.valueOf('http')==-1)
              url=this.baseUrl+val;
        return url;
      }
    },
    created() {
      this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
      this.currentAppList = this.appIdList;
      // 获取栏目banner
      this.getBannerList();
      this.pro_banner_add = this.permissions["pro_banner_add"];
      this.pro_banner_upd = this.permissions["pro_banner_upd"];
      this.pro_banner_del = this.permissions["pro_banner_del"];
    },
    methods: {
      getList() {
        this.resetForm();
        this.listLoading = true;
        
        let postData = {
          ...this.listQuery,
          appId: this.appId,
          location: this.location,
          columnsId: this.columnsId
        }

        fetchList(postData).then(response => {
          console.log(response,'123345');
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      // 栏目动态banner
      getBannerList(){
        let appId = this.appId;
        let banenrArr = [];
        getColumnBanner(appId).then((res)=>{
          console.log(res,'栏目banner')
          let bannerList = res.data;
          bannerList.forEach((item)=>{
            let obj = {
              value: '@' + item.id,
              label: item.columnName
            }
            banenrArr.push(obj);
            this.statusMap[item.id] = item.columnName;
          })
          let locationData = this.locationData.concat(banenrArr);
          this.locationData = locationData;
          this.getList();
        })
      },
      getDataByAppId(){
        this.getList();
      },
      changeAppId(){
       this.form = Object.assign({},this.form,{appId: this.form.appId});
      },
      getLocation(status) {
        this.locationData.forEach((val, index) => {
          if(val.value==status) {
            this.form.location = val.label;
          }
        });
      },
      getSkipType(status) {
        this.skipTypeData.forEach((val, index) => {
          if(val.value==status) {
            this.form.skipType = val.label;
          }
        });
      },
      getDataByLocation(e){
        if(e[0] == '@'){
          let str = e.substr(1);
          this.columnsId = str;
          this.location = 100;
        }else{
          this.columnsId = '';
          this.location = e;
        }
        this.getList();
      },
      // 新增添加展示位置
      createLocation(e){
        if(e[0] == '@'){
          let str = e.substr(1);
          this.form.columnsId = str;
          this.form.location = 100;
        }else{
          this.form.columnsId = '';
          this.form.location = e;
        }
      },
      getUpdate() {
        fetchFile({});
      },
      uploadSuccess(res, file) {
        this.form.imageUrl = res.imagePath;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleUpdate(row) {
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.fileList=[];
        this.form.appId = row.appId;
        this.form.id = row.id;
        this.form.name=row.name;
        this.form.columnsId=row.columnsId;
        this.form.location=row.location;
        this.form.skipType=row.skipType;
        this.form.androidClassName = row.androidClassName;
        this.form.androidParams = row.androidParams;
        this.form.iosClassName = row.iosClassName;
        this.form.iosParams = row.iosParams;
        this.createLocationId = row.columnsId ? '@' + row.columnsId : row.location;
        if(row.imageUrl.indexOf('http')==0)
          this.form.imageUrl=row.imageUrl;
        else
          this.form.imageUrl=this.baseUrl+row.imageUrl;

        this.fileList.push({"name":row.name,"url":this.form.imageUrl});
      },
      handleDelete(row) {
        this.$alert('你确定删除该图片', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if(action === 'confirm'){
              if(row.id){
                delObj(row.id).then(response => {
                  this.dialogFormVisible = false;
                  this.resetForm();
                  this.getList();
                  this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                  });
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
      handleCreate() {
        this.resetForm();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
      create(formName) {
        console.log(this.form,'lll')
        let location = String(this.form.location);
        if(location || this.form.columnsId){
          addObj(this.form).then((res) => {
            console.log(res,'jjjj')
            this.$notify({
              title: res.data.data ? "成功" : '失败',
              message: res.data.msg,
              type: res.data.data ? "success" : 'error',
              duration: 2000
            });
            if(res.data.data){
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        }else{
          this.$notify({
            title: "失败",
            message: "请选择具体展示位置",
            type: "error",
            duration: 2000
          });
        }
        
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        let location = String(this.form.location);
        if(location || this.form.columnsId){
          console.log(this.form,'ssssss');
          this.form.imageUrl = this.imageUrlFilter(this.form.imageUrl);
          putObj(this.form).then((res) => {
            this.$notify({
              title: res.data.data ? "成功" : '失败',
              message: res.data.msg,
              type: res.data.data ? "success" : 'error',
              duration: 2000
            });
            if(res.data.data){
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        }else{
          this.$notify({
            title: "失败",
            message: "请选择具体展示位置",
            type: "error",
            duration: 2000
          });
        }
      },
      imageUrlFilter(path){
        if(path.indexOf('http')==0)
          return path.split(this.baseUrl)[1];
        else
          return path;
      },
      resetForm() {
        console.log('jjjj')
        this.fileList=[];
        this.form = {
          id: "",
          name: "",
          skipType: "",
          imageUrl: "",
          linkUrl: "",
          location: "",
          columnsId: ''
        };
        this.createLocationId = '';
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  };
</script>
