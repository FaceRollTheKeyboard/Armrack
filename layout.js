define('layout', function () {
    return layout = avalon.define({
        $id: 'layout',
        nav:"./body/public/nav.html",
        navLeft:"./body/list.html",
        url: '',
        footer: './body/public/footer.html',
        tip: './plugins/tip/tip.html',
        doc:"",
        toTop:function(){
            window.scrollTo(0,0)
        }
    })
});

