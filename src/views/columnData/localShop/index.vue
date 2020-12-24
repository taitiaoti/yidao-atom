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
            <div class="list-item list02">
                <h2>栏目数据设置</h2>
                <div v-if="columnList.length == 0" class="column-tip">暂无数据~</div>
                <ul>
                    <li class="column" v-for="(item, index) in columnList" @click="selectCloumn(index, item.id, item.type)" :class="selectIndex == index ? 'cloumnName-sel' : ''" :key="index">
                        <span>{{item.columnName}}</span>
                    </li>
                </ul>
            </div>
            <div class="list-item list03">
                <div class="data-box" v-if="columnList.length != 0">
                    <div class="box-left">
                        <div class="city-cascader02">
                            <el-cascader
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
                        <el-row style="margin-top: 10px;" class="local-shop-category">
                            <el-col :span="23" style="margin-left: 10px;">
                                <div>
                                    <el-cascader :options="categoryList" placeholder="请选择分类"  change-on-select  v-model="currCategory" @change="handleChange"></el-cascader>
                                </div>
                            </el-col>
                            <div class="city-close" v-if="this.currCategory.length != 0" @click="clearCategoryId">
                                <i class="el-icon-error"></i>
                            </div>
                        </el-row>
                        <el-input placeholder="请输入内容" v-model="name" class="input-with-select02">
                            <el-button slot="append" @click="search" icon="el-icon-search">
                            </el-button>
                            <i slot="suffix" v-show="name" class="el-input__icon el-icon-circle-close" @click="closeProductName"></i>
                        </el-input>
                        <el-button slot="append" @click="add" icon="el-icon-plus"></el-button>
                        <el-checkbox v-if="this.list.length != 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div class="search-data-wrapper" ref="searchdata">
                            <div class="search-data">
                                <div style="margin: 15px 0;"></div>
                                <el-checkbox-group slot="reference" v-model="checkedItems" @change="handleCheckedItemsChange">
                                        <el-checkbox  v-for="(item,index) in list" :label="item" :key="index">
                                            <img  :src="item.iconUrl.indexOf('http')==0?item.iconUrl:(baseUrl+item.iconUrl)" height="50" width="50" >
                                            <span class="x-name02">{{item.storeName}}</span>
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
                        <div class="vloading" v-if="puLoading">
                            <div  class="vloading" v-loading="puLoading" element-loading-background="rgba(255, 255, 255, 0.8)" :element-loading-text="loadingText"  element-loading-spinner="el-icon-loading"></div>
                        </div>
                    </div>
                    <div class="box-right">
                        <div style="padding: 10px 0 0 15px;border-bottom: 1px solid #ebeef5;">
                            <el-input v-model="searchObj.name"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入名称">
                                <i slot="suffix" v-show="searchObj.name" class="el-input__icon el-icon-circle-close" @click="closeName"></i>
                            </el-input>
                            <el-input v-model="searchObj.targetNo"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入目标编号">
                                <i slot="suffix" v-show="searchObj.targetNo" class="el-input__icon el-icon-circle-close" @click="closeTargetNo"></i>
                            </el-input>
                            <el-button type="primary" icon="el-icon-search" @click="searchSelectData">搜索</el-button>
                        </div>
                        <el-table
                            ref="multipleTable"
                            :data="columnData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :height="tableHeight"
                            v-loading="listLoading"
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
                            <template slot-scope="scope">
                                <el-input class="sort" @blur="editorColumnData(scope.row)" v-model="scope.row.sort"></el-input>    
                            </template>
                            </el-table-column>
                            <el-table-column
                            label="目标编号"
                            align="center"
                            width="200">
                            <template slot-scope="scope">{{ scope.row.targetNo }}</template>
                            </el-table-column>
                            <el-table-column
                            label="名称"
                            align="center"
                            >
                                <template slot-scope="scope">{{ scope.row.name }}</template>
                            </el-table-column>
                            <el-table-column align="center" label="图标地址" width="100">
                                <template slot-scope="scope">
                                <img  :src="scope.row.imageUrl.indexOf('http')==0?scope.row.imageUrl:(baseUrl+scope.row.imageUrl)" height="70" width="70" >
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
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
                        <div v-show="!listLoading" style="margin-top: 15px;" class="pagination-container">
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
</template>
<script>
    import {
        fetchStoreColumnList,
        searchStore,
        fetchStoreColumnData,
        addDataForStoreColumn,
        deleteDataForStoreColumn,
        fetchEditorStoreColumnData} from "@/api/columnData/localShop";
    import {fetchCity} from "@/api/merchants/merchants";
    import { fetchCas } from "@/api/product/category";    
    import BScroll from 'better-scroll'
    let isToggleColumn = false;
    let isCityChange = false;
    import {mapGetters, mapMutations} from 'vuex';
    export default {
        data() {
            return {
                columnList: [],
                name: '',
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
                columnData:[],
                type: 0,
                baseUrl:"http://qiniu.edawtech.com/",
                tableHeight: document.documentElement.clientHeight-260,
                dataList: [],
                columnId: '',
                popover: false,
                listLoading: true,
                options: [],
                provinceCity: [],
                cityArr: [],
                // cityArr: [19,200],
                // cityId: 200,
                cityId: null,
                loadingText: '拼命加载中',
                puLoading: false,
                isLoadingEnd: false,
                categoryList: [],
                currCategory: [],
                categoryId: '',
                searchObj: {
                    name: '',
                    targetNo: ''
                },
                currentAppList: [],
                appIdIndex: 0,
                currentAppId: ''
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
                    let ch = document.documentElement.clientHeight-300;
                    this.$refs.searchdata.style.height = ch+'px';
                })()
            }
        }, 
        computed:{
            ...mapGetters(['localShopMap']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        }, 
        methods: {
            ...mapMutations(['seve_localShopMap']),
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
            getColumnList(appId, appIdIndex){
                this.appIdIndex = appIdIndex;
                this.currentAppId = appId;
                this.dataList = [];
                let postData = {
                    appId: appId
                }
                fetchStoreColumnList(postData).then(res => {
                    console.log(res, '店铺栏目列表');
                    if(res.data.length != 0){
                        this.columnList = res.data;
                        this.columnId = res.data[0].id;
                        let tempColumnId = "";

                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-375;
                            this.$refs.searchdata.style.height = ch+'px';
                            this._initScroll();
                        });
                        if(this.localShopMap && this.localShopMap.length > 0){
                            this.localShopMap.forEach((item, index) => {
                                if(item.appId == appId){
                                    tempColumnId = item.columnId,
                                    this.columnId = !!item.columnId ? item.columnId : this.columnList[0].id;
                                    this.selectIndex = item.currentIndex;
                                }
                            });
                        } 
                        if(!!tempColumnId){
                            this.getColumnData(tempColumnId)
                        }else {
                            this.getColumnData(this.columnList[0].id);
                            this.selectIndex = 0;
                        }

                        // this.getColumnData(res.data[0].id);
                        this.type = res.data[0].type;
                    }else {
                        this.columnList = [];
                    }
                });
            },
            search(){
                let postData = {
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    storeName: this.name,
                    cityId: this.cityId,
                    categoryId: this.categoryId,
                }
                console.log(postData,'搜索参数');
                this.loadingText =  '拼命加载中';
                this.puLoading = true;
                this.isLoadingEnd = false;
                searchStore(postData).then(res => {
                    console.log(res, '店铺');
                    this.list = res.data.records;
                    this.total = res.data.total;
                    this.puLoading = false;
                    if(res.data.total < 100){
                        this.isLoadingEnd = true;
                    }
                    if(!this.listScroll || isToggleColumn){
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-375;
                            this.$refs.searchdata.style.height = ch+'px';
                            this._initScroll();
                        }); 
                        isToggleColumn = false
                    }else {
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-375;
                            this.$refs.searchdata.style.height = ch+'px';
                            if(isCityChange){
                                this._initScroll();
                                isCityChange = false;
                            }
                            this.pullingDownUp();
                            let templArr = []
                            this.list.forEach((item, index) => {
                                this.checkedItems.forEach((item02, index02) => {
                                    if(item.storeNo == item02.storeNo){
                                        templArr.push(item);
                                    }
                                });
                            });
                            this.checkedItems = templArr;
                        }); 
                    }
                });
                this.dataList = [];
            },
            selectCloumn(index, id, type){
                isToggleColumn = true;
                this.isLoadingEnd = false;
                this.selectIndex = index;
                this.columnId = id;
                this.type = type;
                this.list = [];
                this.dataList = [];
                this.checkedItems = [];
                this.getColumnData(this.columnId);                
                this.listQuery.page = 1;
                this.listQuery.limit = 100;
                this.seve_localShopMap({appId:this.currentAppId,columnId:id,currentIndex: index});
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
            getDataList(list){
                if(list.length != 0){
                    this.dataList = [];
                    list.forEach((item, index) => {
                        this.dataList.push({
                            appId: item.appId,
                            targetNo: item.storeNo,
                            sort: item.sort
                        });
                    });
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
                    targetNo: this.searchObj.targetNo,
                    appId: this.currentAppId 
                }
                fetchStoreColumnData(id,postData).then(res => {
                    this.listLoading = false 
                    console.log(res, '店铺栏目数据')
                    this.columnData = res.data.records;
                    this.total02 = res.data.total;
                    if(this.columnData){
                        this.columnData.forEach((item, index) => {
                            item.isShowPopover = false;
                        });
                    }
                });
            },
            add(){
                if(this.dataList.length != 0){
                    addDataForStoreColumn(this.columnId, this.dataList).then(res => {
                        console.log(res, '为栏目添加数据');
                        this.checkedItems = [];
                        this.dataList = [];
                        this.checkAll = false;
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
                }else {
                    this.$message({
                        message: '请选择你需要添加的数据',
                        type: 'warning'
                    });
                }
            },
            handleDelete(row){
                if(row.id){
                    deleteDataForStoreColumn(row.id).then(res => {
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
                fetchEditorStoreColumnData(postData).then(res => {
                    console.log(res, '修改');
                    //this.getColumnData(this.columnId);
                });
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
            handleCurrentChange(val) {
                this.listQuery02.page = val
                this.getColumnData(this.columnId);
            },
            handleSizeChange(val) {
                this.listQuery02.limit = val
                this.getColumnData(this.columnId);
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
            searchSelectData(){
                this.getColumnData(this.columnId);
            },
            closeName(){
               this.searchObj.name = ''
            },
            closeTargetNo(){
               this.searchObj.targetNo = ''
            },
            closeProductName(){
                this.name = '';
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getColumnData(vm.columnId);                
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
    }
    .list-item:first-child{
        margin-left: 0;
    }
    .list-item:last-child{
        margin-right: 0;
    }
    .list-item h2{
        font-size: 16px;
        text-align: center;
        background-color: #1086ff;
        color: #fff;
    }
    .list01{
        border-left: 1px solid #ebeef5;    
        border-right: 1px solid #ebeef5;
    }
    .list-item ul li.column{
        list-style: none;
        margin: 5px 15px;
        border-bottom: 1px solid #ebeef5;
        color: #606266;
        &.column-sel{
            color: #1086ff;
        }
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
    .list02{
        flex-grow: 3;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        .column-tip{
            color: #606266; 
            text-align: center;
            margin-top: 10px;
        }
    }
    .list03{
        position: relative;
        flex-grow: 40;
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
    .data-box .box-left{
        width: 345px;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        margin-right: 5px;
        overflow: hidden;
        position: relative;
    }
    .data-box .box-right{
        flex-grow: 1;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
    }
    .input-with-select02 .el-button{
        /* margin-right: 5px; */
        padding: 12px 21px;
    }
    .input-with-select02{
        width: auto!important;
        margin: 10px 5px 0 10px;
    }
    .input-with-select02 .el-input__inner{
        padding-right: 15px!important;
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
        border-bottom: 1px solid #ebeef5;
    }
    .sort .el-input__inner{
        padding: 0 2px;
        height: 25px;
        line-height: 25px;
        text-align: center;
    }
    .city-cascader02{
        width: 331px;
        margin: 10px auto 0 10px;
        position: relative;
    }
    .local-shop-category{
        position: relative;
    }
    .city-cascader02 .city-close, .local-shop-category .city-close{
        position: absolute;
        /* top: 50%;
        transform: translateY(-50); */
        top: 5px;
        right: 30px;
    }
    .local-shop-category .city-close{
        right: 34px;
    }
    .city-cascader02 .city-close .el-icon-error:before,
    .local-shop-category .city-close .el-icon-error:before{
        color: #999;
        cursor: pointer;
    }
    .vloading{
        width: 100%;
        height: 100px;
        position: absolute;
        left: 0;
        top: 0px;
    }
    .el-loading-spinner .el-loading-text{
        text-align: center;
    }
    .box-left .el-checkbox__label{
        display: inline-flex!important;
        align-items: center;
    }
    .el-checkbox{
        display: flex;
        align-items: center;
    }
    .x-name02{
        width: 250px;
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
</style>
