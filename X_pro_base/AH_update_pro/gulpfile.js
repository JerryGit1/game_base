/**
 * 创建者 伟大的周鹏斌大王
 * 时间 2016/12/8 11:44
 */
/*------------------------需要配置的属性----------------------*/
/*要编译的目录  例：E:a/b/c/  最后一个目录要加/切记切记切记呀小朋友   */
var AH_MJ_Path="";
var debugPath=AH_MJ_Path+"src/AH_MJ/src/";
var debugResourcePath=AH_MJ_Path+"src/AH_MJ/src/";
/*编译后的目录 例：E:a/b/c/  最后一个目录要加/ */
var releasePath="";
var last_path="";
var resourcePath="";
/*不用写入的的文件或者文件夹 文件夹要写2个 1【文件夹】 2【文件夹/**】 */
var noCopyFileList=["debug.html"];
/*----------------------属性--------------------*/
/*【奥幻】母包更新器*/
var  versions="1.0";
var  AH_MJ_version="1.0";
var  AH_config_file_url="AH_config.json";
/*框架主类*/
var gulp = require('gulp');
/*删除文件和文件夹类*/
var del = require('del');
/*框架--顺序执行任务类*/
var runSequence = require('gulp-sequence');
/*cmd命令解析*/
var minimist = require('minimist');
var tipsStr="【奥幻】母包更新器------"+versions+"----------------------------------------------------------------AH_(>_<)--|";

/*捕获cmd命令*/
cmd();
/*要编译的目录为*/
console.log("母包位置:"+debugPath);
/*要编译的目录为*/
console.log("更新位置:"+releasePath);
/*组成编译目录 剔除不需要拷贝的文件*/
var srcList=[debugPath+"**"];
for(var i in noCopyFileList){
    srcList.push("!"+debugPath+"**"+noCopyFileList[i]);
}
/*从命令上获取压缩文件路径*/
function cmd() {
    var knownOptions2 = {
        string: 'releasePath',
        default: { env: process.env.NODE_ENV }
    };
    var options2 = minimist(process.argv.slice(1), knownOptions2);
    if(options2.releasePath){
        last_path=options2.releasePath;
        resourcePath=last_path+"/resource/AH_MJ/";
        releasePath=last_path+"/src/AH_MJ/";
    }
    knownOptions2 = {
        string: 'AH_MHPath',
        default: { env: process.env.NODE_ENV }
    };
    options2 = minimist(process.argv.slice(1), knownOptions2);
    if(options2.AH_MHPath){
        AH_MJ_Path=options2.AH_MHPath;
        debugPath=AH_MJ_Path+"src/AH_MJ/src/";
        debugResourcePath=AH_MJ_Path+"resource/AH_MJ/";
    }
}
/*删除指定目录下代码*/
gulp.task('delete_src', function () {
    //1.3新增 记录编译次数和最新编译时间
    var rf=require("fs");
    var config_file_url=debugPath+"../"+AH_config_file_url;
    rf.exists(config_file_url,function(){
        var data=rf.readFileSync(config_file_url,"utf-8");
        if(data){
            data=JSON.parse(data);
            if(data.updateNum){
                data.updateNum++;/*编译次数++*/
                AH_MJ_version="一号机第"+data.updateNum+"次更新";
                data.newUpdateTime=new Date();/*最新编译时间*/
                console.log(AH_MJ_version);
                /*写入文件*/
                rf.writeFile(config_file_url,JSON.stringify(data, null, 4),function (err) {
                    if (err) throw err ;
                }) ;
            }
        }
    });
    /*删除外部文件 force=true*/
    return del(releasePath,{force:true});
});
/*删除指定目录下资源*/
gulp.task('delete_resource', function () {
    /*删除外部文件 force=true*/
    return del(resourcePath,{force:true});
});
/*拷贝所有代码到指定目录下文件*/
gulp.task('copy_all_src', function () {
    return gulp.src(srcList).pipe(gulp.dest(releasePath));
});
/*拷贝所有资源到指定目录下文件*/
gulp.task('copy_all_resource', function () {
    return gulp.src([debugResourcePath+"**"]).pipe(gulp.dest(resourcePath));
});
/*放置最新版本号文件*/
gulp.task('set_num', function () {
    var str="母包最新更新时间:"+new Date();
    var fs=require("fs");
    fs.writeFile(releasePath+AH_MJ_version+".text", str);
    fs.writeFile(releasePath+"此文件夹禁止修改.text", "请按照说明去母包修改然后更新到当前项目 不懂找周大王!~");
});
/*返回上级目录*/
gulp.task('return_last_path', function () {
    var exec = require('child_process').exec;
    console.log("自动执行:egret build");
    exec('egret build',function (a,b,c) {
        console.log(a,b,c);
        process.exit();
    });
});
/*开始执行*/
gulp.task('default',function (cd) {
    runSequence('delete_src','delete_resource','copy_all_src',"copy_all_resource","set_num","return_last_path",cd);
});
gulp.start("default");
/*------------------自定义方法------------------------*/

function consoleTips(str) {
    console.log(tipsStr+str);
}
