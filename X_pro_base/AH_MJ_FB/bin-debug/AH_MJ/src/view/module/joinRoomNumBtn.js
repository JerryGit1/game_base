var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/25.
 * 加入房间键盘组件
 */
var AH_H_joinRoomNumBtn = (function (_super) {
    __extends(AH_H_joinRoomNumBtn, _super);
    function AH_H_joinRoomNumBtn(btn) {
        var _this = _super.call(this, "h_numberBarBg") || this;
        _this.roomNum = new egret.Bitmap(RES.getRes("h_num" + btn));
        _this.roomNum.anchorOffsetX = _this.roomNum.width / 2;
        _this.roomNum.anchorOffsetY = _this.roomNum.height / 2;
        _this.num = btn;
        _this.addChild(_this.roomNum);
        return _this;
    }
    return AH_H_joinRoomNumBtn;
}(MyButton));
__reflect(AH_H_joinRoomNumBtn.prototype, "AH_H_joinRoomNumBtn");
