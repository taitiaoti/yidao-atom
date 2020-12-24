<template>
    <div class="amap-page-container">
      <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap
        vid="amapDemo"  
        :center="mapCenter"
        :zoom="zoom"  
        class="amap-demo"
        :events="events">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker" :key="index"></el-amap-marker>
      </el-amap>
      <!-- <div class="toolbar">
        position: [{{ lng }}, {{ lat }}] address: {{ address }}
      </div> -->
    </div>
  </template>

  <style>
    .amap-demo {
      height: 40px;
    }
    .amap-page-container{
      height: 398px;
    }
  </style>

  <script>
  
    module.exports = {
      
      props: ['mapCenter'],
      data: function() {
        let self = this;
        return {
          zoom: 12,
          address: '',
          searchOption: {
            // city: '北京',
            // citylimit: true
          },
           markers: [
          ],
          // defaultValue: '山东省聊城市',
          events: {
            click(e) {
              let { lng, lat } = e.lnglat;
              self.lng = lng;
              self.lat = lat;
              // 这里通过高德 SDK 完成。
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              geocoder.getAddress([lng ,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    self.address = result.regeocode.formattedAddress;
                    self.$emit('transferMapInfo', [self.lng,self.lat,self.address]);
                    self.$nextTick();
                  }
                }
              });
            }
          },
          lng: 0,
          lat: 0
        };
      },
      methods: {
        addMarker: function() {
          let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
          let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
          this.markers.push([lng, lat]);
        },
        onSearchResult(pois) {
          let self = this;
          let latSum = 0;
          let lngSum = 0;
          if (pois.length > 0) {
            pois.forEach(poi => {
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
              this.markers.push([poi.lng, poi.lat]);
            });
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress([center.lng ,center.lat], function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  let address = result.regeocode.formattedAddress;
                  self.$emit('transferMapInfo', [center.lng,center.lat,address]);
                }
              }
            });
          }
        }
      }
    };
</script>
<style>
  .amap-page-container{
    position: relative;
    border: 1px solid #dcdfe6;
  }
  .search-box{
    position: absolute!important;
    left: 10px;
    top: 10px;
  }
  .search-btn{
    background-color: #1086ff!important;
    color: #fff;
  }
</style>
