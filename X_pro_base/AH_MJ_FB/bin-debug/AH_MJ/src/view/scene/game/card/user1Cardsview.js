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
 * 打出去的牌
 */
var AH_Game_user1CardsView = (function (_super) {
    __extends(AH_Game_user1CardsView, _super);
    function AH_Game_user1CardsView(model) {
        var _this = _super.call(this, model) || this;
        /*出牌边界*/
        _this.sendCardMaxY = Math.floor(Main.stageHeight - BaseModel.USER_CARD_WIDTH * 2.2);
        _this.playRow = 11; /*桌牌列数*/
        _this.playCol = 2;
        //手牌大小
        _this.stopCardDis = Math.floor(_this.stopCardWidth * .9); //手牌间距
        //更新玩家手牌初始化状态
        _this.model.addEventListener("noneSendCard", _this.initStopCardType, _this);
        //桌牌大小
        _this.playCardWidth = Math.floor(Main.stageWidth / 20);
        _this.playCardDis = Math.floor(_this.playCardWidth * .8);
        //打出去的牌起始坐标
        _this.playInitPoint = new egret.Point(Main.stageWidth / 2 - (_this.playRow - 1) * _this.playCardDis / 2, Main.stageHeight - BaseModel.USER_CARD_WIDTH * 1.5 - _this.playCardWidth * 1.5 * _this.playCol);
        if (_this.playInitPoint.y < Main.stageHeight / 2 + 125) {
            _this.playInitPoint.y = Main.stageHeight / 2 + 125;
        }
        //手中牌起始坐标
        _this.stopInitPoint = new egret.Point(Main.stageWidth - _this.stopCardDis * 15, Main.stageHeight);
        //吃碰杠的坐标
        _this.model.cpghAniPoint = new egret.Point(Main.stageWidth / 2, Main.stageHeight / 2 + 150);
        return _this;
    }
    /*设置坐标*/
    AH_Game_user1CardsView.prototype.setPoint = function () {
        _super.prototype.setPoint.call(this);
    };
    /*创建桌面牌*/
    AH_Game_user1CardsView.prototype.createPlayCardList = function () {
        var i, x, y, card, len = this.playRow * this.playCol + 5;
        for (i = 0; i < len; i++) {
            card = new Game_cardView("cpMG_1", this.playCardWidth);
            card.h = Math.floor(card.h * .65);
            x = (i % this.playRow);
            y = Math.floor(i / this.playRow);
            y *= card.h;
            x *= this.playCardDis;
            card.x = x + this.playInitPoint.x;
            card.y = y + this.playInitPoint.y;
            this.addChild(card);
            card.setNewCard(null);
            this.playCardViews.push(card);
        }
    };
    /*更新手牌数据*/
    AH_Game_user1CardsView.prototype.updateStopCardList = function () {
        /*1-先设置吃碰杠牌 列表*/
        var i, cpgView, x = this.stopInitPoint.x, cardView;
        for (i in this.model.cpgBoard) {
            cpgView = this.createCPGCardView(this.cpgCardViews[i], this.model.cpgBoard[i]);
            /*设置坐标*/
            cpgView.x = x;
            cpgView.y = this.stopInitPoint.y - cpgView.h / 2;
            x += cpgView.w;
            x += this.cpgCardDis; //牌间距
        }
        x += this.cpgCardDis * 2; //牌间距
        this.setOntherCPGCard(); /*以防万一*/
        /*2-显示剩余手牌*/
        this.clearStopCard(); /*清空手牌*/
        this.card_end("clearCard"); /*清空拖动的牌*/
        for (i in this.model.stopBoard) {
            cardView = this.createStopCardView(this.model.stopBoard[i], true);
            this.addChild(cardView);
            cardView.initX = cardView.x = x;
            cardView.initY = cardView.y = this.stopInitPoint.y - cardView.h / 2;
            //系统最新发的手牌
            if (this.model.stopBoard[i]._isSystemCard) {
                MyConsole.getInstance().trace("系统手牌 视图刷新");
                cardView.initX = cardView.x = x + this.stopCardWidth / 2;
                cardView.alpha = 0;
                cardView.y -= 30;
                egret.Tween.removeTweens(cardView);
                egret.Tween.get(cardView).to({ alpha: 1, y: cardView.initY + 5 }, 300).to({ alpha: 1, y: cardView.initY }, 100);
                this.model.stopBoard[i]._isSystemCard = false;
            }
            x += this.stopCardDis;
        }
    };
    /*手牌点击*/
    AH_Game_user1CardsView.prototype.stopCardTouch = function (e) {
        this.card_end("click");
        var card = e.currentTarget;
        if (card.currentType == 0) {
            this.initStopCardType();
            BaseModel.getInstance().eventRadio("cardHighEnable", card);
            card.currentType = 1;
        }
        else if (card.currentType == 1) {
            //此处该发牌逻辑了
            BaseModel.getInstance().eventRadio("cardHighDisabled");
            this.sendCard(card);
        }
    };
    /*手牌移动-侦听*/
    AH_Game_user1CardsView.prototype.stopCardBegin = function (e) {
        this.card_end("begin");
        this.cMoveCardView = e.currentTarget;
        this.cMoveCardView._isOut = false;
        BaseModel.getInstance().eventRadio("cardHighEnable", this.cMoveCardView);
        this.addChild(this.cMoveCardView); //提高层级
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.card_move, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.card_end, this);
    };
    /*移动拖动事件*/
    AH_Game_user1CardsView.prototype.card_move = function (e) {
        if (this.cMoveCardView) {
            var x = e.stageX, y = e.stageY;
            this.addMoveCardTips();
            if (x > BaseModel.USER_CARD_WIDTH && x < Main.stageWidth - BaseModel.USER_CARD_WIDTH && y > BaseModel.USER_CARD_WIDTH) {
                this.cMoveCardView.x = x;
                this.cMoveCardView.y = y;
                this.cMoveCardView.currentType = 3;
                return;
            }
            else {
                this.cMoveCardView._isOut = true;
            }
        }
        this.card_end("move");
    };
    AH_Game_user1CardsView.prototype.card_end = function (e) {
        if (e === void 0) { e = null; }
        this.touchEnabled = false;
        this.graphics.clear();
        BaseModel.getInstance().eventRadio("cardHighDisabled");
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.card_end, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.card_move, this);
        if (e != "clearCard" && this.cMoveCardView && this.cMoveCardView.currentType == 3) {
            if (!this.cMoveCardView._isOut && this.cMoveCardView.y < this.sendCardMaxY) {
                this.sendCard(this.cMoveCardView);
            }
            else {
                this.cMoveCardView.currentType = 0;
            }
        }
        this.cMoveCardView = null;
    };
    /*----------------确认打出一张牌------------*/
    AH_Game_user1CardsView.prototype.sendCard = function (card) {
        this.model.pHandSPoint.x = card.x;
        this.model.pHandSPoint.y = card.y;
        if (card)
            BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_playerSendCard, { type: card.type, num: card.num });
    };
    AH_Game_user1CardsView.prototype.addMoveCardTips = function () {
        if (!this.touchEnabled) {
            this.touchEnabled = true;
            this.graphics.clear();
            this.graphics.beginFill(0x111111, .08);
            this.graphics.drawRect(0, 0, Main.stageWidth, Main.stageHeight);
            this.graphics.lineStyle(1, 0xffffff, .4);
            this.graphics.moveTo(0, this.sendCardMaxY);
            this.graphics.lineTo(Main.stageWidth, this.sendCardMaxY);
            this.graphics.endFill();
        }
    };
    /*恢复所有牌 初始状态*/
    AH_Game_user1CardsView.prototype.initStopCardType = function () {
        //先恢复所有牌状态
        for (var i in this.stopCardViews) {
            this.stopCardViews[i].currentType = 0;
        }
    };
    AH_Game_user1CardsView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.card_move, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.card_end, this);
    };
    return AH_Game_user1CardsView;
}(Game_userCardView));
__reflect(AH_Game_user1CardsView.prototype, "AH_Game_user1CardsView");
