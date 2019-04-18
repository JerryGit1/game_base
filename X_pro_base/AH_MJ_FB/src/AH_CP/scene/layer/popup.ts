/**
 * Created by Administrator on 2016/12/19.
 */
class PopupLayer extends AH_PopupLayer{
    private static tanchuang:PopupLayer;
    public static getInstance(){
        if(!this.tanchuang){
            this.tanchuang=new PopupLayer();
        }
        return this.tanchuang;
    }
}