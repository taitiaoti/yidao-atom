<template>
    <div v-loading="listLoading" element-loading-text="给我一点时间">
        <div style="margin-top: 15px;" class="jd-search-wrapper">
            <el-input placeholder="请输入商品名称" clearable v-model="searchObj.productName" class="search-name">
            </el-input>
            <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
            <el-cascader
                style="width: 300px;margin-left: 50px;"
                :options="options"
                @change="selectAddress"
                :props = "props"
                change-on-select
                v-model="selectedOptions"
            ></el-cascader>
                <!-- @active-item-change="selectAddress" -->
            <span class="cart-icon-wrapper" @click="jumpCart">
                <i class="el-icon-goods icon-gouwuche"></i><span class="tip" v-show="products.length > 0">{{products.length}}</span>
            </span>
        </div>
        <el-row>
            <el-col :span="4" v-for="(item, index) in list" :key="index">
                <div  class="grid-content jd-good" @click="jumJdPage(item.jdUrl)"  :class="[goodIndex == index ? 'jd-good-sel' : '']" @mouseenter="enter(index)" @mouseleave="leave(index)">
                    <img :src="item.picture" class="goog-pic" alt="">
                    <div class="price-wrapper">
                        <span class="price-left">采购价：<span class="price-num">￥{{item.salePrice | filterPrice}}</span></span>
                        <span class="price-right">{{item.price}}</span>
                    </div>
                    <span class="good-name">{{item.productName}}</span>
                    <span class="product-num">商品编号：{{item.sku}}</span>
                    <div class="addCart"  @click.stop="add(item)"><i class="icon-gouwuche1"></i><span class="cart-text">加入购物车</span></div>
                    <!-- <div class="addCart" @click.stop style="height: 36px;background-color: #67c23a;" v-if="item.isStorage != 'n'"><i class="el-icon-check"></i><span class="cart-text">已入库</span></div> -->
                    <div class="sold-out" v-show="item.isHaveStock == 'n'">
                        <span class="sold-out-tip">无货</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="productParams.page"
                           :page-sizes="[12,24,36,48]" :page-size="productParams.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div class="jd-cart-tip" v-show="tip">
            <div class="tip-wrapper">
                <i class="tip-left el-icon-check"></i>
                <div class="tip-text">
                    <span class="text-top">商品已成功加入购物车</span>
                    <span class="text-bottom">
                        购物车共有 <span class="num">{{items.length}}</span> 种商品。
                    </span>
                    <!-- <span class="text-bottom">
                        购物车共有 <span class="num">{{items.length}}</span> 种商品，已选商品总价：<span class="price">￥40000</span>
                    </span> -->
                </div>
            </div>
            <el-button type="primary" @click="jumpCart">去购物车结算<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button @click="hiddenTip">继续购物</el-button>
        </div>
    </div>
</template>
<script>
    import { resolveUrlPath, formartTime, filterAddressData, bcdiv } from "@/util/util";
    import { getAllProvince, getCityByProvinceId, getAreaByCityId, getTownByAreaId, getAddressList,
        fetchDefaultAddress } from "@/api/product/purchase";

    import { throttle  } from 'lodash';
    import {mapState, mapGetters, mapMutations} from 'vuex';
    export default {
        data(){
            return {
                listLoading: false,
                searchObj:{
                    productName: ''
                },
                // list: [],
                goodIndex: 0,
                tip: false,
                listQuery: {
                    page: 1,
                    limit: 12
                },
                options:[],
                selectedOptions: [],
                addressList: [],
                provinces: [],
                citys: [],
                areas: [],
                townList: [],
                props: {
                   children: 'cities',
                },
                selectCodeList: [],
                tempIndexList: []
                // total: null
            }
        },
        computed: {
            ...mapGetters(['goodsJdSearch','items']),
            // ...mapGetters('purchaseGood',{
            //     list: state => state.products.all
            // })
            ...mapGetters('cart',{
                products: 'cartProducts',
            }),
            ...mapState({
                list: state => state.purchaseGood.all,
                total: state => state.purchaseGood.total,
                productParams: state => state.purchaseGood.getProductParams,
            }),
        },
        created(){
            this.listQuery.page = this.goodsJdSearch.page;
            this.listQuery.limit = this.goodsJdSearch.limit;
            // this.searchObj.productName = this.productParams.productName;
            this.getList();
            // this.getProvince();
            this.initAddress();
        },
        filters: {
            filterPrice(price){
                return bcdiv(price,10000,2)
            }
        },
        methods: {
            ...mapMutations({
                pushItem: 'pushItem',
                delItem: 'delItem',
                setItems: 'setLocalStorageItems'
            }),
            async initAddress(){
                const address = await fetchDefaultAddress();
                console.log(address.data.data,'获取默认地址');
                if(address.data.data){
                    this.selectedOptions.push(Number(address.data.data.provinceCode));
                    this.selectedOptions.push(Number(address.data.data.cityCode));
                    this.selectedOptions.push(Number(address.data.data.countyCode));
                    this.selectedOptions.push(Number(address.data.data.townCode));
                }else {
                    this.selectedOptions = [19,1607,3155];
                }
                let province = getAllProvince();
                let city = getCityByProvinceId({provinceId: this.selectedOptions[0]});
                let area = getAreaByCityId({cityId: this.selectedOptions[1]});
                let town = getTownByAreaId({countyId: this.selectedOptions[2]});
                const res = await Promise.all([province,city,area,town]);
                this.options = filterAddressData(res[0].data.result);
                this.provinces = filterAddressData(res[0].data.result);
                this.citys = filterAddressData(res[1].data.result);
                this.areas = filterAddressData(res[2].data.result);
                this.townList = filterAddressData(res[3].data.result);
                this.filterInitAddress(res, this.options,0);

            },
            filterInitAddress(res, list, num){
                list.forEach((item, index) => {
                    if(item.value == this.selectedOptions[num]){
                        num++ 
                        if(num < this.selectedOptions.length){
                            item.cities = filterAddressData(res[num].data.result);
                            this.filterInitAddress(res, item.cities, num);
                        }
                    }
                });
            },
            async getList(){
                console.log('获取');
                this.listLoading = true;
                await this.$store.dispatch('purchaseGood/getAllProducts')
                this.listLoading = false;
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.$store.dispatch('purchaseGood/handleSizeChange', {val})
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.$store.dispatch('purchaseGood/handleCurrentChange', {val})
                this.getList();
            },
            add(item) {
                this.$store.dispatch('cart/addProductToCart',item);
                this.$notify({
                    title: '成功',
                    message: '添加进购物车',
                    type: 'success',
                    duration: 1000
                });
            },
            enter(index){
                this.goodIndex = index;
            },
            leave(index){
                this.goodIndex = -1;
            },
            hiddenTip(){
                this.tip = false;
            },
            delayHidden(time){
                this.tip = true;        
                setTimeout(() => {
                    this.tip = false;
                }, time);        
            },
            jumpCart(){
                this.$router.push({
                    path: resolveUrlPath("/product/shoppingCart"),
                });
            },
            jumJdPage(url){
                window.open(url);
            },
            async getProvince(){
                const res = await getAllProvince();
                this.options = filterAddressData(res.data.result);
                this.provinces = filterAddressData(res.data.result);
            },
            async selectAddress(value){
                console.log(value,'选中');
                if(value[0] && !value[1]){
                    let postData = {
                        provinceId: value[0]
                    }
                    const res = await getCityByProvinceId(postData);
                    this.citys = filterAddressData(res.data.result);
                    this.options.forEach((item, index) => {
                        if(item.value == value[0] && !item.cities.length){
                            item.cities = this.citys
                        }
                    });
                }else if(value[1] && !value[2]){
                    let postData = {
                        cityId: value[1]
                    }
                    const res = await getAreaByCityId(postData);
                    this.areas = filterAddressData(res.data.result);
                    this.options.forEach((item, index) => {
                        if(item.value == value[0]){
                            this.citys.forEach((item02, index02) => {
                                if(item02.value == value[1]){
                                    item02.cities = this.areas;
                                }
                            })
                            item.cities = this.citys;
                        }
                    });
                }else if(value[2] && !value[3]){
                     let postData = {
                        countyId: value[2]
                    }
                    const res = await getTownByAreaId(postData);
                    this.townList = filterAddressData(res.data.result, true);
                    if(JSON.stringify(res.data.result) == "{}"){
                        this.getAddressCode(value)
                    }
                    this.options.forEach((item, index) => {
                        if(item.value == value[0]){
                            this.citys.forEach((item02, index02) => {
                                this.areas.forEach((item03, index03) => {
                                    if(item03.value == value[2]){
                                        item03.cities = this.townList;
                                    }
                                });
                            })
                            item.cities = this.citys;
                        }
                    });
                }else if(value[3]){
                    this.getAddressCode(value)
                }
            },
            //获取商品数据
            getAddressCode(value){
                console.log(value,'00');
                let postData = {
                    provinceCode: value[0],
                    cityCode: value[1],
                    countyCode: value[2],
                    townCode: !!value[3] ? value[3] : 0,
                    productName: this.searchObj.productName
                }
                this.$store.dispatch('purchaseGood/getAllProducts',postData)
            },
            search(){   //搜索
                const params = this.$store.state.purchaseGood.getProductParams;
                let postData = {
                    provinceCode: params.provinceCode,
                    cityCode: params.cityCode,
                    countyCode: params.countyCode,
                    townCode: params.townCode,
                    productName: this.searchObj.productName,
                }
                this.$store.dispatch('purchaseGood/getAllProducts',postData)
            },
        },
    }
</script>
<style lang="scss">
//   .el-row {
//     margin-bottom: 20px;
//     &:last-child {
//       margin-bottom: 0;
//     }
//   }
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
      margin-bottom: 20px;
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
      .goog-pic{
          width: 90%;
          height: auto;
          margin: 20px 5% 10px 5%;
          background: #ccc;
      }
      .price-wrapper,.good-name,.product-num{
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
        color: #fff;
        padding: 0px 0px;
        background-color: #409EFF;
        display:flex;
        justify-content: center;
        align-items: center;
        width: 120px;
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
             right: -8px;
             top: 14px;
             width: 20px;
             height: 20px;
             line-height: 23px;
             border-radius: 50%;
             border: 3px solid #fff;
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
</style>

