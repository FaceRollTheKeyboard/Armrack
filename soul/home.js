/**
 * Created by Administrator on 2015/6/11 0011.
 */
define("home",["avalon",],function(){
    return home=avalon.define({
        $id:"home",
        ready:function(){
            require(['../../plugins/MDEditor/markdown.js'],function(){
                avalon.ajax({
                    type:"get",
                    url:"./README.md",
                    success:function(res){
                        home.arc=marked(res)
//                        console.log(res)
                    }
                })
            })

        },
        arc:""
    })
})