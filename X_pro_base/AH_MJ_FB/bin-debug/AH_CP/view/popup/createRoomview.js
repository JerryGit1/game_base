var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/11.
 * 创建房间弹框
 */
var H_createRoomView = (function (_super) {
    __extends(H_createRoomView, _super);
    function H_createRoomView() {
        return _super.call(this) || this;
    }
    return H_createRoomView;
}(AH_H_createRoomView));
__reflect(H_createRoomView.prototype, "H_createRoomView");
