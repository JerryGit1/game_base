/**
 * Created by 伟大的周鹏斌大王 on 2017/7/24.
 *
 * 发送语音视图
 */
class AH_Game_recordView extends PopupBaseView{
    public w:number;
    protected txt:egret.TextField;
    protected timer:egret.Timer;
    protected spList=[];
    public constructor(){
        super();
        var bg=this.CCenterBit("g_voiceBtn",true),vx,vy;
        this.addChild(bg);
        this.w=bg.width*2;
        vx=0;
        vy=0;

        this.graphics.beginFill(0x333333,.8);
        this.graphics.lineStyle(1,0x111111,.9);
        this.graphics.drawRoundRect(vx,vy,this.w,this.w,20,20);
        this.graphics.endFill();
        this.touchEnabled=true;
        bg.x=this.w/2+vx;
        bg.y=this.w-bg.width/2-10+vy;

        this.txt=new egret.TextField();
        this.txt.width=this.w;
        this.txt.textAlign="center";
        this.txt.size=20;
        this.txt.textColor=0xeeeeee;
        this.txt.y=30+vy;
        this.txt.x=vx;
        this.txt.text='1"';
        this.addChild(this.txt);

        var h=20,sh;
        for(var i=0;i<5;i++){
            sh=this.addSH(h);
            sh.x=this.w/2-20-10*i+vx;
            sh.y=this.txt.y+h/2;
            this.addChild(sh);
            egret.Tween.get(sh,{loop:true}).to({scaleY:Math.random()-.1},Math.floor(Math.random()*200+200)).to({scaleY:1},Math.floor(Math.random()*200+200));
        }
        for(i=0;i<5;i++){
            sh=this.addSH(h);
            sh.x=this.w/2+20+10*i+vx;
            sh.y=this.txt.y+h/2;
            this.addChild(sh);
            this.spList.push(sh);
            egret.Tween.get(sh,{loop:true}).to({scaleY:Math.random()},Math.floor(Math.random()*200+200)).to({scaleY:1},Math.floor(Math.random()*200+200));
        }

        //开始计时
        this.timer=new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        this.timer.start();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        //开始录音
        WeiXinJSSDK.getInstance().startRecord();
    }
    /*计时*/
    protected onTimer(e:egret.TimerEvent){
        this.txt.text=(this.timer.currentCount+1)+'"';
        if(this.timer.currentCount>=15){
            this.stop();
        }
    }
    /*创建条*/
    protected addSH(h){
        var sh=new egret.Shape();
        sh.graphics.beginFill(0x1296DB);
        sh.graphics.drawRect(0,-h/2,3,h);
        sh.graphics.endFill();
        this.spList.push(sh);
        return sh;
    }
    /*点击*/
    protected onTap(e:egret.TouchEvent){
        this.dispatchEvent(new egret.Event("close"));
    }
    /*停止录音*/
    public stop(){
        if(this.timer.currentCount>=3){
            //停止录音
            WeiXinJSSDK.getInstance().stopRecord(1);
            this.onTap(null);
            return true;
        }else{
            PopupLayer.getInstance().floatAlert("请按住3秒以上");
        }
        this.onTap(null);
        return false;
    }
    public clear(){
        //停止录音
        WeiXinJSSDK.getInstance().stopRecord(null);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.timer.stop();
        this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
        this.timer=null;
        for(var i in this.spList){
            egret.Tween.removeTweens(this.spList[i]);
        }
    }
}
