var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/8.
 * 加入房间
 */
var AH_H_joinRoom = (function (_super) {
    __extends(AH_H_joinRoom, _super);
    function AH_H_joinRoom() {
        var _this = _super.call(this) || this;
        _this.joinRoomBtn = new MyButton("h_joinRoom");
        _this.joinRoomBtn.addTouchEvent();
        _this.joinRoomBtn.addEventListener("click", _this.joinRoomFn, _this);
        _this.addChild(_this.joinRoomBtn);
        return _this;
    }
    AH_H_joinRoom.prototype.joinRoomFn = function () {
        PopupLayer.getInstance().joinRoom();
    };
    return AH_H_joinRoom;
}(BaseView));
__reflect(AH_H_joinRoom.prototype, "AH_H_joinRoom");
