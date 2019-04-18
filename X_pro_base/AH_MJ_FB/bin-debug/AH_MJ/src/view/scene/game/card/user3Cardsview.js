var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
var AH_Game_user3CardsView = (function (_super) {
    __extends(AH_Game_user3CardsView, _super);
    function AH_Game_user3CardsView(model) {
        var _this = _super.call(this, model) || this;
        _this.playRow = 11; /*桌牌列数*/
        _this.playCol = 2; /*行数*/
        //手牌大小
        _this.stopCardWidth = Math.floor((Main.stageWidth - (BaseModel.USER_CARD_WIDTH * 6)) / 15);
        _this.stopCardDis = Math.floor(_this.stopCardWidth * .82); //手牌间距
        //桌牌大小
        _this.playCardWidth = Math.floor(Main.stageWidth / 25);
        _this.playCardDis = Math.floor(_this.playCardWidth * .8);
        //手牌起始坐标
        _this.stopInitPoint = new egret.Point(Main.stageWidth - 310, 190);
        //打出去的牌起始坐标
        _this.playInitPoint = new egret.Point(Main.stageWidth / 2 + (_this.playRow - 1) * _this.playCardDis / 2, Main.stageHeight / 2 - BaseModel.USER_CARD_WIDTH * 1.5);
        //吃碰杠的坐标
        _this.model.cpghAniPoint = new egret.Point(Main.stageWidth / 2, Main.stageHeight / 2 - 150);
        //出牌动画坐标
        _this.model.pHandSPoint.x = _this.stopInitPoint.x - _this.stopCardWidth * 13 / 2;
        _this.model.pHandSPoint.y = _this.stopInitPoint.y;
        return _this;
    }
    /*设置坐标*/
    AH_Game_user3CardsView.prototype.setPoint = function (point) {
        this.playInitPoint.y = Main.stageHeight / 2 - (point.y - Main.stageHeight / 2);
        this.stopInitPoint.y = this.playInitPoint.y - this.playCardWidth * this.playCol - this.stopCardWidth / 2;
        if (this.stopInitPoint.y <= 150) {
            this.stopInitPoint.y = 150;
        }
        else if (this.stopInitPoint.y > 180) {
            this.stopInitPoint.y = 180;
        }
        _super.prototype.setPoint.call(this);
    };
    /*创建桌面牌*/
    AH_Game_user3CardsView.prototype.createPlayCardList = function () {
        var i, x, y, card, len = this.playRow * this.playCol + 5;
        for (i = 0; i < len; i++) {
            card = new Game_cardView("cpMG_3", this.playCardWidth);
            card.h = Math.floor(card.h * .65);
            x = -(i % this.playRow);
            y = -Math.floor(i / this.playRow);
            y *= card.h;
            x *= this.playCardDis;
            card.x = x + this.playInitPoint.x;
            card.y = y + this.playInitPoint.y;
            this.addChildAt(card, 0);
            card.setNewCard(null);
            this.playCardViews.push(card);
        }
    };
    /*更新手牌数据*/
    AH_Game_user3CardsView.prototype.updateStopCardList = function () {
        /*先设置吃碰杠*/
        var i, cpgView, x = this.stopInitPoint.x, cardView;
        for (i in this.model.cpgBoard) {
            cpgView = this.createCPGCardView(this.cpgCardViews[i], this.model.cpgBoard[i]);
            //设置坐标
            cpgView.x = x;
            cpgView.y = this.stopInitPoint.y - cpgView.h / 2;
            x -= cpgView.w;
            x -= this.cpgCardDis; //牌间距
            this.addChildAt(cpgView, 0);
        }
        x -= this.cpgCardDis * 2; //牌间距
        this.setOntherCPGCard(); /*以防万一*/
        /*更新手牌*/
        this.clearStopCard();
        for (i in this.model.stopBoard) {
            cardView = this.createStopCardView(this.model.stopBoard[i]);
            this.addChildAt(cardView, 0);
            cardView.x = x;
            cardView.y = this.stopInitPoint.y - cardView.h / 2;
            //系统最新发的手牌
            if (this.model.stopBoard[i]._isSystemCard) {
                cardView.x = x - this.stopCardWidth / 3;
                cardView.alpha = 0;
                egret.Tween.get(cardView).to({ alpha: 1 }, 300);
                this.model.stopBoard[i]._isSystemCard = false;
            }
            x -= this.stopCardDis;
        }
    };
    return AH_Game_user3CardsView;
}(Game_userCardView));
__reflect(AH_Game_user3CardsView.prototype, "AH_Game_user3CardsView");
