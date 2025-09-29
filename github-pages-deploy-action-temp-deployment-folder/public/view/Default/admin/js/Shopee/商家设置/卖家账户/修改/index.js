'use strict';
!function () {
  //o.params.jsFile2         选择JS文件
  let path = "admin/js/Shopee/商家设置/卖家账户/修改/"
  switch (o.params.jsFile2) {
    case "01": Tool.scriptArr([path + '站点配置.js']); break;
    case "02": Tool.scriptArr([path + 'cookie.js']); break;
    default: Tool.scriptArr([path + '基本信息.js']); break;
  }
}();