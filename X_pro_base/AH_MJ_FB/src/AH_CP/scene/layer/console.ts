/**
 * 创建者 伟大的周鹏斌大王 on 2017/4/6.
 * <script src="http://www.xingtianji.com/h5/web/release/console/version/AH_tester.js"></script>
 */
class MyConsole extends AH_MyConsole {
    public constructor() {
        super();
    }
    /*单例*/
    private static console:MyConsole;
    public static getInstance() {
        if (!this.console) {
            this.console = new MyConsole();
        }
        return this.console;
    }
}