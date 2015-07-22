# Armrack
基于avalon的ui组件库

---
## 当前进度：
1. 编写MD编辑器文档
1. 编写上传组件的文档


## 已完成：
1. tip系统提示组件
1. modal弹出框组件
1. MDEditor编辑器组件
1. 图片上传组件
1. 文件上传组件

## 计划执行：
1. 日期选择组件
1. css3基础动效库
1. 标签页组件

# 组件开发规范
詹伟 2015年7月22日 v0.0.0

---
## 目录规范
组件目录需要将组件所有文件放置于以组件名称命名的文件夹内，文件夹应位于‘./ui’目录下，例如：

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-22/55aef6a84cb88.png)

对于组件**全局依赖**（所有组件都需要的框架性文件例如avalon.js以及jquery.js）的JS文件，需要放置于```./src/js/```目录下。

对于组件局部依赖（只有这个组件或少数组件需要）的文件，需要放置于组件包内。例如上图中的 webuploader.js 以及 Uploader.swf这两个文件

每个组件包内必须含有文档文件（readme.md）以及测试示例文件（demo.html）。Armrack组件库会自动抓取这两个文件来形成包含示例的文档页面。所以一定要按规范创建！

每个组件一定包含一个以组件名称命名的JS文件作为组件的主文件，例如uploader组件的核心文件就是```./ui/uploader/uploader.js```。

可能需要的样式层文件（组件名.css）以及结构层文件（组件名.html）也使用与核心文件同样的命名方式。以便维护管理
## 流程规范
### 一、注册组件
打开根目录下的```ui.json```文件：

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-22/55aefa2925c0f.png)

在如图所示的地方添加你要添加的新组件，其中“name”属性为组件的名称，“info”属性为组件的简单说明

### 二、创建文件
按目录规范在```./ui/```目录下创建组件所需要的各种文件，并且一定要创建测试文件（demo.html）以及文档文件（readme.md）

### 三、编写组件
按avalon组件编写规范编写核心文件，模版如下所示：
```javascript
/**
 * Created by mooshroom on 2015-06-12.
 * 版本：V3.0.0
 * 使用avalon组件模式重构
 * name 组件
 * 这个是模版文件，注意将name替换为你要编写的组件的名称
 */
define([
        //引入所依赖的文件
        "avalon",
//        'text!../../ui/name/name.html',
//        'css!../../ui/name/name.css'
    ],
    function (avalon, html) {
        var widget = avalon.ui.name = function (element, data, vmodels) {
            var options = data.nameOptions//取得配置
            var objId = data.nameId//声明新生成组件的ID
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
```
### 四、编写示例
编写示例（demo.html）对组件进行测试和展示，下面是提示组件的示例文件：
```html
<div ms-controller="tipDemo">

    <!--关键代码-->
    <div ms-widget="tip,tip,$opt"></div>

    <!--以下都是用户测试用的仪表盘-->
    <h2>提示框使用测试</h2>
    <div class="radio">
        <label>
            <input type="radio" name="optionsRadios"  value="1" checked ms-duplex-string="a">
            来一个普通的提示
        </label>
    </div>
    <div class="radio">
        <label>
            <input type="radio" name="optionsRadios"  value="0" ms-duplex-string="a">
            来一个错误提示
        </label>
    </div>
    要提示的内容：
    <input type="text" class="form-control" ms-duplex="text"/>
    存在的时间长度：
    <input type="number" class="form-control" ms-duplex="time"/>
    <br/>
    <button class="btn btn-primary" ms-click="tipOn">点击弹出提示</button>
    <button class="btn btn-default" ms-click="tipOff">点击关闭提示</button>
</div>
<script>

    //引入组件，引入了就搞定了~
    require(["../../ui/tip/tip.js"],function(){

        //配置父元素的VM
        var tipDemo=avalon.define({
            $id:"tipDemo",
            $opt:{},
            a:1,
            text:"233",
            time:3000,
            tipOn:function(){
                tip.on(tipDemo.text,tipDemo.a,tipDemo.time)
            },
            tipOff:function(){
                tip.off(tipDemo.text,tipDemo.a,tipDemo.time)
            }
        })
        avalon.scan()
    })

</script>
 ```
### 五、编写文档
使用markdown格式编写组件的使用文档，其中，文档的开头必须这样写：
```markdown
# Tip提示组件
mooshroom  2015-6-16

email：<mooshroom@tansuyun.cn>

---
 ```
必须包含组件名称；组件中文名；作者；创作时间；联系邮箱

### 六、发布
完成完整的测试以及文档编写之后即可通过提交代码发布该组件。




