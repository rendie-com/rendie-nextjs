Object.assign(Tool, {
    common2: {
        obj: {
            pic_shopee: {},//加入到【shopee放大镜图】要用
            attrPic_shopee: [],//加入到【shopee放大镜图】要用
            desPic_shopee: {},//加入到【shopee放大镜图】要用
            shopee_8pic: [],//去重复和合计个数用的
            DHpic: [],//加入到【shopee放大镜图】要用
            pic: ""//首图
        },
        a01: function (oo) {
            let _1688_html = ""
            if (oo.list[2][0]) {
                let pic_shopee = JSON.parse(oo.list[2][0].pic_shopee);
                let attrPic_shopee = JSON.parse(oo.list[2][0].attrPic_shopee);
                let desPic_shopee = JSON.parse(oo.list[2][0].desPic_shopee);
                this.obj.pic_shopee = pic_shopee;
                this.obj.attrPic_shopee = attrPic_shopee;
                this.obj.desPic_shopee = desPic_shopee;
                this.obj.pic = oo.pic;
                this.obj.shopee_8pic = oo.shopee_8pic ? JSON.parse(oo.shopee_8pic) : [];
                ////////////////////////////////////////
                _1688_html = '\
                <tr>\
                    <td class="right" style="padding-left:25px;position: relative;">'+ this.b08('pic_shopee', oo.proid) + '1688放大镜图：</td>\
                    <td>'+ this.b07(this.obj.pic_shopee, oo.proid) + '</td>\
                </tr>\
                <tr>\
                    <td class="right" style="padding-left:25px;position: relative;">'+ this.b08('attrPic_shopee', oo.proid) + '1688属性图：</td>\
                    <td>'+ this.b03(attrPic_shopee, oo.proid) + '</td>\
                </tr>\
                <tr>\
                    <td class="right" style="padding-left:25px;position: relative;">'+ this.b08('desPic_shopee', oo.proid) + '1688详情图：</td>\
                    <td>'+ this.b07(desPic_shopee, oo.proid) + '</td>\
                </tr>'
            }
            return this.a02(_1688_html, oo)
        },
        a02: function (_1688_html, oo) {
            let aliexpress_html = ''
            if (oo.list[3][0]) {
                let DHpic = JSON.parse(oo.list[3][0].DHpic)
                this.obj.DHpic = DHpic;
                let DHdesPic = JSON.parse(oo.list[3][0].DHdesPic)
                this.obj.DHdesPic = DHdesPic;
                aliexpress_html = '\
                <tr>\
                    <td class="right" style="padding-left:25px;position: relative;">'+ this.b08('DHpic', oo.proid) + 'aliexpress放大镜图：</td>\
                    <td>'+ this.b02(DHpic, "DHpic", oo.proid) + '</td>\
                </tr>\
                <tr>\
                    <td class="right" style="padding-left:25px;position: relative;">'+ this.b08('DHdesPic', oo.proid) + 'aliexpress详情图：</td>\
                    <td>'+ this.b02(DHdesPic, "DHdesPic", oo.proid) + '</td>\
                </tr>'
            }
            return this.a03(_1688_html, aliexpress_html, this.b05(oo.pic, this.obj.shopee_8pic, oo.proid))
        },
        a03: function (_1688_html, aliexpress_html, shopee_html) {
            return '\
            <tr>\
                <td class="right">shopee放大镜图：</td>\
                <td>' + shopee_html + '</td>\
            </tr>'+ _1688_html + aliexpress_html
        },
        //////////////////////////////////////////////////////////
        b01: function (i, pic, field, proid) {
            let html = "";
            // let str1 = '\
            // <a href="javascript:;" onclick="Tool.common2.c01(\'pic\',\'' + pic + '\',\'' + proid + '\')" title="设置为【首图】">设置为【首图】</a>  | \
            // <a href="javascript:;" onclick="Tool.delPic.a01($(this),\'' + pic + '\',\'' + field + '\',\'' + proid + '\')">删除</a>';
            if (pic != 0) {
                html = '\
                <figure class="figure border mb-1 p-1">\
                    '+ this.b09(pic) + '\
                    <figcaption class="figure-caption text-center" style="position: relative;height: 30px;line-height: 40px;">'+ this.b10(pic, proid) + (i + 1) + this.b12(pic) + '</figcaption>\
                </figure>'
            }
            return html;
        },
        b02: function (arr, field, proid) {
            let rArr = []
            for (let i = 0; i < arr.length; i++) {
                rArr.push(this.b01(i, arr[i].picB.shopee, field, proid))
            }
            return rArr.join("");
        },
        b03: function (arr, proid) {
            let rArr = []
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    rArr.push(this.b04(i, arr[i].shopee, proid))
                }
            }
            return rArr.join("");
        },
        b04: function (i, pic, proid) {
            let html = "";
            if (pic) {
                html = '\
                <figure class="figure border mb-1 p-1">\
                    '+ this.b09(pic) + '\
                    <figcaption class="figure-caption text-center" style="position: relative;height: 30px;line-height: 40px;">\
                    '+ this.b10(pic, proid) + (i + 1) + this.b12(pic) + '\
                    </figcaption>\
                </figure>'
            }
            return html;
        },
        b05: function (pic, shopee_8pic, proid) {
            let html = ""
            for (let i = 0; i < shopee_8pic.length; i++) {
                let str1 = '<a href="javascript:;" onclick="Tool.common2.c04(\'' + shopee_8pic[i] + '\',\'' + proid + '\')">删除</a>';
                html += '\
                <figure class="figure border mb-1 p-1">\
                    '+ this.b09(shopee_8pic[i]) + '\
                    <figcaption class="figure-caption text-center">\
                        '+ (i + 2) + '.' + str1 + (shopee_8pic[i] == pic ? '<font color=red>（与首图重复）</font>' : '') + '\
                    </figcaption>\
                </figure>'
            }
            return '\
            <figure class="figure border mb-1 p-1">\
                '+ this.b09(pic) + '\
                <figcaption class="figure-caption text-center">1 <font color=#999>（首图）</font></figcaption>\
            </figure>'+ html
        },
        b06: function (num, pic, proid) {
            let html = "";
            if (pic) {
                html = '\
                <figure class="figure border mb-1 p-1">\
                    '+ this.b09(pic) + '\
                    <figcaption class="figure-caption text-center" style="position: relative;height: 30px;line-height: 40px;">\
                        '+ this.b10(pic, proid) + num + this.b12(pic) + '\
                    </figcaption>\
                </figure>'
            }
            return html;
        },
        b07: function (imgObj, proid) {
            let rArr = [], num = 0;
            for (let k in imgObj) {
                if (imgObj[k] == "width<400||height<400" || imgObj[k] == "[不是图片]") { }
                else {
                    num++;
                    rArr.push(this.b06(num, imgObj[k], proid))
                }
            }
            return rArr.join("");
        },
        b08: function (name, proid) {
            return '\
            <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
            <ul class="dropdown-menu">\
                <li onClick="Tool.common2.c02(\''+ name + '\',\'' + proid + '\');"><a class="dropdown-item pointer">加入到【shopee放大镜图】</a></li>\
            </ul>'
        },
        b09: function (pic) {
            return '\
            <div class="easyzoom easyzoom--overlay">\
                <a href=\"https://s-cf-sg.shopeesz.com/file/' + pic + '\">\
                    <img src="https://s-cf-sg.shopeesz.com/file/'+ pic + '_tn"  class="figure-img img-fluid mb-0 rounded w200">\
                </a>\
            </div>'
        },
        b10: function (pic, proid) {
            return '\
            <button title="操作" class="menu-button" data-bs-toggle="dropdown" aria-expanded="false"><div></div><div></div><div></div></button>\
            <ul class="dropdown-menu">\
                <li onClick="Tool.common2.c05(\''+ pic + '\',\'' + proid + '\');"><a class="dropdown-item pointer">加入到【shopee放大镜图】</a></li>\
                <li onClick="Tool.common2.c01(\''+ pic + '\',\'' + proid + '\');"><a class="dropdown-item pointer">设置为【首图】</a></li>\
            </ul>'
        },
        b12: function (pic) {
            let html = '';
            if (this.obj.shopee_8pic.indexOf(pic) != -1) {
                html = ' <font color=#999999>（shopee放大镜图）</font>'
            }
            else if (pic == this.obj.pic) {
                html = ' <font color=#999999>（shopee首图）</font>'
            }
            return html
        },
        /////////////////////////////////////////////
        c01: function (pic, proid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.pic=" + Tool.rpsql(pic) + " where @.proid='" + proid + "'",
            }]
            Tool.ajax.a01(data, Tool.reload);
        },
        c02: function (name, proid) {
            if (name == "pic_shopee" || name == "desPic_shopee") {
                let o1 = this.obj[name]
                for (let k in o1) {
                    if (o1[k] != "width<400||height<400" && o1[k] != "[不是图片]" && o1[k] != this.obj.pic) {
                        if (this.obj.shopee_8pic.length < 8) {
                            if (this.obj.shopee_8pic.indexOf(o1[k]) == -1) this.obj.shopee_8pic.push(o1[k]);
                        }
                        else { break; }
                    }
                }
                this.c03(proid)
            }
            else if (name == "attrPic_shopee") {
                let arr = this.obj[name]
                for (let i = 0; i < arr.length; i++) {
                    if (this.obj.shopee_8pic.length < 8) {
                        if (arr[i].shopee && this.obj.shopee_8pic.indexOf(arr[i].shopee) == -1) this.obj.shopee_8pic.push(arr[i].shopee);
                    }
                    else { break; }
                }
                this.c03(proid)
            }
            else if (name == "DHpic" || name == "DHdesPic") {
                let arr = this.obj[name]
                for (let i = 0; i < arr.length; i++) {
                    if (this.obj.shopee_8pic.length < 8) {
                        if (this.obj.shopee_8pic.indexOf(arr[i].picB.shopee) == -1) this.obj.shopee_8pic.push(arr[i].picB.shopee);
                    }
                    else { break; }
                }
                this.c03(proid)
            }
            else {
                Tool.pre("到不了这里")
            }
        },
        c03: function (proid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.shopee_8pic=" + Tool.rpsql(JSON.stringify(this.obj.shopee_8pic)) + " where @.proid='" + proid + "'",
            }]
            Tool.ajax.a01(data, Tool.reload);
        },
        //删除
        c04: function (pic, proid) {
            let arr = []
            for (let i = 0; i < this.obj.shopee_8pic.length; i++) {
                if (this.obj.shopee_8pic[i] != pic) {
                    arr.push(this.obj.shopee_8pic[i])
                }
            }
            this.obj.shopee_8pic = arr;
            this.c03(proid);
        },
        //添加
        c05: function (pic, proid) {
            if (this.obj.shopee_8pic.length < 8) {
                if (this.obj.shopee_8pic.indexOf(pic) == -1) {
                    this.obj.shopee_8pic.push(pic)
                }
                this.c03(proid);
            }
            else {
                Tool.at("已有9个图片了，不能再增加了。")
            }
        },
    }
})