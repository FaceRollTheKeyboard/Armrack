/**
 * Created by mooshroom on 2015-07-10.
 * 版本：v0.0.1
 * 初步完成，由于没有很好的封装，所以现在一个页面上只能用一次
 */
define([
        //引入所依赖的文件
        "avalon",
        'jquery',
        'text!../../ui/uploader/uploader.html',
        'css!../../ui/uploader/uploader.css',
        '../../ui/uploader/webuploader'
    ],
    function (avalon, $, html) {
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

                    vm.build()


                },

                //自爆~，自我销毁函数，在组件移除的时候自动调用这里面的方法
                $remove: function () {
                    element.innerHTML = ""

                },

                //并不知道有什么用，但是规范上面说要有这个方法（囧）
                onInit: function () {

                },

                /********以下是正常的组件的各个属性********/

                //上传工具设置
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
                    fileNumLimit: 300,
                    fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                    fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
                },

                //返回的图片
                images:[],

                //构建上传工具
                build: function () {
                    setTimeout(function () {
                        $(function () {
                            var $wrap = $('#uploader'),

                            // 图片容器
                                $queue = $('<ul class="filelist"></ul>')
                                    .appendTo($wrap.find('.queueList')),

                            // 状态栏，包括进度和控制按钮
                                $statusBar = $wrap.find('.statusBar'),

                            // 文件总体选择信息。
                                $info = $statusBar.find('.info'),

                            // 上传按钮
                                $upload = $wrap.find('.uploadBtn'),

                            // 没选择文件之前的内容。
                                $placeHolder = $wrap.find('.placeholder'),

                                $progress = $statusBar.find('.progress').hide(),

                            // 添加的文件数量
                                fileCount = 0,

                            // 添加的文件总大小
                                fileSize = 0,

                            // 优化retina, 在retina下这个值是2
                                ratio = window.devicePixelRatio || 1,

                            // 缩略图大小
                                thumbnailWidth = 110 * ratio,
                                thumbnailHeight = 110 * ratio,

                            // 可能有pedding, ready, uploading, confirm, done.
                                state = 'pedding',

                            // 所有文件的进度信息，key为file id
                                percentages = {},
                            // 判断浏览器是否支持图片的base64
                                isSupportBase64 = (function () {
                                    var data = new Image();
                                    var support = true;
                                    data.onload = data.onerror = function () {
                                        if (this.width != 1 || this.height != 1) {
                                            support = false;
                                        }
                                    }
                                    data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                                    return support;
                                })(),

                            // 检测是否已经安装flash，检测flash的版本
                                flashVersion = (function () {
                                    var version;

                                    try {
                                        version = navigator.plugins[ 'Shockwave Flash' ];
                                        version = version.description;
                                    } catch (ex) {
                                        try {
                                            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                                .GetVariable('$version');
                                        } catch (ex2) {
                                            version = '0.0';
                                        }
                                    }
                                    version = version.match(/\d+/g);
                                    return parseFloat(version[ 0 ] + '.' + version[ 1 ], 10);
                                })(),

                                supportTransition = (function () {
                                    var s = document.createElement('p').style,
                                        r = 'transition' in s ||
                                            'WebkitTransition' in s ||
                                            'MozTransition' in s ||
                                            'msTransition' in s ||
                                            'OTransition' in s;
                                    s = null;
                                    return r;
                                })(),

                            // WebUploader实例
                                uploader;

                            if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

                                // flash 安装了但是版本过低。
                                if (flashVersion) {
                                    (function (container) {
                                        window['expressinstallcallback'] = function (state) {
                                            switch (state) {
                                                case 'Download.Cancelled':
                                                    alert('您取消了更新！')
                                                    break;

                                                case 'Download.Failed':
                                                    alert('安装失败')
                                                    break;

                                                default:
                                                    alert('安装已成功，请刷新！');
                                                    break;
                                            }
                                            delete window['expressinstallcallback'];
                                        };

                                        var swf = './expressInstall.swf';
                                        // insert flash object
                                        var html = '<object type="application/' +
                                            'x-shockwave-flash" data="' + swf + '" ';

                                        if (WebUploader.browser.ie) {
                                            html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                                        }

                                        html += 'width="100%" height="100%" style="outline:0">' +
                                            '<param name="movie" value="' + swf + '" />' +
                                            '<param name="wmode" value="transparent" />' +
                                            '<param name="allowscriptaccess" value="always" />' +
                                            '</object>';

                                        container.html(html);

                                    })($wrap);

                                    // 压根就没有安转。
                                } else {
                                    $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
                                }

                                return;
                            } else if (!WebUploader.Uploader.support()) {
                                alert('Web Uploader 不支持您的浏览器！');
                                return;
                            }

                            // 实例化
                            uploader = WebUploader.create(vm.conf);

                            // 拖拽时不接受 js, txt 文件。
                            uploader.on('dndAccept', function (items) {
                                var denied = false,
                                    len = items.length,
                                    i = 0,
                                // 修改js类型
                                    unAllowed = 'text/plain;application/javascript ';

                                for (; i < len; i++) {
                                    // 如果在列表里面
                                    if (~unAllowed.indexOf(items[ i ].type)) {
                                        denied = true;
                                        break;
                                    }
                                }

                                return !denied;
                            });

                            uploader.on('dialogOpen', function () {
                                console.log('here');
                            });

                            uploader.on('filesQueued', function () {
                                uploader.sort(function (a, b) {
                                    if (a.name < b.name)
                                        return -1;
                                    if (a.name > b.name)
                                        return 1;
                                    return 0;
                                });
                            });

                            // 添加“添加文件”的按钮，
                            uploader.addButton({
                                id: '#filePicker2',
                                label: '继续添加'
                            });

                            uploader.on('ready', function () {
//                                window.uploader = uploader;
                            });

                            // 当有文件添加进来时执行，负责view的创建
                            function addFile(file) {
                                var $li = $('<li id="' + file.id + '">' +
                                        '<p class="title">' + file.name + '</p>' +
                                        '<p class="imgWrap"></p>' +
                                        '<p class="progress"><span></span></p>' +
                                        '</li>'),

                                    $btns = $('<div class="file-panel">' +
                                        '<span class="cancel">删除</span>' +
                                        '<span class="rotateRight">向右旋转</span>' +
                                        '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
                                    $prgress = $li.find('p.progress span'),
                                    $wrap = $li.find('p.imgWrap'),
                                    $info = $('<p class="error"></p>'),

                                    showError = function (code) {
                                        switch (code) {
                                            case 'exceed_size':
                                                text = '文件大小超出';
                                                break;

                                            case 'interrupt':
                                                text = '上传暂停';
                                                break;

                                            default:
                                                text = '上传失败，请重试';
                                                break;
                                        }

                                        $info.text(text).appendTo($li);
                                    };

                                if (file.getStatus() === 'invalid') {
                                    showError(file.statusText);
                                } else {
                                    // @todo lazyload
                                    $wrap.text('预览中');
                                    uploader.makeThumb(file, function (error, src) {
                                        var img;

                                        if (error) {
                                            $wrap.text('不能预览');
                                            return;
                                        }

                                        if (isSupportBase64) {
                                            img = $('<img src="' + src + '">');
                                            $wrap.empty().append(img);
                                        } else {
                                            $.ajax('../../server/preview.php', {
                                                method: 'POST',
                                                data: src,
                                                dataType: 'json'
                                            }).done(function (response) {
                                                if (response.result) {
                                                    img = $('<img src="' + response.result + '">');
                                                    $wrap.empty().append(img);
                                                } else {
                                                    $wrap.text("预览出错");
                                                }
                                            });
                                        }
                                    }, thumbnailWidth, thumbnailHeight);

                                    percentages[ file.id ] = [ file.size, 0 ];
                                    file.rotation = 0;
                                }

                                file.on('statuschange', function (cur, prev) {
                                    if (prev === 'progress') {
                                        $prgress.hide().width(0);
                                    } else if (prev === 'queued') {
                                        $li.off('mouseenter mouseleave');
                                        $btns.remove();
                                    }

                                    // 成功
                                    if (cur === 'error' || cur === 'invalid') {
                                        console.log(file.statusText);
                                        showError(file.statusText);
                                        percentages[ file.id ][ 1 ] = 1;
                                    } else if (cur === 'interrupt') {
                                        showError('interrupt');
                                    } else if (cur === 'queued') {
                                        percentages[ file.id ][ 1 ] = 0;
                                    } else if (cur === 'progress') {
                                        $info.remove();
                                        $prgress.css('display', 'block');
                                    } else if (cur === 'complete') {
                                        $li.find('.progress').hide();
                                        $li.append('<span class="success"></span>');
                                    }

                                    $li.removeClass('state-' + prev).addClass('state-' + cur);
                                });

                                $li.on('mouseenter', function () {
                                    $btns.stop().animate({height: 30});
                                });

                                $li.on('mouseleave', function () {
                                    $btns.stop().animate({height: 0});
                                });

                                $btns.on('click', 'span', function () {
                                    var index = $(this).index(),
                                        deg;

                                    switch (index) {
                                        case 0:
                                            uploader.removeFile(file);
                                            return;

                                        case 1:
                                            file.rotation += 90;
                                            break;

                                        case 2:
                                            file.rotation -= 90;
                                            break;
                                    }

                                    if (supportTransition) {
                                        deg = 'rotate(' + file.rotation + 'deg)';
                                        $wrap.css({
                                            '-webkit-transform': deg,
                                            '-mos-transform': deg,
                                            '-o-transform': deg,
                                            'transform': deg
                                        });
                                    } else {
                                        $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                                        // use jquery animate to rotation
                                        // $({
                                        //     rotation: rotation
                                        // }).animate({
                                        //     rotation: file.rotation
                                        // }, {
                                        //     easing: 'linear',
                                        //     step: function( now ) {
                                        //         now = now * Math.PI / 180;

                                        //         var cos = Math.cos( now ),
                                        //             sin = Math.sin( now );

                                        //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                                        //     }
                                        // });
                                    }


                                });

                                $li.appendTo($queue);
                            }

                            // 负责view的销毁
                            function removeFile(file) {
                                var $li = $('#' + file.id);

                                delete percentages[ file.id ];
                                updateTotalProgress();
                                $li.off().find('.file-panel').off().end().remove();
                            }

                            function updateTotalProgress() {
                                var loaded = 0,
                                    total = 0,
                                    spans = $progress.children(),
                                    percent;

                                $.each(percentages, function (k, v) {
                                    total += v[ 0 ];
                                    loaded += v[ 0 ] * v[ 1 ];
                                });

                                percent = total ? loaded / total : 0;


                                spans.eq(0).text(Math.round(percent * 100) + '%');
                                spans.eq(1).css('width', Math.round(percent * 100) + '%');
                                updateStatus();
                            }

                            function updateStatus() {
                                var text = '', stats;

                                if (state === 'ready') {
                                    text = '选中' + fileCount + '张图片，共' +
                                        WebUploader.formatSize(fileSize) + '。';
                                } else if (state === 'confirm') {
                                    stats = uploader.getStats();
                                    if (stats.uploadFailNum) {
                                        text = '已成功上传' + stats.successNum + '张照片至XX相册，' +
                                            stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                                    }

                                } else {
                                    stats = uploader.getStats();
                                    text = '共' + fileCount + '张（' +
                                        WebUploader.formatSize(fileSize) +
                                        '），已上传' + stats.successNum + '张';

                                    if (stats.uploadFailNum) {
                                        text += '，失败' + stats.uploadFailNum + '张';
                                    }
                                }

                                $info.html(text);
                            }

                            function setState(val) {
                                var file, stats;

                                if (val === state) {
                                    return;
                                }

                                $upload.removeClass('state-' + state);
                                $upload.addClass('state-' + val);
                                state = val;

                                switch (state) {
                                    case 'pedding':
                                        $placeHolder.removeClass('element-invisible');
                                        $queue.hide();
                                        $statusBar.addClass('element-invisible');
                                        uploader.refresh();
                                        break;

                                    case 'ready':
                                        $placeHolder.addClass('element-invisible');
                                        $('#filePicker2').removeClass('element-invisible');
                                        $queue.show();
                                        $statusBar.removeClass('element-invisible');
                                        uploader.refresh();
                                        break;

                                    case 'uploading':
                                        $('#filePicker2').addClass('element-invisible');
                                        $progress.show();
                                        $upload.text('暂停上传');
                                        break;

                                    case 'paused':
                                        $progress.show();
                                        $upload.text('继续上传');
                                        break;

                                    case 'confirm':
                                        $progress.hide();
                                        $('#filePicker2').removeClass('element-invisible');
                                        $upload.text('开始上传');

                                        stats = uploader.getStats();
                                        if (stats.successNum && !stats.uploadFailNum) {
                                            setState('finish');
                                            return;
                                        }
                                        break;
                                    case 'finish':
                                        stats = uploader.getStats();
                                        if (stats.successNum) {
                                            tip.on('上传完成', 1);
                                            setTimeout(function () {
                                                tip.off('上传完成', 1);
                                            }, 3000);
                                        } else {
                                            // 没有成功的图片，重设
                                            state = 'done';
                                            location.reload();
                                        }
                                        break;
                                }

                                updateStatus();
                            }

                            uploader.onUploadProgress = function (file, percentage) {
                                var $li = $('#' + file.id),
                                    $percent = $li.find('.progress span');

                                $percent.css('width', percentage * 100 + '%');
                                percentages[ file.id ][ 1 ] = percentage;
                                updateTotalProgress();
                            };
                            uploader.onFileQueued = function (file) {
                                fileCount++;
                                fileSize += file.size;

                                if (fileCount === 1) {
                                    $placeHolder.addClass('element-invisible');
                                    $statusBar.show();
                                }

                                addFile(file);
                                setState('ready');
                                updateTotalProgress();
                            };

                            uploader.onFileDequeued = function (file) {
                                fileCount--;
                                fileSize -= file.size;

                                if (!fileCount) {
                                    setState('pedding');
                                }

                                removeFile(file);
                                updateTotalProgress();

                            };

                            uploader.on('all', function (type) {
                                var stats;
                                switch (type) {
                                    case 'uploadFinished':
                                        setState('confirm');
                                        break;

                                    case 'startUpload':
                                        setState('uploading');
                                        break;

                                    case 'stopUpload':
                                        setState('paused');
                                        break;

                                }
                            });
                            uploader.on('uploadSuccess', function (file, res) {
                                //todo 这里编写上传回调函数
                                if(res.c==200){
                                    //上传真成功
                                    $('#' + file.id).addClass('upload-state-done');
                                    vm.images.push(res.d[0])
                                }
                                else if(res.c==403){
                                    tip.off('上传完成', 1);
                                    alert("您未登录，或登录已经失效，请登录后再试")
                                    location.reload()
                                }
                                else{
                                    var err=res.c+':'+res.m

                                    tip.on("上传失败\r\n"+err);
                                    setTimeout(function () {
                                        tip.off('上传完成', 1);
                                    }, 200);
                                    console.log(err)

                                    //从队列中去掉不成功的图片
                                    uploader.removeFile(file,true);


                                }

                            });
                            uploader.onError = function (code) {
                                if (code == "F_DUPLICATE") {
                                    tip.on('图片重复...', 0);
                                    setTimeout(function () {
                                        tip.off('图片重复...', 0);
                                    }, 3000);
                                }
                                else {
                                    alert('Eroor: ' + code);
                                }

                            };

                            $upload.on('click', function () {
                                if ($(this).hasClass('disabled')) {
                                    return false;
                                }

                                if (state === 'ready') {
                                    uploader.upload();
                                } else if (state === 'paused') {
                                    uploader.upload();
                                } else if (state === 'uploading') {
                                    uploader.stop();
                                }
                            });

                            $info.on('click', '.retry', function () {
                                uploader.retry();
                            });

                            $info.on('click', '.ignore', function () {
                                alert('todo');
                            });

                            $upload.addClass('state-' + state);
                            updateTotalProgress();
                        });
                    }, 100)
                }
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