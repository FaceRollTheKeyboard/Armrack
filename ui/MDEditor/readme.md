# md格式编辑器组件
mooshroom  2015-7-10

email：<mooshroom@tansuyun.cn>

---
## 功能
1. 在网页上插入一个用于编写文章的编辑器
1. 编辑器基于markdown语法
1. 可以实时预览
1. 可以切换编辑状态（编辑，实时预览，阅读）
1. 可以通过工具栏快速编辑格式
1. 可以上传插入图片
1. 可以导入一个本地文件（文本格式）
1. 可以保存当前编辑的文本到本地（chrome、firefox支持此功能）

## 依赖
markdown语法解析器：**markdown.js**（如果没有就直接没法实时预览了）

代码美化插件：**prettify.js**（如果没有，就没法代码上色了）

模态框组件：**modal.js**（如果没有，需要弹出模态框的功能就会失效）

上传组件：**uploader.js**（如果没有就不能上传图片）

提示组件：**tip.js**（没有就没法弹出一些提示，可以不要）


## 用法
### 第一步：引入
将MDEditor组件包以及其依赖的组件包弄到项目里面，其中MDEditor的全部文件如下：

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-14/55a46ff2005cf.png)

### 第二步：配置依赖路径
在MDEditor.js中如图位置，配置组件所依赖的文件的路径

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-14/55a471576e812.png)


### 第三步：标记组件降落点
在需要引入的地方编写如下：
```html
<div ms-controller="demoMDEditor">
    <div ms-widget="MDEditor,MDEditor,$opt"></div>
    <div ms-widget="tip,tip"></div>
</div>
```
第三行的tip组件视情况引入；

### 第四步：引入主文件，加载配置
编写js：
```javascript
require(['../../ui/MDEditor/MDEditor','../../ui/tip/tip'],function(){
            var demoMDEditor=avalon.define({
                $id:"demoMDEditor",
                ready:function(){},
                $opt:{}
            })
            avalon.scan()
        })
```

## 注意

如果需要获得当前正在编辑的文档可以访问组件视图模型内的```md```属性，

要获得编译之后的html可以访问其中的```html```属性获得。

在传入配置时，可以设置是否在启动编辑器时加载上一次的文档，通过传入```loadLocaDoc:true```  可设置为是，如果不传默认为是，特殊情况需要不加载上一次的文档