/**
 * Created by 韩 on 2017/7/11.
 * 加入游戏弹框
 */
class AH_H_joinRoomView extends PopupBaseView{
    protected NumberBtn:Array<any> = ["1","2","3","4","5","6","7","8","resetBtn","9","0","delBtn"];
    protected NumberArr:Array<egret.TextField> = [];
    protected inputStr="";
    protected roomNumBg:egret.Bitmap;
    public constructor(){
        super();
        var bg:egret.Bitmap = this.addMsgBg(Main.stageWidth*.6,Main.stageHeight*.65);//"b_p_bg",
        // var x = bg.width-35;
        // var y = 7;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_joinRoom_title",this.centerSp.width/2,45);
        this.roomNumBg = new egret.Bitmap(RES.getRes("h_roomNumBg"));
        this.roomNumBg.x = 65;
        this.roomNumBg.y = 85;
        this.centerSp.addChild(this.roomNumBg);

        this.openAni();
        var i = -1;
        for (var btn of this.NumberBtn){
            i++;

            var buttonG = new H_joinRoomNumBtn(btn);
            buttonG.x = 150+i%4*125;
            buttonG.y = bg.height*0.45 +Math.floor(i/4)*80;

            buttonG.addTouchEvent();
            buttonG.addEventListener("click",this.numBtnClick,this);
            this.centerSp.addChild(buttonG);
        }
        this.createNum(bg);
    }
    protected numBtnClick(e){
        var str=e.target.num;
        switch(str){
            case "resetBtn":
                this.inputStr="";
                break;
            case "delBtn":
                this.inputStr=this.inputStr.slice(0,this.inputStr.length-1);
                break;
            default:
                if(this.inputStr.length<=5)
                this.inputStr+=str;
                break;
        }
        this.setTxtNum();
    }
    protected setTxtNum(){
        for(var i in this.NumberArr){
            this.NumberArr[Number(i)].text="";
            if(this.inputStr.length-1>=Number(i)){
                this.NumberArr[Number(i)].text=this.inputStr.slice(Number(i),Number(i)+1);
            };
        }
        if(this.inputStr.length==6){
            BaseModel.getInstance().eventRadio("joinRoom",{roomSn:this.inputStr});
            this.inputStr = "";
            this.setTxtNum();
        }
    }
    protected createNum(bg){
        for (var i = 0;i < 6 ;i++){
            var numberBg = new egret.Bitmap(RES.getRes("h_num_downBar"));
            numberBg.x = 136+74*i;
            numberBg.y = 135;
            this.centerSp.addChild(numberBg);

            var numberText = new egret.TextField();
            numberText.width = 60;
            numberText.height = 60;
            // numberText.textColor = 0x543016;
            numberText.size = 40;
            numberText.textAlign = "center";
            numberText.fontFamily = "微软雅黑";
            numberText.verticalAlign = "middle";
            numberText.x = numberBg.x-numberBg.width/2+3;
            numberText.y = 85;
            this.centerSp.addChild(numberText);
            this.NumberArr.push(numberText);
        }
    }
}