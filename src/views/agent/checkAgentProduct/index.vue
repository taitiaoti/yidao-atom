<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-input v-model="searchObj.productName"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品名称"></el-input>
          <el-input v-model="searchObj.productNo"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品编号"></el-input>
          <div class="s-category">
            <el-select v-model="searchObj.type" placeholder="请选择栏目类型">
              <el-option
                v-for="item in typeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="clearSelect" v-if="searchObj.type">
              <i class="el-icon-circle-close" @click="clearType"></i>
            </div>
          </div>
          <div class="goods-select">
            <el-cascader :options="options" placeholder="请选择商品分类"  change-on-select  v-model="currCategory" @change="handleChange"></el-cascader>
            <div class="city-close" v-if="this.currCategory.length != 0"  @click="clearCategoryId">
                <i class="el-icon-error"></i>
            </div>
          </div>
          <div class="s-category">
            <el-select v-model="searchObj.isOnSale" placeholder="请选择是否上架">
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

          <el-table-column align="center" label="展位类型" width="100">
            <template slot-scope="scope">
              <el-tag>{{scope.row.type | typeFilter}}</el-tag>
            </template>
          </el-table-column>
            <el-table-column align="center" label="成本价" width="80">
                <template slot-scope="scope">
                    <span v-if="isHidden(scope.row.appId)">{{ scope.row.costPrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="销售价" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.unitPrice | moenyFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="对比价" width="80">
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
            <el-table-column align="center" label="审核状态" width="80">
              <template slot-scope="scope">
                <el-tag>{{scope.row.status | statusFilter}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240px">
                <template slot-scope="scope">
                    <el-button type="success" @click="jumpDetail(scope.row)" size="small">审核</el-button>
                    <el-button type="primary" @click="pass(scope.row)" size="small">通过</el-button>
                    <el-button type="danger" @click="refuse(scope.row)" size="small">拒绝</el-button>
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
        <el-dialog title="拒绝通过审核" :visible.sync="dialogFormVisible" width="500px">
          <el-form>
            <el-form-item label="拒绝理由：" :label-width="formLabelWidth">
              <el-input v-model="remark" :autosize="autosize" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sumbitRefuse">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchCkeckList, agentProductPass, agentProductRefuse } from "@/api/agentProduct/index";
import { fetchCas } from "@/api/product/category";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { resolveUrlPath, formartTime, getAppName, isDudu } from "@/util/util";
import { productTypeList } from "@/util/data";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "table_pro_product",
  directives: {
    waves
  },
  data() {
    return {
      appId: '',
      currentAppList: [],
      list: null,
      total: null,
      baseUrl:"http://qiniu.edawtech.com/",
      listLoading: true,
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
      typeData: [
        {
            value: 1,
            label: "精选"
        },
        {
            value: 2,
            label: "推荐"
        }
      ],
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
      formLabelWidth: '90px',
      remark: '',
      autosize: {minRows:4, maxRows: 6},
      productId: ''
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
    ...mapGetters(["tagWel"]),
    // ...mapGetters(["searchProp"]),
    ...mapGetters('appId',{
      appIdList: 'appList'
    })
  },
  filters: {
    AppIdConvertAppName(appId){
      return getAppName(appId);
    },
    statusFilter(status) {
      const statusMap = {
        0: "待审核",
        1: "审核通过",
        2: "拒绝"
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
        1: "精选",
        2: "推荐",
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
    this.appId = this.appIdList.length !== 0 ? this.appIdList[0].appId : '';
    this.currentAppList = this.appIdList;
    this.getCategory();
    this.pro_product_add = this.permissions["pro_product_add"];
    this.pro_product_upd = this.permissions["pro_product_upd"];
    this.pro_product_del = this.permissions["pro_product_del"];
    this.search();
  },
  methods: {
    isHidden(appId){
      return isDudu(appId);
    },
    getList() {
      this.listLoading = true;
      let postData = {
        ...this.listQuery,
        // appId: this.appId
      }
      fetchCkeckList(postData).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
        console.log(this.list,'ppp')
      });
    },
    getDataByAppId(){
      this.getList();
    },
    search(){
      let postData = this.searchObj;
      postData.page = this.listQuery.page;
      postData.limit = this.listQuery.limit;
      postData.type = postData.type === '' ? null : postData.type;
      postData.isFreePostage = postData.isFreePostage === '' ? null : postData.isFreePostage;
      postData.isOnSale = postData.isOnSale === '' ? null : postData.isOnSale;
      postData.productNo = postData.productNo === '' ? null : postData.productNo;
      postData.productName = postData.productName === '' ? null : postData.productName;
      postData.startTime = postData.startTime === '' ? null : postData.startTime;
      postData.endTime = postData.endTime === '' ? null : postData.endTime;
      postData.categoryId = this.categoryId;
      // postData.appId = this.appId;
      fetchCkeckList(postData).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    selectTime(res){
      if(res){
        this.time = [];
        // this.setTime({startTime: formartTime(res[0], 5), endTime: formartTime(res[1], 5)});
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
      // this.setCategoryId(this.categoryId);
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
      // this.setLimit(val);
      this.search();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      // this.setPage(val);
      this.search();
    },
    handleTip(statusText,msg){
      this.$notify({
        title: statusText,
        message: msg,
        type: "success",
        duration: 2000
      });
    },
    clearType(){
      // this.setType('');
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
    },
    pass({id}){
      this.$alert('请确认是否补全审核信息', '通过', {
        confirmButtonText: '确定',
          callback: async action => {
            if(action == 'confirm'){
              const res = await agentProductPass(id);
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
        this.productId = id;  
        this.dialogFormVisible = true;      
      }else {
        this.$notify({
            title:'错误',
            message: '商品ID不存在',
            type: 'error',
            duration: 2000
        });
      }
    },
    async sumbitRefuse(){
      this.dialogFormVisible = false;
      const res = await agentProductRefuse(this.productId, {remark: this.remark});
      this.$notify({
          title: res.data.data ? '成功' : '错误',
          message: res.data.msg,
          type: res.data.data ? 'success' : 'error',
          duration: 2000
      });
      this.getList();
    },
    jumpDetail(row){
      this.$router.push({
        path: resolveUrlPath("/product/add"),
        query: {
          id: row.id, 
          categoryId: row.categoryId,
          appId: row.appId,
          type: 'agent' 
        }
      });
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

