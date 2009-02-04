/*
/\/////////////////////////////////////////////////////////////////////\/
[ HTML-CSS-JS __________________________________ ★ Let Script Grace ★ ]
[ ---------- Adapt To <1024*768><800*600><1280*> ^ <IE6.IE7.FireFox...> ]
[ ------------------------ Code By Snow(EM:Sxnow[AT]126.com,Q:49054026) ]
[ ------------------------ Genius Of WarCraftIII % SoulFan Of BLIZZARD  ]
[ ___________________________________________ ☆ XuNuo.Com(c)2009.1.1 ☆ ]
//\/////////////////////////////////////////////////////////////////////\
*/

var X = new Object();
X.Name = "Html页相关信息 | 静态Html->JS参数传导存储";
var Now = new Date();
X.JsStartTime = Now.getTime();
//------------------------------------------------------+[ JQuery ]+
//jQuery. 简写为 $.  
//=[ 前台信息 ]=------------------------------------------------->>>
$.TEMP = {}; //暂存区 用来存储一些lastItem之类的东东

$.I = {
	config : {
		skinPath : $("#css").attr("skinPath")
	},
	Data : {
		Name		:	"Goblin",
		Coder		: "DarkSnow"
	},
	Titles : { 
		main : "GoBlin 2009 ^ DarkSnow"
	}
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 初始化FCK编辑器 ]=------------------------------------------------->>>
//=[ PS: forFCK ]
$.fn.toBeEditor = function(myConfig) {
	//** 静默配置定义 **
	//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
	var $SELF = this;    

	if(myConfig.type == "FCK"){
		var config = DOM.config = $.extend({
				type : "FCK",	//编辑器引擎 方便日后扩展
				name : "editor",	//fn名称
		    basePath : "JS/fck/",	//编辑器基础路径
		    skinPath : $.I.config.skinPath + "/FCKStyle/", //风格路径 相对于基础路径
		    customConfigFile : "Js/FCK/CustomSetting/snow.config.js", //自定义配置路径
		    toolbarSet : "Default",	//自定义工具条
		    toolbarStartExpanded : true,	//工具条初始展开
		    fullPage : false,	//全页编辑
		    height : "auto",
		    width : "auto",
		    script : "actions.php",	//后端ajax支援文件
		    //mailTo : "sxnow@126.com;i@xunuo.com;swffa@foxmail.com" // 测试邮件发往地址 使用逗号相隔 后台用数组切 
		    mailTo : "sxnow@126.com"
	  },myConfig);


		//** 定义方法 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		// 取值xhtml
		DOM.getXHTML = function(){
			var editor = FCKeditorAPI.GetInstance(DOM.id);
			return editor.GetXHTML();
		}
		// 取值html
		DOM.GetHTML = function(){
			var editor = FCKeditorAPI.GetInstance(DOM.id);
			return editor.GetHTML();
		}
		//** 赋值 **/
		DOM.setEditorData = function(content,pathInfo){
				try{
					var editor = FCKeditorAPI.GetInstance(DOM.id);
					if(editor.EditMode == FCK_EDITMODE_SOURCE)editor.EditMode = FCK_EDITMODE_WYSIWYG;
					editor.SetData(content);
					DOM.expandToolBar();
					if(pathInfo){
						DOM.nowEditFilePath = pathInfo;
					  DOM.nowEditFileName = pathInfo.substring(pathInfo.lastIndexOf('/') + 1).split('.')[0];
					}
				}catch(e){
					DOM.innerText = content;
				}
				if($.browser.msie)CollectGarbage();
		}
		
		//从目标路径读取数据赋值
		DOM.setEditorDataFromFile = function(path){
			$.post(config.script, { action : "READFILE" , filePath : path }, function(data) {
				DOM.setEditorData(data,path);
			});
		}
		
		DOM.InsertHtml = function(content){
			FCKeditorAPI.GetInstance(DOM.id).InsertHtml(content);
		}

		// 转换为设计布局模式
		DOM.designLayout = function(){
			var editor = FCKeditorAPI.GetInstance(DOM.id);

			jQuery.each(jQuery.browser, function(i) {
			  if($.browser.msie){
			     editor.EditorDocument.body.contentEditable = !eval(editor.EditorDocument.body.contentEditable);
			  }else{
			  	 var editable = (editor.EditorDocument.designMode == "on")?"off":"on";
			  	 //DOM.isDesignLayout = DOM.isDesignLayout ? "off" : "on";
			     editor.EditorDocument.designMode = editable;
			  }
			});
		}

		//展开工具条
		DOM.expandToolBar = function(){
			var editor = FCKeditorAPI.GetInstance(DOM.id);
			editor.ToolbarSet.Expand();
		}
		
		//关闭工具条
		DOM.collapseToolBar = function(){
			var editor = FCKeditorAPI.GetInstance(DOM.id);
			editor.ToolbarSet.Collapse(); 
		}
		
		
		//** 动作捆绑 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

		
		//** 默认运行区域 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		var oFCKeditor = new FCKeditor( this.attr("id") ) ;
		oFCKeditor.BasePath	= config.basePath;

		//FCK默认皮肤会加上自己的basePath相对 这里使用分隔函数找到url根路径 把skinPath转为绝对
		var url = window.location.href.split("#")[0];
		var sBasePath = url.substring(0,url.lastIndexOf('/')) ;
		if(config.skinPath){oFCKeditor.Config['SkinPath'] = sBasePath + "/" +config.skinPath;}
		oFCKeditor.Config['CustomConfigurationsPath'] = sBasePath + "/" + config.customConfigFile ;
		oFCKeditor.ToolbarSet	= config.toolbarSet;
		oFCKeditor.TabSpaces = 1;
		oFCKeditor.Config['ToolbarStartExpanded'] = config.toolbarStartExpanded;
		oFCKeditor.Config['FullPage'] = config.fullPage;
		oFCKeditor.Height = config.height;
		oFCKeditor.Width = config.width;
		
		/*
		FCKConfig.Config['EditorAreaCSS'] = FCKConfig.BasePath + 'css/fck_editorarea.css'; // 编辑区的样式表文件
		FCKConfig.Config['EditorAreaStyles'] = '' ; // 编辑区的样式表风格
		FCKConfig.Config['ToolbarComboPreviewCSS'] =''; //工具栏预览CSS
		oFCKeditor.Config['ProcessHTMLEntities'] = false ; //处理HTML实体
		*/
		//oFCKeditor.Config['DocType'] = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		oFCKeditor.Config['EnableXHTML'] = false;
		oFCKeditor.Config['FillEmptyBlocks'] = false;
		oFCKeditor.Config['EnableSourceXHTML'] = false;
		oFCKeditor.Config['ImageBrowser'] = false;  
		/*
		oFCKeditor.Config['EnableSourceXHTML'] = false;
		oFCKeditor.Config['EnableXHTML'] = false;
		oFCKeditor.Config['FillEmptyBlocks'] = false; //是否填充空块
		oFCKeditor.Config['FormatSource']  = false; //在切换到代码视图时是否自动格式化代码
		oFCKeditor.Config['FormatOutput']  = false; 
		//oFCKeditor.FormatIndentator = '    ' ;
*/

		oFCKeditor.ReplaceTextarea();
	
		//索引标记住此编辑器  为了不耗资源  只用id 而不是把整个obj赋过去
		self.editorId = this.attr("id");
		
		//清一下内存
		if($.browser.msie)CollectGarbage();
	}// for FCK
}


//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// 还是用fn扩展好了....反正有优势也有缺点  还是比较喜欢多例 虽然写起来会有些不习惯...拼了~~
$.fn.toBeFileBrowser = function(myConfig) {
		//** 静默配置定义 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
		var $SELF = this;
		var config = DOM.config = $.extend({
					title : "D6W File Browser",
					name : "draftBox",	//方便后续扩展限定名
					root : "files/",
					script : "actions.php",	//后端ajax支援文件
					fileList : "#draftsList",	//左侧文件树容器
					showRoom : "#draftShowRoom",	//右侧容器
					linkEditor	:	"#d6wEditor",	//挂载的编辑器
					onOffBtn : "#draftsBoxBtn",	//容器开关
					closeBtn : "#draftsBoxCloseBtn",	//关闭按钮
					reloadFileListBtn : "#reloadDraftList",	//文件树重载
					shadow : "#shadow",	//影子层~
					shadowSWF : "#shadowSWF",
					effect : {
							fadeShow : false,
							fadeList : false,
							bgSWF : false
						}
		},myConfig);

		//** 定义方法 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	  //** 创建 **
	  //=================================================================================================================================
	  DOM.build = function(){
	  	if(DOM.builded)return;
	  	
			var fileList = DOM.fileList = $(config.fileList).get(0);
			var $demoIframe = DOM.$demoIframe = $(config.showRoom).find("iframe");

			// $demoIframe载入预览完成后操作  好乱啊  有朝一日重整!!
			$demoIframe.bind("load",function(){
				var nowItem = DOM.fileListLastSelect;
				if(nowItem){
					nowItem.find("div[class*='currentLoading']").hide(1500);
					
					//败~！~
					var draftToolBar= $('<div class="currentLeftB"></div><div class="currentRightB"></div><div class="FBToolBar"><a title="删除此草稿" class="FBDelBtn Btn">删除</a><a title="编辑此草稿" class="FBEditBtn Btn">编辑</a></div>');
					
					nowItem.find("div[class*='currentElements']").append(draftToolBar);
					//定义默认链接 支持hover
					draftToolBar.find("a").defineEmptyLinks();
					
					//编辑草稿功能 draftEdit alert("调用php读取文件 : " + lastItem.attr("title") + "返回");
					draftToolBar.find("a[class*='FBEditBtn']").bind("click",function(){
						//增加loading状态
						nowItem.find("div[class*='currentLoading']").show();
						var path = nowItem.attr("path");
						var linkEditor = $(config.linkEditor).get(0);
						$.post(config.script, { action : "READFILE" , filePath : path }, function(data) {
							linkEditor.setEditorData(data,path);
							//去除草稿面板&载入icon
							nowItem.find("div[class*='currentLoading']").hide(1500);
							DOM.hideSelf();
							historyAPP.makeUrl(linkEditor,"setEditorDataFromFile('"+path+"')");
							document.title = "正在编辑 : " + path;
						});
					})

					//删除草稿功能
					draftToolBar.find("a[class*='FBDelBtn']").bind("click",function(){
						if(!confirm("真的要删除文件 \"" + nowItem.attr("path") +"\" 么?"))return false; 
						//增加loading状态
						nowItem.find("div[class*='currentLoading']").show();
						$.post(config.script, { action : "DELFILE" , filePath : nowItem.attr("path") }, function(data) {
							//刷新文件列表&kill载入icon&清除iframe显示
							$demoIframe.attr({src:"about:blank"});
							nowItem.find("div[class*='currentLoading']").hide(1500);
							fileList.reloadTree();
						});
					})

				}
				
				if($.browser.msie)CollectGarbage();
			})
			
			//初始文件浏览器
			$(config.fileList).toBeFileTree({
				root: config.root,
				script: "actions.php",
				expandEasing: "easeOutBounce",
				collapseEasing: "easeOutBounce",
				allowExt : ">>|js|html|htm|css|<<"
			 },
				 //文件点击时执行
				 function(item){
				 	//当前选中判断return
				 	if(item.hasClass("current"))return false;
				 	var lastItem = DOM.fileListLastSelect; //刚刚选的最后一个item 囧~
				 	//样式方面的控制
				 	
				 	//清除最后一个选中的样式
				 	if(lastItem){
				 		lastItem.removeClass("current");
				 		lastItem.find("div[class*='currentElements']").remove();
				 	}
				 	
				 	//设置选中状态样式
				 	var currentElements = $("<div class='currentElements'><div class='currentLeft'></div><div class='currentRight'></div><div class='currentLoading'></div></div>")
					item.addClass("current");
					item.append(currentElements);
					DOM.fileListLastSelect = item;
					
					//开始做事了~~
					
					//开始预览
					DOM.selectFileItem(item.attr("path"));
					
					if($.browser.msie)CollectGarbage();
					return false;//jQ取消冒泡...
				},
				//文件夹收缩前执行
				function(item){
					//把最后选中项样式清除
					var lastItem = DOM.fileListLastSelect;
					if(lastItem){
						lastItem.removeClass("current");
						lastItem.find("div[class*='currentElements']").remove();
					}
					if($.browser.msie)CollectGarbage();
			});
			
			$(config.reloadFileListBtn).bind("click",function(){
				fileList.reloadTree();
			});
			DOM.builded = true;
		}
		
		
		//** 重建 **
		//=================================================================================================================================
		DOM.reBuild = function(){
			DOM.builded = false;
			DOM.build();
		}
		//** 显示BOX **
		//=================================================================================================================================
		DOM.showSelf = function(delay){
				if($.TEMP.lastOpenPanel){
					var lastOpen = $.TEMP.lastOpenPanel.get(0);
					$(lastOpen.config.onOffBtn).removeClass("underLine");
					lastOpen.hideSelf(0);
				}
				$.TEMP.lastOpenPanel = $SELF;
				if(DOM.alreadyShow)return;
				
				
				$(DOM.config.onOffBtn).addClass("underLine");

				if(!DOM.builded){DOM.build();}
				document.title = $.I.Titles.main + DOM.config.title;
				$(config.shadow).show();
				if(DOM.config.effect.bgSWF){$(config.shadowSWF).show();}
				if(DOM.config.effect.fadeShow){
					$SELF.fadeIn(delay,function(){});
				}else{
					DOM.style.display = "block";
				}
				DOM.alreadyShow = true;
				//$.iHistory.makeUrl(self,"showSelf()");
				if($.browser.msie)CollectGarbage();
		}
		//** 隐藏BOX **
		//=================================================================================================================================
		DOM.hideSelf = function(delay){
				var lastOpen = $.TEMP.lastOpenPanel.get(0);
				$(lastOpen.config.onOffBtn).removeClass("underLine");
				if(!DOM.alreadyShow)return;
				document.title = $.I.Titles.main;
				$(config.shadow).hide();
				if(DOM.config.effect.bgSWF){$(config.shadowSWF).hide();}
				if(DOM.config.effect.fadeShow){
					$SELF.fadeOut(delay,function(){
						DOM.alreadyShow = false;
					});
				}else{
					DOM.style.display = "none";
					DOM.alreadyShow = false;
				}
				//$.iHistory.makeUrl(self,"hideSelf()");
				if($.browser.msie)CollectGarbage();
		}
		//** 选取浏览指定 **
		//=================================================================================================================================
		DOM.selectFileItem = function(path,fromURL){
			if(!DOM.alreadyShow){DOM.showSelf();}
			/*
			if(fromURL){
					//跨越文件夹怎么办....
					//专门写一个强大的defaultSelect??带展开文件夹的?
					//alert($("#draftsList").html());
					return;
			}
			*/
			DOM.$demoIframe.attr({src:path});
			//需要的地方 必要的时候制造makeURL留下后路
			historyAPP.makeUrl(DOM,"selectFileItem('"+path+"','fromURL')");
			document.title = $.I.Titles.main + DOM.config.title + " - 预览 : " + path;
			$SELF.find("[class*='titleFileRoot']").html(" <a href='" + path + "' target='_blank'>" + path + "</a>");
		};
		
		DOM.saveDraft = function(config){
			var defaultFileName = new Date().format("yyyy.M.d hh点mm分ss秒");
			var draftFileName = prompt("请输入要保存的草稿文件名称",defaultFileName);if(!draftFileName)return;
			draftFileName += ".html";
			var html = d6wEditor.GetHTML();
			$.ajax({
			url: 'actions.php', 
			type: 'POST', 
			data:{filePath:"Files/Archive/" + draftFileName,action:"WRITEFILE",content:html}, 
			dataType: 'html', 
			timeout: 1000, 
			error: function(){
				alert('Error loading PHP document');
				try{config.btn.loadingIco.hide(500);}catch(e){};
			}, 
			success: function(result){
				alert(result + " - " + draftFileName);
				//存完刷新~~
				if(DOM.fileList){DOM.fileList.reloadTree();}
				try{config.btn.loadingIco.hide(500);}catch(e){};
			}
			});
			//后续操作
			try{
				//loading图标
				config.btn.loadingIco = $('<span class="loading"></span>');
				$(config.btn).append(config.btn.loadingIco);
			}catch(e){}
		};
		
		//** 动作捆绑 **
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		$(config.onOffBtn).click(function(){
			if(DOM.alreadyShow){
				DOM.hideSelf(500);
			}else{
				DOM.showSelf(500);
			}
		});

		$(config.closeBtn).click(function(){
			DOM.hideSelf(500);
		});
		
		//** 默认运行区域 ** PS.这个打算做成没有默认动作触发 通过按钮来触发 不是一出现就秀的那种~...不用默认跑了~~
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ history 支援 ]=---------------------------->>>
$.fn.toBeHistoryBody = function(myConfig) {
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
		var $SELF = this;
		var config = DOM.config = $.extend({
		},myConfig);
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		DOM.run =	function(hash){
			if(hash) {
				try{eval(hash);}catch(e){}
			}
		};
		DOM.makeUrl = function(obj,funStr,type){
			//jQuery会自动全局化obj.id 为全局变量  指向自己dom  不带#
			window.location.hash = obj.id + "." + funStr;
		};
		//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		$.historyInit(DOM.run);

}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ mail控制面板 ]=------------------------------------------------->>>
$.fn.toBeMsgBox = function(myConfig) {
	var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
	var $SELF = this;
	var config = DOM.config = $.extend({
		target : "msgBox"
	},myConfig);
	DOM.showSelf = function(config){
		if(DOM.alreadyShow){
			clearTimeout(DOM.IV);DOM.IV = setTimeout(function(){DOM.hideSelf();},4000)
			return;
		}
		$SELF.animate({ top: 0}, 1000, 'easeOutCubic',function(){});
		DOM.alreadyShow = true;
		if(config.autoBack){
			DOM.IV = setTimeout(function(){DOM.hideSelf();},4000)
		}
	}
	DOM.hideSelf = function(){
		$SELF.animate({ top: -100}, 1000, 'easeOutCubic',function(){});
		DOM.alreadyShow = false;
	}
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ mail控制面板 ]=------------------------------------------------->>>
$.fn.toBeMailPanel = function(myConfig) {
	//** 静默配置定义 **
	//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
	var $SELF = this;
	var config = DOM.config = $.extend({
			title : "D6W Mail Panel",
			name : "mailPanel",	//方便后续扩展限定名
			onOffBtn : "#mailBtn",
			mailTitleClass : "mailTitle",
			mailAddressClass : "mailAddress",
			closeBtnClass : "closeBtn",
			sendMailBtnClass : "mailSendBtn",
			sendMailBtnLoadingClass : "mailSendBtnLoading",
			linkEditor	:	"#d6wEditor",
			tooBarLoadingIco : "#toolBarLoading",
			linkMsgBox : "#msgBox",
			sendMailCount : "#sendMailCount"
	},myConfig);
	//** 定义方法 **
	//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  //** 显示&隐藏 **
  //=================================================================================================================================
	DOM.showSelf = function(){
		if($.TEMP.lastOpenPanel){
			var lastOpen = $.TEMP.lastOpenPanel.get(0);
			$(lastOpen.config.onOffBtn).removeClass("underLine");
			lastOpen.hideSelf(0);
		}
		$.TEMP.lastOpenPanel = $SELF;
		
		var nowEditFileName = $(config.linkEditor).get(0).nowEditFileName;
		var mailTitleInput = $SELF.find("[class*='"+config.mailTitleClass+"']");
		mailTitleInput.val(nowEditFileName);
		mailTitleInput.attr("title",nowEditFileName);
		
		if(DOM.alreadyShow)return;
		
		$(DOM.config.onOffBtn).addClass("underLine");
		$SELF.animate({ bottom: 0}, 1000, 'easeOutCubic',function(){
			mailTitleInput.focus();
		});
		$("#shadow").show();
		
		DOM.alreadyShow = true;
	}
	
	DOM.hideSelf = function(){
		var lastOpen = $.TEMP.lastOpenPanel.get(0);
		$(lastOpen.config.onOffBtn).removeClass("underLine");
		if(!DOM.alreadyShow)return;
		$SELF.animate({ bottom: -150}, 1000, 'easeOutCubic');
		$("#shadow").hide();
		DOM.alreadyShow = false;
	}


	//将内容发送邮件 + config.... 暂时默认
	DOM.sendMail = function(){
			if(DOM.isSending)return;
			$(config.tooBarLoadingIco).fadeIn(500);
			var sendMailBtn = $SELF.find("[class*='"+config.sendMailBtnClass+"']");
			sendMailBtn.addClass(config.sendMailBtnLoadingClass);
			var linkEditor = $(config.linkEditor).get(0);
			var html = linkEditor.GetHTML();
			
			var mailTitle = $SELF.find("[class*='"+config.mailTitleClass+"']").val();
			var mailAddress = $SELF.find("[class*='"+config.mailAddressClass+"']").val();
			$.ajax({
				url: 'actions.php', 
				type: 'POST', 
				data:{mailTo:mailAddress,title:mailTitle,action:"SENDMAIL",content:html}, 
				dataType: 'html', 
				timeout: -1, 
				error: function(){
					alert('Error loading PHP document');
				}, 
				success: function(result){
					//alert(result);
					$(DOM.config.linkMsgBox).get(0).showSelf({autoBack:true});
					$(DOM.config.sendMailCount).html(parseInt($(DOM.config.sendMailCount).html())+1);
				},
				complete : function(){
					$(config.tooBarLoadingIco).fadeOut(500);
					sendMailBtn.removeClass(config.sendMailBtnLoadingClass);
					DOM.isSending = false;
				}
			});
			try{
				//loading图标
				config.btn.loadingIco = $('<span class="loading"></span>');
				$(config.btn).append(config.btn.loadingIco);
			}catch(e){}
			DOM.isSending = true;
	}
		
	//** 动作捆绑 **
	//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
	$SELF.find("[class*='"+config.closeBtnClass+"']").click(function(){
		DOM.hideSelf();
	})
	
	$SELF.find("[class*='"+config.sendMailBtnClass+"']").click(function(){
		DOM.sendMail();
	})

	// 按钮事件捆绑
	$(config.onOffBtn).click(function(){
		if(DOM.alreadyShow){
			DOM.hideSelf(500);
		}else{
			DOM.showSelf(500);
		}
	});
	
	//** 默认运行区域 **
	//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 其它工具扩展 ]=---------------------------->>>
//=[ 功能 : 自动定义无href链接 ]=------------------------------------------------->>>
//=[ PS: 没有href加上js空方式  使其也能使用css中hover方式 ]
$.fn.defineEmptyLinks = function(){
	$(this).each(function(){
			if(!$(this).attr("href")){
					$(this).attr({href:"javascript:void(0);"});
				}
	});
	if($.browser.msie)CollectGarbage();
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 统计页面执行时间 ]=---------------------------->>>
$.fn.showHtmlTime = function(Data){
		var Now = new Date();
		X.JsEndTime = Now.getTime();
		var T = X.JsEndTime - X.JsStartTime;
		if(!this){
			return T;
		}else{
			$(this).html(T+"ms");
		}
		var outer = $(this).parent();
		//setTimeout(function(){outer.fadeOut(1000,function(){outer.html("About Us ...");outer.show(600);});},3000);
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 功能 : 居中 动画 ]=------------------------------------------------->>>
$.fn.toScreenCenter = function(myConfig) { 
				if(this.get(0).style.display == "none")return;
				var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
				var $SELF = this;
				var config = DOM.config = $.extend({
					x : 0,
					y : 0
				},myConfig);

        if(!DOM.loaded) { 
        				DOM.loaded = true;
                $SELF.css('top', ($(window).height()/2-this.height()/2)+config.y); 
                $SELF.css('left', ($(window).width()/2-this.width()/2)+config.x);
                $(window).resize(function() { $SELF.toScreenCenter(config.x,config.y); }); 
        } else {
                $SELF.stop(); 
                $SELF.animate({ top: ($(window).height()/2-this.height()/2)+config.y, left: ($ (window).width()/2-this.width()/2)+config.x}, 600, 'easeInBack'); 
        }
}

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 功能 : 兼容ff的outerHTML  + 返回时候去除jquery标记.. ]=------------------------------------------------->>>
jQuery.fn.outer = function() { 
   return $('<div></div>').append( this.eq(0).clone()).html().replace(eval('/jQuery.*?\"null\"/ig'),'');
} 

//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 功能 : Date prototype 扩展 时间格式化 ]=------------------------------------------------->>>
//PS.new Date().format("yyyy.M.d mm分ss秒")
Date.prototype.format = function(format)
{
	var o = {
	"M+" : this.getMonth()+1, //month
	"d+" : this.getDate(),    //day
	"h+" : this.getHours(),   //hour
	"m+" : this.getMinutes(), //minute
	"s+" : this.getSeconds(), //second
	"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format))
	format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}


//▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
//=[ 其它 ]=------------------------------------------------->>>
//** just for editor API **
function FCKeditor_OnComplete(editorInstance){
	//loading....Complete  sound only for ie
	if($.browser.msie){
		var loadingCompleteSound = $('<bgsound/>').attr({ 
					 id: "loadingCompleteSound", 
					 src: "Style/sound/loadingComplete4.mp3", 
					 loop: 1, 
					 autostart: true 
				   }) 
		loadingCompleteSound.appendTo("body"); 
	}
	
	//loadingBar消失
	$("#toolBarLoading").fadeOut(2000);

	//这里d6wEditor写死先  待会找办法取对象
	var editorToolBar = editorInstance.EditorWindow.parent.document.getElementById("xToolbar");
		$(editorToolBar).bind("dblclick", function(){
		editorInstance.ToolbarSet.Collapse();
	});

	var body = $(editorInstance.EditorDocument.body);
	var spans = body.find("#noDesign");
	var inputfc = body.find("#fc");

	//非编辑区域跳开~
	try{
		spans[0].contentEditable = false; 
		spans[0].designMode = "Off"; 
		spans[0].unselectable = true;
	}catch(e){}
	spans.bind("mousemove",function(e){
		editorInstance.EditorWindow.parent.document.body.focus();
	})
	
	if($.browser.msie)CollectGarbage();

}




// ** 最终章 : 初始化 **
//--------------------------------------------------------------------------------+[ 初始化 ]+

$(function(){

		//初始化消息面板
		$("#msgBox").toBeMsgBox();
		
		//初始化编辑器
		var editorConfig = {
			type:"FCK",
			skinPath: $.I.config.skinPath + "/FCKSkin/",
			customConfigFile:"Js/FCK/CustomSetting/snow.config.js",
			toolbarSet:"snow",
			toolbarStartExpanded:false,
			fullPage:true,
			height:"94%",
			width:"100%",
			mailTo : "sxnow@126.com;alibaba_test@yahoo.com;alibaba_test@hotmail.com;alibabatest@gmail.com"
		}
		$("#d6wEditor").toBeEditor(editorConfig);
		
		
		//初始化模板箱
		var templatesBoxConfig = {
				title : " - 我的模板箱",
				target : "#templatesBox",
				root : "Files/Templates/",
				script : "actions.php",
				fileList : "#templatesList",
				showRoom : "#templateShowRoom",
				demoIframeId : "templateDemoIframe",
				linkEditor	:	"#d6wEditor",
				onOffBtn : "#templatesBoxBtn",
				closeBtn : "#templatesBoxCloseBtn",
				reloadFileListBtn : "#templatesBoxReloadBtn",
				shadow : "#shadow"
		}
		$("#templatesBox").toBeFileBrowser(templatesBoxConfig);
		
		//初始化草稿箱
		var draftsBoxConfig = {
				title : " - 我的草稿箱",
				target : "#draftsBox",
				root : "Files/Archive/",
				script : "actions.php",
				fileList : "#draftsList",
				showRoom : "#draftShowRoom",
				demoIframeId : "draftDemoIframe",
				linkEditor	:	"#d6wEditor",
				onOffBtn : "#draftsBoxBtn",
				closeBtn : "#draftsBoxCloseBtn",
				reloadFileListBtn : "#draftsBoxReloadBtn",
				shadow : "#shadow"
		}
		$("#draftsBox").toBeFileBrowser(draftsBoxConfig);
		
		//初始化邮件发送箱
		var mailPanelConfig = {
			linkEditor	:	"#d6wEditor"
		}
		$("#mailPanel").toBeMailPanel(mailPanelConfig);

		//初始化History控制器
		$("#historyAPP").toBeHistoryBody();//自动全局化
		
		//重新遍历所有a +js void(0) 兼容hover
		$("a").defineEmptyLinks();
		
		// 写入载入时间
		$("#jsRunTime").showHtmlTime();


		 

	
	
	
	//乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~乱来了~~


		//前景布局
		
		$("#shadowSWF").flash({
							src: $.I.config.skinPath + '/flash/snow.swf',
							width: '100%',
							height: document.body.scrollHeight,
							wmode:'transparent',
							SCALE:'noscale',
							flashvars: {Pheight: document.body.scrollHeight,Pwidth:window.screen.width,amc_zi: ' ' }
			 			});

		
		$(window).resize( function() { 
										$('#shadowSWF').height(document.body.scrollHeight);
										$('#shadowSWF').width(document.body.scrollWidth);
									 } );
									 
									 
		/*
		$("#saveDraftsBtn").click(function(){
			draftsBox.saveDraft({btn:$(this)});
		})
		*/
		
		$("#designLayoutBtn").click(function(){
			d6wEditor.designLayout();
		})
		
		
		//$("#SCV").draggable({ handle: '#scvHandle' });
		
		$("#scvHandle").mousedown(function(){
				$("#shadow").show();
			}
		)


		$("#scvHandle").mouseup(function(){
				$("#shadow").hide();
			}
		)

		//小小test一下
		$("#test").click(function(){
			$("#d6wEditor")[0].InsertHtml($(this.parentNode).find("[class*='scvBoxContent']").html());
		})
		
		$("#itemLi").hover(function(){
			$(this).append($('<div class="over" style="position:absolute;right:200px;bottom:10px;height:auto;width:auto;margin-left:10px;border:3px #79706A solid;padding:10px;background:#fff;">'+$(this).find("[class*='scvBoxContent']").html()+'</div>'))
		},function(){
			
			$(this).find("div[class*='over']").remove();
		})
		
		$("#itemLi").mousedown(function(){
			$(this).find("div[class*='over']").remove();
		})


		$("#scvHandle").bind("mousedown",function(){
			if($.browser.msie)this.setCapture();
			
			$("body").bind("mousemove",function(event){
				//for ff ... == setCapture
				if(window.captureEvents){
					//window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);   
					//window.getSelection && window.getSelection().removeAllRanges();
				}
				
				if (event.preventDefault) event.preventDefault();
				if (event.stopPropagation) event.stopPropagation();
				
				 
				//if($.browser.msie)CollectGarbage();
				//window.status = (event.screenY - $(window).height());
				//$("#SCV").css({"left":event.pageX-120 + "px","top":event.pageY - 15 + "px"});
				$("#SCV")[0].style.left = event.pageX-120 + "px";
				if((event.screenY - $(window).height())>75)return;
				$("#SCV")[0].style.top = event.pageY-20 + "px";
				//if (event.stopPropagation) event.stopPropagation();
			});
			
			$("body").bind("mouseup",function(){
				if($.browser.msie)$("#scvHandle")[0].releaseCapture();
				$("body").unbind("mousemove");
			});
		})

		
		$("#ctlPanel").toScreenCenter({x:0,y:0});

		
/*
		setTimeout(function(){
			 $("#ctlPanelMenu").animate({ top: 0}, 1000, 'easeOutCubic'); 
			},5000)
*/



		
		$("#manageEmAddressBtn").click(function(){
			$("#manageEmAddress").slideToggle(300);
			$("#sendTestEmails").slideToggle(300);
		})
		
		 
		 $("#copyRight").toggle(function(){
			 	$("#about").toScreenCenter();
			 	$("#about").fadeIn(500);
			 	$("#shadowSWF").show();
			 	$("#shadow").show();
		 	},function(){
			 	$("#about").fadeOut(500);
			 	$("#shadowSWF").hide();
			 	$("#shadow").hide();
		 	})
		 
		 
})
