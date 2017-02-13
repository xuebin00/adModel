//功能模块
var pageMain = $('.main'),
	pageGlobalSet = $('.globalSet'),
	setBox = '',
	tempBox = '',
	tool = {
		random:function(len){
			len = len || 32;
		　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
		　　var maxPos = chars.length;
		　　var pwd = '';
		　　for (i = 0; i < len; i++) {
		    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		    }
		    return pwd;
		},
		uploadImg2:function(form,callback){
			tool.loading('block');
			var options = {
				success: function (data) {
					callback(JSON.parse(data));
					tool.loading('none');
				}
			};
			form.ajaxSubmit(options);
			return;
		},
		loading:function(s){
			$("#wait").remove();
		    $('body').append('<div id="wait"></div>'); //在页面内创建弹出框结构
		    $('#wait').css({
		        'display': s
		    });
		},
		loadShops:function(ids,callback){
			/**/
			tool.loading('block');
			$.ajax({
		        type: "POST",
		        url: "http://item.baocdn.com/activity/api_product/get_product_info?callback=?",
		        dataType: 'jsonp',
		        data: {
		            product_ids:ids
		        },
		        beforeSend:function(){isSend=false;} ,       
		        success: function(res) {
		            callback(res);
		            tool.loading('none');
		        },
		        complete:function(){
		            setTimeout(function(){isSend=true;},200)
		        }
		    });
			/**/
		},
		filter:function(proIds){
			var pattern = /\s+/g;//去掉字符串内空白字符
		        proIds = proIds.replace(pattern,',');
		    var pattern = /^,+|,+$/g;//去掉首尾空格
		    proIds =proIds.replace(pattern,'');
		    return proIds;
		},
		changeState:function(itemInFloor){
			//编辑框中上移下移删除操作后各按钮状态更新
			var upBtn = itemInFloor.find('.up'),
		    downBtn = itemInFloor.find('.down');
		    upBtn.removeClass('noUp');
		    upBtn.eq(0).addClass('noUp');
		    downBtn.removeClass('noDown');
		    downBtn.last().addClass('noDown');
		}
	};
//页面展示层
pageMain.on('click','.set',function(e){
	var target = $(e.target);
	tempBox = $(this).parents('.layer');
	setBox = tempBox.find('.seting');
	if(target.closest('.rank').hasClass('rank')){//上下
		var tempBox = target.parents('.layer'),
			nextLayer = tempBox.next(),
			prevLayer = tempBox.prev();
		if(target.hasClass('up')){
			tempBox.insertBefore(prevLayer);
		}else if(target.hasClass('down')){
			tempBox.insertAfter(nextLayer);
		}else if(target.hasClass('add')){
			tempBox.after(tempBox.clone());
		}else if(target.hasClass('minus')){
			if(confirm("确定要删除吗???")){
				tempBox.remove();
			}
		}else if(target.hasClass('packUp')){
			tempBox.addClass('upHeight');
			target.attr('class','packDown');
			target.text('展开');
		}else if(target.hasClass('packDown')){
			tempBox.removeClass('upHeight');
			target.attr('class','packUp');
			target.text('收起');
		}
	}else{//设置层
		if(tempBox.hasClass('layerC') || tempBox.hasClass('layerD')){
			var tr = setBox.find('table tr');
			var len = (tr.length-1);
			if(len>0){
				var sid = '';
				tr.each(function(i){
					if(i == 0) return;
					if(i == len){
						sid += $(this).children().eq(0).text();
					}else{
						sid += $(this).children().eq(0).text()+'\n';
					}
				})
				setBox.find('[name=floorShopIds]').val(sid);
			}
		}
		$(this).parents('.layer').find('.seting').show();
	}
})
//设置层
pageMain.on('click','.pop_box_shade,.cancel',function(){//取消
	$('.seting').hide();
}).on('click','.submit',function(){//保存
	setBox = $(this).parents('.seting');
	tempBox = $(this).parents('.layer');
	if(tempBox.hasClass('layerD')){
		var layerName = setBox.find('input[name=floorShopName]').val();
		if(!layerName){
			alert('请填写楼层名称');
			return;
		}
		var layerAdTxt = setBox.find('input[name=floorShopAdTxt]').val();
		var adPic = setBox.find('.floorShopAdPic').attr('src');
		var adLink = setBox.find('input[name=floorShopAdLink]').val();
		var tr = setBox.find('table tr');
		var len = (tr.length-1);
		if(len>0){
			var sid = '';
			tr.each(function(i){
				if(i == 0) return;
				if(i == len){
					sid += $(this).children().eq(0).text();
				}else{
					sid += $(this).children().eq(0).text()+',';
				}
			})
			proIds = sid;
		}else{
			proIds = tool.filter(setBox.find('[name=floorShopIds]').val());
		}
		tool.loadShops(proIds,function(res){
			/*加数据*/
			var data = res.data.data;
            var info="",
                productIds = proIds.split(',');
            for(var prdouctId in productIds){
                if(productIds[prdouctId] && data[productIds[prdouctId]]) {
                    var currentData = data[productIds[prdouctId]];
                    if(layerAdTxt && prdouctId == 0){
                        info += '<div class="floorHot">'+
                            '<a href="'+currentData.url+'" class="clearfix" target="_blank">'+
                                '<img src="'+currentData.picUrl+'">'+
                                '<div class="info">'+
                                    '<div class="tit">'+currentData.name+'</div>'+
                                    '<div class="txt">'+layerAdTxt+'</div>'+
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
            if(adLink){
                info += '<div class="floorBox">'+
                        '<a href="'+adLink+'" target="_blank" style="overflow:hidden;">'+
                            '<img src="'+adPic+'" style="width:241px;margin-top:0;">'+
                        '</a></div>';
            }
            tempBox.find('.floorBoxs').html(info);
			
			/*加数据*/

		})
	}
	if(tempBox.hasClass('layerC')){
		var proIds = tool.filter(setBox.find('[name=floorShopIds]').val());
		var desc = setBox.find('input[name=desc]');
		if(!proIds){
			alert('请先输入商品id');
			return;
		}
		tool.loadShops(proIds,function(res){
			if (res.code == 1) {
                var info="",
                	data = res.data.data,
                arr = proIds.split(',');
                for (var el in arr) {
                    var n = parseInt(el)+1;
                    info += '<li>'+
                        '<div class="content clearfix">'+
                            '<img src="'+data[arr[el]]["picUrl"]+'" />'+
                            '<div class="info">'+
                                '<div class="tit">'+data[arr[el]]["name"]+'</div>'+
                                '<div class="txt">'+desc.eq(parseInt(el))+'</div>'+
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
	            tempBox.find('.slider_pic ul').html(info);
	            template.loadBanner();
            }
		})
	}
	tempBox.css('margin-bottom',setBox.find('input[name=stylePB]').val()+'px');
	//更新页面模板图片 链接
	setBox.find('.adImg').each(function(index){
		tempBox.find('.adHref').eq(index).children('img').attr('src',$(this).attr('src'));
	})
	setBox.find('input[name=ad]').each(function(index){
		tempBox.find('.adHref').eq(index).attr('href',$(this).val());
	})
	setBox.hide();
}).on('change','input[name=pic]',function(){//上传图片
	var me = $(this);
	tool.uploadImg2($(this).parents('form'),function(data){
		me.prev('img').attr('src',data.pic_url);
		if(me.parents('.globalSet')){
			me.prev('img').attr('bgImg',1);
		}
	});
}).on('click','.loadShops',function(){//加载商品
	var me = $(this),
		proIds = me.prev().val();
	setBox = me.parents('.seting');
	tempBox = me.parents('.layer');
	var getIds = tool.filter(proIds);
	tool.loadShops(getIds,function(res){
		var data = res.data.data;
		var html = '<tr><th>商品id</th><th>标题</th>';
		if(me.parents('.layer').hasClass('layerC')){
			html+='<th>推荐描述</th>';
		}else if(me.parents('.layer').hasClass('layerD')){
			html+='<th>操作</th>';
		}
		html+='</tr>';
		getIds = getIds.split(',');
		var len = getIds.length;
		for(var el=0;el<len;el++){
			var setId = getIds[el];
			html += '<tr>'+
				'<td>'+data[setId]['id']+'</td>'+
				'<td>'+data[setId]['name']+'</td>';
				if(me.parents('.layer').hasClass('layerC')){
					html+='<td><input type="text" name="desc" class="form_control"></td>';
				}else if(me.parents('.layer').hasClass('layerD')){
					html+='<td class="rankGoods"><a class="up" href="javascript:;"></a><a class="down" href="javascript:;"></a><a class="minus" href="javascript:;"></a></td>';
				}
				
			html+='</tr>';
		}
		setBox.find('.loadShopList table').html(html);
		tempBox.find('.up').eq(1).addClass('noUp');
		tempBox.find('.down').last().addClass('noDown');
	})
}).on('click','.rankGoods',function(e){//排列
	var target = $(e.target);
	var parent = target.parents('tr');
	var parentBox = parent.parent();
	if(target.hasClass('up') && !target.hasClass('noUp')){
		parent.after(parent.prev());
	}else if(target.hasClass('down') && !target.hasClass('noDown')){
		parent.before(parent.next());
	}else if(target.hasClass('minus')){
		if(confirm("确定要删除吗???")){
			parent.remove();
		}
	}
	tool.changeState(parentBox);
})
//全局设置
pageGlobalSet.on('click','.addAdBtn',function(){
	var num = $(this).attr('data-num');
	pageMain.children('.template').append(tempHtml.ad(num));
}).on('change','input[name=pic]',function(){//上传图片
	var me = $(this);
	tool.uploadImg2($(this).parents('form'),function(data){
		me.prev('img').attr('src',data.pic_url);
		if(me.parents('.globalSet')){
			me.prev('img').attr('bgImg',1);
		}
	});
}).on('click','.build,.preview',function(){//预览生成页面
	var layerDHtml = '';
	pageData.shopid_c = {};
	pageData.shopid_c['ad'] = {};
	pageData.shopId = {};
	pageData.shop_ad = {};
	pageData.adMore = {};
	pageData.shopid_c['ids'] = tool.filter($('.layerC').find('[name=floorShopIds]').val());
	$('.layerC').find('input[name=desc]').each(function(index){
		pageData.shopid_c['ad']['ad'+(index+1)] = $(this).val();
	})
	var floatNav = $('#float_nav .nav');
	floatNav.html('');
	$('.layerD').each(function(index){
		var me = $(this);
		var tr = me.find('table tr');
		var len = (tr.length-1);
		if(len>0){
			var sid = '';
			tr.each(function(i){
				if(i == 0) return;
				if(i == len){
					sid += $(this).children().eq(0).text();
				}else{
					sid += $(this).children().eq(0).text()+',';
				}
			})
			pageData.shopId['Pro'+(index+1)] = sid;
		}else{
			pageData.shopId['Pro'+(index+1)] = tool.filter(me.find('[name=floorShopIds]').val());
		}
		pageData.shop_ad['Pro'+(index+1)] = me.find('input[name=floorShopAdTxt]').val();
		if(me.find('input[name=floorShopAdLink]').val()){
			pageData.adMore['Pro'+(index+1)] = me.find('input[name=floorShopAdLink]').val()+','+$(this).find('.floorShopAdPic').attr('src');
		}else{
			pageData.adMore['Pro'+(index+1)] = '';
		}
		floatNav.append('<a href="javascript:;">'+me.find('input[name=floorShopName]').val()+'</a>')
	})
	$('#setDatas').remove();
	var htmls = '<div id="setDatas" style="display:none;"><script>'+
			'pageData={};pageData.shopid_c = '+JSON.stringify(pageData.shopid_c)+
			';pageData.shopId = '+JSON.stringify(pageData.shopId)+
			';pageData.shop_ad = '+JSON.stringify(pageData.shop_ad)+
			';pageData.adMore = '+JSON.stringify(pageData.adMore);
		htmls += '</script></div>';
	$('.template').append(htmls);
	var pageHtml = $('.main').html();
	var pageHtmlDom = $('<div>'+pageHtml+'</div>');
	pageHtmlDom.find('.seting,.globalSet,.set,#wait').remove();
	pageHtmlDom.find('.layerD').each(function(index){
		$(this).find('.floorBoxs').html('');
		$(this).find('.floorBoxs').attr('id','Pro'+(index+1));
	});
	var title = $('#saleName').val();
	var bodyBg = '#'+$('#pageBgColor').val();
	var bgImg = pageGlobalSet.find('.bodyBgPic');
	if(bgImg.attr('bgImg') == 1){
		bodyBg = 'url('+bgImg.attr('src')+')';
	}
	var pageHtmlText = '<!DOCTYPE html>'+
		'<html lang="en">'+
		'<head>'+
			'<meta charset="UTF-8">'+
			'<title>'+title+'</title>'+
			'<link rel = "shortcut Icon" href="http://www.baobeigezi.com/favicon.ico"  type="image/x-ico">'+
			'<link href="http://static01.baocdn.com/css/3.0/head.3.0.css" type="text/css" rel="stylesheet">'+
			'<link rel="stylesheet" type="text/css" href="http://sale.baobeigezi.com/template/pc/css/template.1.2.css">'+
				'</head>'+
		'<body><div id="header"></div><div class="main" style="background:'+bodyBg+'">'+pageHtmlDom.html()+'</div><div id="foot"></div></body></html>'+
		'<script src="http://static01.baocdn.com/js/min/public.2.0.9.js" type="text/javascript"></script>'+
		'<script type="text/javascript" src="http://sale.baobeigezi.com/2015/statis.js"></script>'+
		'<script type="text/javascript" src="http://sale.baobeigezi.com/template/pc/js/n2_easy_action.js"></script>'+
		'<script type="text/javascript" src="http://sale.baobeigezi.com/template/pc/js/template.1.2.js"></script>'+
		'</html>';
	if($(this).hasClass('build')){
		$.ajax({
            type: "post",
            url: "http://erp.baobeigezi.com/activityTemplate/editor/saveTemplate",
            dataType: 'json',
            data: {
                //is_ajax : 'yes',
                type:1,
                htmlContent:pageHtmlText
            },
            success: function (res) {
                if(res.code == 1){
                	template.popbox('成功','成功！链接地址：<a href='+res.cdn_url+' target=_blank>'+res.cdn_url+'</a>');
                	localStorage.setItem('tempData',$('.main').html());
                }else{
                	template.popbox('提示','生成页面出错，请从新生成~');
                }
            }
        });
	}else{
		var winChild = window.open('','_blank');
		winChild.document.write(pageHtmlText);
	}
})
$('.global_btn').click(function(){
	if(pageGlobalSet.css('display') == 'none'){
		pageGlobalSet.css('display','block');
	}else{
		pageGlobalSet.css('display','none');
	}
})
$('.prevPage').click(function(){
	$('.main').html(localStorage.getItem('tempData'));
})


//模板html
var tempHtml = {
	ad:function(num){
		var html = '<div class="layerB layer">'+
			'<div class="box ad'+num+'">'+
				'<div class="boxs clearfix">';
					for(var n=1;n<=num;n++){
						html += '<a href="#" class="adHref" target="_blank"><img src="http://local.baocdn.com/photo/201611/2016110113001058738749.jpg"></a>';
					}
				html += '</div>'+
			'</div>'+
			'<div class="set">'+
				'<div class="rank">'+
					'<a class="up" href="javascript:;"></a>'+
					'<a class="down" href="javascript:;"></a>'+
					'<a class="minus" href="javascript:;"></a>'+
				'</div>'+
			'</div>';
			html += tempHtml.setUpImg(num);
		html += '</div>';
		return html;
	},
	setUpImg:function(num){
		var html = '<div class="seting">'+
					'<div class="pop_box">'+
					'<div class="pop_box_shade"></div>'+
					'<div class="pop_box_content">'+
					'<div class="setBody">'+
					'<div class="temp">'+
						'<div class="cell" style="border-bottom: 1px dashed #eaeaea;">'+
							'<span class="label">下边距</span><input type="text" name="stylePB" class="form_control" value="0">&nbsp;px'+
						'</div>';
					for(var n=1;n<=num;n++){
						html += '<div class="cell">'+
							'<span class="label">广告图</span>'+
							'<form class="uploadPic" action="http://erp.baobeigezi.com/activityTemplate/upload/upload_pic" method="post" enctype="multipart/form-data">'+
								'<img src="http://sale.baobeigezi.com/template/pc/images/uploadImg.png" alt="上传图片" class="adImg">'+
								'<input type="file" class="uploadImgBtn" name="pic">'+
							'</form>'+
						'</div>'+
						'<div class="cell">'+
							'<span class="label">链接</span><input type="text" name="ad" class="form_control" value="">'+
						'</div>';
					}
				html += '</div>'+
						'<div class="cell" style="text-align: center;">'+
							'<a href="javascript:;" class="cancelStyle cancel">取消</a>'+
							'<a href="javascript:;" class="submitStyle submit">确定</a>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'</div>'+
			'</div>';
		return html;
	}
}