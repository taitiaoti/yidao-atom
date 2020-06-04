`<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="proManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" v-if="proManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
        <el-button type="primary" v-if="proManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="8" style='margin-top:15px;'>
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="getNodeData"
        >
        </el-tree>
      </el-col>
      <el-col :span="16" style='margin-top:15px;'>
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="父级节点" prop="parent">
              <el-input v-model="form.parent" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj
} from "@/api/product/category";
import { mapGetters } from "vuex";
export default {
  name: "category",
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      methodOptions: ["GET", "POST", "PUT", "DELETE"],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      labelPosition: "right",
      form: {
        name: undefined,
        parent: undefined,
        id: undefined
      },
      currentId: 0,
      proManager_btn_add: false,
      proManager_btn_edit: false,
      proManager_btn_del: false
    };
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        0: "菜单",
        1: "按钮"
      };
      return typeMap[type];
    }
  },
  created() {
    this.getList();
    this.proManager_btn_add = this.permissions["pro_category_add"];
    this.proManager_btn_edit = this.permissions["pro_category_edit"];
    this.proManager_btn_del = this.permissions["pro_category_del"];
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        console.log(response);
        this.treeData = response.data;
        console.log(this.treeData,'this.treeData');
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      this.showElement = true;
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false;
        this.formStatus = "update";
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = "create";
    },
    handleDelete() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    update() {
      putObj(this.form).then(() => {
        this.getList();
        this.$notify({
          title: "成功",
          message: "更新成功",
          type: "success",
          duration: 2000
        });
      });
    },
    create() {
      addObj(this.form).then(() => {
        this.getList();
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = "";
    },
    resetForm() {
      this.form = {
        permission: undefined,
        name: undefined,
        parent: this.currentId,
        url: undefined,
        icon: undefined,
        component: undefined,
        type: undefined,
        method: undefined
      };
    }
  }
};
</script>

