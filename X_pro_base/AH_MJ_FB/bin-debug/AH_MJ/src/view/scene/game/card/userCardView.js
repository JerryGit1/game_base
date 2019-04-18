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
var AH_Game_userCardView = (function (_super) {
    __extends(AH_Game_userCardView, _super);
    function AH_Game_userCardView(model) {
        var _this = _super.call(this) || this;
        /*打出去牌每一行列数*/
        _this.playRow = 7;
        _this.playCol = 3;
        /*手牌大小*/
        _this.stopCardWidth = BaseModel.USER_CARD_WIDTH;
        _this.stopCardDis = Math.floor(BaseModel.USER_CARD_WIDTH * .9);
        /*打出去牌大小*/
        _this.playCardWidth = Main.stageWidth / 40;
        /*第一张手牌坐标*/
        _this.stopInitPoint = new egret.Point();
        /*第一张打出去牌坐标*/
        _this.playInitPoint = new egret.Point();
        /*打出去的牌*/
        _this.playCardViews = [];
        /*吃碰杠的牌*/
        _this.cpgCardViews = [];
        _this.cpgCardDis = 10;
        /*剩余手牌*/
        _this.stopCardViews = [];
        _this.model = model;
        //刷新桌牌显示-单个更新
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard, _this.updatePlayCardList, _this);
        //刷新手牌显示--单个更新
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard, _this.updateStopCardList, _this);
        return _this;
    }
    /*设置坐标*/
    AH_Game_userCardView.prototype.setPoint = function (a, b, c, d, e) {
        if (a === void 0) { a = null; }
        if (b === void 0) { b = null; }
        if (c === void 0) { c = null; }
        if (d === void 0) { d = null; }
        if (e === void 0) { e = null; }
    };
    /*创建桌面牌视图*/
    AH_Game_userCardView.prototype.createPlayCardList = function () {
    };
    /*更新手牌数据*/
    AH_Game_userCardView.prototype.updateStopCardList = function () {
        /*先设置吃碰杠*/
        /*显示剩余手牌*/
    };
    /*隐藏多余的吃碰杠*/
    AH_Game_userCardView.prototype.setOntherCPGCard = function () {
        if (this.model.cpgBoard.length < this.cpgCardViews.length) {
            for (var i = this.model.cpgBoard.length; i < this.cpgCardViews.length; i++) {
                this.cpgCardViews[i].setCardData(null);
            }
        }
    };
    /*更新打出去的牌数据*/
    AH_Game_userCardView.prototype.updatePlayCardList = function () {
        if (this.model.sendingCardAni)
            return;
        this.setPlayHandAniPoint(this.playCardViews[0]);
        if (this.model.playHand) {
            var list = this.model.playHand, i, len = list.length, card;
            for (i in this.playCardViews) {
                card = this.playCardViews[i];
                if (len > Number(i)) {
                    card.setNewCard(list[i].type, list[i].num); /*显示刷新牌*/
                    this.model.pHandNewPoint.x = card.x;
                    this.model.pHandNewPoint.y = card.y;
                }
                else {
                    if (Number(i) == len) {
                        this.setPlayHandAniPoint(card);
                    }
                    card.setNewCard(null); /*不显示牌*/
                }
            }
        }
        //更新箭頭
        BaseModel.getInstance().eventRadio(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows);
    };
    //设置出牌动画终点坐标
    AH_Game_userCardView.prototype.setPlayHandAniPoint = function (card) {
        //默认动画坐标防止出错
        this.model.pHandEPoint.x = card.x;
        this.model.pHandEPoint.y = card.y;
    };
    /*创建单张吃碰杠牌*/
    AH_Game_userCardView.prototype.createCPGCardView = function (cpgView, data, w, stopCardSkewing) {
        if (w === void 0) { w = this.stopCardWidth * .9; }
        if (stopCardSkewing === void 0) { stopCardSkewing = 0; }
        if (!cpgView) {
            cpgView = new Game_cpgCardView();
            this.addChild(cpgView);
            this.cpgCardViews.push(cpgView);
        }
        cpgView.setCardData(data, this.model.num_id, w, stopCardSkewing);
        return cpgView;
    };
    /*创建单张 手牌*/
    AH_Game_userCardView.prototype.createStopCardView = function (data, _isTouch, w) {
        if (_isTouch === void 0) { _isTouch = false; }
        if (w === void 0) { w = this.stopCardWidth; }
        if (this.stopCardViews.length > 13) {
            MyConsole.getInstance().trace("重大bug手牌大于13张了", 0);
            return;
        }
        var bgType = this.model.num_id;
        var card = new Game_stopCardView(bgType, w, _isTouch);
        card.setNewCard(data.type, data.num);
        this.stopCardViews.push(card);
        if (_isTouch) {
            //牌点击
            card.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopCardTouch, this);
            //牌拖动
            card.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stopCardBegin, this);
        }
        if (bgType == 2) {
            card.scaleX = -Math.abs(card.scaleX);
        }
        return card;
    };
    /*手牌点击*/
    AH_Game_userCardView.prototype.stopCardTouch = function (e) {
    };
    /*手牌拖动*/
    AH_Game_userCardView.prototype.stopCardBegin = function (e) {
    };
    /*清空手牌*/
    AH_Game_userCardView.prototype.clearStopCard = function () {
        for (var i in this.stopCardViews) {
            this.stopCardViews[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.stopCardTouch, this);
            this.stopCardViews[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stopCardBegin, this);
            this.removeChild(this.stopCardViews[i]);
            this.stopCardViews[i] = null;
        }
        this.stopCardViews = [];
    };
    AH_Game_userCardView.prototype.clear = function () {
        //刷新桌牌显示-单个更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerPlayCard, this.updatePlayCardList, this);
        //刷新手牌显示--单个更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerStopCard, this.updateStopCardList, this);
        this.model = null;
        this.clearStopCard();
    };
    //与当前出牌一致时，桌牌、吃碰杠牌高亮提示
    AH_Game_userCardView.prototype.setCPGCardHighLight = function (card) {
        for (var i = 0; i < this.playCardViews.length; i++) {
            if (this.playCardViews[i].type == card.type && this.playCardViews[i].num == card.num) {
                this.playCardViews[i].setHighLight(true);
            }
        }
        for (var j = 0; j < this.cpgCardViews.length; j++) {
            var cpgCards = this.cpgCardViews[j].cpgCards;
            for (var j1 = 0; j1 < cpgCards.length; j1++) {
                if (cpgCards[j1].type == card.type && cpgCards[j1].num == card.num) {
                    cpgCards[j1].setHighLight(true);
                }
            }
        }
    };
    //取消全部出牌高亮提示
    AH_Game_userCardView.prototype.setCPGCardHighLightDisabled = function () {
        for (var i = 0; i < this.playCardViews.length; i++) {
            this.playCardViews[i].setHighLight(false);
        }
        for (var j = 0; j < this.cpgCardViews.length; j++) {
            var cpgCards = this.cpgCardViews[j].cpgCards;
            for (var j1 = 0; j1 < cpgCards.length; j1++) {
                cpgCards[j1].setHighLight(false);
            }
        }
    };
    return AH_Game_userCardView;
}(BaseView));
__reflect(AH_Game_userCardView.prototype, "AH_Game_userCardView");
