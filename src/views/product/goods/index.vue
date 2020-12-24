<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container" style="display: flex;">
            <el-button v-if="pro_product_add" class="filter-item" style="" @click="handleCreate" type="primary" icon="el-icon-plus">上传商品
            </el-button>
            <!-- <el-select v-model="appId" @change="getDataByAppId" placeholder="请选择" style="display: inline-block; width: auto; margin-left: 5px;">
              <el-option
                v-for="(item, index) in currentAppList"
                :key="index"
                :label="item.appName"
                :value="item.appId">
                <span style="float: left">{{ item.appName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appId }}</span>
              </el-option>
            </el-select> -->
             <el-button class="filter-item" @click="handleExport" type="primary" :loading="loading" icon="el-icon-download"> 导出
            </el-button>
            <el-button class="filter-item" type="primary" @click="updateJDGood" v-show="userInfo.username == 'sysAdmin'" >更新京东商品</el-button>
        </div>
        <div class="filter-container">
          <el-input v-model="productName" @change="onProductName" style="width:180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品名称" clearable></el-input>
          <el-input v-model="searchObj.storeName" @change="onStoreName" style="width:180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商铺名称" clearable></el-input>
          <el-input v-model="searchObj.productNo" @change="onProductNo" style="width:180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品编号" clearable></el-input>
          <el-input v-model="searchObj.templateName" style="width:180px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入运费模板名称" clearable></el-input>
          <div class="s-category">
            <el-select v-model="searchObj.type" @change="onType" placeholder="请选择栏目类型">
              <el-option
                v-for="item in typeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="clearSelect" v-if="searchObj.type || searchObj.type == 0">
              <i class="el-icon-circle-close" @click="clearType"></i>
            </div>
          </div>
          <!-- <div class="s-category">
            <el-select v-model="searchObj.isFreePostage" @change="onIsFreePostage"  placeholder="请选择是否包邮">
              <el-option
                v-for="item in freePostage"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="goods-select">
            <el-cascader :options="options" placeholder="请选择商品分类"  change-on-select  v-model="currCategory" @change="handleChange"></el-cascader>
            <div class="city-close" v-if="!this.categoryId == ''"  @click="clearCategoryId">
                <i class="el-icon-error"></i>
            </div>
          </div>
          <div class="s-category">
            <el-select v-model="searchObj.isOnSale" @change="onIsOnSale" placeholder="请选择是否上架">
              <el-option
                v-for="item in isOnSaleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="s-time">
            <el-date-picker 
              v-model="time" 
              type="datetimerange" 
              range-separator="至" 
              start-placeholder="开始日期" 
              end-placeholder="结束日期"
              @change="selectTime">
            </el-date-picker>
          </div> 
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
          <el-table-column align="center" label="ID">
              <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="商铺名称">
              <template slot-scope="scope">
                  <span>{{ scope.row.storeName | filterStoreName }}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称">
              <template slot-scope="scope">
                  <span>{{ scope.row.productName }}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="商品编号" width="120">
              <template slot-scope="scope">
                  <span>{{ scope.row.productNo }}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="商品主图" width="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                <img  :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="100" width="100" >
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="应用名称">
              <template slot-scope="scope">
                  <span>{{ scope.row.appId | AppIdConvertAppName}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="关键词">
              <template slot-scope="scope">
                  <span>{{ scope.row.keywords }}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="所属分类" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.categoryName}} </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="展位类型" width="100">
            <template slot-scope="scope">
              <el-tag>{{scope.row.type | typeFilter}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="运费模板" width="110">
            <template slot-scope="scope">
              <span>{{ scope.row.templateName }}</span>
            </template>
          </el-table-column>
            <!-- <el-table-column align="center" label="是否免邮" width="100">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.isFreePostage | freePostageFilter(scope.row.postage)}}</el-tag>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="邮费" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.postage | moenyFilter}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="供货价" width="80">
                <template slot-scope="scope">
                    <span v-if="isHidden(scope.row.appId)">{{ scope.row.costPrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="零售价" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.unitPrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="对比零售价" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.contrastPrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="波动价" width="70">
                <template slot-scope="scope">
                    <span>{{ scope.row.wavePrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否上架" width="80">
              <template slot-scope="scope">
                <el-tag>{{scope.row.isOnSale | isOnSaleFilter}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240px">
                <template slot-scope="scope">
                    <el-button v-if="pro_product_upd && isHidden(scope.row.appId)" size="mini" type="primary"
                               @click="handleIsOnSale(scope.row)">{{scope.row.isOnSale | isOnSaleFilterBtn}}
                    </el-button> 
                    <el-button v-if="pro_product_upd" size="mini" type="success"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="pro_product_del && isHidden(scope.row.appId)" size="mini" type="danger"
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
        <div class="tuoqiangongzi" v-if="sanctionState == 2"></div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="商品ID" prop="id">
                        <el-input v-model="form.id" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="productName">
                        <el-input v-model="form.productName" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品编号" prop="productNo">
                        <el-input v-model="form.productNo" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品的销量" prop="spu">
                        <el-input v-model="form.spu" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="0-会员福利  1-精选 2-推荐 等类型" prop="type">
                        <el-input v-model="form.type" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="商品主图" prop="picture">
                        <el-input v-model="form.picture" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="是否免邮" prop="isFreePostage">
                        <el-input v-model="form.isFreePostage" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="邮费" prop="postage">
                        <el-input v-model="form.postage" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="是否上架 y-是 n-否" prop="isOnSale">
                        <el-input v-model="form.isOnSale" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                        <el-input v-model="form.sort" placeholder="排序"></el-input>
                    </el-form-item>
                    <el-form-item label="分类ID" prop="categoryId">
                        <el-input v-model="form.categoryId" placeholder=""></el-input>
                    </el-form-item>
                     <el-form-item label="成本价" prop="costPrice">
                        <el-input v-model="form.costPrice" placeholder=""></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="确定要更新吗!"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-input v-model="JDProductName" placeholder="请输入商品的名称"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="affirmUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, fetchExport, getObj, addObj, putObj, delObj,putOnSale,updateJDGoods } from "@/api/product/goods";
import { fetchCas } from "@/api/product/category";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { sanction } from '@/api/log'
import { resolveUrlPath, formartTime, getAppName, isDudu, any } from "@/util/util";
import { productTypeList } from "@/util/data";
import { mapGetters, mapMutations,mapState } from "vuex";
import { fetchStoreInfoById } from "@/api/merchants/merchants"      //获取店铺信息


export default {
  name: "table_pro_product",
  directives: {
    waves
  },
  data() {
    return {
      productName: '',    //商品名
      // storeName: '',      //商铺名
      appId: '',
      currentAppList: [],
      list: null,
      total: null,
      baseUrl:"http://qiniu.edawtech.com/",
      listLoading: true,
      loading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {},
      time: [],
      searchObj: {
        appId: null,
        type: null,
        productNo: null,
        productName: null,
        isFreePostage: null,
        isOnSale: null,
        startTime: null,
        endTime: null,
        storeName: null
      },
      form: {
        productName:"",
        spu:"",
        type:"",
        picture:"",
        isFreePostage:"",
        postage:"",
        categoryId:"",
        costPrice:"",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      pro_product_add: false,
      pro_product_upd: false,
      pro_product_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      typeData: productTypeList,
      freePostage: [{
        value: 'y',
        label: '包邮'
      }, {
        value: 'n',
        label: '不包邮'
      },
      {
        value: '',
        label: '全部'
      }],
      tableKey: 0,
      isOnSaleList: [{
        value: 'y',
        label: '上架'
      }, {
        value: 'n',
        label: '不上架'
      },
      {
        value: '',
        label: '全部'
      }],
      options:[],
      currCategory: [],
      categoryId: '',
      tempArr: [],
      dialogVisible: false,
      JDProductName: ''
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    ...mapGetters(["tagWel"]),
    ...mapGetters(["searchProp",'sanctionState']),
    ...mapGetters('appId',{
      appIdList: 'appList'
    }),
    ...mapState({
        userInfo: state => state.user.userInfo
    }),
  },
  filters: {
    // 过滤店铺名
    filterStoreName(value){
      if(value == null){
        return '无'
      }else{
        return value
      }
    },
    AppIdConvertAppName(appId){
      return getAppName(appId);
    },
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效"
      };
      return statusMap[status];
    },
    freePostageFilter(status,postage) {
      switch(status){
        case 'y':
          return '包邮'
          break;
        case 'n':
          if(Number(postage) == 0){
            return '邮费到付'
          }else {
            return '不包邮'
          }
          break;
      }
    },
    moenyFilter(postage){
      return postage/10000
    },
    typeFilter(status) {
      const statusMap = {
        0: "会员福利",
        1: "精选",
        2: "推荐",
        3: "京东特惠"
      };
      return statusMap[status];
    },
    isOnSaleFilter(status) {
      const statusMap = {
        'n': "下架",
        'y': "已上架"
      };
      return statusMap[status];
    },
    isOnSaleFilterBtn(status){
      if(status == 'n'){
        return '上架'
      } else {
        return '下架'
      }
    }
  },
  created() {
    this.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
    this.currentAppList = this.appIdList;
    // this.getList();
    this.getCategory();
    this.pro_product_add = this.permissions["pro_product_add"];
    this.pro_product_upd = this.permissions["pro_product_upd"];
    this.pro_product_del = this.permissions["pro_product_del"];
    this.time.push(this.searchProp["startTime"]);
    this.time.push(this.searchProp["endTime"]);
    this.listQuery.limit = this.searchProp["limit"];
    this.listQuery.page = this.searchProp["page"];
    this.searchObj = this.searchProp;
    this.search();
  },
  methods: {
     ...mapMutations({
      setProductName: 'SET_PRODUCTNAME',
      setProductNo: 'SET_PRODUCTNO',
      setType: 'SET_TYPE',
      setIsFreePostage:'SET_ISFREEPOSTAGE',
      setIsOnSale:'SET_ISONSALE',
      setTime: 'SET_GOODSTIME',
      setLimit: 'SET_GOODLIMIT',
      setPage: 'SET_GOODPAGE',
      setCategoryId: 'SET_CATEGORYID',
      setStoreName: 'SET_STORENAME'
    }),
    // 更新京东商品
    updateJDGood(){
        this.dialogVisible = true;
    },
    // 确定更新
    affirmUpdate(){
        let postData = {
            page: 1,
            limit: 100000,
            productName: this.JDProductName,
            minDiscount: '0.00',
            maxDiscount: '1.00'
        }
        updateJDGoods(postData).then((res)=>{
            console.log(res,'更新')
            this.$notify({
              title: res.data.status == 'success' ? '成功' : '失败',
              message: res.data.msg,
              type: res.data.status,
              duration: 2000
            });
        })
    },
    handleClose(){
        this.dialogVisible = false;
    },
    isHidden(appId){
      return isDudu(appId);
    },
    // 获取商品信息
    getList() {
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        // appId: this.appId
      }
      fetchList(postData).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getDataByAppId(){
      this.getList();
    },
    // 商品管理页面搜索按钮
    search(){
      var str = this.productName;
      this.searchObj.productName = str.replace(/\s*/g,"");
      let postData = this.searchObj;
      console.log(postData,'搜索')
      postData.page = this.listQuery.page;      
      postData.limit = this.listQuery.limit;
      postData.type = postData.type === '' ? null : postData.type;
      postData.isFreePostage = postData.isFreePostage === '' ? null : postData.isFreePostage;
      postData.isOnSale = postData.isOnSale === '' ? null : postData.isOnSale;
      postData.productNo = postData.productNo === '' ? null : postData.productNo;
      postData.productName = postData.productName === '' ? null : postData.productName;
      postData.storeName = postData.storeName === '' ? null : postData.storeName;
      postData.startTime = postData.startTime === '' ? null : postData.startTime;
      postData.endTime = postData.endTime === '' ? null : postData.endTime;
      // postData.appId = this.appId;
      fetchList(postData).then(response => {
        console.log(response,'商品信息')
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 导出商品信息
    async handleExport(){
      let postData = this.searchObj;
      postData.page = this.listQuery.page;
      postData.limit = this.listQuery.limit;
      if(postData.type || postData.type == 0 || postData.isFreePostage || postData.isOnSale || postData.productNo || postData.productName || postData.startTime || postData.endTime){
        this.loading = true;
        const res = await fetchExport(postData);
        this.loading = false;
        if(res.status == 200){
            window.location.href = res.request.responseURL;
            this.orderStatus = '';
        }
      }else {
          this.$notify({
              title: '导出警告！',
              message: '请选择导出条件',
              type: 'warning'
          });
      }
    },
    selectTime(res){
      if(res){
        this.time = [];
        this.setTime({startTime: formartTime(res[0], 5), endTime: formartTime(res[1], 5)});
        this.searchObj.startTime = formartTime(res[0], 5);
        this.searchObj.endTime = formartTime(res[1], 5);
        this.time.push(formartTime(res[0], 5));
        this.time.push(formartTime(res[1], 5));
      }else {
        this.searchObj.startTime = null;
        this.searchObj.endTime = null;
      }
    },
    getCategory() {
      fetchCas(null).then(response => {
        this.options = response.data;
        this.currCategory.push(this.searchObj.categoryId);
        this.childrenEach(this.options, 0);
      });
    },
    handleChange(value){
      this.categoryId = value[value.length - 1];
      this.setCategoryId(this.categoryId);
    },
    childrenEach(childrenData, depthN) {
      let depth = 0;
      for (var j = 0; j < childrenData.length; j++) {
        depth = depthN; // 将执行的层级赋值 到 全局层级

        this.tempArr[depthN] = childrenData[j].value;

        if (childrenData[j].value == this.currCategory) {
          this.currCategory = this.tempArr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
          break;
        } else {
          if (childrenData[j].hasOwnProperty("children")) {
            depth++;
            this.childrenEach(childrenData[j].children, depth);
          }
        }
      }
    },
    clearCategoryId(){
      this.currCategory= [];
      this.categoryId= '';
      this.setCategoryId('');
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.setLimit(val);
      this.search();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.setPage(val);
      this.search();
    },
    handleIsOnSale(row){
      if(row.isOnSale == 'n'){
        row.isOnSale = 'y'
      }else {
        row.isOnSale = 'n'
      }
      let postData = {
        id: row.id,
        isOnSale: row.isOnSale
      }
      putOnSale(postData).then(res => {
        this.handleTip(res.statusText, res.data.msg);
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
    // 编辑
    handleUpdate(row) {
      // this.dialogStatus = "update";
      // this.dialogFormVisible = true;
      //alert(this.tagShop.value);
      // this.$store.commit("ADD_TAG", this.tagShop);
      // this.$router.push({ path: this.tagShop.value });
      this.$router.push({
        //path: resolveUrlPath("/product/goods_edit")
        path: resolveUrlPath("/product/add"),
        query: {
          id: row.id, 
          categoryId: row.categoryId,
          appId: row.appId,
          productNo: row.productNo
        }
      });
    },
    handleDelete(row) {
      this.$alert('请看清楚需要删除的项，避免误删。', '商品数据', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){
            if(row.id){
              delObj(row.id).then(response => {
                this.dialogFormVisible = false;
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
    // 上传
    handleCreate() {
      this.$router.push({
        path: resolveUrlPath("/product/add")
        // query: this.tagWel.query
      });
      // this.resetForm();
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    onProductName(e){
      console.log(e);
      this.setProductName(e);
    },
    // 商铺名改变触发
    onStoreName(e){
      console.log(e)
      this.setStoreName(e);
    },
    onProductNo(e){
      this.setProductNo(e);
    },
    onType(e){
      this.setType(e);
    },
    onIsFreePostage(e){
      this.setIsFreePostage(e);
    },
    onIsOnSale(e){
      this.setIsOnSale(e)
    },
    clearType(){
      this.setType('');
      this.searchObj.type = '';
    },
    resetForm() {
      this.form = {
        id: "",
        productName: "",
        spu: "",
        type: "",
        picture: "",
        isFreePostage: "",
        postage: "",
        categoryId:'',
        sort:'',
        costPrice:'',
      };
    }
  }
};
</script>
<style lang="scss">
  .s-input{
    width: 200px;
    margin-bottom: 10px;
  }
  .s-time, .s-category{
    width: 360px;
    display: inline-block;
    margin-bottom: 10px;
    position: relative;
    .clearSelect{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 30px;
      .el-icon-circle-close:before{
        color: #666;
      }
    }
  }
  .s-time{
    width: 400px;
  }
  .s-category {
    width: 150px;
  }
  .goods-select{
    position: relative;
    width:200px;
    display:inline-block; 
  }
  .goods-select .city-close{
      position: absolute;
      top: 5px;
      right: 30px;
  }
  .goods-select .city-close .el-icon-error:before{
    color: #666;
    font-size: 14px;
  }
</style>

