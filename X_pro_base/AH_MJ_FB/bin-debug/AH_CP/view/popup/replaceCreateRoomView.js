var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tang on 2017/8/24.
 * 代开房间弹框
 */
var H_replaceCreateRoomView = (function (_super) {
    __extends(H_replaceCreateRoomView, _super);
    function H_replaceCreateRoomView(model) {
        return _super.call(this, model) || this;
    }
    return H_replaceCreateRoomView;
}(AH_H_replaceCreateRoomView));
__reflect(H_replaceCreateRoomView.prototype, "H_replaceCreateRoomView");
