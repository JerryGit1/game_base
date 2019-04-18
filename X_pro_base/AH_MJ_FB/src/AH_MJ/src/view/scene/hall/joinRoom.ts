/**
 * Created by 韩 on 2017/7/8.
 * 加入房间
 */
class AH_H_joinRoom extends BaseView{
    protected joinRoomBtn:MyButton;
    constructor(){
        super();
        this.joinRoomBtn = new MyButton("h_joinRoom");
        this.joinRoomBtn.addTouchEvent();
        this.joinRoomBtn.addEventListener("click",this.joinRoomFn,this);
        this.addChild(this.joinRoomBtn);
    }
    protected joinRoomFn(){
        PopupLayer.getInstance().joinRoom();
    }
}