var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/24.
 */
var AH_MaxSettleInfoView = (function (_super) {
    __extends(AH_MaxSettleInfoView, _super);
    function AH_MaxSettleInfoView(data, currentId, sealType) {
        var _this = _super.call(this) || this;
        _this.initSettleInfo(data, currentId, sealType);
        return _this;
    }
    AH_MaxSettleInfoView.prototype.initSettleInfo = function (data, currentId, sealType) {
        //头像
        var headView = new Game_headView();
        headView.y = 160;
        headView.setHead(data.userImg);
        headView.setOffLine(false);
        headView.setHighLight(false);
        if (data.userId == currentId) {
            headView.setChuStatus(true);
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
        nameT.y = 206;
        nameT.text = data.userName;
        nameT.x = -nameT.width / 2;
        this.addChild(nameT);
        var tsize = 18; //标题字体大小
        var tcolor = 0xFAFAFA; //标题文字颜色
        var tY = 225;
        var tX = -headView.width / 2 - 20; //标题文字X
        var nX = 40;
        var linH = 30; //字体行高
        var nsize = 17; //数字文字大小
        var ncolor = 0xEABC35; //数字文字颜色
        var tfont = "微软雅黑";
        //坐庄次数 hyh
        var zhuangTitle = new egret.TextField();
        zhuangTitle.text = "坐庄次数：";
        zhuangTitle.size = tsize;
        zhuangTitle.textColor = tcolor;
        zhuangTitle.fontFamily = tfont;
        zhuangTitle.textAlign = "center";
        zhuangTitle.verticalAlign = "middle";
        zhuangTitle.y = tY + linH;
        zhuangTitle.x = tX;
        this.addChild(zhuangTitle);
        var zhuangT = new egret.TextField();
        zhuangT.size = nsize;
        zhuangT.textColor = ncolor;
        zhuangT.textAlign = "center";
        zhuangT.verticalAlign = "middle";
        zhuangT.x = nX;
        zhuangT.y = tY + linH;
        zhuangT.text = "" + data.zhuangNum;
        this.addChild(zhuangT);
        //胡牌次数
        var huTielt = new egret.TextField();
        huTielt.size = tsize;
        huTielt.text = "胡牌次数：";
        huTielt.textColor = tcolor;
        huTielt.textAlign = "center";
        huTielt.verticalAlign = "middle";
        huTielt.x = tX;
        huTielt.y = tY + linH * 2;
        this.addChild(huTielt);
        var huT = new egret.TextField();
        huT.size = nsize;
        huT.textColor = ncolor;
        huT.multiline = true;
        huT.textAlign = "center";
        huT.verticalAlign = "middle";
        huT.x = nX;
        huT.y = tY + linH * 2;
        huT.text = "" + data.huNum;
        this.addChild(huT);
        //自摸次数
        var ziTielt = new egret.TextField();
        ziTielt.size = tsize;
        ziTielt.text = "自摸次数：";
        ziTielt.textColor = tcolor;
        ziTielt.multiline = true;
        ziTielt.textAlign = "center";
        ziTielt.verticalAlign = "middle";
        ziTielt.x = tX;
        ziTielt.y = tY + linH * 3;
        this.addChild(ziTielt);
        var ziT = new egret.TextField();
        ziT.size = nsize;
        ziT.textColor = ncolor;
        ziT.multiline = true;
        ziT.textAlign = "center";
        ziT.verticalAlign = "middle";
        ziT.x = nX;
        ziT.y = tY + linH * 3;
        ziT.text = "" + data.zimoNum;
        this.addChild(ziT);
        //总得分
        var scoreT = new egret.TextField();
        scoreT.text = "总分：";
        scoreT.textColor = tcolor;
        scoreT.multiline = true;
        scoreT.textAlign = "center";
        scoreT.verticalAlign = "middle";
        scoreT.size = 24;
        scoreT.x = tX;
        scoreT.y = tY + linH * 5 + 25;
        this.addChild(scoreT);
        var scoreT = new egret.TextField();
        scoreT.size = 30;
        scoreT.textColor = 0xFFFF00;
        scoreT.multiline = true;
        scoreT.textAlign = "center";
        scoreT.verticalAlign = "middle";
        scoreT.x = nX - 35;
        scoreT.y = tY + linH * 5 + 20;
        scoreT.text = "" + data.score;
        this.addChild(scoreT);
        //增加 最佳点炮or大赢家 hyh
        if (sealType == 1) {
            var seal = new egret.Bitmap(RES.getRes("g_bigWin"));
            seal.anchorOffsetX = seal.width / 2;
            seal.anchorOffsetY = seal.height / 2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.1;
            seal.x = ziTielt.x + seal.width / 2;
            seal.y = ziTielt.y;
            this.addChild(seal);
            egret.Tween.get(seal).wait(300).to({ "scaleX": 1, "scaleY": 1, alpha: .7 }, 300).wait(100).call(this.shake, this).wait(280).to({ alpha: 1 }, 300);
        }
        else if (sealType == 2) {
            var seal = new egret.Bitmap(RES.getRes("g_nicePao"));
            seal.anchorOffsetX = seal.width / 2;
            seal.anchorOffsetY = seal.height / 2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.3;
            seal.x = ziTielt.x + seal.width / 2;
            seal.y = ziTielt.y;
            this.addChild(seal);
            egret.Tween.get(seal).to({ "scaleX": 1, "scaleY": 1, alpha: .7 }, 300).to({ alpha: 1 }, 300);
        }
        else if (sealType == 3) {
            // 既是最佳炮手又是大赢家
            var seal = new egret.Bitmap(RES.getRes("g_nicePao"));
            seal.anchorOffsetX = seal.width / 2;
            seal.anchorOffsetY = seal.height / 2;
            seal.scaleX = 5;
            seal.scaleY = 5;
            seal.alpha = 0.3;
            seal.x = ziTielt.x + seal.width / 2;
            seal.y = ziTielt.y;
            this.addChild(seal);
            var seal2 = new egret.Bitmap(RES.getRes("g_bigWin"));
            seal2.anchorOffsetX = seal2.width / 2;
            seal2.anchorOffsetY = seal2.height / 2;
            seal2.scaleX = 5;
            seal2.scaleY = 5;
            seal2.alpha = 0.1;
            seal2.x = ziTielt.x + seal.width / 2;
            seal2.y = ziTielt.y - seal2.height / 2 + 20;
            this.addChild(seal2);
            egret.Tween.get(seal).to({ "scaleX": 1, "scaleY": 1, alpha: .8 }, 300);
            egret.Tween.get(seal2).wait(300).to({ "scaleX": 1, "scaleY": 1, alpha: .7 }, 300).wait(100).call(this.shake, this).wait(280).to({ alpha: 1 }, 300);
        }
    };
    AH_MaxSettleInfoView.prototype.shake = function () {
        BaseModel.getInstance().dispatchEvent(new egret.Event("shakeAni"));
    };
    return AH_MaxSettleInfoView;
}(BaseView));
__reflect(AH_MaxSettleInfoView.prototype, "AH_MaxSettleInfoView");
