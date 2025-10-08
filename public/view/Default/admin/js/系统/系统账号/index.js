'use strict';
$(function () {
  //o.params.jsFile     选择JS文件  
  let path = "admin/js/系统/系统账号/"
  switch (o.params.jsFile) {
    case "js01": Tool.scriptArr(["../../plugins/forge-sha256-master/build/forge-sha256.min.js", path + '修改.js']); break;
    case "js02": Tool.scriptArr(['admin/js/Shopee/任务/定时任务/更多/把当前数据库该表同步到新的数据库.js']); break;
    default: Tool.scriptArr([
      path + '首页.js'
    ]);
  }
});