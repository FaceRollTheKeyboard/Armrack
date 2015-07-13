# 图片上传组件
mooshroom  2015-7-10

email：<mooshroom@tansuyun.cn>

---
## 功能
1. 用于在浏览器上上传图片或者文件（目前对图片进行了UI的优化）
1. 可以拖拽上传
1. 可以使用```Ctrl+C```、```Ctrl+V```选择图片
1. 可配置上传成功后的回调方法

## 依赖
1. 提示组件：tip（用户弹出一些提示）
1. 百度webuploader.js（核心文件，必须有）
1. avalon.js（框架，必须有）

## 用法
### 第一步：引入组件的整个文件包

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-13/55a3b58fcabfd.png)

### 第二步：检查依赖的路径

![输入图片描述](http://images.tansuyun.cn/Image/TSY/2/2015-07-13/55a3b5e9a064d.png)

如果按照碳素云规范文件路径构建的项目则不需要修改这里，否则你需要调整这里的依赖文件所在的路径。

### 第三步：标记组件降落点
编写DOM结构如下：
```html
<div ms-controller="demo">
    <div ms-widget="uploader,uploader,$opt"></div>
    <div ms-widget="tip,tip,$opt"></div>
</div>
```
（如果全局已经有了TIP组件这里就不需再构建一个了）
### 第四步：动态加载组件主文件并传入配置
传入的配置实际上为webuploader的配置文件，通过这个配置可以生成不同的上传工具，

另外通过传入success属性来设置额外的回调函数，组件会在上传成功之后向这个函数传入file（所上传的文件，详细参考[webuploader](http://fex.baidu.com/webuploader/getting-started.html)的文档）以及res（从服务器返回的完整数据）

代码如下：
```javascript
avalon.ready(function(){
        require(['../../ui/uploader/uploader','../../ui/tip/tip'],function(){
            var demo=avalon.define({
                $id:"demo",
                $opt:{
                    //配置生成上传工具的配置项
                    conf: {
                        pick: {
                            id: '#filePicker',
                            label: '点击选择图片'
                        },
                        formData: {
                            uid: 123
                        },
                        dnd: '#dndArea',
                        paste: '#uploader',
                        swf: './ui/uploader/uploader.swf',
                        chunked: false,
                        chunkSize: 512 * 1024,
                        server: apiURL + '50&tsy=' + cache.go("tsy"),

                        //下面这个如果不注释就会影响整个上传工具
//                                runtimeOrder: 'flash',

                        accept: {
                            title: 'Images',
                            extensions: 'jpg,jpeg,bmp,png',
                            mimeTypes: 'image/*'
                        },

                        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
                        disableGlobalDnd: true,
                        fileNumLimit: 10,
                        fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                        fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
                    },
                    //配置每张图片上传成功之后的额外回调
                    success:function(file,res){
                        alert(file+res)
                    }
                }
            })
            avalon.scan()
        })
    })
```

## 特别注意
因为是基于webuploader来进行构建的，所以你同样也可以调用他的各种API，你可以通过 ```vm.uploader.xxx()```进行调用

vm是你所创建出的组件的ID，与```ms-widget= "uploader,uploader,$opt"``` 其中的第二个值相同。


食用愉快~~