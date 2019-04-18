/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 游戏场景主类
 */
class AH_GameScene extends BaseScene{
    /*数据类*/
    protected model:GameModel;
    /*背景层*/
    protected backgroundView:BackgroundView;
    /*背景上层*/
    protected backgroundUpView:BackgroundUpView;
    /*回放功能 操作界面2.1.4*/
    protected playbackView:PlaybackView;
    //吃碰杠胡动画层 最高层 2.1.4后第二层
    protected aniView:Game_playingAniView;
    /*游戏中 打牌场景----断线重连*/
    protected playingScene:PlayingScene;
    /*玩家等待加入场景----断线重连*/
    protected prepareScene:PrepareScene;
    /*游戏中 下一局准备场景----断线重连*/
    protected waitScene:WaitScene;

    public constructor(model){
        super(model);
        this.init();
    }
    /*----------------初始化------------------------------*/
    protected init(){
        /*背景最底层*/
        this.backgroundView=new BackgroundView(this.model.backLayerModel);
        this.addChild(this.backgroundView);
        this.backgroundUpView=new BackgroundUpView(this.model.backLayerModel);
        this.addChild(this.backgroundUpView);
        /*打牌 表情 吃碰杠胡动画层*/
        this.aniView=new Game_playingAniView(this.model);
        this.addChild(this.aniView);

        /*添加事件*/
        //切换准备加入场景
        this.model.addEventListener(BaseModel.GAME_SCENE_prepare+"",this.addPrepareScene,this);
        //切换等待场景
        this.model.addEventListener(BaseModel.GAME_SCENE_waiting+"",this.addWaitScene,this);
        //切换游戏场景
        this.model.addEventListener(BaseModel.GAME_SCENE_playing+"",this.addPlayingScene,this);
        //刷新场景
        this.model.currentScene=BaseModel.GAME_SCENE_cutScene;
        //初始数据 2.1.4修改
        if(!BaseModel.PLAYBACK_MODEL)this.model.updateGameInfo();
        else {
            //增加全屏遮罩
            this.playbackView=new PlaybackView(this.model.playbackModel);
            this.addChild(this.playbackView);
            this.addPlayingScene();
        }
    }
    /*----------------------场景-----------------------*/
    /*添加准备个场景*/
    protected addPrepareScene(){
        MyConsole.getInstance().trace("游戏内部场景---2切换等待玩家阶段",2);
        this.clearScene();
        this.prepareScene=new PrepareScene(this.model.backLayerModel);
        this.addChildAt(this.prepareScene,1);
        this.updateGameView();
        //顯示按鈕
        this.prepareScene.addBtns();
        //隐藏风向
        this.backgroundView.setWindView(false);
    }
    /*添加游戏中打牌个场景*/
    protected addPlayingScene(){
        MyConsole.getInstance().trace("游戏内部场景---2切换打牌阶段",2);
        this.clearScene();
        /*跑马灯，三遍之后取消*/
        this.backgroundUpView.noticeView.visible = true;
        this.backgroundUpView.noticeView.setTextByTimes(this.model.backLayerModel.userGroupModel.numIdGetUserModel(1).notice,3);
        this.playingScene=new PlayingScene(this.model.playingModel);
        this.addChildAt(this.playingScene,1);

        this.updateGameView();
        //风向
        this.backgroundView.setWindView(true);
        //ip冲突
        this.backgroundView.hideIPSame();
        this.playingScene.ipSameTips();
        //发牌动画
        this.playingScene.startLicensingAnimation();
    }
    /*等待下一局准备场景*/
    protected addWaitScene(){
        MyConsole.getInstance().trace("游戏内部场景---3切换等待下局开始阶段",2);
        this.clearScene();
        this.waitScene=new WaitScene(this.model.backLayerModel);
        this.addChildAt(this.waitScene,1);
        this.updateGameView();
        //风向
        this.backgroundView.setWindView(true);
    }
    /*断线重连 统一更新一次数据*/
    protected updateGameView(){
        //数据统一更新视图 2.1.4 修改*/
        if(!BaseModel.PLAYBACK_MODEL)this.model.updateGameInfo();
        else this.model.updateGamePlaybackInfo();
        //统一更新一次玩家头像信息
        this.model.userGroupModel.updateBaseInfo();
    }
    /*清空场景*/
    protected clearScene(){
        this.removeScene(this.playingScene);/*准备场景*/
        this.removeScene(this.prepareScene);/*打牌场景*/
        this.removeScene(this.waitScene);/*等待场景*/
        this.playingScene=this.prepareScene=this.waitScene=null;
    }
    /*移除一个场景*/
    protected removeScene(scene:GameBaseScene){
        if(scene){
            scene.clear();
            this.removeChild(scene);
            scene=null;
        }
    }
    /*-----------------------解散房间-------------------------*/
    public clear(){
        super.clear();
        //切换准备加入场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_prepare+"",this.addPrepareScene,this);
        //切换等待场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_waiting+"",this.addWaitScene,this);
        //切换游戏场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_playing+"",this.addPlayingScene,this);
        this.backgroundView.clear();
        this.backgroundUpView.clear();
        this.clearScene();
    }
}