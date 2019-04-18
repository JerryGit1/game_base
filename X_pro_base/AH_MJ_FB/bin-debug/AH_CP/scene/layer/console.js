var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/4/6.
 * <script src="http://www.xingtianji.com/h5/web/release/console/version/AH_tester.js"></script>
 */
var MyConsole = (function (_super) {
    __extends(MyConsole, _super);
    function MyConsole() {
        return _super.call(this) || this;
    }
    MyConsole.getInstance = function () {
        if (!this.console) {
            this.console = new MyConsole();
        }
        return this.console;
    };
    return MyConsole;
}(AH_MyConsole));
__reflect(MyConsole.prototype, "MyConsole");
