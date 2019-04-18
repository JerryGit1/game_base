var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/20.
 *
 * 游戏中动画层
 * 出牌 放最底下
 * 吃碰杠胡
 */
var AH_Game_playingAniView = (function (_super) {
    __extends(AH_Game_playingAniView, _super);
    function AH_Game_playingAniView(model) {
        var _this = _super.call(this) || this;
        /*添加一个出牌动画 播放出牌动画*/
        _this.maxCarding_isAction = false;
        _this.model = model;
        //表情文字动画
        for (var i = 1; i <= 4; i++) {
            _this.chatAniView = new ChatAniView(_this.model.userGroupModel.numIdGetUserModel(i));
            _this.addChild(_this.chatAniView);
        }
        //出牌动画 -》大牌提示 -》刷新桌牌
        _this.model.playingModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerSendCardAni, _this.playHandAni, _this);
        //添加或者移除最新出的牌箭头
        _this.model.playingModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows, _this.paiSignAni, _this);
        //移除出牌大牌提示
        _this.model.playingModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_removeSendCardAni, _this.removeMaxCardTips1, _this);
        //播放吃碰杠胡动画
        _this.model.playingModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerCPGHAni, _this.playCPGHAni, _this);
        _this.addPaiSign();
        _this.addSendCardSign();
        return _this;
    }
    AH_Game_playingAniView.prototype.playHandAni = function (e) {
        var self = this;
        var cardInfo = e.data.cardInfo;
        var userCardModel = e.data.userCardInfo;
        var _isAddMaxCardAni = e.data["_isAddMaxCardAni"];
        var _isAddMoveCardAni = e.data["_isAddMoveCardAni"];
        var _isUpdateCard = e.data["_isUpdateCard"];
        /*起点*/
        var startPoint = userCardModel.pHandSPoint;
        /*终点*/
        var endPoint = userCardModel.pHandEPoint;
        var scale = userCardModel.pAniScale;
        var type = cardInfo[0][0];
        var num = cardInfo[0][1];
        /*最新出牌提示位置信息*/
        var x = endPoint.x;
        var y = endPoint.y;
        userCardModel.sendingCardAni = true;
        this.otherPaiSignSprite.visible = false;
        //移动时间
        var timer = Math.sqrt(Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2)) / 2;
        if (timer < 170)
            timer = 170;
        //牌移动动画
        if (!_isAddMoveCardAni) {
            moveOk();
        }
        else {
            this.removeAniCard();
            //实例化牌
            this.playHandView = new Game_cardView("cpMG_" + userCardModel.num_id, BaseModel.USER_CARD_WIDTH);
            this.playHandView.setNewCard(type, num);
            this.playHandView.setPlayCardRotation(userCardModel.num_id);
            this.addChild(this.playHandView);
            //走动画
            this.playHandView.x = startPoint.x;
            this.playHandView.y = startPoint.y;
            // 韩月辉   添加 出牌语音提示
            this.gender = Number(userCardModel.gender);
            if (Number(userCardModel.gender) == 1) {
                SoundModel.playSoundEffect("b_" + this.playHandView.soundName);
            }
            else {
                SoundModel.playSoundEffect("g_" + this.playHandView.soundName);
            }
            egret.Tween.get(this.playHandView).to({ x: endPoint.x, y: endPoint.y, scaleX: scale, scaleY: scale }, timer).call(moveOk, this);
        }
        //刷新桌牌 因爲擔心动画会被挤掉而不去刷新桌牌了 所以并行执行
        if (_isUpdateCard) {
            setTimeout(function () {
                userCardModel.sendingCardAni = false;
                userCardModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerPlayCard));
            }.bind(this), timer);
        }
        //出牌移动牌动画播放完毕
        function moveOk() {
            /*播放出牌提示动画*/
            if (_isAddMaxCardAni && !self.maxCarding_isAction) {
                self.playSendCardSignAni(userCardModel, type, num);
            }
            self.maxCarding_isAction = false;
            // 韩月辉添加落牌声音
            if (_isAddMoveCardAni) {
                self.removeAniCard();
                SoundModel.playSoundEffect("g_luopai");
            }
        }
        //移除大牌 没有动作的出牌提示 定时消失 有动作的  一直显示 直到下一张
        if (_isAddMaxCardAni && !e.data._isAction) {
            var timer = 4000;
            if (userCardModel.num_id == 1)
                timer = 2000;
            clearInterval(this.maxCardTimer);
            this.maxCardTimer = setTimeout(this.removeMaxCardTips.bind(this), timer);
        }
    };
    /*添加其他人出牌,大牌提示动画*/
    AH_Game_playingAniView.prototype.addSendCardSign = function () {
        this.otherPaiSignSprite = new egret.Sprite();
        this.addChild(this.otherPaiSignSprite);
        this.otherPai = new Game_cardView(1, 60);
        this.otherPaiSignSprite.addChild(this.otherPai);
        this.otherPaiSign = new egret.Bitmap(RES.getRes("g_pai_light"));
        this.otherPaiSign.width = this.otherPai.w + 36;
        this.otherPaiSign.height = this.otherPai.h + 42;
        this.otherPaiSign.x = -this.otherPai.width / 2 - 14;
        this.otherPaiSign.y = -this.otherPai.height / 2 - 8;
        this.otherPaiSignSprite.addChild(this.otherPaiSign);
        this.otherPaiSignSprite.visible = false;
    };
    /*播放出牌提示动画*/
    AH_Game_playingAniView.prototype.playSendCardSignAni = function (userCardModel, type, num) {
        // this.otherPaiSignSprite.alpha = 0;
        this.otherPaiSignSprite.visible = true;
        this.otherPaiSignSprite.alpha = 0;
        var pos = [
            { x: Main.stageWidth / 2, y: Main.stageHeight - BaseModel.USER_CARD_WIDTH * 3 },
            { x: Main.stageWidth / 2 + 200, y: Main.stageHeight * 0.5 },
            { x: Main.stageWidth / 2, y: Main.stageHeight * 0.2 },
            { x: Main.stageWidth / 2 - 200, y: Main.stageHeight * 0.5 },
        ];
        this.otherPai.setNewCard(type, num);
        this.otherPaiSignSprite.x = pos[userCardModel.num_id - 1].x;
        this.otherPaiSignSprite.y = pos[userCardModel.num_id - 1].y;
        egret.Tween.removeTweens(this.otherPaiSignSprite);
        egret.Tween.get(this.otherPaiSignSprite).wait(500).to({ alpha: 1 }, 300);
    };
    /*添加最新出牌提示*/
    AH_Game_playingAniView.prototype.addPaiSign = function () {
        if (!this.paiSign) {
            this.paiSign = new egret.Bitmap();
            this.paiSign.texture = RES.getRes("g_paiSign");
            this.paiSign.anchorOffsetX = this.paiSign.width / 2;
            this.paiSign.anchorOffsetY = this.paiSign.height / 2;
            this.addChildAt(this.paiSign, 0);
            this.paiSign.visible = false;
        }
    };
    /*箭头提示 播放最新出牌提示动画以及更新位置*/
    AH_Game_playingAniView.prototype.paiSignAni = function (e) {
        var x, y, point = e.data;
        if (point) {
            if (!this.paiSign.visible)
                this.paiSign.visible = true;
            x = point.x;
            if (point.y < 210) {
                y = point.y - 40;
            }
            else if (point.x > 700) {
                y = point.y - 42;
            }
            else if (point.y > 510) {
                y = point.y - 45;
            }
            else {
                y = point.y - 47;
            }
            this.paiSign.x = x;
            this.paiSign.y = y;
            egret.Tween.removeTweens(this.paiSign);
            egret.Tween.get(this.paiSign, { loop: true }).to({ y: y + 8, scaleY: .8, scaleX: 1.2 }, 700).wait(100).to({ y: y, scaleY: 1, scaleX: 1 }, 600);
        }
        else {
            this.paiSign.visible = false;
        }
    };
    /*播放吃碰杠胡过动画*/
    AH_Game_playingAniView.prototype.playCPGHAni = function (e) {
        var data = e.data;
        var point = data.point; /*坐标*/
        var action = Number(data.action); /*动作*/
        var gender = "g_"; //性别
        if (Number(data.gender) == 1) {
            gender = "b_";
        }
        /*-----------------声音-------------------*/
        if (action == 4) {
            var type = Number(data.type);
            if (type == 1) {
                if (data.num_id && data.num_id == 1) {
                    SoundModel.playSoundEffect(gender + "cpgh_" + action + "_1_as"); //自摸自己听到 胡的就是这张
                }
                else {
                    SoundModel.playSoundEffect(gender + "cpgh_" + action + "_1"); //自摸别人听到  不好意思自摸了
                }
            }
            else if (type == 2) {
                if (data.num_id && data.num_id == 1) {
                    SoundModel.playSoundEffect(gender + "cpgh_" + action + "_1_as"); //点炮自己听到 胡的就是这张
                }
                else {
                    SoundModel.playSoundEffect(gender + "cpgh_" + action + "_2"); //点炮别人自己听到 放炮
                }
            }
        }
        else {
            // 韩月辉吃碰杠的时候
            if (action == 0 && data.num_id && data.num_id == 1) {
                SoundModel.playSoundEffect(gender + "cpgh_" + action); //自己听到过的声音
            }
            else if (action != 0) {
                SoundModel.playSoundEffect(gender + "cpgh_" + action);
            }
        }
        /*--------------隐藏小箭头-----------------*/
        if (action != 0 && (this.paiSign)) {
            if (this.paiSign) {
                egret.Tween.removeTweens(this.paiSign);
                this.paiSign.visible = false;
            }
        }
        if (action != 0) {
            this.otherPaiSignSprite.visible = false;
            var target;
            switch (action) {
                case 1:
                    {
                        target = this.CCenterBit("g_chi");
                    }
                    break; //吃
                case 2:
                    {
                        target = this.CCenterBit("g_peng");
                    }
                    break; //碰
                case 3:
                    {
                        target = this.CCenterBit("g_gang");
                    }
                    break; //杠
                case 4:
                    {
                        target = this.CCenterBit("g_hu");
                    }
                    break; //胡
            }
            target.x = point.x;
            target.y = point.y;
            this.addChild(target);
            egret.Tween.get(target).to({ scaleX: 1.2, scaleY: 1.2 }, 100).wait(200).to({ scaleX: 0.8, scaleY: 0.8 }, 100).wait(500).call(function () {
                this.removeChild(target);
                /*----------------飘分动画 1.9.7舍弃------------------*/
                //this.showGangScore(data.gangScoreInfo);
            }, this);
        }
    };
    //玩家杠分提示
    AH_Game_playingAniView.prototype.showGangScore = function (infos) {
        if (infos) {
            for (var i in infos) {
                var model = this.model.backLayerModel.userGroupModel.userIdGetUserModel(infos[i].userId);
                var pos = model.cpghAniPoint;
                if (infos[i].gangScore != 0)
                    this.gangScoreAction(infos[i].gangScore, pos);
            }
        }
    };
    AH_Game_playingAniView.prototype.gangScoreAction = function (num, pos) {
        var scoreN = num;
        var scoreT = new egret.TextField();
        scoreT.size = 60;
        if (num < 0) {
            scoreT.textColor = 0xCD3333;
        }
        else {
            scoreT.textColor = 0x32CD32;
        }
        scoreT.textAlign = "center";
        scoreT.verticalAlign = "middle";
        scoreT.italic = true;
        scoreT.bold = true;
        scoreT.x = pos.x;
        if (pos.x == 568 && pos.y == 510)
            scoreT.y = pos.y - 20;
        else
            scoreT.y = pos.y;
        scoreT.text = "" + scoreN;
        scoreT.alpha = 0;
        this.addChild(scoreT);
        egret.Tween.get(scoreT).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500).call(function () {
            this.removeChild(scoreT);
        }, this);
    };
    /*移除动画牌*/
    AH_Game_playingAniView.prototype.removeAniCard = function () {
        if (this.playHandView) {
            egret.Tween.removeTweens(this.playHandView);
            this.removeChild(this.playHandView);
            this.playHandView = null;
        }
    };
    /*移除 大牌提示*/
    AH_Game_playingAniView.prototype.removeMaxCardTips1 = function () {
        this.maxCarding_isAction = true;
        this.removeMaxCardTips();
    };
    AH_Game_playingAniView.prototype.removeMaxCardTips = function () {
        this.otherPaiSignSprite.visible = false;
        clearInterval(this.maxCardTimer);
    };
    AH_Game_playingAniView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        //出牌动画
        this.model.playingModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerSendCardAni, this.playHandAni, this);
        //播放吃碰杠胡动画
        this.model.playingModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerCPGHAni, this.playCPGHAni, this);
        //移除出牌动画
        this.model.playingModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_removeSendCardAni, this.removeMaxCardTips1, this);
    };
    return AH_Game_playingAniView;
}(BaseView));
__reflect(AH_Game_playingAniView.prototype, "AH_Game_playingAniView");
