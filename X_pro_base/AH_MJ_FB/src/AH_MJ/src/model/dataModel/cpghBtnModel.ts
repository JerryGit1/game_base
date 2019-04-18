/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
class AH_CpghBtnModel extends AH_BaseModel{
    /*类型
    0           过
     1           吃
     2           碰
     3           杠
     4           胡*/
    public type:Number;
    public cardList:Array<Array<CardModel>>;/*如果多个吃 选择-没有加入要吃的那张这张牌*/
    public cardJsonInfo:string;/*有操作 返回给后端数据*/
    public huPaiUserId:number;/*胡的时候用*/
    public constructor(){
        super();
    }
    /*设置吃碰杠牌数据*/
    public setCardModel(list){
        this.huPaiUserId=null;
        if(list)this.cardJsonInfo=JSON.stringify(list[0]);//传给后端数据

        if(this.type==1 || this.type == 3){//多个吃处理  And 多个杠处理
            if(list.length>1){
                var i,cardModel;
                this.cardList=[];
                for(i in list){
                    this.cardList[i]=[];
                    for(var s in list[i]){
                        cardModel=new CardModel();
                        cardModel.type=list[i][s][0];
                        cardModel.num=list[i][s][1];
                        this.cardList[i].push(cardModel);
                    }
                }
            }
        }else if(this.type==4){
            this.huPaiUserId=Number(list);
        }
    }
    /*单独设置多个吃牌json数据*/
    public setChiJsonStr(info){
        var arr=[],brr;
        for(var i in info){
            brr=[info[i].type,info[i].num];
            arr.push(brr);
        }
        this.cardJsonInfo=JSON.stringify(arr)
    }
}