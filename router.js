avalon.scan();

//路由定义
require(["mmRouter", "mmRequest", "nav"], function () {

    //根据UI表创建对应的路由和模块配置
    function newRouter(n) {
        avalon.router.get('/' + n, function () {
//            modal.getOutByRouter()
            var uiURL = './ui/' + n + "/";
            layout.url = uiURL + "demo.html";
            getDoc(uiURL + "README.md");
            require(["../../ui/" + n + "/" + n + '.js'], function () {
                console.log(n + "加载成功");
            });
        });
    }

    //获取文档
    function getDoc(url) {
        require(["marked", "prettify", 'css!../../ui/MDEditor/MDEditor'], function () {
            avalon.ajax({
                type: "get",
                url: url,
                success: function (res) {
                    layout.doc = marked(res);
//                        console.log(res)
                    prettyPrint();
                }
            });
        });
    }


    //监听路由
    avalon.router.get('/', function () {
        //调用门禁
//        modal.getOutByRouter()
        layout.url = "./body/none.html";
        //加载所依赖的VM
        require(["home"], function () {
            getDoc("./README.md");
            avalon.scan();
        })
    });



    //获取ui列表
    avalon.ajax({
        type: "get",
        url: "./ui.json",
        success: function (res) {
            cache.go(res);

            //生成路由
            for (var i = 0; i < res.uiList.length; i++) {
                var n = res.uiList[i].name;
                //构建路由
                newRouter(n);
                console.log(n);
            }
            //开始监听路由
            avalon.history.start();
        }
    });

    //开始监听

    //扫描
    avalon.scan();
});