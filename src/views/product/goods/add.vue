<template>
    <div class="container">
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card" v-model="activeName"  :before-leave="beforeLeave" @tab-click="onTabClick">
              <el-tab-pane label="基本信息" name="first">
                  <span slot="label"><i class="icon-shangpin-jibenxinxi icon-14"></i> 基本信息</span>
                  <el-form :label-position="labelPosition" label-width="100px" ref="form" :model="formData">
                      <el-row :gutter="20">
                        <el-col :span="8">
                          
                          <el-form-item label="商  品  名  称">
                              <el-input v-model="formData.productName" placeholder="请输入商品名称" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          
                          <el-form-item label="所  属  分  类">
                            <div class="block">
                                <el-cascader :options="options" placeholder="请选择所属分类" :disabled="!isHidden(formData.appId || currentAppId)" v-model="currCategory"  @change="handleChange"></el-cascader>
                            </div>
                          </el-form-item>
                          <el-form-item label="所  属  栏  目" v-if="addType == 'agent'">
                                <el-select v-model="formData.childColumnId" placeholder="请选择所属栏目" :disabled="!isHidden(formData.appId || this.currentAppId)">
                                    <el-option
                                    v-for="item in columnsList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                          </el-form-item>
                          <el-form-item label="商  品  主  图" prop="file">
                              <el-upload class="upload-demo" :limit="1" action="/shop/web/product/uploadMain" :on-success="uploadSuccess"
                                          :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                                  <el-button size="small" type="primary" :disabled="!isHidden(formData.appId || currentAppId)">点击上传</el-button>
                                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，尺寸大小为534x504</div>
                              </el-upload>
                          </el-form-item>
                          <el-form-item label="关     键     词">
                              <el-input v-model="formData.keywords" placeholder="请输入关键词" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item> 
                          <el-form-item label="销              量">
                              <el-input v-model="formData.spu" placeholder="请输入销量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="商品展位类型">
                            <el-select v-model="formData.type" @change="selectGoodType" placeholder="请选择" :disabled="!isHidden(formData.appId || currentAppId)">
                                <el-option
                                v-for="item in goodType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="商品介绍类型">
                              <el-select v-model="formData.descType" placeholder="请选择" :disabled="!isHidden(formData.appId || currentAppId)">
                                  <el-option
                                  v-for="item in options02"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="展  示  位  置">
                              <el-select v-model="goodSort" :disabled="!isHidden(formData.appId || currentAppId)" @change="changeSort" placeholder="请选择">
                                  <el-option
                                  v-for="item in sortList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="重    量 (kg)">
                              <el-input v-model="formData.weight" placeholder="请输入重量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                            <el-form-item label="体    积 (m³)">
                              <el-input v-model="formData.volume" placeholder="请输入体积" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                            <el-form-item label="配 送  方 式">
                              <el-select class="filter-item" v-model="formData.deliveryMode" @change="changeDeliveryMode" filterable allow-create placeholder="请选择" multiple>
                                <el-option v-for="item in deliveryModeList" :key="item.code" :label="item.name" :value="item.code">
                                  <span style="float: left">{{ item.name }}</span>
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <!-- <el-form-item label="配 送  方 式">
                              <el-checkbox-group v-model="formData.deliveryMode" @change="changeDeliveryMode" size="small" :disabled="!isHidden(formData.appId || currentAppId)">
                                <el-checkbox v-for="item in deliveryModeList" :label="item.code" :key="item.code">{{item.code}}</el-checkbox>
                              </el-checkbox-group>
                            </el-form-item> -->
                            <el-form-item label="运 费  模 板">
                              <el-select v-model="formData.freightTemplateId" :disabled="!isHidden(formData.appId || currentAppId)" placeholder="请选择">
                                <el-option
                                  v-for="item in freightList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  <span style="float: left">{{ item.label }}</span>
                                  <span style="float: right;">
                                    <el-button type="primary" @click="handleFeight(item.value)" size="mini">编 辑</el-button>
                                  </span>
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="供    货   价" v-if="isHidden(formData.appId || currentAppId)">
                                <el-input v-model="formData.costPrice" placeholder="请输入供货价" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="波    动   价">
                                <el-input v-model="formData.wavePrice" placeholder="请输入波动价" type="number" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                            <el-form-item label="零    售   价">
                                <el-input v-model="formData.unitPrice" placeholder="请输入零售价" type="number" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                            <el-form-item label="对 比 来 源 " class="fuck">
                                <el-select v-model="formData.contrastSource" @change="selectSource" placeholder="请选择" :disabled="!isHidden(formData.appId || this.currentAppId)">
                                    <el-option
                                    v-for="item in sourceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-tooltip class="item" effect="dark" content="客户端展示的对比来源" placement="top-start">
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="查看对比来源" class="fuck">
                                <el-select v-model="formData.coperatingOntrastSource" @change="selectOntrastSource" placeholder="请选择" :disabled="!isHidden(formData.appId || this.currentAppId)">
                                    <el-option
                                    v-for="item in sourceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-tooltip class="item" effect="dark" content="后台查看的其他网站对比来源" placement="top-start">
                                  <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="参考链接">
                                <el-input v-model="formData.referenceLink" placeholder="请输入商品参考链接" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="8">
                          
                            <el-form-item label="对比零售价" label-width="150px">
                                <el-input v-model="formData.contrastPrice" placeholder="请输入对比零售价" type="number" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item>
                          <el-form-item label=" 是  否  免  邮" label-width="150px">
                                <el-radio-group v-model="formData.isFreePostage" :disabled="!isHidden(formData.appId || currentAppId)" size="small">
                                  <el-radio label="y" border>是</el-radio>
                                  <el-radio label="n" border>否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="邮          费" label-width="150px" v-if="formData.isFreePostage == 'n'">
                                <el-input v-model="formData.postage" placeholder="请输入对邮费" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                            </el-form-item> 
                          <el-form-item label="物流配送最低购买数量" label-width="150px" v-if="addType != 'agent'">
                            <el-input v-model="formData.logisticsMinNum" placeholder="请输入物流配送最低购买数量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="物   流  一  次  累 加  数  量 " label-width="150px" v-if="addType != 'agent'">
                            <el-input v-model="formData.addNum" placeholder="请输入一次累加数量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="快递配送最低购买数量" label-width="150px" v-if="addType != 'agent'">
                            <el-input v-model="formData.courierMinNum" placeholder="请输入快递配送最低购买数量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="快   递  一  次  累 加  数  量 " label-width="150px" v-if="addType != 'agent'">
                            <el-input v-model="formData.courierMinAddNum" placeholder="请输入一次累加数量" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          
                          <!-- 店铺下拉框 -->
                          <el-form-item label="所      属      店      铺 " label-width="150px">
                            <el-autocomplete
                              v-model="state"
                              :fetch-suggestions="querySearchAsync"
                              placeholder="请输入至少两位的所属店铺名称"
                              @select="handleSelect"
                              style="width:100%"
                              :trigger-on-focus = 'false'
                              :hide-loading= false
                              :disabled="!isHidden(formData.appId || currentAppId)"
                            >
                              <template slot-scope="{ item }">
                                <span>{{ item.label }}</span>
                                <span style="float:right">
                                  <el-tooltip effect="dark" placement="top-start">
                                    <div slot="content">{{ item.storeAddress }}</div>
                                    <el-button icon='el-icon-info' circle size="mini" class="miniBTN"></el-button>
                                  </el-tooltip>
                                </span>
                              </template>
                            </el-autocomplete>
                          </el-form-item>
                          <el-form-item label="加  油  商  品" label-width="150px">
                                <el-radio-group v-model="formData.isRefueling" :disabled="!isHidden(formData.appId || currentAppId)" size="small">
                                  <el-radio label="y" border>是</el-radio>
                                  <el-radio label="n" border>否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                          <div>
                            <el-form-item label=" " v-if="!isHidden(formData.appId || currentAppId)">
                                <span style="font-size: 16px;color: red;">注：您暂无编辑权限</span>
                            </el-form-item>
                          </div>
                          <el-form-item label="联     系     人" v-if="addType == 'agent'">
                            <el-input v-model="formData.contacts" placeholder="联系人" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="联  系   方  式" v-if="addType == 'agent'">
                            <el-input v-model="formData.phone" placeholder="联系方式" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                            <el-form-item label="所属公司名称" v-if="addType == 'agent'">
                            <el-input v-model="formData.companyName" placeholder="联系人" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="银 行 账 户 名" v-if="addType == 'agent'">
                            <el-input v-model="formData.acctName" placeholder="联系方式" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                            <el-form-item label="银  行   卡  号" v-if="addType == 'agent'">
                            <el-input v-model="formData.bankAccount" placeholder="联系人" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <el-form-item label="所  属   银  行" v-if="addType == 'agent'">
                            <el-input v-model="formData.bankName" placeholder="联系方式" :disabled="!isHidden(formData.appId || currentAppId)"></el-input>
                          </el-form-item>
                          <div class="good-submit">
                            <el-button v-if="isHidden(formData.appId || currentAppId)" :loading="submitLoading" type="primary" @click="submit('form')">保 存</el-button>
                          </div>
                        </el-col>
                      </el-row>
                  </el-form>
              </el-tab-pane>
                <!-- 商品介绍示例模板的弹出框 -->
                <el-dialog title="提示" :visible.sync="tupian4" width="780px" @click="tupian4 = false">
                  <span  class="tupian4" :style="{backgroundImage:jieshao}"></span>
                  <span slot="footer" class="dialog-footer">
                  
                    <el-button type="primary" @click="tupian4 = false">关 闭</el-button>
                  </span>
                </el-dialog>
              <el-tab-pane label="商品介绍" name="second">
                  <span slot="label"><i class="icon-shangpinjieshao icon-14"></i> 商品介绍</span>
                  <div>
                    <div style="float:left;color:red;">注意：</div>
                    <div style="float:left;">
                      <span>1.文字在1000字内</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>2.图片最多上传10张</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>3.营业执照</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span>4.检测证书</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <el-button @click="tupian4 = true" class="muban" size="mini"   >示例模板<i class="el-icon-question el-icon--right"></i></el-button>
                    </div>
                    <div style="clear:both;"></div>
                  </div>
                  <QUE :text="defaultMsg" v-if="formData.descType == 0" :editorId="editorId01" @editorChange="editorChange">
                  </QUE>
                  <el-row v-if="formData.descType == 1">
                    <el-input placeholder="请输入内容" :disabled="!isHidden(formData.appId || currentAppId)" v-model="defaultMsg">
                      <template slot="prepend">Http://</template>
                    </el-input>
                  </el-row>
                  <el-row class="submit-good-desc" v-if="isHidden(formData.appId || currentAppId)">
                      <el-button size="small" type="primary" @click="submitGoodsDesc">确定</el-button>
                  </el-row>
              </el-tab-pane>
                <!-- 商品图片的弹出框 -->
                <el-dialog title="提示" :visible.sync="tupian1" width="50%" @click="tupian1 = false">
                  <span  class="tupian1" :style="{backgroundImage:shangpin}"></span>
                  <span slot="footer" class="dialog-footer">
                    
                    <el-button type="primary" @click="tupian1 = false">关 闭</el-button>
                  </span>
                </el-dialog>
              <el-tab-pane label="商品图片" name="third">
                <span slot="label"><i class="el-icon-picture icon-14"></i> 商品图片</span>
                <el-row >
                    <el-upload class="upload-demo" action="/shop/web/product/uploadImages" :data="uploadArg" 
                        :on-success="uploadBannerSuccess"
                        :on-change="handleBannerbefore" :file-list="tableData" :show-file-list="false" list-type="picture">
                        <el-button size="small" v-if="isHidden(formData.appId || currentAppId)" :disabled="tableData.length >= 5" type="primary">添加视频和图片</el-button>
                        
                        <div slot="tip" class="el-upload__tip">
                          只能上传<span style="color:red;">jpg/png文件</span>，
                          不超过<span style="color:red;">500kb</span>，
                          尺寸大小为<span style="color:red;">1080x870</span>,
                          且不能超过<span style="color:red;">5张</span>
                        </div>
                    </el-upload>
                    <div>
                        <el-button @click="tupian1 = true" class="muban" size="mini"   >示例模板<i class="el-icon-question el-icon--right"></i></el-button>
                    </div>
                
                </el-row>
                
                <el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    label="图片"
                    width="200"
                    >
                    <template scope="scope">
                      <video :src="scope.row.url.indexOf('http')==0 ? scope.row.url : (baseUrl+scope.row.url)" v-if='scope.row.type == "video" && scope.row.url' height="100" width="100" controls="controls"></video>
                      <img v-else :src="scope.row.url.indexOf('http')==0 ? scope.row.url : (baseUrl+scope.row.url)" height="100" width="100" >
                    </template>
                  </el-table-column>
                  <el-table-column
                      label="操作">
                      <template scope="scope">
                        <el-button
                          v-if="isHidden(formData.appId || currentAppId)"
                          @click="deleteRow(scope.$index, scope.row)"
                          type="danger"
                          size="small">
                          删除
                        </el-button>
                      </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
                <!-- 商品参数示例模板的弹出框 -->
                <el-dialog title="提示" :visible.sync="tupian2" width="45%" @click="tupian2 = false">
                  <span  class="tupian2" :style="{backgroundImage:canshu}"></span>
                  <span slot="footer" class="dialog-footer">
                    
                    <el-button type="primary" @click="tupian2 = false">关 闭</el-button>
                  </span>
                </el-dialog>
              <el-tab-pane label="商品参数" name="fourth">
                <span slot="label"><i class="icon-shangpincanshu icon-14"></i> 商品参数</span>
                <el-row :gutter="10" class="addParam">
                  <el-col :span="4"><el-input :disabled="!isHidden(formData.appId || currentAppId)" clearable v-model="param" size="small" placeholder="请输入参数名"></el-input></el-col>
                  <el-col :span="4"><el-input :disabled="!isHidden(formData.appId || currentAppId)" clearable v-model="paramValue" size="small" placeholder="请输入参数值"></el-input></el-col>
                  <el-col :span="1"><el-button v-if="isHidden(formData.appId || currentAppId)" type="primary" :disabled="!param || !paramValue" size="small" @click="addParam">添加</el-button></el-col>
                  <el-col :span="2"><el-button @click="tupian2 = true" class="muban" size="mini"   >示例模板<i class="el-icon-question el-icon--right"></i></el-button></el-col>
                  
                </el-row>
                <el-table
                  :data="paramTableData"
                  style="width: 100%">
                  <el-table-column
                    prop= "specName"
                    label="参数名"
                    width="300"
                    >
                  </el-table-column>
                  <el-table-column
                    prop= "specValue"
                    label="参数值"
                    width="300"
                    >
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template scope="scope">
                        <el-button
                          @click="deleteRow(scope.$index, scope.row)"
                          v-if="isHidden(formData.appId || currentAppId)"
                          type="danger"
                          size="small">
                          删除
                        </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
                <!-- 商品规格示例模板的弹出框 -->
                <el-dialog title="提示" :visible.sync="tupian3" width="71%" @click="tupian3 = false">
                  <span  class="tupian3" :style="{backgroundImage:guige}"></span>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="tupian3 = false">关 闭</el-button>
                  </span>
                </el-dialog>
                <!-- 商品规格 -->
              <el-tab-pane label="商品规格" name="five">
                <span slot="label"><i class="icon-shangpinguige icon-14"></i> 商品规格</span>
                <el-row   class="p-table" :gutter="40">
                  <el-col :span="2" style="text-align: right;margin-bottom: 20px;">
                    <el-button type="primary" :disabled="!formData.categoryId" @click="handleCreateProperty" class="el-icon-plus" size="mini">添加规格</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right;margin-bottom: 20px;">
                    <el-button @click="tupian3 = true" class="muban" size="mini"   >示例模板<i class="el-icon-question el-icon--right"></i></el-button>
                  </el-col>
                </el-row>
                <el-row   class="p-table" :gutter="40" v-for="(item, index) in specification" :label="index" :key="index">
                  <el-col :span="2" style="text-align: right;">
                    <div style="position:relative;">
                      <el-button type="danger" @click="deleteProperty(item)" style="padding:1px;position:absolute;top:2px;right:-8px;" size="mini" icon="el-icon-close" circle></el-button>
                      <el-button icon="el-icon-edit" class="button-new-tag" size="mini" @click="handleEditorProperty(item)" style="margin-top:8px;">{{item.name}}</el-button>
                    </div>
                  </el-col>
                  <el-col :span="22">
                    <el-checkbox-group v-model="checkedSpecifition[index]" style="margin-top:10px;">
                      <el-checkbox v-for="(item02, index02) in item.values" :disabled="!isHidden(formData.appId || currentAppId)" @change="checkInList" :label="item.id+','+item02.id" :key="index02">{{item02.value}}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
                <!-- 规格数据表格 -->
                <el-table
                  border
                  :data="inventoryTableData"
                  ref="inventoryTable"
                  style="width: 100%;margin-top: 30px;">
                  <template v-for="(header, index) in tableDataHeaderNew">
                    <el-table-column  :prop="header.prop" :label="header.label" :key="index">
                      <template scope="scope">
                        <el-input :disabled="!(tableDataHeaderNew[index].prop == 'price') && !(tableDataHeaderNew[index].prop == 'isBenefit') && !(tableDataHeaderNew[index].prop == 'benefit') && !isHidden(appId)" v-show="!(tableDataHeaderNew[index].change == '1') && !(tableDataHeaderNew[index].prop == 'isBenefit') && !(tableDataHeaderNew[index].prop == 'imageUrl')" v-model="scope.row[tableDataHeaderNew[index].prop]"  placeholder=""></el-input>
                        <div v-show="tableDataHeaderNew[index].change == '1'">{{scope.row[tableDataHeaderNew[index].prop]}}</div>
                        <el-select :disabled="!(tableDataHeaderNew[index].prop == 'price') && !(tableDataHeaderNew[index].prop == 'isBenefit') && !(tableDataHeaderNew[index].prop == 'benefit') && !isHidden(appId)" v-model="scope.row[tableDataHeaderNew[index].prop]" v-show="tableDataHeaderNew[index].prop == 'isBenefit'" placeholder="请选择">
                          <el-option
                            v-for="item in isBenefitList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <!-- 商品规格上传图片 用v-show图片路径会报错 解决方案换成v-if -->
                        <el-upload class="upload-demo" :file-list="fileList02"  v-if="tableDataHeaderNew[index].prop == 'imageUrl'" :limit="1" action="/shop/web/product/uploadInventoryImage" :on-success="uploadPropertyPicSuccess"
                        >
                          <el-button size="small" v-if="!scope.row[tableDataHeaderNew[index].prop]" @click="getTableIndex(scope.$index)" type="primary" :disabled="!isHidden(formData.appId || currentAppId)">上传图片</el-button>
                        </el-upload>
                        <div style="position:relative;" v-if="tableDataHeaderNew[index].prop == 'imageUrl' && scope.row[tableDataHeaderNew[index].prop]">
                          <span style="position:absolute;top:-3px;left: 70px;width: 20px;height: 20px;">
                            <el-button type="danger" @click="deletePic(scope.$index)" style="padding:2px;" size="mini" icon="el-icon-close" circle></el-button>
                          </span>
                          <img style="margin-top:10px;" :src="baseUrl+scope.row[tableDataHeaderNew[index].prop]" height="80" width="80" >
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                  <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <!-- <el-button type="primary" size="small" @click="updateInventory(scope.$index, scope.row)">确定修改</el-button> -->
                        <!-- <el-upload style="display:inline-block" class="upload-demo" :file-list="fileList02" :limit="100" action="/shop/web/product/uploadInventoryImage" :on-success="uploadPropertyPicSuccess">
                          <el-button size="small" @click="getTableIndex(scope.$index)" type="primary" :disabled="!isHidden(formData.appId || currentAppId)">上传图片</el-button>
                        </el-upload> -->
                        <el-button type="danger" size="small" v-if="isHidden(appId)" @click="handelDeleteInventory(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row class="submit-good-desc">
                  <el-button size="small" type="primary" @click="submitPropertyList">确定添加</el-button>
                </el-row>
              </el-tab-pane>
              <!-- 添加规格模态  -->
              <el-dialog
              class="property-dialog"
              width="580px"
              :title="dialogStatus" 
              :visible.sync="dialogFormVisible"
              :append-to-body="true">
                <el-form :model="propertyForm" ref="form" label-width="100px">
                  <!-- <el-form-item label="分类绑定">
                    <div class="block">
                      <el-cascader :options="options"  v-model="currCategory"></el-cascader>
                    </div>
                  </el-form-item> -->
                  <el-form-item label="规格名称" >
                    <el-input v-model="propertyForm.name" placeholder="请输入规格名称"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="排序">
                    <el-input v-model="propertyForm.sort" placeholder="请输入排序位置"></el-input>
                  </el-form-item> -->
                  <el-form-item>
                    <el-button @click="addDomain">增加属性可选项</el-button>
                  </el-form-item>
                  <div class="title">
                    <span>可选项</span>
                  </div>
                  <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" :prop="'domains.' + index + '.value'" :rules="{
                              required: true, message: '输入不能为空', trigger: 'blur'}">
                    <el-input v-model="domain.value"></el-input>
                    <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancel('form')">取 消</el-button>
                  <el-button v-if="dialogStatus=='添加规格'" type="primary" :loading="addPropertyLoading" @click="createForm('form')">确 定</el-button>
                  <el-button v-else type="primary" @click="updateProperty('form')" :loading="addPropertyLoading">修 改</el-button>
                </div>
              </el-dialog>
              <el-tab-pane label="购物须知" name="six">
                  <span slot="label"><i class="icon-tongzhi icon-14"></i> 购物须知</span>
                  <QUE :text="purchaseNote" :editorId="editorId02" @editorChange="editorPurchaseNote"></QUE>
                  <el-row class="submit-good-desc" v-if="isHidden(formData.appId || currentAppId)">
                      <el-button size="small" type="primary" @click="submitPurchseNote">确定</el-button>
                  </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
import {
  getObj,
  addObj,
  putObj,
  addObjDesc,
  putObjDesc,
  addObjPrama,
  deleteObjPrama,
  getpropertyByCategoryId,
  getGoodsPic,
  delectGoodsPic,
  getObjPrama,
  addInventory,
  updateInventory,
  deleteInventory,
  propertyByProductNo,
  purchaseNote,
  upDatePurchaseNote,
  fetchFreightList
} from "@/api/product/goods";
import { agentGetColumns } from '@/api/agentProduct/index';
import { fetchCas } from "@/api/product/category";
import {
  fetchListProperty,
  getObjProperty,
  addObjProperty,
  putObjProperty,
  delObjProperty,
  delValProperty,
  getStoreName
} from "@/api/product/property";
import { fetchStoreInfoById } from "@/api/merchants/merchants"      //获取店铺信息
import QUE from "../../../components/quill.vue";
import { mapGetters, mapMutations } from "vuex";
import { isContained, getPropertyArr, isDudu, saveTwoDecimal, unique } from "@/util/util";
import { sortList } from "@/util/data";
import { productTypeList, productSourceList, descTypeList } from "@/util/data"
export default {
  name: "add",
  data() {
    return {
       //基本信息的弹出框
      tupian1: false,
      tupian2: false,
      tupian3: false,
      tupian4: false,
      //规格的弹出图片
      shangpin:
        "url(" + require("../../../assets/img/dudu/shangpin.png") + ")",
      activeName:'first',
      //参数的弹出图片
      canshu:
        "url(" + require("../../../assets/img/dudu/canshu.png") + ")",
      //规格的弹出图片
      guige:
        "url(" + require("../../../assets/img/dudu/guige.png") + ")",
      // //介绍的弹出图片
      jieshao:
        "url(" + require("../../../assets/img/dudu/jieshao.png") + ")",
      activeName:'first',
      id: "",
      editorId01: 1,
      editorId02: 2,
      checkedSpecifition: {},
      labelPosition: "right",
      baseUrl: "http://qiniu.edawtech.com/",
      defaultMsg: '',
      purchaseNote: '',
      productNo: '',
      uploadArg: {productNo: this.productNo,type: 'image'},
      goodSort: '其他',
      formData: {
        productName: "",
        spu: "",
        type: "",
        categoryId: "",
        contrastSource: "",           //对比来源
        coperatingOntrastSource: '',  //运营查看对比来源
        isRefueling: 'n',             //加油商品
        freightTemplateId: '',
        deliveryMode: [],
        storeId: '',
        courierMinNum: 1,
        courierMinAddNum: 1,
        logisticsMinNum: 1,
        addNum: 1,
      },
      tempDeliveryMode: [],
      deliveryModeList: [
        {code:"express",name:"普通快递"},
        {code:"logistics",name:"普通物流"},
        {code:"JDdistribution",name:"京东配送"},
        {code:"duduRider",name:"嘟嘟骑手"}
      ],
      idAddGood: true,
      tableData: [],
      paramTableData: [],
      isBenefitList: [{
        value: "y",
        label: "是"
      },{
        value: "n",
        label: "否"
      }],
      goodType: productTypeList,
      sourceList:productSourceList,
      options02: descTypeList,
      sortList: sortList,
      fileList: [],
      fileList02: [],
      goodPicList: [],
      options: [],
      currCategory: [],
      tempArr: [],
      specification: [],
      tableDataHeader:[],
      templ04:[
        {label:'零售价', prop: 'price'},
        {label:'对比零售价', prop: 'jdPrice'},
        {label:'库存数量', prop: 'number'},
        {label:'单品销售数量', prop: 'sku'},
        {label:'是否分润', prop: 'isBenefit'},
        {label:'分润金额', prop: 'benefit'},
        {label:'兑换价', prop: 'conversionPrice'},
        {label:'兑换购物券', prop: 'coupon'},
        {label:'兑换分润', prop: 'conversionBenefit'},
        {label:'商品图片', prop: 'imageUrl'},
      ],
      tableDataHeaderNew:[],
      inventoryTableData: [],
      tempInventoryTableData: [],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 400
      },
      param: "",
      paramValue: "",
      inputValue: "",
      property: [],
      propertyList: [],
      productProperties: [],
      productPropertyFilter: {},
      inventories: [],
      isAddProp: false,
      propCombinList: [],
      initPropertyData: [],
      appId: '',
      currentAppId: '',
      freightList: [],
      addType: '',
      tableIndex: null,
      dialogStatus: "",
      dialogFormVisible: false,
      propertyForm: {
        name: "",
        sort:0,
        propertyValues:[],
        values: []
      },
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      // textMap: {
      //   update: "编辑规格",
      //   create: "添加规格"
      // },
      propertyPane: false,
      linkCategoryId: '',
      addPropertyLoading: false,
      submitLoading: false,
      columnsList: [],
      // 下拉框数据
      status:1,         //请求下拉框数据时的参数
      // storeOptions: [],   //下拉框数据
      // loading: false,
      // storeId: '' ,        //下拉框选中店铺名id
      state:'',
      restaurants: []
    }
  },
  created() {
    this.productNo = this.$route.query.productNo;
    // this.appId = this.$route.query.appId;
    // this.id = this.$route.query.id;
    // this.idAddGood = true;
    // this.formData.categoryId = this.$route.query.categoryId;
    // if(isDudu(this.appId)){
    //   this.currentAppId = this.appId;
    // }else {
    //   //绑定多个appId必须有嘟嘟
    //   if(this.appIdList >= 2){
    //     this.currentAppId = 'dudu'
    //   }else {
    //     this.currentAppId = this.appIdList.length != 0 ? this.appIdList[0].appId : '';      
    //   }
    // }
    // this.getCategory();
    // if(this.id){
    //   this.getGoodInfo(this.id);
    // }
    this.getFreightList();
    this.getAgentCloumn();
  },
  watch: {
    'formData.categoryId': function(newVal, oldVal){ //监听分类ID是否变化
      if(newVal && oldVal){ //新值newVal不为空
        this.propertyPane = true;  //设置不可操作商品规格
      }
    }
    // 'formData.categoryId': function(newVal, oldVal){ //监听分类ID是否变化
    //   if(newVal && oldVal && this.linkCategoryId != oldVal){ //新值newVal不为空和初始IDlinkCategoryId不和旧值相等时
    //     this.propertyPane = true;  //设置不可操作商品规格
    //   }else if(newVal == this.linkCategoryId){
    //     this.propertyPane = false;  //设置可操作商品规格
    //   }
    // }
  },
  // filters: {
  //   saveDecimal(value){
  //     return saveTwoDecimal(value);
  //   },
  // },
  mounted(){
  },
  computed: {
    ...mapGetters('appId',{
        appIdList: 'appList'
    }),
  },
  methods: {
    // 搜索下拉框输入关键字请求店铺数据
     querySearchAsync(queryString, cb) {
       console.log(queryString)
        if(queryString !== '' && queryString !== undefined){
          this.restaurants = []
          setTimeout(() => {
            if(queryString.length > 1){
              var params = {appId:this.$route.query.appId,status:this.status,allUser:true,storeName:queryString};
              getStoreName(params).then((resp)=>{
                console.log(resp,'所属店铺')
                if(resp.data == ''){
                  this.state = '';
                  this.$notify({
                    title: '没有该店铺,请重新输入',
                    type: "error",
                    duration: 2000
                  });
                }
                resp.data.forEach(item => {
                  this.restaurants.push({
                    label: item.storeName,
                    value: item.storeName,
                    storeAddress: item.storeAddress,
                    id: item.id
                  })
                })
                cb(this.restaurants)
              }).catch(err => {
                console.log(err)
              })
            }else{
               this.restaurants.push({
                  label: '请输入至少两位'
               })
               cb(this.restaurants)
            }
          }, 500)
        }
      },
      // 选中下拉框数据时触发
      handleSelect(item) {
        console.log(item);
        this.state = item.value;
        this.formData.storeId = item.id;
      },
    // 根据storeId获取店铺名storeName
    getStoreInfoById(){
      let id = this.formData.storeId;
      if(id){
        fetchStoreInfoById(id).then((resp)=>{
          this.state = resp.data.storeName;
          this.formData.storeId = resp.data.id;
        })
      }
    },
    // // 所属店铺下拉框数据搜索
    // remoteMethod(query) {
    //     if (query !== '' && query !== undefined) {
    //       this.storeOptions = [];
    //       this.loading = true;
    //       if(query.length > 1){
    //         setTimeout(() => {
    //             var params = {appId:this.$route.query.appId,status:this.status,allUser:true,storeName:query};
    //               getStoreName(params).then((resp)=>{
    //                 console.log(resp,'所属店铺')
    //                 this.loading = false;
    //                 this.storeOptions = [];
    //                 resp.data.forEach(item => {
    //                   this.storeOptions.push({
    //                     label: item.storeName,
    //                     value: item.id,
    //                     storeAddress: item.storeAddress
    //                   })
    //                 })
    //               }).catch(err => {
    //                 console.log(err)
    //               })
    //         }, 300)
    //       }
    //    }else {
    //      this.storeOptions = [];
    //    }
    //   },
    async getFreightList(){
      const res = await fetchFreightList();
      this.freightList = [];
      res.data.forEach(item => {
        this.freightList.push({
          value: item.id,
          label: item.templateName
        })
      });
    },   
    async getAgentCloumn(){
      this.columnsList = [];
      const res = await agentGetColumns();
      res.data.forEach(item => {
        this.columnsList.push({
          label: item.columnName,
          value: item.id
        })
      });
    }, 
    saveDecimal(value){
      return saveTwoDecimal(value);
    },
    isHidden(appId){
      return isDudu(appId);
    },
    getCategory() {
      fetchCas(null).then(response => {
        console.log(response, "商品分类");
        this.options = response.data;
        this.currCategory.push(this.formData.categoryId);
        this.childrenEach(this.options, 0);
        this.handleChange(this.currCategory)
        //this.getGoodInfo(this.id);
      });
    },
    getGoodInfo(id) {
      getObj(id).then(res => {
        console.log("商品基本信息",res);
        this.status = res.data.status;
        this.appId = res.data.appId;
        res.data.postage = this.priceFilter(res.data.postage);
        res.data.costPrice = this.priceFilter(res.data.costPrice);
        res.data.wavePrice = this.priceFilter(res.data.wavePrice);
        res.data.unitPrice = this.saveDecimal(this.priceFilter(res.data.unitPrice || 0));
        res.data.contrastPrice = this.priceFilter(res.data.contrastPrice || 0);
        res.data.weight = res.data.weight ? res.data.weight : "1";
        res.data.volume = res.data.volume ? res.data.volume : "1";
        res.data.deliveryMode = this.filterDeliveryMode(JSON.parse(res.data.deliveryMode));
        // this.sortListFilter(res.data.type);
        this.goodSort = res.data.sort;
        this.formData = res.data;
        this.getStoreInfoById();        // 根据storeId获取店铺名storeName
        this.fileList = [];
        this.fileList.push({name:this.formData.picture.indexOf('http')==0 ? this.formData.picture : this.baseUrl+this.formData.picture, 
        url:this.formData.picture.indexOf('http')==0 ? this.formData.picture : this.baseUrl+this.formData.picture});
        // this.setProductNo({
        //   type: "SET_PRODUCTNO",
        //   productNo: this.formData.productNo
        // });
        this.productNo = this.formData.productNo;
        this.uploadArg.productNo = this.productNo;
        // console.log(this.formData.description,'defaultMsg')
        // this.defaultMsg = this.formData.description;     //商品介绍信息
        this.purchaseNote = this.formData.purchaseNote;
        this.getPics();  //获取商品图片信息
        this.getGoodsParmas();  //获取商品参数信息
      });
    },
    filterDeliveryMode(dataList){
      if(dataList && dataList.length != 0){
        let temp = [];
        dataList.forEach(item => {
          temp.push(item.code);
        })
        return temp;
      }else {
        return [];
      }
    },
    priceFilter(price){
      return price/10000
    },
    uploadSuccess(res, file) {
      this.formData.picture = res.imagePath;
    },
    onSwitch(e) {
    },
    async handleChange(value) { //根据分类id获取商品属性
      this.inventoryTableData = [];
      this.formData.categoryId = value[value.length - 1];
      let categoryId = this.formData.categoryId;
      getpropertyByCategoryId(categoryId, {productNo: this.productNo}).then(response => {
        this.specification = response.data;
        console.log(this.specification,'specification')
        this.initPropertyData = response.data;
        console.log(response.data,'初始化选中复选框');
        for(let i=0; i < response.data.length; i++){
            this.$set(this.checkedSpecifition, i, []) //在已经创建的实例上动态添加新的根级响应式属性
        }
        console.log(response, "获取规格");
      });
      if(this.formData.categoryId){
        if(this.id){
          getObj(this.id).then(res => {
            this.getPropertyByProductNo(res.data.productNo);  
          });
        }
      }
    },
    getPropertyByProductNo(productNo){
      let postData = {
        categoryId: this.formData.categoryId
      }
      propertyByProductNo(productNo, postData).then(res => {
        this.tempInventoryTableData = res.data.inventories;
        console.log(res.data.inventories, '获取商品规格库存');
        console.log(this.tempInventoryTableData, '保存商品规格库存');
        this.handlePropertyByProductNo(res.data.inventories);
      });
    },
    handlePropertyByProductNo(inventories){
      if(inventories.length != 0){
        let tempArr = [];
        let tempInventories = [];
        inventories.forEach((item, index) =>{
          tempArr = this.handleItemProperty(item.property);
          tempArr.forEach((item02, index02) => {
            item['property'+item02.name] = item02.value;
          });
        });
        inventories.forEach((item03, index03) => {
          let tempObj = {};
          for(let k in item03){
            tempObj[k] = item03[k]
            if(k == 'jdPrice' || k == 'price' || k == 'benefit' || k == 'conversionPrice' || k == 'coupon' || k == 'conversionBenefit'){
              tempObj[k] = item03[k]/10000
            }
          }
          tempInventories.push(tempObj);
        });
        
        //this.tableDataHeaderNew = this.templ04.concat(this.combinTableHeader(tempArr));
        let templHeaderData = []
        this.templ04.forEach((item, index) => {
          templHeaderData.push(item);
        });
        templHeaderData.unshift(...this.combinTableHeader(tempArr));
        this.tableDataHeaderNew = templHeaderData;
        this.inventoryTableData = tempInventories;
        console.log(this.inventoryTableData,'初始化表格数据');
        inventories.forEach((item04, index04) => {
          let tempObj = JSON.parse(item04.property);
          let tempIndex = 0;
          for(let k in tempObj){
            for(let i in this.checkedSpecifition){
              if(tempIndex == i){
                this.checkedSpecifition[i].push(k+','+tempObj[k]);
              }
              //this.checkedSpecifition[i].push(k+','+tempObj[k]);
            }
            tempIndex++
          }
        });
        console.log(this.checkedSpecifition,'初始化。。。');
        
        let checkedInventory = {};
        for(let k in this.checkedSpecifition){
          checkedInventory[k] = unique(this.checkedSpecifition[k]);
        }
        this.checkedSpecifition = checkedInventory;
        console.log(this.checkedSpecifition,'去重的checkedSpecifition');

        //给属性排序对应相应的属性，解决有些属性初始化不选中问题
        let finalRenderPropertyObj = {}
        this.initPropertyData.forEach((item, index) => {
          finalRenderPropertyObj[index] = [];
          for(let k in this.checkedSpecifition){
            if(this.checkedSpecifition[k].length != 0){
              if(item.id == this.checkedSpecifition[k][0].split(',')[0]){
                finalRenderPropertyObj[index] = this.checkedSpecifition[k]
              }
            }
          }
        });
        this.checkedSpecifition = finalRenderPropertyObj;
      }else {
        this.inventoryTableData = []; //如果没有已保存的规格时，清空未修改分类是的规格
      }
    },
    combinTableHeader(addArr){
      let temp = [];
      addArr.forEach((item, index) => {
        this.specification.forEach((item02, index02) => {
          if(item.name == item02.id){
            temp.push({
              prop: 'property' + item02.id,
              label: item02.name,
              change: '1'
            })
          }
        });
      });
      return temp;
    },
    handleItemProperty(property){
      let tempProperty = JSON.parse(property)
      let tempArr = [];
      for(let k in tempProperty){
        this.specification.forEach((item02, index02) => {
          if(k == item02.id){
            item02.values.forEach((item03, index03) => {
              if(tempProperty[k] == item03.id){
                tempArr.push({name: k,value: item03.value});
              }
            });
          }
        });
      };
      return tempArr;
    },
    // 保存按钮
    submit(formName) {
      this.formData.spu = parseInt(this.formData.spu);
      if(this.goodSort == '其他'){
        this.goodSort = '100'
      }
      this.formData.sort = parseInt(this.goodSort);
      this.formData.wavePrice = Number(this.formData.wavePrice);
      this.formData.logisticsMinNum = Number(this.formData.logisticsMinNum);
      this.formData.addNum = Number(this.formData.addNum);
      this.formData.courierMinNum = Number(this.formData.courierMinNum);
      this.formData.courierMinAddNum = Number(this.formData.courierMinAddNum);
      this.formData.unitPrice = Number(this.formData.unitPrice);
      this.formData.costPrice = Number(this.formData.costPrice);
      this.formData.contrastPrice = Number(this.formData.contrastPrice);
      this.formData.sku = Number(this.formData.sku);
      this.formData.postage = Number(this.formData.postage);
      this.tempDeliveryMode = this.formData.deliveryMode;
      if(this.formData.deliveryMode.length !== 0 ){
        console.log(this.formData.deliveryMode,'运送方式')
        let temp = [];
        this.formData.deliveryMode.forEach(item => {
          if(item == 'express'){
            temp.push({code: 'express', name: '普通快递'});
          }else if(item == 'logistics'){
            temp.push({code: 'logistics', name: '普通物流'});
          }else if(item == 'JDdistribution'){
            temp.push({code: 'JDdistribution', name: '京东配送'});
          }else if(item == 'duduRider'){
            temp.push({code: 'duduRider', name: '嘟嘟骑手'});
          }
        });
        if(temp.length == 0 ){
          temp.push({code: 'logistics', name: '普通物流'});
        }
        this.formData.deliveryMode = JSON.stringify(temp);
      }

      if (this.idAddGood) {
        if(!this.id){
          console.log('添加');
          this.appId = this.currentAppId;

          this.formData.appId = this.currentAppId;
          this.addOrPutObj(addObj);
        }else {
          console.log('修改',this.formData);
          this.addOrPutObj(putObj);
        }
      } else {
        this.addOrPutObj(putObj);
      }
    },
    changeSort(e){
      this.formData.sort = e;
    },
    selectSource(value){
      this.formData = Object.assign({},this.formData,{contrastSource: value})
    },
    // 运营查看对比来源
    selectOntrastSource(value){
      this.formData = Object.assign({},this.formData,{coperatingOntrastSource: value})
    },
    changeDeliveryMode(value){
      console.log(value,'value');
      console.log(this.formData.deliveryMode,'this.formData.deliveryMode');
      // this.formData = Object.assign({}, this.formData);
    },
    handleFeight(id){
      this.$router.push({
        path: '/freight/add',
        query: {
          id: id
        }
      })
    },
    addOrPutObj(addOrPut, type) {
      let postData = {}
      this.submitLoading = true;
      console.log(this.formData)
      addOrPut(this.formData).then(response => {
        console.log(response)
        this.submitLoading = false;
        if(!this.productNo && (response.data.msg != '参数有误')){
          this.productNo = JSON.parse(response.data.msg).productNo;
          this.formData.id = JSON.parse(response.data.msg).productId;
          this.$notify({
            title: '添加成功',
            message: response.statusText,
            type: "success",
            duration: 2000
          });
        }else {
          this.$notify({
            title: response.data.msg,
            message: response.statusText,
            type: "success",
            duration: 2000
          });
        }
        this.propertyPane = false; //设置可操作商品规格
        this.getPropertyByProductNo(this.productNo); //修改商品信息后重新获取商品属性
        this.formData.deliveryMode = this.tempDeliveryMode;
        if(response.data.msg != '参数有误'){
          this.idAddGood = false;
        }
      });
    },
    // ...mapMutations({
    //   setProductNo: "SET_PRODUCTNO"
    // }),
    selectGoodType(e){
      // this.sortListFilter(e);
    },
    // sortListFilter(e){
    //   switch(e){
    //     case 0:
    //       this.sortList = this.welfare
    //       break;
    //     case 1:
    //       this.sortList = this.choice
    //       break;
    //     case 2:
    //       this.sortList = this.recommend
    //       break;
    //   }
    // },
    handleRemove() {},
    handlePreview() {},
    //商品介绍
    editorChange (html) { //富文本编辑器,自定义事件
      this.defaultMsg = html
    },
    editorPurchaseNote(html){
      this.purchaseNote = html
    },
    submitGoodsDesc() {
      let postData = {
        productNo: this.productNo,
        description: this.defaultMsg,
        appId: this.currentAppId
        //description: this.defaultMsg
      };
      console.log(postData,'商品描述');
      if (this.formData.description) {
        this.changeGoodsDesc(postData);
      } else {
        this.addGoodsDesc(postData);
      }
    },
    submitPurchseNote(){
      let postData = {
        productNo: this.productNo,
        purchaseNote: this.purchaseNote,
        appId: this.currentAppId
        //description: this.defaultMsg
      };
      console.log(postData,'商品描述');
      if (this.formData.purchaseNote) {
        upDatePurchaseNote(postData).then(res => {
          this.handleTip(res.statusText,res.data.msg);
        });
      } else {
        purchaseNote(postData).then(res => {
          this.handleTip(res.statusText,res.data.msg);
        });
      }
    },
    addGoodsDesc(postData) {
      addObjDesc(postData).then(response => {
        this.handleTip(response.statusText,response.data.msg);
      });
    },
    changeGoodsDesc(postData) {
      putObjDesc(postData).then(response => {
        this.handleTip(response.statusText,response.data.msg);
      });
    },
    //商品图片
    handleBannerbefore(file) {
      // console.log(file,'before')
      let type = file.raw.type.split('/')[0];
      this.uploadArg.productNo = this.productNo;
      this.uploadArg.type = type;
    },
    uploadBannerSuccess(res,file) {
      console.log(res,file,'kkk')
      let type = file.raw.type.split('/')[0];
      this.tableData.push({
        name: this.baseUrl + res.imagePath,
        url: this.baseUrl + res.imagePath,
        type: type
      });
      console.log(this.tableData,'tu')
      this.handleTip('OK', '添加成功');
    },
    deleteRow(index, row) {
      if (row.specName) {
        //删除商品参数
        this.paramTableData.splice(index, 1);     
        deleteObjPrama(row.id).then(res => {
          this.handleTip(res.statusText, res.data.msg);
        });
      } else {
        //删除商品图片
        delectGoodsPic(row.id).then( res => {
          this.handleTip(res.statusText, res.data.msg);
        });
        this.tableData.splice(index, 1);
      }
    },
    getPics(){
      getGoodsPic(this.productNo).then((res) => {
        console.log(res,'轮播图')
        this.tableData = [];
        res.data.forEach((item, index) => {
          this.tableData.push({name: item.imageUrl, url: item.videoType == 'image' ? item.imageUrl : item.videoUrl, id: item.id, type: item.videoType ? item.videoType : 'image'});
        });
      })
    },
    //商品参数
    getGoodsParmas(){
      getObjPrama(this.productNo).then((res) => {
        this.paramTableData = [];
        res.data.forEach((item, index) => {
          this.paramTableData.push({
            id: item.id,
            productNo: item.productNo,
            specName: item.specName,
            specValue: item.specValue
          });
        });
      });
    },
    handleClose(scope, tag) {
      scope.row.specValue.splice(scope.row.specValue.indexOf(tag), 1);
    },
    addParam() {
      let postData = [{
        productNo: this.productNo,
        specName: this.param,
        specValue: this.paramValue
      }]
      addObjPrama(postData).then(res => {
        this.$notify({
          title: res.data.data ? '成功' : '失败',
          message: res.data.msg,
          type: res.data.data ? 'success' : 'error',
          duration: 2000
        });
        if(res.data.data){
          this.param = '';
          this.paramValue = '';
        }
        this.getGoodsParmas();
      });
    },
    handleTip(statusText,msg){
      this.$notify({
        title: statusText,
        message: msg,
        type: "success",
        duration: 2000
      });
    },
    childrenEach(childrenData, depthN) {
      let depth = 0;
      for (var j = 0; j < childrenData.length; j++) {
        depth = depthN; // 将执行的层级赋值 到 全局层级

        this.tempArr[depthN] = childrenData[j].value;

        if (childrenData[j].value == this.currCategory) {
          this.currCategory = this.tempArr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
          break;
        } else {
          if (childrenData[j].hasOwnProperty("children")) {
            depth++;
            this.childrenEach(childrenData[j].children, depth);
          }
        }
      }
    },
    //商品规格
    checkInList(){
      console.log(this.checkedSpecifition,'选择的元素列表');
      this.propertyList = [];
      for(let k in this.checkedSpecifition){
        this.propertyList = this.propertyList.concat(this.checkedSpecifition[k]);
      }
      console.log(this.propertyList,'选中的属性列表');
      this.getProductProperties();
      this.getProductPropertyFilter();
      this.getInventories();
      this.tableHeaderFilter();
      this.getpropertyList();
    },
    tableHeaderFilter(){
       this.addInventoryTableData();
    },
    getpropertyList(){
      let templ = [];
      let templ2 = {};
      let templ3 = [];
      this.propertyList.forEach((item, index) => {
        templ.push({prop: item.split(',')[0],name: item.split(',')[1]});
      });
      templ.forEach((item02, index02)=> {
        if(item02.prop in templ2){
          templ2[item02.prop].push(item02.prop+','+item02.name);
        }else {
          templ2[item02.prop] = [item02.prop+','+item02.name]
        }
      });
      //console.log(templ2,'属性列表');
      //console.log(this.propCombin(templ2),'单条数据属性');
      this.propCombinList = this.propCombin(templ2);
      //console.log(this.propCombinList,'拼接好的规格参数');
      if(this.propCombinList.length != 0){
        this.inventoryTableData = [];
        this.convertPropCombinAll().forEach((item, index) => {
          let tempObj = {
            price: '',
            jdPrice: '',
            number: '',
            sku: '',
            benefit: '',
            isBenefit: '',
          };
          item.forEach((item02, index02) => {
            tempObj['property'+item02.split('#')[0]] = item02.split('#')[1]
          });
          this.inventoryTableData.push(tempObj);
        });
        //console.log(this.tempInventoryTableData,'已上传数据');
        //console.log(this.inventoryTableData,'未处理表单数据');
        
        this.tempInventoryTableData.forEach((item, index) => {
          let temp = getPropertyArr(item);
          for(let k2 in this.inventoryTableData){
            let temp2 = getPropertyArr(this.inventoryTableData[k2]);
            if(temp2.length > temp.length){
              if(isContained(temp2,temp)){
                this.inventoryTableData[k2].benefit = item.benefit/10000;
                this.inventoryTableData[k2].isBenefit = item.isBenefit;
                this.inventoryTableData[k2].jdPrice = item.jdPrice/10000;
                this.inventoryTableData[k2].number = item.number;
                this.inventoryTableData[k2].price = item.price/10000;
                this.inventoryTableData[k2].property = item.property;
                this.inventoryTableData[k2].productNo = item.productNo;
                this.inventoryTableData[k2].sku = item.sku;
                this.inventoryTableData[k2].id = item.id;
                this.inventoryTableData[k2].conversionPrice = item.conversionPrice/10000;
                this.inventoryTableData[k2].conversionBenefit = item.conversionBenefit/10000;
                this.inventoryTableData[k2].coupon = item.coupon/10000;
                this.inventoryTableData[k2].imageUrl = item.imageUrl;
                break;
              }
            }else {
              if(isContained(temp,temp2)){
                this.inventoryTableData[k2].benefit = item.benefit/10000;
                this.inventoryTableData[k2].isBenefit = item.isBenefit;
                this.inventoryTableData[k2].jdPrice = item.jdPrice/10000;
                this.inventoryTableData[k2].number = item.number;
                this.inventoryTableData[k2].price = item.price/10000;
                this.inventoryTableData[k2].property = item.property;
                this.inventoryTableData[k2].productNo = item.productNo;
                this.inventoryTableData[k2].sku = item.sku;
                this.inventoryTableData[k2].id = item.id;
                this.inventoryTableData[k2].conversionPrice = item.conversionPrice/10000;
                this.inventoryTableData[k2].conversionBenefit = item.conversionBenefit/10000;
                this.inventoryTableData[k2].coupon = item.coupon/10000;
                this.inventoryTableData[k2].imageUrl = item.imageUrl;
                break;
              }
            }
          }
        });
        //console.log(this.tableDataHeaderNew, '最终表格表头');
        console.log(this.inventoryTableData,'最终渲染的表格数据');
      }
    },
    convertPropCombin(tempStr){
      let tempArr = [];
      let saveArr = [];
      if(tempStr.indexOf(";") != -1){
        tempArr = tempStr.split(';');
      }else {
        tempArr.push(tempStr)
      }
      tempArr.forEach((item, index) => {
        this.specification.forEach((item02, index02) => {
          if(item.split(',')[0] == item02.id){
            item02.values.forEach((item03, index03) => {
              if(item.split(',')[1] == item03.id){
                saveArr.push(item02.id+'#'+item03.value);
              }
            });
          }
        });
      });
      return saveArr;
    },
    convertPropCombinAll(){
      let tempArr = [];
      this.propCombinList.forEach((item, index) => {
        tempArr.push(this.convertPropCombin(item));
      });
      //console.log(this.propCombinList,'====');
      return tempArr;
    },
    propCombin(tempArr){
      var count = 0;
      var list = [];
      var arrAll = []; 
      for(let k in tempArr){
        arrAll.push(tempArr[k]);
      };
      console.log(arrAll, '所有数组');
      const cartesian = (arr1, arr2, index) =>{  //多维数组笛卡尔乘积算法实现
        if (index < arrAll.length) {
          var result = [];
          var i;
          for (i = 0; i < arr1.length; i++) {
              var j;
              for (j = 0; j < arr2.length; j++) {
                  result.push(arr1[i] +';'+ arr2[j]);//把数组的元素组合成一个新的元素，如果是对象
              }
          }
          list=result;
          cartesian(result, arrAll[index + 1], index + 1);
        }
      }
      if(arrAll.length >= 2){  
        cartesian(arrAll[0], arrAll[1], 1);
        console.log(list,'多条数据');
        return list;
      }else {
        console.log(arrAll[0],'只有一条数据');
        return arrAll[0];
      }
    },
    addInventoryTableData(){
      let temp03 = [];
      console.log(this.propertyList,'111');
      console.log(this.specification,'222');
      this.propertyList.forEach((item02, index02) => {
        this.specification.forEach((item, index) => {
          if(item02.split(',')[0] == item.id){
            //判断表头是否有该属性
            if(temp03.length != 0){
              for(let k in temp03) {
                if(temp03[k].prop == 'property'+item.id){
                  this.isAddProp = true;
                  break;
                }else {
                  this.isAddProp = false;
                }
              }
            }else {
              this.isAddProp = false;              
            }
            if(!this.isAddProp){
              temp03.push({
                label: item.name, 
                prop: 'property'+item.id,
                change: '1'
              });
            }
          }
        });
      });
      //this.tableDataHeaderNew = this.templ04.concat(temp03);
      let templHeaderData = [];
      this.templ04.forEach((item, index) => {
          templHeaderData.push(item);
      });
      templHeaderData.unshift(...temp03);
      this.tableDataHeaderNew = templHeaderData;
    },
    getPropValue(propValue){
      let prop = propValue.split(',')[0];
      let value = propValue.split(',')[1];
      this.specification.every((item, index) => {
        if(prop == item.id){
          item.values.every((item02, index02) => {
            if(value == item02.id){
              temp = item02.value;
            }
          });
        }
      });
      return temp;
    },
    getProductProperties(){
      this.productProperties = [];
      this.propertyList.forEach((item, index) => {    
        this.productProperties.push({
          productNo: this.productNo,
          propertyName: item.split(',')[0],
          propertyValue: item.split(',')[1]
        });
      });
      //console.log(this.productProperties,'参数：productProperties');
    },
    getProductPropertyFilter(){
      this.property = [];
      this.productPropertyFilter = {};
      this.propertyList.forEach((item, index) => {
        this.property.push(parseInt(item.split(',')[1]));
      });
      this.productPropertyFilter = {
        productNo: this.productNo,
        property: this.property
      }
      //console.log(this.productPropertyFilter,'参数：productPropertyFilter');
    },
    getInventories(){
      let property = {};
      this.propertyList.forEach((item, index) => {
        property['"'+item.split(',')[0]+'"'] = item.split(',')[1]
      });
      this.inventories = [{
        productNo: this.productNo,
        property: property,
        price:"5000",
        jdPrice:"6600",
        number:7000,
        sku:800,
        benefit:"800",
        isBenefit:"y"
      }]
      //console.log(property, '参数：inventories');
    },
    submitPropertyList(){
      let tempSubmitData = this.handleCheckedData();
      // tempSubmitData.forEach(item => {
      //   item.appId = this.appId;
      // });
      console.log(tempSubmitData,'增加商品规格库存参数');
      if(tempSubmitData.length>0 && !tempSubmitData[0].appId){
        tempSubmitData.forEach(item => {
          item.appId = this.currentAppId;
        });
      }
      updateInventory(tempSubmitData).then(res => {
        this.handleTip(res.statusText, res.data.msg);
        this.getPropertyByProductNo(this.productNo);
      });
    },
    handleCheckedData(){ //处理选中的数据用于添加商品规格
      let tempSubmitData = [];
      let tempArr = [];
      let stringifyTempArr = [];    
      this.inventoryTableData.forEach((item, index) => {
        tempSubmitData.push({
          productNo: this.productNo,
          benefit: item.benefit,
          isBenefit: item.isBenefit,
          number: parseInt(item.number),
          jdPrice: item.jdPrice,
          price: item.price,
          sku: parseInt(item.sku),
          id: item.id || null,
          property: item.property,
          appId: item.appId,
          conversionPrice: item.conversionPrice,
          conversionBenefit: item.conversionBenefit,
          coupon: item.coupon,
          imageUrl: item.imageUrl
        });
      });
      // console.log(this.inventoryTableData, 'this.inventoryTableData00000000000000000000');
      this.propCombinList.forEach((item, index) => {
        if(item.indexOf(";") != -1){
          let tempObj = {};
          item.split(';').forEach((item02, index02) => {
            tempObj[item02.split(',')[0]] = item02.split(',')[1];
          });
          tempArr.push({
            ...tempObj
          })
        }else {
          let tempObj = {}
          tempObj[item.split(',')[0]] = item.split(',')[1];
          tempArr.push(tempObj)
        }
      });
      tempArr.forEach((item, index) => {
        stringifyTempArr.push(JSON.stringify(item))
      });
      tempSubmitData.forEach((item, index) => {
        stringifyTempArr.forEach((item02, index02) => {
          if(index == index02){
            item.property = item02
          }
        });
      });
      console.log(tempSubmitData,'处理过的勾选中的数据');
      return tempSubmitData;
    },
    updateInventory(index, row){
      let postDataArr = [];
      let postData = {
        benefit: row.benefit,
        id: row.id,
        isBenefit: row.isBenefit,
        jdPrice: row.jdPrice,
        number: row.number,
        price: row.price,
        productNo: row.productNo,
        sku: row.sku,
        property: row.property
      }
      postDataArr.push(postData)
      console.log(postDataArr,'修改规格库存参数');
      updateInventory(postDataArr).then(res => {
        this.handleTip(res.statusText,res.data.msg);
      });
    },
    handelDeleteInventory(index, row){
      this.$alert('你确定删除该商品规格库存', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){
            deleteInventory(row.id).then(res => {
              if(res.data.data){
                this.handleTip('成功',res.data.msg);
                this.delCheckedProperty(this.checkedSpecifition,row);
                this.inventoryTableData.splice(index,1);
                updateInventory(this.inventoryTableData).then(res => {
                  this.handleTip(res.statusText, res.data.msg);
                  this.getPropertyByProductNo(this.productNo);
                });
              }else {
                this.$notify({
                  title: '失败',
                  message: msg,
                  type: "error",
                  duration: 2000
                });
              }
            });
          }
          
          // this.inventoryTableData.splice(index,1);
          // updateInventory(this.inventoryTableData).then(res => {
          //   this.handleTip(res.statusText, res.data.msg);
          //   //this.getPropertyByProductNo(this.productNo);
          // });
        }
      });
    },
    delCheckedProperty(arr, row){ //删除规格规格数据时删除选中的规格
      for(var k in arr){
        arr[k].forEach((item, index) => {
          if(item.split(',')[1] == JSON.parse(row.property)[item.split(',')[0]]){
            arr[k].splice(index, 1);
          }
        });
      }
    },
    uploadPropertyPicSuccess(res, file){
      this.fileList02 = [];
      if(file.status === 'success'){
        this.inventoryTableData.forEach((item, index) => {
          console.log(index == this.tableIndex,'index == this.tableIndex');
          if(index == this.tableIndex){ //根据下标给 imageUrl 赋值
            item.imageUrl = res.imagePath
            console.log(this.tableIndex,'this.tableIndex');
          }
        })
      }
      console.log(this.inventoryTableData,'uploadPropertyPicSuccess');
    },
    getTableIndex(index){ //获取表格的下标
      this.tableIndex = index;
    },
    deletePic(tableIndex){
      this.inventoryTableData.forEach((item, index) => {
        if(index == tableIndex){
          item.imageUrl = "";
          this.$set(this.inventoryTableData, index, item)
        }
      })
      console.log(tableIndex,'tableIndex');
      console.log(this.inventoryTableData,'deletePic');
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    // 取消
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    // 确定
    createForm(formName) {
      this.getPropertyValues();
      this.propertyForm.categoryId = this.formData.categoryId;
      this.propertyForm.sort = 0;
      this.addPropertyLoading = true;
      let tempArr = [];
      this.propertyForm.propertyValues.forEach((item, index) => {
        if(item){
          tempArr.push(item);
        }
      });
      this.propertyForm.propertyValues = tempArr;
      addObjProperty(this.propertyForm).then((res) => {
        this.addPropertyLoading = false;
        this.dialogFormVisible = false;
        this.$notify({
          title: res.data.data ? '成功' : '失败',
          message: res.data.msg,
          type: res.data.data ? "success" : "error",
          duration: 2000
        });
        if(res.data.data){
          this.handleChange(this.currCategory)
        }
      });
    },
    getPropertyValues(){
      const arr = [];
      this.dynamicValidateForm.domains.forEach(val => {
        arr.push(val.value);
      });
      this.propertyForm.propertyValues = arr;
    },
    // 修改
    updateProperty(formName){
      let tempValues = [];
      this.dynamicValidateForm.domains.forEach((item, index) => {
        if(item.value){
          tempValues.push({
            id: item.id || null,
            value: item.value
          });
        }
      });
      this.propertyForm.values = tempValues;
      this.propertyForm.categoryId = this.formData.categoryId;
      this.propertyForm.propertyValues = null;
      this.propertyForm.sort = 0;
      this.addPropertyLoading = true;
      putObjProperty(this.propertyForm).then((res) => {
        this.addPropertyLoading = false;
        this.dialogFormVisible = false;
        this.$notify({
          title: res.data.data ? '成功' : '失败',
          message: res.data.msg,
          type: res.data.data ? "success" : "error",
          duration: 2000
        });
        if(res.data.data){
          this.handleChange(this.currCategory)
        }
      });
    },
    handleEditorProperty(row){
      console.log(row,'row')
      this.dialogFormVisible = true;  
      let tempArr = [];
      row.values.forEach((item, index) => {
        tempArr.push({
          id: item.id,
          value: item.value
        });
      });
      this.propertyForm.values = tempArr;
      this.propertyForm.name=row.name;
      this.propertyForm.id=row.id;
      this.dynamicValidateForm.domains=row.values;
      this.propertyForm.categoryId=row.categoryId;
      this.propertyForm.sort = row.sort;
      this.dialogStatus = "编辑规格";
    },
    resetForm() {
      this.dynamicValidateForm={
        domains: [
          {
            value: ""
          }
        ]
      };
      this.propertyForm = {
        permission: undefined,
        name: undefined,
        categoryId:undefined,
        parent: this.currentId,
        url: undefined,
        icon: undefined,
        component: undefined,
        type: undefined,
        method: undefined
      };
    },
    //添加规格
    handleCreateProperty() {
      console.log('点击')
      this.dialogFormVisible = true;
      console.log(this.dialogFormVisible,'显示')
      this.resetForm();
      console.log('1')
      this.dialogStatus = "添加规格";
      console.log(this.dialogStatus,'2')
    },
    removeDomain(item) {
      this.$alert('此操作将永久删除！', '删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){   
            delValProperty(item.id).then(res => {
              if(res.data.data){
                this.handleChange(this.currCategory);
                var index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                  this.dynamicValidateForm.domains.splice(index, 1);
                }
              }
              this.$notify({
                title: res.data.data ? '成功' : '失败',
                message: res.data.msg,
                type: res.data.data ? "success" : "error",
                duration: 4000
              });
            });
          }
        }
      });
    },
    deleteProperty(item){
      this.$alert('请看清楚需要删除的项，避免误删。', '删除商品规格！', {
        confirmButtonText: '确定',
        callback: action => {
          if(action == 'confirm'){
            if(item.id){
              delObjProperty(item.id).then(res => {
                if(res.data.data){
                  this.handleChange(this.currCategory)
                }
                this.$notify({
                  title: res.data.data ? '成功' : '失败',
                  message: res.data.msg,
                  type: res.data.data ? "success" : "error",
                  duration: 2000
                });
              });
            }else {
              this.$notify({
                title: "失败",
                message: "id为空",
                type: "error",
                duration: 2000
              });
            }
          }
        }
      }); 
    },
    // 点击导航栏
    onTabClick({index}){
      console.log(index,'index');
      if(index == 1){
        // console.log(this.formData.description,'defaultMsg')
        this.defaultMsg = this.formData.description;     //商品介绍信息
      }
    },
    beforeLeave(activeName, oldActiveName) { //监听标签页点击事件
      if(this.productNo){
        if(activeName == 'five'){
          if(this.propertyPane){
            this.$message({
              message: '您已修改了所属分类，请先保存商品基本信息',
              type: 'warning',
              duration: 5000
            });
            return false;
          }
        } else {
          return true;
        }
      }else {
        this.$message({
          message: '请先保存商品基本信息',
          type: 'warning',
          duration: 5000
        });
        return false;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log(to,'to')
    next(vm => {
      vm.appId = to.query.appId;
      vm.id = to.query.id;
      vm.idAddGood = true;
      vm.formData.categoryId = to.query.categoryId;
      vm.linkCategoryId = to.query.categoryId; //获取保存链接上的categoryId
      vm.addType = to.query.type;
      //判断当前用户绑定的app有没有 嘟嘟应用
      if(isDudu(vm.appId)){
        vm.currentAppId = vm.appId;
      }else {
        //绑定多个appId必须有嘟嘟
        if(vm.appIdList >= 2){
          vm.currentAppId = 'dudu'
        }else {
          vm.currentAppId = vm.appIdList.length != 0 ? vm.appIdList[0].appId : '';      
        }
      }
      vm.getCategory();
      if(vm.id){
        vm.getGoodInfo(vm.id);
      }
    });
  },
   //弹出框事件
    handleClose(done) {
          done();
       
    },
  components: { QUE }
};

</script>

<style scoped lang="scss">
.fuck .el-select{
  width: 90%;
}
.container {
  padding: 20px 30px;
}
.good-submit .el-button {
  position: absolute;
  right: 50px;
  bottom: 20px;
}
.submit-good-desc {
  margin-top: 20px;
  background-color: #e4e7ed;
  border-radius: 5px;
}
.submit-good-desc .el-button {
  margin: 8px 0 8px 150px;
}
.addParam {
  background-color: #e4e7ed;
  padding: 8px;
  border-radius: 5px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.ql-editor{
  background-color: red!important;
}
.p-table .el-checkbox{
  display: inline-block!important;
}
.property-dialog{
  .title {
    width: 50%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    padding-left: 100px;
  }
  .el-input,
  .el-cascader,
  .el-input-number {
    width: 280px;
  }
  .search-add{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .filter-item{
    margin-bottom: 0;
    margin-right: 10px;
  }
}
.icon-14{
  font-size:14px!important;
}
//图片的大小
.tupian1{
                width: 863px;
                height: 1277px; 
                display: inline-block; 
                margin-top: 18px;
                // @include bg-image-jpg('wechat-pic');
                background-size: 863px 1277px;
                background-repeat: no-repeat;
            }
.tupian2{
                width: 765px;
                height: 831px; 
                display: inline-block; 
                margin-top: 18px;
                // @include bg-image-jpg('wechat-pic');
                background-size: 765px 831px;
                background-repeat: no-repeat;
            }
.tupian3{
                width: 1291px;
                height: 1415px; 
                display: inline-block; 
                margin-top: 18px;
                // @include bg-image-jpg('wechat-pic');
                background-size: 1291px 1415px;
                background-repeat: no-repeat;
            }
.tupian4{
                width: 746px;
                height: 8063px; 
                display: inline-block; 
                margin-top: 18px;
                // @include bg-image-jpg('wechat-pic');
                background-size: 746px 8063px;
                background-repeat: no-repeat;
            }
/* 更改element-UI按钮样式 */
.miniBTN{
  border: none;
}
.upload-demo{
  width: 100%;
}
</style>
