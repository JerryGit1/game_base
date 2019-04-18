/**
 * Created by 韩 on 2017/7/8.
 * 创建房间
 */
class AH_H_createRoom extends BaseView{
    protected createBtn:MyButton;//创建房间按钮;
    public constructor(){
        super();
        this.createBtn = new MyButton("h_createRoom",1);
        this.createBtn.addTouchEvent();
        this.createBtn.addEventListener("click",this.createFn,this);
        this.addChild(this.createBtn);
    }
    protected createFn(){
        PopupLayer.getInstance().createRoom();
    }
}
