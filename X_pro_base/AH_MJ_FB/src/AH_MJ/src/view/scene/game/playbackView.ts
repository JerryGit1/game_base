/**
 * 创建者 伟大的周鹏斌大王  on 2017/10/23.
 */
class AH_PlaybackView extends BaseView{
    protected model:PlaybackModel;
    private backSp:egret.Shape;
    protected isPlaying:boolean = true;
    protected stepTip:egret.TextField;
    protected speedBtns:Array<any> = [];
    public constructor(model){
        super();
        this.model = model;
        this.backSp=new egret.Shape();
        this.backSp.graphics.beginFill(0x00cc00,0);
        this.backSp.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        this.backSp.graphics.endFill();
        this.addChild(this.backSp);
        this.backSp.touchEnabled=true;

        var stepTip = new egret.TextField();
        stepTip.size = 16;
        stepTip.fontFamily = "微软雅黑";
        stepTip.textAlign = "left";
        stepTip.verticalAlign = "middle";
        stepTip.textColor = 0xfeaf45;
        stepTip.x = 20;
        stepTip.y = 60;
        this.stepTip = stepTip;
        this.addChild(this.stepTip);

        this.model.addEventListener("updateStep",this.updateStepTip,this);
        this.addBtns();
    }
    protected updateStepTip(){
        this.stepTip.text = "第"+this.model.circleNum+"局 ("+this.model.gameStepNum+"/"+this.model.allGameStepDataList.length+")";
    }
    protected addBtns(){
        var vx = Main.stageWidth-65;
        var vy = 50;
        //返回按钮
        var homeBtn = new MyButton("playBack_homeBtn");
        homeBtn.x = vx;
        homeBtn.y = vy;
        this.addChild(homeBtn);
        homeBtn.addTouchEvent();
        homeBtn.addEventListener("click",this.homeBtnClick,this);


        vy += 70;
        //暂停按钮
        var stopBtn = new MyButton("playBack_stopBtn");
        stopBtn.x = vx;
        stopBtn.y = vy;
        this.addChild(stopBtn);
        stopBtn.addTouchEvent();
        stopBtn.addEventListener("click",this.stopBtnClick,this);

        vy += 70;
        //一倍速
        var speedOneBtn = new MyButton("playBack_speed1_on");
        speedOneBtn.x = vx;
        speedOneBtn.y = vy;
        speedOneBtn["value"] = 1;
        this.addChild(speedOneBtn);
        speedOneBtn.addTouchEvent();
        speedOneBtn.addEventListener("click",this.speedOneBtnClick,this);
        this.speedBtns.push(speedOneBtn);

        vy += 70;
        //五倍速
        var speedFiveBtn = new MyButton("playBack_speed5");
        speedFiveBtn.x = vx;
        speedFiveBtn.y = vy;
        speedFiveBtn["value"] = 5;
        this.addChild(speedFiveBtn);
        speedFiveBtn.addTouchEvent();
        speedFiveBtn.addEventListener("click",this.speedFiveBtnClick,this);
        this.speedBtns.push(speedFiveBtn);

        vy += 70;
        //十倍速
        var speedTenBtn = new MyButton("playBack_speed10");
        speedTenBtn.x = vx;
        speedTenBtn.y = vy;
        speedTenBtn["value"] = 10;
        this.addChild(speedTenBtn);
        speedTenBtn.addTouchEvent();
        speedTenBtn.addEventListener("click",this.speedTenBtnClick,this);
        this.speedBtns.push(speedTenBtn);
    }
    //返回
    protected homeBtnClick(e){
        // if(this.model.gameStepNum != this.model.allGameStepDataList.length-1){
            this.model.pause();
            BaseModel.getInstance().eventRadio("playbackOver");
        // }else{
        //     MyConsole.getInstance().trace("已回放到最后！"+this.model.allGameStepDataList.length);
        // }
    }
    //暂停
    protected stopBtnClick(e){
        var btn:MyButton = e.currentTarget;
        if(!this.isPlaying){
            btn.changTexture("playBack_stopBtn");
            this.isPlaying = true;
            this.model.play();
        }else{
            btn.changTexture("playBack_playBtn");
            this.isPlaying = false;
            this.model.pause();
        }
    }
    //一倍速
    protected speedOneBtnClick(e){
        var btn = e.currentTarget;
        this.speedBtnsChangeTexture(btn);
        this.model.setSpeed(1000);
    }
    //五倍速
    protected speedFiveBtnClick(e){
        var btn = e.currentTarget;
        this.speedBtnsChangeTexture(btn);
        this.model.setSpeed(500);
    }
    //十倍速
    protected speedTenBtnClick(e){
        var btn = e.currentTarget;
        this.speedBtnsChangeTexture(btn);
        this.model.setSpeed(200);
    }
    //改变速度按钮纹理
    protected speedBtnsChangeTexture(btn){
        for(var i in this.speedBtns){
            var speed = this.speedBtns[i].value;
            if(speed != btn.value){
                this.speedBtns[i].changTexture("playBack_speed"+speed);
            }else{
                this.speedBtns[i].changTexture("playBack_speed"+speed+"_on");
            }
        }
    }
}