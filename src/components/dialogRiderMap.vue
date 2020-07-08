<template>
  <div>
    <div class="amap-page-container">
        <el-amap
          vid="amapDemo"  
          :center="mapCenter"
          :zoom="zoom"  
          class="amap-demo">
          <el-amap-marker :position="mapCenter"></el-amap-marker>
          <el-amap-marker v-for="(marker, index) in markers"
            :position="marker.position"
            :content='getIcon()'
            :key="index"></el-amap-marker>
          <el-amap-text></el-amap-text>
        </el-amap>
    </div>
    <div class="footer">
      <el-button type='primary' @click="getRiderAddress" :loading='loading'>刷新</el-button>
    </div>
  </div>
</template>

<script>

import { riderAddress } from '@/api/riderManagement/index';
export default {
  props: ['mapCenter'],
  data(){
    return {
      riderId: '',
      zoom: 16,
      markers: [],
      distance: '',    //距离
      loading: false,
      riderIcon: require("../assets/img/icon-qishoudingwe.png")
    }
  },
  methods:{
    getIcon(){
      let content = '<div style="width:80px;height:80px;"><div style="background-color:rgba(255,255,255,0.6);text-align:center;">距离约' + this.distance + 'm</div><img src="' + this.riderIcon + '" style="width:40px;height:40px;"/></div>';
      return content
    },
    closeDialog(){
      this.$emit('closeRiderDialog')
    },
    // 获取骑手位置
    async getRiderAddress(row){
      this.loading = true;
      this.riderId = row.riderId ? row.riderId : this.riderId;
      let res = await riderAddress(this.riderId)
      this.addMarker(res.data.longitude, res.data.latitude)
    },
    addMarker(longitude,latitude){
      this.markers = []
      this.markers.push({
        position: [longitude,latitude]
      });
      let start = {
        longitude,
        latitude
      };
      let end = {
        longitude: this.mapCenter[0],
        latitude: this.mapCenter[1]
      }
      this.calculateLineDistance(start,end)
      console.log('刷新位置')
    },
    // 计算距离
    calculateLineDistance(start, end) {
      var d1 = 0.01745329251994329;
      var d2 = start.longitude;
      var d3 = start.latitude;
      var d4 = end.longitude;
      var d5 = end.latitude;
      d2 *= d1;
      d3 *= d1;
      d4 *= d1;
      d5 *= d1;
      var d6 = Math.sin(d2);
      var d7 = Math.sin(d3);
      var d8 = Math.cos(d2);
      var d9 = Math.cos(d3);
      var d10 = Math.sin(d4);
      var d11 = Math.sin(d5);
      var d12 = Math.cos(d4);
      var d13 = Math.cos(d5);
      var arrayOfDouble1 = [];
      var arrayOfDouble2 = [];
      arrayOfDouble1.push(d9 * d8);
      arrayOfDouble1.push(d9 * d6);
      arrayOfDouble1.push(d7);
      arrayOfDouble2.push(d13 * d12);
      arrayOfDouble2.push(d13 * d10);
      arrayOfDouble2.push(d11);
      var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
          (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
          (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
      this.distance = Math.ceil(Math.asin(d14 / 2.0) * 12742001.579854401);
      this.loading = false;
    }
  }
}
</script>

<style>
    .amap-demo {
      height: 40px;
    }
    .amap-page-container{
      height: 500px;
    }
    .footer{
      text-align: right;
      margin-top: 30px;
    }
  </style>