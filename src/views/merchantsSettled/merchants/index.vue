<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" v-if="business_enterprise_add">
      <el-button class="filter-item" @click="openAdd"
            type="primary" icon="edit">添加
      </el-button>
      <el-button class="filter-item" @click="addStore"
            type="primary" icon="edit">导入
      </el-button>
    </div>
    <div class="filter-container">
          <el-input v-model="searchObj.storeName" @change="onStoreName" style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入店铺名称"></el-input>
          <el-input v-model="searchObj.storeNo" @change="onStoreNo" style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入店铺编号"></el-input>
           <div class="menchants-city">
                <el-cascader
                    v-model = "cityArr"
                    expand-trigger="hover"
                    :options="options"
                    @change='changeCity'
                    placeholder="请选择城市"
                >
                </el-cascader>
                <div class="city-close" v-if="this.cityArr.length != 0" @click="clearCityId">
                    <i class="el-icon-error"></i>
                </div>
            </div>
          <!-- <div class="s-category">
            <el-select v-model="searchObj.type" @change="onType" placeholder="请选择类型">
              <el-option
                v-for="item in typeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="s-category">
            <el-select v-model="searchObj.isFreePostage" @change="onIsFreePostage"  placeholder="请选择是否包邮">
              <el-option
                v-for="item in freePostage"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          </div>  -->
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
    <el-table :data="cartgoryList" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center"  label="编号" width="100">
        <template scope="scope">
          <span>{{ scope.row.storeNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="店铺名称">
        <template scope="scope">
          <span>{{ scope.row.storeName}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标地址" width="120">
        <template scope="scope">
          <img  :src="scope.row.iconUrl.indexOf('http')==0?scope.row.iconUrl:(baseUrl+scope.row.iconUrl)" height="100" width="100" >
        </template>
      </el-table-column>
      <el-table-column align="center"  label="店铺号码">
        <template scope="scope">
          <span>{{ scope.row.storePhone}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center"  label="店铺qq">
        <template scope="scope">
          <span>{{ scope.row.storeQq}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center"  label="店铺微信">
        <template scope="scope">
          <span>{{ scope.row.storeWechat}}</span>          
        </template>
      </el-table-column>
       <el-table-column align="center"  label="地址">
        <template scope="scope">
          <span>{{ scope.row.storeAddress}}</span>          
        </template>
      </el-table-column>
       <el-table-column align="center"  label="宣传语">
        <template scope="scope">
          <span>{{ scope.row.propaganda}}</span>          
        </template>
      </el-table-column>
       <el-table-column align="center"  label="人均消费">
        <template scope="scope">
          <span>{{ scope.row.averageConsumption | filterAverageConsumption}}</span>          
        </template>
      </el-table-column>
      <!-- <el-table-column align="center"  label="开店时间">
        <template scope="scope">
          <span>{{ scope.row.serviceStartTime}}</span>          
        </template>
      </el-table-column>
       <el-table-column align="center"  label="关店时间">
        <template scope="scope">
          <span>{{ scope.row.serviceEndTime}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度">
        <template scope="scope">
          <span>{{ scope.row.longitude}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="纬度">
        <template scope="scope">
          <span>{{ scope.row.latitude}}</span>          
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="排序" width="80">
        <template scope="scope">
          <span>{{ scope.row.sort}}</span>          
        </template>
      </el-table-column>
      <el-table-column align="center" label="关键词">
        <template scope="scope">
          <span>{{ scope.row.keywords}}</span>          
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template scope="scope">
          <el-button v-if="business_enterprise_editor" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="business_enterprise_delete" size="mini" type="danger"
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
    <!-- 导入店铺模态 -->
    <el-dialog
      title="导入店铺"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal = false>
      <el-cascader
      v-model="adCode"
      :options="cityOptions"
      style="margin-bottom:20px"
      change-on-select></el-cascader>
      <el-cascader
      v-model="poiId"
      :options="poiOptions"
      change-on-select></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStoreName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchStore,
  deleteStore,
  fetchCity,
  autoUpdate
} from "@/api/merchants/merchants";
import { mapGetters, mapMutations } from "vuex";
import { resolveUrlPath, formartTime } from "@/util/util";
import {citys} from "@/util/city"
import {pois} from "@/util/poi"

export default {
  data() {
    return {
      cartgoryList: [],
      listLoading: true,
      baseUrl: "http://qiniu.edawtech.com/",
      dialogFormVisible: false,
      columnInfo: {},
      fileList: [],
      id: "",
      business_enterprise_add: false,
      business_enterprise_editor: false,
      business_enterprise_delete: false,
      dialogVisible: false,
      cityOptions : '',  //行政区域
      poiOptions : [],    //poi
      poiId : [],         //三级联动绑定的poi
      adCode : [],        //三级联动绑定的行政区
      defaultTel : 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      total: null,
      searchObj: {
        storeName: '',
        storeNo: '',
        cityId: ''
      },
      cityArr: [],
      options: [],
    };
  },
  computed: {
    ...mapGetters(["permissions", "merchantsQueryList", "merchantsSearchObj"])
  },
  created() {
    this.listQuery.limit = this.merchantsQueryList["limit"];
    this.listQuery.page = this.merchantsQueryList["page"];
    this.business_enterprise_add = this.permissions["business_enterprise_add"];
    this.searchObj = this.merchantsSearchObj;
    this.business_enterprise_editor = this.permissions[
      "business_enterprise_editor"
    ];
    this.business_enterprise_delete = this.permissions[
      "business_enterprise_delete"
    ];
    this.getCity();
    //this.getList();
    this.search();
  },
  filters: {
    filterAverageConsumption(price){
      return price/10000;
    }
  },
  methods: {
    ...mapMutations({
      setPage: "set_merchants_page",
      setLimit: "set_merchants_limit",
      set_storeName: 'set_storeName',
      set_storeNo: 'set_storeNo',
      set_cityId: 'set_cityId'
    }),
    getList() {
      this.listLoading = true;
      fetchStore(this.listQuery).then(res => {
        console.log(res, "店铺列表");
        this.cartgoryList = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    // 导入
    addStore(){
      this.dialogVisible = true;
      this.getCitys();
      this.getPois();
    },
     // 处理城市区域数据
    getCitys(){
        let data = '';
        let cityArr = [];
        for(var i = 0,length = citys.districts.length; i<length; i++){
            data = citys.districts[i].districts;
        }
        data.forEach(item => {
            cityArr.push({
                label: item.name,
                value: item.adcode,
                children: item.districts
            })
            cityArr.forEach((item2)=>{
                item2.children.forEach((child)=>{
                    child.value = child.adcode;
                    child.label = child.name;
                    child.children = child.districts;
                    child.children.forEach((child2)=>{
                        child2.value = child2.adcode;
                        child2.label = child2.name;
                    })
                })
            })
        });
        this.cityOptions = cityArr;
        // console.log(cityArr,'cityArr')
    },
    // 处理poi数据
    getPois(){
      let obj = {};
      for(var poi in pois){
          if(pois[poi].children){
              let child1 = pois[poi].children;
              let child1Arr = []
              child1.forEach((item)=>{
                  child1Arr.push({
                      value: item.subCategory,
                      label : item.subCategoryName,
                      children : item.children || []
                  })
              }) 
              child1Arr.forEach((item1)=>{
                  if(item1.children!=undefined){
                      item1.children.forEach((item2)=>{
                          item2.value = item2.subCategory;
                          item2.label = item2.subCategoryName
                      })
                  }
              })
              obj = {
                  value : pois[poi].subCategory,
                  label : pois[poi].subCategoryName,
                  children : child1Arr
              }
              this.poiOptions.push(obj)
          }
      }
      // console.log(this.poiOptions,'poui')
    },
    // 确定导入
    addStoreName(){
      if(this.adCode.length != 0 && this.poiId != 0){
        let adCode = this.adCode[this.adCode.length-1]
        let types = this.poiId[this.poiId.length-1]
        console.log(adCode,'adcode')
        console.log(types,'types')
        let params = {
          adCode:adCode,
          types:types,
          defaultTel:this.defaultTel
        }
        autoUpdate(params).then((resp)=>{
          if(resp.data.data){
            this.$notify({
              title: resp.statusText,
              message: resp.data.msg,
              type: "success",
              duration: 2000
            });
            this.dialogVisible = false;
          }else{
            this.$notify({
              title: '失败',
              message: resp.data.msg,
              type: "error",
              duration: 2000
            });
          }
        })
      }else{
        this.$notify.error({
          title: '错误',
          message: '选择参数错误'
        })
      }
    },
    // 关闭导入店铺模态
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleUpdate(row) {
        this.$router.push({
            path: resolveUrlPath("/merchantsSettled/merchants_editor"),
            query: {
                id: row.id, 
            }
        })
    },
    openAdd() {
      this.$router.push({
          path: resolveUrlPath("/merchantsSettled/merchants_editor"),
          query: {
            type: 'add', 
          }
      });
    },
    fecthAddColumn() {
      let postData = {
        appId: "dudu",
        columnName: this.columnInfo.columnName,
        parent: 0,
        sort: this.columnInfo.sort
      };
      addBusinessEnterprise(postData).then(res => {
        this.$notify({
          title: res.statusText,
          message: res.data.msg,
          type: "success",
          duration: 2000
        });
        this.dialogFormVisible = false;
        this.getList();
      });
    },
    handleDelete(row) {
      this.$alert("你确定删除该点店铺？", "删除", {
        confirmButtonText: "确定",
        callback: action => {
          if (action == "confirm") {
            if(row.id){
              deleteStore(row.id).then(res => {
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
      this.listQuery.limit = val;
      this.setLimit(val);
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.setPage(val);
      this.getList();
    },
    resetForm() {
      this.fileList = [];
      this.columnInfo = {};
    },
    closeDialog() {
      this.id = "";
      this.resetForm();
    },
    onStoreName(e){
      this.set_storeName(e);
    },
    onStoreNo(e){
      this.set_storeNo(e);
    },
    search(){
      let postData = {
        storeName: this.merchantsSearchObj.storeName,
        storeNo: this.merchantsSearchObj.storeNo,
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        cityId: this.merchantsSearchObj.cityId
      }
      this.listLoading = true;
      fetchStore(postData).then(res => {
        console.log(res, "店铺列表");
        this.cartgoryList = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      }); 
    },
    changeCity(valueArr){
        this.searchObj.cityId = valueArr[1];
        this.set_cityId(this.searchObj.cityId);
        // this.listQuery.page = 1;
        // this.listQuery.limit = 100;
        
    },
    getCity(){
        fetchCity().then(res => {
            console.log(res, '省市');
            this.provinceCity = res.data;
            //this.filterCityArr(this.storeInfo.cityId);
            res.data.forEach((item, index) => {
                let templArr = [];
                if(typeof item.cities !== 'undefined'){
                    item.cities.forEach((item, index) => {
                        templArr.push({
                            value: item.id,
                            label: item.cityName
                        });
                    });
                    this.options.push({
                        value: item.id,
                        label: item.provinceName,
                        children: templArr
                    });
                }else {
                    this.options.push({
                        value: item.id,
                        label: item.provinceName,
                    });
                }
            });
        });
    },
    clearCityId(){
      this.cityId = null;
      this.cityArr = [];
      this.set_cityId(null);
    },
  },
};
</script>
<style>
  .menchants-city{
    width: 400px;
    display:  inline-block;
    position: relative;
  }
  .menchants-city .city-close{
      position: absolute;
      /* top: 50%;
      transform: translateY(-50); */
      top: 5px;
      right: 30px;
  }
  .menchants-city .city-close{
      right: 34px;
  }
  .menchants-city .city-close .el-icon-error:before{
      color: #999;
      cursor: pointer;
  }
</style>

