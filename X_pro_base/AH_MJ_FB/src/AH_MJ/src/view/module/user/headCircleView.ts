/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_Game_headCirceView extends BaseView{


    protected headSp:egret.Sprite;
    protected headImg:egret.Bitmap;
    public constructor(){
        super();
        this.headSp=new egret.Sprite();
        this.addChild(this.headSp);
        //有头像的情况
        //头像的基准大小
        var headImgBase=this.CCenterBit("h_headerBg");
        /*头像*/
        this.headImg=new egret.Bitmap();
        this.headSp.addChild(this.headImg);
        this.headImg.width=headImgBase.width;
        this.headImg.height=headImgBase.height;
        this.headImg.anchorOffsetX=this.headImg.width/2;
        this.headImg.anchorOffsetY=this.headImg.height/2;
        //玩家头像遮罩
        var maskSp1=new egret.Shape();
        maskSp1.graphics.beginFill(0x00ff00);
        // maskSp1.graphics.drawCircle(0,0,headImgBase.width/2);
        maskSp1.graphics.drawRoundRect(-headImgBase.width/2 ,-headImgBase.height/2 , headImgBase.width,headImgBase.height,16);
        maskSp1.graphics.endFill();
        this.headSp.addChild(maskSp1);
        this.headImg.mask=maskSp1;
    }
    /*更新头像信息  headImgUrl为空隐藏头像*/
    public setHead(headImgUrl=null){
        if(headImgUrl){
            LoadLayer.getInstance().loadExternalBit(this.headImg,headImgUrl);
        }
    }
}