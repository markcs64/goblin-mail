$.fn.toBeFileTree = function(myConfig, selectCall,collapseCall) {
			// Defaults
			var DOM = this.get(0);if(eval("typeof("+DOM.id+")") == "undefined"){eval(DOM.id + " = DOM;");}//DOMID -> 全局
			var $SELF = this;
			var config = DOM.config = $.extend({
					name : "fileTree",
					root : "/",
			    script : 'fileTree.php',
			    folderEvent : "click",
			    expandSpeed : 750,
			    collapseSpeed : 750,
			    expandEasing : 'easeOutBounce',
			    collapseEasing : 'easeOutBounce',
			    multiFolder : true,
			    loadMessage : "** ... Loading ... **",
			    allowExt : ">>|js|html|htm|css|<<" //">>|js|html|css|<<" ** darksnow ext allow **
		  },myConfig);
		  
		  
			$(this).each( function() {
				function showTree(c, t) {
					$.ajax({
					  type: "GET",
					  cache: false,
					  url: config.script,
					  dataType: "json",
					 	data: {action:"NEWFILETREE",path:"Files/Templates/",allowExt:config.allowExt},
					  success: function(json){
					  	 DOM.innerHTML = json;
					  }
					})
					
					/*
					var listItem = $(c).find('span');
					listItem.addClass('wait');
					$(".jqueryFileTree.start").remove();
					
					$.post(config.script, { filePath: t , allowExt : config.allowExt || "" }, function(data) {
						$(c).find('.start').html('');
						listItem.removeClass('wait');
						$(c).append(data);
						//初始化时候可以不用动画 -> if( config.root == t ) $(c).find('UL:hidden').show(); else $(c).find('UL:hidden').slideDown({ duration: config.expandSpeed, easing: config.expandEasing });
						$(c).find('UL:hidden').slideDown({ duration: config.expandSpeed, easing: config.expandEasing });
						bindTree(c);
					});
					*/
					
				}
				function bindTree(t) {
					$(t).find('LI[@class*="imFile"]').hover(
						function(){
							$(this).addClass("mouseHover");
						},
						function(){
							$(this).removeClass("mouseHover");
						}
					)
					
					$(t).find('LI').bind(config.folderEvent, function() {
						var listItem = $(this).find('span');
						if( $(this).hasClass('imDir') ) {
							if( $(this).hasClass('collapsed') ) {
								if( !config.multiFolder ) {
									$(this).parent().find('UL').slideUp({ duration: config.collapseSpeed, easing: config.collapseEasing });
									$(this).parent().find('LI.imDir').find('span').removeClass('expanded').addClass('collapsed');
								}
								$(this).find('UL').remove();
								showTree( $(this), escape($(this).attr('rel').match( /.*\// )) );
								$(this).removeClass('collapsed')//展开标记
								listItem.addClass("expanded");
							} else {
								// Collapse
								collapseCall($(this));
								$(this).find('UL').slideUp({ duration: config.collapseSpeed, easing: config.collapseEasing });
								$(this).addClass('collapsed');
								listItem.removeClass("expanded");
							}
						} else {
							selectCall($(this));
						}
						return false;
					});
					if( config.folderEvent.toLowerCase != 'click' ) $(t).find('LI A').bind('click', function() { return false; });
				}
				
				//公开函数
				DOM.reloadTree = function(){
					$(this).html('<ul class="jqueryFileTree start"><li><span class="item wait">' + config.loadMessage + '</span><li></ul>');
					showTree( $(this), escape(config.root) );
				}
				
				DOM.reloadTree();
			});
}

	
