var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/24.
 *
 * 发送语音视图
 */
var AH_Game_recordView = (function (_super) {
    __extends(AH_Game_recordView, _super);
    function AH_Game_recordView() {
        var _this = _super.call(this) || this;
        _this.spList = [];
        var bg = _this.CCenterBit("g_voiceBtn", true), vx, vy;
        _this.addChild(bg);
        _this.w = bg.width * 2;
        vx = 0;
        vy = 0;
        _this.graphics.beginFill(0x333333, .8);
        _this.graphics.lineStyle(1, 0x111111, .9);
        _this.graphics.drawRoundRect(vx, vy, _this.w, _this.w, 20, 20);
        _this.graphics.endFill();
        _this.touchEnabled = true;
        bg.x = _this.w / 2 + vx;
        bg.y = _this.w - bg.width / 2 - 10 + vy;
        _this.txt = new egret.TextField();
        _this.txt.width = _this.w;
        _this.txt.textAlign = "center";
        _this.txt.size = 20;
        _this.txt.textColor = 0xeeeeee;
        _this.txt.y = 30 + vy;
        _this.txt.x = vx;
        _this.txt.text = '1"';
        _this.addChild(_this.txt);
        var h = 20, sh;
        for (var i = 0; i < 5; i++) {
            sh = _this.addSH(h);
            sh.x = _this.w / 2 - 20 - 10 * i + vx;
            sh.y = _this.txt.y + h / 2;
            _this.addChild(sh);
            egret.Tween.get(sh, { loop: true }).to({ scaleY: Math.random() - .1 }, Math.floor(Math.random() * 200 + 200)).to({ scaleY: 1 }, Math.floor(Math.random() * 200 + 200));
        }
        for (i = 0; i < 5; i++) {
            sh = _this.addSH(h);
            sh.x = _this.w / 2 + 20 + 10 * i + vx;
            sh.y = _this.txt.y + h / 2;
            _this.addChild(sh);
            _this.spList.push(sh);
            egret.Tween.get(sh, { loop: true }).to({ scaleY: Math.random() }, Math.floor(Math.random() * 200 + 200)).to({ scaleY: 1 }, Math.floor(Math.random() * 200 + 200));
        }
        //开始计时
        _this.timer = new egret.Timer(1000);
        _this.timer.addEventListener(egret.TimerEvent.TIMER, _this.onTimer, _this);
        _this.timer.start();
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        //开始录音
        WeiXinJSSDK.getInstance().startRecord();
        return _this;
    }
    /*计时*/
    AH_Game_recordView.prototype.onTimer = function (e) {
        this.txt.text = (this.timer.currentCount + 1) + '"';
        if (this.timer.currentCount >= 15) {
            this.stop();
        }
    };
    /*创建条*/
    AH_Game_recordView.prototype.addSH = function (h) {
        var sh = new egret.Shape();
        sh.graphics.beginFill(0x1296DB);
        sh.graphics.drawRect(0, -h / 2, 3, h);
        sh.graphics.endFill();
        this.spList.push(sh);
        return sh;
    };
    /*点击*/
    AH_Game_recordView.prototype.onTap = function (e) {
        this.dispatchEvent(new egret.Event("close"));
    };
    /*停止录音*/
    AH_Game_recordView.prototype.stop = function () {
        if (this.timer.currentCount >= 3) {
            //停止录音
            WeiXinJSSDK.getInstance().stopRecord(1);
            this.onTap(null);
            return true;
        }
        else {
            PopupLayer.getInstance().floatAlert("请按住3秒以上");
        }
        this.onTap(null);
        return false;
    };
    AH_Game_recordView.prototype.clear = function () {
        //停止录音
        WeiXinJSSDK.getInstance().stopRecord(null);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.timer.stop();
        this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer = null;
        for (var i in this.spList) {
            egret.Tween.removeTweens(this.spList[i]);
        }
    };
    return AH_Game_recordView;
}(PopupBaseView));
__reflect(AH_Game_recordView.prototype, "AH_Game_recordView");
