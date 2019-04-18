var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super.call(this) || this;
    }
    return Main;
}(AH_Main));
Main.stageWidth = 1136;
Main.stageHeight = 640;
/***********2.0.0新增*********/
Main.pro_name = "wsw_X1"; //项目名称
Main.version = "2.0.0"; //当前项目版本号
__reflect(Main.prototype, "Main");
