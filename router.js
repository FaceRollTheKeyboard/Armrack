avalon.scan();

//路由定义
require(["mmRouter", "mmRequest", "nav"], function () {

    //根据UI表创建对应的路由和模块配置
    function buildRouter(l){
        for(var i=0;i< l.length;i++){
            var n= l[i].name
            var path="../../ui/"+n+"/"+n+'.js'

            //构建路由
            avalon.router.get('/'+ n, function () {
                layout.url = "./ui/"+ n+"/doc.html"
                require([path],function(){
                    console.log(n+"加载成功")
                })
            });
            console.log(n)
        }
    }




    //监听路由
    avalon.router.get('/', function () {
        //调用门禁

        layout.url = "./body/home.html"
        //加载所依赖的VM
        require(["home"],function(){
            home.ready()
            avalon.scan()
        })
    });

    //组件列表
    avalon.router.get('/list', function () {
        //调用门禁
        modal.getIn(960)
        modal.url = "./body/list.html"
        require(["ui"], function () {
            ui.ready()
            avalon.scan()
        })
        //加载所依赖的VM
    });

    avalon.ajax({
        type: "get",
        url: "./ui.json",
        success: function (res) {
            cache.go(res)
            buildRouter(res.uiList)
            avalon.history.start();
        }
    })


    //开始监听

    //扫描
    avalon.scan();
});