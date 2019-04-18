/**
 * Created by 韩 on 2017/7/25.
 * 加入房间键盘组件
 */
class AH_H_joinRoomNumBtn extends MyButton{
    public roomNum;
    public num;
    public constructor(btn){
        super("h_numberBarBg");
        this.roomNum = new egret.Bitmap(RES.getRes("h_num"+btn));
        this.roomNum.anchorOffsetX = this.roomNum.width/2;
        this.roomNum.anchorOffsetY =this.roomNum.height/2;

        this.num = btn;
        this.addChild(this.roomNum);
    }
}
