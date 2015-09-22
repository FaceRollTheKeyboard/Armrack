/**
 * 门禁系统，设计者：mooshroom
 * 当前版本，v0.1.5
 * 20150501
 */

//验证是否为登陆状态

define("door", function () {

    function heart(){
        //保持心跳
        var heart=window.setInterval(function () {
            if(door.logined&&!door.hearting){
                door.hearting=true
                var now = new Date();
                ws.call({
                    i:"User/refresh",
                    data:{
                        Token:cache.go("Token")
                    },
                    success: function (res) {
                        if(!res.err){
                            cache.go({Token:undefined})
                            cache.go({
                                "un": res.UN,
                                "uid": res.UID,
                                "Token":res.Token
                            })

                            quickStart.inSide=true;
                            quickStart.user.UserName=res.UN
                            quickStart.user.uid=res.UID

                            //quickStart.getStores()
                            console.log("uid:"+quickStart.user.uid)
                        }
                        else{
                            door.logined = false;

                            //执行已经登录的预定动作
                            cache.go({
                                "tsy": "",
                                "un": "",
                                "uid": "",
                                "Token":""
                            })

                            window.clearInterval(now)

                            tip.on("您的登录已失效，请重新登录")
                            window.location.href="#!/login"
                        }
                    }

                })
            }


        }, 600000)
    }

    return door = {
        locked: true,//门禁状态
        logined: false,//用户登录状态
        hearting:false,
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

                    ws.call({
                        i: "User/autoLogin",
                        data:{
                            Token:cache.go('Token')
                        },
                        success: function (data) {
                            door.locked = false;
                            if (data.err) {
                                door.logined = false;

                                //执行已经登录的预定动作
                                active.notLogin();
                                cache.go({
                                    "tsy": "",
                                    "un": "",
                                    "uid": "",
                                    "Token":""
                                })
                            }
                            else {
                                door.logined = true;

                                //执行已经登录的预定动作
                                if(active.haveLogin){
                                    active.haveLogin();
                                }

                                cache.go({
                                    "un": data.UN,
                                    "uid": data.UID,
                                    "Token":data.Token
                                })

                                quickStart.inSide=true;
                                quickStart.user.UserName=data.UN
                                quickStart.user.uid=data.UID

                                quickStart.getStores()
                                console.log("uid:"+quickStart.user.uid)

                                heart()

                            }
                        }
                    });
                });
            }
            else {
                //判断为跳转，使用内存抓取验证登录
                if (door.logined == true) {

                    heart()
                    //判断为已经登录，执行已登录动作
                    active.haveLogin();
                }
                else {

                    //执行未登录动作
                    active.notLogin();

                }
            }


        }
    }
});


