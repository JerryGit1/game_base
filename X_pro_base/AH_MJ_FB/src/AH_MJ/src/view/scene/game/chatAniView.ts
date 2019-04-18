/**
 * Created by TYQ on 2017/7/22.
 */
class AH_ChatAniView extends BaseView{
    private texts = [
        "大家好，很高兴见到各位",
        "各位真不好意思啊，我要离开一会",
        "和你合作真是太愉快了",
        "你的牌打的也太好了",
        "快点啊，都等得我花儿都谢了"
    ];
    protected model:UserModel;
    protected face:egret.Bitmap;
    protected phoneTxt:egret.TextField;
    protected bg:egret.Bitmap;
    public constructor(model){
        super();
        this.bg=this.CCenterBit("g_chat_grayBg");
        this.addChild(this.bg);
        this.bg.alpha=0;

        this.model = model;
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_chatStatus,this.playAni,this);
    }
    //播动画
    public playAni(e){
        var data = e.data;
        data.type=Number(data.type);
        if(data.type == 1){
            this.bg.alpha=0;
            if(!this.face){
                this.addFaceAni();
            }
            this.playFaceAni(Number(data.idx),data.point);

        }else if(data.type == 2){
            this.bg.alpha=1;
            if(!this.phoneTxt){
                this.addTextAni();
            }
            this.playTextAni(Number(data.idx),data.point);
        }else if(data.type == 4){
            //下载语音
            if(data["local"]){//本地语音
                downOk(data.idx,data.userId);
            }else{
                WeiXinJSSDK.getInstance().downloadVoice(data.idx,data.userId,downOk);
            }
        }
        function downOk(localId,userId){
            //播放音频
            WeiXinJSSDK.getInstance().playVoice(localId,userId);
            //播放动画
        }
    }
    //表情
    protected addFaceAni(){
        var face=new egret.Bitmap();
        this.addChild(face);
        face.alpha=0;
        this.face = face;
    }
    //文字
    public addTextAni(){
        var phoneTxt=new egret.TextField();
        phoneTxt.size=24;
        phoneTxt.textColor=0xffffff;
        phoneTxt.height=this.bg.height;
        phoneTxt.textAlign="left";
        phoneTxt.verticalAlign="middle";
        phoneTxt.multiline=true;
        phoneTxt.fontFamily="微软雅黑";
        phoneTxt.text=this.texts[0];
        phoneTxt.stroke = 2;
        phoneTxt.alpha=0;
        this.phoneTxt = phoneTxt;
        this.addChild(phoneTxt);
    }
    protected updatePos(point){
        var x = point.x+100;
        var y = point.y-14;
        if(point.x >Main.stageWidth/2){
            if(this.face) this.face.x = point.x -86;
            if(this.phoneTxt) {
                this.bg.x = point.x-this.bg.width/2-40;
                this.phoneTxt.x = this.bg.x;
            }
        }else{
            if(this.face) {
                this.face.x = x-this.face.width/2+20;
            }
            if(this.phoneTxt){
                this.bg.x = point.x+this.bg.width/2+40;
                this.phoneTxt.x = this.bg.x;
            }
        }
        //设置Y
        if(this.face){
            this.face.y = y+12;
            this.face.anchorOffsetX=this.face.width/2;
            this.face.anchorOffsetY=this.face.height/2;
        }
        if(this.phoneTxt) {
            this.bg.y = y;
            this.phoneTxt.y = this.bg.y-8;
            this.bg.anchorOffsetX = this.bg.width/2;
            this.bg.anchorOffsetY = this.bg.height/2;
            this.phoneTxt.anchorOffsetX = this.phoneTxt.width/2;
            this.phoneTxt.anchorOffsetY = this.phoneTxt.height/2;
        }

        if(point.x >Main.stageWidth/2){
            this.bg.scaleX = -1;
        }else{
            this.bg.scaleX = 1;
        }
    }
    protected playFaceAni(num,point){
        this.face.texture=RES.getRes("game_face"+num);
        this.updatePos(point);
        this.visible = true;
        egret.Tween.removeTweens(this.face);
        egret.Tween.get(this.face).to({alpha:1},300).to({scaleY:.9,scaleX:1.05},300).to({scaleY:.9},70)
            .to({scaleY:1.1,scaleX:.95},100).to({scaleY:1,scaleX:1},90)
            .to({scaleY:.9},50).to({scaleY:1.08,scaleX:.97},100)
            .to({scaleY:1,scaleX:1},100).wait(1500).to({alpha:0},300).call(function () {
            this.visible = false;
        },this);
    }
    protected playTextAni(num,point){
        this.phoneTxt.text = this.texts[num-1];
        this.bg.scale9Grid = new egret.Rectangle(39,10,182,46);
        this.bg.width = this.phoneTxt.width+20;
        this.updatePos(point);
        this.visible = true;
        // 增加语音 hyh
        SoundModel.stopAllBackEffect();
        if(num==12){
            SoundModel.playSoundEffect("g_chat_sp"+num);
        }else{
            if(this.model.gender==1){
                SoundModel.playSoundEffect("b_chat_sp"+num);
            }else{
                SoundModel.playSoundEffect("g_chat_sp"+num);
            }
        }

        egret.Tween.removeTweens(this.phoneTxt);
        egret.Tween.get(this.phoneTxt).to({alpha:1},100).wait(1500).to({alpha:0},100).call(function () {
            this.visible = false;
        },this);
    }

    public clear(){
        super.clear();
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_chatStatus,this.playAni,this);
    }
}