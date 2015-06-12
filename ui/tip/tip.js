/**
 * Created by mooshroom on 2015-06-12.
 * 版本：V3.0.0
 * 使用avalon组件模式重构
 */
define([
        "avalon",
        'text!../../ui/tip/tip.html',
        'css!../../ui/tip/tip.css'
    ],
    function (avalon, html, css) {
        var widget = avalon.ui.tip = function (element, data, vmodels) {
            var options = data.tipOptions//取得配置
            var objId=data.tipId
            var vmodel = avalon.define({
                $id: objId,
                $init:function(){
                    element.innerHTML=html
                    avalon.scan(element, [vmodel].concat(vmodels))
                    if(typeof vmodel.onInit === "function"){
                        vmodel.onInit.call(element, vmodel, options, vmodels)
                    }

                },
                tips: [],    //要显示的提示信息
                tipsError: [],  //要显示的错误提示信息
                //isShow: false,  // 控制提示框的出现
                //提示信息
                infoObject: {
                    login: '登录中。。。。。。',
                    search: '搜索中。。。。。。',
                    data: '数据加载中。。。。。。',
                    submit: '提交中。。。。。。',
                    register: '注册成功！！！',
                    loginIn: '登录成功！！！',
                    loginOut: '退出登录成功！！！'
                },
//错误提示信息
                errorObject: {
                    login: '登录失败！！！',
                    register: '注册失败！！！',
                    submit: '提交失败！！！',
                    loginOut: '未登录，请登录！！！',
                    system: '系统错误！！！'
                },

                //message: 为提示的信息，id: 1为正常消息提示 0为错误消息提示
                on: function (message, id, time) {

                    if (id == 1) {
                        vmodel.tips.push(message);
                        if (time != null) {
                            setTimeout(function () {
                                vmodel.off(message, id);
                            }, time);
                        }
                        else {
                            //设置提示关闭默认时间
                            setTimeout(function () {
                                vmodel.off(message, id);
                            }, 15000);
                        }
                    }
                    else {
                        vmodel.tipsError.push(message);
                        if (time != null) {
                            setTimeout(function () {
                                vmodel.off(message, id);
                            }, time);
                        }
                        else {
                            //设置提示关闭默认时间
                            setTimeout(function () {
                                vmodel.off(message, id);
                            }, 15000);
                        }
                    }
                },

                off: function (message, id) {
                    if (id == 1) {
                        //关闭所有正常提示信息
                        if (message == '') {
                            vmodel.tips = [];
                        }
                        for (var i = 0; i < vmodel.tips.length; i++) {
                            if (vmodel.tips[i] == message) {
                                break;
                            }
                        }
                        vmodel.tips.splice(i, 1);
                    }
                    else {
                        //关闭所有错误提示信息
                        if (message == '') {
                            vmodel.tipsError = [];
                        }
                        for (var i = 0; i < vmodel.tipsError.length; i++) {
                            if (vmodel.tipsError[i] == message) {
                                break;
                            }
                        }
                        vmodel.tipsError.splice(i, 1);
                    }
                },

                //手动关闭
                close: function (index, id) {

                    //判断是正常提示消息还是错误提示消息（1为正常0为错误）
                    if (id == 1) {
                        vmodel.tips.splice(index, 1);
                    } else {
                        vmodel.tipsError.splice(index, 1);
                    }
                }
            })
            avalon.mix(vmodel,options)
            this[objId]=vmodel
            return vmodel
        }
        widget.defaults={

        }
        return avalon
    })