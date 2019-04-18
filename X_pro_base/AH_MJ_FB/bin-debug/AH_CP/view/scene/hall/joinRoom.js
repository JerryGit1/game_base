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
var H_joinRoom = (function (_super) {
    __extends(H_joinRoom, _super);
    function H_joinRoom() {
        return _super.call(this) || this;
    }
    return H_joinRoom;
}(AH_H_joinRoom));
__reflect(H_joinRoom.prototype, "H_joinRoom");
