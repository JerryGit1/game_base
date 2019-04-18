var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/10.
 * 设置弹窗
 */
var AH_H_serView = (function (_super) {
    __extends(AH_H_serView, _super);
    function AH_H_serView(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        var bg = _this.addMsgBg(Main.stageWidth * .6, Main.stageHeight * 0.55); //"b_p_hitBg",
        // var x = bg.width - 27;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_set_title2", _this.centerSp.width / 2, 35);
        //================音效开关
        var switchBtn = new EffectSoundBtn("h_sound_title", "h_voice_on", "h_voice_off");
        _this.centerSp.addChild(switchBtn);
        switchBtn.x = 136;
        switchBtn.y = 106;
        //==============音乐开关
        var switchBtn1 = new BgSoundBtn("h_music_title", "h_music_on", "h_music_off");
        _this.centerSp.addChild(switchBtn1);
        switchBtn1.x = switchBtn.x;
        switchBtn1.y = switchBtn.y + 84;
        // 退出游戏 or 解散房间
        var self = _this;
        if (_this.type == "dating") {
            _this.closeGameBtn = new MyButton("b_p_setup_quitGame");
            _this.closeGameBtn.x = bg.width / 2;
            _this.closeGameBtn.y = bg.height - _this.closeGameBtn.height - 10;
            _this.closeGameBtn.addTouchEvent();
            _this.closeGameBtn.addEventListener("click", function () {
                self.closeClick();
                BaseModel.getInstance().eventRadio("quitGame");
            }, _this);
            _this.centerSp.addChild(_this.closeGameBtn);
        }
        else {
            _this.quitRoomBtn = new MyButton("h_closeGame");
            _this.quitRoomBtn.x = bg.width / 2;
            _this.quitRoomBtn.y = bg.height - _this.quitRoomBtn.height - 10;
            _this.quitRoomBtn.addTouchEvent();
            _this.quitRoomBtn.addEventListener("click", function () {
                //发起解散房间
                BaseModel.getInstance().eventRadio("sponsorGameKillRoom");
                self.closeClick();
            }, _this);
            _this.centerSp.addChild(_this.quitRoomBtn);
        }
        _this.openAni();
        return _this;
    }
    return AH_H_serView;
}(PopupBaseView));
__reflect(AH_H_serView.prototype, "AH_H_serView");
