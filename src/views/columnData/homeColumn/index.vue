<template>
    <div class="container">
        <div class="list-wrapper">
            <div class="list-item list01">
                <h2>渠道列表</h2>
                <ul>
                    <li class="column" :class="appIdIndex == index ? 'column-sel': ''" 
                    v-for="(item, index) in currentAppList" :key="index" @click="getColumnList(item.appId,index)">
                        <span>{{item.appName}}</span>
                    </li>
                </ul>
            </div>
            <div class="list-item list02_home"  style="width:240px;flex-shrink: 0!important;">
                <h2 class="list02_home_h2">栏目数据设置</h2>
                <div v-if="columnList.length == 0" class="column-tip">暂无数据~</div>
                <ul class="list02_home_ul">
                    <li class="column" v-for="(item, index) in columnList" v-show="item.type == 0 || item.type == 1" @click="selectCloumn(index, item.id, item.type)" :class="selectIndex == index ? 'cloumnName-sel' : ''" :key="index">
                        <span class="column_text">{{item.columnName}}</span>
                        <div style="line-height: 1em;">
                            <span class="column_text_min">安卓({{item.minAndroidVersion}}-{{item.maxAndroidVersion}})、</span>
                            <span class="column_text_min">ios({{item.minIosVersion}}-{{item.maxIosVersion}})</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-item list02_home">
                <h2>子级栏目设置</h2>
                <div v-if="columnChildrenList.length == 0" class="column-tip">暂无子级~</div>
                <ul>
                    <li class="column" v-for="(item, index) in columnChildrenList"  @click="selectChildrenCloumn(index, item.id)" :class="selectChildrenIndex == index ? 'cloumnName-sel' : ''" :key="index">
                        <span>{{item.columnName}}</span>
                    </li>
                </ul>
            </div>
            <div class="list-item list03">
                <div class="data-box" v-if="columnList.length != 0">
                    <div class="box-left" style="width:445px!important;margin-right: 5px;flex-shrink: 0;">
                        <div class="city-cascader">
                            <el-cascader
                                v-if="type == 1"
                                v-model = "cityArr"
                                expand-trigger="hover"
                                :options="options"
                                @change="changeCity"
                                placeholder="请选择城市"
                            >
                            </el-cascader>
                            <div class="city-close" v-if="this.cityArr.length != 0" @click="clearCityId">
                                <i class="el-icon-error"></i>
                            </div>
                        </div>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="23" style="margin-left: 10px;margin-bottom: 10px;" class="home-category">
                                <div>
                                    <el-cascader :options="categoryList" placeholder="请选择分类" change-on-select  v-model="currCategory" @change="handleChange"></el-cascader>
                                </div>
                                <div class="city-close" v-if="this.currCategory.length != 0"  @click="clearCategoryId">
                                    <i class="el-icon-error"></i>
                                </div>
                            </el-col>
                        </el-row>
                        <el-input placeholder="请输入内容" v-model="productName" class="input-with-select01">
                            <el-select v-if="type == 0" v-model="selectType" slot="prepend" placeholder="请选择">
                                <el-option
                                v-for="item in selectTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
                            <i slot="suffix" v-show="productName" class="el-input__icon el-icon-circle-close" @click="closeProductName"></i>
                        </el-input>
                        <el-button slot="append" @click="add" icon="el-icon-plus"></el-button>
                        <el-checkbox v-if="this.list.length != 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div class="search-data-wrapper" ref="searchdata">
                            <div class="search-data">
                                <div style="margin: 15px 0;"></div>
                                <el-checkbox-group slot="reference" v-model="checkedItems" @change="handleCheckedItemsChange">
                                        <el-checkbox  v-for="(item,index) in list" :label="item" :key="index">
                                            <img v-if="type == 0" :src="item.picture.indexOf('http')==0?item.picture:(baseUrl+item.picture)" height="50" width="50" >
                                            <span v-if="type == 0" class="x-name">{{item.productName}}</span>
                                            <img v-if="type == 1" :src="item.iconUrl.indexOf('http')==0?item.iconUrl:(baseUrl+item.iconUrl)" height="50" width="50" >
                                            <span v-if="type == 1" class="x-name">{{item.storeName}}</span>
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
                        <!-- <div class="search-data-wrapper"  v-if="type == 1" ref="searchdata">
                            <div class="search-data">
                                <div style="margin: 15px 0;"></div>
                                <el-checkbox-group slot="reference" v-model="checkedItems" @change="handleCheckedItemsChange">
                                        <el-checkbox  v-for="(item,index) in list" :label="item" :key="index">
                                            <img  :src="item.iconUrl.indexOf('http')==0?item.iconUrl:(baseUrl+item.iconUrl)" height="50" width="50" >
                                            <span class="x-name">{{item.storeName}}</span>
                                        </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div> -->
                        <div class="vloading" v-if="puLoading">
                            <div  class="vloading" v-loading="puLoading" element-loading-background="rgba(255, 255, 255, 0.8)" :element-loading-text="loadingText"  element-loading-spinner="el-icon-loading"></div>
                        </div>
                    </div>
                    <div class="box-right">
                        <div style="padding: 10px 0 0 15px;border-bottom: 1px solid #ebeef5;">
                            <el-input v-model="searchObj.name"  style="width:250px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入名称">
                                <i slot="suffix" v-show="searchObj.name" class="el-input__icon el-icon-circle-close" @click="closeName"></i>
                            </el-input>
                            <el-input v-model="searchObj.targetNo"  style="width:250px;margin-bottom: 10px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入目标编号">
                                <i slot="suffix" v-show="searchObj.targetNo" class="el-input__icon el-icon-circle-close" @click="closeTargetNo"></i>
                            </el-input>
                            <el-button type="primary" icon="el-icon-search" @click="searchSelectData">搜索</el-button>
                            <br/>
                            <div class="lbz-func">
                                <el-popover
                                    placement="top"
                                    width="160"
                                    v-model="visible">
                                    <p>您确定要删除数据吗？</p>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                        <el-button type="danger" size="mini" @click="deleteProducts">确定</el-button>
                                    </div>
                                    <el-button type='danger' class="funcBtn" :disabled='deleteDisabled' slot="reference">删除选中数据</el-button>
                                </el-popover>
                                <el-dropdown @command="handleCommand" class="funcBtn">
                                    <el-button type="primary">
                                        {{ commandVaule }} <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="顺序排序">顺序排序</el-dropdown-item>
                                        <el-dropdown-item command="去重排序">去重排序</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button type='primary' icon="el-icon-download" class="funcBtn" :loading="exportLoading" @click='exportProduct'> 导 出 </el-button>
                            </div>
                        </div>
                        <div class="lbztable">
                            <div class="tabTop">
                                <el-table
                                ref="multipleTable"
                                :data="columnData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                :height="tableHeight"
                                v-loading="listLoading"
                                element-loading-text="拼命加载中"
                                v-if="type == 0"
                                @selection-change="selectData"
                                >
                                <el-table-column
                                type="selection"
                                align="center"
                                width="55">
                                </el-table-column>
                                <el-table-column
                                label="序号"
                                align="center"
                                width="70">
                                <template scope="scope">
                                    <el-input class="sort" @blur="editorColumnData(scope.row)" v-model="scope.row.sort"></el-input>    
                                </template>
                                </el-table-column>
                                <el-table-column
                                    label="目标编号"
                                    align="center"
                                    width="200">
                                    <template scope="scope">{{ scope.row.targetNo }}</template>
                                </el-table-column>
                                <el-table-column
                                label="名称"
                                align="center"
                                >
                                    <template scope="scope">{{ scope.row.name }}</template>
                                </el-table-column>
                                <el-table-column align="center" label="图标地址" width="100">
                                    <template scope="scope">
                                    <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" height="70" width="70" >
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                >
                                    <template scope="scope">
                                        <el-popover
                                            placement="top"
                                            width="160"
                                            @show="showPopover(scope.row)"
                                            v-model="scope.row.isShowPopover">
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
                                <el-table
                                    ref="multipleTable"
                                    :data="columnData"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    :height="tableHeight"
                                    v-loading="listLoading"
                                    v-if="type == 1"
                                    @selection-change="selectData"
                                    >
                                    <el-table-column
                                    type="selection"
                                    align="center"
                                    width="55">
                                    </el-table-column>
                                    <el-table-column
                                    label="排序"
                                    align="center"
                                    width="70">
                                    <template scope="scope">
                                        <el-input class="sort" @blur="editorColumnData(scope.row)" v-model="scope.row.sort"></el-input>    
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="目标编号"
                                    align="center"
                                    width="200">
                                    <template scope="scope">{{ scope.row.targetNo }}</template>
                                    </el-table-column>
                                    <el-table-column
                                    label="名称"
                                    align="center"
                                    >
                                        <template scope="scope">{{ scope.row.name }}</template>
                                    </el-table-column>
                                    <el-table-column align="center" label="图标地址" width="100">
                                        <template scope="scope">
                                        <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" height="70" width="70" >
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        align="center"
                                    >
                                        <template scope="scope">
                                            <el-popover
                                                placement="top"
                                                width="160"
                                                @show="showPopover(scope.row)"
                                                v-model="scope.row.isShowPopover">
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
                            </div>
                            <div v-show="!listLoading" class='fenye'>
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                    :current-page.sync="listQuery02.page"
                                    :page-sizes="[10,20,30, 50]" :page-size="listQuery02.limit"
                                    layout="total, sizes, prev, pager, next, jumper" :total="total02">
                                </el-pagination>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import {
        fetchColumnList,
        searchGoods,
        fetchColumnData,
        addDataForColumn,
        deleteDataForColumn,
        fetchEditorColumnData,
        auotSort,
        deleteByColumn,          //删除选中
        exportDataByColumn,     //导出
        toReorder} from "@/api/columnData/homeColumn";
    import {
        searchStore,
        fetchStoreColumnData
        } from "@/api/columnData/localShop";
    import { getChildrenColumn, getChildrenColumnData, addDataByColumn, delColumnsData,childColumnEditor,exportDataBychildColumn,deleteByChildColumn } from '@/api/category/homeChildren'
    import { fetchCas } from "@/api/product/category";    
    import {fetchCity} from "@/api/merchants/merchants";
    import { productTypeList } from "@/util/data"
    import {mapGetters, mapMutations} from 'vuex'
    import BScroll from 'better-scroll'
    let isToggleColumn = false;
    let isCityChange = false;
    
    export default {
        data() {
            return {
                columnList: [],
                columnChildrenList: [],
                productName: '',
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
                selectChildrenIndex: 0,
                checkAll: false,
                checkedItems: [],
                isIndeterminate: true,
                list: [],
                columnData:[],
                type: 0,
                baseUrl:"http://qiniu.edawtech.com/",
                tableHeight: document.documentElement.clientHeight-300,
                dataList: [],
                columnId: '',
                childrenColumnId: '',
                popover: false,
                listLoading: true,
                listLoading02: false,
                puLoading: false,
                loadingText: '拼命加载中',
                selectTypeList: productTypeList,
                selectType: 0,
                options: [],
                provinceCity: [],
                // cityArr: [19,200],
                cityArr: [],
                cityId: null,
                isLoadingEnd: false,
                selectedList: [],
                categoryList: [],
                currCategory: [],
                categoryId: '',
                searchObj: {
                    name: '',
                    targetNo: ''
                },
                currentAppList: [],
                appIdIndex: 0,
                currentAppId: '',
                commandVaule: '自动排序',
                deleteDisabled: true,           //控制删除选中数据的按钮
                exportLoading: false,
                productIds: [],
                visible: false
            }
        },
        created() {
            this.currentAppId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getColumnList(this.currentAppList[0].appId, this.appIdIndex);
            this.getCityId();
            this.getCategory();
        },
        mounted() {
            var that = this;
            window.onresize = () => {
                return (() => {
                    that.tableHeight = document.documentElement.clientHeight-260;
                    let ch = document.documentElement.clientHeight-330;
                    this.$refs.searchdata.style.height = ch+'px';
                })()
            };
        },  
        computed:{
            ...mapGetters(['columnDataMap']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        },
        methods: {
            ...mapMutations(['save_selectData','seve_columnDataMap']),
            getCategory() {
                fetchCas(null).then(response => {
                    this.categoryList = response.data;
                });
            },
            handleChange(value) {
                this.categoryId = value[value.length - 1];
                isToggleColumn = true;
            },
            _initScroll(){
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
                    probeType: 3,
                });
                this.listScroll.on('pullingUp', () => {
                    console.log('dd');
                    if(this.listQuery.limit < this.total){
                        this.listQuery.limit += 100;
                        this.search();
                    }else {
                        this.puLoading =  true,
                        this.loadingText =  '数据已加载完';
                        this.isLoadingEnd = true;
                        setTimeout(() => {
                            this.puLoading =  false;
                        },1000)
                    }
                });
            },
            pullingDownUp() {
                this.listScroll.finishPullUp()
                this.listScroll.refresh() //重新计算元素高度
            },
            async getColumnList(appId, appIdIndex){
                this.appIdIndex = appIdIndex;
                this.currentAppId = appId;
                this.dataList = [];
                let postData = {
                    appId: appId
                }
                const res = await fetchColumnList(postData);
                    console.log(res, '首页栏目列表');
                    if(res.data.length != 0){
                        this.columnList = res.data;
                        this.columnId = res.data[0].id;
                        let tempColumnId = "";
                        // alert(this.columnList);
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-330;
                            this.$refs.searchdata.style.height = ch+'px';
                            this._initScroll();
                        }); 
                        //获取子级
                        this.fetchChildrenColumn(this.columnId);

                        if(this.columnDataMap && this.columnDataMap.length){
                            this.columnDataMap.forEach((item, index) => {
                                if(item.appId == appId){
                                    tempColumnId = item.columnId,
                                    this.columnId = !!item.columnId ? item.columnId : this.columnList[0].id;
                                    this.type = !!item.type ? item.type : this.columnList[0].type;
                                    this.selectIndex = item.currentIndex;
                                    this.childrenColumnId = item.childrenColumnId;
                                    this.selectChildrenIndex = item.selectChildrenIndex;
                                }
                            });
                        }
                        if(!!tempColumnId){
                            this.getColumnData(tempColumnId)
                        }else {
                            this.getColumnData(this.columnList[0].id);
                            this.selectIndex = 0;
                        }
                    }else {
                        this.columnList = [];
                    }
            },
            async fetchChildrenColumnData(id){ //获取子级栏目绑定数据
                let postData = {
                    ...this.listQuery02,
                    name: this.searchObj.name,
                    targetNo: this.searchObj.targetNo
                }
                const res = await getChildrenColumnData(id, postData);
                this.listLoading = false; 
                console.log(res, '子级数据');
                this.columnData = res.data.records;
                this.total02 = res.data.total;
            },
            async fetchChildrenColumn(columnId){
                let postData = {
                    appId: this.currentAppId,
                    parentColumnId: columnId
                }
                const res = await getChildrenColumn(postData);
                console.log(res,'90909090');
                if(res.data.length !== 0){
                    this.columnChildrenList = res.data;
                    this.fetchChildrenColumnData(res.data[0].id);
                    this.childrenColumnId = res.data[0].id;  //初始化或者切换是获取子级Id

                    // let tempColumnDataMap = this.columnDataMap[0];
                    // console.log(tempColumnDataMap,'res.data[0].id');
                    // tempColumnDataMap['childrenColumnId'] = res.data[0].id;
                    // tempColumnDataMap.selectChildrenIndex = 0;
                    // this.seve_columnDataMap(tempColumnDataMap);//保存离开本页面保存的数据
                }else {
                    this.childrenColumnId = '';
                    this.getColumnData(columnId); //当没有子级的时候才获取自身的数据
                    this.columnChildrenList = [];
                }
            },
            search(){
                if(this.type == 0){
                    let postData = {
                        page: this.listQuery.page,
                        limit: this.listQuery.limit,
                        productName: this.productName,
                        type: this.selectType,
                        categoryId: this.categoryId,
                        isOnSale: 'y'
                    }
                    this.listLoading02 = true;
                    this.puLoading = true;
                    this.loadingText =  '拼命加载中';
                    this.isLoadingEnd = false;
                    searchGoods(postData).then(res => {
                        this.listLoading02 = false;
                        this.puLoading = false;
                        console.log(res, '商品');
                        this.list = res.data.records;
                        this.total = res.data.total;
                        if(res.data.total < 100){
                            this.isLoadingEnd = true;
                        }
                        if(!this.listScroll || isToggleColumn){
                            this.$nextTick(() => {
                                let ch = document.documentElement.clientHeight-330;
                                this.$refs.searchdata.style.height = ch+'px';
                                this._initScroll();
                            }); 
                            isToggleColumn = false
                        }else {
                            this.$nextTick(() => {
                                this.pullingDownUp();
                                let templArr = [];
                                this.list.forEach((item, index) => {
                                    this.checkedItems.forEach((item02, index02) => {
                                        if(item.productNo == item02.productNo){
                                            templArr.push(item);
                                        }
                                    });
                                });
                                this.checkedItems = templArr;
                                this.getDataList(templArr);
                                //this._initScroll();
                            }); 
                        }
                    });
                    this.dataList = [];
                }else {
                    this.getStoreData();
                }
            },
            getStoreData(){
                let postData = {
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    storeName: this.productName,
                    cityId: this.cityId,
                    categoryId: this.categoryId
                }
                console.log(postData,'搜索参数');
                this.puLoading = true;
                this.loadingText =  '拼命加载中';
                searchStore(postData).then(res => {
                    console.log(res, '店铺');
                    this.list = res.data.records;
                    this.total = res.data.total;
                    this.puLoading = false;
                    if(!this.listScroll || isToggleColumn){
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-385;
                            this.$refs.searchdata.style.height = ch+'px';
                            this._initScroll();
                        }); 
                        isToggleColumn = false
                    }else {
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-385;
                            this.$refs.searchdata.style.height = ch+'px';
                            if(isCityChange){
                                this._initScroll();
                                isCityChange = false;
                            }
                            this.pullingDownUp();
                            let templArr = [];
                            this.list.forEach((item, index) => {
                                this.checkedItems.forEach((item02, index02) => {
                                    if(item.storeNo == item02.storeNo){
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
            async selectCloumn(index, id, type){
                isToggleColumn = true;
                this.isLoadingEnd = false;
                this.selectIndex = index;
                this.columnId = id;
                this.type = type;
                this.list = [];
                this.dataList = [];
                this.checkedItems = [];
                this.listQuery.page = 1;
                this.listQuery.limit = 100;
                this.listQuery02.page = 1;
                this.listQuery02.limit = 10;
                this.childrenColumnId = ''; //清空子级id
                this.selectChildrenIndex = 0; //切换栏目是选中第一个子级索引
                this.seve_columnDataMap({appId:this.currentAppId,columnId:id,currentIndex: index, type: type});//保存离开本页面保存的数据

                this.fetchChildrenColumn(this.columnId);
            },
            async selectChildrenCloumn(index, columnId){
                this.selectChildrenIndex = index;

                // let tempColumnDataMap = this.columnDataMap[0];
                // tempColumnDataMap.childrenColumnId = columnId;
                // tempColumnDataMap.selectChildrenIndex = this.selectChildrenIndex;
                // tempColumnDataMap.selectChildrenIndex = 0;
                // this.seve_columnDataMap(tempColumnDataMap);//保存离开本页面保存的数据

                this.fetchChildrenColumnData(columnId);
                this.childrenColumnId = columnId;
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
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
            },
            // handleSelectionChange(value){
            //     this.getDataList(value);
            //     this.checkedItems = value;
            //     console.log(value);
            // },
            getDataList(list){
                if(list.length != 0){
                    this.dataList = [];
                    if(this.type == 0){
                        list.forEach((item, index) => {
                            this.dataList.push({
                                appId: item.appId,
                                targetNo: item.productNo,
                                sort: item.sort
                            });
                        });
                    }else {
                        list.forEach((item, index) => {
                            this.dataList.push({
                                appId: item.appId,
                                targetNo: item.storeNo,
                                sort: item.sort
                            });
                        });
                    }
                }else {
                    this.dataList = [];
                }
            },
            getColumnData(id){
                this.columnData = [];
                this.listLoading = true;
                let postData = {
                    page: this.listQuery02.page,
                    limit: this.listQuery02.limit,
                    cityId: this.cityId,
                    name: this.searchObj.name,
                    targetNo: this.searchObj.targetNo
                }
                fetchColumnData(id,postData).then(res => {
                    this.listLoading = false 
                    console.log(res, '栏目数据')
                    this.columnData = res.data.records;
                    this.total02 = res.data.total;
                });
            },
            async add(){
                    if(this.dataList.length != 0){
                        this.dataList.forEach(item => {
                            item.appId = this.currentAppId;
                        })
                        if(!this.childrenColumnId) { //没有子级的时候绑定数据
                            addDataForColumn(this.columnId, this.dataList).then(res => {
                                console.log(res, '为栏目添加数据');
                                this.checkedItems = [];
                                this.dataList = [];
                                this.checkAll = false;
                                if(res.data.data){
                                    this.getColumnData(this.columnId);
                                }
                                this.$notify({
                                    title: res.data.data ? '成功' : '失败',
                                    message: res.data.msg,
                                    type: res.data.data ? "success": 'error',
                                    duration: 3000
                                });
                            });
                        }else { //有子集的时候绑定数据
                            const res02 = await addDataByColumn(this.childrenColumnId, this.dataList);
                            console.log(res02, '子集添加数据');
                            this.checkedItems = [];
                            this.dataList = [];
                            this.checkAll = false;
                            if(res02.data.data){
                                this.fetchChildrenColumnData(this.childrenColumnId);
                            }
                            this.$notify({
                                title: res02.data.data ? '成功' : '失败',
                                message: res02.data.msg,
                                type: res02.data.data ? "success": 'error',
                                duration: 3000
                            });
                        }
                    }else {
                        this.$message({
                            message: '请选择你需要添加的数据',
                            type: 'warning'
                        });
                    }
            },
            addOfchildrenColumn(){

            },
            async handleDelete({id}){
                if(id){

                    if(!this.childrenColumnId) { //没有子级的时候
                        deleteDataForColumn(id).then(res => {
                            if(res.data.code == 0){
                                this.$notify({
                                    title: res.statusText,
                                    message: res.data.msg,
                                    type: "success",
                                    duration: 2000
                                });
                                this.getColumnData(this.columnId);
                            }
                        });
                    }else { //有子级的时候
                        const res = await delColumnsData(id);
                        if(res.data.data){
                            this.$notify({
                                title: res.data.data ? '成功':'失败',
                                message: res.data.msg,
                                type: res.data.data ? "success":'error',
                                duration: 2000
                            });
                            this.fetchChildrenColumnData(this.childrenColumnId);
                        }
                    }
                }else {
                    this.$notify({
                        title: "失败",
                        message: "id为空",
                        type: "error",
                        duration: 2000
                    });
                }
            },
            hidePopover(row){
                this.columnData.some((item, index) => {
                    if(row.id == item.id){
                        item.isShowPopover = false;
                        this.$set(this.columnData, index, item)
                        return true;
                    }
                });
            },
            showPopover(row){
                this.columnData.some((item, index) => {
                    if(row.id == item.id){
                        item.isShowPopover = true;
                        this.$set(this.columnData, index, item)
                        return true;
                    }
                });
            },
            editorColumnData(row){
                let postData = {
                    appId: row.appId,
                    targetNo: row.targetNo,
                    sort: row.sort,
                    id: row.id
                }
                if(!this.childrenColumnId) { //没有子级的时候
                    fetchEditorColumnData(postData).then(res => {
                    });
                }else {
                    childColumnEditor(postData).then(res => {
                    });
                }
            },
            changeCity(valueArr){
                this.cityId = valueArr[1];
                isCityChange = true;
                this.listQuery.page = 1;
                this.listQuery.limit = 100;
                this.getColumnData(this.columnId);
            },
            getCityId(){
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
            // filterCityArr(cityId) {
            //     this.provinceCity.forEach((item, index) => {
            //         if(item.cities.length != 0){
            //             item.cities.forEach((item02, index02) => {
            //                 if(item02.id === Number(cityId)){
            //                     this.cityArr[0] = item.id;
            //                     this.cityArr[1] = item02.id;
            //                 }
            //             });
            //         }
            //     });
            // },
            handleCurrentChange(val) {
                this.save_selectData(this.selectedList);
                this.listQuery02.page = val;
                if(!this.childrenColumnId) { //没有子级的时候
                    this.getColumnData(this.columnId);
                }else { //有子级的时候
                    this.fetchChildrenColumnData(this.childrenColumnId);
                }
            },
            handleSizeChange(val) {
                console.log(val,'3333333');
                this.save_selectData(this.selectedList);
                this.listQuery02.limit = val
                if(!this.childrenColumnId) { //没有子级的时候
                    this.getColumnData(this.columnId);
                }else { //有子级的时候
                    this.fetchChildrenColumnData(this.childrenColumnId);
                }
            },
            // 选中的商品数据
            selectData(selection){
                console.log(selection,'选中');
                this.selectedList = selection;
                if(this.selectedList.length == 0){
                    this.deleteDisabled = true;
                }else{
                    this.deleteDisabled = false;
                }
                //this.save_selectData(selection);
            },
            clearCityId(){
                this.cityId = null;
                this.cityArr = [];
                this.getColumnData(this.columnId);
            },
            clearCategoryId(){
                this.currCategory= [];
                this.categoryId= '';
            },
            // 排序方式
            handleCommand(command){
                console.log(command)
                if(command == '顺序排序'){
                    this.fetchSort();
                }else if(command == '去重排序'){
                    this.toReorderSort();
                }
            },
            // 搜索
            searchSelectData(){
                if(!this.childrenColumnId) { //没有子级的时候
                    this.getColumnData(this.columnId);
                }else { //有子级的时候
                    this.fetchChildrenColumnData(this.childrenColumnId);
                }
            },
            // 顺序排序
            async fetchSort(){
                let postData = {
                    appId: this.currentAppId
                }
                if(!this.childrenColumnId) { //没有子级的时候
                    const res = await auotSort(this.columnId, postData);
                }else { //有子级的时候
                    const res = await auotSort(this.childrenColumnId, postData);
                }
                const res = await auotSort(this.childrenColumnId, postData);
                this.$notify({
                    title: res.data.data ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 2000
                });
            },
            // 去重排序
            async toReorderSort(){
                let postData = {
                    appId: this.currentAppId
                }
                if(!this.childrenColumnId) { //没有子级的时候
                    const res = await toReorder(this.columnId, postData);
                }else { //有子级的时候
                    const res = await toReorder(this.childrenColumnId, postData);
                }
                const res = await toReorder(this.childrenColumnId, postData);
                this.$notify({
                    title: res.data.data ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 2000
                });
            },
            // 删除选中商品
            deleteProducts(){
                console.log(this.selectedList,'删除选中的数据')
                this.visible = false;
                this.productIds = [];
                // 遍历选中的数据 将每一个id push到一个数组中
                this.selectedList.forEach((item)=>{
                    this.productIds.push(item.id)
                })
                let id = '';
                // 将数组中所有的id用逗号拼接成一个字符串
                var obj = {
                    ids:this.productIds.join(',')
                };
                if(!this.childrenColumnId){
                    id = this.columnId
                    deleteByColumn(id,obj).then((resp)=>{
                        if(resp.data.code == 0){
                            this.$notify({
                                message: resp.data.msg,
                                type: resp.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                        }
                        this.getColumnData(this.columnId);
                    })
                }else{
                    id = this.childrenColumnId
                    deleteByChildColumn(id,obj).then((resp)=>{
                        if(resp.data.code == 0){
                            this.$notify({
                                message: resp.data.msg,
                                type: resp.data.data ? 'success' : 'error',
                                duration: 2000
                            });
                        }
                        this.fetchChildrenColumnData(this.childrenColumnId);
                    })
                }
            },
            // 导出商品数据
            exportProduct(){
                let postData = {
                    page: this.listQuery02.page,
                    limit: this.listQuery02.limit,
                    name: this.searchObj.name,
                    targetNo: this.searchObj.targetNo
                }
                this.$notify({
                    title: '导出中',
                    message: '导出中，请稍等。。。',
                    type: 'success',
                    duration: 1000
                });
                this.exportLoading = true; 
                let id = '';
                // 如果没有子级,就用exportDataByColumn. 否则exportDataBychildColumn
                if(!this.childrenColumnId){
                    id = this.columnId
                    exportDataByColumn(id,postData).then((resp)=>{
                        if(resp.status == 200){
                            if(resp.data.msg){
                                this.exportLoading = false;
                                this.$notify({
                                    message: resp.data.msg,
                                    type: 'error',
                                    duration: 2000
                                });
                            }else{
                                window.location.href = resp.request.responseURL;
                                this.exportLoading = false;
                            }; 
                        }
                    })
                }else{
                    id = this.childrenColumnId
                    exportDataBychildColumn(id,postData).then((resp)=>{
                        console.log(resp)
                        if(resp.status == 200){
                            window.location.href = resp.request.responseURL;
                            this.exportLoading = false; 
                        }
                    })
                }
            },
            closeName(){
               this.searchObj.name = ''
            },
            closeTargetNo(){
               this.searchObj.targetNo = ''
            },
            closeProductName(){
                this.productName = '';
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(!vm.childrenColumnId) { //没有子级的时候
                    vm.getColumnData(vm.columnId);
                }else { //有子级的时候
                    vm.fetchChildrenColumnData(vm.childrenColumnId);
                }
            });
        }
    }
</script>
<style lang="scss">
    .router{
        position: relative;
    }
    .list-wrapper{
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .list-item{
        flex-grow: 1;
        height: 100%;
        margin: 0 3px;
        // position: relative;
    }
    .list-item:first-child{
        margin-left: 0;
    }
    .list-item:last-child{
        margin-right: 0;
    }
    .list-item h2{
        width: 100%;
        font-size: 16px;
        text-align: center;
        // padding-left: 17px;
        background-color: #1086ff;
        color: #fff;
    }
    // .list-item .list02_home_h2{
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    // }
    // .list02_home_ul{
    //     margin-top: 36px;
    // }
    .list01{
        border-left: 1px solid #ebeef5;    
        border-right: 1px solid #ebeef5;
    }
    .list-item ul li.column{
        list-style: none;
        margin: 5px 15px;
        padding: 5px 0;
        border-bottom: 1px solid #ebeef5;
        color: #606266;
        display: flex;
        flex-direction: column;
    }
    .list-item ul li span{
        line-height: 1em;
        margin-bottom: 2px;
        display: inline-block;
    }
    .list-item ul li.column-sel{
        color: #1086ff;
    }
    .list-item ul li.cloumnName-sel span{
        color: #1086ff;
    }
    .list-item ul li:hover{
        cursor: pointer;
    }
    .list-item ul li:hover span{
        color: #1086ff;
    }
    .list-item ul li span.column_text_min{
        font-size: 12px;
    }
    .list02_home{
        flex-grow: 1;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        overflow-y: scroll;
        .column-tip{
            color: #606266; 
            text-align: center;
            margin-top: 10px;
        }
    }
    .list03{
        position: relative;
        flex-grow: 65;
    }
    
    .data-box{
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-top: 1px solid #ebeef5;
    }
    .box-left{
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        overflow: hidden;
        position: relative;
    }
    .box-right{
        flex-grow: 1;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        overflow-x: scroll; 
    }
    .lbztable{
        height: 85%;
        box-sizing: border-box;
        .tabTop{
            height: 95%;
            overflow: scroll;
            box-sizing: border-box;
        }
        
        .fenye{
            height: 5%;
        }
    }
    .input-with-select01{
        width: auto!important;
        padding-left: 10px;
    }
    .input-with-select01 .el-input__inner{
        padding-right: 22px!important;
    }
    .box-left .el-checkbox{
        display: flex;
        margin-left: 10px;
    }
    .box-left .el-checkbox+.el-checkbox{
        margin-left: 10px;
    }
    .cloumnName-sel{
        color: #1086ff;
    }
    .box-left .el-checkbox{
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 10px 0;
    }
    .search-data-wrapper{
        width: 100%;
        overflow: hidden;
        position: relative;
        border-bottom: 1px solid #ebeef5;
    }
    .vloading{
        width: 100%;
        height: 100px;
        position: absolute;
        left: 0;
        top: 0px;
    }
    .sort .el-input__inner{
        padding: 0 2px;
        height: 25px;
        line-height: 25px;
        text-align: center;
    }
    .el-loading-spinner .el-loading-text{
        text-align: center;
    }
    .box-left .el-input-group__prepend{
        width: 70px!important;
        padding: 0 14px!important;
        background-color: #fff!important;
    }
    .box-left .el-select{
        width: auto!important;
    }
    /* .el-select{
        width: auto!important;
    } */
    .city-cascader{
        width: 426px;
        margin: 10px auto 10px auto;
        position: relative;
    }
    .city-cascader .city-close{
        position: absolute;
        top: 5px;
        right: 30px;
    }
    .city-cascader .city-close .el-icon-error:before{
        color: #999;
        cursor: pointer;
    }
    .box-left .el-checkbox__label{
        display: inline-flex!important;
        align-items: center;
    }
    .el-checkbox{
        display: flex;
        align-items: center;
    }
    .x-name{
        width: 350px;
        margin-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .tip-loading{
        padding: 5px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tip-loading .tip-text{
        color: #606266;
        font-size: 16px;
        margin-left:5px;
    }
    .icon-jiazaichenggong:before{
        font-size: 24px;
    }
    .home-category{
        position: relative;
    }
    .home-category .city-close{
        position: absolute;
        /* top: 50%;
        transform: translateY(-50); */
        top: 5px;
        right: 30px;
    }
    .home-category .city-close .el-icon-error:before{
        color: #999;
        cursor: pointer;
    }
    .lbz-func{
        margin-bottom: 10px;
        .funcBtn{
            margin-right: 10px;
        }
    }
</style>
