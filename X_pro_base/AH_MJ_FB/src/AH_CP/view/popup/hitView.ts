/**
 * Created by TYQ on 2017/7/7.
 * 小提示框
 * 修改：韩月辉 2017
 */
class Hint_View extends AH_Hint_View{
    public constructor(str,backFunc=null,_isAddCloseBtn =true,type="min",runBackFunc=null){
        super(str,backFunc,_isAddCloseBtn,type,runBackFunc);
    }
}