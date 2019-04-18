/**
 * Created by TYQ on 2017/7/10.
 */
class AH_MaxSettlementView extends PopupBaseView{
    protected leaveBtn:MyButton;
    protected shareBtn:MyButton;//分享按钮
    protected currentId;
    protected roomId;
    public constructor(data=null,currentId,roomId){
        super(false);
        var maskShape = new egret.Shape();
        maskShape.graphics.beginFill(0x211f1f,2);
        maskShape.graphics.drawRect(0,0,Main.stageWidth,Main.stageHeight);
        maskShape.graphics.endFill();
        this.addChildAt(maskShape,1);

        this.currentId = currentId;
        this.roomId = roomId;
        this.addTitle("g_settle_winTitleBg",Main.stageWidth/2,2);
        this.addSettleBg(1136,530);
        this.addTitle("g_settle_max_title",this.centerSp.width/2,-14);
        this.initContentInfo(data);
        this.addBtns(data);
        this.addOtherInfo();//添加 房间号、logo、时间
    }
    //离开 or 分享按钮
    protected addBtns(data){
        this.leaveBtn = new MyButton("g_settle_leaveBtn");
        this.centerSp.addChild(this.leaveBtn);
        this.leaveBtn.addTouchEvent();
        this.leaveBtn.addEventListener("click",this.leaveBtnClick,this);
        // this.leaveBtn.x=this.centerSp.width/2-120;
        this.leaveBtn.x = Main.stageWidth/2-104;
        this.leaveBtn.y=this.centerSp.y+206;
        // this.leaveBtn.y= Main.stageHeight-this.leaveBtn.height/2-16;

        //设置分享
        var userList = data.slice(0);
        userList = userList.sort(this.compare("score"));
        BaseModel.getInstance().eventRadio("settlementShare",userList);

        this.shareBtn = new MyButton("g_settlement_Share",1);
        this.centerSp.addChild(this.shareBtn);
        this.shareBtn.addTouchEvent();
        this.shareBtn.addEventListener("click",function (e) {
            PopupLayer.getInstance().addShareView();
        },this);
        // this.shareBtn.x = this.centerSp.width/2+80;
        this.shareBtn.x = Main.stageWidth/2+96;
        // this.shareBtn.y = this.centerSp.y+206;
        this.shareBtn.y = this.leaveBtn.y;
    }
    protected leaveBtnClick(){
        this.dispatchEvent(new egret.Event("close"));
        //切换到大厅界面
        BaseModel.getInstance().eventRadio("settlement_waitOk","max");
    }
    protected initContentInfo(userInfos){
        var huNum = userInfos.slice(0).sort(this.compare("score"))[0];//得分最多的玩家
        var dianNum = userInfos.slice(0).sort(this.compare("dianNum"))[0];//点炮最多的玩家
        for(var i:number=0;i<4;i++){
            if(userInfos[i].dianNum>0&&userInfos[i].dianNum==dianNum.dianNum && userInfos[i].score ==huNum.score){
                var settleView:MaxSettleInfoView = new MaxSettleInfoView(userInfos[i],this.currentId,3);//既是最佳炮手又是大赢家
            }else if(userInfos[i].dianNum>0&&userInfos[i].dianNum==dianNum.dianNum){
                var settleView:MaxSettleInfoView = new MaxSettleInfoView(userInfos[i],this.currentId,2);//点炮小能手
            }else if(userInfos[i].huNum>0&&userInfos[i].score == huNum.score){
                var settleView:MaxSettleInfoView = new MaxSettleInfoView(userInfos[i],this.currentId,1);//大赢家
            }else{
                var settleView:MaxSettleInfoView = new MaxSettleInfoView(userInfos[i],this.currentId,0);//啥也没
            }
            settleView.x = 180+264*i;
            this.centerSp.addChild(settleView);
            //分割线
            if(i<3){
                var line = new egret.Bitmap(RES.getRes("g_maxSettle_line"));
                line.x = 308+264*i;
                this.centerSp.addChild(line);
            }
        }
    }
    //添加 房间号、logo、时间
    protected addOtherInfo(){
        //房间号
        var roomIdText = new egret.TextField();
        roomIdText.x=26;
        roomIdText.y=-80;
        roomIdText.textColor = 0xffffff;
        roomIdText.multiline = true;
        roomIdText.fontFamily = "微软雅黑";
        roomIdText.size = 24;
        this.centerSp.addChild(roomIdText);
        roomIdText.text="房间号:"+this.roomId;
        //logo
        var logoSp = new egret.Bitmap(RES.getRes("g_maxSettle_sign"));
        logoSp.x = 945;
        logoSp.y = -74;
        this.centerSp.addChild(logoSp);
        //时间
        var nowDate = new Date().getTime();
        var date  = new egret.TextField();
        date.size = 20;
        date.textAlign = "left";
        date.verticalAlign = "middle";
        date.text =this.getTime(nowDate);
        date.x = 900;
        date.y = 540;
        date.textColor = 0xfafafa;
        this.centerSp.addChild(date);
    }
    // 格式化时间
    protected getTime(date){
        let dateTime = new Date(date);
        let year = dateTime.getFullYear();
        let month = this.addPreZero(dateTime.getMonth()+1);
        let day = this.addPreZero(dateTime.getDate());

        let hours = this.addPreZero(dateTime.getHours());
        let minutes = this.addPreZero(dateTime.getMinutes());
        let seconds = this.addPreZero(dateTime.getSeconds());
        let createTime = year + "-" +month + "-" + day + "   " + hours + ":" + minutes+":"+seconds;
        return createTime;
    }
    // 补零方法
    protected addPreZero(num){
        if(num<10){
            return '0'+num;
        }else {
            return num;
        }
    }
    public compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        }
    }

    public clear(){
        super.clear();
        this.leaveBtn.clear();
        this.leaveBtn.removeEventListener("click",this.leaveBtnClick,this);
    }
}