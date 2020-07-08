import {
  validatenull
} from './validate'
import {
  baseUrl
} from '@/config/env'
import getCurrentAppList from '@/store/modules/appId'
import store from '../store'

export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  router.addRoutes(formatRoutes(menu))
}

// 处理路由
export const formatRoutes = (aMenu) => {
  const aRouter = []
  aMenu.forEach(oMenu => {
    const {
      path,
      component,
      name,
      icon,
      children
    } = oMenu
    if (!validatenull(component)) {
      let filePath;
      const oRouter = {
        path: path,
        component(resolve) {
          let componentPath = ''
          if (component === 'Layout') {
            require(['../page/index'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`../${componentPath}.vue`], resolve)
        },
        name: name,
        icon: icon,
        children: validatenull(children) ? [] : formatRoutes(children)
      }
      aRouter.push(oRouter)
    }

  })
  return aRouter
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params
  let result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else if (type === 'Aes') {
    param.forEach(ele => {
      result[ele] = CryptoJS.AES.encrypt(result[ele], key).toString()
    })
  }
  return result
}

/**
 * 设置浏览器头部标题
 */
export const setTitle = function (title) {
  title = title ? `${title}——B2B采购系统平台` : 'B2B采购系统平台';
  window.document.title = title
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen()
  } else {
    reqFullScreen()
  }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }
  document.addEventListener('fullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('msfullscreenchange', function (e) {
    listen()
  })
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen = document.fullscreenEnabled ||
    window.fullScreen ||
    document.mozFullscreenEnabled ||
    document.webkitIsFullScreen
  return isFullscreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}

/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}

/**
 * 递归寻找子类的父类
 */
export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i]
        } else {
          if (menu[i].children[j].children.length !== 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
}

/**
 * 总体路由处理器
 */
export const resolveUrlPath = (url, name) => {
  let reqUrl = url
  if (url.indexOf('#') !== -1 && url.indexOf('http') === -1) {
    const port = reqUrl.substr(reqUrl.indexOf(':'))
    reqUrl = `/myiframe/urlPath?src=${baseUrl}${port}${reqUrl.replace('#', '').replace(port, '')}}&name=${name}`
  } else if (url.indexOf('http') !== -1) {
    reqUrl = `/myiframe/urlPath?src=${reqUrl}&name=${name}`
  } else {
    reqUrl = `${reqUrl}`
  }
  console.log(reqUrl)
  // console.log(store.state.user.menu)
  return reqUrl
}

/**
 * 总体路由设置器
 */
export const setUrlPath = ($route) => {
  let value = ''
  if ($route.query.src) {
    value = $route.query.src
  } else {
    value = $route.path
  }
  return value
}

/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = ''
  if (validatenull(dic)) return value
  if (typeof (value) === 'string' || typeof (value) === 'number') {
    let index = 0
    index = findArray(dic, value)
    if (index !== -1) {
      result = dic[index].label
    } else {
      result = value
    }
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach(ele => {
      index = findArray(dic, ele)
      if (index !== -1) {
        result.push(dic[index].label)
      } else {
        result.push(value)
      }
    })
    result = result.toString()
  }
  return result
}

/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i
    }
  }
  return -1
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

//是否被包含,是返回true,不是返回false
export const isContained = (a, b) => {
  if(!(a instanceof Array) || !(b instanceof Array)) return false;
    if(a.length < b.length) return false;
    var isTrue = false;
    for(var i = 0, len = b.length; i < len; i++){
      isTrue = false
      for(var j = 0, len02 = a.length; j< len02; j++){
        if(b[i] == a[j]){
          isTrue = true;
        }
      }
      if(!isTrue){
        return false;
      }
    }
  return isTrue;
}

 //获取含有property字符的属性但不包含property
export const getPropertyArr = (arr) => {
  let temp = [];
  for(let k in arr){
    if(k.indexOf('property') != -1){
      if(k != 'property'){
        temp.push(arr[k])
      }
    }
  }
  return temp;
}

export const formartTime = (date, n) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  switch(n){
    case 1:
      return [year, month, day].map(formatNumber).join('-')
      break;  
    case 2:   
      return [month, day].map(formatNumber).join('.')
      break; 
    case 3:
      return [hour, minute].map(formatNumber).join(':')
      break; 
    case 4:
      return [hour].map(formatNumber)
      break; 
    case 5:
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':') 
      break; 
    case 6:
      return [year, month].map(formatNumber).join('-')
      break;  
    default:
      console.log('目前第二次参数只有 1 2 3 4 5 6');
  }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const getAppName = appId => {
  if(localStorage.getItem('allApp')){
    let appList = JSON.parse(localStorage.getItem('allApp'));
    let appName = "";
    appList.forEach((item, index) => {
      if(item.appId == appId) appName = item.appName;
    });
    return appName || appId;
  }
}

export const filterAddressData = (arr, isArr = false) => {
  let tempArr = [];
  for(let k in arr){
      if(isArr){
          tempArr.push({
              value: arr[k],
              label: k
          });
      }else {
          tempArr.push({
              value: arr[k],
              label: k,
              cities: []
          });
      }
  }
  return tempArr;
}

function toDecimal2(x,ss) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + ss) {
    s += '0';
  }
  return s;
}

function bcFixed(num, s) {
  var times = Math.pow(10, s)
  var des = num * times + 0.5
  des = parseInt(des, 10) / times
  return toDecimal2(des,s)+'';
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
export const  bcadd = (num1, num2,s) => {
  var baseNum, baseNum1, baseNum2,ret;
  try {
   baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
   baseNum1 = 0;
  }
  try {
   baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
   baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
     ret=(num1 * baseNum + num2 * baseNum) / baseNum;
  return bcFixed(ret,s);
 };
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
export const bcdiv = (num1,num2 ,s) => {
  var baseNum1 = 0, baseNum2 = 0,ret;
  var baseNum3, baseNum4;
  try {
   baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
   baseNum1 = 0;
  }
  try {
   baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
   baseNum2 = 0;
  }
   baseNum3 = Number(num1.toString().replace(".", ""));
   baseNum4 = Number(num2.toString().replace(".", ""));
   ret=(baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
    return bcFixed(ret,s);
};


 //判断当前用户绑定的app有没有 嘟嘟应用
 export const isDudu =(appId) => {
    if(appId){
      let currentAppList = getCurrentAppList.state.appIdList; 
      let tempBool = false;
      currentAppList.forEach(item => {
        if(item.appId == appId){
          tempBool = true;
        }
      });
      return tempBool;
    }else {
      return false;
    }
 }

//  startsWith()和endswith()检测字符串开头和结尾
 export const getPictureLink = (url) => {
   let baseUrl = "http://qiniu.edawtech.com/";
   if(url){
    return url.startsWith('http') ? url : (baseUrl + url);
   }else {
     '暂无图片(null)'
   }
 }

 //保留两位小数
 export const saveTwoDecimal = (value) => {
   return value ? Math.floor(value * 100) / 100 : 0;
 } 

//  将时间戳转换成日期格式：
export const timestampToTime = (timestamp) => {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000 
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y+M+D+h+m+s;
}

// 日期格式转换成时间戳：
export const timeToTimestamp = (time) => {
  // var date = new Date('2014-04-23 18:55:49:123');
  var date = new Date(time);
  // 有三种方式获取
  var time1 = date.getTime();
  // var time2 = date.valueOf();
  // var time3 = Date.parse(date);
  return time1;
}

export const refrain = (arr) => { //获取数组重复的元素
　　var tmp = [];
　　if(Array.isArray(arr)) {
　　　　arr.concat().sort().sort(function(a,b) {
　　　　　　if(a==b && tmp.indexOf(a) === -1) tmp.push(a);
　　　　});
　　}
    console.log(tmp);
　　return tmp;
}

export const unique = (arr) => { //去除重复的数组
  let temArr = arr.filter((item, index, array) => {
    return array.indexOf(item) === index
  })
  return temArr;
}

export const any = (arr, fn = Boolean) => arr.some(fn); //any