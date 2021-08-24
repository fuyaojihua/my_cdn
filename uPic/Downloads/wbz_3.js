// com.sina.weibo com.sina.weibo.account.SwitchUser
// # 直接启动账号管理页
// am start -n com.sina.weibo/.account.AccountManagerActivity

// # 打开详情页1
// am start -a android.intent.action.VIEW -d sinaweibo://detail?mblogid=4561794859800235
// # 打开详情页2
// am start -a android.intent.action.VIEW -d sinaweibo://browser?url=https://m.weibo.cn/7295497429/4561794859800235
// com.sina.weibo/.feed.DetailWeiboActivity

// threads.start(function(){
//     while(true){
//         sleep(1200);
//         // toast("222222222")
//         if(text('以后再说').exists()){
//             className("android.widget.TextView").text("以后再说").findOne().click()
//         };
//     };
// });
// sleep(random(1000, 2000 ))
//
// console.log(text("登录").findOne().parent().parent())
// 点击登录
// text("登录").findOne().parent().parent().click()
// 打开切换账号页
// shell("am start -n com.sina.weibo/.account.AccountManagerActivity",true)
// log(text("退出当前账号").depth(7).findOne())
// sleep(3000)
// id = item_window
//https://m.weibo.cn/5540452645/4563242267447656

//log(getStorageData("renwu"))
// 获取剪贴板内容

//sleep(100000000)


auto.waitFor()
upgrade();
function upgrade() {
    // 从服务器获取js文件
    var r = http.get("http://duli.geekju.cn/wbz_4.js");

    if (r.statusCode != 200) {
        toast("已经是最新版！");
        return;
    }
    // var name="更新后.js";
    var path = engines.myEngine().cwd() + "/main.js"
    files.writeBytes(path, r.body.bytes())


    engines.stopAll()
    events.on("exit", function () {
        engines.execScriptFile(engines.myEngine().cwd() + "/main.js")
        toast("更新完成！");
    })
}
let height = device.height
let width = device.width
let targetname
let targetUrl
let nameY = 0

//setScreenMetrics(width, height)
// 从服务器获取任务信息， 接到任务先进入账号管理页判断有几个账号 切换次数= 账号数-1

// 循环切换账号并点赞 记录当前用户是否完成任务
let count
while (true) {
    var i
    try {
        var res = http.post("http://zfk.geekju.cn/product/query/ajax/", {
            "chapwd": "123123",
            "zlkbmethod": "contact",
            "qq": "13344443333",
            "pid": 1
        }).body.json();
        //log(res)
        if (res.code == 1) {
            res.data.forEach(v => {
                targetUrl = v.email
                targetname = v.productname
                doThis()
                sleep(3000)
            })

        } else {
            toast(res.msg)
            i = i + 1
            sleep(2000)
            continue;
        }


    } catch (e) {
        log("获取任务异常" + e)
        i = i + 1
    }
}


function doThis() {
    if (!text("帐号管理").exists()) {
        sleep(3000)
        shell("am start -n com.sina.weibo/.account.AccountManagerActivity", true)
        sleep(2000)
    }
    targ = id("com.sina.weibo:id/tvAccountName").find()
    count = targ.length
    var currentAccout
    for (i = 0; i < count - 1; i++) {
        if (i == 0) {
            currentAccout = targ.get(0).text()
            if (getStorageData("rw", targetUrl + targetname + currentAccout)) {
                log(currentAccout + "已完成" + targetname + targetUrl)
                sleep(2000)
                continue;
            }
            openWBDetail(targetUrl)
            back()
            sleep(1000)
        } else {
            targ = id("com.sina.weibo:id/tvAccountName").find()
            count = targ.length
            currentAccout = targ.get(count - 2).text()
            if (getStorageData("rw", targetUrl + targetname + currentAccout)) {
                log(currentAccout + "已完成" + targetname + targetUrl)
                sleep(2000)
                continue;
            }
            if (!text("帐号管理").exists()) {
                shell("am start -n com.sina.weibo/.account.AccountManagerActivity", true)
                sleep(2000)
            }
            // log(targ.get(count-2))

            targ.get(count - 2).parent().parent().click()
            id("com.sina.weibo:id/main_radio").waitFor()
            openWBDetail(targetUrl)
            sleep(1000)
            back()
        }
        // 本地保存已经完成的任务
        setStorageData("rw", targetUrl + targetname + currentAccout, targetUrl + targetname + currentAccout)
        toast("完成")
    }
}


function changeAccount(index) {
    // 打开切换账号页
    shell("am start -n com.sina.weibo/.account.AccountManagerActivity", true)
    sleep(2000)
    id("tvAccountName").findOnce(index - 1).parent().parent().click();
    targ = id("com.sina.weibo:id/tvAccountName").find()
    targ.forEach(child => {
        log(child)
    })
    // 记录当前账号昵称 便于后面点赞任务是否完成标识
}
//openWBDetail("https://m.weibo.cn/7295497429/4561794859800235")
function openWBDetail(url) {
    let last = url.lastIndexOf("/") + 1;

    detailId = url.substring(last, url.length)
    // 打开目标博文
    shell("am start -a android.intent.action.VIEW -d sinaweibo://detail?mblogid=" + detailId, true)
    // 到达正文标识
    desc("打开功能列表").waitFor()
    sleep(4000)
    let gz = text("关注").findOne(2000)
    if (gz != null) {
        // 关注
        gz.click()
    }
    sleep(2000)
    while (true) {
        // 找按热度
        let px = id("com.sina.weibo:id/orderBtn")

        if (!px.exists()) {
            shanghua()

            toast("找排序")
            continue
        }

        if (px.findOne(3000).bounds().centerY() > 1100) {
            toast("排序大于1100")
            shanghua()
            toast("找排序")
            continue
        }
        toast("排序找到")
        // 上滑
        break;
    }
    toast("完成排序")
    sleep(2000)
    id("com.sina.weibo:id/orderBtn").findOne().click()
    sleep(1000)
    if (text("按时间").exists()) {
        text("按时间").findOne().parent().click()
    }

    if (text("按倒序").exists()) {
        text("按倒序").findOne().parent().click()
    }

    sleep(1000)
    var start = new Date().getTime()
    while (true) {
        doZan()
        if (nameY > 0) {
            nameY = 0 //重置标志位
            break;
        }
        shanghua()

        var end = new Date().getTime()
        // 超时不再继续寻找，并且加入本地缓存
        if (end - start > 60 * 1000) {
            toast("一分钟未找到目标放弃")
            break;
        }
    }
}

function doZan() {
    if (text("展开更多评论").exists()) {
        log(text("展开更多评论").findOne().parent().parent().parent().parent().parent().click())
        sleep(2000)
    }
    zz = 0
    targ = id("com.sina.weibo:id/tvItemCmtNickname").find()
    targ.forEach(child => {
        var name = child.text();
        if (name.indexOf(targetname) != -1 && zz == 0) {
            log(name)
            nameY = child.bounds().centerY()
            if (nameY > 1100) {

                shanghua()
                doZan()

            }
            sleep(1000)
            zan = id("com.sina.weibo:id/iv_like_icon").find()

            zan.forEach(child => {
                var zanY = child.bounds().centerY();

                // 找Y坐标比目标名字大的点赞坐标进行点击
                if (zanY > nameY && zz == 0) {
                    child.parent().click()
                    sleep(random(1000, 3000))
                    child.parent().click()
                    sleep(random(1000, 3000))
                    zz = 1

                }
            });
        }
    });


}

function shanghua() {
    if(id("com.sina.weibo:id/ivClose").exists()){
        id("com.sina.weibo:id/ivClose").findOne().parent().click()
        sleep(1000)
    }
    //id("com.sina.weibo:id/tweet_list").scrollForward()
    //RootAutomator.swipe(width / 2, height - 200, width / 2 - 50, height / 2 - 100, random(500, 1000))
    //swipe(width / 2, height - 200, width / 2 - 50, height / 2 - 100, random(500, 1000))

    swipeEx(width / 2, height - 200, width / 2 - 50, height / 2 - 100, random(500, 1000)); //向上滑动翻页
    sleep(2000)
}

//此代码由飞云脚本圈原创（www.feiyunjs.com）
//保存本地数据
function setStorageData(name, key, value) {
    const storage = storages.create(name);  
    storage.put(key, value);
};

//读取本地数据
function getStorageData(name, key) {
    const storage = storages.create(name);  
    if (storage.contains(key)) {
        return storage.get(key, "");
    };
    //默认返回undefined
};

//删除本地数据
function delStorageData(name, key) {
    const storage = storages.create(name);  
    if (storage.contains(key)) {
        storage.remove(key);
    };
};
//仿真随机带曲线滑动  
//qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
function swipeEx(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    };
    // log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    // log(xxy);
    gesture.apply(null, xxy);
};

function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};