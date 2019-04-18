/**
 * Created by TYQ on 2017/7/8.
 */
class AH_SettleInfoView extends BaseView{
    protected headView:Game_headView;
    protected contentBg:egret.Bitmap;
    protected winBg:egret.Bitmap;
    protected huIcon:egret.Bitmap;
    protected winIcon:egret.Bitmap;//大结算时
    protected nameT:egret.TextField;
    protected scoreT:egret.TextField;
    protected type:string="";
    public constructor(type:string=""){
        super();
        this.type = type;
        this.initBg();
    }
    protected initBg(){
        this.contentBg = this.CCenterBit("g_settle_contentBg");
        var rect:egret.Rectangle = new egret.Rectangle(18,18,3,3);
        rect.offset(rect.width/2,rect.height/2);
        this.contentBg.scale9Grid = rect;
        this.contentBg.width = 810;
        this.contentBg.height = 90;
        this.contentBg.anchorOffsetX = this.contentBg.width/2;
        this.contentBg.anchorOffsetY = this.contentBg.height/2;
        this.contentBg.x = this.contentBg.width/2;
        this.addChild(this.contentBg);

        if(this.type == "small"){
            this.winBg = this.CCenterBit("g_settle_isHu");
            this.winBg.scale9Grid = rect;
            this.winBg.width = 810;
            this.winBg.height = 90;
            this.winBg.anchorOffsetX = this.winBg.width/2;
            this.winBg.anchorOffsetY = this.winBg.height/2;
            this.winBg.x = this.winBg.width/2;
            this.winBg.visible = false;
            this.addChild(this.winBg);

            this.huIcon = this.CCenterBit("g_settle_huSign");
            this.huIcon.x = 626;
            this.huIcon.visible = false;
            this.addChild(this.huIcon);

            var scoreBtn:egret.Bitmap = this.CCenterBit("g_settle_scoreBtn");
            scoreBtn.x = 700;
            this.addChild(scoreBtn);
        }

        this.initSettleInfo();

        if(this.type == "max"){
            this.winIcon = this.CCenterBit("g_settle_isWin");
            this.winIcon.x = 680;
            this.winIcon.visible = false;
            this.addChild(this.winIcon);

            var scoreBtn:egret.Bitmap = this.CCenterBit("g_settle_scoreBtn");
            scoreBtn.x = 400;
            this.addChild(scoreBtn);

            this.updateTextPosition();
        }
    }
    protected initSettleInfo(){
        //头像
        this.headView=new Game_headView();
        this.headView.x = 56;
        this.headView.scaleX = 0.8;
        this.headView.scaleY = 0.8;
        this.addChild(this.headView);
        //名字
        this.nameT = new egret.TextField();
        this.nameT.size = 20;
        this.nameT.textColor = 0xffffff;
        this.nameT.multiline = true;
        this.nameT.textAlign = "left";
        this.nameT.verticalAlign = "middle";
        this.nameT.stroke = 1;
        this.nameT.strokeColor = 0x000000;
        this.nameT.x = 120;
        this.nameT.y = -34;
        this.addChild(this.nameT);
        //得分
        this.scoreT = new egret.TextField();
        this.scoreT.size = 24;
        this.scoreT.textColor = 0xffffff;
        this.scoreT.multiline = true;
        this.scoreT.textAlign = "left";
        this.scoreT.verticalAlign = "middle";
        this.scoreT.stroke = 1;
        this.scoreT.strokeColor = 0x000000;
        this.scoreT.x = 730;
        this.scoreT.y = -12;
        this.addChild(this.scoreT);
    }
    protected updateTextPosition(){
        this.nameT.y = -12;
        this.scoreT.x = 430;
    }
    public updateSmallSettleInfo(data:any){
        this.winBg.visible = data.isWin;
        this.huIcon.visible = data.isWin;
        this.headView.setHead(data.userImg);
        this.nameT.text = data.userName;
        this.scoreT.text = data.winMoney;
        /*创建牌*/
        for(var i=0;i<data.currentPais.length;i++){
            var pai = data.currentPais[i];
            var name = "card"+pai[0]+"_"+pai[1];
            var card:egret.Bitmap = this.CCenterBit(name);
            card.scaleX = 0.35;
            card.scaleY = 0.35;
            card.anchorOffsetX = card.width/2;
            card.anchorOffsetY = card.height/2;
            card.x = 120+36*i;
            card.y = 15;
            this.addChild(card);
        }
    }

    public updateMaxSettleInfo(data:any){
        if(data.winMoney>0){
            this.winIcon.visible = true;
        }
        this.headView.setHead(data.userImg);
        this.nameT.text = data.userName;
        this.scoreT.text = data.winMoney;
    }
}