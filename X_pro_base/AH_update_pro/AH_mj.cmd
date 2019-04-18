::禁止输出echo
@echo off
::母包目录 ?
set AH_MHPath=D:/zhoudw/AH_local/excalibur/web/X_pro_base/AH_MJ_FB/
::nodejs命令目录?
set gulpfile_Path=D:/zhoudw/AH_local/excalibur/web/X_pro_base/AH_update_pro/gulpfile.js
::编译后的目录
set releasePath=%cd%
::跳转压缩gulp代码目录
::执行压缩
node %gulpfile_Path% --releasePath %releasePath% --AH_MHPath %AH_MHPath%

