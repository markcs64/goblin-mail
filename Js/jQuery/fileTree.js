$.fn.toBeFileTree = function(iConfig, selectCall,collapseCall) {
			// Defaults
			var self = this.get(0);
			var o = self.config = $.extend({
					name : "toBeFileTree",
					root : "/",
			    script : 'jqueryFileTree.php',
			    folderEvent : "click",
			    expandSpeed : 750,
			    collapseSpeed : 750,
			    expandEasing : null,
			    collapseEasing : null,
			    multiFolder : true,
			    loadMessage : "** ... Loading ... **"
			    //allowExt : ">>|js|html|htm|css|<<" //">>|js|html|css|<<" ** darksnow ext allow **
		  },iConfig);
		  
		  
			$(this).each( function() {
				function showTree(c, t) {
					var listItem = $(c).find('span');
					listItem.addClass('wait');
					$(".jqueryFileTree.start").remove();
					
					$.post(o.script, { filePath: t , allowExt : o.allowExt || "" }, function(data) {
						$(c).find('.start').html('');
						listItem.removeClass('wait');
						$(c).append(data);
						//初始化时候可以不用动画 -> if( o.root == t ) $(c).find('UL:hidden').show(); else $(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						$(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						bindTree(c);
					});
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
					
					$(t).find('LI').bind(o.folderEvent, function() {
						var listItem = $(this).find('span');
						if( $(this).hasClass('imDir') ) {
							if( $(this).hasClass('collapsed') ) {
								if( !o.multiFolder ) {
									$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().find('LI.imDir').find('span').removeClass('expanded').addClass('collapsed');
								}
								$(this).find('UL').remove();
								showTree( $(this), escape($(this).attr('rel').match( /.*\// )) );
								$(this).removeClass('collapsed')//展开标记
								listItem.addClass("expanded");
							} else {
								// Collapse
								collapseCall($(this));
								$(this).find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
								$(this).addClass('collapsed');
								listItem.removeClass("expanded");
							}
						} else {
							selectCall($(this));
						}
						return false;
					});
					if( o.folderEvent.toLowerCase != 'click' ) $(t).find('LI A').bind('click', function() { return false; });
				}
				
				//公开函数
				self.reloadTree = function(){
					$(this).html('<ul class="jqueryFileTree start"><li><span class="item wait">' + o.loadMessage + '</span><li></ul>');
					showTree( $(this), escape(o.root) );
				}
				
				self.reloadTree();
			});
}

	
