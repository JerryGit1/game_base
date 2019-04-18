var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/22.
 */
var AH_ChatAniView = (function (_super) {
    __extends(AH_ChatAniView, _super);
    function AH_ChatAniView(model) {
        var _this = _super.call(this) || this;
        _this.texts = [
            "大家好，很高兴见到各位",
            "各位真不好意思啊，我要离开一会",
            "和你合作真是太愉快了",
            "你的牌打的也太好了",
            "快点啊，都等得我花儿都谢了"
        ];
        _this.bg = _this.CCenterBit("g_chat_grayBg");
        _this.addChild(_this.bg);
        _this.bg.alpha = 0;
        _this.model = model;
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_chatStatus, _this.playAni, _this);
        return _this;
    }
    //播动画
    AH_ChatAniView.prototype.playAni = function (e) {
        var data = e.data;
        data.type = Number(data.type);
        if (data.type == 1) {
            this.bg.alpha = 0;
            if (!this.face) {
                this.addFaceAni();
            }
            this.playFaceAni(Number(data.idx), data.point);
        }
        else if (data.type == 2) {
            this.bg.alpha = 1;
            if (!this.phoneTxt) {
                this.addTextAni();
            }
            this.playTextAni(Number(data.idx), data.point);
        }
        else if (data.type == 4) {
            //下载语音
            if (data["local"]) {
                downOk(data.idx, data.userId);
            }
            else {
                WeiXinJSSDK.getInstance().downloadVoice(data.idx, data.userId, downOk);
            }
        }
        function downOk(localId, userId) {
            //播放音频
            WeiXinJSSDK.getInstance().playVoice(localId, userId);
            //播放动画
        }
    };
    //表情
    AH_ChatAniView.prototype.addFaceAni = function () {
        var face = new egret.Bitmap();
        this.addChild(face);
        face.alpha = 0;
        this.face = face;
    };
    //文字
    AH_ChatAniView.prototype.addTextAni = function () {
        var phoneTxt = new egret.TextField();
        phoneTxt.size = 18;
        phoneTxt.textColor = 0xffffff;
        phoneTxt.height = this.bg.height;
        phoneTxt.textAlign = "left";
        phoneTxt.verticalAlign = "middle";
        phoneTxt.multiline = true;
        phoneTxt.fontFamily = "微软雅黑";
        phoneTxt.text = this.texts[0];
        phoneTxt.alpha = 0;
        this.phoneTxt = phoneTxt;
        this.addChild(phoneTxt);
    };
    AH_ChatAniView.prototype.updatePos = function (point) {
        var x = point.x + 100;
        var y = point.y - 14;
        if (point.x > Main.stageWidth / 2) {
            if (this.face)
                this.face.x = point.x - 100;
            if (this.phoneTxt) {
                this.bg.x = point.x - this.bg.width / 2 - 40;
                this.phoneTxt.x = this.bg.x;
            }
        }
        else {
            if (this.face) {
                this.face.x = x - this.face.width / 2;
            }
            if (this.phoneTxt) {
                this.bg.x = point.x + this.bg.width / 2 + 40;
                this.phoneTxt.x = this.bg.x;
            }
        }
        //设置Y
        if (this.face) {
            this.face.y = y;
            this.face.anchorOffsetX = this.face.width / 2;
            this.face.anchorOffsetY = this.face.height / 2;
        }
        if (this.phoneTxt) {
            this.bg.y = y;
            this.phoneTxt.y = this.bg.y;
            this.bg.anchorOffsetX = this.bg.width / 2;
            this.bg.anchorOffsetY = this.bg.height / 2;
            this.phoneTxt.anchorOffsetX = this.phoneTxt.width / 2;
            this.phoneTxt.anchorOffsetY = this.phoneTxt.height / 2;
        }
        if (point.x > Main.stageWidth / 2) {
            this.bg.scaleX = 1;
        }
        else {
            this.bg.scaleX = -1;
        }
    };
    AH_ChatAniView.prototype.playFaceAni = function (num, point) {
        this.face.texture = RES.getRes("game_face" + num);
        this.updatePos(point);
        this.visible = true;
        egret.Tween.removeTweens(this.face);
        egret.Tween.get(this.face).to({ alpha: 1 }, 300).to({ scaleY: .9, scaleX: 1.05 }, 300).to({ scaleY: .9 }, 70)
            .to({ scaleY: 1.1, scaleX: .95 }, 100).to({ scaleY: 1, scaleX: 1 }, 90)
            .to({ scaleY: .9 }, 50).to({ scaleY: 1.08, scaleX: .97 }, 100)
            .to({ scaleY: 1, scaleX: 1 }, 100).wait(1500).to({ alpha: 0 }, 300).call(function () {
            this.visible = false;
        }, this);
    };
    AH_ChatAniView.prototype.playTextAni = function (num, point) {
        this.phoneTxt.text = this.texts[num - 1];
        this.bg.scale9Grid = new egret.Rectangle(17, 5, 108, 33);
        this.bg.width = this.phoneTxt.width + 20;
        this.updatePos(point);
        this.visible = true;
        // 增加语音 hyh
        SoundModel.stopAllBackEffect();
        if (num == 12) {
            SoundModel.playSoundEffect("g_chat_sp" + num);
        }
        else {
            if (this.model.gender == 1) {
                SoundModel.playSoundEffect("b_chat_sp" + num);
            }
            else {
                SoundModel.playSoundEffect("g_chat_sp" + num);
            }
        }
        egret.Tween.removeTweens(this.phoneTxt);
        egret.Tween.get(this.phoneTxt).to({ alpha: 1 }, 100).wait(1500).to({ alpha: 0 }, 100).call(function () {
            this.visible = false;
        }, this);
    };
    AH_ChatAniView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_chatStatus, this.playAni, this);
    };
    return AH_ChatAniView;
}(BaseView));
__reflect(AH_ChatAniView.prototype, "AH_ChatAniView");
