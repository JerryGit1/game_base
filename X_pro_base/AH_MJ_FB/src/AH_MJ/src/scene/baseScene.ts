/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 场景类 基础类
 */
class BaseScene extends BaseView{

    protected model:BaseModel;
    public constructor(model:BaseModel=null){
        super();
        this.model=model;
    }
    /*清理场景*/
    public clear(){

    }
}
