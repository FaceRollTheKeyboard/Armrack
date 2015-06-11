/**
 * Created by luodan on 2015-02-07.
 * 版本：V2.1.2（在V2.0.0基础上增加了，提示显示时间设定，
 * 提示默认显示时间，关闭所有正常提示信息，关闭所有错误提示信息）
 */
var tip = avalon.define({
    $id: 'tip',
    ready: function () {

        require(["css!../../plugins/tip/tip.css"], function () {

        })
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
            tip.tips.push(message);
            if (time != null) {
                setTimeout(function () {
                    tip.off(message, id);
                }, time);
            }
            else {
                //设置提示关闭默认时间
                setTimeout(function () {
                    tip.off(message, id);
                }, 15000);
            }
        }
        else {
            tip.tipsError.push(message);
            if (time != null) {
                setTimeout(function () {
                    tip.off(message, id);
                }, time);
            }
            else {
                //设置提示关闭默认时间
                setTimeout(function () {
                    tip.off(message, id);
                }, 15000);
            }
        }
    },

    off: function (message, id) {
        if (id == 1) {
            //关闭所有正常提示信息
            if (message == '') {
                tip.tips = [];
            }
            for (var i = 0; i < tip.tips.length; i++) {
                if (tip.tips[i] == message) {
                    break;
                }
            }
            tip.tips.splice(i, 1);
        }
        else {
            //关闭所有错误提示信息
            if (message == '') {
                tip.tipsError = [];
            }
            for (var i = 0; i < tip.tipsError.length; i++) {
                if (tip.tipsError[i] == message) {
                    break;
                }
            }
            tip.tipsError.splice(i, 1);
        }
    },

    //手动关闭
    close: function (index, id) {

        //判断是正常提示消息还是错误提示消息（1为正常0为错误）
        if (id == 1) {
            tip.tips.splice(index, 1);
        } else {
            tip.tipsError.splice(index, 1);
        }
    }
});
tip.ready()

