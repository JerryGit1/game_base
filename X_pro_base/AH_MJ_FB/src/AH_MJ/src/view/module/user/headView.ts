/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_Game_headView extends BaseView{
    protected headSp:egret.Sprite;
    protected headImgBg:egret.Bitmap;
    protected headImg:egret.Bitmap;
    protected HeadImgCover:egret.Bitmap;
    protected headImgHL:egret.Bitmap;
    protected mcAni:egret.MovieClip;//出牌头像动画
    protected networkSign:AH_NetWorkSign;
    public W=0;
    public constructor(isShow){
        super();
        /*默认头像*/
        this.headImgBg = this.CCenterBit("h_headerBg");
        this.addChild(this.headImgBg);
        this.addHead();
        if(!BaseModel.PLAYBACK_MODEL && isShow) this.addNetWorkSign();
    }
    /*显示头像*/
    protected addHead(){
        this.headSp=new egret.Sprite();
        this.addChild(this.headSp);
        /*边框*/
        var headImgHL = this.CCenterBit("headImgBar");
        headImgHL.width = this.headImgBg.width;
        headImgHL.height = this.headImgBg.height;
        headImgHL.anchorOffsetX=headImgHL.width/2;
        headImgHL.anchorOffsetY=headImgHL.height/2;
        this.headImgHL = headImgHL;
        /*头像*/
        this.headImg=new egret.Bitmap();
        this.headSp.addChild(this.headImg);
        this.headImg.width=headImgHL.width-10;
        this.headImg.height=headImgHL.width-10;
        this.headImg.anchorOffsetX=this.headImg.width/2;
        this.headImg.anchorOffsetY=this.headImg.height/2;
        //玩家头像遮罩
        var maskSp1=new egret.Shape();
        maskSp1.graphics.beginFill(0x00ff00,4);
        maskSp1.graphics.drawRoundRect(-this.headImg.width/2,-this.headImg.height/2,this.headImg.width,this.headImg.height,20,20);
        maskSp1.graphics.endFill();
        this.headSp.addChild(maskSp1);
        this.headImg.mask=maskSp1;

        /*出牌人动画*/
        var data = RES.getRes("headAni_json");
        var img = RES.getRes("headAni_png");
        var mcFactory1:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data,img);
        this.mcAni= new egret.MovieClip(mcFactory1.generateMovieClipData("headAni"));
        this.mcAni.visible = false;
        this.mcAni.frameRate = 14;
        this.mcAni.x = -this.mcAni.width/2;
        this.mcAni.y = -this.mcAni.height/2;
        this.addChild(this.mcAni);

        //头像蒙灰
        var headImgCover=this.CCenterBit("g_headCover");
        headImgCover.width = this.headImgBg.width;
        headImgCover.height = this.headImgBg.height;
        headImgCover.anchorOffsetX=headImgCover.width/2;
        headImgCover.anchorOffsetY=headImgCover.height/2;
        this.HeadImgCover = headImgCover;
        this.HeadImgCover.alpha=.8;
        this.HeadImgCover.visible=false;
        this.headSp.addChild(this.HeadImgCover);

        this.headSp.addChild(this.headImgHL);
    }
    /*更新头像信息  headImgUrl为空隐藏头像*/
    public setHead(headImgUrl=null){
        this.headSp.visible=false;
        if(headImgUrl){
            this.headImgBg.visible = false;
            this.headSp.visible=true;
            LoadLayer.getInstance().loadExternalBit(this.headImg,headImgUrl);
        }else{
            this.headImgBg.visible = true;
            this.setHighLight(false);
        }
    }
    /*离线状态切换*/
    public setOffLine(_is=false){
        if(!this.headSp)this.addHead();
        this.HeadImgCover.visible=_is;
    }
    /*出牌状态切换*/
    public setChuStatus(_is=false){
        if(_is){
            this.mcAni.visible = true;
            this.mcAni.play(-1);
        }else{
            this.mcAni.stop();
            this.mcAni.visible = false;
        }
    }
    public setHighLight(_is){
        this.headImgHL.visible = _is;
    }
    //网络质量标识
    protected addNetWorkSign(){
        var sign = new AH_NetWorkSign();
        this.networkSign = sign;
        sign.y = -54;
        // PopupLayer.getInstance().getPoint(sign);
        this.addChild(sign);
    }
    //更新网络质量
    public updateNetWork(info){
        this.networkSign.changeSign(info);
    }
    //网络质量标识是否可见
    public setNetWorkSign(_is){
        this.networkSign.visible = _is;
    }

}