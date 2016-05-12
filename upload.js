(function(jsobj, undefined){
	var Upload = function(json){
		this.id = json.id;
		if(!this.id)return;
		this.load(json);
	};
	Upload.prototype = {
		init : function(json){
			this.path = json.path;																	// 图片路径
			this.albumIV = json.albumIV || {};														// iframe连接
			this.albumV = [];																		// 相册下拉框的值
			this.albumPV = [];																		// 图片列表值
			this.albumB = json.albumB || undefined;													// 当前对象变量
			this.num = json.num || 10;																// 需要插入的图片个数
			this.addParam = json.addParam || undefined;												// 上传时的外部参数
			this.insertIF = json.insertImg || undefined;											// 插入图片返回方法
			this.cross_domain = json.cross_domain || '';											// 跨域域名
			this.hasInit = false;																	// 是否加载
			
			this.wrap = document.createElement('div');												// 承载框架的div

			this.header = document.createElement('div');											// 头部信息

			this.content = document.createElement('div');											// 内容信息

			this.tabs = document.createElement('div');												// 菜单选项
			this.content.appendChild(this.tabs);
			
			this.album = document.createElement('div');												// 图片列表信息
			this.content.appendChild(this.album);
			
			this.upload = document.createElement('div');											// 图片列表信息
			this.content.appendChild(this.upload);
		
			this.fli = document.createElement('li');												// 图片管家
			this.nli = document.createElement('li');												// 我的电脑
			this.topce = this.fli;
			
			this.footer = document.createElement('div');											// 底部
			
			this.albumIframe = document.createElement('iframe');									// 加载图片列表的iframe
			this.albumIframe.setAttribute('name', this.id+'_AlbumIframe');
			this.albumIframe.setAttribute('src', '/');
			this.albumIframe.style.display = 'none';
			
			this.albumForm = document.createElement('form');										// 加载图片列表时的form表单
			this.albumForm.setAttribute('action', this.albumIV.src);
			this.albumForm.setAttribute('method', 'post');
			this.albumForm.setAttribute('target', this.id+'_AlbumIframe');
			
			this.album_input = document.createElement('input');										// 加载图片列表时的相册信息
			this.album_input.setAttribute('type', 'hidden');
			this.album_input.setAttribute('name', 'mv[album_name]');
			this.albumForm.appendChild(this.album_input);
			
			this.album_back_input = document.createElement('input');								// 加载图片列表时的back方法
			this.album_back_input.setAttribute('type', 'hidden');
			this.album_back_input.setAttribute('name', 'mv[back_function]');
			this.albumForm.appendChild(this.album_back_input);
			
			this.album_cross_domain = document.createElement('input');								// 跨域域名
			this.album_cross_domain.setAttribute('type', 'hidden');
			this.album_cross_domain.setAttribute('value', this.cross_domain);
			this.album_cross_domain.setAttribute('name', 'mv[cross_domain]');
			this.albumForm.appendChild(this.album_cross_domain);
			
			this.page_current = document.createElement('input');									// 加载图片列表时的page
			this.page_current.setAttribute('type', 'hidden');
			this.page_current.setAttribute('name', 'current');
			this.albumForm.appendChild(this.page_current);
			
			this.upload_sub = document.createElement('form');										// 上传时的form表单
			this.upload_sub.setAttribute('action', json.upload_url);
			this.upload_sub.setAttribute('enctype', 'multipart/form-data');
			this.upload_sub.setAttribute('encoding', 'multipart/form-data');
			this.upload_sub.setAttribute('method', 'post');
			this.upload_sub.setAttribute('target', this.id+'_AlbumIframe');
			
			this.upload_file = document.createElement('input');										// 上传图片file表单
			this.upload_file.setAttribute('type', 'file');
			this.upload_file.setAttribute('name', json.ufn);
			jsobj.addClass(this.upload_file, 'input-upload');
			if (!!window.ActiveXObject || "ActiveXObject" in window)jsobj.addClass(this.upload_file, 'input-file');
			this.upload_sub.appendChild(this.upload_file);
			
			this.upload_select_hidden = document.createElement('input');							// 上传时的相册信息
			this.upload_select_hidden.setAttribute('type', 'hidden');
			this.upload_select_hidden.setAttribute('name', json.uan);
			this.upload_sub.appendChild(this.upload_select_hidden);
			

			this.upload_back_input = document.createElement('input');								// 加载图片列表时的back方法
			this.upload_back_input.setAttribute('type', 'hidden');
			this.upload_back_input.setAttribute('name', 'mv[back_function]');
			this.upload_sub.appendChild(this.upload_back_input);
			
			this.upload_cross_domain = document.createElement('input');								// 跨域域名
			this.upload_cross_domain.setAttribute('type', 'hidden');
			this.upload_cross_domain.setAttribute('value', this.cross_domain);
			this.upload_cross_domain.setAttribute('name', 'mv[cross_domain]');
			this.upload_sub.appendChild(this.upload_cross_domain);
			
			this.wrap.appendChild(this.header);
			this.wrap.appendChild(this.content);
			this.wrap.appendChild(this.footer);
		},
		load : function(json){
			try {
				this.init(json);
				this.createWrap();
				this.createHeader();
				this.createContent();
				this.createFooter();
				document.body.appendChild(this.wrap);
				document.body.appendChild(this.albumIframe);
				document.body.appendChild(this.albumForm);
			} catch (e) {
				alert(e)
			}
		},
		// 创建【最上级】div层
		createWrap : function(){
			jsobj.addClass(this.wrap, 'u_wrap');
		},
		// 创建【头部】
		createHeader : function(){
			var Othis = this;
			jsobj.addClass(this.header, 'u_header');
			
			this.h3 = document.createElement('h3');
			this.h3.innerHTML = '插入图片';
			this.header.appendChild(this.h3);
			
			this.close = document.createElement('a');
			this.close.innerHTML = '×';
			jsobj.addClass(this.close, 'close');
			this.close.onclick = function(){
				Othis.hidden();
			}
			this.header.appendChild(this.close);
		},
		// 创建【内容体】div层
		createContent : function(){
			jsobj.addClass(this.content, 'u_content');
			this.createTabs();
			this.createUpload();
			this.createInsert();
		},
		// 创建【图片的来源】div层
		createTabs : function(){
			jsobj.addClass(this.tabs, 'tabs');
			this.createTabsNav();
			this.createAlbum();
		},
		// 创建【图片的来源按钮】
		createTabsNav : function(){
			var Othis = this;
			
			var tabs_nav = document.createElement('div');
			jsobj.addClass(tabs_nav, 'tabs-nav');
			
			var ysj = document.createElement('div');
			jsobj.addClass(ysj, 'ysj fl mt10 mr5');
			var tips = document.createElement('div');
			tips.innerHTML = '选择您要添加图片的来源';
			jsobj.addClass(tips, 'tips');
			
			var tabs_ul = document.createElement('ul');
			
			this.fli.innerHTML = '图片管家';
			jsobj.addClass(this.fli, 'current');
			tabs_ul.appendChild(this.fli);
			this.fli.onclick = function(){
				Othis.lClick.call(Othis,this);
			}
			
			this.nli.innerHTML = '我的电脑';
			tabs_ul.appendChild(this.nli);
			this.nli.onclick = function(){
				Othis.lClick.call(Othis,this);
			}
			
//			li = document.createElement('li');
//			li.innerHTML = '网上图片';
//			tabs_ul.appendChild(li);
			
			tabs_nav.appendChild(ysj);
			tabs_nav.appendChild(tips);
			tabs_nav.appendChild(tabs_ul);
			this.tabs.appendChild(tabs_nav);
		},
		// 【图片的来源按钮】添加事件
		lClick : function(obj){
			if(this.topce === obj)return;
			jsobj.removeClass(this.topce, 'current');
			jsobj.addClass(obj, 'current');
			if(obj === this.fli)this.flClick.call(this);
			if(obj === this.nli)this.nlClick.call(this);
			this.topce = obj;
		},
		// 【图片管家按钮】添加事件
		flClick : function(){
			this.upload.style.display = 'none';
			this.album.style.display = 'block';
		},
		// 【我的电脑按钮】添加事件
		nlClick : function(){
			this.album.style.display = 'none';
			this.upload.style.display = 'block';
		},
		// 创建【选择相册下拉】
		createAlbum : function(){
			jsobj.addClass(this.album, 'tabs-content');
			
			this.album_filter = document.createElement('div');
			jsobj.addClass(this.album_filter, 'album-filter');
			
			var div = document.createElement('div');
			jsobj.addClass(div, 'fl');
			this.album_filter.appendChild(div);
			
			this.album_select = document.createElement('select');
			this.album_select.style.visibility = 'visible';
			this.albumSelectOnchage();
			div.appendChild(this.album_select);

			div = document.createElement('div');
			jsobj.addClass(div, 'tips');
			div.innerHTML = '请从您的图片管家中点击选择图片';
			this.album_filter.appendChild(div);
			
			this.album_list = document.createElement('div');
			jsobj.addClass(this.album_list, 'album-list');
			
			this.album_ul = document.createElement('ul');
			jsobj.addClass(this.album_ul, 'cf');
//			this.albumUl();
			this.album_list.appendChild(this.album_ul);
			
			this.album_paging = document.createElement('div');
			jsobj.addClass(this.album_paging, 'album-paging cf');
			this.albumPaging();
			
			this.album.appendChild(this.album_filter);
			this.album.appendChild(this.album_list);
			this.album.appendChild(this.album_paging);
		},
		// 【选择相册下拉】设置内容
		albumSelect : function(){
			this.album_select.innerHTML = '';
			this.album_select.options.add(new Option('',''));
			for(var i=0; i<this.albumV.length; i++){
				this.album_select.options.add(new Option(this.albumV[i].value,this.albumV[i].value));
			}
		},
		// 创建【选择相册下的图片】
		albumUl : function(){
			this.album_ul.innerHTML = '';
			var Othis = this;
			var li;
			var a;
			var img;
			for(var i=0; i<this.albumPV.length; i++){
				li = document.createElement('li');
				
				a = document.createElement('a');
				a.setAttribute('href', 'javascript:;');
				a.onclick = function(){
					Othis.insertInfo.call(Othis, this.parentNode, this);
				}
				
				img = '<img title="'+this.albumPV[i].describe+'" width="64" height="60" src="'+(this.path + this.albumPV[i].thumb_path)+'" complete="complete"/>';
				a.innerHTML = img;
				
				li.appendChild(a);
				
				var imgs = this.insertPool.getElementsByTagName('img');
				var len = imgs.length;
				for(var j=0; j<len; j++){
					if(imgs[j].src == (this.path + this.albumPV[i].thumb_path))jsobj.addClass(li, 'current');
				}
				this.album_ul.appendChild(li);
			}
		},
		// 【选择相册下的图片】加入【要插入的图片】初始化
		insertInfo : function(li,a){
			if(jsobj.hasClass(li, 'current'))return;
			if(this.insertUl.getElementsByTagName('li').length == this.insertPool.getElementsByTagName('li').length)return;
			jsobj.addClass(li, 'current');
			this.insertInit(a.innerHTML);
		},
		// 创建【选择相册下的图片分页】的ul
		albumPaging : function(){
			var page_ul = document.createElement('ul');
			jsobj.addClass(page_ul, 'fr');
	
			this.page_num = document.createElement('li');
			jsobj.addClass(this.page_num, 'pagination');
			this.createPage();

			page_ul.appendChild(this.page_num);
			this.album_paging.appendChild(page_ul);
		},
		// 创建【选择相册下的图片分页】的a
		createPage : function(){
			this.page_div = document.createElement('div');
			jsobj.addClass(this.page_div, 'page-div');
			this.page_div.setAttribute("id", this.id + '_page')
			this.page_div.style.clear = 'both';
			this.page_div.style.zIndex = '0';
			this.album_paging.appendChild(this.page_div);
		},
		// 创建【上传】的div层
		createUpload : function(){
			jsobj.addClass(this.upload, 'tabs-content upload');
			this.createInfo();
			this.createUploadForm();
			this.createTips();
		},
		// 创建【上传头部信息】的div层
		createInfo : function(){
			var info = document.createElement('div');
			jsobj.addClass(info, 'info');
			info.innerHTML = '如果您不希望上传的图片在相册中公开展示，建议将图片上传到不公开相册中';
			
			this.upload.appendChild(info);
		},
		// 创建【上传内容主体】的div层
		createUploadForm : function(){
			var Othis = this;
			this.upload_form = document.createElement('div');
			jsobj.addClass(this.upload_form, 'upload-form');
			
			var dl = document.createElement('dl');
			var dt = document.createElement('dt');
			var dd = document.createElement('dd');
			dt.innerHTML = '选择相册：';
			this.upload_select = document.createElement('select');
			this.upload_select.style.visibility = 'visible';
			this.upload_select.onchange = function(){
				Othis.upload_file.value = '';
			}
			dd.appendChild(this.upload_select);
			dl.appendChild(dt);
			dl.appendChild(dd);
			this.upload_form.appendChild(dl);
			
			dl = document.createElement('dl');
			dt = document.createElement('dt');
			dd = document.createElement('dd');
			dt.innerHTML = '上传图片：';
			dd.appendChild(this.upload_sub);
			this.uploadFile();
			dl.appendChild(dt);
			dl.appendChild(dd);
			this.upload_form.appendChild(dl);
			
			dl = document.createElement('dl');
			dt = document.createElement('dt');
			dd = document.createElement('dd');
			this.cb_input = document.createElement('input');
			this.cb_input.setAttribute('type', 'checkbox');
			jsobj.addClass(this.cb_input, 'input-checkbox');
			dd.appendChild(this.cb_input);
			dd.innerHTML += '<label>添加图片水印</label>';
			dl.appendChild(dt);
			dl.appendChild(dd);
			this.upload_form.appendChild(dl);
			
			this.upload.appendChild(this.upload_form);
		},
		// 创建【上传相册值】
		uploadSelect : function(){
			this.upload_select.innerHTML = '';
			for(var i=0; i<this.albumV.length; i++){
				this.upload_select.options.add(new Option(this.albumV[i].value,this.albumV[i].value));
			}
		},
		// 创建【上传图片】
		uploadFile : function(){
			var Othis = this;
			this.setUploadParam();
			this.upload_file.onchange = function(){
				if(this.value == '')return;
				if(Othis.albumB)Othis.upload_back_input.setAttribute('value', Othis.albumB+'.uploadBack');
				Othis.setUSV();
				Othis.upload_sub.submit();
			}
		},
		// 设置【上传时相册值】
		setUSV : function(){
			this.upload_select_hidden.value = this.upload_select.options[this.upload_select.selectedIndex ].value;
		},
		// 设置【上传时自定义值】
		setUploadParam : function(){
			if(this.addParam){
				var len = this.addParam.length;
				var input;
				for(var i=0; i<len; i++){
					input = document.createElement('input');
					input.setAttribute('type', 'hidden');
					input.setAttribute('name', this.addParam[i][0] || '');
					input.setAttribute('value',this.addParam[i][1] || '');
					this.upload_sub.appendChild(input);
//					this.addParam.call(this.upload_sub);
				}
			}
		},
		// 设置【上传后显示条】
		createTips : function(){
			this.upload_tips = document.createElement('div');
			jsobj.addClass(this.upload_tips, 'tips');
			
			var p = document.createElement('p');
			p.innerHTML = '提示：您可以上传5张图片，选择的图片单张大小不超过5MB，支持jpg,jpeg,gif,bmp,png';
			this.upload_tips.appendChild(p);
			
			var p = document.createElement('p');
			jsobj.addClass(p, 'n');
			p.style.display = 'none';
			p.innerHTML = '抱歉，因网络繁忙。以下1张图片无法上传:H91SV32...png';
			this.upload_tips.appendChild(p);
			
			var p = document.createElement('p');
			jsobj.addClass(p, 'y');
			p.style.display = 'none';
			p.innerHTML = '上传成功，共 1 张！';
			this.upload_tips.appendChild(p);
			
			this.ps = this.upload_tips.getElementsByTagName('p')[0];
			
//			this.pShow(2);
			
			this.upload.appendChild(this.upload_tips);
		},
		// 设置【上传后显示条要显示那条0,1,2】
		pShow : function(f){
			var p = this.upload_tips.getElementsByTagName('p')[f];
			if(!p)return;
			this.ps.style.display = 'none';
			p.style.display = 'block';
			this.ps = p;
		},
		// 创建【要加载图片】的div层
		createInsert : function(){
			var insert = document.createElement('div');
			jsobj.addClass(insert, 'insert');
			
			var insertHeader = document.createElement('div');
			jsobj.addClass(insertHeader, 'insert-header');
			insert.appendChild(insertHeader);
		
			this.h4 = document.createElement('h4');
			this.insertNum(0);
			insertHeader.appendChild(this.h4);
		
			var insertTips = document.createElement('div');
			jsobj.addClass(insertTips, 'tips');
			insertHeader.appendChild(insertTips);
			
			var insertContent = document.createElement('div');
			jsobj.addClass(insertContent, 'insert-content');
			insert.appendChild(insertContent);
			
			this.insertPool = document.createElement('ul');
			jsobj.addClass(this.insertPool, 'insert-pool cf');
			insertContent.appendChild(this.insertPool);
			
			this.insertUl = document.createElement('ul');
			jsobj.addClass(this.insertUl, 'insert-bg cf');
			insertContent.appendChild(this.insertUl);
			
			this.content.appendChild(insert);
		},
		// 初始化【要插入图片的个数】
		insertImg : function(){
			this.insertUl.innerHTML = '';
			var li;
			for(var i=0; i<this.num; i++){
				li = document.createElement('li');
				li.innerHTML = i+1;
				this.insertUl.appendChild(li);
			}
		},
		// 设置【已插入图片的个数】
		insertNum : function(n){
			this.h4.innerHTML = '要插入的图片('+n+'/'+this.num+')';
		},
		// 【插入图片】
		insertInit : function(img){
			var Othis = this;
			var li = document.createElement('li');
			
			var div = document.createElement('div');
			div.innerHTML = img;
			li.appendChild(div);
			
			var a = document.createElement('a');
			a.setAttribute('title', '点击删除该图片');
			a.setAttribute('href', 'javascript:;');
			li.appendChild(a);
			a.onclick = function(){
				Othis.deleteImg.call(Othis,this.parentNode);
			}
			
			this.insertPool.appendChild(li);
			this.insertNum(this.insertPool.getElementsByTagName('li').length)
		},
		// 【删除图片】
		deleteImg : function(li){
			var src = li.getElementsByTagName('img')[0].src;
			var imgs = this.album_ul.getElementsByTagName('img');
			for(var i=0; i<imgs.length; i++){
				if(imgs[i].src == src)jsobj.removeClass(imgs[i].parentNode.parentNode,'current');
			}
			this.insertPool.removeChild(li);
			this.insertNum(this.insertPool.getElementsByTagName('li').length)
		},
		// 创建【插入图片按钮】
		createFooter : function(){
			var Othis = this;
			jsobj.addClass(this.footer, 'u_footer');
			
			this.ib = document.createElement('a');
			this.ib.innerHTML = '插入图片';
			jsobj.addClass(this.ib, 'button');
			this.ib.setAttribute('href', 'javascript:;');
			this.ib.onclick = function(){
				if(Othis.insertIF){
					var imgs = Othis.insertPool.getElementsByTagName('img');
					var arr = new Array();
					for(var j=0; j<imgs.length; j++){
						var s = Othis.insertPool.getElementsByTagName('img')[j].src;
						var type = s.substring(s.lastIndexOf('.'))
						var src = s.substring(0,s.lastIndexOf('.')-'_shrink'.length);
						arr.push(src+type);
					}
					Othis.insertIF.call(Othis,imgs,arr);
				}
			}
			
			this.footer.appendChild(this.ib);
		},
		initAlbum : function(){
			if(this.albumB)this.album_back_input.setAttribute('value', this.albumB+'.albumBack');
			
			this.album_input.setAttribute('value', 
					this.album_select.selectedIndex != -1 ? 
							this.album_select.options[this.album_select.selectedIndex].value : '');
			
			this.page_current.setAttribute('value','1');
			
			if(this.addParam){
				var len = this.addParam.length;
				var input;
				for(var i=0; i<len; i++){
					input = document.createElement('input');
					input.setAttribute('type', 'hidden');
					input.setAttribute('name', this.addParam[i][0] || '');
					input.setAttribute('value',this.addParam[i][1] || '');
					this.albumForm.appendChild(input);
				}
			}
			
			this.albumForm.submit();
		},
		albumBack : function(data){
			this.albumV = data.als == 'null' ? [] : jsobj.json(data.als);
			this.albumPV = data.data_list == 'null' ? [] : jsobj.json(data.data_list);
			this.pageV = data.data_page == 'null' ? [] : jsobj.json(data.data_page);
			this.albumSelect();
			this.albumUl();
			this.initPage();
			this.uploadSelect();
			this.initAlbumSelect(data.album_name || '');
		},
		uploadBack : function(data){
			this.insertInit('<img height="64" title="'+data.title+'" width="60" src="'+ this.path + data.url + '">');
			if(this.album_select.options[this.album_select.selectedIndex].value == 
				this.upload_select.options[this.upload_select.selectedIndex].value){
				this.page_current.value = 1;
				this.searchInfo();
			}
		},
		initAlbumSelect : function(index){
			var len = this.album_select.options.length;
			for(var i=0; i<len; i++){
				if(this.album_select.options[i].value == index){
					this.album_select.options[i].selected = true;
					break;
				}
			}
			this.album_select.blur();
		},
		albumSelectOnchage : function(){
			var Othis = this;
			this.album_select.onchange = function(){
				if(this.selectedIndex==0)return;
				Othis.album_input.setAttribute('value', 
						this.selectedIndex != -1 ? 
								this.options[this.selectedIndex].value : '');
				Othis.page_current.value = 1;
				Othis.searchInfo();
			}
		},
		initPage : function(){
			this.page_div.innerHTML = '';
			var Othis = this;
			jsobj.Page({
				id : this.id + '_page',
				page : this.pageV,
				onclick : function(page) {
					Othis.page_current.value = page.current;
					Othis.searchInfo();
				}
			});
		},
		searchInfo : function(){
			this.albumForm.submit();
		},
		// 【关闭】
		hidden : function(){
			this.wrap.style.display = 'none';
		},
		show : function(n){
			this.num = n || 10;
			this.insertNum(0);
			if(!this.hasInit){
				this.initAlbum();
				this.hasInit = true;
			}
			this.showInit(n);
			this.showPosition();
		},
		showInit : function(){
			this.insertImg();
			this.insertPool.innerHTML = '';
			var lis = this.album_ul.getElementsByTagName('li');
			for(var i=0; i<lis.length; i++){
				jsobj.removeClass(lis[i],'current');
			}
		},
		showPosition : function(){
			jsobj.center(this.wrap);
		}
	}
	jsobj.upload = function(json){
		return new Upload(json);
	}
})(jsobj);
