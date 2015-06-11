/**
 * Created by Administrator on 2015/6/11 0011.
 */
define("nav",["avalon"],function(){
    return nav=avalon.define({
        $id:"nav",
//        导航项目配置
        navItems:[
            {
                name:"首页",
                href:"#!/"
            },
            {
                name:"组件列表",
                href:"#!/list"
            }
        ]
    })
})