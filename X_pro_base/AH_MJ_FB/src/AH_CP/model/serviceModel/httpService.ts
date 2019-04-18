/**
 * Created by 周鹏斌大王 2017/10/23
 */
class HttpService extends AH_HttpService{
    public constructor(){
        super();
    }
    /*单例*/
    private static service:HttpService;
    public  static getInstance(){
        if(!this.service){
            this.service=new HttpService();
        }
        return this.service;
    }
}