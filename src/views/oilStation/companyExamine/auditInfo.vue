<template>
  <div>
      <!-- 审核信息 -->
      <el-row>
          <el-col :span="24">
            <el-tabs type="border-card" v-model="activeName">
              <el-tab-pane label="基本信息" name="info">
                  <span slot="label"><i class="icon-shangpin-jibenxinxi icon-14"></i> 基本信息</span>
                  <el-form label-width="100px" :model="formData">
                      <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="加盟商ID">
                              <el-input v-model="formData.gasUsername" disabled placeholder=""></el-input>
                          </el-form-item>
                          <el-form-item label="加盟商名称">
                              <el-input v-model="formData.gasAgentName" disabled placeholder=""></el-input>
                          </el-form-item>
                          <el-form-item label="油 站 名 称">
                              <el-input v-model="formData.gasName" disabled placeholder=""></el-input>
                          </el-form-item>
                          <el-form-item label="油 站 品 牌">
                              <el-select v-model="formData.gasType" disabled placeholder="">
                                <el-option
                                v-for="item in gasTypeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="加油站图片">
                              <img :src="formData.gasLogoSmall.indexOf('http')==0?formData.gasLogoSmall:(baseUrl+formData.gasLogoSmall)"  style="width:100px;height:100px;"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所在城市">
                                <el-cascader
                                  v-model="citysArr"
                                  :options='cityOptions'
                                  disabled
                                  :props='props'>
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="经度" class="x">
                                <el-input v-model="formData.gasAddressLongitude" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="纬度" class="y">
                                <el-input v-model="formData.gasAddressLatitude" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="地址" class="map-address">
                                <el-input v-model="formData.gasAddress" disabled></el-input>
                            </el-form-item>
                        </el-col>
                      </el-row>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="油站详情" name="detail">
                  <span slot="label"><i class="icon-shangpin-jibenxinxi icon-14"></i> 油站详情</span>
                  <!-- 规格展示表格 -->
                  <el-table
                    :data="tableList"
                    border
                    style="width:100%;">
                        <el-table-column align="center" label="类别">
                            <template scope="scope">
                                <span>{{ scope.row.oilType | filterOilType }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="油号">
                            <template scope="scope">
                                <span>{{ scope.row.oilNo }}#</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="枪号">
                            <template scope="scope">
                                <span v-for="(item,index) in scope.row.gunNoList" :key="index">
                                    <span>{{ item }}，</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="国标价（元）">
                            <template scope="scope">
                                <span>{{ scope.row.priceOfficial }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="枪价（元）">
                            <template scope="scope">
                                <span>{{ scope.row.priceGun }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="优惠后金额（元）">
                            <template scope="scope">
                                <span>{{ scope.row.priceGas }}</span>
                            </template>
                        </el-table-column>
                  </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
  </div>
</template>

<script>
import { auditGasInfo,auditGasDateils } from "@/api/franchisee/index";
import {citys} from "@/util/city"
export default {
    data(){
        return {
            tableList: [],
            formData: {
                gasLogoSmall: ''
            },
            activeName: 'info',
            citysArr: [],
            fileList: [],
            cityOptions: [],
            props: {
                value: 'label'
            },
            gasTypeData: [
                { label: '中石油', value: '1' },
                { label: '中石化', value: '2' },
                { label: '壳牌', value: '3' },
                { label: '其他', value: '4' }
            ],
            baseUrl:"http://qiniu.edawtech.com/",
        }
    },
    methods: {
        // 基本信息
        getGasInfo(id){
            let postData = {
                gasId: id
            }
            auditGasInfo(postData).then((res)=>{
                let gasInfo = res.data;
                console.log(res,'基本信息')
                this.formData.gasLogoSmall = gasInfo.gasLogoSmall;
                this.formData.gasName = gasInfo.gasName;
                this.formData.gasType = gasInfo.gasType;
                this.formData.gasUsername = gasInfo.gasUsername;
                this.formData.gasAgentName = gasInfo.gasAgentName;
                this.formData.gasAddressLongitude = gasInfo.gasAddressLongitude;      //经度
                this.formData.gasAddressLatitude = gasInfo.gasAddressLatitude;      //纬度
                this.formData.gasAddress = gasInfo.gasAddress;             //详细地址
                this.citysArr = [gasInfo.provinceName,gasInfo.cityName,gasInfo.countyName];
            })
        },
        // 详情
        getGasDetail(id){
            let postData = {
                gasId: id,
                source: '1001'
            }
            auditGasDateils(postData).then((res)=>{
                console.log(res,'油站详情')
                this.tableList = res.data;
            })
        },
        // 处理城市区域数据
        getCitys(){
            let data = '';
            let cityArr = [];
            for(var i = 0,length = citys.districts.length; i<length; i++){
                data = citys.districts[i].districts;
            }
            data.forEach(item => {
                cityArr.push({
                    label: item.name,
                    value: item.adcode,
                    children: item.districts
                })
                cityArr.forEach((item2)=>{
                    item2.children.forEach((child)=>{
                        child.value = child.adcode;
                        child.label = child.name;
                        child.children = child.districts;
                        child.children.forEach((child2)=>{
                            child2.value = child2.adcode;
                            child2.label = child2.name;
                        })
                    })
                })
            });
            this.cityOptions = cityArr;
            // console.log(cityArr,'cityArr')
        },
    },
    filters: {
        filterOilType(val){
            let data = {
                1: '汽油',
                2: '柴油',
                3: '天然气'
            }
            if(val){
                return data[val]
            }
        }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(to.query.id){
          vm.getCitys()
          vm.gasId = to.query.id;
          vm.getGasInfo(to.query.id);
          vm.getGasDetail(to.query.id);
        }
      });
  },
}
</script>

<style>

</style>