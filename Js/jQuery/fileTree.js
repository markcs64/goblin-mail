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
		  
			DOM.showTree = function(target, path) {
					$.ajax({
					  type: "POST",
					  cache: false,
					  url: config.script,
					  dataType: "json",
					  cache:true,
					 	data: {action:"NEWFILETREE",path:path,allowExt:config.allowExt},
					  success: function(json){
					  		$(target).find('ul[@model!="true"]').remove();
					  		
							  //for folders
							  var foldersHTML = "";
							  $.each(json.folders, function(key, jdata){
									var liHTML = DOM.folderLiHTML;
									$.each(jdata,function(jname,jvalue){
										liHTML = liHTML.replace(eval("/\\*"+jname+"\\*/ig"),jvalue);
										liHTML = liHTML.replace(eval("/\\*path\\*/ig"),key);
									})
									foldersHTML += liHTML;liHTML=null;
							  });
							  
							  //for files
							  var filesHTML = "";
							  $.each(json.files, function(key, jdata){
									var liHTML = DOM.fileLiHTML;
									$.each(jdata,function(jname,jvalue){
										liHTML = liHTML.replace(eval("/\\*"+jname+"\\*/ig"),jvalue);
										liHTML = liHTML.replace(eval("/\\*path\\*/ig"),key);
									})
									filesHTML += liHTML;liHTML=null;
							  });
								
								
								var lastHTML = foldersHTML + filesHTML;foldersHTML=null;filesHTML=null;
								var newUlItem = DOM.ulModel.clone().removeAttr("model");
								newUlHTML = newUlItem.html(lastHTML).outer();lastHTML=null;
								target.innerHTML += newUlHTML;newUlHTML=null;
								
								$(target).find('ul[@model!="true"]').slideDown({ duration: config.expandSpeed, easing: config.expandEasing });
								
								DOM.bindTree(target);
								var itemIco = $(target).find('[class*="item"]');
								itemIco.removeClass('wait');itemIco = null;
								
								if ($.browser.msie) CollectGarbage();
					  }
					})
				}
				
				DOM.bindTree = function(target) {
					$(target).find('LI[@class*="imFile"]').hover(
						function(){
							$(this).addClass("mouseHover");
						},
						function(){
							$(this).removeClass("mouseHover");
						}
					)
					$(target).find('LI').bind(config.folderEvent, function() {
						var listItem = $(this).find('span');
						if( $(this).hasClass('imFolder') ) {
							if( $(this).hasClass('collapsed') ) {
								if( !config.multiFolder ) {
									$(this).parent().find('UL').slideUp({ duration: config.collapseSpeed, easing: config.collapseEasing });
									$(this).parent().find('LI.imFolder').find('span').removeClass('expanded').addClass('collapsed');
								}
								$(this).find('UL').remove();
								DOM.showTree( this, escape($(this).attr('pathForScript').match( /.*\// )) );
								$(this).removeClass('collapsed')//展开标记
								listItem.addClass("expanded");
								var itemIco = $(this).find('[class*="item"]');
								itemIco.addClass('wait');
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
					if( config.folderEvent.toLowerCase != 'click' ) $(target).find('LI A').bind('click', function() { return false; });
				}
				
				DOM.reloadTree = function() {
					DOM.showTree( DOM, escape(config.root) );
				}

				// set TPLs
				DOM.ulModel = $SELF.find("ul[@model='true']");DOM.ulModel.hide();
				DOM.folderLiHTML = DOM.ulModel.find("li[class*='imFolder']").outer();
				DOM.fileLiHTML = DOM.ulModel.find("li[class*='imFile']").outer();

				DOM.showTree( DOM, escape(config.root) );
				
}

	
