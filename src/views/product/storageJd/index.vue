<template>
    <div v-loading="listLoading" element-loading-text="给我一点时间">
        <div style="margin-top: 15px;" class="jd-search-wrapper">
            <el-input placeholder="请输入商品名称" v-model="searchObj.productName" class="search-name" clearable></el-input>
            <div >
                <span style="color: #666;font-size: 14px;">最小折扣:</span>
                <el-input-number @change="changMinDiscount" style="width:110px;" size="small"  v-model="searchObj.minDiscount" :precision="1"  :step="0.1" :min="0" :max="10"></el-input-number>
            </div>
            <div style="margin: 0 10px;">
                <span style="color: #666;font-size: 14px;">最大折扣:</span>
                <el-input-number @change="changMaxDiscount" style="width:110px;" size="small"  v-model="searchObj.maxDiscount" :precision="1" :step="0.1" :min="0" :max="10"></el-input-number>
            </div>
            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
            <el-button  type="primary" @click="adds" >批量入库</el-button>
            <el-button  type="primary" @click="updateJDGood" v-show="userInfo.username == 'sysAdmin'" >更新京东商品</el-button>
            <span class="cart-icon-wrapper" @click="jumpCart"><i class="icon-gouwuche"></i><span class="tip">{{items.length}}</span></span>
            <el-button @click="clearItems" icon="icon-qingkong">清空导出列表</el-button>
            <el-cascader
                style="width: 300px;margin-left: 50px;"
                :options="options"
                @change="selectAddress"
                :props = "props"
                change-on-select
                v-model="selectedOptions"
            ></el-cascader>
        </div>
        <el-row>
            <el-col :span="4" v-for="(item, index) in list" :key="index">
                <div  class="grid-content jd-good" @click="jumJdPage(item.jdUrl)"  :class="[goodIndex == index ? 'jd-good-sel' : '']" @mouseenter="enter(index)" @mouseleave="leave(index)">
                    
                    <!-- <div class="jd-img-box"> -->
                        <img :src="item.picture" class="goog-pic" alt="">
                    <!-- </div> -->
                    <div class="price-wrapper-store">
                        <div class="price-left-store">采购价：<span class="price-num">￥{{item.salePrice | filterPrice}}</span></div>
                        <div class="price-left-store price-left-jd">京东价：<span class="price-num">￥{{item.jdPrice | filterPrice}}</span></div>
                        <!-- <span class="price-right">{{item.price}}</span> -->
                    </div>
                    <span class="good-name">{{item.productName}}</span>
                    <span class="product-num">商品编号：{{item.sku}}</span>
                    <div class="addCart" style="height: 36px;" v-if="item.isStorage != 'y' " @click.stop="add(item, index)"><i class="icon-gouwuche1"></i><span class="cart-text">加入商品库</span></div>
                    <div class="addCart" @click.stop style="height: 36px;background-color: #67c23a;" v-if="item.isStorage != 'n'"><i class="el-icon-check"></i><span class="cart-text">已入库</span></div>
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
        <!-- <div class="jd-cart-tip" v-show="tip">
            <div class="tip-wrapper">
                <i class="tip-left el-icon-check"></i>
                <div class="tip-text">
                    <span class="text-top">商品已成功加入购物车</span>
                    <span class="text-bottom">
                        购物车共有 <span class="num">{{items.length}}</span> 种商品。
                    </span>
                </div>
            </div>
            <el-button type="primary" @click="jumpCart">去购物车结算<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button @click="hiddenTip">继续购物</el-button>
        </div> -->
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
    import { resolveUrlPath, formartTime,bcdiv,filterAddressData } from "@/util/util";
    import { fetchList, addWarehouse,addWarehouses,updateJDGoods } from "@/api/product/goodsJd";
    import { getAllProvince, getCityByProvinceId, getAreaByCityId, getTownByAreaId, getAddressList,
        fetchDefaultAddress } from "@/api/product/purchase";
    import { throttle  } from 'lodash';
    import { mapGetters, mapMutations,mapState} from 'vuex';
    export default {
        data(){
            return {
                listLoading: false,
                searchObj:{
                    productName: '',
                    minDiscount: 0,
                    maxDiscount: 10
                },
                list: [],
                //批量入库id的数组
                idlist:[],
                goodIndex: 0,
                tip: false,
                listQuery: {
                    page: 1,
                    limit: 12
                },
                total: null,

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
                tempIndexList: [],
                dialogVisible: false,
                JDProductName: ''
            }
        },
        created(){
            this.listQuery.page = this.goodsJdSearch.page;
            this.listQuery.limit = this.goodsJdSearch.limit;
            this.searchObj.productName = this.goodsJdSearch.productName;
            this.searchObj.minDiscount = this.goodsJdSearch.minDiscount;
            this.searchObj.maxDiscount = this.goodsJdSearch.maxDiscount;
            this.initAddress();
        },
        computed: {
            ...mapState({
                userInfo: state => state.user.userInfo
            }),
            ...mapGetters(['goodsJdSearch','items']),
        },
        filters: {
            filterPrice(price){
                return bcdiv(price,10000,2)
            }
        },
        methods: {
            ...mapMutations({
                setPage: 'set_goodJdPage',
                setLimit: 'set_goodJdLimit',
                pushItem: 'pushItem',
                delItem: 'delItem',
                setItems: 'setLocalStorageItems',
                setProductName: 'set_goodJdProductName',
                setMinDiscount: 'set_goodJdMinDiscount',
                setMaxDiscount: 'set_goodJdMaxDiscount',
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
            async getList(){
                this.listLoading = true;
                let postData = {
                    ...this.listQuery,
                    productName: this.searchObj.productName,
                    minDiscount: bcdiv(this.searchObj.minDiscount,10,2),
                    maxDiscount: bcdiv(this.searchObj.maxDiscount,10,2),
                    // provinceCode=19&cityCode=1607&countyCode=3155&townCode=0
                    provinceCode:this.selectedOptions[0],
                    cityCode:this.selectedOptions[2],
                    countyCode:this.selectedOptions[3],
                    townCode:this.selectedOptions[4]?this.selectedOptions[4]:0,
                }
                console.log(postData)
                var res = await fetchList(postData);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = res.data.total;
                console.log(res,122)
            },
            async initAddress(){
                const address = await fetchDefaultAddress();
                console.log(address.data.data,'获取默认地址');
                if(address.data.data){
                    this.selectedOptions.push(Number(address.data.data.provinceCode));
                    this.selectedOptions.push(Number(address.data.data.cityCode));
                    this.selectedOptions.push(Number(address.data.data.countyCode));
                    this.selectedOptions.push(Number(address.data.data.townCode));
                }else {
                    this.selectedOptions = [19,1607,3155,0];
                }
                this.getList();
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
                let provinceCode = value[0];
                let cityCode = value[1];
                let countyCode = value[2];
                let townCode = value[3] ? value[3] : 0;
                this.selectedOptions = [provinceCode,cityCode,countyCode,townCode];
                this.getList();
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
            add: throttle(async function(item, index){
                this.pushItem(item);
                var res = await addWarehouse(item.id);
                this.delayHidden(6000);
                // this.getList();
                if(res.data.data){
                    this.list.forEach((item02, index02) => {
                        if(index == index02){
                            item.isStorage = 'y';
                        }
                    });
                }
                this.$notify({
                    title: res.data.data ? 'OK' : 'Error',
                    message: res.data.msg,
                    type: res.data.data ? 'success' : 'error',
                    duration: 1500
                });
            },1000),
            //批量入库的方法
            async adds(){
                // console.log(this.list);
                this.list.forEach(item => {
                    this.idlist.push(item.id)

                })
                let addslist = this.idlist.join(',')
                // console.log(addslist)
                var res = await addWarehouses(addslist);
                // console.log(res)
                this.getList()
                
            },
            search(){
                this.setProductName(this.searchObj['productName']);
                this.getList();
            },
            changMinDiscount(value){
                this.setMinDiscount(value);
            },
            changMaxDiscount(value){
                this.setMaxDiscount(value);
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
                    //path: resolveUrlPath("/product/goods_edit")
                    path: resolveUrlPath("/product/cartJD"),
                    // query: {
                    // id: row.id, 
                    // categoryId: row.categoryId 
                    // }
                });
            },
            clearItems(){
                this.$alert('请看清楚需要删除的项，避免误删。', '商品数据', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if(action == 'confirm'){
                            this.$notify({
                                title: '已全部清空',
                                type: 'success',
                                duration: 1500
                            });
                            if(this.items.length != 0){
                                this.setItems([]);
                                localStorage.removeItem('items');
                            }
                        }
                    }
                });
            },
            jumJdPage(url){
                window.open(url);
            }
        }
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
    //   .jd-img-box{
    //       width: 100%;
    //       min-height: 286px;
          .goog-pic{
          width: 90%;
          height: auto;
          min-height: 245px;
          margin: 20px 5% 10px 5%;
          background: #ccc;
      }
    //   }
      
      .price-wrapper-store,.good-name,.product-num{
          width: 90%;
          margin-left: 5%;
          overflow:hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
      }
      .price-wrapper-store{
        //   display: flex;
          .price-left-store{
              display: block;
              color: #333333;
              font-size: 14px;
              line-height: 30px;
              .price-num{
                color: #ec8121;
                font-weight: bold;
                font-size: 18px;
              }
          }
          .price-left-jd{
              color: #666;
              .price-num{
                color: #f22;
                font-size: 16px;
              } 
          }
          .price-right{
                color: #ec8121;
                font-weight: bold;
          }
      }
      .good-name{
          display: inline-block;
          width: 90%;
          height: 44px;
          vertical-align: top;
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

