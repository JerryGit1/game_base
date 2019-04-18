/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 * 吃碰杠 牌
 */
class AH_Game_cpgCardView extends BaseView{

    protected cardStr:string;/*牌型字符串 检查变化用的*/
    public w:number=0;
    public h:number=0;
    public cpgCards:Array<Game_cardView>=[];
    protected twoPoint:egret.Point=new egret.Point();/*第二张牌坐标*/
    public skewing:number=0;
    public maxSkewing=0;
    public constructor(){
        super();
    }
    /*数据显示视图*/
    public setCardData(model:CPGCardModel,position=1,w=0,skewing=0){
        if(model){
            this.visible=true;
            this.skewing=skewing;
            var arr=model.list;
            var str=model.type+"";
            for(var i in arr){
                str+=arr[i].type+"_"+arr[i].num+"-";
            }
            if(this.cardStr!=str){/*对比变化*/
                //移除老牌
                this.clearOldCard();
                this.cardStr=str;
                /*刷新视图*/
                switch(model.type){
                    case 1://吃
                        // list中最后一张是吃的牌 讲吃的牌放到中间位置 hyh
                        var newList = new Array();
                        newList[0] = model.list[0];
                        newList[1] = model.list[2];
                        newList[2] = model.list[1];
                        this.addChiOrPeng(position,w,newList,true);
                        break;
                    case 2://碰
                        this.addChiOrPeng(position,w,model.list);
                        break;
                    case 3://中发白 杠\
                        this.addXiao(position,w,model.list,3);
                        break;
                    case 4://东南西北 杠
                        this.addXiao(position,w,model.list,4);
                        break;
                    case 5://明杠-（碰杠）
                        this.addMingOrAnGang(position,w,model.list);
                        break;
                    case 6://明杠-（点杠）
                        this.addMingOrAnGang(position,w,model.list);
                        break;
                    case 7://暗杠
                        this.addMingOrAnGang(position,w,model.list);
                        break;
                }
            }
        }else{
            this.visible=false;
        }
    }
    /*显示吃和碰*/
    protected addChiOrPeng(position,w,list:Array<CardModel>,isSec=false){
        //显示通用3张
        this.addThreeCard(position,w,list,isSec);
    }
    /*显示和明杠暗杠*/
    protected addMingOrAnGang(position,w,list:Array<CardModel>){
        //显示通用3张
        this.addThreeCard(position,w,list);
        //第四张放到 第二张位置
        var cardView=this.createCard(list[3].type,list[3].num,w,position);
        this.addChild(cardView);
        switch(position){/*风向 东 南 西 北*/
            case 1:
                cardView.x=this.twoPoint.x;
                cardView.y=this.twoPoint.y-cardView.h*.13;
                break;
            case 2:
                cardView.x=this.twoPoint.x-3;
                cardView.y=this.twoPoint.y-10;
                this.w*=.9;
                break;
            case 3:
                cardView.x=this.twoPoint.x;
                cardView.y=this.twoPoint.y-cardView.h*.23;
                break;
            case 4:
                cardView.x=this.twoPoint.x+3;
                cardView.y=this.twoPoint.y-10;
                this.w*=.9;
                break;
        }

    }
    /*显示小杠*/
    protected addXiao(position,w,list:Array<CardModel>,len){
        var i,s,num,x=0,y=0,p,minW=Math.floor(w*.5),dis;
        this.w=Math.abs(minW*len);//当前这组牌的总 宽度
        this.maxSkewing=Math.abs(len*this.skewing);//当前这组牌的总 偏移量

        for(i=0;i<len;i++){
            num=list[i].num;
            if(!this["sp_"+num]){
                this["sp_"+num]=new egret.Sprite();
                if(position==4){
                    this.addChild(this["sp_"+num]);
                }else{
                    this.addChildAt(this["sp_"+num],0);
                }
            }
            y=0;

            x=-i*this.skewing;
            this["sp_"+num].x=x;//偏移量

            for(s in list){
                if(list[s].num==num){
                    var cardView=this.createCard(list[s].type,list[s].num,w,position);
                    this.addChildAt(cardView,10-num*5);
                    switch(position){/*风向 东 南 西 北*/
                        case 1:
                            dis = Math.floor(w*.8);
                            cardView.x=x=i*dis;
                            cardView.y=y;
                            y-=cardView.h*.13;
                            this.h=cardView.h;
                            this.w=len*dis;
                            this.addChild(cardView);
                            break;
                        case 2:
                            this["sp_"+num].y=-minW*i;//东和西之间的间距
                            cardView.y=y;
                            this["sp_"+num].addChild(cardView);
                            y-=minW*.4;//东和东之间间距 每层间距
                            break;
                        case 3:
                            dis = Math.floor(w*.8);
                            cardView.x=x=-i*dis;
                            cardView.y=y;
                            y-=cardView.h*.13;
                            this.h=cardView.h;
                            this.w=dis*len;
                            this.addChild(cardView);
                            break;
                        case 4:
                            this["sp_"+num].y=minW*i;//东和西之间的间距
                            cardView.y=y;
                            this["sp_"+num].addChild(cardView);
                            y-=minW*.4;//东和东之间间距 每层间距
                            break;
                    }
                }
            }
        }
    }
    /*-------------------------------------------------------*/
    /*显示前3张牌 吃 碰 杠都一样*/
    protected addThreeCard(position,w,list:Array<CardModel>,isSec=false){
        var cardView,i,x=0;

        var y=0;
        for(i=0;i<3;i++){
            cardView=this.createCard(list[i].type,list[i].num,w,position);
            if(i==1 && isSec) cardView.alpha = 0.8;
            if(position==2){
                this.addChildAt(cardView,0);
            }else{
                this.addChild(cardView);
            }
            if(position==1){
                cardView.x=x;
                x+=w*.8;
                this.w=Math.abs(x);
            }else if(position==2){
                cardView.y=y;
                y-=w*.5;
                cardView.x=x;
                x-=this.skewing;
                this.w=Math.abs(y);
                this.maxSkewing=Math.abs(x);
            }else if(position==3){
                cardView.x=x;
                x-=w*.8;
                this.w=Math.abs(x);
            }else if(position==4){
                cardView.y=y;
                y+=w*.5;
                cardView.x=x;
                x-=this.skewing;
                this.w=Math.abs(y);
                this.maxSkewing=Math.abs(x);
            }
            this.h=cardView.h;
            if(i==1){
                this.twoPoint.x=cardView.x;
                this.twoPoint.y=cardView.y;
            }
        }

    }
    /*创建一张牌*/
    protected createCard(cardType,cardNum,w,position){
        var bgType;
        if(cardNum==-1){/*暗杠*/
            bgType="ag_"+position;
        }else{
            //每张牌背景类型
            bgType="cpMG_"+position;
        }
        var cardView=new Game_cardView(bgType,w);
        cardView.setNewCard(cardType,cardNum);
        cardView.setPlayCardRotation(position);
        this.cpgCards.push(cardView);
        return cardView;
    }
    /*清空老牌*/
    protected clearOldCard(){
        var len=this.numChildren;
        for(var i=0;i<len;i++){
            this.removeChildAt(0);
        }
        for(i=0;i<=4;i++){
            this["sp_"+i]=null;
        }
    }

}
