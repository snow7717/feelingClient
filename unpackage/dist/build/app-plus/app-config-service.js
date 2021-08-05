
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/index/index","pages/home/message/index","pages/home/article/show","pages/user/index/index","pages/user/register/index","pages/user/login/index","pages/user/setting/index","pages/user/info/index","pages/user/article/index","pages/user/article/list","pages/user/article/create","pages/user/article/edit","pages/user/article/comment","pages/user/comment/index"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#333333","selectedColor":"#FF4A38","borderStyle":"black","backgroundColor":"#ffffff","list":[{"pagePath":"pages/home/index/index","iconPath":"static/image/common/home.png","selectedIconPath":"static/image/common/home1.png","text":"首页"},{"pagePath":"pages/home/message/index","iconPath":"static/image/common/message.png","selectedIconPath":"static/image/common/message1.png","text":"消息"},{"pagePath":"pages/user/index/index","iconPath":"static/image/common/user.png","selectedIconPath":"static/image/common/user1.png","text":"我的"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"home","compilerVersion":"3.1.22","entryPagePath":"pages/home/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"首页","enablePullDownRefresh":true,"titleNView":{"searchInput":{"autoFocus":true,"placeholder":"文章标题"}}}},{"path":"/pages/home/message/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的消息"}},{"path":"/pages/home/article/show","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/user/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"用户中心"}},{"path":"/pages/user/register/index","meta":{},"window":{"navigationBarTitleText":"用户注册"}},{"path":"/pages/user/login/index","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/user/setting/index","meta":{},"window":{"navigationBarTitleText":"设置"}},{"path":"/pages/user/info/index","meta":{},"window":{"navigationBarTitleText":"个人资料"}},{"path":"/pages/user/article/index","meta":{},"window":{"navigationBarTitleText":"文章管理"}},{"path":"/pages/user/article/list","meta":{},"window":{"navigationBarTitleText":"文章列表","enablePullDownRefresh":true,"titleNView":{"searchInput":{"autoFocus":true,"placeholder":"文章标题"},"buttons":[{"text":"+","fontSize":"22px"}]}}},{"path":"/pages/user/article/create","meta":{},"window":{"navigationBarTitleText":"发表文章"}},{"path":"/pages/user/article/edit","meta":{},"window":{"navigationBarTitleText":"编辑文章"}},{"path":"/pages/user/article/comment","meta":{},"window":{"navigationBarTitleText":"文章评论"}},{"path":"/pages/user/comment/index","meta":{},"window":{"enablePullDownRefresh":true,"titleNView":{"searchInput":{"autoFocus":true,"placeholder":"评论内容"}}}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
