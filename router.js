
avalon.scan();

//路由定义
require(["mmRouter", "mmRequest"], function () {
    //首页，
    //监听路由
    avalon.router.get('/', function () {
        //调用门禁
        door.comeIn(openAccessDoing);
        layout.url="./body/home.html"
        //加载所依赖的VM
        require(['home'], function () {
            //执行VM加载成功之后执行的页面变化

            avalon.scan()
        })
    });



    //登录页面//注册页面//找回密码页面
    avalon.router.get('/stb', function () {
        //调用门禁
        door.comeIn(openAccessDoing);
//        layout.url="./body/home.html"
        //加载所依赖的VM
        require(['stb'], function () {
            stb.ready()
            //执行VM加载成功之后执行的页面变化
            modal.url="./plugins/strawberry/stb.html";
            modal.getIn(350)
            avalon.scan()
        })
    });


    //开始监听
    avalon.history.start();
    //扫描
    avalon.scan();
});