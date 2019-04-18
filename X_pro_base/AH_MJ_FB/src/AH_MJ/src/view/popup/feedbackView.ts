/**
 * Created by 韩 on 2017/7/11.
 * 反馈弹窗
 */
class AH_H_feedbackView extends PopupBaseView{
    protected textBoxBg:egret.Bitmap;
    protected text:egret.TextField;
    protected telTileBg:egret.Bitmap;
    protected telText:egret.TextField;
    protected telbg:egret.Bitmap;
    protected submit:MyButton;
    public constructor(){
        super();
        var bg:egret.Bitmap = this.addMsgBg(null,Main.stageHeight*.7);//"b_p_hitBg"
        // var x = bg.width - 70;
        // var y = 6;
        var x = bg.width-7;
        var y = 5;
        this.addCloseBtn(x,y,"b_p_closeBtn");
        this.addTitle("h_set_title");
        this.addTitle("h_feedback_title");

        this.textBoxBg = new egret.Bitmap(RES.getRes("h_textBoxBg"));
        this.textBoxBg.x = bg.width/2 - this.textBoxBg.width/2;
        this.textBoxBg.y = 85;
        this.centerSp.addChild(this.textBoxBg);

        this.telTileBg = new egret.Bitmap(RES.getRes("h_telTileBg"));
        this.telTileBg.x = 62 ;
        this.telTileBg.y = bg.height - this.telTileBg.height*4;
        this.centerSp.addChild(this.telTileBg);

        this.text = new egret.TextField();
        this.text.type = egret.TextFieldType.INPUT;
        this.text.	lineSpacing = 10;
        this.text.multiline = true;
        this.text.wordWrap = true;
        this.text.width = bg.width*.8;
        this.text.height = bg.height*.4;
        this.text.scrollV = 1;
        this.text.fontFamily = "微软雅黑";
        this.text.textColor = 0xEDB321;
        this.text.size = 20;
        this.text.x = 100;
        this.text.y = 99;
        this.text.text = "请输入您的意见和建议......";
        this.text.addEventListener(egret.FocusEvent.FOCUS_IN,function () {
            if (this.text.text=="请输入您的意见和建议......"){
                this.text.text = ""
            }else {
                this.text.text = this.text.text;
            }
        },this);
        this.centerSp.addChild(this.text);

        this.telbg = new egret.Bitmap(RES.getRes("h_telbg"));
        // this.telbg.anchorOffsetX = this.telbg.width/2;
        // this.telbg.anchorOffsetY = this.telbg.height/2;
        this.telbg.x = 215;
        this.telbg.y = this.telTileBg.y -  this.telTileBg.height/2;
        this.centerSp.addChild(this.telbg);
        this.telText = new egret.TextField();
        this.telText.type = egret.TextFieldType.INPUT;
        this.telText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.telText.restrict = "0-9";
        this.telText.x = 223;
        this.telText.y = this.telbg.y+6;
        this.telText.width = 280;
        this.telText.height = 45;
        this.telText.bold = true;
        this.telText.fontFamily = "微软雅黑";
        this.telText.textColor = 0xEDB321;
        this.telText.size = 20;
        this.telText.maxChars = 13;
        this.telText.text = "请输入您的手机号码";
        this.telText.addEventListener(egret.FocusEvent.FOCUS_IN,function () {
            if (this.telText.text=="请输入您的手机号码"){
                this.telText.text = ""
            }
        },this);
        this.centerSp.addChild(this.telText);

        this.submit = new MyButton("h_submit");
        this.submit.x = bg.width - this.submit.width/2 - 60;
        this.submit.y = this.telText.y + this.submit.height/4;
        this.submit.addTouchEvent();
        this.submit.addEventListener("click",function () {
            //关闭弹窗
            this.closeClick();
            var txt = this.text.text;
            var phoneNumber = this.telText.text;
            var data = {"content":txt,"tel":phoneNumber};
            if (txt.length>50){
                PopupLayer.getInstance().addHintView("字数不得超过50个",null,true,"min");
                return false;
            }else if(txt.length==0||txt=="请输入您的意见和建议......"){
                PopupLayer.getInstance().addHintView("请输入文字！！",null,true,"min");
                return false;
            };
            if (!phoneNumber.match(/^1[34578]\d{9}$/)){
                PopupLayer.getInstance().addHintView("请填写正确的手机号码！！",null,true,"min");
                return false;
            }
            BaseModel.getInstance().eventRadio("getFeedback",data);

        },this);
        this.centerSp.addChild(this.submit);
        this.openAni();
    }
}
