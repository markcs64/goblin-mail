
FCKCommands.RegisterCommand( 'Code', new FCKDialogCommand( 'Code', FCKLang.CodeDlgTitle, FCKPlugins.Items['code'].Path + 'dialog.html', 500, 300 ) ) ;

//FCK_TOOLBARITEM_ICONTEXT FCK_TOOLBARITEM_ONLYICON FCK_TOOLBARITEM_ONLYTEXT
/*
按钮命令名称，按钮标签文字，按钮工具提示，按钮样式，按钮是否在源代码模式可见，按钮下拉菜单其中将第4项参数设置为 FCK_TOOLBARITEM_ICONTEXT 即可使按钮旁边出现文字，注意没有引号。
其中第3，4，5，6个参数的意义分别是：
是否有tooltip：默认为第一个参数的字符串形式。
是什么样的style：FCK_TOOLBARITEM_ONLYICON  只有图标
FCK_TOOLBARITEM_ONLYTEXT  只有文本
FCK_TOOLBARITEM_ICONTEXT   两者都有
是否SourceView ：true or false？
是否ContextSensitive ：true or false？
*/
var oNewItem = new FCKToolbarButton( 'Code', FCKLang.NewBtn, '点这个可以插入运行代码的哦~~', FCK_TOOLBARITEM_ONLYICON, false, true, 1 ) ;

oNewItem.IconPath = FCKPlugins.Items['code'].Path + 'ico.png' ;//注意这里是小写 和plugin路径一致

FCKToolbarItems.RegisterItem( 'Code', oNewItem ) ;



var FCKCodes = new Object() ;




FCKCodes.Add = function( CodeValue )
{
	//选取到的内容?//http://blog.fhuang.com/blog/article.asp?id=240
	var A=FCK.EditorDocument.selection.createRange();
	//alert(FCK.EditorDocument.selection.type);
	OldText = A.text;
	//A.pasteHTML("哈哈");
	A.text = "[Code='" + CodeValue + "']" + OldText + "[/Code]";



	//插入操作//会让selection丢失
	//FCK.InsertHtml("[[Code:"+CodeValue+"]]") ; 
	//alert(msg);
	//alert(FCK.Config['DialogGet']);
	
	//获取外部标单进行操作
	var oForm = FCK.GetParentForm() ;
	oForm('OutFromEditor').value = CodeValue;
	
	
	//操作外部引用叶元素
	FCK.EditorWindow.parent.parent.document.all('OutFromEditor2').value = CodeValue;
	

}
