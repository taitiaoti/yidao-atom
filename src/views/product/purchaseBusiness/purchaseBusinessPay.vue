<template>
     <div class="paid-page">
        <div class="paid-page">
            <div class="paid-page-content">
                <div class="paid-left">
                    <span class="qrcode-wrapper" v-if="source == 'wxpay'" :style="{backgroundImage:wechatPayPic}"></span>
                    <span class="qrcode-wrapper" v-else :style="{backgroundImage:aliPayPic}"></span>
                    <div class="qrcode">
                        <vue-qr :text="payUrl"></vue-qr>
                    </div>
                </div>
                <div class="paid-right">
                    <span class="wxpay" v-if="source == 'wxpay'" :style="{backgroundImage:wechatPhonePic}"></span>
                    <span class="wxpay"  v-else :style="{backgroundImage:aliPhonePic}"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters,mapMutations } from 'vuex'
    import VueQr from 'vue-qr'  //npm install vue-qr --save
    import { fetchPayStatus } from '@/api/product/purchaseBusiness'
    import { resolveUrlPath } from "@/util/util";


    export default {
        data() {
            return {
                payUrl: '',
                payChannel: '',
                orderNo: '',
                totalPrice: '',
                payCode: '',
                source: '',
                timer: null,
                wechatPayPic: "url("+require('../../../assets/img/dudu/wechat-qrcode-wrapper.jpg')+")",
                wechatPhonePic: "url("+require('../../../assets/img/dudu/wechat-pic.jpg')+")",
                aliPayPic: "url("+require('../../../assets/img/dudu/ali-qrcode-wrapper.jpg')+")",
                aliPhonePic: "url("+require('../../../assets/img/dudu/ali-pic.jpg')+")",
                isJump: false
            }
        },
        computed: {
             ...mapGetters('cartBusiness',{
                cartSelectItems: 'cartSelectItems',
                getOrderInfo: 'getOrderInfo'
            })
        },
        created(){
            // console.log(this.$route, 'this.$route');
            console.log(this.getOrderInfo,'this.getOrderInfo.orderInfo');
            if(this.getOrderInfo){
                this.payUrl = this.getOrderInfo.data;
                this.orderNo = this.getOrderInfo.orderNo;
                this.payCode = this.getOrderInfo.payCode;
                this.source = this.getOrderInfo.source;
                this.getPayStatus();
            }
        },
        methods: {
            getPayStatus(){
                this.timer = setInterval(async () => {
                    const res = await fetchPayStatus(this.orderNo);
                    if(res.data.code == 0){
                        clearInterval(this.timer);
                        this.$store.dispatch('cartBusiness/checkout', this.cartSelectItems); //清空购物车里已购买的商品
                        this.isJump = true;
                        this.$notify({
                            title: '付款成功',
                            message: '完成本次下单',
                            type: 'success',
                            duration: 2000
                        });
                        this.$router.push({
                            path: resolveUrlPath("/product/purchaseBusinessCart"),
                        });
                    }
                }, 4000);
            },
        },
        components: {
            VueQr
        },
        beforeRouteLeave (to, from, next) {
            if(this.isJump){ //支付之后自动跳转
                next()
            }else {
                const answer = window.confirm('你确定要放弃支付？')
                if (answer) {
                    next()
                } else {
                    next(false)
                }
            }
        },
        destroyed() {
            clearInterval(this.timer);
        },
    }
</script>
<style lang="scss">
    .tip-wrapper{
        display: flex;
        align-items: center;
        margin: 100px 0 0 130px;
        .wechat-pay{
            font-size: 44px;
            color: #333;
            margin-right: 40px;
        }
        .number{
            color: #ff3030;
        } 
    }
    .paid-page-content{
        display: flex;
        margin-left: 248px;
        align-items: center;
        margin-top: 100px;
        .paid-left{
            position: relative;
            .qrcode-wrapper{
                display: block;
                max-width: 100%;
                width: 450px;
                height: 428px;
                display: inline-block;
                background-size: 450px 428px;
                background-repeat: no-repeat;
            }
            .qrcode-wehcat-wrapper{
                // @include bg-image-jpg('wechat-qrcode-wrapper');
                // background: url('/m/static/dudu/wechat-qrcode-wrapper.jpg');
            }
            .qrcode-ali-wrapper{
                // @include bg-image-jpg('qrcode-wrapper');
                background-size: 889px 848px;
            }
            .qrcode{
                width: 140px;
                height: 140px;
                position: absolute;
                left: 165px;
                top: 87px;
                background-color: #ccc;
                img{
                    max-width: 100%;
                    display: block;
                }
            }
        }
        .paid-right{
            width: 625px;
            margin-left: 120px;
            .wxpay,.alipay{
                width: 360px;
                height: 440px; 
                display: inline-block; 
                margin-top: 18px;
                // @include bg-image-jpg('wechat-pic');
                background-size: 360px 440px;
                background-repeat: no-repeat;
            }
            .alipay{
                // @include bg-image-jpg('ali-pic');                
            }
        }
    }
</style>

