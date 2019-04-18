class AH_Main extends egret.DisplayObjectContainer {
    protected gameLayer:BaseView;//游戏层
    protected model:ManagerModel;//数据
    protected hallScene:HallScene;//大厅场景
    protected gameScene:GameScene;//游戏场景
    protected lockSTips:egret.Bitmap;//竖屏提示
    public static AH_MJ_version="2.0.1";/*一号机母包版本号*/
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    public onAddToStage(event: egret.Event) {
        /*数据类*/
        this.model=new ManagerModel();
        this.model.initConfig(this);
        /*-------------初始化层级--------------------*/
        /*游戏层-最底层*/
        this.gameLayer=new BaseView();
        this.addChild(this.gameLayer);
        /*弹框-浮框层*/
        this.addChild(PopupLayer.getInstance());
        /*加载层*/
        this.addChild(LoadLayer.getInstance());
        /*竖屏提示界面*/
        this.lockSTips=new egret.Bitmap();
        this.addChild(this.lockSTips);
        this.lockSTips.visible=false;
        /*-------------初始化事件--------------------*/
        //大厅场景
        this.model.addEventListener("addHallScene",this.cutScene,this);
        //游戏场景
        this.model.addEventListener("addGameScene",this.cutScene,this);
        //竖屏提示
        this.model.addEventListener("lockSTIps",this.setLockSTips,this);
        //退出游戏
        BaseModel.getInstance().addEventListener("quitGame",this.quitGame,this);
        //抖屏动画
        BaseModel.getInstance().addEventListener("shakeAni",this.shakeAni,this);
        //
        /*-------------启动资源加载--------------------*/
        //加载配置文件
        LoadLayer.getInstance().loadResourceFile(this.cutScene.bind(this,{type:"loading"}));
    }
    /*切换场景*/
    protected cutScene(e){
        this.clearScene();//清空场景
        switch(e.type){
            case "loading":
                //加载基础资源
                this.subsectionLoadScene("loading",function () {
                    //连接服务器
                    this.model.startWebSocket();
                }.bind(this),0);
                break;
            case "addHallScene"://显示大厅场景
                //加载基础资源
                this.subsectionLoadScene("hall",this.addHallScene.bind(this));
                break;
            case "addGameScene"://显示游戏场景
                this.subsectionLoadScene("game",this.addGameScene.bind(this));
                break;
        }
    }
    /*显示大厅场景*/
    public addHallScene(){
        MyConsole.getInstance().trace("显示大厅场景",3);
        this.hallScene=new HallScene(this.model.hallModel);
        /*属性*/
        /*事件*/
        this.gameLayer.addChild(this.hallScene);
    }
    /*显示游戏场景*/
    public addGameScene(){
        MyConsole.getInstance().trace("显示游戏场景",3);
        this.gameScene=new GameScene(this.model.gameModel);
        /*属性*/
        /*事件*/
        this.gameLayer.addChild(this.gameScene);
    }
    /*清空场景*/
    protected clearScene(){
        if(this.hallScene){
            /*移除事件侦听*/
            /*清空内部视图*/
            this.hallScene.clear();
            /*从游戏层移除*/
            this.gameLayer.removeChild(this.hallScene);
            this.hallScene=null;
        }
        if(this.gameScene){
            this.model.gameModel.currentScene=BaseModel.GAME_SCENE_loading;/*设置游戏场景关闭*/
            /*移除事件侦听*/
            /*清空内部视图*/
            this.gameScene.clear();
            /*从游戏层移除*/
            this.gameLayer.removeChild(this.gameScene);
            this.gameScene=null;

        }

    }
    /*分段加载资源*/
    protected subsectionLoadScene(name,backFun,loadingType=1){
        LoadLayer.getInstance().addEventListener("UILoadOk",UILoadOk,this);
        //加载load基础资源
        LoadLayer.getInstance().loadingGroup(name,loadingType);
        function UILoadOk(){
            LoadLayer.getInstance().removeEventListener("UILoadOk",UILoadOk,this);
            backFun();
        }
    }
    /*竖屏提示*/
    protected setLockSTips(e:egret.Event){
        var _isAdd=e.data;
        this.lockSTips.texture=RES.getRes("lockSTips");
        this.lockSTips.touchEnabled=this.lockSTips.visible=_isAdd;
    }
    /*退出游戏*/
    protected quitGame(){
        WeiXinJSSDK.getInstance().closeWindow();

        window.opener=null;
        window.open('','_self');
        window.close();
    }
    /*抖屏动画*/
    protected shakeAni(){
        egret.Tween.removeTweens(this);
        var X = this.x;
        var Y = this.y;
        egret.Tween.get(this).to({x:X-5},60).to({x:X},60).to({y:Y+5},60).to({y:Y},30);
    }

}


