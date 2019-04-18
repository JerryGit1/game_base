/**
 * Created by TYQ on 2017/7/24.
 */
class AH_MaxSettleInfoView extends BaseView{
    public constructor(data,currentId,sealType){
        super();
        this.initSettleInfo(data,currentId,sealType);
    }
    protected initSettleInfo(data,currentId,sealType){
        //头像
        var headView=new Game_headView();
        headView.y = 140;
        headView.setHead(data.userImg);
        headView.setOffLine(false);
        headView.setHighLight(false);
        if(data.userId == currentId){
            // headView.setChuStatus(true);
            headView.setHighLight(false);
        }
        this.addChild(headView);
        //名字
        var nameT = new egret.TextField();
        nameT.size = 16;
        nameT.textColor = 0xffffff;
        nameT.multiline = true;
        nameT.textAlign = "left";
        nameT.verticalAlign = "middle";
        nameT.stroke = 1;
        nameT.strokeColor = 0x000000;
        nameT.y = 190;
        nameT.text = data.userName;
        nameT.x = -nameT.width/2;
        this.addChild(nameT);

        var tsize = 24;//标题字体大小
        var tcolor = 0xFAFAFA;//标题文字颜色
        var tY = 215;
        var tX =  -headView.width/2 - 10;//标题文字X
        var nX = 22;
        var linH = 40;//字体行高
        var nsize = 24;//数字文字大小
        var ncolor = 0xFAFAFA;//0xEABC35;//数字文字颜色
        var tfont = "微软雅黑";
        //坐庄次数 hyh
        var zhuangTitle = new egret.TextField();
        zhuangTitle.text = "坐庄：";
        zhuangTitle.size = tsize;
        zhuangTitle.textColor = tcolor;
        zhuangTitle.fontFamily = tfont;
        zhuangTitle.textAlign = "center";
        zhuangTitle.verticalAlign = "middle";
        zhuangTitle.y = tY+linH;
        zhuangTitle.x = tX;
        this.addChild(zhuangTitle);

        var zhuangT = new egret.TextField();
        zhuangT.size = nsize;
        zhuangT.textColor = ncolor;
        zhuangT.textAlign = "center";
        zhuangT.verticalAlign = "middle";
        zhuangT.x = nX;
        zhuangT.y = tY+linH;
        zhuangT.text = ""+data.zhuangNum;
        this.addChild(zhuangT);

        //胡牌次数
        var huTielt =  new egret.TextField();
        huTielt.size = tsize;
        huTielt.text = "胡牌：";
        huTielt.textColor = tcolor;
        huTielt.textAlign = "center";
        huTielt.verticalAlign = "middle";
        huTielt.x = tX;
        huTielt.y = tY+linH*2;
        this.addChild(huTielt);

        var huT = new egret.TextField();
        huT.size = nsize;
        huT.textColor = ncolor;
        huT.multiline = true;
        huT.textAlign = "center";
        huT.verticalAlign = "middle";
        huT.x = nX;
        huT.y = tY+linH*2;
        huT.text = ""+data.huNum;
        this.addChild(huT);

        //自摸次数
        var ziTielt =  new egret.TextField();
        ziTielt.size = tsize;
        ziTielt.text = "自摸：";
        ziTielt.textColor = tcolor;
        ziTielt.multiline = true;
        ziTielt.textAlign = "center";
        ziTielt.verticalAlign = "middle";
        ziTielt.x = tX;
        ziTielt.y = tY+linH*3;
        this.addChild(ziTielt);

        var ziT = new egret.TextField();
        ziT.size = nsize;
        ziT.textColor = ncolor;
        ziT.multiline = true;
        ziT.textAlign = "center";
        ziT.verticalAlign = "middle";
        ziT.x = nX;
        ziT.y = tY+linH*3;
        ziT.text = ""+data.zimoNum;
        this.addChild(ziT);


        //点炮次数
        var dianTitle =  new egret.TextField();
        dianTitle.size = tsize;
        dianTitle.text = "点炮：";
        dianTitle.textColor = tcolor;
        dianTitle.multiline = true;
        dianTitle.textAlign = "center";
        dianTitle.verticalAlign = "middle";
        dianTitle.x = tX;
        dianTitle.y = tY+linH*4;
        this.addChild(dianTitle);

        var dianT = new egret.TextField();
        dianT.size = nsize;
        dianT.textColor = ncolor;
        dianT.multiline = true;
        dianT.textAlign = "center";
        dianT.verticalAlign = "middle";
        dianT.x = nX;
        dianT.y = tY+linH*4;
        dianT.text = ""+data.dianNum;
        this.addChild(dianT);

        //总得分
        var scoreTitle = new egret.TextField();
        scoreTitle.text = "总分：";
        scoreTitle.textColor = 0xdef7ff;//tcolor;
        scoreTitle.multiline = true;
        scoreTitle.textAlign = "center";
        scoreTitle.verticalAlign = "middle";
        scoreTitle.size = 30;
        scoreTitle.x = tX-4;
        scoreTitle.y = tY+linH*5 +25;
        this.addChild(scoreTitle);

        var scoreT = new egret.TextField();
        scoreT.size = 36;
        scoreT.textColor = 0xdef7ff;//0xFFFF00;
        scoreT.multiline = true;
        scoreT.textAlign = "center";
        scoreT.verticalAlign = "middle";
        scoreT.x = 25-4;
        scoreT.y = tY+linH*5 +20;
        scoreT.text = ""+data.score;
        this.addChild(scoreT);

        //增加 最佳点炮or大赢家 hyh
        if(sealType==1){
            var seal = new egret.Bitmap(RES.getRes("g_bigWin"));
            seal.anchorOffsetX = seal.width/2;
            seal.anchorOffsetY = seal.height/2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.1;
            seal.x = ziTielt.x + seal.width/2;
            seal.y = ziTielt.y;
            this.addChild(seal);
            egret.Tween.get(seal).wait(300).to({"scaleX":1,"scaleY":1,alpha:.7},300).wait(100).call(this.shake,this).wait(280).to({alpha:1},300);
        }else if(sealType==2){
            var seal = new egret.Bitmap(RES.getRes("g_nicePao"));
            seal.anchorOffsetX = seal.width/2;
            seal.anchorOffsetY = seal.height/2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.3;
            seal.x = ziTielt.x + seal.width/2;
            seal.y = ziTielt.y;
            this.addChild(seal);
            egret.Tween.get(seal).to({"scaleX":1,"scaleY":1,alpha:.7},300).to({alpha:1},300);
        }else if(sealType==3){
            // 既是最佳炮手又是大赢家
            var seal = new egret.Bitmap(RES.getRes("g_nicePao"));
            seal.anchorOffsetX = seal.width/2;
            seal.anchorOffsetY = seal.height/2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.3;
            seal.x = ziTielt.x + seal.width/2;
            seal.y = ziTielt.y;
            this.addChild(seal);

            var seal2 = new egret.Bitmap(RES.getRes("g_bigWin"));
            seal2.anchorOffsetX = seal2.width/2;
            seal2.anchorOffsetY = seal2.height/2;
            seal2.scaleX = 5;
            seal2.scaleY = 5;
            seal2.alpha = 0.1;
            seal2.x = ziTielt.x + seal.width/2;
            seal2.y = ziTielt.y - seal2.height/2 + 20;
            this.addChild(seal2);
            egret.Tween.get(seal).to({"scaleX":1,"scaleY":1,alpha:.8},300);
            egret.Tween.get(seal2).wait(300).to({"scaleX":1,"scaleY":1,alpha:.7},300).wait(100).call(this.shake,this).wait(280).to({alpha:1},300);
        }
    }
    public shake(){
        BaseModel.getInstance().dispatchEvent(new egret.Event("shakeAni"));
    }
}