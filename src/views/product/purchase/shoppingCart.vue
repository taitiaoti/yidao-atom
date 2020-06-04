<template>
    <div>
        <div v-show="products.length == 0" class="cartJd-tip">
            <span class="tip-text">暂无商品 :( </span>
            <el-button type="primary" @click="returnPrev" class="tip-btn">去购买</el-button>
        </div>
            <el-table
                v-show="products.length != 0"
                ref="multipleTable"
                :data="products"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column width="120">
                    <template scope="scope">
                        <img :src="scope.row.picture" width="100" height="100" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品" >
                    <template scope="scope">
                        <div>{{scope.row.productName}}</div>
                        <div style="margin-top:10px;">商品编号：{{scope.row.sku}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="单价(元)" align="center" width="100">
                    <template scope="scope">
                        <span>{{scope.row.salePrice | filterPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="170" align="center">
                   <template scope="scope">
                    <el-input-number v-model="scope.row.quantity" @change="handleChange(scope.row)" :min="1"></el-input-number>
                   </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="danger" @click="delGoods(scope.row)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <div class="cart-jd-list" v-show="products.length != 0" >
            <div class="submit-wrapper">
                <div></div>
                <div class="export-wrapper">
                    <span class="text-bottom">
                        已选择几种 <span class="num">{{cartSelectItems.length}}</span> 商品，总价：<span class="price">￥{{total | filterPrice}}</span>
                    </span>
                    <el-button @click="toAcount" type="primary" :disabled="cartSelectItems.length == 0">去结算</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import { resolveUrlPath } from "@/util/util";

    export default {
        data(){
            return {
            }
        },
        filters: {
            filterPrice(price){
                return price/10000
            }
        },
        computed: {
            ...mapGetters(['items']),
            ...mapGetters('cart',{
                products: 'cartProducts',
                total: 'cartTotalPrice',
                cartSelectItems: 'cartSelectItems'
            })
        },
        created(){
            if(this.cartSelectItems.length) {
                this.cartSelectItems.forEach(item => {
                    this.products.forEach(item02 => {
                        if(item.id == item02.id){
                            this.$nextTick(() => {
                                this.$refs.multipleTable.toggleRowSelection(item02, true);
                            });
                        }
                    })
                });
            }
        },
        methods: {
            ...mapMutations({
                delItem: 'delItem',
                setItems: 'setLocalStorageItems'
            }),
            handleChange(item){
                this.$store.dispatch('cart/addProductToCart',item);
                if(this.cartSelectItems.length){
                    let tempArr = [];
                    this.cartSelectItems.forEach(item => {
                        //利用id过滤出购物车未选中的数据
                        this.products.forEach(item02 => {
                            if(item.id == item02.id){
                                tempArr.push(item02)
                                this.$nextTick(() => {
                                    this.$refs.multipleTable.toggleRowSelection(item02, true);
                                });
                            }
                        })
                    })
                    //选中商品数量响应式变化
                    this.$store.dispatch('cart/getSelectItem', tempArr);
                }else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            delGoods(item){
                this.$store.dispatch('cart/delectProductCart', item)
            },
            handleSelectionChange(selection){
                this.$store.dispatch('cart/getSelectItem', selection);
            },
            toAcount(){
                this.$router.push({
                    path: resolveUrlPath("/product/settlement"),
                });
            },
            returnPrev(){
                this.$router.push({
                    path: resolveUrlPath("/product/purchase"),
                });
            }
        }
    }
</script>
<style lang="scss">
    .cart-jd-list{
        padding: 10px 20px;
        .item{
            background-color: #f3f0f0;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 2px;
            margin-bottom: 10px;
            .good-pic{
                width: 80px;
                height: 80px;
                margin-right: 10px;
            }
            .left-wrapper{
                display: flex;
                align-items: center;
            }
            .left{
                display: flex;
                flex-direction: column;
                .product-name{
                    color: #666;
                }
                .num-price{
                    display: flex;
                    align-items: center;
                    color: #666;
                    .price{
                        color: #ec8121;
                        font-weight: bold;
                        margin-left: 50px;
                    }
                }
            }
        }
        .submit-wrapper{
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            .export-wrapper{
                .text{
                    color: #666;
                    margin-right: 20px;
                    .good-num{
                        color: #ec8121;
                    }
                }
                .text-bottom{
                    color: #666;
                    .num, .price{
                        color: #ec8121;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .cartJd-tip{
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        .tip-text{
            margin-top: 20px;
        }
        .tip-btn{
            width: 200px;
            margin-top: 10px;
        }
    }
</style>
