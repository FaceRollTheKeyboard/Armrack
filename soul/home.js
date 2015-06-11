/**
 * Created by Administrator on 2015/6/11 0011.
 */
define("home",["avalon",],function(){
    return home=avalon.define({
        $id:"home",
        ready:function(){
            require.config({
                paths:{

                    marked:"../../plugins/MDEditor/markdown.js",
                    MDcss:"../../plugins/MDEditor/MDEditor.css",
                    prettify:"../../plugins/MDEditor/prettify.js",

                }
            })
            require(["marked", "prettify",'css!MDcss'],function(){
                avalon.ajax({
                    type:"get",
                    url:"./README.md",
                    success:function(res){
                        home.arc=marked(res)
//                        console.log(res)
                        prettyPrint();
                    }
                })
            })

        },
        arc:""
    })
})