/**
 * Created by Administrator on 2015-02-11.
 */


require.config({
    paths: {
        //这里只定义插件以及灵魂的外部入口，插件内部所依赖的在插件内部的ready函数内定义
        MDEditor:'../../plugins/MDEditor/MDEditor.js',
        modal:'../../plugins/modal/modal.js',
        stb:'../../plugins/strawberry/stb.js',

        marked:"../../plugins/MDEditor/markdown.js",
        MDcss:"../../plugins/MDEditor/MDEditor.css",
        prettify:"../../plugins/MDEditor/prettify.js",

        //soul
        home:"../../soul/home.js",
        nav:"../../soul/nav.js",
        ui:"../../soul/ui.js"
    }

});

// 预先定义好的TSY，方便操作接口的时候直接调用
var tsy;
function setTsy(){
    tsy = getCookie("tsy");
}
setTsy();

//接口地址
//var apiURL = 'http://demo.api.tansuyun.cn/index.html?i=';
var apiURL = 'https://api.tansuyun.cn?i=';

//开放的权限下的登录验证之后的操作
var openAccessDoing = {
    haveLogin: function () {


    },
    notLogin: function () {

    }
};
//严格的权限下的登录验证之后的操作
var seriousAccessDoing = {
    haveLogin: function () {
        nav.haveLogin()
    },
    notLogin: function () {
        window.location.href = '#!/login_page';
        tip.on('您尚未登录或登录已失效，请登录后再执行本次操作！', 0);
        setTimeout(function () {
            tip.off('您尚未登录或登录已失效，请登录后再执行本次操作！', 0);
        }, 15000);
    }
};

//getCookie用于取cookie中的数据

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
//setCookie用于将数据存于cookie中

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}


function getDoc(url){
    require(["marked", "prettify",'css!MDcss'],function(){
        avalon.ajax({
            type:"get",
            url:url,
            success:function(res){
                layout.doc=marked(res)
//                        console.log(res)
                prettyPrint();
            }
        })
    })
}


