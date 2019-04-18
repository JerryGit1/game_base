/**
 * Created by 伟大的周鹏斌大王 on 2017/7/20.
 *
 * 吃牌组合
 * 多个吃牌
 */
class AH_Game_chiCardGroupView extends BaseView{

    public w:number;
    public list;
    public h;
    protected type;
    public constructor(list:Array<CardModel>,cChiCardModel,w,type){
        super();
        this.type = type;
        /*这以后要加个背景*/
        var bg = new egret.Bitmap(RES.getRes("g_hunBg"));
        bg.scale9Grid = new egret.Rectangle(8,11,54,72);
        bg.x = -6;
        bg.y = -48;
        /*调整牌列表*/
        var i,cardView;
        var newCardList = list;
        if(this.type == 1){
            newCardList=this.getNewCardList(list,cChiCardModel);
        }
        /*显示牌列表*/
        for(i in newCardList){
            cardView=new Game_cardView(1,w);
            cardView.setNewCard(newCardList[i].type,newCardList[i].num);
            this.addChild(cardView);
            cardView.x=1+Number(i)*w+w/2;
            this.h=cardView.h+6;
        }
        this.w=newCardList.length*w;
        this.list=list;

        bg.width = this.w+12;
        this.addChildAt(bg,0);
        // this.graphics.beginFill(0x111111,.9);
        // this.graphics.drawRoundRect(-3,-this.h/2-2,this.w+10,this.h+4,10,10);
        // this.graphics.endFill();
        this.touchEnabled=true;
    }
    /*调整新的牌列表*/
    protected getNewCardList(list,cChiCardModel){
        var arr=[],i,s,num,newCardList=[],_is;
        //加入最新那张牌
        for(i in list){
            arr.push(list[i].num);
        }
        arr.push(cChiCardModel.num);
        //由大到小排序
        for(i=0;i<arr.length-1;i++){
            for(s=i+1;s<arr.length;s++){
                if(arr[i]>arr[s]){
                    num=arr[i];
                    arr[i]=arr[s];
                    arr[s]=num;
                }
            }
        }
        for(i in arr){
            _is=false;
            for(s in list){
                if(list[s].num==arr[i]){
                    newCardList.push(list[s]);
                    _is=true;
                    break;
                }
            }
            if(!_is){
                newCardList.push(cChiCardModel);
            }
        }
        return newCardList;
    }
}
