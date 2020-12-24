<template>
  <!-- 店铺订单管理 -->
  <div class="storeOrder">
    <div class="filter-container">
      <el-input
        v-model="searchObj.storeName"
        style="width: 200px; margin-bottom: 10px"
        prefix-icon="el-icon-search"
        placeholder="请输入订单号"
      ></el-input>
      <el-input
        v-model="searchObj.storeNo"
        style="width: 200px; margin-bottom: 10px"
        prefix-icon="el-icon-search"
        placeholder="请输入所属用户"
      ></el-input>
      <el-input
        v-model="searchObj.storeNo"
        style="width: 200px; margin-bottom: 10px"
        prefix-icon="el-icon-search"
        placeholder="请输入关联的嘟嘟用户号"
      ></el-input>
      <el-input
        v-model="searchObj.storeNo"
        style="width: 200px; margin-bottom: 10px"
        prefix-icon="el-icon-search"
        placeholder="请输入店铺名称"
      ></el-input>
      <div class="s-category">
        <el-select
          v-model="searchObj.payType"
          placeholder="请选择收款渠道"
        >
          <el-option
            v-for="item in payType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-input
        v-model="searchObj.storeNo"
        style="width: 200px; margin-bottom: 10px"
        prefix-icon="el-icon-search"
        placeholder="请输入用户手机号"
      ></el-input>
      <div class="s-category">
        <el-select
          v-model="searchObj.payType"
          placeholder="请选择支付类型"
        >
          <el-option
            v-for="item in payType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="s-time">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectTime"
        >
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="search"
        >搜索</el-button
      >
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="orderList"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属用户">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺关联的嘟嘟用户手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款渠道">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付用户手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原价">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="合计优惠（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台服务费（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实付金额">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.storeNo }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchObj: {
        storeName: '',
        storeNo: '',
        payType: ''
      },
      payType: [

      ],
      time: '',
      orderList: [],
      listLoading: false
    }
  },
  methods: {
    // 搜索
    search(){

    },
    selectTime(){

    }
  }
};
</script>

<style lang='scss' scoped>
  .s-category {
    width: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .s-time {
    width: 400px;
    margin-right: 10px;
    display: inline-block;
  }
</style>