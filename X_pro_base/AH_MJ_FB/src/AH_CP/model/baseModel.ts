/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class BaseModel extends AH_BaseModel{
    public constructor(_addSocket=true,httpService=false){
        super(_addSocket,httpService);
    }
    private static model:BaseModel;
    public static getInstance(){
        if(!this.model){
            this.model=new BaseModel();
        }
        return this.model;
    }
    /*初始化设置静态变量*/
    public static init(){
        BaseModel.GAME_NAME="XX麻将";//游戏名称
    }
}