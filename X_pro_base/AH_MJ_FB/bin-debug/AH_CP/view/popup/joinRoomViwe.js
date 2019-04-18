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
 * 加入游戏弹框
 */
var H_joinRoomView = (function (_super) {
    __extends(H_joinRoomView, _super);
    function H_joinRoomView() {
        return _super.call(this) || this;
    }
    return H_joinRoomView;
}(AH_H_joinRoomView));
__reflect(H_joinRoomView.prototype, "H_joinRoomView");
