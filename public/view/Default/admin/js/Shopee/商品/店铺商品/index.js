'use strict';
!function () {
    let path = "admin/js/Shopee/商品/店铺商品/"
    let loginPath = ["admin/js/Shopee/common.js", "admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr([
            "admin/js/Shopee/common.js",
            path + '../common.js',
            path + '更多_all/更新数量/common.js',
            path + '更多_all/更新数量/index.js'
        ]); break;
        case "02": Tool.scriptArr(loginPath.concat([
            "admin/js/Shopee/common.js",
            path + '更多_all/获取【店铺商品】信息/common.js',
            path + '更多_all/获取【店铺商品】信息/index.js'
        ])); break;
        case "03": Tool.scriptArr([
            "admin/js/Shopee/common.js",
            path + '更多_all/把1688信息同步过来/common.js',
            path + '更多_all/把1688信息同步过来/index.js'
        ]); break;
        case "04": Tool.scriptArr(loginPath.concat([
            path + '更多_all/获取【店铺商品】详情信息/common.js',
            path + '更多_all/获取【店铺商品】详情信息/index.js'
        ])); break;
        case "05": Tool.scriptArr([
            path + '../common_logistics.js',
            "admin/js/Shopee/common.js",
            "admin/js/Shopee/common_fixedPrice.js",
            path + '更多_all/重新计算【最终折扣】/common.js',
            path + '更多_all/重新计算【最终折扣】/index.js'
        ]); break;
        case "06": Tool.scriptArr([
            path + '../common_logistics.js',
            "admin/js/Shopee/common.js",
            path + '更多_all/选出能做活动的商品/common.js',
            path + '更多_all/选出能做活动的商品/index.js'
        ]); break;
        case "07": Tool.scriptArr(loginPath.concat([
            path + '../common_logistics.js',
            path + '../全球商品/common_price.js',
            path + '更多_all/更新【店铺商品】信息/common/1.获取店铺信息.js',
            path + '更多_all/更新【店铺商品】信息/common/2.获取全球商品和1688信息.js',
            path + '更多_all/更新【店铺商品】信息/common/3.修改成水印图.js',
            path + '更多_all/更新【店铺商品】信息/common/修改sku图为水印图.js',
            path + '更多_all/更新【店铺商品】信息/common/更新商品.js',
            path + '更多_all/更新【店铺商品】信息/index.js'
        ])); break;
        case "08": Tool.scriptArr(loginPath.concat([
            path + '更多_all/删除/common.js',
            path + '更多_all/删除/index.js'
        ])); break;
        case "09": Tool.scriptArr(loginPath.concat([
            path + '更多_all/下架/common.js',
            path + '更多_all/下架/index.js'
        ])); break;
        case "10": Tool.scriptArr(loginPath.concat([
            path + '../全球商品/common_self_ArrayBuffer.js',
            'admin/js/common_img/index.js',
            path + '更多_all/生成视频/1.获取信息.js',
            path + '更多_all/生成视频/2.生成视频.js',
            'admin/js/Shopee/商品/全球商品/手动审核1688状态/上传讲解视频到shopee/1.上传视频到shopee.js',
            path + '更多_all/生成视频/index.js'
        ])); break;
        case "11":
            Tool.scriptArr(loginPath.concat([
                'admin/js/common_img/给图片增加水印.js',
                'admin/js/common_img/index.js',
                'admin/js/common_img/img.onload.js',
                'admin/js/common_img/压缩图像到指定大小.js',
                'admin/js/common_img/均值哈希.js',
                //path + '图片/common_uuid.js',
                //'../../plugins/js实现AES加密/crypto-js-4.1.1/crypto-js.js',
                path + '../图片/common_upPic.js',
                'admin/js/common_img/uploadFile.js',
                path + '更多_all/生成图片水印/1.获取商品信息.js',
                path + '更多_all/生成图片水印/2.生成shopee_放大镜图水印.js',
                path + '更多_all/生成图片水印/3.生成1688_属性图水印.js',
                path + '更多_all/生成图片水印/index.js'
            ])); break;
        case "12": Tool.scriptArr(loginPath.concat([
            path + '../common.js',
            path + '更多/为该站点创建类目/common/删除站点类目.js',
            path + '更多/为该站点创建类目/common/创建热门关键词类目.js',
            path + '更多/为该站点创建类目/common/创建单位重量类目.js',
            path + '更多/为该站点创建类目/common/创建价格类目.js',
            path + '更多/为该站点创建类目/common/创建最低购买数量类目.js',
            path + '更多/为该站点创建类目/common/创建新品类目.js',
            path + '更多/为该站点创建类目/index.js'
        ])); break;
        case "13": Tool.scriptArr(loginPath.concat([path + '../common.js', path + '状态/下架.js'])); break;
        case "14": Tool.scriptArr(loginPath.concat([path + '../common.js', path + '状态/上架.js'])); break;
        case "15": Tool.scriptArr(loginPath.concat([path + '更多/修改出货天数.js'])); break;
        case "16": Tool.scriptArr(loginPath.concat([path + '状态/置顶推广.js'])); break;
        case "17": Tool.scriptArr(['admin/js/Shopee/任务/定时任务/更多/把该表同步到【PostgreSQL】数据库.js']); break;
        case "18": Tool.scriptArr(loginPath.concat([
            'admin/js/common_img/给首图增加水印.js',
            'admin/js/common_img/index.js',
            'admin/js/common_img/img.onload.js',
            'admin/js/common_img/压缩图像到指定大小.js',
            'admin/js/common_img/均值哈希.js',
            path + '../图片/common_upPic.js',
            //path + '图片/common_hash.js',
            //path + '图片/common_uuid.js',
            //'../../plugins/js实现AES加密/crypto-js-4.1.1/crypto-js.js',
            'admin/js/common_img/uploadFile.js',
            path + '更多_all/生成首图水印/1.获取信息.js',
            path + '更多_all/生成首图水印/2.生成水印.js',
            path + '更多_all/生成首图水印/index.js'
        ])); break;
        case "19": Tool.scriptArr(["admin/js/Shopee/common.js", path + '更多/选出要修改价格的商品.js']); break;
        default: Tool.scriptArr([
            "admin/js/Shopee/common.js",
            "admin/js/Shopee/common_fixedPrice.js",
            path + '../common.js',
            path + '../common_logistics.js',
            path + '首页/A.js',
            path + '首页/B.js',
            path + '首页/C.js',
        ]); break;
    }
}();