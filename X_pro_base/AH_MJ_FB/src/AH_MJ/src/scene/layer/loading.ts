/**
 * Created by Duo Nuo on 2017/1/4.
 * 数据加载
 * 资源加载
 */
class AH_LoadLayer extends egret.Sprite{
    /*资源加载视图*/
    protected loadingView:LoadingUI;
    /*数据加载视图*/
    protected loadDataView:LoadingDataView;
    protected loadName;
    protected loadGroupList=[];
    /*-----------------------------------资源加载---------------------------------------*/
    /*加载资源配置文件*/
    public loadResourceFile(backFun){
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        function onConfigComplete(){
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, this);
            backFun();
        }
    }
    /*加载一组资源----传说中分段加载*/
    public loadingGroup(loadName,loadingType=null){
        this.loadName=loadName;
        MyConsole.getInstance().trace("加载资源组"+loadName,2);
        for(var i in this.loadGroupList){
            if(this.loadGroupList[i]==loadName){//多次加载
                MyConsole.getInstance().trace("资源组["+this.loadName+"]已加载过",2);
                this.onResourceLoadComplete(null);
                return;
            }
        }
        this.loadGroupList.push(loadName);/*加载资源组*/
        if(loadingType){
            if(this.loadingView)MyConsole.getInstance().trace("多线程加载还没做呢");
            this.loadingView = new LoadingUI(loadingType);
            this.addChild(this.loadingView);
        }
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup(this.loadName);
    }
    //资源组加载过程中
    protected onResourceProgress(event:RES.ResourceEvent):void {
        if (this.loadingView) {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    //资源组加载完成
    protected onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event&&event.groupName == this.loadName) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            if(this.loadingView){
                /*由于屏幕适配，加上动画效果后，易穿帮 2.1.0舍弃*/
                // if(BaseModel.IOS)this.loadOkAni1();
                this.loadingView.clear();
                this.removeChild(this.loadingView);
                this.loadingView=null;
            }
            MyConsole.getInstance().trace("资源组["+this.loadName+"]加载完成",2);
        }
        this.dispatchEvent(new egret.Event("UILoadOk"));
    }
    //资源组加载出错
    protected onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    //资源组加载出错
    protected onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }
    /*加载完毕动画*/
    protected loadOkAni1(){
        var renderTexture:egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(this);
        var ani;
        if(BaseModel.PLAYBACK_MODEL){
            ani=new LoadAni1View(renderTexture);
        }else{
            ani=new LoadAni2View(renderTexture);
        }
        this.addChild(ani);

    }
    /*-----------------------------------数据加载---------------------------------------*/
    public addDataLoading(type=1){
        this.removeDataLoading();
        this.loadDataView = new LoadingDataView("玩命加载中...");
        this.addChild(this.loadDataView);
    }
    /**/
    public removeDataLoading(){
        if(this.loadDataView){
            this.loadDataView.clear();
            this.removeChild(this.loadDataView);
            this.loadDataView = null;
        }
    }

    /*-----------------------------------加载外部资源---------------------------------------*/
    //加载外部图片
    public loadExternalBit(bit,url,backFun=null){
        RES.getResByUrl(url, function (texture:egret.Texture) {
            //将加载完的资源进行显示
            if(bit)bit.texture=texture;
            if(backFun)backFun(bit);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }
    //加载外部音效
    public loadExternalSound(url,backFun=null){
        RES.getResByUrl(url, function (sound:egret.Sound) {
            backFun(sound);
        }, this, RES.ResourceItem.TYPE_SOUND);
    }
    //加载外部音效-原生
    public loadExternalSound_audio(url,backFun=null){
        var sound=document.createElement("audio");
        sound.src=url;
        backFun(sound);
    }
}