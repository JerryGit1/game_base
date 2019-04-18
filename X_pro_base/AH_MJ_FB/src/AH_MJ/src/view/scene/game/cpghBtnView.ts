/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
class AH_Game_cpghBtnView extends BaseView{

    protected btnY=Main.stageHeight-BaseModel.USER_CARD_WIDTH*3;
    /*当前要吃碰杠胡的 那一张牌*/
    public cActionCardModel:CardModel;
    /*多个牌组合选择时 当前选择的model*/
    protected cGroupModel:CpghBtnModel;
    /*过的model要用到多次临时保存一哈*/
    protected guoModel:CpghBtnModel;
    public constructor(){
        super();
        this.graphics.beginFill(0x00ff00,0);
        this.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        this.graphics.endFill();
        this.touchEnabled=true;
    }
    /*显示吃碰杠胡按钮*/
    public addBtnList(list:Array<CpghBtnModel>){
        this.clearPage();
        var x = Main.stageWidth-70 - list.length*100,vy = Main.stageHeight-BaseModel.USER_CARD_WIDTH*2.1;
        for(var i in list){
            var btn=new Game_cpghBtn(list[i]);
            btn.x=x;
            if(Number(i)==list.length-1)btn.x+=20;
            btn.y=vy+btn.height/2;
            btn.alpha=0;
            x+=100;
            this.addChild(btn);
            /*出场动画*/
            egret.Tween.get(btn).wait(Number(i)*130).to({y:vy-10,alpha:1},300).to({y:vy},120).call(function (btn) {
                btn.addTouchEvent();
            },this,[btn]);
            /*事件*/
            btn.addEventListener("click",this.btnClick,this);
            /*存一哈过得数据 多个吃选择时用*/
            if(list[i].type==0){
                this.guoModel=list[i];
            }
        }
    }
    /*点击吃碰杠胡操作按钮*/
    protected btnClick(e:egret.Event){
        var btn:Game_cpghBtn=e.currentTarget;
        this.clearPage();
        if((btn.model.type==1 || btn.model.type==3)&&btn.model.cardList){
            //多个吃选择 && 添加多个杠的选择
            this.addMoreChiCardGroup(btn.model);
        }else{
            //选择成功
            this.visible=false;
            BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk,btn.model);
        }
    }
    /*显示多个吃or杠选择*/
    protected addMoreChiCardGroup(model:CpghBtnModel){
        var w=BaseModel.USER_CARD_WIDTH*.7,x=(Main.stageWidth-model.cardList.length*w*3)/2,i,vy=this.btnY,chiView;
        this.cGroupModel=model;
        for(i in model.cardList){
            chiView=new Game_chiCardGroupView(model.cardList[i],this.cActionCardModel,BaseModel.USER_CARD_WIDTH*.7,model.type);
            this.addChild(chiView);
            chiView.x=x;
            chiView.y=vy+chiView.h/2;
            x+=chiView.w+14;/*间隔*/
            chiView.addEventListener(egret.TouchEvent.TOUCH_TAP,this.chooseChiGroupOk,this);
        }
        /*显示取消按钮*/
        var clearBtn=new Game_cpghBtn(this.guoModel,"g_cpghBtn_0");
        clearBtn.x=x+clearBtn.width/2+10;
        clearBtn.y=vy+clearBtn.height/2+5;
        this.addChild(clearBtn);
        clearBtn.addTouchEvent();
        clearBtn.addEventListener("click",this.btnClick,this);

    }
    /*多个吃选择完毕*/
    protected chooseChiGroupOk(e:egret.Event){
        var btn:Game_chiCardGroupView=e.currentTarget;
        this.clearPage();
        /*设置吃的数据*/
        this.cGroupModel.setChiJsonStr(btn.list);
        //选择成功
        this.visible=false;
        BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk,this.cGroupModel);
    }
    /*清空页面*/
    protected clearPage(){
        var len=this.numChildren;
        for(var i=0;i<len;i++){
            this.removeChildAt(0);
        }
    }
}