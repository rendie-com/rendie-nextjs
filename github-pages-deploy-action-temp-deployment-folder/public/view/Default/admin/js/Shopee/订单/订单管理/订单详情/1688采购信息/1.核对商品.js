Object.assign(Tool, {
    //1.核对商品
    check_product: {
        obj: {
            order: {},
            A1: 1, A2: 0, Aarr: [],
        },
        a01: function () {
            //obj.params.order_sn   订单编号    
            //obj.params.site       站点
            $("#seep1").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>').attr("disabled", true);
            $("#state").html("正在开打【订单列表】页面...");
            gg.isRD(this.a02, this);
        },
        a02: function () {
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + obj.params.site,
                sql: "select " + Tool.fieldAs("list_type,status,status_ext,logistics_status,cancel_reason_ext,rate_by_date,auto_cancel_arrange_ship_date,escrow_release_time,payby_date,purchaseAccount,purchaseInfo,purchaseStatus,purchaseNotes,PurchaseRefund,order_items") + " FROM @.table where @.order_sn='" + obj.params.order_sn + "'",
            }];
            Tool.ajax.a01(data, this.a03, this);
        },
        a03: function (t) {
            let oo = t[0][0];
            let isStatusErr = this.b01(oo.status, oo.status_ext, oo.logistics_status)
            let isPurchaseStatusErr = this.b02(oo.purchaseStatus) != "待处理"
            this.obj.order = oo;
            if (isStatusErr || isPurchaseStatusErr || oo.purchaseNotes || oo.PurchaseRefund) {//是否异常
                //核对商品前，检测到该订单【异常】
                this.a04(oo, isStatusErr, isPurchaseStatusErr);
            }
            else {
                this.d01();
            }
        },
        //核对商品前，检测到该订单【异常】
        a04: function (oo, isStatusErr, isPurchaseStatusErr) {
            let txt = '\
            <table class="table table-hover center mb-0 align-middle">\
            <thead class="table-light center">\
                <tr>\
                    <th class="w130"></th>\
                    <th>检测值</th>\
                    <th class="w100">正常值</th>\
                    <th class="w100">检测结果</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td class="right">订单状态：</td>\
                    <td>'+ Tool.status.a01(
                oo.list_type,
                oo.status + "-" + oo.status_ext + "-" + oo.logistics_status,
                oo.cancel_reason_ext,
                oo.auto_cancel_arrange_ship_date,
                oo.payby_date,
                oo.rate_by_date,
                oo.escrow_release_time) + '</td>\
                    <td>待出货</td>\
                    <td>'+ (isStatusErr ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购信息：</td>\
                    <td>'+ oo.purchaseInfo + '</td>\
                    <td>null</td>\
                    <td>'+ (oo.purchaseInfo ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购状态：</td>\
                    <td>'+ this.b02(oo.purchaseStatus) + '</td>\
                    <td>待处理</td>\
                    <td>'+ (isPurchaseStatusErr ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购备注：</td>\
                    <td>'+ oo.purchaseNotes + '</td>\
                    <td>null</td>\
                    <td>'+ (oo.purchaseNotes ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
                <tr>\
                    <td class="right">采购退款金额：</td>\
                    <td>'+ oo.PurchaseRefund + '</td>\
                    <td>0</td>\
                    <td>'+ (oo.PurchaseRefund ? '<font color="red">异常</font>' : '正常') + '</td>\
                </tr>\
            </tbody>\
            </table>'
            $("#seep1").attr("class", "btn btn-danger");
            Tool.Modal("核对商品前，检测到该订单【异常】", txt, '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button><button type="button" class="btn btn-primary" onclick="Tool.check_product.d01()" data-bs-dismiss="modal">忽略提示【继续】</button>', 'modal-xl');
        },
        //////////////////////////////////////////////////////////
        b01: function (status, status_ext, logistics_status) {
            let iserr = true;
            let val = status + "-" + status_ext + "-" + logistics_status
            if ("1-1-9" == val || "2-2-9" == val) {
                iserr = false;
            }
            return iserr;
        },
        b02: function (purchaseStatus) {
            let arr = Tool.purchaseStatusArr, val = "";
            for (let i = 0; i < arr.length; i++) {
                if (purchaseStatus == arr[i][0]) { val = arr[i][1]; break; }
            }
            return val;
        },
        b03: function (oo) {
            return '\
            <tr>\
                <td class="right">标题：</td>\
                <td>'+ oo.shopee.name + '</td>\
                <td>'+ oo._1688.name + '</td>\
                <td class="center">'+ '</td>\
            </tr>\
            <tr>\
                <td class="right">单位：</td>\
                <td>'+ oo.shopee.unit + '</td>\
                <td>'+ oo._1688.unit + '</td>\
                <td class="center">'+ '</td>\
            </tr>\
            <tr>\
                <td class="right">每包件数：</td>\
                <td>'+ oo.shopee.packingQuantity + '</td>\
                <td>'+ oo._1688.packingQuantity + '</td>\
                <td class="center">' + '</td>\
            </tr>'
        },
        b04: function () {
            let li1_1 = "", li1_2 = "", li1_3 = "", len = 0, cc = "";
            // for (let i = 0; i < oo.DH.picArr.length; i++) {
            //     if (oo.SMT.picArr2.indexOf(oo.DH.picArr[i]) != -1) { len++; }
            //     li1_1 += '<img style="margin:3px;padding:1px;border:1px solid #ccc" src="http://image.dhgate.com/100x100/' + oo.DH.picArr[i] + '" width="72">';
            // }
            // for (let i = 0; i < oo.SMT.picArr[1].length; i++) { li1_2 += '<img style="margin:3px;padding:1px;border:1px solid #ccc" src="' + oo.SMT.picArr[1][i] + '" width="72">'; }
            // //////////////////////////////////////////////////////
            // cc = parseInt((len / oo.DH.picArr.length) * 100)
            // li1_3 = len + "/" + oo.DH.picArr.length + "<hr/>" + cc + "%";
            // //////////////////////////////////////
            // if (cc < 70) { this.obj.isErr = true; li1_3 = '<font color="red">' + li1_3 + '</font>'; }
            return '\
            <tr>\
                <td class="right">放大镜图片：</td>\
                <td>'+ li1_1 + '</td>\
                <td>'+ li1_2 + '</td>\
                <td class="center">'+ li1_3 + '</td>\
            </tr>'
        },
        b05: function (oo) {
            //let dh = oo.DH.desPicArr, smt = oo.SMT.desPicArr;
            let li1_1 = "", li1_2 = "", li1_3 = "", len = 0, cc = "";
            // for (let i = 0; i < dh.length; i++) {
            //     if (oo.SMT.picArr2.indexOf(dh[i]) != -1) { len++; }
            //     li1_1 += '<img style="margin:3px;padding:1px;border:1px solid #ccc" src="' + dh[i] + '" width="72">';
            // }
            // for (let i = 0; i < smt.length; i++) { li1_2 += '<img style="margin:3px;padding:1px;border:1px solid #ccc" src="' + smt[i] + '" width="72">'; }
            // for (let i = 0; i < dh.length; i++) { if (smt.indexOf(dh[i]) != -1) { len++; } }
            // if (dh.length == 0) { cc = 100 }
            // else { cc = parseInt((len / dh.length) * 100) }
            // li1_3 = len + "/" + dh.length + "<hr/>" + cc + "%";
            // if (cc < 70) { this.obj.isErr = true; li1_3 = '<font color="red">' + li1_3 + '</font>'; }
            //////////////////////////////////////////////////
            return '\
            <tr>\
                <td class="right">详情图片：</td>\
                <td>'+ li1_1 + '</td>\
                <td>'+ li1_2 + '</td>\
                <td class="center">'+ li1_3 + '</td>\
            </tr>'
        },
        b06: function (oo) {
            let price1 = '', price2 = '', price3 = ''
            // if (oo.minprice == oo.maxprice) {
            //     price1 = 'US $' + (oo.minprice * (100 - oo.Discount) * 0.01).toFixed(2) + ' <s style="color:#999;font-size:10px;">US $' + oo.minprice.toFixed(2) + '</s><span style="background:#fff1f1;padding: 2px 5px;font-size:10px;">-' + oo.Discount + '%</span>'
            // }
            // else {
            //     price1 = 'US $' + (oo.minprice * (100 - oo.Discount) * 0.01).toFixed(2) + ' - ' + (oo.maxprice * (100 - oo.Discount) * 0.01).toFixed(2) + ' <s style="color:#999;font-size:10px;">US $' + oo.minprice.toFixed(2) + ' - ' + oo.maxprice.toFixed(2) + '</s><span style="background:#fff1f1;padding: 2px 5px;font-size:10px;">-' + oo.Discount + '%</span>'
            // }
            // if (oo.SMT.minprice == oo.SMT.maxprice) {
            //     price2 = 'US $' + (oo.SMT.minprice * (100 - oo.SMT.Discount) * 0.01).toFixed(2) + ' <s style="color:#999;font-size:10px;">US $' + oo.SMT.minprice.toFixed(2) + '</s><span style="background:#fff1f1;padding: 2px 5px;font-size:10px;">-' + oo.SMT.Discount + '%</span>'
            // }
            // else {
            //     price2 = 'US $' + (oo.SMT.minprice * (100 - oo.SMT.Discount) * 0.01).toFixed(2) + ' - ' + (oo.SMT.maxprice * (100 - oo.SMT.Discount) * 0.01).toFixed(2) + ' <s style="color:#999;font-size:10px;">US $' + oo.SMT.minprice.toFixed(2) + ' - ' + oo.SMT.maxprice.toFixed(2) + '</s><span style="background:#fff1f1;padding: 2px 5px;font-size:10px;">-' + oo.SMT.Discount + '%</span>'
            // }
            // if (price1 != price2) { this.obj.isErr = true; price3 = '<a href="javascript:;" onClick="Tool.main(\'js6/1/' + oo.proid + '\');" class="red" title="重新采集该商品\n注：主要是为了，在【第2步】加入购物车时能得到实时价格，这样就能在【第5步】确认商品时，判断【价格】是否一样。">*不同</font>'; } else { price3 = "相同"; }
            return '\
            <tr>\
                <th></th>\
                <th>本地价格</th>\
                <th>速卖通价格</th>\
                <th nowrap>对比结果</th>\
            </tr>\
            <tr>\
                <td></td>\
                <td>'+ price1 + '</td>\
                <td>'+ price2 + '</td>\
                <td>'+ price3 + '</td>\
            </tr>'
        },

        //////////////////////////////////////////////////////////////////////////
        d01: function () {
            this.obj.order.order_items = JSON.parse(this.obj.order.order_items);
            let sku = [], order_items = this.obj.order.order_items;
            for (let i = 0; i < order_items.length; i++) {
                sku.push(order_items[i].product.sku);
            }
            ////////////////////////////////////////////////////
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + Tool.sip(obj.params.site),
                sql: "select " + Tool.fieldAs("_1688_fromid,proid") + " FROM @.table where @.proid in('" + sku.join("','") + "')",
            }];
            $("#state").html("已获得1688商品ID。。。");
            Tool.ajax.a01(data, this.d02, this, sku.length);
        },
        d02: function (t, len) {
            if (t[0].length == len) {
                this.obj.A2 = t[0].length;
                this.obj.Aarr = t[0];
                this.d03();
            }
            else {
                let str = "订单中的商品，在1688中找不到。<br/>shopee【@.proid】：" + len + "个，1688【@.proid】：" + t[0].length + "个。"
                $("#state").html(str);
                Tool.Modal('报错提示', str, '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>', 'modal-l');
            }
        },
        d03: function () {
            let th = '<tr class="table-light">\
                <th class="center w100">【'+ this.obj.A1 + '/' + this.obj.A2 + '】</th>\
                <th>敦煌网（<a href="https://www.dhgate.com/product/-/'+ '.html" target="_blank">新窗口打开该商品</a>）</th>\
                <th>速卖通（<a href="https://www.aliexpress.com/item/'+ '.html" target="_blank">新窗口打开该商品</a>）</th>\
                <th class="center">对比结果</th>\
            </tr>'
            let html = this.b04() + this.b03({ shopee: {}, _1688: {} }) + this.b05() + this.b06();
            Tool.Modal("核对商品时【商品不同】", '\
            <table class="table table-hover mb-0">\
                <thead>'+ th + '</thead>\
                <tbody>' + html + "</tbody>\
            </table>",
                '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>\
            <button type="button" class="btn btn-primary" onclick=\'Tool.addCart.a01(fun.obj.orderid,fun.obj.o3.country);\' data-bs-dismiss="modal">忽略提示【继续】</button>', 'modal-xl');
        },

    },
});


// a10: function (smtdes) {
//     this.obj.Aarr[this.obj.A1 - 1].SMT.desPicArr = this.b04(smtdes)
//     $("#state").html('【' + this.obj.A1 + '/' + this.obj.A2 + '】已获取SMT详情内容,正在获取DH对应SMT的图片链接...');
//     let proid = this.obj.Aarr[this.obj.A1 - 1].proid
//     let str = '{\
//     <r:prodes db="sqlite.aliexpress_prodes/' + Tool.pronum(proid,50) + '" where=" where @.proid=\'' + proid + '\'" size=1 >\
//         "DHpic":<:DHpic tag=0/>,\
//         "DHattrPic":<:DHattrPic tag=0/>,\
//         "DHdesPic":<:DHdesPic tag=0/>\
//     </r:prodes>}'
//     Tool.ajax.a01(str, 1, this.a11, this)
// },
// a11: function (oo) {
//     let pic40Arr = this.obj.Aarr[this.obj.A1 - 1].SMT.picArr[0], picAarr = this.b01(oo), index, nArr = [];
//     $("#state").html('【' + this.obj.A1 + '/' + this.obj.A2 + '】正在获取本地图片链接...');
//     for (let i = 0; i < pic40Arr.length; i++) {
//         index = picAarr.indexOf(pic40Arr[i])
//         if (index != -1) {
//             nArr.push(pic40Arr[i]);
//         }
//     }
//     this.obj.Aarr[this.obj.A1 - 1].SMT.picArr2 = nArr
//     this.a12()
// },
// a12: function () {
//     this.obj.Err += this.b05();//如果要提示，就给提示。
//     this.obj.A1++;
//     if (this.obj.A1 <= this.obj.A2) {
//         this.a06();
//     }
//     else {
//         if (this.obj.isErr) {
//             $("#state").html("<b>商品不同</b>")
//             $("#seep1").html("*(1)").attr("class", "btn btn-danger");
//             Tool.Modal("核对商品时【商品不同】", '<table class="table table-hover mb-0"><tbody>' + this.obj.Err + "</tbody></table>", '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button><button type="button" class="btn btn-primary" onclick=\'Tool.addCart.a01(fun.obj.orderid,fun.obj.o3.country);\' data-bs-dismiss="modal">忽略提示【继续】</button>', 'modal-xl');
//         }
//         else {
//             $("#seep1").html("*(1)")
//             Tool.addCart.a01(fun.obj.orderid, fun.obj.o3.country);
//         }
//     }
// },
// b01: function (oo) {
//     let arr = [];
//     for (let i = 0; i < oo.DHpic.length; i++) { arr.push(oo.DHpic[i].picA.aliexpressPic); }
//     for (let i = 0; i < oo.DHattrPic.length; i++) { arr.push(oo.DHattrPic[i].picA.aliexpressPic); }
//     for (let i = 0; i < oo.DHdesPic.length; i++) { arr.push(oo.DHdesPic[i].picA.aliexpressPic); }
//     return arr;
// },
// b02: function (t) {
//     let des = Tool.StrSlice(t, '<h2 class="div-title">Description</h2>', 'More Description</span>');
//     let desPicArr = Tool.regSplits(des.replace(/(<a [\S\s]*?<\/a>)/ig, ""), ' src="', '"');
//     return desPicArr
// },
// b03: function (str)//得到DH的信息
// {
//     let picArr = Tool.StrSlice(str, '"oriImgList":["', '"]').split('","');
//     picArr = Tool.unique(picArr);//去重复
//     for (let i = 0; i < picArr.length; i++) {
//         if (picArr[i].indexOf('/0x0/') != -1) { picArr[i] = Tool.StrSlice(picArr[i], '/0x0/', '.jpg') + ".jpg"; }
//         else {
//             alert("DH截取图片失败，请与管理员联系。")
//         }

//     }
//     ////////////////////////////////////////////////
//     let unit = Tool.StrSlice(str, '<span class="price-pieces">/ ', '</span>').toLowerCase();
//     if (unit == "lot") { unit = "piece"; }
//     //////////////////////////
//     let packingQuantity = Tool.StrSlice(str, '"lot":', ',');
//     /////////////////////////////
//     return { picArr: picArr, unit: unit, packingQuantity: packingQuantity }
// },
// b04: function (smtdes) {
//     let desPicArr = Tool.regSplits(smtdes.replace(/(<a [\S\s]*?<\/a>)/ig, ""), ' src="', '"');
//     desPicArr = Tool.unique(desPicArr);//去重复
//     return desPicArr
// },
// b06: function (str)//SMT
// {
//     let price = this.b07(str)//算出最小价格，和最大价格
//     ///////////////////////////////////////
//     let Discount = Tool.regSlice(str, 'e,"discount":', ',');
//     if (!Discount) { Discount = 0 }
//     ///////////////////////////////////////
//     let picArr = this.b08(str)//放大镜图片
//     ////////////////////////////////////////
//     let name = Tool.StrSlice(str, '"subject":"', '","');
//     name = Tool.Trim(name).replace(/  +/ig, " ");//主要是在【上传商品】时，DH做了这个操作。
//     /////////////////////////////////////////////
//     let unit = Tool.StrSlice(str, '"multiUnitName":"', '"').toLowerCase();
//     if (unit == "pieces") { unit = "piece" }
//     else if (unit == "sets") { unit = "set" }
//     ////////////////////////////
//     let packingQuantity = Tool.StrSlice(str, '"numberPerLot":', ',');
//     //////////////////////////////
//     let isshelf = false;//是否已下架
//     if (str.indexOf('Sorry, this item is no longer available!</div>') != -1) { this.obj.isErr = true; isshelf = true; }
//     return {
//         name: name,
//         unit: unit,
//         packingQuantity: packingQuantity,
//         minprice: price[0],
//         maxprice: price[1],
//         Discount: Discount,
//         picArr: picArr,
//         isshelf: isshelf
//     }
// },
// b07: function (str)//算出最小价格和最大价格
// {
//     //let arr = []
//     //eval("arr=" + Tool.regSplits(str, '"skuModule":', ',"priceGuarantee"'))
//     //arr = arr.skuPriceList;
//     //let minprice = 0, maxprice = 0, newprice = 0;
//     //for (let i = 0; i < arr.length; i++) {
//     //    newprice = arr[i].skuVal.skuAmount.value;
//     //    if (i == 0) { minprice = newprice; }
//     //    else if (newprice < minprice) { minprice = newprice; }
//     //    if (newprice > maxprice) { maxprice = newprice; }
//     //}
//     //return [minprice, maxprice]
//     return [0, 0]
// },
// b08: function (str)//放大镜图片
// {
//     let html = Tool.StrSlice(str, '"summImagePathList":[', ']'), pic40Arr = [], num = -1, alipicArr
//     eval("alipicArr=[" + html + "]")
//     alipicArr = Tool.unique(alipicArr)//去重复
//     for (let i = 0; i < alipicArr.length; i++) {
//         num = alipicArr[i].indexOf("_50x50")
//         if (num != -1) { alipicArr[i] = alipicArr[i].substr(0, num); }
//         pic40Arr.push(Tool.StrSlice(alipicArr[i], "com/kf/", "/"));
//     }
//     return [pic40Arr, alipicArr]
// },



