/**
 * Created by Duo Nuo on 2017/1/4.
 * 数据加载
 * 资源加载
 */
class LoadLayer extends AH_LoadLayer{
    /*单例*/
    private static view:LoadLayer;
    public static getInstance(){
        if(!this.view){
            this.view=new LoadLayer();
        }
        return this.view;
    }
}