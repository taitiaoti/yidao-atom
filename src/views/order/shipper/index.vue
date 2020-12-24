<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button v-if="ord_shipper_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加
            </el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row style="width: 100%">
            <el-table-column align="center" label="ID">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="物流公司">
                <template slot-scope="scope">
                    <span>{{ scope.row.shipperName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="英文简称">
                <template slot-scope="scope">
                    <span>{{ scope.row.shipperCode }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button v-if="ord_shipper_upd" size="small" type="success"
                               @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="ord_shipper_del" size="mini" type="danger"
                               @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="物流公司" prop="shipperName">
                        <el-input v-model="form.shipperName" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="英文简写" prop="shipperCode">
                        <el-input v-model="form.shipperCode" placeholder=""></el-input>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')">修 改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList,getObj, addObj, putObj, delObj } from "@/api/order/shipper";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { mapGetters } from "vuex";

export default {
  name: "table_t_shipper",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      rules: {},
      form: {
        id:"",
        shipperName:"",
        shipperCode:""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      ord_shipper_add: false,
      ord_shipper_upd: false,
      ord_shipper_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.ord_shipper_add = this.permissions["ord_shipper_add"];
    this.ord_shipper_upd = this.permissions["ord_shipper_upd"];
    this.ord_shipper_del = this.permissions["ord_shipper_del"];
  },
  methods: {
    getList() {
      this.resetForm();
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.shipperName = row.shipperName;
      this.form.shipperCode = row.shipperCode;
    },
    handleDelete(row) {
      this.$alert('你确定删除该项？', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if(action === 'confirm'){
            if(row.id){
              delObj(row.id).then(response => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
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
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.form={
        id:"",
        shipperName:"",
        shipperCode:""
      }
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
