/**
 * Created by Administrator on 2015/6/23 0023.
 */
define("ws", function () {
    var wsServer = 'ws://121.41.115.217:9555'; //服务器地址
    var ws;
    if ('WebSocket' in window) {
         ws = new WebSocket(wsServer);
    } else if ('MozWebSocket' in window) {
         ws = new MozWebSocket(wsServer);
    } else {
        alert('WebSocket is not supported by this browser.');
        return
    }

    ws.alive=true
    //ws.send("hello");//向服务器发送消息
    alert(ws.readyState);//查看websocket当前状态
    ws.onopen = function (evt) {
//已经建立连接
        tip.on("websocket连接成功："+wsServer,1,3000);
        ws.alive=true
    };
    ws.onclose = function (evt) {
//已经关闭连接
        tip.on("websocket连接已关闭："+wsServer,1,3000);
        ws.alive=false
    };
    ws.onmessage = function (evt) {
//收到服务器消息，使用evt.data提取
        var ins=evt.data.split(',');
        var targetFn=ins[1];//解析目标动作
        var data=ins[2]
        if(typeof ws.todo[targetFn]=="function"){
            ws.todo[targetFn](data);//传入数据
        }else{
            tip.on("服务器返回了一个不认识的家伙："+targetFn)
        }

    };
    ws.onerror = function (evt) {
//产生异常
        ws.alive=false;
        tip.on("websocket连接错误："+wsServer,1,3000)
    };
    ws.todo={};

    ws.call=function(arr){

        if(typeof arr=="string"){
            ws.send(arr)
        }else{
            var msg=arr.join(",");
            ws.send(msg)
        }
        //直接传入一个数组

    };

    window.ws=ws
});


