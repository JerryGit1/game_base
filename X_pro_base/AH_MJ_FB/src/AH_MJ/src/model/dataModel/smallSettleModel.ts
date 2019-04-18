/**
 * Created by TYQ on 2017/7/22.
 */
class AH_SmallSettleModel extends UserModel{
    public userImg:string;
    public zhuang:boolean;
    public userName:string;
    public isWin:boolean;
    public isDian:number;
    public winScore:number;
    public gangScore:number;
    public winInfo;
    public fanInfo;
    public gangListType4;

    public constructor(dataModel){
        super();
        /*-------------------用户信息-------------------*/
        this.setAllParams(dataModel);
        /*------------------牌的信息------------------*/
        /*设置手牌*/
        this.initStopBoard(dataModel);
        /*设置吃碰杠牌*/
        this.initCpgBoard(dataModel);
    }
    protected setAllParams(data){
        this.setParams(data);
    }
    /*设置手牌*/
    protected initStopBoard(dataModel){
        this.setStopBoardNoOrder(dataModel.currentMjList);
    }
    /*设置吃碰杠牌*/
    protected initCpgBoard(dataModel){
        var arr=[];
        this.setCpgBoard(1,dataModel.chiList,arr);//吃
        this.setCpgBoard(2,dataModel.pengList,arr);//碰
        this.setCpgXiaoBoard(3,dataModel.gangListType1,arr);//中发白 杠
        this.setCpgXiaoBoard(4,dataModel.gangListType2,arr);//东南西北 杠
        this.setCpgBoard(5,dataModel.gangListType3,arr);//明杠-（碰杠）
        this.setCpgBoard(6,dataModel.gangListType4,arr);//明杠-（点杠）
        this.setCpgBoard(7,dataModel.gangListType5,arr);//暗杠
        this.setCPGOrder(arr);/*排序*/
    }
}