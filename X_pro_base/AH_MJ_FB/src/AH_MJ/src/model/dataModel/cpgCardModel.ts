/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
class AH_CPGCardModel extends AH_BaseModel{

    public type:Number;/*1吃 2碰 3中发白 杠 4东南西北 杠 5明杠-（碰杠） 6明杠-（点杠）7暗杠*/
    public list:Array<CardModel>=[];
    public time:Number;/*获取时间用来排序*/
    public constructor(){
        super();
    }
}