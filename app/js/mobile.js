$(function(){
    var agent="h5";
    //左侧固定栏背景色配置
    $('#bgColor').on('click','label',function(){
        var me =$(this),
            myRadio = me.find('input[type="radio"]');
            index = me.index(),
            childRadio = me.parent().next();
        if(myRadio.is(':checked')){
            if(index==1){
               childRadio.hide();
            }else{
                childRadio.show();
            }
        }
            
    }).next().on('click','input[type="radio"]',function(){
        var me = $(this);
        if(me.val()=='背景色'){
            var colorValue = me.next().val();
            if(me.is(":checked") && colorValue!=''){
                $('#container').css('background',colorValue);
            }   
        }else{
            var imgValue = me.parent().next().find('img').attr('src');
            if(me.is(":checked") && imgValue!=''){
                $('#container').css({"background":"url("+imgValue+") no-repeat fixed","background-size":'cover'});
            }   
        }
    });
    $('#pageBgColor').on('change',function(){
        var me = $(this),
            colorValue = me.val();
        $('#container').css({"background":colorValue});
    });
    //请求关联接口
    var associationEventOption='',
        associationCategoryListOption="";
    // 判断是否登入
    $.ajax({
        type: "post",
        url: "http://erp.baobeigezi.com/activityTemplate/adpos/add_adposv",
        dataType: 'jsonp',
        async: false,
        data: {},
        success: function (res) {
                //专场
                var associationEvent = res.event;//为数组
                    eventLength = associationEvent.length;
                for(var el in associationEvent){
                    var current = associationEvent[el];
                    associationEventOption+='<option value ="'+current.id+'">'+current.id+'-'+current.ad_name+'</option>';
                }
                //分类
                var associationCategoryList = res.category_list;//为数组
                    categoryListLength = associationCategoryList.length;
                for(var el in associationCategoryList){
                    var current = associationCategoryList[el];
                    associationCategoryListOption+='<option value ="'+current.id+'">'+current.id+'-'+current.category_name+'</option>';
                }
        }
    });
    var pageData={};
    //上传图片
    $(document).on('change','input.uploadImgBtn',function(){ //上传图片操作
        var me = $(this);
        var options = {
            success: function (res) {
                console.log(res,typeof res);
                var res = JSON.parse(res);
                if(!res.code){
                    $('#tipsShadeBox').find('.tipsText').text('请先登录ERP').end().show();
                    return;
                }
                if(res.code==1){
                    var txt = res.pic_url;
                    if(me.hasClass('uploadProImgBtn') || me.hasClass('uploadShareImgBtn') ){
                        me.prev().attr('src',txt).css({'max-width':'100%','max-height':'100%',"margin-top":0,'width':'auto'});
                    }else{
                        var previewImg = me.parents('.itemContent').find('.previewImg');
                        if(previewImg.length==0){
                            var div = $('<div class="previewImg"></div>');
                            div.html('<img src="'+ txt +'" alt="" />');
                            me.parents('.itemContent').append(div);
                        }else{
                            previewImg.find('img').attr('src',txt);
                        } 
                    }
                    me.attr('data-img',txt);
                    //如果选中的是背景图
                    if(me.attr("id") && me.parents('.pageBgImg').find('input[type="radio"]').is(':checked')){
                        $('#container').css({"background":"url("+txt+") no-repeat fixed","background-size":'cover'});
                    }
                }else{
                    $('#tipsShadeBox').find('.tipsText').text(res.msg).end().show();
                }
            }
        };
        me.parent().ajaxSubmit(options);
        return false;
    })
    //添加模块操作
    //记录各个模块的id最大数
    var numArray = {'saleSlideBanners':2,"saleBanner":1,"saleTwoColumns":1,"saleMobileNav":1,"saleBigProImg":1,"saleProList":1,"saleVideo":1}
    $('#templatesList').on('click','a',function(){
        var me = $(this),
            templateName = me.attr('data-template'),
            templateContent='';
        if(templateName=='saleSlideBanners'){
            templateContent = addSaleSlideBanners(templateContent);
            numArray["saleSlideBanners"]+=1;
        }else if(templateName=='saleBanner'){
            templateContent = addSaleBanner(templateContent);
            numArray["saleBanner"]+=1;
        }else if(templateName=='saleTwoColumns'){
            templateContent = addSaleTwoColumns(templateContent);
            numArray["saleTwoColumns"]+=1;
        }else if(templateName=='saleMobileNav'){
            templateContent = addSaleMobileNav(templateContent);
            numArray["saleMobileNav"]+=1;
        }else if(templateName=='saleBigProImg'){
            templateContent = addSaleBigProImg(templateContent);
            numArray["saleBigProImg"]+=1;
        }else if(templateName=='saleProList'){
            templateContent = addSaleProList(templateContent);
            numArray["saleProList"]+=1;
        }else if(templateName=='saleVideo'){
            templateContent = addSaleVideo(templateContent);
            numArray["saleVideo"]+=1;
        }
        $('#container').append(templateContent);
    })
    //////////////////////////////////创建编辑遮罩且遮罩上各项操作
    //悬停各层时创建并出现遮罩
    var floorMask='';
    window.onload = function(){
          $('#container').on('mouseover mouseout','.floor',function(event){
        event.preventDefault(); 
        var me = $(this);
        var myFloorMask = me.find('.floorMask');
        if(event.type=="mouseover"){
            if(myFloorMask.length==0){
                var w = me.width(),
                    h = me.height(),
                    horizontalPadding= parseInt(me.css('padding-left'))*2,
                    verticalPadding= parseInt(me.css('padding-top'))+parseInt(me.css('padding-bottom')),
                    template = me.attr('date-template'),
                    templateNum = me.attr('date-templatenum'),
                    title = me.attr('data-title');
                floorMask = '<div class="floorMask">'+
                                '<a href="javascript:;" class="editorBtn" data-template="'+template+'" data-templateNum="'+templateNum+'" data-title="'+title+'"><span class="handle_icon"></span>编辑</a>'+
                                '<a href="javascript:;" class="removeBtn" data-template="'+template+'" data-templateNum="'+templateNum+'" data-title="'+title+'"><span class="handle_icon"></span>删除</a>'+
                                '<a href="javascript:;" class="upBtn" data-template="'+template+'" data-templateNum="'+templateNum+'" data-title="'+title+'"><span class="handle_icon"></a>'+
                                '<a href="javascript:;" class="downBtn" data-template="'+template+'" data-templateNum="'+templateNum+'" data-title="'+title+'"><span class="handle_icon"></a>'+
                                '<a href="javascript:;" class="shortBtn">小遮罩</a>'+
                                '<a href="javascript:;" class="longBtn">大遮罩</a>'+
                                // '<a href="javascript:;" class="addBtn" data-template="'+template+'" data-templateNum="'+templateNum+'">添加模块</a>'+
                            '</div>';
                me.append(floorMask);
                myFloorMask = me.find('.floorMask');
                if(template=="saleTwoColumns"){
                    $('.twoColumns_item').last().css('margin-top:0');
                }
                myFloorMask.width(w+horizontalPadding).height(h+verticalPadding);
                var floorItems = $('#container').children('.floor');
                changeState(floorItems,'floorMask');
            }
            myFloorMask.show();
        }else if(event.type=="mouseout"){
            myFloorMask.hide();
        }
    }).on('click','.floorMask a',function(event){    //各层遮罩a标签点击事件
        var me = $(this),
            templateName = me.attr('data-template'),
            templateNum = me.attr('data-templateNum'),
            title = me.attr('data-title');
        //如果点击的是编辑按钮，则弹出相应的编辑框
        if(me.hasClass('editorBtn')){
            var  thisMask = $('#'+templateName+'EditorMask'+templateNum);
            if(thisMask.length==0){
                var  maskContent = showEditorMask(templateName,templateNum,title);
                $('#containerMask').append(maskContent);
                var select = $('#containerMask').find(".chosen-select");
                select.chosen();
                select.next().width(select.width());
                thisMask = $('#'+templateName+'EditorMask'+templateNum);
            }
            var bgColor = '';
            //如果以及设置了整体页面颜色，则模块内颜色不能再改变
            if($('#bgColor').find('input').eq(0).is(':checked')){
                if($('#pageBgColor').prev().is(':checked')){
                    bgColor = $('#pageBgColor').val();
                }else{
                    bgColor = '背景图';
                }
                thisMask.find('.floorBg').find('.form_control').val(bgColor).css({'color':"#bbb"}).attr("disabled", true);
            }else{
                thisMask.find('.floorBg').find('.form_control').val('#fff').css({'color':"#333"}).attr("disabled", false);
            }
            thisMask.show().siblings().hide().end().parent().show();
            $("body").css("overflow","hidden");
        //如果点击的是删除按钮，则删除该模块
        }else if(me.hasClass('removeBtn')){
            // warningBox('警告','确定要删除该模块？');
            $('#'+templateName+templateNum).remove().unbind();
            $('#'+templateName+'EditorMask'+templateNum).remove().unbind();
            //更新数据
            for(var el in pageData){
                delete(pageData[templateName+templateNum]);
            }
            var floorItems = $('#container').children('.floor');
            changeState(floorItems,'floorMask');
        //如果点击的是向上按钮，则移动该模块向上一级
        }else if(me.hasClass('upBtn')){
            if(me.hasClass('noUp')){
                return;
            }
            var me_floor = me.parents('.floorMask').parent('.floor');
            me_floor.after(me_floor.prev());
            var floorItems = $('#container').children('.floor');
            changeState(floorItems,'floorMask');
            //改变状态

        //如果点击的是向下按钮，则移动该模块向下一级
        }else if(me.hasClass('downBtn')){
            if(me.hasClass('noDown')){
                return;
            }
            var me_floor = me.parents('.floorMask').parent('.floor');
            me_floor.before(me_floor.next());
            var floorItems = $('#container').children('.floor')
            changeState(floorItems,'floorMask');
        }else if(me.hasClass('shortBtn')){
            me.parent().width('auto').height('auto');
        }else if(me.hasClass('longBtn')){
            var me_floor = me.parents('.floor');
            me.parent().width(me_floor.width()).height(me_floor.height());
        }
    })
    }
  
    //////////////////////////////////各个模块编辑框及其操作
    //a标签操作
    // var txt;
    $('#containerMask').on('click','.maskContent a',function(event){
        event.preventDefault();
        var me = $(this);
        //关闭遮罩
        if(me.hasClass('closeBtn')||me.hasClass('cancel_btn')){
            $(this).parents('.containerMask').hide();
            $('body').css("overflow","auto");
            return;
        }
        //增加行操作
        if(me.hasClass('addBtnInFloor')){
            var itemInFloor = me.parent().find('.floor_item');
                // index =itemInFloor.length+1,
                templateName = me.attr('data-templateName'),
                templateNum = me.attr('data-templateNum'),
                itemsLength = parseInt(me.attr('data-itemsLength'))+1,
                newFloorItem='';
            if(templateName=='saleSlideBanners'){
                newFloorItem = addOneSaleSlideBanners(templateNum+itemsLength,templateName);
            }else if(templateName=='saleTwoColumns'){
                newFloorItem = addOneSaleTwoColumns(templateNum+itemsLength,templateName);
            }else if(templateName=='saleMobileNav'){
                newFloorItem = addOneSaleMobileNav(templateNum+itemsLength,templateName);
            }else if(templateName=='saleMapArea'){
                newFloorItem = addOneSaleMapArea(templateNum+itemsLength,templateName);
            }
            me.attr('data-itemsLength',itemsLength);
            me.before(newFloorItem);
            var select = me.prev().find(".chosen-select");
                select.chosen();
                select.next().width(select.width());
            itemInFloor = me.parent().find('.floor_item');
            changeState(itemInFloor,itemInFloor.find('.handleBtnInfloor'));
            return;
        } 
        //编辑框中上移下移删除操作
        if(me.parent().is('.handleBtnInfloor')){
            if(me.hasClass('noUp') || me.hasClass('noDown') || me.hasClass('noRemove')){
                return;
            }
            var parent = me.parent().parent(),
                maskInner= parent.parent();
            if(me.hasClass('upBtn')){
                parent.after(parent.prev());
            }else if(me.hasClass('downBtn')){
                parent.before(parent.next());
            }else if(me.hasClass('removeBtn')){
                parent.remove().unbind();
            }
            var floor_items = maskInner.find('.floor_item');
            //同时各按钮要改变状态
            changeState(floor_items,floor_items.find('.handleBtnInfloor'));
            return;
        }
        //如果是添加商品id列表
        if(me.hasClass('addIdsBtn')){
            var proIds = me.prev().val();
            var templateName = me.attr('data-templateName');
            //验证
            if(proIds==''){
                alert('请输入商品id');
                return;
            }
            var pattern = /\s+/g;//去掉字符串内空白字符
            proIds = proIds.replace(pattern,',');
            pattern = /^,+|,+$/g;//去掉首尾空格
            proIds =proIds.replace(pattern,''),
            isSend = true;
            var content ='',
                addProListsTable=0;
            if(me.parent().parent().find('.proListsTable').length==0){
                addProListsTable =1;
            }
            //请求接口成功的话
            $.ajax({
                type: "POST",
                url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
                dataType: 'jsonp',
                data: {
                     product_ids: proIds,
                     agent: agent
                },
                beforeSend:function(){isSend=false;},       
                success: function(res) {
                    if (res.code == 1) {
                        var data = res.data.data;
                        if(addProListsTable==1){
                            content ='<div>'+
                                '<table class="proListsTable">'+
                                    '<thead>'+
                                        '<tr>'+
                                            '<th>商品编号</th>'+
                                            '<th>商品名称</th>'+
                                            '<th>活动价</th>'+
                                            '<th>市场价</th>';
                                            if(templateName=="saleBigProImg" || me.parents('.addBigImgItem').length>0){
                                                content+='<th>广告词</th>'+
                                                        '<th>商品横图</th>';
                                            }
                                            
                                            content+='<th>操作</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>';
                        }
                        var proIdsObj = proIds.split(',');
                        for(var i in proIdsObj){
                            var currentData =data[proIdsObj[i]];
                                marketPrice = '';
                            if (currentData.home_market_price == 0) {
                                marketPrice = currentData.market_price;
                            } else {
                                marketPrice = currentData.home_market_price;
                            }
                            content+='<tr>'+
                                    '<td class="proId">'+currentData.id+'</td>'+
                                    '<td class="proName" data-href="'+currentData.url+'"data-src="'+currentData.picUrl+'"data-nationName="'+currentData.country_name+'" data-nationFlag="'+currentData.country_logo_circle+'" data-nationWeb="'+currentData.origin_site_short+'" data-marketPrice="'+marketPrice+'">'+ currentData.name+'</td>'+
                                    '<td class="salePrice">'+currentData.store_price+'</td>'+
                                    '<td>'+marketPrice+'</td>';
                                    if(templateName=="saleBigProImg" || me.parents('.addBigImgItem').length>0){
                                        content+= 
                                        '<td><textarea class="saleAcDes" rows="3"></textarea></td>'+
                                        '<td>'+
                                            '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                                '<img src="images/uploadImg.png" alt="上传图片">'+
                                                '<input type="file" class="uploadProImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                            '</form>'+
                                        '</td>';
                                    }
                                    content+=
                                        '<td>'+
                                            '<a href="javascript:;" class="upBtn"><span class="handle_icon"></span></a>'+
                                            '<a href="javascript:;" class="downBtn"><span class="handle_icon"></span></a>'+
                                            '<a href="javascript:;" class="removeBtn"><span class="handle_icon"></span></a>'+
                                        '</td>'+
                                '</tr>';
                        }
                        if(addProListsTable==1){
                            content += '</tbody>'+
                                '</table>'+
                                '<a class="deleteTable" href="javascript:;">删除全部</a>'+
                            '</div>';
                            me.parent().parent().append(content);
                        }else{
                            me.parent().next().find('tbody').html(content);
                        }
                        var newTrs = me.parent().next().find('tbody').find('tr');
                        newTrs.first().find('a.upBtn').addClass('noUp');
                        newTrs.last().find('a.downBtn').addClass('noDown');
                    } 
                },
                complete:function(){
                    setTimeout(function(){isSend=true;},200)
                }
            });
           
             return;
        }
        //全部删除表格数据
        if(me.hasClass('deleteTable')){
            me.parent().remove().unbind();
            return;
        }
        //如果是表格内数据上下移动和删除
        if(me.parent().is('td')){
            if(me.hasClass('noUp') || me.hasClass('noDown')){
                return;
            }
            var currentTr = me.parent().parent(),
                currentTable = currentTr.parent();
            if(me.hasClass('upBtn')){
                currentTr.after(currentTr.prev());
            }else if(me.hasClass('downBtn')){
                currentTr.before(currentTr.next());
            }else if(me.hasClass('removeBtn')){
                if(currentTable.find('tr').length==1){//如果是最后一个整个table都删除
                    currentTable.parent().parent().remove();
                }else{
                    currentTr.remove().unbind();
                }
            }
            var trs =  currentTable.find('tr');
            changeState(trs,currentTable);
             return;
        }
        if(me.is('.bottomBtn .ok_btn')){
            var maskInner = me.parents('.maskInner');
                myBgColor = maskInner.find('.floorBg').find('input'),
                myBgColorVal='',
                myGap = maskInner.find('input.gapInput'),
                myItems = maskInner.find('.floor_item');
            var EditorMask = me.parents('.maskContent').parent(),
                EditorMaskName = EditorMask.attr('id'),
                partName = EditorMaskName.replace('EditorMask',''),
                partId =  $('#'+partName);
                newHtml="";
            for(var i=0;i<myGap.length;i++){
                if(myGap.eq(i).val()==""){
                    alert('模块距离不能为空');
                    return;
                }
                if(myGap.eq(i).val()<0){
                    alert('模块距离不能为负');
                    return;
                }
            }
            if(myBgColor.attr('disabled')!="disabled"){
                if(myBgColor.val()==''){
                    alert('请输入模块背景色');
                    return;
                }
                myBgColorVal=myBgColor.val();
            }else{
                myBgColorVal="transparent";
            }
            var topMargin = myGap.eq(0).val(),
                topPadding = myGap.eq(1).val(),
                bottomMargin = myGap.eq(2).val(),
                bottomPadding = myGap.eq(3).val(),
                paddingLeft = partId.css('padding-left').replace('px',''),
                paddingRight = partId.css('padding-right').replace('px','');
            //如果轮播图
            if(partId.hasClass('saleSlideBanners')){
                if(myItems.length<=1){
                    // me.parent().append($('<span class="red">轮播图不能少于2张图片</span>'));
                    // setTimeout(function(){me.siblings(".red").remove()},2000);
                    alert('轮播图不能少于2张图片');
                    return;
                }
                for(var i=0;i<myItems.length;i++){
                    var currentItems = myItems.eq(i),
                        currentFileBtn = currentItems.find('input[type="file"]'),
                        currentImg  = currentFileBtn.attr("data-img");
                    if(!currentImg){
                        alert('请上传图片');
                    }
                    var checkRadio = associationChoose(currentItems,currentFileBtn);
                    if(checkRadio==false){
                        return false;
                    }
                    var association = currentFileBtn.attr('data-association'),
                        href = currentFileBtn.attr('data-href');
                    if(href=='noLink'){
                        newHtml += '<li><a class="pic" data-association="'+association+'"><img src="'+currentImg+'"></a></li>';
                    }else{
                        newHtml += '<li><a class="pic" href="'+href+'" data-association="'+association+'" target="_blank"><img src="'+currentImg+'"></a></li>';
                    }
                }
                var slideCell = '#'+partName;
                partId.find('ul').html(newHtml);
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
                 partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleTwoColumns')){ //如果是两栏图片
                for(var i=0;i<myItems.length;i++){
                    var currentItems = myItems.eq(i),
                        leftPart = currentItems.find('.leftPart'),
                        rightPart = currentItems.find('.rightPart')
                        leftFileBtn = leftPart.find('input[type="file"]'),
                        rightFileBtn = rightPart.find('input[type="file"]'),
                        leftImg  = leftFileBtn.attr("data-img"),
                        rightImg = rightFileBtn.attr("data-img");
                    if(!leftImg||!rightImg){
                        alert('请上传图片');
                        return;
                    }
                    var checkRadioLeft =  associationChoose(leftPart,leftFileBtn);
                    var checkRadioRight = associationChoose(rightPart,rightFileBtn);
                    if(checkRadioLeft ==false || checkRadioRight == false){
                        return false;
                    }
                    var leftAssociation = leftFileBtn.attr('data-association'),
                        leftHref = leftFileBtn.attr('data-href'),
                        rightAssociation = rightFileBtn.attr('data-association'),
                        rightHref = rightFileBtn.attr('data-href');
                    newHtml += '<div class="twoColumns_item clearfix"><a '; 
                    if(leftHref=='noLink'){
                        newHtml +='data-association="'+leftAssociation+'"><img src="'+leftImg+'"></a>';
                    }else{
                        newHtml +=' href="'+leftHref+'" target="_blank" data-association="'+leftAssociation+'"><img src="'+leftImg+'"></a>';
                    }
                    if(rightHref=='noLink'){
                        newHtml +='<a data-association="'+rightAssociation+'"><img src="'+rightImg+'"></a></div>';
                    }else{
                        newHtml += '<a href="'+rightHref+'" target="_blank" data-association="'+rightAssociation+'"><img src="'+rightImg+'"></a></div>';
                    }
                }
                partId.find('.twoColumns_item').remove().end().prepend(newHtml);
                partId.find('.twoColumns_item').last().css('margin-bottom',0);
                partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleBanner')){  //如果是单张图片
                var fileBtn = myItems.find('input[type="file"]'),
                    img = fileBtn.attr("data-img");
                if(!img){
                    alert('请上传图片');
                    return;
                }
                var checkRadio = associationChoose(myItems,fileBtn);

                if(checkRadio == false){
                    return false;
                }
                var association = fileBtn.attr('data-association'),
                    href = fileBtn.attr('data-href');
                if(href=='noLink'){
                    partId.find('a.pic').attr('data-association',association).find('img').attr('src',img);
                }else{
                    partId.find('a.pic').attr('data-association',association).attr('href',href).attr('target',"_blank").find('img').attr('src',img);
                }
                partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleBigProImg')){ //大图商品
                if(maskInner.find('.proListInput').val()==""){
                    alert('请输入商品id');
                    return;
                }
                if(maskInner.find('.proListsTable').length==0){
                    alert('请先调取商品');
                    return;
                }
                var bigImgData = {};
                for(var i=0;i<maskInner.find('.proListsTable tbody tr').length;i++){
                    var saleAcDes = maskInner.find('.saleAcDes').eq(i),
                        src = maskInner.find('.uploadProImgBtn').eq(i).attr('data-img'),
                        proId = maskInner.find('.proId').eq(i).text(),
                        proName = maskInner.find('.proName').eq(i),
                        salePrice = maskInner.find('.salePrice').eq(i);
                    if(maskInner.find('.saleAcDes').eq(i).val()==''){
                        alert('缺少广告词');
                        return;
                    }
                    if(!maskInner.find('.uploadProImgBtn').eq(i).attr('data-img')){
                        alert('缺少商品图片');
                        return;
                    }
                    if(i==0){
                       bigImgData['ids']=proId; 
                       bigImgData['imgSrc']=src; 
                       bigImgData['acDes']=saleAcDes.val();
                    }else{
                        bigImgData['ids']+=','+proId;
                        bigImgData['imgSrc']+=','+src;
                        bigImgData['acDes']+=','+saleAcDes.val();
                    }
                    newHtml+='<a class="saleBigProImg_item" href="'+proName.attr('data-href')+'">'+
                                '<img src="'+src+'" alt="'+proName.text()+'">'+
                                '<div class="saleBigProMsg">'+
                                    '<div class="proAcTit">'+saleAcDes.val()+'</div>'+
                                    '<div class="proTit">'+proName.text()+'</div>'+
                                    '<div class="proAcPrice">'+
                                        '<em><i>￥</i>'+salePrice.text()+'</em>'+
                                        '<span><i>￥</i>'+proName.attr('data-marketprice')+'</span>'+
                                    '</div>'+
                                    '<div class="buyNowBtn">立即购买</div>'+
                                '</div>'+
                            '</a>';
                }
                pageData[partName]=bigImgData;
                partId.html(newHtml);
                partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleProList')){ //商品列表
                if(maskInner.find('.proListInput').val()==''){
                    alert('请输入商品id');
                    return;
                }
                if(maskInner.find('.proListsTable').length==0){
                    alert('请先调取商品');
                    return;
                }
                var proData = {};
                //验证
                for(var i=0;i<maskInner.find('.proListsTable tbody tr').length;i++){
                    var saleAcDes = maskInner.find('.saleAcDes').eq(i),
                        proId = maskInner.find('.proId').eq(i).text(),
                        proName = maskInner.find('.proName').eq(i),
                        salePrice = maskInner.find('.salePrice').eq(i);
                        newHtml+='<li>'+
                                    '<a href="'+proName.attr('data-href')+'">'+
                                        '<div class="pro_top">'+
                                            '<img src="'+proName.attr('data-src')+'" class="proImg"> '+
                                            '<div class="pro_tit">'+proName.text()+'</div>'+
                                            '<div class="pro_price">￥'+salePrice.text()+'</div>'+
                                        '</div>'+
                                       '<div class="pro_from clearfix">'+
                                           '<div class="pro_nation"><img src="'+proName.attr('data-nationFlag')+'" alt="" class="nationLogo">'+proName.attr('data-nationName')+'</div>'+
                                           '<div class="pro_website">'+proName.attr('data-nationWeb')+'</div>'+
                                       '</div>'+
                                    '</a>'+ 
                                '</li>';
                    if(i==0){
                       proData['ids']=proId; 
                    }else{
                        proData['ids']+=','+proId;
                    }
                }
                pageData[partName]=proData;
                partId.find('ul').html(newHtml);
                partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleVideo')){ //视频
                var videoSrc = maskInner.find('.inputText').val(),
                    imgSrc = maskInner.find('.uploadImgBtn').attr('data-img');
                if(videoSrc==''){
                    alert('请输入视频地址');
                    return;
                }
                if(!imgSrc){
                    alert('请输入视频海报图');
                    return;
                }
                var videoData = {'videoSrc':videoSrc,'imgSrc':imgSrc};
                pageData[partName]=videoData;
                newHtml+='<video src="'+videoSrc+'" controls="controls" poster="'+imgSrc+'" class="mySaleVideo"></video>';
                partId.find('.saleVideoContent').html(newHtml);
                partId.css({'margin-top':topMargin+'px','margin-bottom':bottomMargin+'px','padding-top':topPadding+'px','padding-bottom':bottomPadding+'px','background-color':myBgColorVal});
            }else if(partId.hasClass('saleMobileNav')){
                var navListHtml='';
                pageData[partName]={};
                for(var i=0;i<maskInner.find('.floor_item').length;i++){
                    pageData[partName]['item'+i]={};
                    var bigImgListHtml='',
                        proListHtml='';
                    var currentFloor = maskInner.find('.floor_item').eq(i),
                        navName = currentFloor.find('.navName').find('.form_control').val(),
                        navTitPic = currentFloor.find('.navTitPic'),
                        navMorePic = currentFloor.find('.navMorePic'),
                        titFileBtn = navTitPic.find('input[type="file"]'),
                        moreFileBtn = navMorePic.find('input[type="file"]'),
                        navBanner  = titFileBtn.attr("data-img"),
                        morePic = moreFileBtn.attr("data-img");
                    if(navName==''){
                        alert('请输入标签栏名称');
                        return;
                    }
                    if(!navBanner){
                        alert('请输入导航图片');
                        return;
                    }
                    var checkRadioTit =  associationChoose(navTitPic,titFileBtn);
                    if(checkRadioTit ==false ){
                        return false;
                    }
                    var titAssociation = titFileBtn.attr('data-association'),
                        titHref = titFileBtn.attr('data-href'),
                        moreAssociation='',
                        moreHref='';
                    if(morePic){
                        var checkRadioMore =  associationChoose(navMorePic,moreFileBtn);
                        if(checkRadioMore ==false ){
                            return false;
                        }
                        moreAssociation = moreFileBtn.attr('data-association');
                        moreHref = moreFileBtn.attr('data-href');
                    }
                    //如果存在大图商品
                    var addBigImgItem = currentFloor.find('.addBigImgItem'),
                        bigImgTbody = addBigImgItem.find('tbody');
                    if(bigImgTbody.find('tr').length>0){
                        var bigImgData = {};
                        bigImgListHtml+='<div class="saleBigProImgItems">'
                        for(var q=0;q<bigImgTbody.find('tr').length;q++){
                            var saleAcDes = bigImgTbody.find('.saleAcDes').eq(q),
                                proId = bigImgTbody.find('.proId').eq(q).text(),
                                src = bigImgTbody.find('.uploadProImgBtn').eq(q).attr('data-img'),
                                proName = bigImgTbody.find('.proName').eq(q),
                                salePrice = bigImgTbody.find('.salePrice').eq(q);
                            if(bigImgTbody.find('.saleAcDes').eq(q).val()==''){
                                alert('缺少广告词');
                                return;
                            }
                            if(!bigImgTbody.find('.uploadProImgBtn').eq(q).attr('data-img')){
                                alert('缺少商品图片');
                                return;
                            }
                            bigImgListHtml+='<a class="saleBigProImg_item" href="'+proName.attr('data-href')+'">'+
                                        '<img src="'+src+'" alt="'+proName.text()+'">'+
                                        '<div class="saleBigProMsg">'+
                                            '<div class="proAcTit">'+saleAcDes.val()+'</div>'+
                                            '<div class="proTit">'+proName.text()+'</div>'+
                                            '<div class="proAcPrice">'+
                                                '<em><i>￥</i>'+salePrice.text()+'</em>'+
                                                '<span><i>￥</i>'+proName.attr('data-marketprice')+'</span>'+
                                            '</div>'+
                                            '<div class="buyNowBtn">立即购买</div>'+
                                        '</div>'+
                                    '</a>';
                            if(0==q){
                               bigImgData['ids']=proId; 
                               bigImgData['imgSrc']=src; 
                               bigImgData['acDes']=saleAcDes.val();
                            }else{
                                bigImgData['ids']+=','+proId;
                                bigImgData['imgSrc']+=','+src;
                                bigImgData['acDes']+=','+saleAcDes.val();
                            }
                        
                        }
                        pageData[partName]['item'+i]['bigImgData']=bigImgData;
                        bigImgListHtml+='</div>';
                    }
                    //商品列表
                    var proList =currentFloor.find('.addProListItem'),
                        proListTbody = proList.find('tbody');
                        proListHtml =  '<div class="proList"><ul class="clearfix">';
                        if(proList.find('.proListInput').val()==''){
                            alert('请添加商品列表id');
                            return;
                        }
                        if(proListTbody.length==0){
                            alert('请先调取商品列表商品');
                            return;
                        }
                    var proData = {};
                    for(var j=0;j<proListTbody.find('tr').length;j++){
                        var saleAcDes = proListTbody.find('.saleAcDes').eq(j),
                            proId = proListTbody.find('.proId').eq(j).text(),
                            proName = proListTbody.find('.proName').eq(j),
                            salePrice = proListTbody.find('.salePrice').eq(j);
                            proListHtml+='<li>'+
                                        '<a href="'+proName.attr('data-href')+'">'+
                                            '<div class="pro_top">'+
                                                '<img src="'+proName.attr('data-src')+'" class="proImg"> '+
                                                '<div class="pro_tit">'+proName.text()+'</div>'+
                                                '<div class="pro_price">￥'+salePrice.text()+'</div>'+
                                            '</div>'+
                                           '<div class="pro_from clearfix">'+
                                               '<div class="pro_nation"><img src="'+proName.attr('data-nationFlag')+'" alt="" class="nationLogo">'+proName.attr('data-nationName')+'</div>'+
                                               '<div class="pro_website">'+proName.attr('data-nationWeb')+'</div>'+
                                           '</div>'+
                                        '</a>'+ 
                                    '</li>';
                        if(j==0){
                           proData['ids']=proId; 
                        }else{
                            proData['ids']+=','+proId;
                        }
                    }
                    pageData[partName]['item'+i]['proData']=proData;
                    proListHtml+='</ul></div>'
                    //导航内容
                    navListHtml += '<li><a href="javascript:;" class="';
                    if(i==0){
                        navListHtml += 'currentNav';
                    }
                    navListHtml+='">'+navName+'</a></li>';

                    newHtml += '<div class="saleMobileNavContent_item loadPro" style="margin-top:'+topMargin+'px;margin-bottom:'+bottomMargin+'px;padding-top:'+topPadding+'px;padding-bottom:'+bottomPadding+'px;background-color:'+myBgColorVal+'" data-index="'+i+'">'+
                                '<a class="navTitleImg" '; 

                                if(titHref=='noLink'){
                                    newHtml +='data-association="'+titAssociation+'"><img src="'+navBanner+'"></a>';
                                }else{
                                    newHtml +=' href="'+titHref+'" target="_blank" data-association="'+titAssociation+'"><img src="'+navBanner+'"></a>';
                                }
                                newHtml += bigImgListHtml;
                                newHtml += proListHtml;
                                if(morePic){
                                    newHtml += '<a class="navMoreImg" ';
                                    if(moreHref=='noLink'){
                                        newHtml +='data-association="'+moreAssociation+'"><img src="'+morePic+'"></a>';
                                    }else{
                                        newHtml += 'href="'+moreHref+'" target="_blank" data-association="'+rightAssociation+'"><img src="'+morePic+'"></a>';
                                    }
                                }
                                newHtml +='</div>';
                }  
                partId.find('.nav_top_list ul').html(navListHtml);
                var nav_top_li = partId.find('.nav_top_list').find('li'),
                li_len =0;
                for(var i =0;i<nav_top_li.length;i++){
                    li_len+=nav_top_li.eq(i).width();
                }
                nav_top_li.parent().width(li_len+1);
                // if(li_len<=$(window).width()){
                //     partId.find('.navDropBtn').remove();
                // }
                partId.find('.saleMobileNavContent').html(newHtml);

            }
            //标签栏调整的是每个标题的间距
            setTimeout(function(){
                partId.find('.floorMask').height(partId.outerHeight()).width(partId.outerWidth());
            },300);
            $('#containerMask').hide();
            $("body").css("overflow","auto");
        }
    }).on('click','.associationTypes label',function(){ //关联活动操作
        var me = $(this),
            index = me.index();
        me.parent().next().find('.associationTypeContent').eq(index).show().siblings().hide();
    })
    //关联活动
    function associationChoose(myItems,currentFileBtn){
        var checkedRadio = myItems.find('input[type="radio"]:checked');//获取选中的按钮
            checkedIndex = checkedRadio.parent().index(),//获取选中按钮对应的index值
            checkedDrop = myItems.find('.associationTypeContent').eq(checkedIndex),//获取选中按钮对应的下拉框
            selectSingle = checkedDrop.find('.chosen-single') ,//单选框
            selectVal = selectSingle.find('span').text(),//单选框选中的值
            inputBox =   checkedDrop.find('.form_control'),//输入框
            inputVal = inputBox.val(),//输入框输入值
            tipsWords ='' ;//提示语句
        switch(checkedIndex){
            case 0://关联专场
                if(selectVal=="" ||selectVal=="请选择" ){
                    alert('请选择关联专场');
                    return false;
                }
                var selectId = checkedDrop.find('.specialNameSelect').find('option').filter(function(index){return $(this).text()==selectVal}).val();
                currentFileBtn.attr('data-association','zhuanchang-'+selectId).attr('data-href','http://3g.baobeigezi.com/event/detail?id='+selectId);
                break;
            case 1://关联商品
                if(inputVal==''){
                    alert('请输入关联商品id');
                    return false;
                } 
                currentFileBtn.attr('data-association','shangpin-'+inputVal).attr('data-href','http://3g.baobeigezi.com/product/'+inputVal+'.html');
                break;
            case 2://关联链接地址
                if(inputVal==''){
                    alert('请输入关联链接地址');
                    return false;
                } 
                currentFileBtn.attr('data-association','link-'+inputVal).attr('data-href',inputVal);
                break;
            case 4://搜索
                if(inputVal==''){
                    alert('请输入搜索关键词');
                    return false;
                } 
                currentFileBtn.attr('data-association','keywords-'+inputVal).attr('data-href','http://3g.baobeigezi.com/search?q='+encodeURIComponent(inputVal));
                break;
            case 5://分类
                if(selectVal=="" ||selectVal=="请选择" ){
                    alert('请选择分类');
                    return false;
                }
                var selectId = checkedDrop.find('.classifySelect').find('option').filter(function(index){return $(this).text()==selectVal}).val();
                currentFileBtn.attr('data-association','fenlei-'+selectId+'-'+selectVal).attr('data-href','http://m.cdn.baobeigezi.com/category/one/'+selectId+'.html');
                break;
            case 6://品牌
                // if(selectVal=="" ||selectVal=="请选择" ){
                //     alert('请选择品牌');
                //     return false;
                // }
                if(inputVal==''){
                    alert('请输入品牌名称');
                    return false;
                } 
                currentFileBtn.attr('data-association','pinpai-'+inputVal).attr('data-href','http://3g.baobeigezi.com/search?q='+encodeURIComponent(inputVal));
                break;
            case 7://关联攻略
                if(inputVal==''){
                    alert('请输入攻略编号');
                    return false;
                } 
                currentFileBtn.attr('data-association','gonglve-'+inputVal).attr('data-href','http://3g.baobeigezi.com/guide/'+inputVal+'.html');
                break;
            case 8://拼团活动
                if(inputVal==''){
                    alert('请输入拼团活动链接');
                    return false;
                } 
                currentFileBtn.attr('data-association','pintuan-'+inputVal).attr('data-href',inputVal);
                break;
            case 9://代金券
                if(inputVal==''){
                    alert('请输入代金券编号');
                    return false;
                } 
                currentFileBtn.attr('data-association','lingquan-'+inputVal).attr('data-href','noLink').removeAttr('href');
                break;
            default://为空
                currentFileBtn.attr('data-association','noLink').attr('data-href','noLink').removeAttr('href');
        }
   
    }
    //警告框
    function warningBox(tit,txt){
        if($('#warningBox').length==0){
            var warningDiv = '<div id="warningBox">'+
                                '<div class="tit">'+tit+'</div>'+
                                '<a href="javascript:;" class="closeBtn"><span class="handle_icon"></span></a>'+
                                '<div class="warningContent">'+
                                '<div>'+txt+'</div>'+
                                '<div>'+
                                    '<a href="javascript:;" class="okBtn">确定</a>'+
                                    '<a href="javascript:;" class="cancleBtn">取消</a>'+
                                '</div>'+
                            +'</div>';
        }

    }
    //编辑框中上移下移删除操作后各按钮状态更新
    function changeState(itemInFloor,itemParent){
        var downBtn = null,
            upBtn = null,
            removeBtn = null;
        if(itemParent && itemParent=="floorMask"){ //遮罩上的
            downBtn = itemInFloor.find('.'+itemParent).find('.downBtn');
            upBtn = downBtn.prev();
            removeBtn = upBtn.prev();
        }else{
            if(itemParent){
                downBtn = itemParent.find('.downBtn');
            }else{
                downBtn = itemInFloor.find('.downBtn');
            }
            upBtn = downBtn.prev();
            removeBtn = downBtn.next();
        }
        //改变是否可以上移下移操作
        if(itemInFloor.length==1){
            downBtn.attr('class','downBtn noDown');
            upBtn.attr('class','upBtn noUp');
            removeBtn.attr('class','removeBtn noRemove');
        }else{
            for(var i=0;i<itemInFloor.length;i++){
                var currentDownBtn = downBtn.eq(i),
                currentUpBtn = upBtn.eq(i),
                currentRemoveBtn = removeBtn.eq(i);
                if(i==0){
                    currentDownBtn.removeClass('noDown');
                    currentUpBtn.attr('class','upBtn noUp');
                    currentRemoveBtn.removeClass('noRemove');
                }else if(i==itemInFloor.length-1){
                    currentDownBtn.attr('class','downBtn noDown');
                    currentUpBtn.removeClass('noUp');
                    currentRemoveBtn.removeClass('noRemove');
                }else{
                    currentDownBtn.removeClass('noDown');
                    currentUpBtn.removeClass('noUp');
                    currentRemoveBtn.removeClass('noRemove');
                }
              
            }
        }
    }
    //编辑遮罩层的状态
    function changeAllState(itemInFloor,itemParent){
       
    }
    //////////////////////////////////增加各模块操作
    //增加一栏图片模块
    function addSaleBanner(templateContent){
        var num = parseInt(numArray["saleBanner"])+1;
        templateContent = $('<div class="saleBanner floor" date-template="saleBanner" id="saleBanner'+num+'" date-templateNum="'+num+'" data-title="一栏图片">'+
                                '<a class="pic" href="">'+
                                    '<img src="images/yizhang.jpg" alt=""/>'+
                                '</a>'+
                            '</div>');
        return templateContent;
    }
    //增加图片轮播模块
    function addSaleSlideBanners(templateContent){
        var num = parseInt(numArray["saleSlideBanners"])+1;
        templateContent = $('<div class="saleSlideBanners floor" date-template="saleSlideBanners" id="saleSlideBanners'+num+'" date-templateNum="'+num+'" data-title="轮播图片">'+
                                '<div class="bannerList">'+
                                    '<ul>'+
                                        '<li>'+
                                            '<a class="pic" href="">'+
                                                '<img src ="images/lunbo.jpg" />'+
                                            '</a>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="controlBtn">'+
                                    '<ul></ul>'+
                                '</div>'+
                            '</div>');
        return templateContent;
    }
    //增加两栏图片
    function addSaleTwoColumns(templateContent){
        var num = parseInt(numArray["saleTwoColumns"])+1;
            templateContent = $('<div class="saleTwoColumns floor" date-template="saleTwoColumns" id="saleTwoColumns'+num+'" date-templatenum="'+num+'" data-title="两栏图片">'+
                                    '<div class="twoColumns_item clearfix">'+
                                       '<a href=""><img src="images/lianglan.jpg" alt=""></a>'+
                                       '<a href=""><img src="images/lianglan.jpg" alt=""></a>'+
                                    '</div>'+
                                    '<div class="twoColumns_item clearfix">'+
                                       '<a href=""><img src="images/lianglan.jpg" alt=""></a>'+
                                       '<a href=""><img src="images/lianglan.jpg" alt=""></a>'+
                                    '</div>'+
                                '</div>');
        return templateContent;
    }
    //增加导航栏
    function addSaleMobileNav(templateContent){
        var num = parseInt(numArray["saleMobileNav"])+1;
            templateContent = $('<div class="saleMobileNav floor" date-template="saleMobileNav" id="saleMobileNav'+num+'" date-templatenum="'+num+'" data-title="导航栏">'+
                                    '<div class="fixNav">'+
                                        '<div class="nav_top">'+
                                            '<div class="nav_top_list">'+
                                                '<ul class="clearfix">'+
                                                    '<li><a href="javascript:;" class="currentNav">导航1</a></li>'+
                                                '</ul>'+
                                            '</div>'+
                                            // '<a href="javascript:;" class="navDropBtn"><span class="saleIcon downDropIcon"></span></a>'+
                                        '</div>'+
                                        // '<div class="navDropContent">'+
                                        //     '<ul class="clearfix">'+
                                        //         '<li><a href="javascript:;">导航1</a></li>'+
                                        //     '</ul>'+
                                        // '</div>'+
                                    '</div>'+
                                    '<div class="saleMobileNavContent">'+
                                        '<div class="saleMobileNavContent_item loadPro" data_index="0">'+
                                            <!--如果图片标签不能点击要删掉href属性-->
                                            '<a href="" class="navTitleImg"><img src="images/navTitImg.jpg" alt=""></a>'+
                                            <!--如果有大图商品-->
                                            '<div class="saleBigProImgItems">'+
                                                '<a class="saleBigProImg_item" href="">'+
                                                    '<img src="images/bigImg.jpg" alt="">'+
                                                    '<div class="saleBigProMsg">'+
                                                        '<div class="proAcTit">广告词广告词广告词广告词广告词广告词</div>'+
                                                        '<div class="proTit">商品名称标题标题标题标题标题标题标题商品名称标题标题标题标题标题标题标题商品名称标题标题标题标题标题标题标题商品名称标题标题标题标题标题标题标题商品名称标题标题标题标题标题标题标题商品名称标题标题标题标题标题标题标题</div>'+
                                                        '<div class="proAcPrice">'+
                                                            '<em><i>￥</i>45.00</em>'+
                                                            '<span><i>￥</i>22.50</span>'+
                                                        '</div>'+
                                                        '<div class="buyNowBtn">立即购买</div>'+
                                                    '</div>'+
                                                '</a>'+
                                            '</div>'+
                                            '<div class="proList">'+
                                                '<ul class="clearfix">'+
                                                    '<li>'+
                                                        '<a>'+
                                                           '<div class="pro_top">'+
                                                                '<img src="http://img02.baoimg.net/photo/201608/2016080813002282896821_250x250.jpg" class="proImg"> '+
                                                                '<div class="pro_tit">商品标题标题标题标题标题标题标题标题标题标题标题标题标题</div>'+
                                                                '<div class="pro_price">￥1233</div>'+
                                                            '</div>'+
                                                           '<div class="pro_from clearfix">'+
                                                               '<div class="pro_nation"><img src="http://static01.baocdn.com/images/country/m_index_8.png" alt="" class="nationLogo">加拿大</div>'+
                                                               '<div class="pro_website">amazonamazonsdhfshf</div>'+
                                                           '</div>'+
                                                        '</a>'+
                                                    '</li>'+
                                                    '<li>'+
                                                        '<a>'+
                                                            '<div class="pro_top">'+
                                                                '<img src="http://img02.baoimg.net/photo/201608/2016080813002282896821_250x250.jpg" class="proImg"> '+
                                                                '<div class="pro_tit">商品标题标题标题标题标题标题标题标题标题标题标题标题标题</div>'+
                                                                '<div class="pro_price">￥1233</div>'+
                                                            '</div>'+
                                                           '<div class="pro_from clearfix">'+
                                                               '<div class="pro_nation"><img src="http://static01.baocdn.com/images/country/m_index_8.png" alt="" class="nationLogo">加拿大</div>'+
                                                               '<div class="pro_website">amazonamazonsdhfshf</div>'+
                                                           '</div>'+
                                                        '</a>'+ 
                                                    '</li>'+
                                                '</ul>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>');
        return templateContent;
    }
    //增加大图商品
    function addSaleBigProImg(templateContent){
        var num = parseInt(numArray["saleBigProImg"])+1;
        templateContent = $('<div class="saleBigProImg floor loadPro" date-template="saleBigProImg" id="saleBigProImg'+num+'" date-templatenum="'+num+'" data-title="大图商品">'+
                                '<a class="saleBigProImg_item" href="">'+
                                    '<img src="images/bigImg.jpg" alt="">'+
                                    '<div class="saleBigProMsg">'+
                                        '<div class="proAcTit">广告词广告词广告词广告词广告词广告词</div>'+
                                        '<div class="proTit">商品名称标题标题标题标题标题标题标题</div>'+
                                        '<div class="proAcPrice">'+
                                            '<em><i>￥</i>45.00</em>'+
                                            '<span><i>￥</i>22.50</span>'+
                                        '</div>'+
                                        '<div class="buyNowBtn">立即购买</div>'+
                                    '</div>'+
                                '</a>'+
                            '</div>');
        return templateContent;
    }
    //增加商品列表
    function addSaleProList(templateContent){
        var num = parseInt(numArray["saleBigProImg"])+1;
        templateContent = $('<div class="saleProList floor  loadPro" date-template="saleProList" id="saleProList'+num+'" date-templatenum="'+num+'" data-title="商品列表">'+
                                '<div class="proList">'+
                                    '<ul class="clearfix">'+
                                        '<li>'+
                                            '<a>'+
                                                '<div class="pro_top">'+
                                                   '<img src="http://img02.baoimg.net/photo/201608/2016080813002282896821_250x250.jpg" class="proImg">'+ 
                                                    '<div class="pro_tit">商品标题标题标题标题标题标题标题标题标题标题标题标题标题</div>'+
                                                    '<div class="pro_price">￥1233</div>'+
                                                '</div>'+
                                               '<div class="pro_from clearfix">'+
                                                   '<div class="pro_nation"><img src="http://static01.baocdn.com/images/country/m_index_8.png" alt="" class="nationLogo">加拿大</div>'+
                                                   '<div class="pro_website">amazonamazonsdhfshf</div>'+
                                               '</div>'+
                                            '</a> '+
                                        '</li>'+
                                        '<li>'+
                                            '<a>'+
                                                '<div class="pro_top">'+
                                                    '<img src="http://img02.baoimg.net/photo/201608/2016080813002282896821_250x250.jpg" class="proImg">'+ 
                                                    '<div class="pro_tit">商品标题标题标题标题标题标题标题标题标题标题标题标题标题</div>'+
                                                    '<div class="pro_price">￥1233</div>'+
                                                '</div>'+
                                               '<div class="pro_from clearfix">'+
                                                    '<div class="pro_nation"><img src="http://static01.baocdn.com/images/country/m_index_8.png" alt="" class="nationLogo">加拿大</div>'+
                                                    '<div class="pro_website">amazonamazonsdhfshf</div>'+
                                               '</div>'+
                                            '</a>'+ 
                                        '</li>'+
                                    '</ul>'+
                                '</div>'+
                           '</div>');
        return templateContent;
    }
    function addSaleVideo(templateContent){
        var num = parseInt(numArray["saleBigProImg"])+1;
        templateContent = $('<div class="saleVideo floor" date-template="saleVideo" id="saleVideo'+num+'" date-templatenum="'+num+'" data-title="视频">'+
                               '<div class="saleVideoContent loadPro">'+
                                   '<video src="" controls="controls" poster="images/img3.jpg" class="mySaleVideo">'+
                                    '</video>'+ 
                                '</div>'+
                            '</div>');
        return templateContent;

    }
    //////////////////////////////////首次添加各模块编辑行内容
    function showEditorMask(templateName,templateNum,title){
        var content='';
        if(templateName=='saleMobileNav'){
            content='<div class="saleMobileNavEditorMask" id="saleMobileNavEditorMask'+templateNum+'">'+
                        '<div class="maskContent">'+
                            '<a class="closeBtn" href="javascript:;"><span class="handle_icon"></span></a>'+
                            '<div class="maskTitle">'+title+'</div>'+
                            '<div class="maskInner">'+
                                addOneSaleMobileNav(templateNum,templateName)+
                                '<a href="" class="addBtnInFloor" data-templateName="'+templateName+'" data-itemsLength="1"><span class="handle_icon"></span>添加标签</a>'+
                                '<div class="bottomBtn">'+
                                    '<a href="javascript:;" class="ok_btn">保存</a>'+
                                    '<a href="javascript:;" class="cancel_btn">取消</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

        }else{
            content= '<div class="'+templateName+'EditorMask" id="'+templateName+'EditorMask'+templateNum+'">'+
                        '<div class="maskContent">'+
                            '<a class="closeBtn" href="javascript:;"><span class="handle_icon"></span></a>'+
                            '<div class="maskTitle">'+title+'</div>'+
                            '<div class="maskInner">'+
                               '<div class="floorBg item clearfix">'+
                                   '<span class="label">模块背景色：</span>'+
                                   '<div class="itemContent">'+
                                        '<input type="text" value="#fff" class="form_control"/>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="floorGap item clearfix">'+
                                    '<span class="label">模块距离上部间距：</span>'+
                                    '<div class="itemContent">外间距：<input type="text" value="0" class="form_control gapInput topMargin"/>px</div>'+
                                    '<div class="itemContent">内间距：';
                                    if(templateName=="saleTwoColumns"){
                                        content+='<input type="text" value="30" class="form_control gapInput topPadding" />px';
                                    }else{
                                        content+='<input type="text" value="0" class="form_control gapInput topPadding" />px';
                                    }
                                    content+='</div>'+
                                '</div>'+
                                '<div class="floorGap item clearfix">'+
                                    '<span class="label">模块距离下部间距：</span>'+
                                    '<div class="itemContent">外间距：<input type="text" value="0" class="form_control gapInput bottomMargin"/>px</div>'+
                                    '<div class="itemContent">内间距：';
                                       if(templateName=="saleTwoColumns"){
                                            content+='<input type="text" value="30" class="form_control gapInput bottomPadding"/>px';
                                        }else{
                                            content+='<input type="text" value="0" class="form_control gapInput bottomPadding"/>px';
                                        }
                                        content+='</div>'+
                                '</div>';
                                if(templateName=="saleSlideBanners"){
                                    content+=addOneSaleSlideBanners(templateNum+1,templateName);
                                    content+='<a href="" class="addBtnInFloor" data-templateName="'+templateName+'" data-templateNum="'+templateNum+'" data-itemsLength="1"><span class="handle_icon"></span>添加行</a>';
                                }else if(templateName=="saleBanner"){
                                    content+=addOneSaleBanner(templateNum,templateName);
                                }else if(templateName=="saleTwoColumns"){
                                    content+=addOneSaleTwoColumns(templateNum+"1",templateName);
                                    content+='<a href="" class="addBtnInFloor" data-templateName="'+templateName+'" data-templateNum="'+templateNum+'" data-itemsLength="1"><span class="handle_icon"></span>添加行</a>';
                                }else if(templateName=="saleBigProImg"){
                                    content+=saleBigProImgIn(templateNum,templateName);
                                }else if(templateName=="saleVideo"){
                                    content+=saleVideoIn(templateNum,templateName);
                                }else if(templateName=="saleProList"){
                                    content+=saleProListIn(templateNum,templateName);
                                }else if(templateName=="saleMapArea"){
                                    content+=addOneSaleMapArea(templateNum,templateName);
                                    content+='<a href="" class="addBtnInFloor" data-templateName="'+templateName+'" data-templateNum="'+templateNum+'" data-itemsLength="1"><span class="handle_icon"></span>添加图片</a>';
                                }
                                content+='<div class="bottomBtn">'+
                                    '<a href="javascript:;" class="ok_btn">保存</a>'+
                                    '<a href="javascript:;" class="cancel_btn">取消</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        }
        return content;
    }
    //////////////////////////////////编辑框增加行操作及内部各层内容
    //关联活动
    function relatedAc(index,templateName){
        var content='<div class="item clearfix">'+
                        '<span class="label noHeightLabel">关联</span>'+
                        '<div class="itemContent">'+
                            '<div class="associationTypes item">'+
                                '<label><input type="radio" value="关联专场" checked="checked" name="'+templateName+'AssociationTypes'+index+'">关联专场</label>'+
                                '<label><input type="radio" value="关联商品"  name="'+templateName+'AssociationTypes'+index+'">关联商品</label>'+
                                '<label><input type="radio" value="关联链接地址"  name="'+templateName+'AssociationTypes'+index+'" >关联链接地址</label>'+
                                '<label><input type="radio" value="为空"  name="'+templateName+'AssociationTypes'+index+'" >为空</label>'+
                                '<label><input type="radio" value="搜索"  name="'+templateName+'AssociationTypes'+index+'" >搜索</label>'+
                                '<label><input type="radio" value="分类"  name="'+templateName+'AssociationTypes'+index+'" >分类</label>'+
                                '<label><input type="radio" value="品牌"  name="'+templateName+'AssociationTypes'+index+'" >品牌</label>'+
                                '<label><input type="radio" value="关联攻略" name="'+templateName+'AssociationTypes'+index+'" >关联攻略</label>'+
                                '<label><input type="radio" value="拼团活动" name="'+templateName+'AssociationTypes'+index+'" >拼团活动</label>'+
                                '<label><input type="radio" value="代金券"  name="'+templateName+'AssociationTypes'+index+'" class="voucherType">代金券</label>'+
                            '</div>'+
                            '<div class="associationTypesContent">'+
                                '<div class="specialContent associationTypeContent">'+<!--关联专场-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">关联专场:</span>'+
                                        '<div class="itemContent">'+
                                            '<select autocomplete="off" class="specialNameSelect chosen-select">'+
                                                '<option value="-1" selected>请选择</option>'+
                                                associationEventOption+
                                            '</select>'+
                                        '</div>'+
                                    '</div>'+
                                    // '<div class="item clearfix">'+
                                    //     '<span class="label">编号:</span>'+
                                    //     '<div class="itemContent">'+
                                    //         '<input type="text" placeholder="" class="inputText form_control">'+
                                    //     '</div>'+
                                    // '</div>'+
                                    // '<div class="item clearfix">'+
                                    //     '<span class="label">专场名称:</span>'+
                                    //     '<div class="itemContent">'+
                                    //         '<input type="text" placeholder="" class="inputText form_control">'+
                                    //     '</div>'+
                                    // '</div>'+
                                '</div>'+
                                '<div class="proContent associationTypeContent hide">'+<!--关联商品-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">商品编号:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                    // '<div class="item clearfix">'+
                                    //     '<span class="label">商品名称:</span>'+
                                    //     '<div class="itemContent">'+
                                    //         '<input type="text" class="inputText form_control" val="" >'+
                                    //     '</div>'+
                                    // '</div>'+
                                    //  '<div class="item clearfix">'+
                                    //     '<span class="label">当前正品可售库存:</span>'+
                                    //     '<div class="itemContent">'+
                                    //         '<input type="text" class="inputText form_control" val="" >'+
                                    //     '</div>'+
                                    // '</div>'+
                                '</div>'+
                                '<div class="proContent associationTypeContent hide">'+<!--关联链接地址-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">链接:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="emptyContent associationTypeContent hide">'+<!--为空-->
                                '</div>'+
                                '<div class="proContent associationTypeContent hide">'+<!--搜素关键词-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">搜索关键词:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="classifyContent associationTypeContent hide">'+<!--分类-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">分类:</span>'+
                                        '<div class="itemContent">'+
                                            '<select autocomplete="off" class="classifySelect chosen-select">'+
                                                '<option value="-1" selected>请选择</option>'+
                                               associationCategoryListOption+
                                            '</select>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="brandContent associationTypeContent hide">'+<!--品牌-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">品牌:</span>'+
                                        '<div class="itemContent">'+
                                            //原先为下拉框，因为app端没有这个搜搜改为直接输入关键字
                                            // '<select autocomplete="off" class="brandSelect chosen-select">'+
                                            //     '<option value="-1" selected>请选择</option>'+
                                            //     '<option value ="0">活动1</option>'+
                                            //     '<option value ="1">中秋</option>'+
                                            //     '<option value="2">十一</option>'+
                                            // '</select>'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="guideContent associationTypeContent hide">'+<!--关联攻略-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">攻略编号:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="groupContent associationTypeContent hide">'+<!--拼团活动-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">链接:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" class="inputText form_control" val="" >'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="voucherContent associationTypeContent hide">'+<!--关联代金券-->
                                    '<div class="item clearfix">'+
                                        '<span class="label">代金券编号:</span>'+
                                        '<div class="itemContent">'+
                                            '<input type="text" placeholder="" class="inputText form_control">'+
                                        '</div>'+
                                    '</div>'+
                                    // '<div class="item clearfix">'+
                                    //     '<span class="label">代金券名称:</span>'+
                                    //     '<div class="itemContent">'+
                                    //         '<input type="text" placeholder="" class="inputText form_control">'+
                                    //     '</div>'+
                                    // '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        return content;
    }
    //一栏图片行内容
    function addOneSaleBanner(index,templateName){
        var content= '<div class="item floor_item">'+
                        '<div class="item clearfix">'+
                            '<span class="label noHeightLabel">图片</span>'+
                            '<div class="itemContent">'+
                                '<div class="uploadImg">'+
                                    '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                        '<img src="images/uploadImg.png" alt="上传图片">'+
                                        '<input type="file" class="uploadBannerImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                    '</form>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        relatedAc(index,templateName)+
                    '</div>';
        return content;       
    }
    //轮播图片添加行、轮播图片行内容
    function addOneSaleSlideBanners(index,templateName){
        var content= '<div class="item floor_item">'+
                        '<div class="item clearfix">'+
                            '<span class="label noHeightLabel">图片</span>'+
                            '<div class="itemContent">'+
                                '<div class="uploadImg">'+
                                    '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                        '<img src="images/uploadImg.png" alt="上传图片">'+
                                        '<input type="file" class="uploadBannerImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                    '</form>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        relatedAc(index,templateName)+
                        '<div class="handleBtnInfloor">'+
                            '<a href="javascript:;" class="upBtn noUp"><span class="handle_icon"></span></a>'+
                            '<a href="javascript:;" class="downBtn noDown"><span class="handle_icon"></span></a>'+
                            '<a href="javascript:;" class="removeBtn noRemove"><span class="handle_icon"></span></a>'+
                        '</div>'+
                    '</div>';
        return content;           

    }
    //两栏图片添加行、两栏图片行内容
    function addOneSaleTwoColumns(index,templateName){
        var content= '<div class="item floor_item">'+
                        '<div class="leftPart">'+
                            '<div class="item clearfix">'+
                                '<span class="label noHeightLabel">左侧图片</span>'+
                                '<div class="itemContent">'+
                                    '<div class="uploadImg">'+
                                        '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                            '<img src="images/uploadImg.png" alt="上传图片">'+
                                            '<input type="file" class="uploadtwoColumnsImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                        '</form>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            relatedAc(index+"1",templateName)+
                        '</div>'+
                        '<div class="rightPart">'+
                            '<div class="item clearfix">'+
                                '<span class="label noHeightLabel">右侧图片</span>'+
                                '<div class="itemContent">'+
                                    '<div class="uploadImg">'+
                                        '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                            '<img src="images/uploadImg.png" alt="上传图片">'+
                                            '<input type="file" class="uploadtwoColumnsImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                        '</form>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                             relatedAc(index+"2",templateName)+
                        '</div>'+
                        '<div class="handleBtnInfloor">'+
                            '<a href="javascript:;" class="upBtn noUp"><span class="handle_icon"></span></a>'+
                            '<a href="javascript:;" class="downBtn noDown"><span class="handle_icon"></span></a>'+
                            '<a href="javascript:;" class="removeBtn noRemove"><span class="handle_icon"></span></a>'+
                        '</div>'+
                    '</div>';
        return content;           
    }
    //热区添加图片、内容
    function addOneSaleMapArea(index,templateName){
         var content = '<div class="item floor_item">'+
                            '<div class="item clearfix">'+
                                '<span class="label">图片：</span>'+
                                '<div class="itemContent">'+
                                    '<div class="uploadImg">'+
                                        '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                            '<img src="images/uploadImg.png" alt="上传图片">'+
                                            '<input type="file" class="uploadSaleMapAreaBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                        '</form>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="handleBtnInfloor">'+
                                '<a href="javascript:;" class="upBtn noUp"><span class="handle_icon"></span></a>'+
                                '<a href="javascript:;" class="downBtn noDown"><span class="handle_icon"></span></a>'+
                                '<a href="javascript:;" class="removeBtn noRemove"><span class="handle_icon"></span></a>'+
                            '</div>'+
                        '</div>';
        return content;
    }
    //大图商品内容
    function saleBigProImgIn(index,templateName){
        var content = '<div class="item floor_item">'+
                            '<div class="item clearfix">'+
                                '<span class="label">添加大图商品：</span>'+
                                '<div class="itemContent">'+
                                   '<textarea class="form_control proListInput" rows="3" ></textarea>'+
                                   '<a href="javascript:;" class="ok_btn addIdsBtn" data-templateName='+templateName+'>确定</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        return content;
    }
    //标签栏添加行、标签栏行内容
    function addOneSaleMobileNav(index,templateName){
         var content = '<div class="item floor_item">'+
                            '<div class="navName item clearfix">'+
                               '<span class="label">标签栏名称：</span>'+
                               '<div class="itemContent">'+
                                    '<input type="text" value="" class="form_control"/>'+
                                    '<span class="grey">建议5个字以内</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="floorBg item clearfix">'+
                               '<span class="label">模块背景色：</span>'+
                               '<div class="itemContent">';
                                var bgColor = '';
                                //如果以及设置了整体页面颜色，则模块内颜色不能再改变
                                if($('#bgColor').find('input').eq(0).is(':checked')){
                                    if($('#pageBgColor').prev().is(':checked')){
                                        bgColor = $('#pageBgColor').val();
                                    }else{
                                        bgColor = '背景图';
                                    }
                                    content+='<input type="text" value="'+bgColor+'" class="form_control" style="color:#bbb" disabled="disabled" />';
                                }else{
                                    content+='<input type="text" value="#fff" class="form_control" />';
                                }
                                content+=
                                '</div>'+
                            '</div>'+
                            '<div class="floorGap item clearfix">'+
                                '<span class="label">模块距离上部间距：</span>'+
                                '<div class="itemContent">外间距：<input type="text" value="0" class="form_control gapInput topMargin"/>px</div>'+
                                '<div class="itemContent">内间距：<input type="text" value="25" class="form_control gapInput topPadding"/>px</div>'+
                            '</div>'+
                            '<div class="floorGap item clearfix">'+
                                '<span class="label">模块距离下部间距：</span>'+
                                 '<div class="itemContent">外间距：<input type="text" value="0" class="form_control gapInput bottomMargin"/>px</div>'+
                                    '<div class="itemContent">内间距：<input type="text" value="15" class="form_control gapInput bottomPadding"/>px</div>'+
                            '</div>'+
                            '<div class="item navTitPic">'+
                                '<div class="item clearfix">'+
                                    '<span class="label noHeightLabel">导航图片:</span>'+
                                    '<div class="itemContent">'+
                                        '<div class="uploadImg">'+
                                            '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                                '<img src="images/uploadImg.png" alt="上传图片">'+
                                                '<input type="file" class="uploadtwoColumnsImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                            '</form>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                relatedAc(index+"1",templateName)+
                            '</div>'+
                            '<div class="item addBigImgItem clearfix">'+
                                '<span class="label">添加大图商品<span class="red">(可选)</span>：</span>'+
                                '<div class="itemContent">'+
                                   '<textarea class="form_control proListInput" rows="3" ></textarea>'+
                                   '<a href="javascript:;" class="ok_btn addIdsBtn" data-templateName='+templateName+'>确定</a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="item addProListItem clearfix">'+
                                '<span class="label">添加商品列表：</span>'+
                                '<div class="itemContent">'+
                                   '<textarea class="form_control proListInput" ></textarea>'+
                                   '<a href="javascript:;" class="ok_btn addIdsBtn" data-templateName='+templateName+'>确定</a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="item navMorePic">'+
                                '<div class="item clearfix">'+
                                    '<span class="label noHeightLabel">更多图片<span class="red">(可选)</span>:</span>'+
                                    '<div class="itemContent">'+
                                        '<div class="uploadImg">'+
                                            '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                                '<img src="images/uploadImg.png" alt="上传图片">'+
                                                '<input type="file" class="uploadtwoColumnsImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                            '</form>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                relatedAc(index+"2",templateName)+
                            '</div>'+
                            '<div class="handleBtnInfloor">'+
                                '<a href="javascript:;" class="upBtn noUp"><span class="handle_icon"></span></a>'+
                                '<a href="javascript:;" class="downBtn noDown"><span class="handle_icon"></span></a>'+
                                '<a href="javascript:;" class="removeBtn noRemove"><span class="handle_icon"></span></a>'+
                            '</div>'+
                        '</div>';
        return content;
    }
   
    //视频内容
    function saleVideoIn(){
        var content = '<div class="item floor_item">'+
                            '<div class="item clearfix">'+
                                '<span class="label">视频地址：</span>'+
                                '<div class="itemContent">'+
                                   '<input type="text" value="" class="form_control inputText"/>'+
                                '</div>'+
                            '</div>'+
                            '<div class="item clearfix">'+
                                '<span class="label">视频海报图：</span>'+
                                '<div class="itemContent">'+
                                    '<div class="uploadImg">'+
                                        '<form action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
                                            '<img src="images/uploadImg.png" alt="上传图片">'+
                                            '<input type="file" class="uploadtwoColumnsImgBtn uploadImgBtn" accept="image/*" name="pic" />'+
                                        '</form>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        return content;
    }
    //商品列表内容
    function saleProListIn(index,templateName){
        var content = '<div class="item floor_item">'+
                            '<div class="item clearfix">'+
                                '<span class="label">添加商品列表：</span>'+
                                '<div class="itemContent">'+
                                   '<textarea class="form_control proListInput" ></textarea>'+
                                   '<a href="javascript:;" class="ok_btn addIdsBtn" data-templateName='+templateName+'>确定</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        return content;
    }
    
    //视频的 高度和宽度自适应
    function getVideoInfo(){
        var video = $('.mySaleVideo'),
            videoW = video.videoWidth;
            wideoH=  video.videoHeight;
            videoRdio = videoW/wideoH;

    }
    //点击发布
    $('.aside_btn a').on('click',function(){
        console.log(pageData);
        for(var el in pageData){
            if($('#'+el).length==0){
                delete(pageData[el]);
            }
        }
        //验证
        if($('#saleName').val()==''){
            alert('请输入活动名称');
            return;
        }
        var bg = $('#bgColor').find('input:radio:checked'),
            // TotalPageBg = '',
            styleCss="";
        if(bg.parent().index()==0){
           var pageBg =  $('#bgColor').next().find('input:radio:checked');
           if(pageBg.val()=='背景色'){
                var bgValue = pageBg.next().val();
                if(bgValue==''){
                    alert('请输入色值');
                    return;
                }
                // TotalPageBg=bgValue;
                styleCss = 'background-color:'+bgValue+'"';
           }else{
                if(!$('#pageBgImg').attr('data-img')){
                    alert('请传入背景图片');
                    return;
                }
                var TotalPageBg = $('#pageBgImg').attr('data-img');

                styleCss = 'background-image:url('+TotalPageBg+');background-repeat:no-repeat;background-attachment:fixed;background-size:cover;';

           }
        }else{
            for(var i=0;i<$('#containerMask').find('.floorBg').length;i++){
                var floorBg =$('#containerMask').find('.floorBg').eq(i),
                    bgColor = floorBg.find('.form_control').val();
                if(bgColor==''){
                    alert('有模块没有输入色值');
                    return;
                }
            }
        }
        if(!$('#uploadShareImgBtn').attr('data-img')){
            alert('请输入分享图片');
            return;
        }
        if($('#shareTitle').val()==''){
            alert('请输入分享标题');
            return;
        }
        if($('#shareContent').val()==''){
            alert('请输入分享内容');
            return;
        }
        if($('#container').find('.floor').length==0){
            alert('请先建立模块');
            return;
        }
        var title = $('#saleName').val(),
            shareContent=$("#shareContent").val();
            // pageBg = TotalPageBg;
        //验证完毕
        //写入分享内容
        pageData['shareDate']={
                                shareImg:$("#uploadShareImgBtn").attr("data-img"),
                                shareTitle:$("#shareTitle").val(),
                                shareText:shareContent
                            }
                           
        var statsCode = 'var _hmt = _hmt || [];'+
                        '(function() {'+
                        'var hm = document.createElement("script");'+
                        'hm.src = "//hm.baidu.com/hm.js?ee4f84e0797d5b2c5ff29789b7ff2314";'+
                        'var s = document.getElementsByTagName("script")[0];'+
                        's.parentNode.insertBefore(hm, s);'+
                        '})();';
        if($(this).hasClass("publishBtn")){
            var finishedPage = pageContent(shareContent,title,styleCss,statsCode,pageData);
            $.ajax({
                type: "post",
                url: "http://erp.baobeigezi.com/activityTemplate/editor/saveTemplate",
                dataType: 'jsonp',
                data: {
                    is_ajax : 'yes',
                    type:1,
                    htmlContent:finishedPage
                },
                success: function (res) {
                    console.log(res);
                    if(res.code == 0){
                        $('#tipsShadeBox').find('.tipsText').text(res.msg).end().show();
                    }else{
                        $('#tipsShadeBox').find('.tipsText').html(res.msg+'<br>网址为:'+res.cdn_url).end().show();
                        window.open(res.cdn_url,"_blank");
                    }
                }
            });
        }
        if($(this).hasClass("previewBtn")){
            var previewPage = previewPageContent(shareContent,title,styleCss,statsCode,pageData);
            var winchild=window.open("","_target");
            winchild.document.write(previewPage);
        }
    })
    function changeMargin(styleDiv){
        var topMargin = (parseFloat(styleDiv.css('margin-top').replace('px',''))/750*100).toFixed(2),
            topPadding = (parseFloat(styleDiv.css('padding-top').replace('px',''))/750*100).toFixed(2),
            bottomMargin = (parseFloat(styleDiv.css('margin-bottom').replace('px',''))/750*100).toFixed(2),
            bottomPadding = (parseFloat(styleDiv.css('padding-bottom').replace('px',''))/750*100).toFixed(2);
        styleDiv.css({'margin-top':topMargin+'%','margin-bottom':bottomMargin+'%','padding-top':topPadding+'%','padding-bottom':bottomPadding+'%'});
    }
    function pageContent(shareContent,title,styleCss,statsCode,pageData){
        var pageMainContent =$('<div></div>').html($('#container').html());
        for(var i=0;i<pageMainContent.find('.floor').length;i++){
            var currentFloor = pageMainContent.find('.floor').eq(i);
            currentFloor.find('.floorMask').remove();
            if(currentFloor.hasClass('saleBigProImg')){
                currentFloor.empty();
                changeMargin(currentFloor);
                console.log(currentFloor.css('margin-top'),currentFloor.css('padding-top'));
            }else if(currentFloor.hasClass('saleProList')){
                currentFloor.find('ul').empty();
                changeMargin(currentFloor);
            }else if(currentFloor.hasClass('saleVideo')){
                currentFloor.find('video').attr('src','').attr('poster','');
                changeMargin(currentFloor);
            }else if(currentFloor.hasClass('saleMobileNav')){
                currentFloor.find('.fixNav').attr('class','fixNav').removeAttr('style').find('ul').removeAttr('style');
                currentFloor.find('.saleBigProImgItems').empty();
                currentFloor.find('.proList ul').empty();
                var navItems = currentFloor.find('.saleMobileNavContent_item');
                navItems.each(function(index){
                    var currentNavItem = navItems.eq(index);
                    changeMargin(currentNavItem);
                })
            }else if(currentFloor.hasClass('saleSlideBanners')){
                var tempWrap = currentFloor.find('.tempWrap');
                tempWrap.find('ul').removeAttr('style').find('li').removeAttr('style').first().remove().end().last().remove();
                var sliderConten =tempWrap.html();
                currentFloor.find('.bannerList').html(sliderConten).next().find('ul').html('');
                changeMargin(currentFloor);
            }else{
                changeMargin(currentFloor);
                console.log(currentFloor.css('margin-top'),currentFloor.css('padding-top'));
            }
        }
        console.log(pageMainContent);
        var finallyPage='';
            finallyPage=
            '<!DOCTYPE html>'+
            '<html lang="en">'+
                '<head>'+
                    '<meta charset="UTF-8">'+
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
                    '<meta name="description" content="'+shareContent+'">'+
                    '<title>'+title+'</title>'+
                    '<link href="http://sale.baobeigezi.com/css/common.css" rel="stylesheet" type="text/css" />'+
                    '<link href="http://sale.baobeigezi.com/template/h5/css/index.css" rel="stylesheet" type="text/css" />'+
                    '<script>'+
                        statsCode+
                    '</script>'+
                '</head>'+
                '<body >'+
                    '<script>'+
                        'var winW=document.documentElement.clientWidth;'+
                        'var font=document.documentElement.style.fontSize=(winW/750)*100+"px";'+
                    '</script>'+
                    '<div class="wrapper">'+
                        '<div class="head fixed-top hide">'+
                            '<a href="javascript:history.go(-1);" class="back-last"></a>'+
                                '<h1 class="list-title-h1">活动详情</h1>'+
                            '<a class="address-home" href="http://3g.baobeigezi.com"></a>'+
                        '</div>'+
                        '<div class="container" id="container" style="'+styleCss+'">'+
                            pageMainContent.html()+
                        '</div>'+
                        '<div class="shadeBox" id="tipsShadeBox">'+
                            '<div class="shade"></div>'+
                            '<div class="shadeContent">'+
                                '<a href="javascript:;" class="closeBtn saleIcon"></a>'+
                                '<div class="tipsText">这是提示</div>'+
                            '</div>'+
                        '</div>'+
                        '<a class="on_top saleIcon" style="display: none;" href="javascript:void(0)"></a>'+
                    '</div>'+
                    '<script type="text/javascript" src="http://sale.baobeigezi.com/js/jquery-2.1.4.min.js"></script>'+
                    '<script type="text/javascript" src="http://sale.baobeigezi.com/2015/statis.js"></script>'+
                    '<script type="text/javascript" src="http://sale.baobeigezi.com/js/jquery_cookie.min.js"></script>';
                    if($('.saleSlideBanners').length>0){
                       finallyPage+='<script type="text/javascript" src="http://sale.baobeigezi.com/template/h5/js/TouchSlide.1.1.js"></script>';
                    }
                    finallyPage+='<script text="text/javascript">'+"var pageData="+JSON.stringify(pageData)+'</script>'+
                    '<script type="text/javascript" src="http://sale.baobeigezi.com/template/h5/js/index.1.1.js"></script>'+
                '<body>'+
            '</html>';
        return finallyPage;
    }

    function previewPageContent(content,title,styleCss,statsCode,pageData){
        var pageMainContent =$('<div></div>').html($('#container').html());
        for(var i=0;i<pageMainContent.find('.floor').length;i++){
            var currentFloor = pageMainContent.find('.floor').eq(i);
            currentFloor.find('.floorMask').remove();
            if(currentFloor.hasClass('saleBigProImg')){
                currentFloor.empty();
            }else if(currentFloor.hasClass('saleProList')){
                currentFloor.find('ul').empty();
               
            }else if(currentFloor.hasClass('saleVideo')){
                currentFloor.find('video').attr('src','').attr('poster','');
                
            }else if(currentFloor.hasClass('saleMobileNav')){
                currentFloor.find('.fixNav').attr('class','fixNav').removeAttr('style').find('ul').removeAttr('style');
                currentFloor.find('.saleBigProImgItems').empty();
                currentFloor.find('.proList ul').empty();
            }else if(currentFloor.hasClass('saleSlideBanners')){
                var tempWrap = currentFloor.find('.tempWrap');
                tempWrap.find('ul').removeAttr('style').find('li').removeAttr('style').first().remove().end().last().remove();
                var sliderConten =tempWrap.html();
                currentFloor.find('.bannerList').html(sliderConten).next().find('ul').html('');
            }
        }
        var finallyPage='';
            finallyPage=
                '<!DOCTYPE html>'+
                    '<html lang="en">'+
                        '<head>'+
                            '<meta charset="UTF-8">'+
                            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
                            '<meta name="description" content="'+shareContent+'">'+
                            '<title>'+title+'</title>'+
                            '<link href="http://sale.baobeigezi.com/css/common.css" rel="stylesheet" type="text/css" />'+
                            '<link href="http://sale.baobeigezi.com/template/h5/css/preview.css" rel="stylesheet" type="text/css" />'+
                            '<script>'+
                                statsCode+
                            '</script>'+
                        '</head>'+
                        '<body>'+
                            '<div class="wrapper">'+
                                '<div class="head fixed-top">'+
                                    '<a href="javascript:history.go(-1);" class="back-last"></a>'+
                                        '<h1 class="list-title-h1">活动详情</h1>'+
                                    '<a class="address-home" href="http://3g.baobeigezi.com"></a>'+
                                '</div>'+
                                '<div class="container" id="container" style="'+styleCss+'">'+
                                    pageMainContent.html()+
                                '</div>'+
                                '<div class="shadeBox" id="tipsShadeBox">'+
                                    '<div class="shade"></div>'+
                                    '<div class="shadeContent">'+
                                        '<a href="javascript:;" class="closeBtn saleIcon"></a>'+
                                        '<div class="tipsText">这是提示</div>'+
                                    '</div>'+
                                '</div>'+
                                '<a class="on_top saleIcon" style="display: none;" href="javascript:void(0)"></a>'+
                            '</div>'+
                            '<script type="text/javascript" src="http://sale.baobeigezi.com/js/jquery-2.1.4.min.js"></script>'+
                            '<script type="text/javascript" src="http://sale.baobeigezi.com/template/h5/js/TouchSlide.1.1.js"></script>'+
                            '<script type="text/javascript">'+"var pageData="+JSON.stringify(pageData)+'</script>'+
                            '<script type="text/javascript" src="http://sale.baobeigezi.com/template/h5/js/preview.js"></script>'+
                        '<body>'+
                    '</html>';
               
        return finallyPage;
    }
})
