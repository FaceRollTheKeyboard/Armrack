/**
 * Created by Administrator on 2015/6/11 0011.
 */
define("ui",["avalon"],function(){
    return ui=avalon.define({
        $id:"ui",
        ready:function(){
            ui.list=cache.go("uiList")
        },

        //获取ui列表
        list:[]

    })
})