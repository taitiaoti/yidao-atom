<template>
  <div class="container">
    <div class="list-wrapper">
      <div class="list-item list01">
        <h2>渠道列表</h2>
        <ul>
          <li
            class="column"
            :class="appIdIndex == index ? 'column-sel': ''"
            v-for="(item, index) in currentAppList"
            :key="index"
            @click="getColumnList(item.appId,index)"
          >
            <span>{{item.appName}}</span>
          </li>
        </ul>
      </div>
      <div class="list-item list02">
        <h2>栏目数据设置</h2>
        <ul>
          <li
            class="column"
            v-for="(item, index) in columnList"
            @click="selectCloumn(index, item.id, item.type)"
            :class="selectIndex == index ? 'cloumnName-sel' : ''"
            :key="index"
          >
            <span>{{item.columnName}}</span>
          </li>
        </ul>
      </div>
      <div class="list-item list03">
        <div class="data-box">
          <div class="box-left" style="width:445px;margin-right: 5px;">
            <el-row style="margin-top: 10px;" class="business-category">
              <el-col :span="23" style="margin-left: 10px;">
                <div>
                  <el-cascader
                    :options="categoryList"
                    placeholder="请选择分类"
                    v-model="currCategory"
                    change-on-select
                    @change="handleChange"
                  ></el-cascader>
                </div>
              </el-col>
              <div
                class="category-close"
                v-if="this.currCategory.length != 0"
                @click="clearCategoryId"
              >
                <i class="el-icon-error"></i>
              </div>
            </el-row>
            <el-input
              placeholder="请输入内容"
              v-model="productName"
              class="input-with-select03"
              clearable
            >
              <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                <el-option
                  v-for="item in selectTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
              <i
                slot="suffix"
                v-show="productName"
                class="el-input__icon el-icon-circle-close"
                @click="closeProductName"
              ></i>
            </el-input>
            <el-button slot="append" @click="add" icon="el-icon-plus"></el-button>
            <el-checkbox
              v-if="this.list.length != 0"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <div class="search-data-wrapper" ref="searchdata">
              <div class="search-data">
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group
                  slot="reference"
                  v-model="checkedItems"
                  @change="handleCheckedItemsChange"
                >
                  <el-checkbox v-for="(item,index) in list" :label="item" :key="index">
                    <img
                      :src="item.picture.indexOf('http')==0?item.picture:(baseUrl+item.picture)"
                      height="50"
                      width="50"
                    >
                    <span class="x-name03">{{item.productName}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="tip-loading" v-if="!isLoadingEnd && (list.length != 0)">
              <i class="icon-shanglajiazai1"></i>
              <span class="tip-text">上拉加载</span>
            </div>
            <div class="tip-loading" v-if="isLoadingEnd && (list.length != 0)">
              <i class="icon-jiazaichenggong"></i>
              <span class="tip-text">数据已加载完</span>
            </div>
            <!-- <div class="tip-loading" v-if="!isLoadingEnd && (list.length != 0)">
                            <i class="el-icon-info"></i>
                            <span class="tip-text">上拉加载</span>
                        </div>
                        <div class="tip-loading" v-if="isLoadingEnd && (list.length != 0)">
                            <i class="el-icon-warning"></i>
                            <span class="tip-text">数据已加载完</span>
            </div>-->
            <div v-if="puLoading">
              <div
                class="vloading"
                v-loading="puLoading"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
              ></div>
            </div>
          </div>
          <div class="box-right">
            <div style="padding: 10px 0 0 22px;border-bottom: 1px solid #ebeef5;">
              <el-input
                v-model="searchObj.name"
                style="width:200px;margin-bottom: 10px;"
                prefix-icon="el-icon-search"
                placeholder="请输入名称"
              >
                <i
                  slot="suffix"
                  v-show="searchObj.name"
                  class="el-input__icon el-icon-circle-close"
                  @click="closeName"
                ></i>
              </el-input>
              <el-input
                v-model="searchObj.targetNo"
                style="width:200px;margin-bottom: 10px;"
                prefix-icon="el-icon-search"
                placeholder="请输入目标编号"
              >
                <i
                  slot="suffix"
                  v-show="searchObj.targetNo"
                  class="el-input__icon el-icon-circle-close"
                  @click="closeTargetNo"
                ></i>
              </el-input>
              <el-button type="primary" icon="el-icon-search" @click="searchSelectData">搜索</el-button>
              <!-- <el-button type="primary" @click="fetchSort">自动排序</el-button> -->
              <el-dropdown @command="handleCommand">
                <el-button type="primary">
                  排序方式
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">自动排序</el-dropdown-item>
                  <el-dropdown-item command="b">错开重复排序</el-dropdown-item>
                 
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-table
              ref="multipleTable"
              :data="columnData"
              tooltip-effect="dark"
              style="width: 100%"
              :height="tableHeight"
              v-loading="listLoading"
            >
              <el-table-column type="selection" align="center" width="55"></el-table-column>
              <el-table-column label="排序" align="center" width="70">
                <template slot-scope="scope">
                  <el-input
                    class="sort"
                    @blur="editorColumnData(scope.row)"
                    v-model="scope.row.sort"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="目标编号" align="center" width="200">
                <template slot-scope="scope">{{ scope.row.targetNo }}</template>
              </el-table-column>
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column align="center" label="图标地址" width="100">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)"
                    height="70"
                    width="70"
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-popover
                    placement="top"
                    width="160"
                    @show="showPopover(scope.row)"
                    v-model="scope.row.isShowPopover"
                  >
                    <p>你确定删除该数据</p>
                    <div style="text-align: right; margin-top: 10px;">
                      <el-button size="mini" type="text" @click="hidePopover(scope.row)">取消</el-button>
                      <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
                    </div>
                    <el-button size="mini" type="danger" slot="reference">删除</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="!listLoading" style="margin-top: 15px;" class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery02.page"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery02.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total02"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  fetchSelectListByColumnId,
  fetchEditor,
  fetchAdd,
  fetchDelete,
  searchGoods
} from "@/api/product/productColumnData";
import { auotSort ,auotSortStagger} from "@/api/columnData/homeColumn";
import { fetchCas } from "@/api/product/category";
import { mapGetters } from "vuex";
import BScroll from "better-scroll";
import { productTypeList } from "@/util/data";
let isToggleColumn = false;
let isSelectType = false;
export default {
  data() {
    return {
      columnList: [],
      productName: "",
      listQuery: {
        page: 1,
        limit: 100
      },
      total: null,
      listQuery02: {
        page: 1,
        limit: 10
      },
      total02: null,
      selectIndex: 0,
      checkAll: false,
      checkedItems: [],
      isIndeterminate: true,
      list: [],
      columnData: [],
      type: 0,
      baseUrl: "http://qiniu.edawtech.com/",
      tableHeight: document.documentElement.clientHeight - 260,
      dataList: [],
      columnId: "",
      popover: false,
      listLoading: true,
      puLoading: false,
      loadingText: "拼命加载中",
      isLoadingEnd: false,
      selectTypeList: productTypeList,
      selectType: 0,
      currCategory: [],
      categoryList: [],
      categoryId: "",
      searchObj: {
        name: "",
        targetNo: ""
      },
      currentAppList: [],
      appIdIndex: 0,
      currentAppId: ""
    };
  },
  computed: {
    ...mapGetters("appId", {
      appIdList: "appList"
    })
  },
  created() {
    this.currentAppId =
      this.appIdList.length != 0 ? this.appIdList[0].appId : "";
    this.currentAppList = this.appIdList;
    this.getColumnList(this.currentAppList[0].appId, this.appIdIndex);
    this.getCategory();
  },
  mounted() {
    var that = this;
    window.onresize = () => {
      return (() => {
        that.tableHeight = document.documentElement.clientHeight - 260;
        let ch = document.documentElement.clientHeight - 330;
        // this.$refs.searchdata.style.height = ch + "px";
      })();
    };
  },
  methods: {
    getCategory() {
      fetchCas(null).then(response => {
        this.categoryList = response.data;
      });
    },
    handleChange(value) {
      this.categoryId = value[value.length - 1];
      isSelectType = true;
      isToggleColumn = true;
    },
    _initScroll() {
      this.listScroll = new BScroll(this.$refs.searchdata, {
        mouseWheel: true,
        scrollbar: {
          fade: false,
          interactive: true
        },
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: 100
        },
        click: true,
        probeType: 3
      });
      this.listScroll.on("pullingUp", () => {
        if (this.listQuery.limit < this.total) {
          this.listQuery.limit += 100;
          this.search();
        } else {
          (this.puLoading = true), (this.loadingText = "数据已加载完");
          this.isLoadingEnd = true;
          setTimeout(() => {
            this.puLoading = false;
          }, 1000);
        }
      });
    },
    pullingDownUp() {
      this.listScroll.finishPullUp();
      this.listScroll.refresh(); //重新计算元素高度
    },
    getColumnList(appId, appIdIndex) {
      this.appIdIndex = appIdIndex;
      this.currentAppId = appId;
      this.dataList = [];
      let postData = {
        appId: appId
      };
      fetchList(postData).then(res => {
        console.log(res, "商企栏目列表");
        this.columnList = res.data;
        this.columnId = res.data[0].id;
        this.selectIndex = 0;
        this.$nextTick(() => {
          let ch = document.documentElement.clientHeight - 330;
          this.$refs.searchdata.style.height = ch + "px";
          this._initScroll();
        });
        this.getColumnData(res.data[0].id);
        this.type = res.data[0].type;
      });
    },
    search() {
      let postData = {
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        productName: this.productName,
        type: this.selectType,
        categoryId: this.categoryId,
        isOnSale: "y"
      };
      this.puLoading = true;
      this.loadingText = "拼命加载中";
      this.isLoadingEnd = false;
      searchGoods(postData).then(res => {
        console.log(res, "商品");
        this.list = res.data.records;
        this.total = res.data.total;
        this.puLoading = false;
        if (res.data.total < 100) {
          this.isLoadingEnd = true;
        }
        if (!this.listScroll || isToggleColumn) {
          this.$nextTick(() => {
            let ch = document.documentElement.clientHeight - 330;
            this.$refs.searchdata.style.height = ch + "px";
            this._initScroll();
          });
          isToggleColumn = false;
        } else {
          this.$nextTick(() => {
            let ch = document.documentElement.clientHeight - 330;
            this.$refs.searchdata.style.height = ch + "px";
            if (isSelectType) {
              this._initScroll();
              isSelectType = false;
            }

            this.pullingDownUp();
            let templArr = [];
            this.list.forEach((item, index) => {
              this.checkedItems.forEach((item02, index02) => {
                console.log(item.productNo, item02.productNo, "pp");
                if (item.productNo == item02.productNo) {
                  templArr.push(item);
                }
              });
            });
            this.checkedItems = templArr;
            this.getDataList(templArr);
          });
        }
      });
      this.dataList = [];
    },
    selectCloumn(index, id, type) {
      isToggleColumn = true;
      this.isLoadingEnd = false;
      this.selectIndex = index;
      this.columnId = id;
      this.getColumnData(id);
      this.type = type;
      this.list = [];
      this.dataList = [];
      this.checkedItems = [];
      this.listQuery.page = 1;
      this.listQuery.limit = 100;
    },
    handleCheckAllChange(val) {
      this.checkedItems = val ? this.list : [];
      this.getDataList(this.checkedItems);
      this.isIndeterminate = false;
    },
    handleCheckedItemsChange(value) {
      this.checkedItems = value;
      this.getDataList(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
    },
    getDataList(list) {
      if (list.length != 0) {
        this.dataList = [];
        list.forEach((item, index) => {
          this.dataList.push({
            appId: item.appId,
            targetNo: item.productNo,
            sort: item.sort
          });
        });
      } else {
        this.dataList = [];
      }
    },
    getColumnData(id) {
      this.columnData = [];
      this.listLoading = true;
      let postData = {
        page: this.listQuery02.page,
        limit: this.listQuery02.limit,
        name: this.searchObj.name,
        targetNo: this.searchObj.targetNo
      };
      console.log(postData, "参数9090");
      fetchSelectListByColumnId(id, postData).then(res => {
        this.listLoading = false;
        console.log(res, "通过栏目Id获取已绑定的数据");
        this.columnData = res.data.records;
        this.total02 = res.data.total;
        this.columnData.forEach((item, index) => {
          item.isShowPopover = false;
        });
      });
    },
    add() {
      if (this.dataList.length != 0) {
        console.log(this.dataList, this.currentAppId, "this.dataList");
        this.dataList.forEach(item => {
          item.appId = this.currentAppId;
        });
        fetchAdd(this.columnId, this.dataList).then(res => {
          this.checkedItems = [];
          this.dataList = [];
          this.checkAll = false;
          console.log(res, "为栏目添加数据");
          if (res.data.code == 0) {
            this.$notify({
              title: res.statusText,
              message: res.data.msg,
              type: "success",
              duration: 2000
            });
            this.getColumnData(this.columnId);
          }
        });
      } else {
        this.$message({
          message: "请选择你需要添加的数据",
          type: "warning"
        });
      }
    },
    handleDelete(row) {
      if (row.id) {
        fetchDelete(row.id).then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: res.statusText,
              message: res.data.msg,
              type: "success",
              duration: 2000
            });
            this.getColumnData(this.columnId);
          }
        });
      } else {
        this.$notify({
          title: "失败",
          message: "id为空",
          type: "error",
          duration: 2000
        });
      }
    },
    hidePopover(row) {
      this.columnData.some((item, index) => {
        if (row.id == item.id) {
          item.isShowPopover = false;
          this.$set(this.columnData, index, item);
          return true;
        }
      });
    },
    showPopover(row) {
      this.columnData.some((item, index) => {
        if (row.id == item.id) {
          item.isShowPopover = true;
          this.$set(this.columnData, index, item);
          return true;
        }
      });
    },
    editorColumnData(row) {
      let postData = {
        appId: row.appId,
        targetNo: row.targetNo,
        sort: row.sort,
        id: row.id
      };
      fetchEditor(postData).then(res => {
        console.log(res, "修改");
        //this.getColumnData(this.columnId);
      });
    },
    handleCurrentChange(val) {
      this.listQuery02.page = val;
      this.getColumnData(this.columnId);
    },
    handleSizeChange(val) {
      this.listQuery02.limit = val;
      this.getColumnData(this.columnId);
    },
    clearCategoryId() {
      this.currCategory = [];
      this.categoryId = "";
    },
    searchSelectData() {
      this.getColumnData(this.columnId);
    },
    async fetchSort() {
      let postData = {
        appId: this.currentAppId
      };
      const res = await auotSort(this.columnId, postData);
      console.log(res, 123);
      this.$notify({
        title: res.data.data ? res.statusText : res.data.msg,
        message: res.data.msg,
        type: res.data.data ? "success" : "error",
        duration: 2000
      });
    },
    //排序触发事件
   async handleCommand(command) {
       if(command =='a'){

           let postData = {
          appId: this.currentAppId
        };
        const res = await auotSort(this.columnId, postData);
        console.log(res, 123);
        this.$notify({
          title: res.data.data ? res.statusText : res.data.msg,
          message: res.data.msg,
          type: res.data.data ? "success" : "error",
          duration: 2000
        });
       }
       if(command =='b'){

           let postData = {
          appId: this.currentAppId
        };
        const res = await auotSortStagger(this.columnId, postData);
        console.log(res, 456);
        this.$notify({
          title: res.data.data ? res.statusText : res.data.msg,
          message: res.data.msg,
          type: res.data.data ? "success" : "error",
          duration: 2000
        });
       }

      },
    closeName() {
      this.searchObj.name = "";
    },
    closeTargetNo() {
      this.searchObj.targetNo = "";
    },
    closeProductName() {
      this.productName = "";
    }
  }
};
</script>
<style lang="scss">
.router {
  position: relative;
}
.list-wrapper {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.list-item {
  flex-grow: 1;
  height: 100%;
  margin: 0 3px;
}
.list-item:first-child {
  margin-left: 0;
}
.list-item:last-child {
  margin-right: 0;
}
.list-item h2 {
  font-size: 16px;
  text-align: center;
  background-color: #1086ff;
  color: #fff;
}
.list01 {
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.list-item ul li.column {
  list-style: none;
  margin: 5px 15px;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
  &.column-sel {
    color: #1086ff;
  }
}
.list-item ul li.cloumnName-sel span {
  color: #1086ff;
}
.list-item ul li:hover {
  cursor: pointer;
}
.list-item ul li:hover span {
  color: #1086ff;
}
.list02 {
  flex-grow: 3;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.list03 {
  position: relative;
  flex-grow: 40;
}
.data-box {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-top: 1px solid #ebeef5;
}
.data-box .box-left {
  width: 345px;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  margin-right: 5px;
  overflow: hidden;
  position: relative;
}
.data-box .box-right {
  flex-grow: 1;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.input-with-select03 {
  width: auto !important;
  margin: 10px 5px 0 10px;
}
.input-with-select03 .el-input__inner {
  padding-right: 17px !important;
}
.box-left .el-checkbox {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.box-left .el-checkbox + .el-checkbox {
  margin-left: 10px;
}
.cloumnName-sel {
  color: #1086ff;
}
.box-left .el-checkbox {
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 10px 0;
}
.search-data-wrapper {
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid #ebeef5;
}
.sort .el-input__inner {
  padding: 0 2px;
  height: 25px;
  line-height: 25px;
  text-align: center;
}
.pagination-container {
  margin-top: 15px;
}
.vloading {
  width: 100%;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0px;
}
.el-loading-spinner .el-loading-text {
  text-align: center;
}
.box-left .el-checkbox__label {
  display: inline-flex !important;
  align-items: center;
}
.el-checkbox {
  display: flex;
  align-items: center;
}
.x-name03 {
  width: 335px;
  margin-left: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tip-loading {
  height: auto !important;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tip-loading .tip-text {
  color: #606266;
  font-size: 16px;
  margin-left: 5px;
}
.icon-jiazaichenggong:before {
  font-size: 24px;
}
.input-with-select {
  width: auto;
  padding: 10px 5px 0 8px;
}
/* .el-input-group__prepend{
        width: 70px;
        padding: 0 14px;
        background-color: #fff;
    } */
.box-left .el-input-group__prepend {
  width: 70px !important;
  padding: 0 14px !important;
  background-color: #fff !important;
}
.box-left .el-select {
  width: auto !important;
}
.business-category {
  position: relative;
}
.business-category .category-close {
  position: absolute;
  top: 5px;
  right: 40px;
}
.business-category .category-close .el-icon-error:before {
  color: #999;
  cursor: pointer;
}
</style>
