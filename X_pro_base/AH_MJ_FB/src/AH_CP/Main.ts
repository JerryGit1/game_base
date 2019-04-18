class Main extends AH_Main {
    public static  stageWidth = 1136;
    public static stageHeight = 640;

    /***********2.0.0新增*********/
    public static pro_name="wsw_cs";//项目名称
    public static version="2.0.0";//当前项目版本号
    public constructor() {
        super();
    }
    /***
     * 特殊说明
     * 当前母包   代号-【一号机】  项目名称-【wsw_X_base 】
     * 一号机 产生目的
     *       为了准备以后批量更改后续项目简单快速而生
     *       每个项目特有的属性  方法 功能 单独写在 AH_CP里对应子类里
     *       基础框架文件 AH开头
     *
     * 一号机 分2个文件夹
     *          AH_base_版本号 -存放基础资源
     *          AH_MJ_版本号    -存放底层代码和版本控制器
     *
     * 一号机 版本更改后要及时改AH_Main.ts里的版本号和对上边2文件夹版号更新 要不然声音加载会出问题
     * 一号机 声音播放
     *        基础资源目录下的 不变要注意版本号和路径挂钩 baseUrl="resource/"+Main.AH_MJ_version+"sound/"
     *        当前项目特有资源要动态配置路径 这里不做静态变量声明了
     *
     *
     *
     *
     *
     * */
}