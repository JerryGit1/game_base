/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
class AH_CardModel extends AH_BaseModel{

    public type:number;/*类型 1万 2饼 3条 4风牌（东南西北） 5箭牌（中发白）*/
    public num:number;/*值*/
    public _isSystemCard:boolean=false;/*是否是刚发的系统手牌*/
    public _isHunPai:boolean=false;
    public constructor(){
        super();
    }
}