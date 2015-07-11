/**
 * Created by mooshroom on 2015-07-10.
 * 版本：-
 * -
 */
define([
        //引入所依赖的文件
        "avalon",
        'text!../../ui/uploader/uploader.html',
        'css!../../ui/uploader/uploader.css',
        '../../ui/uploader/webuploader'
    ],
    function (avalon, html) {
        var widget = avalon.ui.uploader = function (element, data, vmodels) {
            var options = data.uploaderOptions//取得配置
            var objId = data.uploaderId//声明新生成组件的ID
            /**
             * 这里之所以要用"data.tipOptions"以及"data.tipId"，是因为我们这里定义的是："avalon.ui.tip"
             * 所以，如果我们定义的是"avalon.ui.xxx",那么这里就要使用data.xxxOptions和data.xxxId
             * 为什么？因为avalon给你把字符串拼接好了~要换一套规则，就去修改他源码吧
             */

            var vm = avalon.define({
                $id: objId,

                //使用$init可以让avalon自动在加载成功之后执行里面的方法
                $init: function () {
                    //填充DOM结构
                    element.innerHTML = html

                    //扫描新添加进来的DOM节点，一定要传第二个参数，否则有的东西扫描不到
                    avalon.scan(element, [vm].concat(vmodels))

                    /*
                     * 组件的$init方法里面,
                     * 在扫描后最好再调用一个onInit回调,传入当前组件的 vmodel, options, vmodels, this指向当前元素
                     * 这样用户就不需要定义组件的$id了
                     * (据说是这样，然而并没有感觉到什么卵用)
                     */
                    if (typeof vm.onInit === "function") {
                        vm.onInit.call(element, vm, options, vmodels)
                    }

                },

                //自爆~，自我销毁函数，在组件移除的时候自动调用这里面的方法
                $remove: function () {
                    element.innerHTML = ""

                },

                //并不知道有什么用，但是规范上面说要有这个方法（囧）
                onInit:function(){

                },

                /********以下是正常的组件的各个属性********/

                /********以上是正常的组件的各个属性********/
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