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
var H_createRoom = (function (_super) {
    __extends(H_createRoom, _super);
    function H_createRoom() {
        return _super.call(this) || this;
    }
    return H_createRoom;
}(AH_H_createRoom));
__reflect(H_createRoom.prototype, "H_createRoom");
