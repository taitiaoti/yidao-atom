<template>
  <div class="menu-wrapper">
    <template v-for="(item,index) in menu">
      <el-menu-item v-if="item.children.length===0 " :index="filterPath(item.path,index)" @click="open(item)" :key="item.label">
        <i :class="item.icon"></i>
        <span slot="title">{{item.label}}</span>
      </el-menu-item>
      <el-submenu v-else :index="filterPath(item.label,index)" :key="item.label">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title" :class="{'el-menu--display':isCollapse}">{{item.label}}</span>
        </template>
        <template v-for="(child,cindex) in item.children" >
          <el-menu-item :index="filterPath(child.path,cindex)" @click="open(child)" v-if="child.children.length==0" :key="cindex" v-show="displayFilter(child.component)">
            <i :class="child.icon"></i>
            <span slot="title">{{child.label}}</span>
          </el-menu-item>
          <sidebar-item v-else :menu="[child]" :key="cindex" :isCollapse="isCollapse"></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { resolveUrlPath } from "@/util/util";
export default {
  name: "SidebarItem",
  data() {
    return {};
  },
  props: {
    menu: {
      type: Array
    },
    isCollapse: {
      type: Boolean
    }
  },
  created() {
    console.log(this.menu,'menu')
  },
  mounted() {},
  computed: {},
  methods: {
    filterPath(path, index) {
      return path == null ? index + "" : path;
    },
    open(item) {
      this.$router.push({
        path: resolveUrlPath(item.path, item.label),
        query: item.query
      });
    },
    displayFilter(n){
      let temp = true;
      switch(n) {
        case 'views/product/goods/info':
          temp = false;
        case 'views/product/goods/add':
          temp = false;
          break;
        case 'views/product/storageJd/cartJD':
          temp = false;
          break;
        case 'views/product/purchase/shoppingCart':
          temp = false;
          break;
        // case 'views/product/purchaseBusiness/purchaseBusinessCart':
        //   temp = false;
        //   break;
        case 'views/product/purchaseBusiness/businessSettlement':
          temp = false;
          break;
        case 'views/product/purchaseBusiness/purchaseBusinessPay':
          temp = false;
          break;
        case 'views/product/purchaseJd/purchaseJdCart':
          temp = false;
          break;
        case 'views/product/purchaseJd/purchaseJdSettlement':
          temp = false;
          break;
        case 'views/product/purchaseJd/purchaseJdPay':
          temp = false;
          break;
        case 'views/order/orderList/ordereditor':
          temp = false;
          break;
        case 'views/merchantsSettled/merchants/editor':
          temp = false;
          break;
        case 'views/product/purchase/settlement':
          temp = false;
          break;
        case 'views/freight/template/add':
          temp = false;
          break;
        case 'views/agent/agentProduct/add':
          temp = false;
          break;
        case 'views/push/homePagePush/add':
          temp = false;
          break;
        case 'views/push/auroraPush/add':
          temp = false;
          break;
        case 'views/oilStation/companyOilStations/add':
          temp = false;
        break;
        case 'views/oilStation/gasStation/add':
          temp = false;
        break;
        case 'views/oilStation/companyExamine/auditInfo':
          temp = false;
        break;
        default:
          temp = true
      }
      return temp
    },
  }
};
</script>
<style lang="scss" scoped>

</style>

