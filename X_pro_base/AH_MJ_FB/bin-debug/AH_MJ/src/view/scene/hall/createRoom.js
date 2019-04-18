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
 * 创建房间
 */
var AH_H_createRoom = (function (_super) {
    __extends(AH_H_createRoom, _super);
    function AH_H_createRoom() {
        var _this = _super.call(this) || this;
        _this.createBtn = new MyButton("h_createRoom");
        _this.createBtn.addTouchEvent();
        _this.createBtn.addEventListener("click", _this.createFn, _this);
        _this.addChild(_this.createBtn);
        return _this;
    }
    AH_H_createRoom.prototype.createFn = function () {
        PopupLayer.getInstance().createRoom();
    };
    return AH_H_createRoom;
}(BaseView));
__reflect(AH_H_createRoom.prototype, "AH_H_createRoom");
