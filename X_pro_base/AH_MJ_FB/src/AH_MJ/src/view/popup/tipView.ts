/**
 * 弹出提示框
 */
class AH_H_tipView extends PopupBaseView{
    public constructor(string,width=280,x?,y?){
        super(false,false);
        var tipBg = new egret.Bitmap(RES.getRes("b_p_tipBg"));
        this.addChild(tipBg);
        this.name="H_tipView";
        var messageTxt=new egret.TextField();
        messageTxt.size=22;
        messageTxt.textColor=0xf7f0df;
        messageTxt.multiline=true;
        messageTxt.wordWrap = true;
        messageTxt.textAlign="left";
        messageTxt.verticalAlign="middle";
        messageTxt.lineSpacing=10;
        messageTxt.width = width;
        // if(x||y){
        //     messageTxt.x = x;
        //     messageTxt.y = y;
        // }else{
            messageTxt.x = 25;
            messageTxt.y = 15;
        // }
        if(string.indexOf("点杠") != -1){
            messageTxt.textFlow = (new egret.HtmlTextParser()).parse(string);
        }else{
            if(width) messageTxt.width=width;
            messageTxt.text=string;
        }
        this.addChild(messageTxt);

        if(messageTxt.height > tipBg.height){
            tipBg.scale9Grid = new egret.Rectangle(34,11,210,66);
        }else{
            tipBg.scale9Grid = new egret.Rectangle(24,19,245,102);//hyh修改9宫格背景
        }
        tipBg.width = messageTxt.width;
        tipBg.height = messageTxt.height+30;
        this.anchorOffsetX = x;
        this.anchorOffsetY = y-30;
    }
}
// import Timer = egret.Timer;
// /**
//  * Created by 韩 on 2017/8/4.
//  * 弹出提示框
//  */
// class H_tipView extends PopupBaseView{
//     constructor(userName,x,y){
//         super();
//         var tipBg = new egret.Bitmap(RES.getRes("g_tip"));
//         this.name="H_tipView";
//         this.anchorOffsetX = tipBg.width/2;
//         this.anchorOffsetY = tipBg.height;
//         var dianT = new egret.TextField();
//         var name = new egret.TextField();
//         name.size = dianT.size = 18;
//         name.multiline = dianT.multiline = true;
//         name.textAlign = dianT.textAlign = "left";
//         name.verticalAlign = dianT.verticalAlign = "middle";
//         name.textColor = 0xCB6F01;
//         dianT.textColor = 0xffffff;
//         dianT.text = "  点杠";
//         name.text = userName;
//         tipBg.scale9Grid = new egret.Rectangle(5,5,95,25);
//         tipBg.width = name.width+60;
//         tipBg.x = x;
//         tipBg.y = y;
//         name.y = dianT.y = tipBg.y + 9;
//         name.x = tipBg.x + 10;
//         dianT.x = name.x +name.width;
//         this.addChild(tipBg);
//         this.addChild(name);
//         this.addChild(dianT);
//     }
// }
