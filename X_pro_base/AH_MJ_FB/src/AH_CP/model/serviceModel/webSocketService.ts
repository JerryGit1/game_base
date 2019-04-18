/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
class WebSocketService extends AH_WebSocketService{

    public constructor(){
        super();
        egret["AH_testPort"]=this.testPort.bind(this);
        if(WebSocketService.connection){
            alert("该类不允许创建第二次");
        }
    }
    /*单例*/
    private static connection:WebSocketService;
    public static getInstance(){
        if(!this.connection){
            this.connection=new WebSocketService();

        }
        return this.connection;
    }
}