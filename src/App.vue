<template>
	<div id="app">
			<router-view></router-view>
	</div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import { sanction } from '@/api/log';

export default {
  name: "app",
  data() {
    return {
      state: null
    };
  },
  watch: {},
  created() {
     var username = this.$store.state.user.userInfo.username;
      // console.log(this.$store.state)
     console.log(this.$store.state.user.userInfo,'username');
     //在页面加载时读取localStorage里的状态信息
     if(JSON.parse(localStorage.getItem(username))){
        this.setItems(JSON.parse(localStorage.getItem(username)));
     }
     //京东采购购物车
     if(JSON.parse(localStorage.getItem('cart'))){
       this.setCartItems(JSON.parse(localStorage.getItem('cart')));
     }
     if(JSON.parse(localStorage.getItem('selsectCart'))){ 
       this.setCartSelectItems(JSON.parse(localStorage.getItem('selsectCart')));
     }
     //商企采购购物车
     if(JSON.parse(localStorage.getItem('cartBusiness'))){
       this.setBusinessCartItems(JSON.parse(localStorage.getItem('cartBusiness')));
     }
     if(JSON.parse(localStorage.getItem('selectCartBusiness'))){ 
       this.setBusinessCartSelectItems(JSON.parse(localStorage.getItem('selectCartBusiness')));
     } 
      //京东采购购物车
     if(JSON.parse(localStorage.getItem('cartJd'))){
       this.setCartJdItems(JSON.parse(localStorage.getItem('cartJd')));
     }
     if(JSON.parse(localStorage.getItem('selectCartJd'))){ 
       this.setCartJdSelectItems(JSON.parse(localStorage.getItem('selectCartJd')));
     } 
     //保存单个订单信息
      if(JSON.parse(localStorage.getItem('singleOrderInfo'))){ 
        this.setSingleOrderInfo(JSON.parse(localStorage.getItem('singleOrderInfo')));
      } 

     if(JSON.parse(localStorage.getItem('getJdProductParams'))){ 
       this.setParams(JSON.parse(localStorage.getItem('getJdProductParams')));
     }
     if(JSON.parse(localStorage.getItem(username+'App'))){ 
       this.setAppIdList(JSON.parse(localStorage.getItem(username+'App')));
     }
     //在页面刷新时将vuex里的信息保存到localStorage里
     window.addEventListener("beforeunload", () => {
        localStorage.setItem(this.$store.state.user.userInfo.username, JSON.stringify(this.$store.getters.items));
        // 京东采购购物车
        localStorage.setItem('cart', JSON.stringify(this.$store.getters['cart/cartProducts']));
        localStorage.setItem('selsectCart', JSON.stringify(this.$store.getters['cart/cartSelectItems']));
        //商企采购购物车
        localStorage.setItem('cartBusiness', JSON.stringify(this.$store.getters['cartBusiness/cartProducts']));
        localStorage.setItem('selectCartBusiness', JSON.stringify(this.$store.getters['cartBusiness/cartSelectItems']));
        //京东采购购物车
        localStorage.setItem('cartJd', JSON.stringify(this.$store.getters['cartJd/cartProducts']));
        localStorage.setItem('selectCartJd', JSON.stringify(this.$store.getters['cartJd/cartSelectItems']));
        //保存单个订单信息
        localStorage.setItem('singleOrderInfo', JSON.stringify(this.$store.getters['cartBusiness/getOrderInfo']));

        localStorage.setItem('getJdProductParams', JSON.stringify(this.$store.state.purchaseGood.getProductParams));
        localStorage.setItem(this.$store.state.user.userInfo.username+'App', JSON.stringify(this.$store.getters['appId/appList']));

     })
     sanction().then((res)=>{
       this.setSanction(res.data.state)
     })
  },
  methods: {
    ...mapMutations({
      setItems: 'setLocalStorageItems',
      setCartItems: 'cart/getLocalStoreCartItem',
      setCartSelectItems: 'cart/getLocalStoreCartSelectItem',
      setBusinessCartItems: 'cartBusiness/getLocalStoreCartItem',
      setBusinessCartSelectItems: 'cartBusiness/getLocalStoreCartSelectItem',
      setSingleOrderInfo: 'cartBusiness/getLocalStoreSingleOrderInfo',
      setCartJdItems: 'cartJd/getLocalStoreCartItem',
      setCartJdSelectItems: 'cartJd/getLocalStoreCartSelectItem',
      setParams: 'purchaseGood/setParams',
      setAppIdList: 'appId/setAppIdList',
      setSanction: 'purchaseGood/setSanction'
    }),
  },
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.ql-video{
  width: 100%;
  height: 500px;
  z-index: 999;
}
.billdialog .el-dialog__header{
  text-align: center;
}

.s-category {
  width: 200px;
  margin-right:10px;
  margin-bottom: 10px;
  display: inline-block;
}
.s-time{
  width: 400px;
  margin-right:10px;
  display: inline-block;
}
</style>