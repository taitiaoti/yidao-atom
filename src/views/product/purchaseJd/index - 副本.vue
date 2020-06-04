<template>
    <div class="purchase-business" v-loading="listLoading" element-loading-text="给我一点时间">
        <div style="margin-top: 15px;" class="jd-search-wrapper">
            <el-input placeholder="请输入商品名称" clearable v-model="productName" class="search-name">
            </el-input>
            <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
            <!-- <el-cascader
                style="width: 300px;margin-left: 50px;"
                :options="options"
                @change="selectAddress"
                :props = "props"
                change-on-select
                v-model="selectedOptions"
            ></el-cascader> -->
                <!-- @active-item-change="selectAddress" -->
            <span class="cart-icon-wrapper" @click="jumpCart">
                <i class="icon-gouwuche"></i><span class="tip" v-show="products.length > 0">{{products.length}}</span>
            </span>
        </div>
        <el-row>
            <el-col :span="4" v-for="(item, index) in list" :key="index">
                <div  class="grid-content jd-good" @click="jumJdPage(item.jdUrl)"  :class="[goodIndex == index ? 'jd-good-sel' : '']" @mouseenter="enter(index)" @mouseleave="leave(index)">
                    <div class="goog-pic-wrapper">
                        <img :src="item.picture.indexOf('http') != -1 ? item.picture : (baseUrl+item.picture)" class="goog-pic" alt="">
                    </div>
                    <div class="price-wrapper">
                        <span class="price-left">采购价：<span class="price-num">￥{{item.price}}</span></span>
                    </div>
                    <div class="price-wrapper">
                        <span class="price-jd">京东价：<span class="price-jd-num">￥{{item.jdPrice}}</span></span>
                    </div>
                    <span class="good-name">{{item.productName}}</span>
                    <span class="product-num">商品编号：{{item.productNo}}</span>
                    <div class="addCart"  @click.stop="add(item)">
                        <i class="el-icon-plus"></i>
                        <span class="cart-text">规格</span>
                        <span v-show="getAllProductNum(products, item.productId) > 0" class="proudct-cart-num">{{getAllProductNum(products, item.productId)}}</span>
                    </div>
                    <div class="sold-out" v-show="item.isHaveStock == 'n'">
                        <span class="sold-out-tip">无货</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[12,24,36,48]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="product.productName" :visible.sync="dialogFormVisible" width="35%">
            <div class="product-info">
                <div class="info-left">
                    <img v-if="product.picture" :src="product.picture.indexOf('http') != -1 ? product.picture : (baseUrl+product.picture)" alt="">
                </div>
                <div class="info-right" v-if="property.length != 0">
                    <div class="right-property" v-for="(item, index) in property" :key="index">
                        <div class="property-title">{{item.propertyName}}</div>
                        <el-radio-group v-model="values[index]" size="mini">
                            <el-radio @change="selectProperty(item.propertyNameId, item02.propertyValueId)" v-for="(item02, index02) in item.propertyValues" :label="item02.propertyValueId" :key="index02" border>{{item02.propertyValueName}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="right-property">
                        <div class="property-title">购买数量</div>
                        <el-input-number :disabled="!selectInventory" v-model="quantity" :min="0"  @change="handleChange(product)" size="small" style="width: 120px;"></el-input-number>
                        <span v-if="showTip && quantity == 0" style="margin-left: 10px;color: #ff4949;">请添加购买数量</span>
                    </div>
                    <div class="right-property">
                        <div class="property-title">价格</div>
                        <span class="property-value">{{price ? '￥' : ''}}{{price}}</span>
                    </div>
                    <div class="right-property">
                        <div class="property-title">京东价</div>
                        <span class="property-value">{{jdPrice ? '￥' : ''}}{{jdPrice}}</span>
                    </div>
                </div>
                <div style="position: absolute; right: 20px;bottom: 20px;">
                    <el-button type="primary" size="small" @click="closeDialog">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import { resolveUrlPath, formartTime, filterAddressData, bcdiv } from "@/util/util";
    import { getproducts, getProperty } from '@/api/product/purchaseBusiness'

    export default {
        data() {
            return {
                listQuery: {
                    page: 1,
                    limit: 12
                },
                listLoading: false,
                baseUrl:"http://qiniu.edawtech.com/",
                list: [],
                total: null,
                goodIndex: 0,
                productName: '',
                dialogFormVisible: false,
                form: {},
                formLabelWidth: '75px',
                product: {},
                property: [],
                inventory: [],
                values: [],
                selectTempArr: [],
                price: '',
                jdPrice: '',
                selectInventory: '',
                quantity: 0,
                handleType: 'add',
                tempItem: {},
                propertyDesc: '', //所有选中属性名拼接
                showTip: false

            }
        },
        created(){
            this.getList();
        },
        computed:{
            ...mapGetters('cartBusiness',{
                products: 'cartProducts',
            }),
        },
        methods: {
            async getList() {
                this.listLoading = true;
                let postData = {
                    appId: 'dudu',
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    queryType: 'jd',
                    productName: this.productName
                }
                const res = await getproducts(postData);
                this.total = res.data.total;
                this.list = res.data.records;
                this.listLoading = false;
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            enter(index){
                this.goodIndex = index;
            },
            leave(index){
                this.goodIndex = -1;
            },
            jumJdPage(url){
                window.open(url);
            },
            search(){
                this.getList();
            },
            async add(item){
                this.product = item;
                this.selectTempArr = []; //清空上一个商品选中的属性
                this.price = ''; //清空上一个商品的价格
                this.jdPrice =  ''; //清空上一个商品的京东价格
                this.values = []; //清空上一个商品选中的属性
                this.selectInventory = ''; //清空选中并处理好数据的属性
                this.quantity = 0; //数量归零
                this.showTip = false; //初始不提示
                this.dialogFormVisible = true;
                const res = await getProperty(this.product.productNo);
                this.property = res.data.data.property;
                this.inventory = res.data.data.inventory;  
            },
            closeDialog(){
                this.showTip = false;
                if(this.quantity != 0){
                    this.dialogFormVisible = false;
                }else {
                    this.showTip = true;
                }
            },
            selectProperty(propertyNameId, propertyValueId){
                if(this.selectTempArr.length != 0){
                    let isSameNameId = false; //用于判断是否有重复的属性
                    this.selectTempArr.forEach(item => {
                        if(item.nameId == propertyNameId){
                            isSameNameId = true;
                            item.valueId = propertyValueId;
                        }
                    });
                    if(!isSameNameId){
                        this.selectTempArr.push({
                            nameId: propertyNameId,
                            valueId: propertyValueId
                        });
                    }
                }else {
                    this.selectTempArr.push({
                        nameId: propertyNameId,
                        valueId: propertyValueId
                    })
                }
                if(this.selectTempArr.length === this.property.length){
                    this.propertyDesc = ''; //清空拼接的属性名
                    this.getPrice(this.selectTempArr);
                    this.selectTempArr.forEach(item => {
                        this.property.forEach(item02 => {
                            if(item.nameId == item02.propertyNameId){
                                item02.propertyValues.forEach(item03 => {
                                    if(item.valueId == item03.propertyValueId){
                                        this.propertyDesc += item03.propertyValueName + ','  //筛选并拼接出属性名this.propertyDesc
                                    }
                                });
                                let reg = /,$/gi;
                                this.propertyDesc = this.propertyDesc.replace(reg, "");
                                console.log(this.propertyDesc,'this.propertyDesc');
                            }
                        });
                    });
                }
            },
            getPrice(values){
                let temObj = {}
                values.forEach(item => {
                    temObj[item.nameId]= item.valueId
                });
                temObj = JSON.stringify(temObj)
                this.inventory.forEach(item => {
                    if(item.property === temObj) {
                        this.price = item.price;
                        this.jdPrice = item.jdPrice;
                        this.selectInventory = item.property;
                        this.quantity = 0; //数量归零
                    }
                });
            },
            handleChange(item){
                this.tempItem = item;
            },
            jumpCart(){
                this.$router.push({
                    path: resolveUrlPath("/product/purchaseBusinessCart"),
                    query: {type: 'jd'}
                });
            },
            getAllProductNum(items, productId){  //商品列表显示该商品购物车的数量
                let num = 0;
                items.forEach(item => {
                    if(item.productId == productId){
                        num += item.quantity
                    }
                });
                return num;
            }
        },
        watch: {
            quantity(newValue, oldValue){
                if(newValue != 0){
                    oldValue > newValue ? this.handleType = 'decrease' :  this.handleType = 'add';
                    this.tempItem.property = this.selectInventory; //给添加进购物车的商城添加属性
                    this.tempItem.quantity = this.quantity;  //给添加进购物车的商城添加数量
                    this.tempItem.handleType = this.handleType; //操作类型减少 或者 添加
                    this.tempItem.propertyDesc = this.propertyDesc;
                    this.$store.dispatch('cartBusiness/addProductToCart',this.tempItem);
                }
            }
        } 
    }
</script>
<style lang="scss">
    .purchase-business{
        .grid-content {
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .jd-good{
            //   display: flex;
            flex-direction: column;
            padding-bottom: 10px;
            transition: all .3s;
            position: relative;
            .sold-out{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,.5);
                display: flex;
                justify-content: center;
                align-items: center;
                .sold-out-tip{
                    color: #fff;
                    font-size: 50px;
                    font-weight: bold;
                    letter-spacing: 10px;
                }
            }
            &:hover{
                cursor: pointer;
            }
            .goog-pic-wrapper{
                text-align: center;
                .goog-pic{
                    width: auto;
                    max-height: 200px;
                    margin: 20px 5% 10px 5%;
                    background: #ccc;
                }
            }
            .price-wrapper,.good-name,.product-num,{
                width: 90%;
                margin-left: 5%;
                overflow:hidden;
                    text-overflow: ellipsis;
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
            }
            .price-wrapper{
                display: flex;
                .price-left{
                    color: #333333;
                    font-size: 14px;
                    .price-num{
                        color: #ec8121;
                        font-weight: bold;
                        font-size: 18px;
                    }
                }
                .price-right{
                        color: #ec8121;
                        font-weight: bold;
                }
                .price-jd{
                    font-size: 14px;
                    color: #666;
                    font-weight: bold;
                    .price-jd-num{
                        color: #ff2929;
                    }
                }
            }
            .good-name{
                width: 90%;
                height: 44px;
                font-size: 14px;
                color: #666;
                line-height: 24px;
                margin: 3px 0 3px 5%;
            }
            .product-num,.addCart{
                font-size:14px;
                color: #666;
            }
            .addCart{
                position: relative;
                color: #fff;
                padding: 0px 0px;
                background-color: #409EFF;
                display:flex;
                justify-content: center;
                align-items: center;
                width: 80px;
                margin-left: 5%;
                margin-top: 10px;
                margin-bottom: 7px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color .3s;
                .icon-gouwuche1{
                    &:before{
                        color: #fff;
                    }
                }
                .cart-text{
                    margin-left: 5px;
                }
                &:hover{
                    background-color:#66b1ff;
                    transition: background-color .3s;
                }
                .proudct-cart-num{
                    width: 26px;
                    height: 16px;
                    background-color: red;
                    color: #fff;
                    text-align: center;
                    line-height: 16px;
                    font-weight: bold;
                    font-size: 12px;
                    border-radius: 20px;
                    border: 2px solid #fff;
                    position: absolute;
                    top: -10px;
                    right: -15px;
                }
            }
        }
        .jd-good-sel{
            box-shadow: 0 0 10px rgba(0,0,0,.3);
            transition: all .3s;
        }
        .jd-search-wrapper{
            display: flex;
            align-items: center;
            margin: 10px 0 10px 0;
            .search-name{
                width: 300px;
                margin-left: 15px;
                margin-right: 8px;
            } 
            .cart-icon-wrapper{
                margin-left: 100px;
                margin-right: 20px;
                display: inline-block;
                position: relative;
                .icon-gouwuche:before{
                    font-size: 40px;
                    color: #666;
                }
                .tip{
                    position: absolute;
                    right: -13px;
                    top: 18px;
                    width: 26px;
                    height: 16px;
                    line-height: 16px;
                    border-radius: 20px;
                    border: 2px solid #fff;
                    color: #fff;
                    background-color: #ff2222;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                }
            }
            .icon-qingkong:before{
                font-size: 14px;
                margin-right: 5px;
            }
        }
        .jd-cart-tip{
            width: auto;
            height: 60px;
            position: fixed;
            left: 245px;
            right: 22px;
            bottom: 30px;
            background-color: rgba(255,255,255,.8);
            box-shadow: 0 0 4px rgba(0,0,0,.2);
            display: flex;
            justify-content: center;
            align-items: center;
            .tip-wrapper{
                display: flex;
                align-items: center;
                margin-right: 20px;
                .tip-left{
                    margin-right: 10px;
                    &:before{
                        font-size: 30px;
                        font-weight: bold;
                        color: #67c23a;
                    }
                }
                .tip-text{
                    display: flex;
                    flex-direction: column;
                    .text-top, .text-bottom{
                        line-height: 20px;
                    }
                    .text-top{
                        font-size: 16px;
                        color: #67c23a;
                    }
                    .text-bottom{
                        font-size: 14px;
                        color: #666;
                        .num, .price{
                            color: #ec8121;
                            font-weight: bold;
                        }
                    }            
                }
            }
        }
        .product-info{
            display: flex;
            .info-left{
                img{
                    width: 150px;
                }
            }
            .info-right{
                margin-left: 5px;
                .right-property{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    margin-top: 5px;
                    .property-title{
                        width: 80px;
                        text-align: right;
                        margin-right: 15px;
                        color: #333;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .property-value{
                        font-size: 16px;
                        font-weight:bold;
                    }
                    .el-radio.is-bordered+.el-radio.is-bordered, .el-radio--mini.is-bordered{
                        margin: 5px 10px 5px 0;
                    }
                }
            }
        }
    }
</style>