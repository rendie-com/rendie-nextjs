Object.assign(Tool, {
    //1.核对商品
    check_product: {
        obj: {
            order_sn: "",
            siteNum: "",
            order: {},
            shopee: {},
            seller: {},
        },
        a01: function (order_sn, site, num, siteNum) {
            //order_sn   订单编号    
            //siteNum    站点
            $("#seep1").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>').attr("disabled", true);
            $("#state").html("正在开打【订单列表】页面...");
            this.obj = {
                order_sn: order_sn,
                site: site,
                num: num,
                siteNum: siteNum,
            }
            Tool.check_product_common1.a01(this.obj, this.a02, this);
        },
        a02: function (t) {
            this.obj.order = t.order;
            if (t.error) {
                Tool.Modal("核对商品前，检测到该订单【异常】", t.error, '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button><button type="button" class="btn btn-primary" onclick=\'Tool.check_product.a03()\' data-bs-dismiss="modal">忽略提示【继续】</button>', 'modal-xl');
            } else { this.a03(); }
        },
        a03: function () {
            Tool.login.a01(this.a04, this);
        },
        a04: function (t) {
            this.obj.seller = t;
            Tool.check_product_common2.a01(this.obj, this.a05, this);
        },
        a05: function (t) {
            this.obj.shopee = t.shopee;
            Tool.check_product_common3.a01(t._1688, this.a06, this);
        },
        a06: function (_1688) {
            Tool.Modal("核对商品时【商品不同】", '<table class="table mb-0 align-top">' + this.b02(this.obj.shopee, _1688) + '</table>', '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button><button type="button" class="btn btn-primary" data-bs-dismiss="modal">忽略提示【继续】</button>', 'modal-xl');
        },
        //////////////////////////////////////////////////////
        b01: function (images) {
            let img = ""
            for (let i = 0; i < images.length; i++) {
                let src = "https://s-cf-sg.shopeesz.com/file/" + images[i] + "_tn"
                img += '<a href="https://s-cf-sg.shopeesz.com/file/' + images[i] + '" target="_blank"><img src="' + src + '" class="border" width="72"></a>';
            }
            return img;
        },
        b02: function (shopee, _1688) {
            let html = "", len = shopee.length, urlA, urlB;
            for (let i = 0; i < len; i++) {
                urlA = "https://seller.shopee.cn/portal/product/" + shopee[i].fromid + "?cnsc_shop_id=" + shopee[i].shopId + "&cbsc_shop_region=" + shopee[i].site
                urlB = "https://" + (shopee[i].site == "tw" ? "xiapi" : shopee[i].site) + ".xiapibuy.com/product/" + shopee[i].shopId + "/" + shopee[i].fromid + "/";
                /////////////////////////////////////////////////
                html += '\
                <thead class="table-light">\
                    <tr>\
                        <th class="center w100">【'+ (i + 1) + '/' + len + '】</th>\
                        <th>Shopee（<a href="' + urlA + '" target="_blank">修改</a> | <a href="' + urlB + '" target="_blank">新窗口打开该商品</a>）</th>\
                        <th class="w-50">1688（<a href="https://detail.1688.com/offer/' + _1688[i].fromid + '.html" target="_blank">新窗口打开该商品</a>）</th>\
                    </tr>\
                </thead>\
                <tbody>\
                    <tr>\
                        <td class="right">放大镜图片：</td>\
                        <td>'+ this.b01(shopee[i].images) + '</td>\
                        <td>'+ this.b03(_1688[i].images) + '</td>\
                    </tr>\
                    <tr>\
                        <td class="right">单位：</td>\
                        <td>'+ shopee[i].unit + '</td>\
                        <td>'+ _1688[i].unit + '</td>\
                    </tr>\
                    <tr>\
                        <td class="right"></td>\
                        <td class="p-0">\
                            <ul class="makeHtmlTab">\
                                <li onclick="Tool.check_product.c01($(this),1)">翻译前</li>\
                                <li onclick="Tool.check_product.c01($(this),2)" class="hover">翻译后</li>\
                            </ul>\
                        </td>\
                        <td></td>\
                    </tr>\
                    <tr>\
                        <td class="right">标题：</td>\
                        <td><div name="translateA" class="hide">'+ shopee[i].name[0] + '</div><div name="translateB">' + shopee[i].name[1] + '</div></td>\
                        <td>'+ _1688[i].name + '</td>\
                    </tr>\
                    <tr>\
                        <td class="right">详情属性：</td>\
                        <td><div name="translateA" class="hide">'+ shopee[i].desArr[0].join("<br/>") + '</div><div name="translateB">' + shopee[i].desArr[1].join("<br/>") + '</div></td>\
                        <td>'+ _1688[i].desArr.join("<br/>") + '</td>\
                    </tr>\
                </tbody>'
            }
            return html;
        },
        b03: function (images) {
            let img = ""
            for (let i = 0; i < images.length; i++) {
                img += '<a href="' + images[i] + '" target="_blank"><img src="' + images[i] + '" class="border" width="72"></a>';
            }
            return img;
        },
        //////////////////////////////////////////////////////
        c01: function (This, mode) {
            $(".makeHtmlTab li").removeAttr('class')
            This.attr("class", "hover")
            if (mode == 1) {
                $('[name="translateA"]').show();
                $('[name="translateB"]').hide();
            }
            else {
                $('[name="translateA"]').hide();
                $('[name="translateB"]').show();
            }
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
// }