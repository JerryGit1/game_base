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
var H_joinRoomNumBtn = (function (_super) {
    __extends(H_joinRoomNumBtn, _super);
    function H_joinRoomNumBtn(btn) {
        return _super.call(this, btn) || this;
    }
    return H_joinRoomNumBtn;
}(AH_H_joinRoomNumBtn));
__reflect(H_joinRoomNumBtn.prototype, "H_joinRoomNumBtn");
