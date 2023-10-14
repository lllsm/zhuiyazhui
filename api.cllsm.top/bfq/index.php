<?php
error_reporting(0);
header('Content-type:text/html;charset=utf-8');
$url=$_GET["url"];
if(!isset($url)){exit("请带参数运行!<br>例:?url=视频地址!");}
if (empty($url)) {
  exit("请带参数运行!<br>例:?url=视频地址!");
  } else {
        $preg = "/^http(s)?:\\/\\/.+/";
        $type = '';
        $cpurl = str_replace('/?url=','',$_SERVER["REQUEST_URI"]);
        if(preg_match($preg,$url)){//判断是否为网址
        if(strstr($cpurl, '.m3u8')==true || strstr($cpurl, '.mp4')==true || strstr($cpurl, 'video_mp4')==true || strstr($cpurl, '.flv')==true){
        $type = $cpurl;//m3u8 mp4 flv 等直链 无需填写json接口
        }}
        if($type == ''){
        $fh = get_url("https://api.sb-tencent.cn/dsp/?url=".$url);//json接口
        $jx = json_decode($fh, true);
        $type = $jx['data']['url'];//传入数据 短视频去水印在data下url所以我们填['data']['url']
        }
        }
if($type == ''){
        exit('<html><title>ckplayerx3播放器</title><meta name="robots" content="noarchive">
<style>h1{color:#FFFFFF; text-align:center; font-family: Microsoft Jhenghei;}p{color:#CCCCCC; font-size: 1.2rem;text-align:center;font-family: Microsoft Jhenghei;}</style>
<body bgcolor="#000000"><table width="100%" height="100%" align="center"><td align="center"><h1>解析失败，请刷新重试或检查地址~</font><font size="2"></font></p></table></body><script src="jquery.min.js"></script><script>$("#my-loading", parent.document).remove();</script></html>');
    }//
    function get_url($url) {
    $curl = curl_init();
    //1.初始化，创建一个新cURL资源
    $UserAgent = $_SERVER['HTTP_USER_AGENT'];
    curl_setopt($curl, CURLOPT_URL, $url);
    // 设置超时限制防止死循环
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);
    //在发起连接前等待的时间，如果设置为0，则无限等待。
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    //设定是否显示头信息
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    //启用时会将服务器服务器返回的"Location: "放在header中递归的返回给服务器,设置可以302跳转
    $http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
    curl_setopt($curl, CURLOPT_REFERER, $http_type. $_SERVER['SERVER_NAME'].':'. $_SERVER['SERVER_PORT']. $_SERVER['REQUEST_URI']);
    //构造来路
    curl_setopt($curl, CURLOPT_USERAGENT, $UserAgent);
    curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
    //gzip压缩内容
    $data = curl_exec($curl);
     // 抓取URL并把它传递给浏览器
    curl_close($curl);
    return $data;
}
if(strstr($jx['url'],'.m3u8')){
        $houchuo="m3u8";
}
if(strstr($cpurl,'.m3u8')){
        $houchuo="m3u8";
}
if(strstr($jx['url'],'.flv')){
        $houchuo="flv";
}
if(strstr($cpurl,'.flv')){
        $houchuo="flv";
}
if(strstr($jx['url'],'.mp4')){
        $houchuo="";
}
if(strstr($jx['url'],'video_mp4')){
        $houchuo="";
}
if(strstr($cpurl,'.mp4')){
        $houchuo="";
}
if(strstr($cpurl,'video_mp4')){
        $houchuo="";
}
?>
<html>
<head>
<meta charset="utf-8">
<title>ckplayerx3播放器</title>
<meta name="referrer" content="no-referrer">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="stylesheet" type="text/css" href="ckplayer.css">
<script type="text/javascript" charset="utf-8" src="ckplayer.js"></script>
<script type="text/javascript" charset="utf-8" src="setting.js"></script>
</head>
<body style="margin:0px;padding:0px;">
<div id="ck"></div>
<script type="text/javascript">
var url="<?php echo $type;?>";
var ok=new Ckey({
container:"#ck", //容器的ID或className
<?php
function is_mobile(){
$regex_match="/(nokia|iphone|android|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|";
$regex_match.="htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|";
$regex_match.="blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|";
$regex_match.="symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|";
$regex_match.="jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220";
$regex_match.=")/i";
return isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE']) or preg_match($regex_match, strtolower($_SERVER['HTTP_USER_AGENT']));
}
$is_mobile=is_mobile();
if($is_mobile){
echo "autoplay:false,";
}else{
echo "autoplay:true,";
}
?>//自动播放
webFull:true,//全屏
playbackrateOpen:true,//倍速
seek:"cookie",//指定跳转到cookie记录的时间，使用该属性必需配置属性cookie
cookie:"<?php echo md5($url);?>",//cookie名称,请在同一域中保持唯一
live:false,//直播模式
plug:"<?php echo $houchuo;?>",//加载插件
video:url,
});
ok.ended(function(){
window.location.reload();}
);
</script>
</body>
</html>