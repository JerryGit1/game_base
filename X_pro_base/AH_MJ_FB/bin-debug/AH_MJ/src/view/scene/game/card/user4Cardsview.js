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
var AH_Game_user4CardsView = (function (_super) {
    __extends(AH_Game_user4CardsView, _super);
    function AH_Game_user4CardsView(model) {
        var _this = _super.call(this, model) || this;
        _this.playRow = 11; /*桌牌列数*/
        _this.playCol = 2;
        _this.cpgCardDis = 20;
        //手牌大小
        _this.stopCardWidth = Math.floor((Main.stageHeight - (BaseModel.USER_CARD_WIDTH * 3)) / 8);
        _this.stopCardDis = Math.floor(_this.stopCardWidth * .45);
        _this.stopCardSkewing = Math.floor(_this.stopCardWidth * .9) / 10;
        //手牌起始坐标
        _this.stopInitPoint = new egret.Point(210, Main.stageHeight * .24);
        //打出去的牌起始坐标
        _this.playInitPoint = new egret.Point(Main.stageWidth / 2 - 140, Main.stageHeight / 2 - 80);
        //吃碰杠的坐标
        _this.model.cpghAniPoint = new egret.Point(200, Main.stageHeight / 2);
        //出牌动画坐标
        _this.model.pHandSPoint.x = _this.stopInitPoint.x;
        _this.model.pHandSPoint.y = Main.stageHeight / 2;
        return _this;
    }
    /*设置坐标*/
    AH_Game_user4CardsView.prototype.setPoint = function (y, x, w, maxDis) {
        this.playInitPoint.x = x - 5;
        this.playCardDis = Math.floor(maxDis / this.playRow);
        this.playCardWidth = Math.floor(this.playCardDis / .52);
        this.playCardSkewing = Math.floor(this.playCardDis * .2) + .2;
        this.playInitPoint.y = y + this.playCardDis;
        _super.prototype.setPoint.call(this);
    };
    /*创建桌面牌*/
    AH_Game_user4CardsView.prototype.createPlayCardList = function () {
        var i, x, y, col, card, len = this.playRow * this.playCol + 3;
        for (i = 0; i < len; i++) {
            card = new Game_cardView("cpMG_4", this.playCardWidth);
            card.setPlayCardRotation(4);
            col = (i % this.playRow);
            var row = Math.floor(i / this.playRow);
            if (row > 1) {
                row = 1;
                col = (col + this.playRow);
            }
            y = col;
            x = row;
            x *= Math.floor(card.h * .8);
            y *= this.playCardDis;
            card.x = this.playInitPoint.x - x - col * this.playCardSkewing;
            card.y = y + this.playInitPoint.y;
            this.addChild(card);
            card.setNewCard(null);
            this.playCardViews.push(card);
        }
        for (i in this.playCardViews) {
            if (Number(i) < this.playRow) {
                this.addChild(this.playCardViews[i]);
            }
        }
    };
    /*更新手牌数据*/
    AH_Game_user4CardsView.prototype.updateStopCardList = function () {
        /*先设置吃碰杠*/
        var r, i, cpgView, y = this.stopInitPoint.y, cardView, x = this.stopInitPoint.x - this.stopCardWidth / 2;
        var w = Math.floor(this.stopCardWidth * .9);
        if (this.model.cpgBoard.length != 0) {
            y = this.stopInitPoint.y - BaseModel.USER_CARD_WIDTH / 2;
        }
        for (i in this.model.cpgBoard) {
            cpgView = this.createCPGCardView(this.cpgCardViews[i], this.model.cpgBoard[i], w, this.stopCardSkewing);
            //设置坐标
            cpgView.y = y;
            cpgView.x = x;
            y += cpgView.w;
            y += this.cpgCardDis; //牌间距
            x -= cpgView.maxSkewing; //偏移量
            // w-=3;
            this.addChild(cpgView);
        }
        this.setOntherCPGCard(); /*以防万一*/
        /*更新手牌*/
        this.clearStopCard();
        // y-=this.cpgCardDis;//牌间距
        for (i in this.model.stopBoard) {
            cardView = this.createStopCardView(this.model.stopBoard[i], false, this.stopCardWidth);
            this.addChild(cardView);
            cardView.y = y;
            cardView.x = x - i * this.stopCardSkewing * 1.22;
            //系统最新发的手牌
            if (this.model.stopBoard[i]._isSystemCard) {
                cardView.y = y + this.stopCardDis / 2;
                cardView.alpha = 0;
                egret.Tween.get(cardView).to({ alpha: 1 }, 300);
                this.model.stopBoard[i]._isSystemCard = false;
            }
            y += (this.stopCardDis - 2);
        }
    };
    return AH_Game_user4CardsView;
}(Game_userCardView));
__reflect(AH_Game_user4CardsView.prototype, "AH_Game_user4CardsView");
