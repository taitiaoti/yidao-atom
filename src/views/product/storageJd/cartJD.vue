<template>
    <div>
        <div v-show="items.length == 0" class="cartJd-tip">
            <span class="tip-text">暂无商品 :( </span>
            <el-button type="primary" @click="returnPrev" class="tip-btn">返回</el-button>
        </div>
        <div class="cart-jd-list" v-show="items.length != 0" ref="listObj">
            <div class="item-wrpper">
                <div class="item" v-for="(item, index) in items" :key="index">
                    <div class="left-wrapper">
                        <img class="good-pic" :src="item.picture" alt="">
                        <div class="left">
                            <span class="product-name">{{item.productName}}</span>
                            <div class="num-price">
                                <span class="num">商品编号：{{item.sku}}</span>
                                <span class="price">￥{{item.salePrice | filterPrice}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <el-button @click="delGoods(item)" type="danger">删除</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-wrapper">
            <div></div>
            <div class="export-wrapper">
                <span class="text">已选择<span class="good-num"> {{items.length}} </span>种商品</span>
                <el-button @click="exportExcel" type="primary">导出</el-button>
                <el-button @click="clearItems" icon="icon-qingkong">清空导出列表</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import { exportList } from "@/api/product/goodsJd";
    import { resolveUrlPath } from "@/util/util";
    import BScroll from 'better-scroll'

    export default {
        data(){
            return {

            }
        },
        computed: {
            ...mapGetters(['items'])
        },
        filters: {
            filterPrice(price){
                return price/10000
            }
        },
        created() {
            window.onresize = () => {
                return (() => {
                    let ch = document.documentElement.clientHeight-250;
                    this.$refs.listObj.style.height = ch+'px';
                })()
            }
            this.$nextTick(() => {
                let ch = document.documentElement.clientHeight-250;
                this.$refs.listObj.style.height = ch+'px';
                this._initScroll();
            });
        },
        methods: {
            ...mapMutations({
                delItem: 'delItem',
                setItems: 'setLocalStorageItems'
            }),
            delGoods(item){
                this.$alert('请看清楚需要删除的项，避免误删。', '商品数据', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if(action == 'confirm'){
                           this.delItem(item);
                        }
                    }
                });
            },
            async exportExcel(){
                let tempArr = [];
                this.items.forEach((item, index) => {
                    tempArr.push(item.sku);
                });
                this.$notify({
                    title: '导出中',
                    message: '导出中，请稍等。。。',
                    type: 'success',
                    duration: 2000
                });
                let postData = {
                    skus: tempArr.join(",")
                }
                console.log(postData,'导出参数');
                const res = await exportList(postData)
                console.log(res,'导出');
                if(res.status == 200){
                    window.location.href = res.request.responseURL;
                }
            },
            returnPrev(){
                this.$router.push({
                    path: resolveUrlPath("/product/storageJd"),
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
             _initScroll(){
                this.listScroll = new BScroll(this.$refs.listObj, {
                    mouseWheel: true,
                    scrollbar: {
                        fade: false,
                        interactive: true
                    },
                    click: true,
                    probeType: 3,
                });
            },
        }
    }
</script>
<style lang="scss">
    .cart-jd-list{
        height: 600px;
        padding: 10px 20px;
        overflow: hidden;
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
    }
    .submit-wrapper{
        padding: 10px 20px;
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
