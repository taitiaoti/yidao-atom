/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 老项目域名地址
 * khglUrl: 客户管理域名地址
 * dicUrl : 字典服务器地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * welUrl :默认欢迎页
 *
 */


let baseUrl = '';
let iconfontVersion = ['567566_r22zi6t8noas8aor', '599693_0b5sleso3f1j1yvi', '667895_xte3dcfrvbo6r',
  '776887_w1u3o854uh9', '776887_flx7timhlm5', '776887_3v0olqbxrwy', '776887_5qbcoxh8xkx', '776887_iz8ftlnwydd',
  '776887_3ldqqobwa15', '776887_ylyibzj651l', '776887_zae3ajytcyo', '776887_wknhrxq6xrh', '776887_vw9izm6a6wl',
  '776887_i1n48t8vxvj', '776887_81zan42sbpi', '776887_o4tn9ga6fug', '776887_1h8x45a9ef', '776887_lpmnbhslpto',
  '776887_709lvh2xp03', '776887_s4x4y13y9ak', '776887_vvwu3msv12n', '776887_6c4fbj9yklt', '776887_okk86eiuxos',
  '776887_krtv06m5yo', '776887_hwes2wv0ynm', '776887_9j7u4sbhuuv', '776887_ckxvtbl1jch', '776887_ssjl95o7akh',
  '776887_k64rg2d52ik'
];
let iconfontUrl = `/at.alicdn.com/t/font_$key.css`;
let codeUrl = `/admin/code`
if (process.env.NODE_ENV == 'development') {
  baseUrl = `http://119.23.26.153:9999/`;
  // baseUrl = `http://192.168.0.46:9999/`;
  // baseUrl = `http://192.168.0.46:4091/`;
  // baseUrl = `http://39.108.108.99:9999/`;

} else if (process.env.NODE_ENV == 'production') {
  // baseUrl = `http://119.23.26.153:9999/`;
  // baseUrl = `http://192.168.0.46:9999/`;
  // baseUrl = `http://192.168.0.46:4091/`;
  baseUrl = `http://39.108.108.99:9999/`
}

export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl
}
