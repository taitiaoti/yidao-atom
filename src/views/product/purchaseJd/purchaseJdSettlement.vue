<template>
    <div style="padding:40px;" class="settlement">
        <el-form ref="form"  :model="form" label-width="80px" size="small" :label-position="labelPosition">
            <el-form-item label="收货人信息" class="default-address-wrapper">
                <div class="add-address" >
                    <el-button @click="add" size="mini">新增地址</el-button>
                </div>
                <div class="default-address">
                    <el-tag>默认地址</el-tag>
                    <span class="text">{{defaultAddressObj.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{defaultAddressObj.province}} {{defaultAddressObj.city}}
                        {{defaultAddressObj.area}} {{defaultAddressObj.town}} {{defaultAddressObj.address}}&nbsp;&nbsp;&nbsp;&nbsp;{{defaultAddressObj.phone}}
                    </span>
                </div>
                <el-collapse accordion>
                    <el-collapse-item>
                        <el-table
                            :data="addressList"
                             height="260"
                            style="width: 100%"
                            @row-click="setAddress"
                            :default-sort = "{prop: 'date', order: 'descending'}"
                            >
                            <el-table-column label="收货人" width="180">
                                <template scope="scope">
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="地址">
                                <template scope="scope">
                                    <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.town}}{{scope.row.address}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="手机号码">
                                <template scope="scope">
                                    <span>{{scope.row.phone}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button type="success" @click="updateAddress(scope.row)" size="mini">编辑</el-button>
                                    <el-button type="danger" @click="deleteAddress(scope.row)" size="mini">删除</el-button>
                                    <el-button @click="setDefaut(scope.row)" v-if="!scope.row.isDefault" size="mini">设置为默认地址</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item label="支付方式">
                <el-select v-model="payChannel" @change="selectPayChannel" style="width: 100px;" placeholder="请选择">
                    <el-option
                    v-for="item in payChannelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-tag>在线余额</el-tag> -->
                <div class="settlement-balance" v-if="payChannel == 'redpay'">
                    <span class="text">余额：</span>
                    <span class="price">{{balance}}元</span>
                </div>
            </el-form-item>
            <!-- <el-form-item label="发货方式">
                <el-tag>直接发货</el-tag>
            </el-form-item>
            <el-form-item label="备注">
                <el-col :span="9">
                    <el-input v-model="form.name" stlye="width:300px;" placeholder="限45个字（定制类商品，请将购买需求在备注中做详细说明）"></el-input>
                </el-col>
                <el-col :span="11">
                    <span style="color: #666;margin-left: 30px;">提示：请勿填写有关支付、收货、发票方面的信息</span>
                </el-col>
            </el-form-item> -->
            <el-form-item label="商品清单">
                <el-table
                    v-show="cartSelectItems.length != 0"
                    ref="multipleTable"
                    :data="cartSelectItems"
                    tooltip-effect="dark"
                    style="width: 100%"
                    >
                    <el-table-column width="100">
                        <template scope="scope">
                            <img :src="scope.row.picture.indexOf('http') != -1 ? scope.row.picture : (baseUrl+scope.row.picture)" width="80" height="80" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品" >
                        <template scope="scope">
                            <div>{{scope.row.productName}}</div>
                            <div style="margin-top:10px;">商品编号：{{scope.row.productNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价(元)" align="center" width="100">
                        <template scope="scope">
                            <span>{{scope.row.price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="170" align="center">
                        <template scope="scope">
                            <span>x{{scope.row.quantity}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row :gutter="20" style="margin-top: 15px;">
                    <el-col :span="21" class="num-wrapper">
                        <span class="num">{{cartSelectItems.length}}</span>
                        <span class="text">种商品，总商品金额：</span>
                    </el-col>
                    <el-col :span="3" class="price-wrapper">
                        <span class="price">￥{{productMoney}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="21" class="num-wrapper">
                        <span class="text">运费：</span>
                    </el-col>
                    <el-col :span="3" class="price-wrapper">
                        <span class="price">￥{{freight}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="21" class="num-wrapper">
                        <span class="text">应付总额：</span>
                    </el-col>
                    <el-col :span="3" class="price-wrapper">
                        <span class="price" v-if="isFreePostage == 'n'">￥{{discountAmount}}</span>
                        <span class="price" v-else>￥{{discountAmount}}(不含运费)</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="s-address-wrapper">
                    <el-col :span="24">
                        <span class="address">寄送至：{{defaultAddressObj.province}} {{defaultAddressObj.city}} {{defaultAddressObj.area}} {{defaultAddressObj.town}}  
                             {{defaultAddressObj.address}}</span>
                    </el-col>
                    <el-col :span="24">
                        <span class="name">收货人：{{defaultAddressObj.name}}   {{defaultAddressObj.phone}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24" class="submit-order">
                        <span class="submit-price-wrapper">
                            <span class="text">提交订单应付总额：</span>
                            <span class="price">￥{{discountAmount}}</span>
                            <span class="text"  v-if="freight == 0">（不含运费）</span>
                        </span>
                        <el-button type="primary" :disabled="cartSelectItems.length == 0 || !isSubmit" :loading="loading" @click="submitOrder">提交订单</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="addressData">
                <el-form-item label="收货人" :label-width="formLabelWidth">
                    <el-input v-model="addressData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" :label-width="formLabelWidth">
                    <el-input v-model="addressData.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所在地区" :label-width="formLabelWidth">
                    <el-cascader
                        :options="options"
                        v-model="selectedOptions"
                        @change="selectAddress"
                        :props = "props"
                        change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="addressData.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="默认地址" :label-width="formLabelWidth">
                    <el-switch v-model="addressData.isDefault" @change="changeDefault">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sumbmitAddress" v-if="dialogType == 'add'">保存收货人信息</el-button>
                <el-button type="primary" @click="sumbmitUpdate" v-if="dialogType != 'add'">修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapGetters,mapMutations } from 'vuex'
    import { filterAddressData, resolveUrlPath, bcadd } from "@/util/util";

    import {getAllProvince, getCityByProvinceId, getAreaByCityId, getTownByAreaId, 
    getAddressList ,addAddress, update, delAddress, setDefaultAddress, 
    getJdFreight, buyProduct} from '@/api/product/purchase'
    import {dealCartPrice, getRedPackBalance, carBuy } from '@/api/product/purchaseBusiness'
    export default {
        data() {
            return {
                labelPosition: 'top',
                baseUrl:"http://qiniu.edawtech.com/",
                form: {
                    name: ''
                },
                btnType: 'info',
                addressList: [],
                addressData: {},
                options: [],
                props: {
                    children: 'cities',
                },
                provinces: [],
                citys: [],
                areas: [],
                townList: [],
                dialogFormVisible: false,
                formLabelWidth: '120px',
                addressKeyList: [],
                selectedOptions: [],
                dialogType: 'add',
                balance: 0,
                defaultAddressObj: {},
                freight: 0,
                isSubmit: true,
                threeOrfour: 0,   //省市区 还是 省市区镇
                listQuery: {
                    pageNum: 1,
                    pageSize: 1000
                },
                paramsProducts: [],
                productMoney: '',
                isFreePostage: 'y',
                discountAmount: '',
                payChannel: 'wxpay',
                payChannelList: [
                    {
                        value: 'alipay',
                        label: '支付宝'
                    },
                    {
                        value: 'wxpay',
                        label: '微信支付'
                    },
                    {
                        value: 'redpay',
                        label: '红包支付'
                    }
                ],
                orderNo: '',
                loading: false,
            }
        },
        computed: {
             ...mapGetters('cartJd',{
                cartSelectItems: 'cartSelectItems',
                total: 'cartTotalPrice',
            })
        },
        created(){
            this.getAddress();
        },
        methods: {
            ...mapMutations({
                setDefaultAddress: 'purchaseGood/setDefaultAddress'
            }),
            async getAddress(){
                // const res = await getAddressList();
                let postData = {
                    ...this.listQuery,
                    appId: 'dudu',
                }
                const res = await getAddressList();
                console.log(res, '地址');
                this.addressList = res.data;
                this.getDefaulAddress(res.data);
            },
            getDefaulAddress(list){
                console.log(list,'list');
                list.forEach(item => {
                    if(!!item.isDefault){
                        this.defaultAddressObj = item;
                        this.setDefaultAddress(item);
                        console.log(item,'默认地址');
                        this.getDealCartPrice(item.id);
                    }
                })
                // this.getFreight(this.defaultAddressObj.id);  //获取邮费
            },
            async getCurrentBalance(){
                const res = await getRedPackBalance();
                this.balance = res.data;
                console.log(res, '红包余额');
            },
            selectPayChannel(val){
                if(val == 'redpay'){
                    this.getCurrentBalance();
                }
            },
            add(){
                this.dialogType = 'add';
                this.resetFrom();
                this.dialogFormVisible = true;
                this.getProvince();
            },
            async getProvince(){
                const res = await getAllProvince();
                console.log(res, '省份');
                this.options = filterAddressData(res.data.result);
                this.provinces = filterAddressData(res.data.result);
            },
            async selectAddress(value){
                console.log(value, '选中地址');
                if(value[0] && !value[1]){
                    let postData = {
                        provinceId: value[0]
                    }
                    const res = await getCityByProvinceId(postData);
                    this.citys = filterAddressData(res.data.result);
                    this.options.forEach((item, index) => {
                        if(item.value == value[0] && !item.cities.length){
                            this.addressData['province'] = item.label;
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
                                    this.addressData['city'] = item02.label;
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
                    if(!res.data.result){
                        // this.getAddressCode(value)
                    }
                    this.options.forEach((item, index) => {
                        if(item.value == value[0]){
                            this.citys.forEach((item02, index02) => {
                                this.areas.forEach((item03, index03) => {
                                    if(item03.value == value[2]){
                                        item03.cities = this.townList
                                        this.addressData['area'] = item03.label;
                                    }
                                });
                            })
                            item.cities = this.citys;
                        }
                    });
                    this.addressData['town'] = '';
                    this.selectedOptions[3] = 0;
                }else if(value[3]){
                    let postData = {
                        countyId: value[2]
                    }
                    const res = await getTownByAreaId(postData);
                    this.townList = filterAddressData(res.data.result, true);
                    this.townList.forEach((item, index) => {
                        if(item.value == value[3]){
                            this.addressData['town'] = item.label;
                        }
                    });
                }
                this.addressKeyList = [];
                this.getAddressName(value,this.options, 0);
            },
            // async getFreight(id){
            //     let postData = {
            //         deliveryId: id,
            //         skus: this.getSkusAndNum()
            //     }
            //     const res = await getJdFreight(postData);
            //     try{
            //         if(typeof JSON.parse(res.data.msg) == 'object'){
            //             this.freight = JSON.parse(res.data.msg).freight;
            //             this.isSubmit = true;
            //         }
            //     }catch(e){
            //         if(!res.data.data){
            //             this.isSubmit = false;
            //         }
            //         this.$notify({
            //             title: res.statusText,
            //             message: res.data.msg,
            //             type: 'info',
            //             duration: 10000
            //         });
            //     }
            // },
            async getDealCartPrice(id){  //处理购物车价格
                this.isSubmit = true;
                this.cartSelectItems.forEach(item => {
                    this.paramsProducts.push({
                        productNo: item.productNo,
                        property: item.property,
                        productNum: item.quantity,
                        productDesc: item.propertyDesc,
                    })
                });
                let postData = {
                    products: this.paramsProducts,
                    deliveryId: id
                }
                const res = await dealCartPrice(postData);
                if(res.data.code === 0){
                    this.freight = res.data.data.postage;
                    this.productMoney = res.data.data.productMoney;
                    this.isFreePostage = res.data.data.isFreePostage;
                    this.discountAmount = res.data.data.discountAmount;
                }else {
                    this.isSubmit = false;
                    this.$notify({
                        title: '500',
                        message: '处理价格失败, 请联系服务人员',
                        type: 'error',
                        duration: 5000
                    });
                }
                console.log(res, '处理后价格');
            },
            getSkusAndNum(){   //获取编号（sku）和数量（quantity）列表
                let tempArr = [];
                this.cartSelectItems.forEach(item => {
                    tempArr.push({
                        skuId: item.sku,
                        num: item.quantity
                    })
                });
                return tempArr
            },
            async sumbmitAddress(){
                this.dialogFormVisible = !this.dialogFormVisible;
                let postData = {
                    name: this.addressData.name,
                    phone: this.addressData.phone,
                    province: this.addressKeyList[0],
                    city: this.addressKeyList[1],
                    area: this.addressKeyList[2],
                    town: !!this.addressKeyList[3] ? this.addressKeyList[3] : '',
                    name: this.addressData.name,
                    address: this.addressData.address,
                    isDefault: !!this.addressData.isDefault ? 1 : 0,
                }
                const res = await addAddress(postData);
                this.getAddress();
                this.$notify({
                    title: res.data.code === 0 ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.code === 0 ? 'success' : 'error',
                    duration: 2000
                });
            },
            getAddressName(value, list, num){
                list.forEach((item, index)=> {
                    if(item.value == value[num]){
                        num++;
                        if(num <= value.length){
                            //保存迭代到的地址名称
                            this.addressKeyList.push(item.label);
                            if(item.cities){
                                this.getAddressName(value, item.cities, num);
                            }
                        }
                    }
                });
            },
            async initAddress(row){
                this.threeOrfour = 0;
                this.selectedOptions = [];
                this.selectedOptions.push(Number(row.provinceCode));
                this.selectedOptions.push(Number(row.cityCode));
                this.selectedOptions.push(Number(row.countyCode));
                this.selectedOptions.push(Number(row.townCode));
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
                if(this.threeOrfour == 2){
                    this.addressData['town'] = '';
                    this.selectedOptions[3] = 0;
                }
            },
            filterInitAddress(res, list, num){
                list.forEach((item, index) => {
                    if(item.value == this.selectedOptions[num]){
                        this.threeOrfour = num;
                        num++ 
                        if(num < this.selectedOptions.length){
                            item.cities = filterAddressData(res[num].data.result);
                            this.filterInitAddress(res, item.cities, num);
                        }
                    }
                });
            },
            updateAddress(row){
                this.dialogType = 'update';
                this.dialogFormVisible = true;
                this.addressData['id'] = row.id;
                this.addressData['name'] = row.name;
                this.addressData['address'] = row.address;
                this.addressData['phone'] = row.phone;
                this.addressData['isDefault'] = row.isDefault === 1 ? true : false;
                this.addressData['province'] = row.province;
                this.addressData['city'] = row.city;
                this.addressData['area'] = row.area;
                this.addressData['town'] = row.town;
                console.log(row, '编辑');
                this.initAddress(row);
                // this.getProvince();
            },
            changeDefault(){
                this.addressData = Object.assign({}, this.addressData, {isDefault: this.addressData['isDefault']})
            },
            async sumbmitUpdate(){
                this.addressData['isDefault'] = this.addressData['isDefault']  ? 1 : 0;
                const res = await update(this.addressData);
                this.dialogFormVisible = false;
                this.getAddress();
                this.$notify({
                    title: res.data.code === 0 ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.code === 0 ? 'success' : 'error',
                    duration: 2000
                });
                console.log(res,'修改地址');
            },
            resetFrom(){
                this.addressData = {};
                this.addressKeyList = [];
            },
            deleteAddress({id}){
                this.$alert('请看清楚需要删除的项，避免误删。', '地址信息', {
                    confirmButtonText: '确定',
                    callback: async action => {
                        if(action == 'confirm'){
                            const res = await delAddress(id);
                            this.getAddress();
                            this.$notify({
                                title: res.data.code === 0 ? res.statusText : res.data.msg,
                                message: res.data.msg,
                                type: res.data.code === 0 ? 'success' : 'error',
                                duration: 2000
                            });
                        }
                    }
                });
            },
            async setDefaut({id}){
                const res = await setDefaultAddress(id);
                this.getAddress();
                this.$notify({
                    title: res.data.code === 0 ? res.statusText : res.data.msg,
                    message: res.data.msg,
                    type: res.data.code === 0 ? 'success' : 'error',
                    duration: 2000
                });
            },
            setAddress(row){  //点击表格某行触发的事件
                this.setDefaut(row);
            },
            dealPay(total, freight){
                // return total/10000 + Number(freight)
                return bcadd(total/10000 , Number(freight), 2);
            },
            async submitOrder(){
                let postData = {
                    deliveryId: this.defaultAddressObj.id,
                    products: this.paramsProducts,
                    payChannel: this.payChannel,
                    orderNo: this.orderNo,
                    source: 'web'
                }
                if(!this.defaultAddressObj.id){
                    this.$message.warning('请选择地址');
                }else if(!this.payChannel){
                    this.$message.warning('请选择支付方式');                    
                }else {     
                    this.loading = true;
                    const res = await carBuy(postData);
                    this.loading = false;
                    if(this.payChannel == 'redpay'){ //红包下单成功后处理
                        this.$notify({
                            title: res.data.code === 0 ? '支付成功' : res.data.msg,
                            message: res.data.msg,
                            type: res.data.code === 0 ? 'success' : 'error',
                            duration: 2000
                        });
                        if(res.data.code === 0){
                            this.$store.dispatch('cartJd/checkout', this.cartSelectItems);
                            this.$router.push({
                                path: resolveUrlPath("/product/purchaseJdCart"),
                            });
                        }
                    }else { //微信支、付宝下单成功后处理
                        this.$notify({
                            title: res.data.code === 0 ? res.statusText : res.data.msg,
                            message: res.data.msg,
                            type: res.data.code === 0 ? 'success' : 'error',
                            duration: 2000
                        });
                        if(res.data.code === 0){
                            this.$router.push({
                                path: resolveUrlPath("/product/purchaseJdPay"),
                                query: {
                                    orderInfo: res.data.data
                                }
                            });
                        }
                    }
                }
                
            },
        },
        filters: {
            filterPrice(price){
                return price/10000
            }
        },
    }
</script>
<style lang="scss">
    .settlement{
        .default-address-wrapper{
            position: relative;
            .default-address{
                position: absolute;
                top: 8px;
                .text{
                    color: #666;
                    margin-left: 8px;
                }
            }
            .add-address{
                display: inline-block;
                position: absolute;
                right: 100px;
                top: 8px;
            }
        }
        .num-wrapper{
            text-align: right;
            .num{
                color: #e86c08;
            }
            .text{
                color: #666;
            }
        }
        .price-wrapper{
            text-align: right;
            .price{
                margin-right: 30px;
                color: #333;
            }
        }
        .s-address-wrapper{
            padding: 20px 25px;
            background-color: #f4f4f4;
            text-align: right;
            border-top: 1px solid #e6e6e6;
            margin-top: 10px;
            .address, .name{
                color: #999;
            }
        }
        .submit-order{
            text-align: right;
            color: #666;
            padding-top: 30px!important;
            padding-right: 30px!important;
            .submit-price-wrapper{
                font-size: 0;
                margin-right: 20px;
                .text{
                    font-size: 16px;
                }
                .price{
                    color: #e86c08;
                    font-weight: bold;
                    font-size: 20px;
                }
            }
        }
    }
    .settlement-balance{
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
        .text{
            color: #666;
        }
        .price{
            color: #e86c08;
        }
    }
</style>

