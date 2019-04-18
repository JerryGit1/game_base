import Shape = egret.Shape;
/**
 * Created by 韩 on 2017/7/11.
 * 创建房间弹框
 */
class AH_H_createRoomView extends PopupBaseView{
    // 游戏模式
    protected gameModel:egret.Bitmap;
    protected gameModelTitle:egret.Bitmap;
    protected gameModeled:H_radioAreaView;
    //游戏局数
    protected circleNum;
    protected checkoutBox:egret.Bitmap;
    protected checkoutBoxed:H_radioAreaView;
    //封顶分数
    protected maxScoreTile:egret.Bitmap;
    protected maxScore:H_radioAreaView;

    protected sure:MyButton;
    protected bg:egret.Bitmap;

    public constructor(){
        super();
        this.initContent();
    }
    protected initContent(){
        this.initBg();
        this.initCheckOutBoxes();
        this.initCheckOutContent();
        this.addBtn();
    }
    //背景框
    protected initBg(){
        this.bg = this.addMsgBg(Main.stageWidth*.7,Main.stageHeight*.7);//"b_p_bg",
        // var x = bg.width-30;
        // var y = 7;
        var x = this.bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_createRoom_title",this.centerSp.width/2,45);
        this.openAni();
    }
    //实例化可选框
    protected initCheckOutBoxes(){
        this.createCheckoutbox(216,114);
        this.createCheckoutbox(380,114);
        this.createCheckoutbox(554,114);

        this.createCheckoutbox(216,198);
        this.createCheckoutbox(380,198);

        this.createCheckoutbox(216,284);
        this.createCheckoutbox(380,284);
    }
    //实例化可选内容
    protected initCheckOutContent(){
        // 局数
        this.gameModel = new egret.Bitmap(RES.getRes("h_circleNum"));
        this.gameModel.x = 66;
        this.gameModel.y = 110;
        this.centerSp.addChild(this.gameModel);
        var msg = {"group":"circleNum","arr":{"2":[true,"",216,this.gameModel.y-8,90,40,"h_circleNum_2"],"4":[false,"",380,this.gameModel.y-8,90,40,"h_circleNum_4"],"8":[false,"",552,this.gameModel.y-8,90,40,"h_circleNum_8"]}};
        this.checkoutBoxed = new H_radioAreaView(msg);
        this.centerSp.addChild(this.checkoutBoxed);
        // 模式
        /*"1":[true,"",210,this.gameModelTitle.y,90,40,"h_roomType_1"]   房主模式
         * ,"2":[false,"",374,this.gameModelTitle.y,90,40,"h_roomType_2"]  自由模式
         * */
        this.gameModelTitle = new egret.Bitmap(RES.getRes("h_roomType"));
        this.gameModelTitle.x = 66;
        this.gameModelTitle.y = 196;
        this.centerSp.addChild(this.gameModelTitle);
        var msg2;
        msg2 = {"group":"roomType","arr":{"1":[true,"",216,this.gameModelTitle.y-8,90,40,"h_roomType_1"],"2":[false,"",380,this.gameModelTitle.y-8,90,40,"h_roomType_2"]}};
        this.gameModeled = new H_radioAreaView(msg2);
        this.centerSp.addChild(this.gameModeled);
        // 封顶分数
        this.maxScoreTile = new egret.Bitmap(RES.getRes("h_maxScore"));
        this.maxScoreTile.x = 66;
        this.maxScoreTile.y = 282;
        this.centerSp.addChild(this.maxScoreTile);
        var msg3 = {"group":"maxScore","arr":{"20":[true,"",216,this.maxScoreTile.y-8,90,40,"h_maxScore_20"],"40":[false,"",380,this.maxScoreTile.y-8,90,40,"h_maxScore_40"]}};
        this.maxScore = new H_radioAreaView(msg3);
        this.centerSp.addChild(this.maxScore);
    }
    //确认按钮
    protected addBtn(){
        // 确定按钮
        this.sure = new MyButton("h_sureBtn");
        this.sure.x = this.bg.width/2;
        this.sure.y = (this.bg.height - this.sure.height)+10;
        this.sure.addTouchEvent();
        this.sure.addEventListener("click",function () {
            var circleNum = this.checkoutBoxed.currentValue;
            var roomType = this.gameModeled.currentValue;
            var maxScore = this.maxScore.currentValue;
            var data = {"circleNum":circleNum,"roomType":roomType,"maxScore":maxScore};
            BaseModel.getInstance().eventRadio("createRoom",data);
            //关闭弹窗
            this.closeClick();
        },this);
        this.centerSp.addChild(this.sure);
    }
    //创建可选框
    protected createCheckoutbox(x:number,y:number){
        this.checkoutBox = new egret.Bitmap(RES.getRes("b_p_checkoutBox"));
        this.checkoutBox.x = x;
        this.checkoutBox.y = y;
        this.centerSp.addChild(this.checkoutBox);
    }
}