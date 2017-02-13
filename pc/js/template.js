template.load=function(){
    //头部底部
    $.ajax({
        url: "http://list.baobeigezi.com/pub/header",
        dataType: "jsonp",
        type: "GET",
        async: true,
        success: function(msg) {
            $('#header').html(msg.header);
            $('#foot').html(msg.footer);
            $('body').append('<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>');
        }
    });
    //倒计时
    if(template.timerSetDate){
        setInterval(template.timer, 1000);
    }
    //4栏图片
    $('.layerB a').each(function(){
        var fn = $(this).attr('data-code');
        if(fn){
            $(this).click(function(){
                template.quan(fn);
            })
        }
    })
    //加载banner商品
    if(template.shopid_c){
        template.loadShopC();
    }else{
        $('.layerC').hide();
    }
    //商品列表 导航
    template.sideNav();
    //加载商品
    template.shopLoad();
    //播放器
    if($('.layerF').length>0){
        $("#jquery_jplayer_1").jPlayer({
            ready: function () {
              $(this).jPlayer("setMedia", {
                m4v: "../video/1.m4v",
                ogv: "../video/1.ogv",
                webmv: "../video/1.webm",
                poster: "../video/pre_img_pc.jpg"
              });
            },
            //swfPath: "../video/jquery.jplayer.swf",
            swfPath: "http://act.baobeigezi.com/2016/4/1/video/jquery.jplayer.swf",
            supplied: "webmv, ogv, m4v",
            size: {
              width: "1000px",
              height: "491px",
              cssClass: "jp-video-360p"
            },
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        });
    }
    //分享
    if(template.data_share){
        template.share();
    }
}
template.timer=function(){
    // 当前时间
    var oDate=new Date();
    // 未来时间
    var oTarget=new Date();
   /* oTarget.setMonth(7, 27);
    oTarget.setHours(00, 00, 0, 0);*/
    oTarget.setMonth(template.timerSetDate.month-1, template.timerSetDate.day);
    oTarget.setHours(template.timerSetDate.h, template.timerSetDate.m, template.timerSetDate.s, 0);
    
    var total=Math.floor((oTarget.getTime()-oDate.getTime())/1000);
    var day=Math.floor(total/86400);
    total%=86400;
    var h=Math.floor(total/3600);
    total%=3600;
    var m=Math.floor(total/60);
    total%=60;
    var s=total;
    if(day == 0){
        $('.timer .day').text('');
        $('.timer em').hide();
    }else{
        $('.timer .day').text(day);
        $('.timer em').show();
    }
    $('.timer .hour').text(h);
    $('.timer .minute').text(m);
    $('.timer .second').text(s);
}
template.loadBanner=function(){
    $(".banner").slide( { mainCell:".bd ul",titCell:".hd",autoPlay:true,delayTime:700,interTime:5500,effect:"fold",autoPage:'<span></span>' });
}
//侧栏导航
template.sideNav=function(){
    //侧悬浮导航
    $('#float_nav').on('click', 'a',function() {
        var this_index = $(this).index();
         var this_destination = $(".layerD").find(".floor").eq(this_index);
         console.log(this_index);
         if(this_index=='0'){
            this_destination = $('.layerD');
        }
        scrollTo(this_destination);
        return false;
    })
    var html_body = $('html,body');
    //侧悬浮滚动
    function scrollTo(this_destination) {
        html_body.animate({
            scrollTop: this_destination.offset().top-10
        },
        800);
    };
    //侧悬浮导航反回顶部按钮
    $(".backTop").click(function() {
        html_body.animate({
            scrollTop: "20px"
        },
        800);
        return false;
    });
}
//加载商品
//下拉请求商品
var w = $(window),
    w_h = w.height(),
    isSend = true;
template.shopLoad=function(){
    for(var el in template.shopId){
        $('#'+el).data('status', 'open');
    }
    w.on('scroll.myTopBtn',function() {
        var myTop = $(document).find('#backTop');
        if (myTop.length > 0) {
            myTop.remove();
            w.unbind('scroll.myTopBtn');
        }
    }).on('scroll.myPro',function() {
        //悬浮导航显示和隐藏
        var scrollTop = $(this).scrollTop();
        if (scrollTop > 850) {
            $('#float_nav').fadeIn();
        } else {
            $('#float_nav').fadeOut();
        }
        var count = 0;
        for(var el in template.shopId){
            if(count%3 == 0){
                template.loadShopId('Pro'+eval(count+1), scrollTop,count+1);
            }
            count++;
        }
    });
}
//配置商品id
template.loadShopId=function(id, scrollTop,star_cell){
    var w_h = w.height();
    //console.log(scrollTop + w_h,$('#'+id).offset().top,id);
    //return;
    //下拉加载
    if ($('#'+id).data('status') == 'open') {
        if (isSend=true&&scrollTop + w_h > $('#'+id).offset().top) {
            var grouped_products = {};
            /*if (id == '#Pro1') {
                grouped_products = {
                    'Pro1': '42238,42472,40990,42650,43350,35993,42884,43424,43026,42020,42114,43036,42222,34873,41990,40918',
                    'Pro2':'35149,29538,35611,27500,30640,42966,42968,41734,41738,41740,35207,41550,39756,39758,35817,42184',
                    'Pro3': '34767,40974,38824,39362,42272,39130,42254,42258,39126,39082,39106,42276,44622,39130,42272,42280'
                }
            } else if (id == '#Pro4') {
                grouped_products = { 
                    'Pro4':'26752,26756,26762,26768,26778,26786,40724,40722,40720,40908,30134,30058,36117,40664,40784,40668',
                    'Pro5':'40438,40472,40440,40474,40442,40476,40462,40478,40464,40480,40466,40482,40468,40436,40470',
                    'Pro6':'30444,30400,43220,30472,30410,42370,30394,30572,39268,29574,44464,29570,36986,31154,41588,35593'
                }
            }else if(id == '#Pro7'){
                grouped_products = {
                    'Pro7':'38746,40504,44256,44262,44266,44258,36870,44206,44160,44178,44202,44504,40560,40696,40386,40396',
                    'Pro8':'43888,43898,39598,39596,34843,34827,41092,41258,39566,40776,40708,40714',
                    'Pro9':'37304,37306,32066'    
                } 
            }*/
            var num = 1;
            console.log(star_cell,template.shopId);
            for(var el in template.shopId){
                /*console.log(id,'#Pro'+star_cell);
                console.log(star_cell+3,num,star_cell);
                console.log(el,template.shopId[el]);*/
                if(id == 'Pro'+star_cell && num >= star_cell && num < star_cell+3){
                    grouped_products[el] = template.shopId[el];
                }
                num++;
            }
            console.log(grouped_products);
            //return;
            template.loadShop('#'+id, grouped_products)  
        } 
    }
}
//加载商品列表
template.loadShop=function(id, grouped_products){
    template.loading('block');
    $(id).data('status', 'close');
    $.ajax({
        type: "POST",
        url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
        dataType: 'jsonp',
        data: {
            grouped_products: grouped_products,
            grouped: true
        },
        beforeSend:function(){isSend=false;} ,       
        success: function(res) {
            console.log(res);
            if (res.code == 1) {
                var data = res.data.data;
                for(var s in grouped_products){
                    var info="";
                    var productIds = grouped_products[s].split(',');
                    var shop_ad = template.shop_ad;
                    //console.log(shop_ad[s],grouped_products[s]);
                    for(var prdouctId in productIds){
                        //console.log(productIds,prdouctId,productIds[prdouctId])
                        if(productIds[prdouctId] && data[s][productIds[prdouctId]] && !(data[s][productIds[prdouctId]] instanceof Array)) {
                            var currentData = data[s][productIds[prdouctId]];
                            if(prdouctId == 0){
                                info += '<div class="floorHot">'+
                                    '<a href="'+currentData.url+'" class="clearfix" target="_blank">'+
                                        '<img src="'+currentData.picUrl+'">'+
                                        '<div class="info">'+
                                            '<div class="tit">'+currentData.name+'</div>'+
                                            '<div class="txt">'+shop_ad[s]+'</div>'+
                                            '<div class="sale_price">￥'+currentData.store_price+'</div>'+
                                        '</div>'+
                                    '</a>'+
                                '</div>';
                            }else{
                                info += '<div class="floorBox">'+
                                    '<a href="'+currentData.url+'" target="_blank">'+
                                        '<img src="'+currentData.picUrl+'" alt="'+currentData.name+'">'+
                                        '<div class="info">'+
                                            '<div class="tit">'+currentData.name+'</div>'+
                                            '<div class="sale_price">￥'+currentData.store_price;
                                            if(currentData.home_market_price == 0){
                                                info += '<span class="home_market_price">￥'+currentData.market_price+'</span></div>';
                                            }else{
                                                info += '<span class="home_market_price">￥'+currentData.home_market_price+'</span></div>';
                                            }
                                            
                                        info += '</div></a></div>';
                            }
                        }
                        
                    }
                    $('#' + s).html(info);
                }
            } else {
                $(id).data('status', 'open');
            }
            template.loading('none');
        },
        complete:function(){
            setTimeout(function(){isSend=true;},200)
        }
    });
}
template.loadShopC=function(){
    template.loading('block');
    $.ajax({
        type: "POST",
        url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
        dataType: 'jsonp',
        data: {
            product_ids: template.shopid_c['ids'],
        },
        success: function(res) {
            //console.log(res.data.data);
            var data = res.data.data;
            if (res.code == 1) {
                var info="",
                arr = template.shopid_c['ids'].split(',');
                for (var el in arr) {
                    var n = parseInt(el)+1;
                    info += '<li>'+
                        '<div class="content clearfix">'+
                            '<img src="'+data[arr[el]]["picUrl"]+'" />'+
                            '<div class="info">'+
                                '<div class="tit">'+data[arr[el]]["name"]+'</div>'+
                                '<div class="txt">'+template.shopid_c['ad']['ad'+n]+'</div>'+
                                '<div class="sale_price">￥'+data[arr[el]]["store_price"];
                                if(data[arr[el]]["home_market_price"] == 0){
                                    info += '<span class="home_market_price">￥'+data[arr[el]]["market_price"]+'</span></div>';
                                }else{
                                    info += '<span class="home_market_price">￥'+data[arr[el]]["home_market_price"]+'</span></div>';
                                }
                                
                                info += '<a href="'+data[arr[el]]["url"]+'" target="_blank">立即购买</a>'+
                            '</div>'+
                        '</div>'+
                    '</li>';
                }
            $('.slider_pic ul').html(info);
            template.loadBanner();
            }
            template.loading('none');
        }
    });
}
template.quan=function(code){
    template.loading('block');
    $.ajax({
        type: "post",
        url: "http://home.baobeigezi.com/user/isLogin?callback=?",
        dataType: 'jsonp',
        data: {
            is_ajax : 'yes'
        },
        success: function (res) {
            if(res.code == 0){//去登录
                User.openIframe('login');
                template.loading('none');
                return false;
            }else{
                //领券
                template.loading('block');
                $.ajax({
                    type: "get",
                    url:"http://3g.baobeigezi.com/com/getCoupon?type="+code,
                    dataType: 'jsonp',
                    data: {
                        is_ajax:'yes'
                    },
                    success: function (res) {
                        template.popbox('提示',res.msg);
                        template.loading('none');
                    }
                    
                });
            }
        }
    });
}
template.loading = function(s) {
    $("#wait").remove();
    $('body').append('<div id="wait"></div>'); //在页面内创建弹出框结构
    $('#wait').css({
        'display': s
    });
};
template.popbox=function(tit,msg,callback,btnTxtLeft,btnTxtRight){
    $("#separate_account2").remove();
    var info = '<div id="separate_account2" class="pop_box">'+
                    '<div class="pop_box_shade"></div>'+
                    '<div class="pop_box_content" style="width: 640px;height: 380px;">'+
                        '<div class="pop2_tit">'+tit+'<div class="close u_icon"></div></div>'+
                        '<div class="pop2_cont" title="'+msg+'">'+msg+'</div>'+
                        '<div class="pop2_btn">';
                            if(callback){
                                if(btnTxtLeft){
                                    info += '<a href="javascript:;" class="btn_rescind cancle_btn">'+btnTxtLeft+'</a>';
                                }else{
                                    info += '<a href="javascript:;" class="btn_rescind cancle_btn">取消</a>';
                                }
                            }
                            if(btnTxtRight){
                                info+= '<a href="javascript:;" class="btn_sure ok_btn">'+btnTxtRight+'</a>';
                            }else{
                                info+= '<a href="javascript:;" class="btn_sure ok_btn">确定</a>';
                            }
                            
                            info+= '</div>'+
                    '</div>'+
                '</div>';
    $('body').append(info);//在页面内创建弹出框结构
    var box = $("#separate_account2");
    var pop_box_content = box.find(".pop_box_content");
    var pop_box_content_h = pop_box_content.height();
    var pop_box_w = pop_box_content.width();
    var pop_box_h = pop_box_content.height();
    pop_box_content.css({'margin-top':-1*pop_box_content_h/2,'margin-left':-1*pop_box_w/2});//弹出框居中
    box.show();//在页面内显示
    box.find(".close,.cancle_btn").on('click',function(){//取消
        //box.hide();
        box.remove();
    })
    box.find(".ok_btn").on('click',function(){
        if(callback){
            callback(1);
        }
        box.remove();
    })
}
template.share=function(){
    $('.share_btn').on('click',function(){
        var url=window.location.href
            imgsrc= template.data_share['shareImg'],
            title = template.data_share['title'],
            desc = template.data_share['content'];
        $('#weibo_btn').attr('href','http://service.weibo.com/share/share.php?url='+url+'&title='+desc+'&pic='+imgsrc);
        $('#qq_btn').attr('href','http://connect.qq.com/widget/shareqq/index.html?url='+url+"&showcount=0&desc=&summary="+desc+"&title="+title+"&pics="+imgsrc);
        $('#qqZone_btn').attr('href','http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+"&title="+title+"&pics="+imgsrc+"&summary="+desc);
        $('#shareBox').show();
    });
    $('.share_close').on('click',function(){
        $('#shareBox').hide();
    });
}
template.load();