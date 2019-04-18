/**
 * 创建者 伟大的周鹏斌大王 on 2017/4/6.
 * <script src="http://www.xingtianji.com/h5/web/release/console/version/AH_tester.js"></script>
 */
class AH_MyConsole {
    protected currentVersionType="demo";
    public _isTrace = false;
    public colorArr = ["#ff0000", "#000", "#00ff00", "#00ffff", "#ccc", "#00cccc", "#cccc00","#ffff00","#00aaaa"];
    public ah_tester;
    public constructor() {

    }
    public start(v){
        if(this.ah_tester)return;
        this._isTrace =true;
        this.currentVersionType=v;
        if (this._isTrace) {
            if(window["ah_tester"]){
                this.ah_tester=window["ah_tester"];
                /**
                 * 启动测试器
                 * proId 项目id  X1 C1 D1
                 * cVersion 当前版本号码 0.0      1.0         2.0         3.0
                 * point 号码显示位置[1-4]左上 左下 右上 右下
                 * direction  1竖屏 2横屏左边 3横屏右边
                 * _isAddContent 是否显示调试控制台 【日志输出，版本信息】
                 * versionType 版本类型【demo（日志不会上传） alpha release】
                 * serverInfo 服务器信息
                 * */
                var _isConsole=true;
                if(this.currentVersionType=="release")_isConsole=false;
                this.ah_tester.start(Main.pro_name,Main.version,4,1,_isConsole,v);
            }
        }
    }
    /**
     * 输出日志
     * obj 内容 字符串 和 object都行
     * type number[0-9]特殊分类类型 0表示报错类型 未来在 宙斯盾使用时候用
     * name obj=object时标记名字（就是为了好区分）
     **/
    public trace(obj, type:any = 1, name = "对象") {
        var self = this, num = 0,str;
        if (this._isTrace) {
            if (typeof obj == "string"){
                log(obj);
                console.log("%c" + obj, "color:" + self.colorArr[Number(type)]);
            }
            else if (typeof obj == "object"&&!obj["hashCode"]) {
                str=JSON.stringify(obj,null,2);
                log(str);
                console.log(name);
                console.log(JSON.parse(str));
            }else{
                console.log("複雜變量無法輸出");
                console.log(obj);
            }
        }
        self = null;
        function log(str) {
            //console.log("%c" + str, "color:" + self.colorArr[Number(type)]);
            /**测试器
             * 填充日志内容
             * str 内容 必须是字符串
             * type 类型（0表示错误类型 分类用到了）
             * userId  用户标识id (总控制台查询用到)
             * */
            str= str.replace(' ', '&nbsp');
            if(this.ah_tester)this.ah_tester.addLog(str,type,self.colorArr[Number(type)]);
        }
    }
}