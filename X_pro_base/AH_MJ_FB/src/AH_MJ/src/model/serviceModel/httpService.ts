/**
 * Created by Duo Nuo on 2016/9/7.
 */
class AH_HttpService extends AH_baseService{
    public rechargeUrl:string = "http://192.168.1.156:8082/clubServer";
    public constructor(){
        super();
    }
    /*获取回放数据 2.1.4*/
    public getPlayBackData(url,backFun){
        this.http(url,null,backFun);
    }
}