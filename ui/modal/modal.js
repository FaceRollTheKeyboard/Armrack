/**
 * Created by mooshroom on 2015/3/12.
 */
var modal = avalon.define({
    $id: "modal",
    url: "",
    toggle: false,

    ready:function(){
        require.config({
            paths:{
                modalcss:"../../plugins/modal/modal.css"
            }
        })
        require(['css!modalcss'],function(){

        })
    }

    //*获取全局变量*/
    , wh: ""//屏幕高度
    , ww: ""//屏幕宽度
    , mw: "0"//模态框宽度
    , mh: "0"//模态框高度
    , x: ""//&top
    , y: "",//&left
    mx: "",//鼠标X坐标
    my: "",//鼠标Y坐标

    times:0

    //*模态框弹出*/
    , getIn: function (mwo) {



            modal.x = modal.mx;
            modal.y = modal.my;
            modal.toggle = true;
            window.setTimeout(function () {

                var o = mwo || 600;//默认模态框宽度

                //设置屏幕
                modal.wh = window.innerHeight || window.screen.availHeight;
                modal.ww = window.innerWidth || window.screen.availWidth;
                modal.x = (modal.ww - o) / 2;
                modal.y = 100;
                modal.mw = o;
                modal.mh = "auto";

            }, 1)
            document.body.style.overflowY = "hidden";
        modal.times++




    }
    //*模态框关闭*/
    , getOut: function () {
        if (modal.toggle) {
//            modal.mousePos();
            if (modal.mx < modal.x || modal.mx > (modal.x + modal.mw)) {
                modal.y = "-400";//鼠标Y坐标&left
                window.setTimeout(function () {
                    modal.mw = "0";//模态框宽度
                    modal.mh = "0";//模态框高度

                    history.go(-modal.times);
                    modal.times=0;
                    modal.toggle = false;
                }, 100)
                document.body.style.overflowY = "auto"
            }
        }
//
    },
    //使用按钮关闭模态框
    getOutByBtn: function () {
        if (modal.toggle) {
            modal.y = "-400";//鼠标Y坐标&left
            window.setTimeout(function () {
                modal.mw = "0";//模态框宽度
                modal.mh = "0";//模态框高度

                history.go(-modal.times);
                modal.times=0;
                modal.toggle = false;
            }, 100)
            document.body.style.overflowY = "auto"
        }

    },
    //使用路由关闭
    getOutByRouter:function(){
        if (modal.toggle) {
            modal.y = "-400";//鼠标Y坐标&left
            window.setTimeout(function () {
                modal.mw = "0";//模态框宽度
                modal.mh = "0";//模态框高度

                modal.times=0;
                modal.toggle = false;
            }, 100)
            document.body.style.overflowY = "auto"
        }
    }



})
/***********获取鼠标位置****************/
function mouseMove(ev) {
    ev = ev || window.event;
    var mousePos = mouseCoords(ev);
//alert(ev.pageX);
    modal.mx = mousePos.x;
    modal.my = mousePos.y;
}

function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY};
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

document.onmousemove = mouseMove;
modal.ready()
