## yinrh-menu-float
可拖拽、可展开的悬浮按钮，展开后呈现5个菜单按钮

## 使用方法
在``template``中直接使用
```
<yinrh-menu-float @menuClick="floatTouchClick" />
```
或者
```
<yinrh-menu-float :imgMenu="" :imgLists="" @menuClick="floatTouchClick" />
```

## 参数说明
+ imgMenu：主菜单图标，默认值如下，可根据需求修改
```
	/uni_modules/yinrh-menu-float/static/main.png
```
+ imgLists：副菜单图标，默认值如下，可根据需求修改
```
[
	"/uni_modules/yinrh-menu-float/static/menu_release.png",
	"/uni_modules/yinrh-menu-float/static/menu_edit.png",
	"/uni_modules/yinrh-menu-float/static/menu_delete.png",
	"/uni_modules/yinrh-menu-float/static/menu_search.png",
	"/uni_modules/yinrh-menu-float/static/menu_setting.png"
]
```
+ menuClick：副菜单回调方法