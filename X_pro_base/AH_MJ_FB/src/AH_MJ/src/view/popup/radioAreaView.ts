/**
 * Created by 韩 on 2017/7/13.
 * 单选框组件
 {"group":"jushu","arr":{"6":[true,"b_p_selected",174,82,90,40],"10":[false,"",274,82,90,40],"16":[false,"",374,82,90,40]}}
 */
class AH_H_radioAreaView extends BaseView{
    protected selected:Array<H_selectBtn>=[];
    public currentValue="";
    public constructor(obj){
        super();
        var _self = this;
        this.initContent(obj);
    }
    protected initContent(obj){
        var clickArea:H_selectBtn;
        for(var key in obj.arr){
            var b1 = obj.arr[key][0];//默认是否远中
            var b2 = obj.arr[key][1];//选中时的图片
            var b3 = obj.arr[key][2];//选中图片的X坐标
            var b4 = obj.arr[key][3];//选中图片的Y坐标
            var b5 = obj.arr[key][4];//可点击区域的宽度
            var b6 = obj.arr[key][5];//可点击区域的高度
            var b7 = obj.arr[key][6];//选项名称
            clickArea = new H_selectBtn(b1,b2,b3,b4,b5,b6,b7);
            clickArea.name = key;
            clickArea.addEventListener("selected",this.setBtns,this);
            this.addChild(clickArea);
            this.selected.push(clickArea);
            if(b1){
                clickArea.setTexture("b_p_selected");
                this.currentValue=clickArea.name;
            }
        }
    }
    protected setBtns(e:egret.Event){
        for(var key in this.selected){
            this.selected[key].setTexture(null);
        }
        var btn:H_selectBtn = e.target;
        btn.setTexture("b_p_selected");
        this.currentValue=btn.name;
    }
}
