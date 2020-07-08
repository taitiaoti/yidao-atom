<template>
  <div class="login-container pull-height" @keyup.enter.native="handleLogin">
    <!-- <div class="login-info text-white animated fadeInLeft">
      <h2 class="login-info-title">{{website.info.title}}</h2>
      <ul class="login-info-list">
        <li class="login-info-item" v-for="(item,index) in website.info.list" :key="index">
          <i class="el-icon-check"></i>&nbsp;{{item}}
        </li>
      </ul>
    </div> -->
    <div class="login-border  animated fadeInRight">
      <div class="login-main">
        <!-- <h4 class="login-title"> 嘟嘟商城后台
          <top-theme></top-theme>
        </h4> -->
        <div class="pane-header">

        </div>
        <div class="pane-wrapper">
          <el-tabs v-model="activeName" @tab-click="clickTab">
            <el-tab-pane label="用户密码" name="user">
              <userLogin></userLogin>
            </el-tab-pane>
            <el-tab-pane label="短信验证码" name="code">
              <codeLogin></codeLogin>
            </el-tab-pane>
            <!-- <el-tab-pane label="第三方授权登录" name="third">
              <thirdLogin></thirdLogin>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import thirdLogin from "./thirdlogin";
import topTheme from "../index/top/top-theme";
import theme from "@/mixins/theme";
import { mapGetters } from "vuex";
export default {
  name: "login",
  mixins: [theme()],
  components: {
    topTheme,
    userLogin,
    codeLogin,
    thirdLogin
  },
  data() {
    return {
      activeName: "user"
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    clickTab(obj){
      if(obj.index == '1' ){
        setTimeout(() => {
          document.querySelector('.login-main .pane-wrapper .el-tabs__active-bar').style.transform = 'translateX(242px)'
        },0)
      }
    },
  }
};
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // background: rgba(0, 0, 0, 0.3);
  position: relative;
}
.login-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/dudu/yidao_login.jpg");
  background-size: cover;
}
.login-info {
  padding-left: 60px;
}
.login-info-title {
  line-height: 90px;
}
.login-info-item {
  font-size: 14px;
}
.login-border {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  border-radius: 6px;
  box-shadow: 0 0 30px 0 rgba(0,0,0,.3);
}
.login-main{
  border-radius: 3px;
  box-sizing: border-box;
  .pane-header{
    width: 616px;
    height: 237px;
    background-image: url("../../assets/img/dudu/dudu-logo.png");   
  }
  .pane-wrapper{
    padding: 0 100px 40px 100px;
    background-color: #fff;
    position: relative;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    .el-tabs__content{
      padding-top: 20px;
    }
    .el-tabs__header{
      width: 52%;
      position: absolute;
      top: -55px;
      left: 50%;
      transform: translateX(-50%);
      .el-tabs__nav{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .el-tabs__item{
          color: #fff;
          font-size: 18px;
        }
      }
      .el-tabs__nav-wrap::after{
        background-color: transparent!important;
      }
    }
    .el-form-item{
      border-bottom: 1px solid #dfe3f5;
      padding-bottom: 2px;
    }
    .el-form-item:last-child{
      border-bottom: none;
    }
    .el-tabs__nav-scroll,.el-tabs__nav-wrap{
      overflow: visible;
    }
    .el-tabs__active-bar{
      bottom: -15px;
      width: 0!important;
      left: 26px;
      height: 0;
      background-color: transparent;
      border-left: 8px solid transparent; 
      border-right: 8px solid transparent; 
      border-bottom: 10px solid #fff;
    }
    .el-form-item__content{
      width: auto!important;
      .icon-yonghu:before,
      .icon-mima:before,
      .icon-yanzhengma:before,
      .icon-shouji:before{
        color: #1086ff;
        font-size: 20px;
      }
      .el-icon-view:before,
      .el-icon-circle-close:before,
      .el-icon-circle-check:before{
        font-size: 16px;
      }
      .el-input__inner{
        border: none;
        height: 45px;
        line-height: 45px;
        padding-left: 60px;
        font-size: 18px;
      }
      .el-input__inner::-webkit-input-placeholder{
        font-size: 18px;
      }
      .el-input__prefix:after{
        content: '';
        width: 1px;
        height: 10px;
        background: #dfe3f5;
        position:absolute;
        top: 50%;
        transform: translateY(-70%);
        right:-12px;
      }
      .el-form-item__error{
        font-size: 14px;
        padding-top: 10px;
      }
      .login-code-img{
        position: absolute;
        right: 0;
        bottom: 5px;
      }
    }
    .el-form-item{
      margin-bottom: 20px;
      .el-button{
        width: 300px;
        height: 50px;
        background-color: #49a0fa;
        border-color: #49a0fa;
        border-radius: 50px;
        margin-left: 48px;
        margin-top: 30px;
        box-shadow: 0 0 30px 2px rgba(16,134,255,.4);
        // position: absolute;
        // left: 50%;
        // transform: translateX(-50%);
        span{
          font-size: 24px;
          letter-spacing: 10px;
        }
      }
    }
    .el-input-group__append{
      border: 1px solid #dcdfe6;
    }
  }
}
.login-main > h3 {
  margin-bottom: 20px;
}
.login-main > p {
  color: #76838f;
}
.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #409eff;
  letter-spacing: 3px;
}
.login-submit {
  margin-top: 20px;
  width: 100%;
  background: #3080fe;
  border-radius: 28px;
}
.login-form {
  margin: 10px 0;
  .el-form-item__content {
    width: 270px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
.login-code {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 0 0 10px;
}
.login-code-img {
  width: 100px;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 32px;
  text-indent: 5px;
  text-align: center;
}
</style>
