/**
 * Created by mooshroom on 2015-06-12.
 * modal弹出框组件
 * 版本：V2.0.0
 * 使用avalon组件模式重构
 */
define([
    "avalon",
    'css!../../ui/modal/modal.css',
    '../../ui/modal/mousePos'
], function (avalon, css) {
    var widget = avalon.ui.modal = function (element, data, vmodels) {
        var options = data.modalOptions
        var objId = data.modalId
        var vm = avalon.define({
            $id: objId,
            $init: function () {


                ///初始化配置

                element.setAttribute("ms-visible", "toggle")

//                element.setAttribute("ms-css-width", "width")
//                element.setAttribute("ms-css-height", "height")

                element.setAttribute("ms-css-padding-top", "top")
                element.setAttribute("ms-css-padding-left", "left")
                element.setAttribute("ms-click", "getOut")
                element.className = 'tsy-modal'
                element.children[0].setAttribute("ms-css-opacity", "opacity")
                element.children[0].setAttribute("ms-css-transform", "transform")
                element.children[0].setAttribute('ms-on-mouseover','can(false)')
                element.children[0].setAttribute('ms-on-mouseleave','can(true)')
                //扫描
                avalon.scan(element, [vm].concat(vmodels))
                if (typeof vm.onInit === "function") {
                    vm.onInit.call(element, vm, options, vmodels)
                }


            },
            $remove: function () {
//                element.innerHTML = ""

            },
            onInit: function () {

            },

            /*具体实现*/
            url: "",
            toggle: false,
            //*获取全局变量*/

            mx: 0,//鼠标X坐标
            my: 0,//鼠标Y坐标

            sx: 0,//弹框开始位置X坐标
            sy: 0,//弹框开始位置Y坐标
            //鼠标位置
            getMouse:function(ev){
                console.log(ev)
                ev = ev || window.event;
//                var mousePos = mouseCoords(ev);
//alert(ev.pageX);
                //获取滚动高度
                var ST=0;
                if(document.documentElement&&document.documentElement.scrollTop)
                {
                    ST=document.documentElement.scrollTop;
                }
                else if(document.body)
                {
                    ST=document.body.scrollTop;
                }

                // 计算位置
                if(!vm.toggle){
                    vm.left=vm.mx = mousePos.x;
                    vm.top=vm.my = mousePos.y-ST;
                }
                else{
                    vm.mx = mousePos.x;
                    vm.my = mousePos.y;
                }


            },


            top: 0,
            left: 0,
            opacity: 1,
            transform: "scale(0)",

            times: 0
            //*模态框弹出*/
            , getIn: function (ev) {

                vm.getMouse(ev)


                vm.sx = vm.left
                vm.sy = vm.top
                vm.toggle = true;


                window.setTimeout(function () {
                    var ww=window.innerWidth || window.screen.availWidth;
                    console.log("ww:"+ww)
                    var bw=element.children[0].style.width
                    console.log("bw:"+bw)

                    if(bw==""||bw=="auto"){
                        //宽度为auto
                        vm.left=0
                    }
                    else if(bw.charAt(bw.length-1)=="%"){
                        //宽度为百分比
                        var num=Number(bw.slice(0,bw.length-1))
                        vm.left=ww*(100-num)/100/2
                    }
                    else if(bw.slice(bw.length-2,bw.length)=="px"){
                        var num=Number(bw.slice(0,bw.length-2))
                        vm.left=(ww-num)/2
                    }

                    vm.top=120
                    vm.width = "100%"
                    vm.height = "100%"
                    vm.transform = "scale(1)"
                }, 50)
                document.body.style.overflowY = "hidden";
                vm.times++


            },
            canGetOut: true,
            can: function (val) {
                vm.canGetOut = val
            }
            //*模态框关闭*/
            , getOut: function () {
                if (vm.canGetOut && vm.toggle) {
                    vm.left = vm.sx
                    vm.top = vm.sy
                    vm.transform = "scale(0)"
                    window.setTimeout(function () {
                        vm.toggle = false;
                    }, 250)
                    document.body.style.overflowY = "auto"

                }
                else{
                    console.log("canGetOut:"+vm.canGetOut+";toggle:"+vm.toggle)
                }

//
            },
            mustOut:function(){
                if(vm.toggle){
                    vm.left = vm.sx
                    vm.top = vm.sy
                    vm.transform = "scale(0)"
                    window.setTimeout(function () {
                        vm.toggle = false;
                    }, 250)
                    document.body.style.overflowY = "auto"
                }
            }



        })
        //传入配置，传入方法就是把option里面的属性和刚才创建的VM里面的属性搅拌起来
        avalon.mix(vm, options)

        //最后把创建好的VM赋值给当前域下面的以VM的ID为名称的对象里面去，我们就能在当前域调用了
        return this[objId] = vm
    }
    //这是给默认配置的地方，在这里暂时还用不上
    widget.defaults = {}

    //传说一定要这样,不过我注释了也没有什么异常
    return avalon
})