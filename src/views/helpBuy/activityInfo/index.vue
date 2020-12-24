<template>
    <div class="container">
        <div class="list-wrapper">
            <div class="list-item list01">
                <h2>渠道列表</h2>
                <ul>
                    <li class="column" :class="item.appId == currentAppId ? 'column-sel': ''" 
                    v-for="(item, index) in currentAppList" :key="index" @click="handAppType(item.appId)">
                        <span>{{item.appName}}</span>
                    </li>
                </ul>
            </div>
            <div class="list-item li02">
                <div>
                    <h2>活动名称</h2>
                    <div v-if="activityData.length == 0" class="column-tip">暂无数据~</div>
                    <ul>
                        <li class="column" v-for="(item, index) in activityData"
                         :class=" activityId == item.id ? 'cloumnName-sel' : '' " 
                         :key="index"
                         @click="handActivityName(item.id)">
                            <span>{{item.activityName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="list-item list03">
                <div class="data-box" v-if="activityData.length != 0">
                    <div class="box-left" style="width:445px!important;margin-right: 5px;flex-shrink: 0;">
                        <el-row style="margin-top: 10px;" class="business-category">
                            <el-col :span="23" style="margin-left: 10px;">
                                <div>
                                    <el-cascader :options="categoryList" change-on-select placeholder="请选择分类" v-model="currCategory" @change="handleChange"></el-cascader>
                                </div>
                            </el-col>
                            <div class="category-close" v-if="this.currCategory.length != 0" @click="clearCategoryId">
                                <i class="el-icon-error"></i>
                            </div>
                        </el-row>
                        <el-input placeholder="请输入内容" v-model="productName" class="input-with-select03">
                            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                                <el-option
                                v-for="item in selectTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button slot="append" @click="search" icon="el-icon-search">
                            </el-button>
                            <i slot="suffix" v-show="productName" class="el-input__icon el-icon-circle-close" @click="closeProductName"></i>
                        </el-input>
                        <div class="search-data-wrapper" ref="searchdata">
                            <div class="search-data">
                                <div style="margin: 15px 0;"></div>
                                <el-checkbox-group slot="reference" v-model="checkedItems">
                                        <el-checkbox  v-for="(item,index) in list" @change="handleCheckedItem(item)" :label="item" :key="index">
                                            <img  :src="item.picture.indexOf('http')==0?item.picture:(baseUrl+item.picture)" height="50" width="50" >
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
                        </div> -->
                        <div v-if="puLoading" >
                            <div  class="vloading" v-loading="puLoading" element-loading-background="rgba(255, 255, 255, 0.8)" :element-loading-text="loadingText"  element-loading-spinner="el-icon-loading"></div>
                        </div>
                    </div>
                    <div class="box-right">
                        <div style="padding: 10px 0 0 22px;border-bottom: 1px solid #ebeef5;">
                            <el-input v-model="searchGoods.name"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入商品名称">
                                <i slot="suffix" v-show="searchGoods.name" class="el-input__icon el-icon-circle-close" @click="closeName"></i>
                            </el-input>
                            <el-input v-model="searchGoods.targetNo"  style="width:200px;margin-bottom: 10px;" prefix-icon="el-icon-search" placeholder="请输入目标编号">
                                <i slot="suffix" v-show="searchGoods.targetNo" class="el-input__icon el-icon-circle-close" @click="closeTargetNo"></i>
                            </el-input>
                            <el-button type="primary" icon="el-icon-search" @click="searchSelectData">搜索</el-button>
                            <!-- <el-button type="primary" @click="fetchSort">自动排序</el-button> -->
                        </div>
                        <el-table
                            ref="multipleTable"
                            :data="columnData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            :height="tableHeight"
                            v-loading="listLoading"
                            >
                            <!-- <el-table-column
                            type="selection"
                            align="center"
                            width="55">
                            </el-table-column> -->
                            <el-table-column
                            label="排序"
                            align="center"
                            width="70">
                            <template slot-scope="scope">
                                <span>{{scope.row.placeholder ? scope.row.placeholder : 0}}</span>
                            </template>
                            </el-table-column>
                            <el-table-column
                            label="目标编号"
                            align="center"
                            width="200">
                            <template slot-scope="scope">{{ scope.row.productNo }}</template>
                            </el-table-column>
                            <el-table-column
                            label="名称"
                            align="center"
                            >
                                <template slot-scope="scope">{{ scope.row.productName }}</template>
                            </el-table-column>
                            <el-table-column align="center" label="图标地址" width="100">
                                <template slot-scope="scope">
                                <img  :src="scope.row.picture.indexOf('http')==0?scope.row.picture:(baseUrl+scope.row.picture)" height="70" width="70" >
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="handleEditor(scope.row)" slot="reference">编辑</el-button>
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
        <el-dialog title="帮购商品信息" :visible.sync="dialogFormVisible" @close="handleCloseDialog" width="540px">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="应    用    名    称" :label-width="formLabelWidth" prop="appId">
                    <el-select v-model="form.appId" placeholder="请选择应用">
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
                <el-form-item label="原                   价" :label-width="formLabelWidth" prop="originalPrice">
                    <el-input v-model="form.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="成        交        价" :label-width="formLabelWidth" prop="price">
                    <el-input v-model="form.price" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="总        库        存" :label-width="formLabelWidth" prop="inventorys">
                    <el-input v-model="form.inventorys" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剩    余     库    存" :label-width="formLabelWidth" prop="surplus">
                    <el-input v-model="form.surplus" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排                   序" :label-width="formLabelWidth">
                    <el-input v-model="form.placeholder" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="老用户砍价区间" :label-width="formLabelWidth">
                    <el-input v-model="form.oldStartPrice" autocomplete="off" class="priceInput"></el-input>元
                    <span class="priceInput_box">至</span>
                    <el-input v-model="form.oldStopPrice" autocomplete="off" class="priceInput"></el-input>元
                </el-form-item>
                <el-form-item label="新用户砍价区间" :label-width="formLabelWidth">
                    <el-input v-model="form.newStartPrice" autocomplete="off" class="priceInput"></el-input>元
                    <span class="priceInput_box">至</span>
                    <el-input v-model="form.newStopPrice" autocomplete="off" class="priceInput"></el-input>元
                </el-form-item>
                <el-form-item label="发起者砍价区间" :label-width="formLabelWidth">
                    <el-input v-model="form.userStartPrice" autocomplete="off" class="priceInput"></el-input>元
                    <span class="priceInput_box">至</span>
                    <el-input v-model="form.userStopPrice" autocomplete="off" class="priceInput"></el-input>元
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCloseDialog">取 消</el-button>
                <el-button type="primary" v-if="dialogType == 'add'" @click="handleSubmit('form')">确 定</el-button>
                <el-button type="primary" v-else @click="handleSubmitEditor('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    
    import { activityList, activityProductList, addHelpBuyGoods, updateHelpBuyGoods } from '@/api/helpBuy'

    import {
        fetchConvert,
        searchGoods,
        fetchConvertData,
        addDataForConvert,
        deleteDataForConvert,
        fetchEditorConvert} from "@/api/columnData/convert";
    import { auotSort } from "@/api/columnData/homeColumn";
    import { delHolidayProduct, editorHolidayProduct,getHolidayProduct,addHolidayProduct } from "@/api/spike/spikeData"
    import { getHolidaySeckillActivity } from "@/api/spike/spikeManage"
    import { fetchCas } from "@/api/product/category";    
    import BScroll from 'better-scroll'
    import { productTypeList } from "@/util/data"
    let isToggleColumn = false;
    let isSelectType = false;
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        data() {
            return {
                activityTypeData: [],         //活动类别
                activityData: [],             //活动名称列表
                searchObj: {
                  appId: '',
                  state: 1
                },
                currentAppId: '',             //appId
                activityId: '',               //活动id
                productNo: '',                //商品编号
                productName: '',              //商品名称

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
                listQuery03: {
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
                listLoading: false,
                puLoading: false,
                loadingText: '拼命加载中',
                isLoadingEnd: false,
                selectTypeList: productTypeList,
                selectType: 0,
                currCategory: [],
                categoryList: [],
                categoryId: '',
                searchGoods: {
                  name: '',
                  targetNo: ''
                },
                currentAppList: [],
                appIdIndex: 0,
                tempDataList: [],
                form: {
                    appId: '',
                    inventorys: '',         //总库存
                    surplus: '',            //剩余库存
                    originalPrice: '',              //原价
                    price: '',                  //成交价
                    placeholder: '',        //排序
                    productNo: '',          //商品编号
                    state: 1,
                    newStartPrice: '',      //新人起价
                    newStopPrice: '',      //新人结束价
                    oldStartPrice: '',      //老人起价
                    oldStopPrice: '',      //老人结束价
                    userStopPrice: '',      //发起者结束价
                    userStartPrice: '',      //发起者开始价
                },
                dialogFormVisible: false,
                formLabelWidth: '150px',
                dialogType: 'add',
                rules: {
                    appId: [{required: true, message: '请选择应用名称'}],
                    originalPrice: [{required: true, message: '请设置原价'}],
                    price: [{required: true, message: '请设置成交价'}],
                    inventorys: [{required: true, message: '请设置总库存'}],
                    surplus: [{required: true, message: '请设置剩余库存'}],
                },
                columnTotal: null
            }
        },
        created() {
            this.currentAppId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.searchObj.appId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';
            this.currentAppList = this.appIdList;
            this.getActivityData();
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
            ...mapGetters(['businessEnterpriseMap']),
            ...mapGetters('appId',{
                appIdList: 'appList'
            })
        }, 
        methods: {
            ...mapMutations(['save_businessEnterpriseMap']),
            getCategory() {
                fetchCas(null).then(response => {
                    this.categoryList = response.data;
                });
            },
            handleChange(value) {
                this.categoryId = value[value.length - 1];
                isToggleColumn = true;
                isSelectType = true
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
            // 选择app渠道
            handAppType(id){
                console.log(id)
                this.currentAppId = id;
                this.searchObj.appId = id;
                this.getActivityData();
            },
            // 选择活动名称
            handActivityName(id){
                this.listQuery02.page = 1;
                this.listQuery02.limit = 10;
                this.activityId = id;
                this.getGoodList();
            },
            // 活动名称
            getActivityData(){
              let postData = {
                ...this.searchObj
              }
              activityList(postData).then((res)=>{
                console.log(res)
                this.activityData = res.data.data;
                if(res.data.data.length !== 0){
                    this.activityId = res.data.data[0].id;
                    this.getGoodList();
                }else{
                    this.columnData = [];
                    this.total02 = 0;
                }
              })
            },
            // 获取活动对应的商品列表
            getGoodList(){
              this.listLoading = true;
              let postData = {
                  ...this.listQuery02,
                  appId: this.currentAppId,
                  productNo: this.searchGoods.targetNo,
                  productName: this.searchGoods.name,
                  helpId: this.activityId,
                  state: 1
              }
              activityProductList(postData,this.activityId).then((res)=>{
                  this.listLoading = false 
                  this.columnData = res.data.records;
                  this.total02 = res.data.total;
                  console.log(this.columnData,'绑定的商品列表')
                  if(this.columnData){
                    this.columnData.forEach((item, index) => {
                        item.isShowPopover = false;
                    });
                  }
              })
            },

            // 搜索所有栏目商品
            search(){
                let postData = {
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    productName: this.productName,
                    type: this.selectType,
                    categoryId: this.categoryId,
                    isOnSale: 'y'
                }
                this.puLoading = true;
                this.loadingText =  '拼命加载中';
                this.isLoadingEnd = false;
                searchGoods(postData).then(res => {
                    console.log(res, '商品');
                    this.list = res.data.records;
                    this.total = res.data.total;
                    this.puLoading = false;
                    if(res.data.total < 100){
                        this.isLoadingEnd = true;
                    }
                    if(!this.listScroll || isToggleColumn){
                        this.$nextTick(() => {
                            let ch = document.documentElement.clientHeight-300;
                            this.$refs.searchdata.style.height = ch+'px';
                            this._initScroll();
                        }); 
                        isToggleColumn = false
                    }else {
                        this.$nextTick(() => {
                             let ch = document.documentElement.clientHeight-300;
                            this.$refs.searchdata.style.height = ch+'px';
                            if(isSelectType){
                                this._initScroll();
                                isSelectType = false;
                            }

                            this.pullingDownUp();
                            let templArr = []
                            this.list.forEach((item, index) => {
                                this.checkedItems.forEach((item02, index02) => {
                                    console.log(item.productNo, item02.productNo,'pp');
                                    if(item.productNo == item02.productNo){
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
            // 选择商品
            handleCheckedItem(obj){
                this.dialogType = 'add';
                if(obj){
                    this.form.productNo = obj.productNo;
                    this.form.helpId = this.activityId;
                    this.dialogFormVisible = true;
                }
            },
            // 添加商品
            handleSubmit(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        console.log(this.form)
                        addHelpBuyGoods(this.form).then((res)=>{
                            console.log(res)
                            if(res.data.code == 0){
                                this.handleCloseDialog();
                                this.getGoodList();
                            }
                            this.notify(res);
                        })
                    }
                });
            },
            // 弹窗提醒
            notify(res){
                this.$notify({
                    title: res.data.code == 0 ? "成功" : '失败',
                    message: res.data.msg,
                    type: res.data.code == 0 ? "success" : 'error',
                    duration: 1500
                });
            },
            // 关闭弹窗
            handleCloseDialog(){
                this.dialogFormVisible = false;
                this.checkedItems = [];
                this._resetForm();
            },
            // 编辑商品
            handleEditor(row){
                this.dialogType = 'editor';
                this.form.appId = row.appId;
                this.form.id = row.id;
                this.form.helpId = row.helpId;
                this.form.inventorys = row.inventorys;
                this.form.newStartPrice = row.newStartPrice;      //新人起价
                this.form.newStopPrice = row.newStopPrice;      //新人结束价
                this.form.oldStartPrice = row.oldStartPrice;      //老人起价
                this.form.oldStopPrice = row.oldStopPrice;     //老人结束价
                this.form.userStartPrice = row.userStartPrice;      //老人起价
                this.form.userStopPrice = row.userStopPrice;     //老人结束价
                this.form.placeholder = row.placeholder;
                this.form.originalPrice = row.originalPrice;
                this.form.productNo = row.productNo;
                this.form.surplus = row.surplus;
                this.form.price = row.price;
                this.form.state = row.state;
                this.dialogFormVisible = true; 
            },
            // 确认修改
            async handleSubmitEditor(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        console.log(JSON.stringify(this.form))
                        const res = await updateHelpBuyGoods(this.form);
                        console.log(res,'编辑')
                        if(res.data.code == 0){
                            this.handleCloseDialog();
                            this.getGoodList();
                        }
                        this.notify(res);
                    }
                });
            },
            // 清空数据
            _resetForm(){
                this.form = {
                    appId: '',
                    inventorys: '',         //总库存
                    surplus: '',            //剩余库存
                    originalPrice: '',              //原价
                    price: '',                      //成交价
                    placeholder: '',        //排序
                    productNo: '',          //商品编号
                    state: 1,
                    newStartPrice: '',      //新人起价
                    newStopPrice: '',      //新人结束价
                    oldStartPrice: '',      //老人起价
                    oldStopPrice: '',      //老人结束价
                    userStartPrice: '',      //老人起价
                    userStopPrice: '',      //老人结束价
                    id: ''
                };
            },
            // 确定删除
            handleDelete(row){
                if(row.id){
                    row.state = 3;
                    updateHelpBuyGoods(row).then((res)=>{
                        if(res.data.code == 0){
                            this.getGoodList();
                        }
                        this.notify(res);
                    })
                }else {
                    this.$notify({
                        title: "失败",
                        message: "id为空",
                        type: "error",
                        duration: 2000
                    });
                }
            },
            // 取消删除
            hidePopover(row){
                this.columnData.some((item, index) => {
                    if(row.id == item.id){
                        item.isShowPopover = false;
                        this.$set(this.columnData, index, item)
                        return true
                    }
                });
            },
            // 删除提示框
            showPopover(row){
                this.columnData.some((item, index) => {
                    if(row.id == item.id){
                        item.isShowPopover = true;
                        this.$set(this.columnData, index, item)
                        return true;
                    }
                });
            },
            handleCurrentChange(val) {
                this.listQuery02.page = val
                this.getGoodList();
            },
            handleSizeChange(val) {
                this.listQuery02.limit = val
                this.getGoodList();
            },
            // 清空所选分类
            clearCategoryId(){
                this.currCategory= [];
                this.categoryId= '';
            },
            // 筛选活动商品
            searchSelectData(){
                this.getGoodList();
            },
            closeName(){
               this.searchGoods.name = ''
            },
            closeTargetNo(){
               this.searchGoods.targetNo = ''
            },
            closeProductName(){
                this.productName = '';
            },
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
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
    .li02{
        flex-grow: 3;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
    .input-with-select03{
        width: 96%;
        margin: 10px 5px 0 10px;
    }
    .input-with-select03 .el-input__inner{
        padding-right: 17px!important;
    }
    .box-left .el-checkbox{
        display: flex;
        align-items: center;
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
    .pagination-container{
        margin-top: 15px;
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
    .x-name03{
        width: 335px;
        margin-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .tip-loading{
        height: auto!important;
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
    .input-with-select{
        width: auto;
        padding: 10px 5px 0 8px;
    }
    /* .el-input-group__prepend{
        width: 70px;
        padding: 0 14px;
        background-color: #fff;
    } */
    .box-left .el-input-group__prepend{
        width: 70px!important;
        padding: 0 14px!important;
        background-color: #fff!important;
    }
    .box-left .el-select{
        width: auto!important;
    }
    .business-category{
        position: relative;
    }
    .business-category .category-close{
        position: absolute;
        top: 5px;
        right: 40px;
    }
    .business-category .category-close .el-icon-error:before{
        color: #999;
        cursor: pointer;
    }
    .bscroll-vertical-scrollbar{
        z-index: 999!important;
    }
    .priceInput{
        width: 50px;
        margin-right: 10px;
    }
    .priceInput_box{
        margin: 0 20px;
    }
</style>
