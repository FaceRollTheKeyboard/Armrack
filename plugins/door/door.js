/**
 * 门禁系统，设计者：mooshroom
 * 当前版本，v0.1.5
 * 20150501
 */

//验证是否为登陆状态

define("door", function () {
    return door = {
        locked: true,//门禁状态
        logined: false,//用户登录状态

        //登录判断开始
        comeIn: function (fn) {

            //执行动作配置
            var active = {
                haveLogin: fn.haveLogin,
                notLogin: fn.notLogin
            };

            //判断是刷新还是跳转
            if (door.locked == true) {

                //判断为刷新，使用请求验证登录
                require(['mmRequest'], function () {

                    $.call({
                        i: 2,
                        type: 'post',
                        crossDomain: true,
                        dataType: 'json',
                        success: function (data) {
                            door.locked = false;
                            if (data.uid=="") {
                                door.logined = false;

                                //执行已经登录的预定动作
                                active.notLogin();

                            }
                            else {
                                door.logined = true;

                                //执行已经登录的预定动作
                                if(active.haveLogin){
                                    active.haveLogin();
                                }



                                nav.inSide=true;
                                nav.user.UserName=data.un
                                nav.user.uid=data.uid
                                console.log("uid:"+nav.user.uid)

                            }

                            cache.go({
                                "tsy": data.tsy,
                                "un": data.un,
                                "uid": data.uid,
                                "HURL":data.HURL
                            })

                        }
                    });
                });
            }
            else {
                //判断为跳转，使用内存抓取验证登录
                if (door.logined == true) {

                    //判断为已经登录，执行已登录动作
                    active.haveLogin();
                }
                else {

                    //执行未登录动作
                    active.notLogin();

                }
            }

            //保持心跳
            setTimeout(function () {
                if(door.logined === true){
                    var now = new Date();
                    door.locked=true
                    door.comeIn({
                        haveLogin: function () {
                            console.log("来自" +
                                now.toLocaleString() +
                                "的心跳声：噗通！")
                        },
                        notLogin: function () {
                            console.log("来自" +
                                now.toLocaleString() +
                                "的咽气声：咯叽~")
                            alert("您与服务器的联系已被断开，尝试重新登录或检查您的网络")
                        }
                    })
                }


            }, 600000)
        }
    }
});


