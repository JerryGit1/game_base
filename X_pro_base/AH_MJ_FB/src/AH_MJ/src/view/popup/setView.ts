/**
 * Created by 韩 on 2017/7/10.
 * 设置弹窗
 */
class AH_H_serView extends PopupBaseView{
    protected type:string;
    protected model:Game_RoomInfoModel;
    protected closeGameBtn:MyButton;
    protected quitRoomBtn:MyButton;
    public constructor(type,roomInfoModel){
        super();
        this.type = type;
        this.model = roomInfoModel;
        var bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*.6,Main.stageHeight*0.55);//"b_p_hitBg",
        // var x = bg.width - 27;
        // var y = 7;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_set_title2",this.centerSp.width/2,45);

        //================音效开关
        var switchBtn=new EffectSoundBtn("h_sound_title","h_voice_on","h_voice_off");
        this.centerSp.addChild(switchBtn);
        switchBtn.x=136;
        switchBtn.y=106;

        //==============音乐开关
        var switchBtn1=new BgSoundBtn("h_music_title","h_music_on","h_music_off");
        this.centerSp.addChild(switchBtn1);
        switchBtn1.x=switchBtn.x;
        switchBtn1.y=switchBtn.y+84;

        // 退出游戏 or 解散房间
        var self = this;
        if(this.type == "dating"){
            this.closeGameBtn = new MyButton("b_p_setup_quitGame");
            this.closeGameBtn.x = bg.width/2;
            this.closeGameBtn.y = bg.height-this.closeGameBtn.height-10;
            this.closeGameBtn.addTouchEvent();
            this.closeGameBtn.addEventListener("click",function () {
                self.closeClick();
                BaseModel.getInstance().eventRadio("quitGame");
            },this);
            this.centerSp.addChild(this.closeGameBtn);
        }else{
            this.quitRoomBtn = new MyButton("h_closeGame");
            this.quitRoomBtn.x = bg.width/2;
            this.quitRoomBtn.y = bg.height-this.quitRoomBtn.height-10;
            this.quitRoomBtn.addTouchEvent();
            this.quitRoomBtn.addEventListener("click",function () {
                //发起解散房间
                AH_statisticService.getInstance().dissolveRoomTimes();
                BaseModel.getInstance().eventRadio("sponsorGameKillRoom");
                self.closeClick();
            },this);
            this.centerSp.addChild(this.quitRoomBtn);
        }
        this.openAni();
    }
}