var ajaxUrl="http://3g.baobeigezi.com/";
//判断h5、安卓和ios
var myUrl = window.location.href,
    agent='',
    shareUrl='';
if(myUrl.indexOf('agent')!=-1){
    agent = myUrl.split('agent=')[1];
    if(agent != 'h5'){
        agent=agent.replace(/(\w)/,function(v){return v.toUpperCase()});
    }else{
        $('.fixed-top').show();
        $('#container').css({'margin-top':'40px'});
    }
    shareUrl=myUrl.split('?')[0];
}else{
    agent="h5";
    $('.fixed-top').show();
    $('#container').css({'margin-top':'40px'});
    shareUrl=myUrl;
}

//{}转换所有连接
var saleSlideBanners = $('.saleSlideBanners'),
    saleTwoColumns = $('.saleTwoColumns'),
    saleBanner = $('.saleTwoColumns');
if(saleSlideBanners.length>0){
    changeLink(saleSlideBanners);
}
if(saleTwoColumns.length>0){
    changeLink(saleTwoColumns);
}  
if(saleBanner.length>0){
    changeLink(saleBanner);
} 
function changeLink(currentDiv){
    for(var i=0;i<currentDiv.length;i++){
        var a = currentDiv.eq(i).find('a');
        for(var j=0;j<a.length;j++){
            var current_a = a.eq(j),
                association = current_a.attr('data-association');
            current_a.removeAttr('target');
            if(association){
                var associationType = association.split('-'),
                    name = associationType[0],
                    id = associationType[1];
                switch(name){
                    case "keywords":
                        if(agent=="Ios"){
                            current_a.attr('href','bbgz://bbgz.com?keyWord='+id);
                        }else if(agent=="Android"){
                            current_a.attr('href','bbgz://bbgz_search_result.com/?key_word='+id);
                        }
                        break;
                    case "shangpin":
                        if(agent=="Ios"){
                            current_a.attr('href','bbgz://bbgz.com?product_id='+id);
                        }else if(agent=="Android"){
                            current_a.attr('href','bbgz://bbgz_product.com/?product_id='+id);
                        }
                        break;
                    case "zhuanchang":
                        if(agent=="Ios"){
                            current_a.attr('href','bbgz://bbgz.com?event_id='+id);
                        }else if(agent=="Android"){
                            current_a.attr('href','bbgz://bbgz_activity.com/?event_id='+id);
                        }
                        break;
                    case "fenlei":
                        if(agent=="Ios"){
                            current_a.attr('href','bbgz://bbgz.com?category_id='+id+'&category_name='+associationType[2]);//需要改正
                        }else if(agent=="Android"){
                            current_a.attr('href','bbgz://bbgz_category_id_name.com/?category_id='+id+'&category_name='+associationType[2]);
                        }
                        break;
                    case "pinpai":
                        if(agent=="Ios"){
                            current_a.attr('href','bbgz://bbgz.com?keyWord='+id);//需要改正
                        }else if(agent=="Android"){
                            current_a.attr('href','bbgz://bbgz_search_result.com/?key_word='+id);
                        }
                        break;
                    case "gonglve":
                        current_a.attr('href','bbgz://bbgz.com?goodThingDetailID='+id);
                        break;
                }
                
            }
        }
    }
}
var x ="";
if(agent=='h5'){
    x= $('.fixed-top').height();
}else{
    x = 0;
}
var public={};
//成功提示
/*加载等待*/
public.loading=function (s){
    $("#wait").remove();
    $('body').append('<div id="wait"></div>');//在页面内创建弹出框结构
    $('#wait').css({'display':s});
};
//回到顶部
$(document).on('click','.on_top',function(){
    $('html,body').stop().animate({scrollTop:'0px'},500);
}).on('click','.closeBtn,.shade',function(){
    $(this).parents('.shadeBox').hide();
}).on('click','.fixNav a',function(event){ //导航切换
        event.preventDefault();
        var me = $(this);
        me.addClass('currentNav').parent().siblings().find('a').removeClass('currentNav');
        var index = me.parent().index();
        var this_destination = fixNav.next().children('.saleMobileNavContent_item').eq(index);
        scrollTo(this_destination);
}).on('click','.saleSlideBanners img,.saleTwoColumns img,.saleBanner img',function(){//点击图片
    var me = $(this),
        me_a = me.parent(),
        association = me_a.attr('data-association');
    if(!association){
        return;
    }
    associationType = association.split('-');
    if(associationType[0]=='lingquan'){ //领券接口
        public.loading('block');
        // 判断是否登入
         $.ajax({
            type: "post",
            url: ajaxUrl+"user/isLogin?",
            dataType: 'jsonp',
            data: {
                is_ajax : 'yes'
            },
            success: function (res) {
                if(res.code == 0){//去登录
                    public.loading('none');
                    if(agent == 'h5'){
                        location.href = ajaxUrl+"user/login?burl="+myUrl;
                        // window.open("http://3g.test.baobeigezi.com/user/qlogin?","_blank");
                        return false;
                    }else if(agent == 'Ios'){
                        location.href = 'bbgz://bbgz.com?login';
                        return false;
                    }else if(agent == 'Android'){
                        location.href = 'bbgz://bbgz_login.com/';
                        return false;
                    }
                }else{
                    //领券  
                    $.ajax({
                        type: "get",
                        url:ajaxUrl+"com/getCoupon?type="+associationType[1],
                        dataType: 'jsonp',
                        data: {
                            is_ajax:'yes'
                        },
                        success: function (res) {
                            $('#tipsShadeBox').find('.tipsText').text(res.msg).end().show();
                            public.loading('none');
                            return;
                        }
                    });
                }
               
            }

        });
    }
});
var w = $(window),
    navFloor = $('.saleMobileNav'),
    navItems = navFloor.find('saleMobileNavContent_item'),
    NavNum = $('.saleMobileNav').length,
    navItemNum = navItems.length,
    fixNav = navFloor.find(".fixNav");
//向上按钮
w.on('scroll',function(){
    var scrollTop = w.scrollTop();
    var h = w.height();
    if(scrollTop > 500){
        $('.on_top').fadeIn();
    }else{
        $('.on_top').fadeOut();
    }
    if(NavNum==0){
        return;
    }else{
        var navTop = navFloor.offset().top;
        //固定导航
        if(scrollTop>=navTop-x){
            fixNav.addClass('fixedNav');
            if(agent=='h5'){
                fixNav.css({'top':'40px'});
            };
            fixNav.next().css('padding-top',fixNav.height());
        }else{
            fixNav.next().css('padding-top','0px');
            fixNav.removeClass('fixedNav').css({'top':'0px'});
        }
    }
    
            
});
//轮播图
if($('.saleSlideBanners').length>0){
    $('.saleSlideBanners').each(function(){
        var slideCell = '#'+$(this).attr('id');
        TouchSlide({
            slideCell:slideCell,
            titCell:".controlBtn ul",
            mainCell:".bannerList ul",
            effect:"leftLoop",
            autoPage:true,
            autoPlay:true,
            interTime:5000,
            switchLoad:"_src"
        });
    })
}
//分享文案
if(agent == 'Ios' || agent == 'Android'){
    var imgsrc=pageData.shareDate.shareImg;
    var title = pageData.shareDate.shareTitle;
    var wb_title = title +shareUrl+' 下载宝贝格子App http://a.app.qq.com/o/simple.jsp?pkgname=com.bbgz.android.app ,海淘零差价，母婴全球购 @宝贝格子母婴商城';
    var wx_title = title;
    var desc = pageData.shareDate.shareText;
    $.cookie('bbgz_share_url', shareUrl);
    $.cookie('bbgz_share_image_url',imgsrc);
    $.cookie('bbgz_share_title', title);
    $.cookie('bbgz_share_content', desc);
    $.cookie('share_title_wx', title);
    $.cookie('share_text_wx', desc);
    $.cookie('share_zone_wx', wx_title);
    $.cookie('share_text_wb', wb_title);
    $.cookie('share_copy_text', shareUrl);
    $.cookie('bbgz_share_status', 1);
}

 //如果存在需要调取的内容
var loadProDiv =  $('#container').find('.loadPro'),
    w_h = w.height(),
    isSend = true;
if(loadProDiv.length>0 ){
    loadProDiv.data('status','open');
    //第一屏
    loadPart(loadProDiv);
    //下拉请求商品
    w.on('scroll.loadPage',function(){
        if(loadProDiv.filter(function(index){return $(this).data('status')=='close'}).length==loadProDiv.length){
            w.unbind('scroll.loadPage');
        }
        loadPart(loadProDiv);
    });
   
    //滚动加载
}
function loadPart(loadProDiv){
    var scrollTop = w.scrollTop();
    loadProDiv.each(function(){                                                
        var currentDiv = $(this);
        if(currentDiv.data('status')=='close'){
            return;
        }
        LoadPro(currentDiv,scrollTop);
    });
}

function LoadPro(currentDiv,scrollTop){
    if(currentDiv.data('status') == 'open'){
        if(currentDiv.parent().hasClass('saleVideo')){ //如果是视频
            if(scrollTop + w_h > currentDiv.offset().top-100){
                var myParent = currentDiv.parent().attr('id');
                currentDiv.find('video').attr('src',pageData[myParent].videoSrc).attr('poster',pageData[myParent].imgSrc);
                currentDiv.data('status') == 'close';
            }
            return;
        }
        //如果是大图商品
        if(currentDiv.hasClass('saleBigProImg')){
            if (isSend==true && scrollTop + w_h > currentDiv.offset().top-100) {
                //拿出数据
                var myParent = currentDiv.attr('id'),
                    productIds = pageData[myParent].ids,
                    acDes = pageData[myParent].acDes,
                    imgSrc = pageData[myParent].imgSrc;
                //请求加载放入currentDiv内
                getSinglePros(currentDiv,productIds,acDes,imgSrc);
            }
            return;
        }
        //如果是商品列表
        if(currentDiv.hasClass('saleProList')){
            if (isSend==true && scrollTop + w_h > currentDiv.offset().top-100) {
                //拿出数据
                var myParent = currentDiv.attr('id'),
                    productIds = pageData[myParent].ids;
                //请求加载放入currentDiv的ul内
                 getSinglePros(currentDiv,productIds);
            }
            return;
        }

        //如果是导航列表
        if(currentDiv.hasClass('saleMobileNavContent_item')){
            var offsetTop=0;
            if(currentDiv.attr('data-index')==0){
                offsetTop = currentDiv.parents('.saleMobileNav').offset().top;
            }else{
                offsetTop = currentDiv.offset().top;
            }
            if (isSend==true && scrollTop + w_h > offsetTop-50) {
                //拿出数据
                var myParent = currentDiv.parents('.saleMobileNav').attr('id'),
                    index = currentDiv.attr('data-index'),
                    itemData= eval("pageData[myParent]."+("item"+index));
                if(itemData.bigImgData){
                    var bigImgProductIds = itemData.bigImgData.ids,
                        bigImgProAcDes = itemData.bigImgData.acDes,
                        bigImgProImgSrc = itemData.bigImgData.imgSrc,
                        productListIds = itemData.proData.ids,
                        grouped_products={};
                    grouped_products['saleBigProImgItems']=bigImgProductIds;
                    grouped_products['proList']=productListIds;
                    //两者都存在
                    getPros(currentDiv,grouped_products,bigImgProAcDes,bigImgProImgSrc);
                }else{
                    var productListIds = itemData.proData.ids;
                    //只存在商品列表
                    getSinglePros(currentDiv,productListIds);
                }
            }
            return;
        }
        
    }
}
//加载单个
function getSinglePros(proBox,ids,proDes,proImg){
    public.loading('block');
    proBox.data('status', 'close');
    $.ajax({
        type: "post",
        url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
        dataType: 'jsonp',
        data: {
            product_ids: ids,
            agent: agent
        },
        beforeSend:function(){isSend=false;} ,
        success: function (res) {
            if (res.code == 1) {
                var data = res.data.data;
                var info='';
                var proIdsObj = ids.split(',');
                if(proBox.hasClass('saleBigProImg')){//如果是大图商品
                    var proDesObj = proDes.split(','),
                        proImgObj = proImg.split(',');
                    for(var i=0;i<proIdsObj.length;i++){
                        var currentData =data[proIdsObj[i]];
                        info += '<a class="saleBigProImg_item" href="'+currentData.url+ '" title="' + currentData.name + '">'+
                                    '<img src="'+proImgObj[i]+'" alt="'+currentData.name+'">'+
                                    '<div class="saleBigProMsg">'+
                                        '<div class="proAcTit">'+proDesObj[i]+'</div>'+
                                        '<div class="proTit">'+currentData.name +'</div>'+
                                        '<div class="proAcPrice">'+
                                            '<em><i>￥</i>'+currentData.store_price+'</em>'+
                                            '<span><i>￥</i>';
                                            if (currentData.home_market_price == 0) {
                                                info += currentData.market_price;
                                            }else {
                                                info += currentData.home_market_price;
                                            }
                                            info +='</span>'+
                                        '</div>'+
                                        '<div class="buyNowBtn">立即购买</div>'+
                                    '</div>'+
                                '</a>';
                    }
                    proBox.html(info);
                }else if(proBox.hasClass('saleProList') || proBox.hasClass('saleMobileNavContent_item')){ //如果是商品列表
                    for(var i in proIdsObj){
                        var currentData =data[proIdsObj[i]];
                        info +='<li>'+
                                '<a href="'+currentData.url+ '" title="' + currentData.name +'">'+
                                    '<div class="pro_top">'+
                                        '<img src="'+currentData.picUrl+'" alt="'+currentData.name+'" class="proImg"> '+
                                        '<div class="pro_tit">'+currentData.name+'</div>'+
                                        '<div class="pro_price">￥'+currentData.store_price+'</div>'+
                                    '</div>'+
                                   '<div class="pro_from clearfix">'+
                                       '<div class="pro_nation"><img src="'+currentData.country_logo_circle+'" alt="" class="nationLogo">'+currentData.country_name+'</div>'+
                                       '<div class="pro_website">'+currentData.origin_site_short+'</div>'+
                                   '</div>'+
                                '</a>'+ 
                            '</li>';
                    }
                    proBox.find('ul').html(info);
                }
            }else{
               proBox.data('status', 'open');
            }
            public.loading('none');
        },
        complete:function(){
            setTimeout(function(){isSend=true;},200);
        }
    });

}
function getPros(proBox, grouped_products,proDes,proImg) {
    public.loading('block');
    proBox.data('status', 'close');
    $.ajax({
        type: "POST",
        url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
        dataType: 'jsonp',
        data: {
            grouped_products: grouped_products,
            grouped: true,
            agent:agent
        },
        beforeSend:function(){isSend=false;} ,
        success: function(res) {
            if (res.code == 1) {
                var data = res.data.data;
                for(var el in grouped_products){
                    var info='';
                    var productIds = grouped_products[el].split(',');//['1223','1232131']
                    if(el=='saleBigProImgItems'){
                        var proDesObj = proDes.split(','),
                            proImgObj = proImg.split(',');
                        for(var i in productIds){
                            var currentData = data[el][productIds[i]];
                            info += '<a class="saleBigProImg_item" href="'+currentData.url+ '" title="'+ currentData.name + '">'+
                                    '<img src="'+proImgObj[i]+'" alt="'+currentData.name+'">'+
                                    '<div class="saleBigProMsg">'+
                                        '<div class="proAcTit">'+proDesObj[i]+'</div>'+
                                        '<div class="proTit">'+currentData.name +'</div>'+
                                        '<div class="proAcPrice">'+
                                            '<em><i>￥</i>'+currentData.store_price+'</em>'+
                                            '<span><i>￥</i>';
                                            if (currentData.home_market_price == 0) {
                                                info += data[el].market_price;
                                            }else {
                                                info += data[el].home_market_price;
                                            }
                                            info +='</span>'+
                                        '</div>'+
                                        '<div class="buyNowBtn">立即购买</div>'+
                                    '</div>'+
                                '</a>';

                        }
                        proBox.find('.saleBigProImgItems').html(info);
                    }else if(el=='proList'){
                        for(var i in productIds){
                             var currentData = data[el][productIds[i]];
                             info +='<li>'+
                                '<a href="'+currentData.url+ '" title="' + currentData.name +'">'+
                                    '<div class="pro_top">'+
                                        '<img src="'+currentData.picUrl+'" alt="'+currentData.name+'" class="proImg"> '+
                                        '<div class="pro_tit">'+currentData.name+'</div>'+
                                        '<div class="pro_price">￥'+currentData.store_price+'</div>'+
                                    '</div>'+
                                   '<div class="pro_from clearfix">'+
                                       '<div class="pro_nation"><img src="'+currentData.country_logo_circle+'" alt="" class="nationLogo">'+currentData.country_name+'</div>'+
                                       '<div class="pro_website">'+currentData.origin_site_short+'</div>'+
                                   '</div>'+
                                '</a>'+ 
                            '</li>';
                        }
                        proBox.find('.proList ul').html(info);
                    }
                    
                }
            
            } else {
                proBox.data('status', 'open');
            }
            public.loading('none');
        },
        complete:function(){
            setTimeout(function(){isSend=true;},200);
        }
    });
}



//固定导航点击跳转
function scrollTo(this_destination){
    var y= x;
    if(agent=="h5"){
        y = x+$('.fixNav').height();
    }
    $('html,body').animate({scrollTop:this_destination.offset().top-y}, 800); 
}


