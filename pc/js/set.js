var set={
    'layer':$('#containerMask')
}
set.load=function(){
	//全局设置
	$('.global_btn').click(function(){
		var off = $(this).attr('data-off');
		if(off == 0){
			$('.aside').show();
			$(this).attr('data-off',1);
			set.Aload();
		}else{
			$('.aside').hide();
			$(this).attr('data-off',0);
			set.globalSave();
		}
	})
	$('.aside .close').click(function(){
		$('.aside').hide();
		$('.global_btn').attr('data-off',0);
		set.globalSave();
	})
		//是否有视频
	$('input[name=isRadio]').click(function(){
		if($(this).val() == 1){
			$('.layerF').show();
		}else{
			$('.layerF').hide();
		}
	})
	$('input[name=isA],input[name=isB],input[name=isC],input[name=isE],input[name=isG]').click(function(){
		var layer = $(this).attr('data-layer');
		if($(this).val() == 1){
			$('.layer'+layer).show();
			if(layer == 'G'){
				$('.share_setItem').show();
			}
		}else{
			$('.layer'+layer).hide();
			if(layer == 'G'){
				$('.share_setItem').hide();
			}
		}
	})
	//打开设置层
	$('.layerA,.layerB,.layerC,.layerD,.layerE,.layerG').data('data-initFn',1);//保存初始化结构内容
	$('.template').on('click','.set',function(){
		set.openLayer($(this).attr('data-fn'));
	})
	//取消关闭设置层
	$('.maskContent').on('click','..closeBtn,.cancel_btn',function(){
		set.closeLayer();
	})
	set.layer.click(function(e){
		var $target = $(e.target);
		if(!$target.closest('.maskContent').hasClass('maskContent')){
    		set.closeLayer();
    	}
	})
	//保存设置按钮
	$('.maskContent').on('click','.saveBtn',function(){
		var fn = $(this).attr('data-fn');
		set.save(fn);
	})
	//重置
	$('.maskContent').on('click','.reload',function(e){
		var $target = $(e.target);
		template.popbox('提示','确定要重置模块信息吗？',function(msg){
			if(msg == 1){
				var layer = $target.attr('data-fn');
				set.reloadHtml(layer);
			}
		});
	})
	$('.maskContent').on('hover','.reload',function(e){
		if(e.type == 'mouseenter'){
			$(this).css('background','red');
		}else if(e.type == 'mouseleave'){
			$(this).css('background','#ccc');
		}
	})
	//生成商品列表按钮
	$('.set_c,.set_d').on('click','.addIdsBtn',function(){
		var fn = $(this).attr('data-fn');
		if(fn == 'c'){
			set.shopList(fn);
		}else if(fn == 'd'){
			var floor = $(this).attr('data-floor');
			set.shopList(fn,floor);
		}
	})
	//新增楼层
	var layer_d_num = 4;
	$('.maskContent').on('click','.addBtnInFloor',function(){
		var layer = $(this).attr('data-layer');
		if(layer == 'd'){
			set.shopListAddFloor();
		}else if(layer == 'e'){//新增广告图片 e
			//设置模板
			$('.set_e .floor_item').append(set.tempEHtml(layer_d_num));
			//显示模板
			$('.layerE .box .linkOther').append('<a href="#"><img src="http://sale.baobeigezi.com/template/pc/images/layerE.jpg"></a>');
		}
		layer_d_num++;
	})
	//删除楼层
	/*$('.set_d').on('click','.removeBtn',function(){
		var floorNum = $(this).attr('data-fn');
		$('.set_d').find('.floor_'+floorNum).remove();
		delete template.shopId['Pro'+floorNum];
	})*/
	//b 选项卡
	$('.set_b').on('click','input[name=set_b_adChange_1],input[name=set_b_adChange_2],input[name=set_b_adChange_3],input[name=set_b_adChange_4]',function(){
		var arg = $(this).val();
		var option = $(this).parents('.associationTypes').next('.associationTypesContent');
		console.log(arg,option);
		option.children('.option').hide();
		option.children('.option:eq('+arg+')').show();
	})
	//上传图片
	$(document).on('change','input[name=pic]',function(e){
		var formId = $(this).parents('form').attr('id'),
			layer = $(this).attr('data-layer'),
			x = layer.split('-')[0],
			y = layer.split('-')[1],
			$target = $(e.target);
		set.uploadImg(formId,function(data){
			if(data.code == 1){
				$target.prev('img').attr('src',data.pic_url).attr('src',data.pic_url);
				if(x == 'a'){
					$('.layerA .firstPic img').attr('src',data.pic_url);
				}else if(x == 'b' || x == 'e' || x == 'g'){
					$('.layer'+set.upper(x)).find('img').eq(y).attr('src',data.pic_url);
				}else if(x == 'd'){
					var z = layer.split('-')[2];
					if(y == 1){//顶图
						$('.layerD .box .floor:eq('+z+')').children('.floorBanner').children('img').attr('src',data.pic_url);
					}else if(y == 2){//专场图片
						$('.d_adMoreUrl_'+z).attr('data-adMoreUrl',data.pic_url);
					}
				}
			}
			set.loading('none');
		});
	})
	//上传图片 b 4栏图片
	for(var num=1;num<=4;num++){
		$('.set_b .floor_item').append(set.b_setImgHTML(num));
	}
	for(var num=1;num<4;num++){
		$('.set_e .floor_item').append(set.tempEHtml(num));
	}
	//上下移动
	$('.upBtn,.downBtn').click(function(){
		var model = $(this).attr('data-model'),
			box = $('.layer'+set.upper(model)),
			boxNext = box.next(),
			boxPrev = box.prev();
		if($(this).hasClass('upBtn')){
			box.insertBefore(boxPrev);
		}else{
			box.insertAfter(boxNext);
		}
	})
	//预览页面
	$('.build').click(function(){
		set.globalSave();//全局设置生成
		var isRadio = $('input[name=isRadio]:checked').val(),
			isA = $('input[name=isA]:checked').val(),
			isB = $('input[name=isB]:checked').val(),
			isC = $('input[name=isC]:checked').val(),
			isE = $('input[name=isE]:checked').val(),
			isG = $('input[name=isG]:checked').val(),
			pageMainContent =$('<div></div>').html($('.template').html()),
			isBuild = $(this).attr('data-fn');
		//去掉商品列表中的数据
		console.log(isA,isB,isC,isE);
		pageMainContent.find('.layerD .floor').each(function(){
			$(this).children('.floorBoxs').html('');
		})
		if(isRadio == 0){
			pageMainContent.find('.layerF').remove();
		}
		if(isA == 0){
			pageMainContent.find('.layerA').remove();
		}
		if(isB == 0){
			pageMainContent.find('.layerB').remove();
		}
		if(isC == 0){
			pageMainContent.find('.layerC').remove();
		}
		if(isE == 0){
			pageMainContent.find('.layerE').remove();
		}
		if(isG == 0){
			pageMainContent.find('.layerG').remove();
		}
		if(isBuild == 0){//预览
			var winChild = window.open('','_blank');
			winChild.document.write(set.templateHtml(pageMainContent.html()));
		}else{//生成页面
			set.loading('block');
			$.ajax({
	            type: "post",
	            url: "http://erp.baobeigezi.com/activityTemplate/editor/saveTemplate",
	            dataType: 'json',
	            data: {
	                //is_ajax : 'yes',
	                type:1,
	                htmlContent:set.templateHtml(pageMainContent.html())
	            },
	            success: function (res) {
	                 // console.log(res);
	                if(res.code == 1){
	                	template.popbox('成功','成功！链接地址：<a href='+res.cdn_url+' target=_blank>'+res.cdn_url+'</a>');
	                	//window.open(res.cdn_url);
	                }else{
	                	template.popbox('提示','生成页面出错，请从新生成~');
	                }
	                set.loading('none');
	            }
	        });
		}
	})
}
//上传图片公用方法
set.uploadImg=function(formId,callback){
	set.loading('block');
	var options = {
		success: function (data) {
			callback(JSON.parse(data));
		}
	};
	$("#"+formId).ajaxSubmit(options);
	return;
}
//关闭设置弹层
set.closeLayer=function(){
    set.layer.hide();
}
//打开设置弹层
set.openLayer=function(fn){
	var titBox = $('.maskContent .maskTitle');
	$('.set_op').hide();
	$('.set_'+fn).show();
	var cell = $('.layer'+set.upper(fn));
	var mt = cell.attr('data-mt'),
		mb = cell.attr('data-mb'),
		pt = cell.attr('data-pt'),
		pb = cell.attr('data-pb'),
		layerBg = cell.attr('data-layerBg');
	$('.marginSize:eq(0)').val(pt);
	$('.marginSize:eq(1)').val(pb);
	$('.marginSize:eq(2)').val(mt);
	$('.marginSize:eq(3)').val(mb);
	$('#layerBg').val(layerBg);//背景颜色
	switch(fn){
		case 'a':
			titBox.html('设置头图');
			set.Aload();
			break;
		case 'b':
			titBox.html('设置4栏图片');
			break;
		case 'c':
			titBox.html('设置banner');
			break;
		case 'd':
			titBox.html('设置商品列表');
			break;
		case 'e':
			titBox.html('设置2栏图片');
			break;
		case 'g':
			titBox.html('上传分享图片');
			break;
	}
	set.layer.show();
	if($('.layer'+set.upper(fn)).data('data-initFn') == 1){
		//保存初始化结构内容
		var view_temp = $('.layer'+set.upper(fn)).html();
		var set_temp = $('.set_'+fn).html();
		set.reloadInit['view_'+fn] = '<div class="layer'+set.upper(fn)+'">'+view_temp+'</div>';
		set.reloadInit['set_'+fn] = '<div class="set_op set_'+fn+'" style="display: block;">'+set_temp+'</div>';
		$('.layer'+set.upper(fn)).data('data-initFn',0);
	}
}
//a 模块初始化
var clickNum_a = 0;
set.Aload=function(){
	if(clickNum_a == 0){
		//设置当天时间
		var month = '',
			day = '',
			h = '',
			m = '',
			s = '';
		for(var i=1;i<13;i++){
			month += '<option value="'+i+'">'+i+'</option>';
		}
		for(var i=1;i<32;i++){
			day += '<option value="'+i+'">'+i+'</option>';
		}
		for(var i=0;i<25;i++){
			h += '<option value="'+i+'">'+i+'</option>';
		}
		for(var i=0;i<60;i++){
			m += '<option value="'+i+'">'+i+'</option>';
			s += '<option value="'+i+'">'+i+'</option>';
		}
		$('#set_month,#setStr_month').append(month);
		$('#set_day,#setStr_day').append(day);
		$('#set_hour,#setStr_hour').append(h);
		$('#set_minute,#setStr_minute').append(m);
		$('#set_sec,#setStr_sec').append(s);
		var oDate=new Date();
		$('#set_month,#setStr_month').val(oDate.getMonth()+1); 
		$('#set_day,#setStr_day').val(oDate.getDate());
		clickNum_a++;
	}
}
//转大写
set.upper=function(txt){
	return(txt.toUpperCase());
}
//生成商品列表
set.shopList=function(fn,floor){
	console.log(fn);
	if(fn == 'c'){
		var ids = $('.set_'+fn).find('textarea').val().split("\n");
	}else if(fn == 'd'){
		var ids = $('.set_'+fn).children('.floor_'+floor).find('textarea').val().split("\n");
	}
	for(var idKey in ids){
		if(ids[idKey] == '' || ids[idKey] == 'undefined'){
			ids.splice(idKey,1);
		}
	}
	ids = ids.join();
	if(ids[0]){
		$.ajax({
	        type: "POST",
	        url: "http://list.baobeigezi.com/activity/api_product/get_product_info?callback=?",
	        dataType: 'jsonp',
	        data: {
	            product_ids: ids,
	        },
	        success: function(res) {
	        	console.log(res.data.data);
	        	var data = res.data.data;
	            if (res.code == 1) {
	            	var info="",
                	arr = ids.split(',');
	                for (var el in arr) {
	                	console.log(data[arr[el]]["name"]);
						info += '<tr>'+
						'<td>'+arr[el]+'</td>'+
						'<td>'+data[arr[el]]["name"]+'</td>'+
						'<td>'+data[arr[el]]["store_price"]+'</td>';
						if(data[arr[el]]["home_market_price"] == 0){
							info += '<td>'+data[arr[el]]["market_price"]+'</td>';
						}else{
							info += '<td>'+data[arr[el]]["home_market_price"]+'</td>';
						}
						if(fn == 'c'){
							info += '<td><input type="text" name="c_ad" placeholder="广告词" class="form_control gapInput" /></td>';
						}
						info += '</tr>';
                    }
                    if(fn == 'c'){
                    	$('.set_'+fn).find('.proListsTable tbody').html('');
						$('.set_'+fn).find('.proListsTable tbody').append(info);
						template.shopid_c['ids'] = ids;
					}else if(fn == 'd'){
						$('.set_'+fn).children('.floor_'+floor).find('.proListsTable tbody').html('');
						$('.set_'+fn).children('.floor_'+floor).find('.proListsTable tbody').append(info);
						//写到页面
						console.log(ids);
                    	template.shopId['Pro'+floor] = ids;
					}
	            }else{
	            	alert('没有数据，重新操作');
	            }
	        }
	    });
	}else{
		alert('填写商品id，可从excel中直接复制');
	}
}
//商品列表 - 增加楼层
var floorNum = 2;
set.shopListAddFloor=function(){
	var floor = $('.set_d').find('.floor');
	floor.last().after(set.shopListSetHTML(floorNum));
	//页面模板
	$('.layerD').find('.floor').last().after(set.shopListHTML(floorNum));
	floorNum++;
}
//商品楼层模板
set.shopListSetHTML=function(floor){
var html = '<div class="item floor_item floor floor_'+floor+'">'+
	//'<div class="handleBtnInfloor"><a href="javascript:;" class="removeBtn" data-fn="'+floor+'"><span class="handle_icon"></span></a></div>'+
	'<h4 style="font-weight:900;color:#e67e22;">#'+floor+'楼#</h4>'+
	'<div class="floorBg item clearfix">'+
	  '<span class="label">楼层名称：</span>'+
	  '<div class="itemContent">'+
	    '<input type="text" name="set_dFloorName" value="" class="form_control gapInput" placeholder="楼层名称" />'+
	  '</div>'+
	'</div>'+
	'<div class="item clearfix">'+
	  '<span class="label noHeightLabel">楼层顶图</span>'+
	  '<div class="itemContent">'+
	    '<div class="uploadImg">'+
	    	'<form id="d_img_1_'+eval(floor-1)+'" action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
	      '<img src="http://sale.baobeigezi.com/template/pc/images/uploadImg.png" alt="上传图片" />'+
	      '<input type="file" class="uploadBannerImgBtn uploadImgBtn" name="pic" data-layer="d-1-'+eval(floor-1)+'" />'+
	      '</form>'+
	    '</div>'+
	  '</div>'+
	'</div>'+

	'<div class="item clearfix">'+
		'<span class="label noHeightLabel">专场图片</span>'+
		'<div class="itemContent">'+
			'<div class="uploadImg">'+
				'<form id="d_img_2_'+eval(floor-1)+'" action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
					'<img src="http://sale.baobeigezi.com/template/pc/images/uploadImg.png" alt="上传图片" />'+
					'<input type="file" class="uploadBannerImgBtn uploadImgBtn d_adMorePic" name="pic" data-layer="d-2-'+eval(floor-1)+'" />'+
				'</form>'+
			'</div>'+
			'<em style="color:#5cb85c;">宽高（240*300px）</em>'+
		'</div>'+
	'</div>'+
	'<div class="floorBg item clearfix">'+
		'<span class="label">专场图片链接：</span>'+
		'<div class="itemContent">'+
			'<input type="text" name="d_adMoreUrl" value="" class="form_control gapInput d_adMoreUrl_'+eval(floor-1)+'" placeholder="专场图片链接url" />'+
		'</div>'+
	'</div>'+

	'<div class="floorBg item clearfix">'+
      '<span class="label">广告词：</span>'+
      '<div class="itemContent">'+
        '<input type="text" name="shop_ad" value="" class="form_control gapInput" placeholder="给第一个商品设置广告词" /><em style="color:#5cb85c;">（默认只给第一个商品加广告词）</em>'+
      '</div>'+
    '</div>'+
	  '<div class="item clearfix">'+
	    '<span class="label" style="display:block;clear:both;float:none;">商品列表（从excel表中直接复制商品id）：</span>'+
	    '<div class="itemContent" style="width:10%;height:300px;">'+
	      '<textarea class="form_control proListInput" style="width:70%;height:270px;" placeholder="17803 39622 28074"></textarea>'+
	      '<a href="javascript:;" class="ok_btn addIdsBtn" data-fn="d" data-floor="'+floor+'" style="display:block;width:50%;margin:0 auto;text-align:center;">确定</a>'+
	    '</div>'+
	    '<div style="width:85%;float:right;height:300px;overflow-y:scroll;">'+
	      '<table class="proListsTable">'+
	        '<thead>'+
	          '<tr>'+
	            '<th>商品编号</th>'+
	            '<th>商品名称</th>'+
	            '<th>活动价</th>'+
	            '<th>销售价</th>'+
	          '</tr>'+
	        '</thead>'+
	        '<tbody></tbody>'+
	      '</table>'+
	    '</div>'+
	  '</div>'+
	'</div>';
	return(html);
}
//d 楼层结构
set.shopListHTML=function(floor){
	var html = '<div class="floor">'+
          '<a target="_blank" class="floorBanner"><img src="http://sale.baobeigezi.com/template/pc/images/layerD_1.jpg" /></a>'+
          '<div class="floorBoxs clearfix" id="Pro'+floor+'"></div>'+
        '</div>';
   	return(html);
}
//4栏图片 设置层 模板
set.b_setImgHTML=function(num){
	var html = '<div class="item clearfix">'+
      '<span class="label noHeightLabel">第'+num+'张图</span>'+
      '<div class="itemContent">'+
        '<div class="uploadImg">'+
          '<form id="b_img_'+eval(num-1)+'" action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
            '<img src="http://sale.baobeigezi.com/template/pc/images/uploadImg.png" alt="上传图片" />'+
            '<input type="file" class="uploadBannerImgBtn uploadImgBtn" name="pic" data-num="'+num+'" data-layer="b-'+eval(num-1)+'" />'+
          '</form>'+
        '</div>'+
      '</div>'+
      '<div class="item clearfix">'+
        '<div class="itemContent" style="width:530px;">'+
          '<div class="associationTypes item">'+
            '<label><input type="radio" value="0" name="set_b_adChange_'+num+'" checked="checked">关联链接地址</label>'+
            '<label><input type="radio" value="1" name="set_b_adChange_'+num+'">代金券</label>'+
          '</div>'+
          '<div class="associationTypesContent">'+
            '<div class="option">'+
              '<div class="item clearfix">'+
                '<span class="label">链接:</span>'+
                '<div class="itemContent"><input type="text" class="inputText form_control" name="set_b_adLink_'+num+'" val=""></div>'+
              '</div>'+
            '</div>'+
            '<div class="option hide clearfix">'+
              '<div class="item clearfix" style="width:230px;float:left;">'+
                '<span class="label">代金券编号:</span>'+
                '<div class="itemContent"><input type="text" name="set_b_adCode_'+num+'" placeholder="" class="inputText form_control" style="width:100px;"></div>'+
              '</div>'+
              '<div class="item clearfix" style="width:300px;float:left;">'+
                '<span class="label">领取规则:</span>'+
                '<div class="itemContent"><select id="set_b_adCodeRuler_'+num+'" class="gapSelect" id="set_month" style="width:180px;"><option value="1">1天领取1次</option><option value="2">活动期间只领取1次</option></select></div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
    return(html);
}
//E栏广告图片
set.tempEHtml=function(num){
	html = '<div class="item clearfix cell">'+
				'<span class="label noHeightLabel">第'+num+'张图</span>'+
				'<div class="itemContent">'+
					'<div class="uploadImg">'+
						'<form id="e_img_'+eval(num-1)+'" action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
							'<img src="http://sale.baobeigezi.com/template/pc/images/uploadImg.png" alt="上传图片" />'+
							'<input type="file" class="uploadBannerImgBtn uploadImgBtn" name="pic" data-layer="e-'+eval(num-1)+'" />'+
						'</form>'+
					'</div>'+
				'</div>'+
				'<span class="label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;链接地址：</span>'+
				'<div class="itemContent"> '+
					'<input type="text" value="" class="form_control gapInput" style="width:300px;" />'+
				'</div>'+
			'</div>';
	return(html);
}
//生成页面模板 html
set.templateHtml=function(info){
	var title = $('#saleName').val();
	var isRadio = $('input[name=isRadio]:checked').val();
	var mainBg = $('.main').attr('style');
	var html = '<!DOCTYPE html>'+
			'<html lang="en">'+
			'<head>'+
				'<meta charset="UTF-8">'+
				'<title>'+title+'</title>'+
				'<link rel = "shortcut Icon" href="http://www.baobeigezi.com/favicon.ico"  type="image/x-ico">'+
				'<link href="http://static01.baocdn.com/css/3.0/head.3.0.css" type="text/css" rel="stylesheet">'+
				'<link rel="stylesheet" type="text/css" href="http://sale.baobeigezi.com/template/pc/css/template.css">';
				if(isRadio == 1){
					html += '<link rel="stylesheet" type="text/css" href="http://sale.baobeigezi.com/template/video/jplayer.blue.monday.css" />';
				}
			html += '</head>'+
			'<body>'+
				'<div id="header"></div>'+
				'<div class="main" style="'+mainBg+'">'+info+'</div>'+
				'<div id="foot"></div>'+
			'</body>'+
			'<script type="text/javascript">var template={};';
			if(template.data_a){html += template.data_a};
			if(template.data_c){html += template.data_c};
			if(template.data_d){html += template.data_d};
			if(template.data_share){html += template.data_share};
			html += '</script>'+
			'<script src="http://static01.baocdn.com/js/min/public.2.0.9.js" type="text/javascript"></script>'+
			'<script type="text/javascript" src="http://sale.baobeigezi.com/2015/statis.js"></script>'+
			'<script type="text/javascript" src="http://sale.baobeigezi.com/template/pc/js/n2_easy_action.js"></script>';
			if(isRadio == 1){
				html += '<script type="text/javascript" src="http://sale.baobeigezi.com/template/video/jquery.jplayer.min.js"></script>'+
						'<script type="text/javascript" src="http://sale.baobeigezi.com/template/video/jQueryRotate.2.2.js"></script>'+
						'<script type="text/javascript" src="http://sale.baobeigezi.com/template/video/jquery.easing.min.js"></script>';
			}
			html += '<script type="text/javascript" src="http://sale.baobeigezi.com/template/pc/js/template.1.1.js"></script>'+
			'</html>';
	return html;
}
//初始化结构 
set.reloadHtml=function(layer){
	var view_re = 'view_'+layer,
		set_re = 'set_'+layer;
	$('.layer'+set.upper(layer)).html(set.reloadInit[view_re]);
	$('.set_'+layer).html(set.reloadInit[set_re]);
}
set.reloadInit={};
//保存设置
set.save=function(fn){
	//console.log(fn);
	//边距设置（公用）
	$('.marginSize').each(function(){
		var select = $(this);
		var cell = $('.layer'+set.upper(fn));
		if(cell.attr('data-'+select.attr('data-fn'))){
			cell.removeClass(select.attr('data-fn')+'_'+cell.attr('data-'+select.attr('data-fn')));
		}
		cell.attr('data-'+select.attr('data-fn'),select.val());
		cell.addClass(select.attr('data-fn')+'_'+select.val());
	})
	var layerBg = $('#layerBg').val(),
		layerBg_model = $('.layer'+set.upper(fn));
		layerBg_model.attr({
			'data-layerBg':layerBg,
			'style':'background:#'+layerBg
		})
	if(fn == 'a'){//首图
		$('body').append("<script>template.timerSetDate={'month':"+$('#set_month').val()+",'day':"+$('#set_day').val()+",'h':"+$('#set_hour').val()+",'m':"+$('#set_minute').val()+",'s':"+$('#set_sec').val()+"}</script>");
		template.timer();
		if($('#set_month').val()){
			template.data_a = "template.timerSetDate={'month':"+$('#set_month').val()+",'day':"+$('#set_day').val()+",'h':"+$('#set_hour').val()+",'m':"+$('#set_minute').val()+",'s':"+$('#set_sec').val()+"};";
		}else{
			template.data_a = null;
		}
		
	}
	if(fn == 'b'){//领券或广告图片
		var layer = $('.layerB').find('a'),
			change = '',
			link = '',
			code = '',
			ruler = '';
		for(var i=1;i<5;i++){
			change = $('input[name=set_b_adChange_'+i+']:checked').val();
			link = $('input[name=set_b_adLink_'+i+']').val();
			code = $('input[name=set_b_adCode_'+i+']').val();
			ruler = $('#set_b_adCodeRuler_'+i).val();
			if(change == 0){
				layer.eq(i-1).attr({'href':link,'target':'_blank'});
			}else if(change == 1){
				layer.eq(i-1).attr({'data-code':code,'data-ruler':ruler,'target':''});
			}
		}
	}
	if(fn == 'c'){
		var c_ad = $('input[name=c_ad]');
		var c_adTxt = '';
		var c_shopId = '';
		c_ad.each(function(index){
			c_adTxt += 'ad'+eval(index+1)+':"'+$(this).val()+'",';
		})
		for(var el in template.shopid_c['ids']){
			//console.log()
		}
		console.log(c_adTxt,template.shopid_c['ids']);
		console.log('<script>template.shopid_c={"ids":"'+template.shopid_c['ids']+'","ad":{'+c_adTxt+'}};</script>');
		$('body').append('<script>template.shopid_c={"ids":"'+template.shopid_c['ids']+'","ad":{'+c_adTxt+'}};</script>');
		template.loadShopC();
		if(template.shopid_c['ids']){
			template.data_c = 'template.shopid_c={"ids":"'+template.shopid_c['ids']+'","ad":{'+c_adTxt+'}};';
		}else{
			template.data_c = null;
		}
	}	
	if(fn == 'd'){
		var html = '';
		/*商品id*/
		for(var el in template.shopId){
			console.log(el,template.shopId[el]);
			html += el+':"'+template.shopId[el]+'",';
		}
		/*商品id 结束*/
		//广告词
		var ad = $('input[name=shop_ad]');
		var adObj = ''
		ad.each(function(index){
			adObj += 'Pro'+eval(index+1)+':"'+$(this).val()+'",';
		})
		/*广告词结束*/
		/*专场图片*/
		var d_adMoreT = '';
		$('input[name=d_adMoreUrl]').each(function(index){
			if($(this).val() && $(this).attr('data-adMoreUrl')){
				$('.layerD .box .floor .floorBanner').eq(index).attr('href',$(this).val());//楼层顶图加链接
				d_adMoreT += 'Pro'+eval(index+1)+':"'+$(this).val()+','+$(this).attr('data-adMoreUrl')+'",';
			}
		})
		/*专场图片 结束*/
		$('body').append('<script>template.shopId={'+html+'};template.shop_ad = {'+adObj+'};template.d_adMore = {'+d_adMoreT+'};</script>');
		template.shopLoad();
		if(html){
			template.data_d = 'template.shopId={'+html+'};template.shop_ad = {'+adObj+'};template.d_adMore = {'+d_adMoreT+'};';
		}else{
			template.data_d = null;
		}
		//左侧导航
		var floorName = $('input[name=set_dFloorName]');
		var nav = $('.layerD').find('.nav');
		nav.html('');
		floorName.each(function(index){//楼层标题
			console.log($(this).val());
			if(index == 0){
				nav.append('<a href="javascript:;" class="on">'+$(this).val()+'</a>');
			}else{
				nav.append('<a href="javascript:;">'+$(this).val()+'</a>');
			}
		})
		nav.append('<a href="javascript:;" class="backTop"></a>');
	}
	if(fn == 'e'){
		$('.set_e .floor_item .cell').each(function(e){
			var temp = $('.layerE');
			var href = $(this).find('.gapInput').val();
			if(e == 0){
				temp.find('.headPic a').attr('href',href);
			}else{
				temp.find('.linkOther a').eq(e-1).attr('href',href);
			}
		})
	}
	set.closeLayer();
}
//保存全局设置
set.globalSave=function(){
	var bg = $('#pageBgColor').val(),
		saleName = $('#saleName').val(),
		bg_isPic = $('input[name=pageBg]:checked').val(),
		shareTit = $('#shareTitle').val(),
		shareContent = $('#shareContent').val(),
		shareImg = $('#shareImg').attr('src');
	$('title').text(saleName);
	//背景色
	if(bg_isPic == 0){
		$('.main').attr('style','background:#'+bg);
	}else if(bg_isPic == 1){
		var url = $('.pageBgImg').find('img').attr('src');
		$('.main').attr('style','background:url('+url+')');
	}
	//分享内容
	if(shareTit&&shareContent&&shareImg){
		template.data_share = 'template.data_share={"title":"'+shareTit+'","content":"'+shareContent+'","shareImg":"'+shareImg+'"};';
	}
}
//等待加载
set.loading = function(s) {
    $("#wait").remove();
    $('body').append('<div id="wait"></div>'); //在页面内创建弹出框结构
    $('#wait').css({
        'display': s
    });
};
//一个管理者的方法
set.handler=function(){

}
set.load();