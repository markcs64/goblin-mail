var CustomPluginPath = '../CustomSetting/plugins/' ;
//FCKConfig.Plugins.Add( 'code', 'zh-cn,en', CustomPluginPath ) ;
//FCKConfig.Plugins.Add( 'insertcode','zh-cn,en',CustomPluginPath ) ;
FCKConfig.Plugins.Add( 'savedraft', 'zh-cn,en', CustomPluginPath ) ;
FCKConfig.Plugins.Add( 'simplecommands', null, CustomPluginPath ) ;

FCKConfig.Plugins.Add( 'dragresizetable', null, CustomPluginPath ) ;
FCKConfig.Plugins.Add( 'tablecommands', null, CustomPluginPath ) ;

/*
FCKConfig.ToolbarSets['snow'] = [
	['SourceSimple'],
	['Source'],
	['Code']
] ;
*/

//border: 0pt none ; margin: 0pt; padding: 0pt; background-color: transparent; background-image: none; height: 152px; width: 156px; position: absolute; z-index: 10000; left: 22px; top: 51px;
//替补 'Save'

FCKConfig.ToolbarSets['snow'] = [
	['savedraft','DocProps'],
	['Undo','Redo'],
	['Cut','Copy','Paste','PasteText','PasteWord'],
	['Find','RemoveFormat'],
	['Image','Flash','SpecialChar'],
	['Link','Unlink','Anchor'],
	['Print'],
	['Preview','ShowBlocks','SourceSimple'],
	"/",
	['StyleSimple','FontNameSimple','FontSizeSimple'],
	['TextColor','BGColor'],
	['Bold','Italic','Underline','Italic','Subscript','Superscript'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],	
	['Table','TableInsertRowAfter','TableDeleteRows','TableInsertColumnAfter','TableDeleteColumns','TableInsertCellAfter','TableDeleteCells','TableMergeCells','TableHorizontalSplitCell','TableCellProp']

] ;

FCKConfig.ToolbarSets['snow_Basic'] = [
	['FitWindow'],
	['FontSizeSimple','FontNameSimple','Bold','TextColor'],
	['Smiley','Image','Link'],
	['SourceSimple']
] ;

FCKConfig.FontNames	= 'Arial;verdana;Tahoma;宋体/宋;Courier New/打印英文;' ;
FCKConfig.FontSizes	= '10px/版权等小字(10px);11px/常规字号(11px);14/比较大(14px);16/有点大(16px);22/很大(18px);26/巨大(26px);36/庞大(36px)' ;
//var sOtherPluginPath = FCKConfig.BasePath.substr(0, FCKConfig.BasePath.length - 7) + 'editor/plugins/' ;



