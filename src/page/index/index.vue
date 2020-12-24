<template>
  <div class="pull-height animated" :class="{'zoomOutUp': isLock}">
    <div class="index">
      <sidebar class="left"></sidebar>
      <div class="right">
        <div class="nav">
          <top class="top"></top>
          <tags></tags>
        </div>
        <div class="main">
          <div class="router">

            <!-- <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view> -->

            <keep-alive>
              <router-view v-if="$route.meta.keepAlive || $route.path=='/product/property' || $route.path=='/product/purchase' || $route.path=='/product/storageJd' || $route.path=='/product/notice' || $route.path=='/order/orderList' || $route.path=='/columnData/column_home' || $route.path=='/columnData/column_localShop' || $route.path=='/columnData/column_business_enterprise' || $route.path=='/order/rate' || $route.path=='/product/banner' || $route.path=='/product/productColumn' || $route.path=='/product/discount' || $route.path=='/initPage/initPage_editor' || $route.path=='/freight/index' || $route.path=='/dongdong/records' || $route.path=='/dongdong/userDraw' || $route.path=='/dongdong/subsidy' || $route.path=='/dongdong/recharge' || $route.path=='/wallet/userWallet' || $route.path=='/wallet/updateRecords' || $route.path=='/agent/agentSearch' || $route.path=='/benefit/userBenefit' || $route.path=='/benefit/agentBenefit' || $route.path=='/rechargeCar/userRechargeCar' || $route.path=='/rechargeCar/userRechargeCarBatch' || $route.path=='/product/purchaseBusiness' || $route.path=='/product/purchaseJd' || $route.path=='/inviteRedPack/userWithdraw' || $route.path=='/inviteRedPack/userInvite' || $route.path=='/inviteRedPack/redPackRecords' || $route.path=='/wallet/userRedPackRecords' || $route.path=='/wallet/userRedPackRecords' || $route.path=='merchantsSettled/merchants_editor' || $route.path=='/order/fillingOrder' || $route.path=='/sign/record' || $route.path=='/oilStation/specifications' || $route.path=='/oilStation/companyExamine'"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive && !($route.path=='/product/property') && !($route.path=='/product/purchase') && !($route.path=='/product/storageJd') && !($route.path=='/product/notice') && !($route.path=='/order/orderList') && !($route.path=='/columnData/column_home') && !($route.path=='/columnData/column_localShop') && !($route.path=='/columnData/column_business_enterprise') && !($route.path=='/order/rate') && !($route.path=='/product/banner') && !($route.path=='/product/productColumn') && !($route.path=='/product/discount') && !($route.path=='/initPage/initPage_editor') && !($route.path=='/freight/index') && !($route.path=='/dongdong/records') && !($route.path=='/dongdong/userDraw') && !($route.path=='/dongdong/subsidy') && !($route.path=='/dongdong/recharge') && !($route.path=='/wallet/userWallet') && !($route.path=='/wallet/updateRecords') && !($route.path=='/agent/agentSearch') && !($route.path=='/benefit/userBenefit') && !($route.path=='/benefit/agentBenefit') && !($route.path=='/rechargeCar/userRechargeCar') && !($route.path=='/rechargeCar/userRechargeCarBatch') && !($route.path=='/product/purchaseBusiness') && !($route.path=='/product/purchaseJd') && !($route.path=='/inviteRedPack/userWithdraw') && !($route.path=='/inviteRedPack/userInvite') && !($route.path=='/inviteRedPack/redPackRecords') && !($route.path=='/wallet/userRedPackRecords') && !($route.path=='/order/fillingOrder') && !($route.path=='/sign/record') && !($route.path=='/oilStation/specifications') && !($route.path=='/oilStation/companyExamine')"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
export default {
  components: {
    top,
    tags,
    sidebar
  },
  name: "index",
  data() {
    return {};
  },
  created() {
    console.log(this.$route,'123123123123123123');
  },
  mounted() {},
  computed: mapGetters(["isLock"]),
  props: [],
  methods: {}
};
</script>

<style lang="scss" scoped>
.index {
  display: flex;
  position: relative;
  height: 100%;
  background: #fff;
  overflow: hidden;
  .left {
    width: 230px;
    overflow-y: auto;
  }
  .right {
    padding-top: 107px;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    flex: 1;
  }
  .main {
    height: 100%;
    background: #f1f4f5;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;
    .router {
      padding: 15px 8px;
      background: #fff;
      min-height: 100%;
      height: auto;
      overflow: hidden;
      border-radius: 5px;
      box-sizing: border-box;
    }
  }
  .nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .top {
    margin-bottom: 2px;
  }
}
</style>