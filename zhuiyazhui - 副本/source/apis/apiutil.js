import { ApiConfig } from 'apiconfig.js';

export class ApiUtil {

  static renamelist=[];
  static HtmlDecode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\""); 


    s = s.replace(new RegExp("</p>", "gm"), "</p><br />");
    s = s.replace(new RegExp("\"/uploads/", "gm"), "\"" + "https://college.cllsm.top/uploads/");
    console.log(s,"--------------")

    return s;
  }

  static fixRename(ret){
    var renamelist = ApiUtil.renamelist;
    console.log("rename a");
    if (ret instanceof Array){
      for(var i=0;i<ret.length;i++){
        if (ret[i].member_id != undefined && renamelist[ret[i].member_id] != undefined && renamelist[ret[i].member_id] != "") {
          ret[i].member_nickName = renamelist[ret[i].member_id];
        }
        if (ret[i].nickName != undefined && renamelist[ret[i].id] != undefined && renamelist[ret[i].id] != "") {
          ret[i].nickName = renamelist[ret[i].id];
        }
      }
    } else {
      console.log("rename b");
      if (ret.member_id != undefined && renamelist[ret.member_id] != undefined && renamelist[ret.member_id]!=""){
        ret.member_nickName = renamelist[ret.member_id].nickName;
      }
      if (ret.nickName != undefined && renamelist[ ret.id] != undefined && renamelist[ret.id] != "") {
        console.log("rename c");
        ret.nickName = renamelist[ret.id];
      }
    }
    return ret;
  }

  static Toast(toastCtrl, msg) {
    let toast = toastCtrl.create({
      message: msg
    });
    toast.present();
  }

  static FormatDateTime(val) {
    return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() +
      " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
  }
  static FormatDate(val) {
    return val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate() ;
  }

  static IsMobileNo(str) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(str);
  }
  static FormatPercent(val) {
    val = val * 100.0;
    return val.toFixed(2) + '%';
  }
  static FormatPrice(val) {
    val = val * 1.0;
    return val.toFixed(2);
  }
  static FormatNumber(val, digits) {
    val = val * 1.0;
    return val.toFixed(digits);
  }
  static Storage = null;

  static TimeAgo(agoTime) {

  // 计算出当前日期时间到之前的日期时间的毫秒数，以便进行下一步的计算
  var time = (new Date()).getTime() / 1000 - agoTime;

  var num = 0;
  if (time >= 31104000) { // N年前
    num = parseInt(time / 31104000);
    return num + '年前';
  }
  if (time >= 2592000) { // N月前
    num = parseInt(time / 2592000);
    return num + '月前';
  }
  if (time >= 86400) { // N天前
    num = parseInt(time / 86400);
    return num + '天前';
  }
  if (time >= 3600) { // N小时前
    num = parseInt(time / 3600);
    return num + '小时前';
  }
  if (time > 60) { // N分钟前
    num = parseInt(time / 60);
    return num + '分钟前';
  }
  return '1分钟前';
}


  static fixImages(info) {
  var images = [];
  if (info.photo1 != "") {
    images.push(info.photo1);
  }
  if (info.photo2 != "") {
    images.push(info.photo2);
  }
  if (info.photo3 != "") {
    images.push(info.photo3);
  }
  if (info.photo4 != "") {
    images.push(info.photo4);
  }
  if (info.photo5 != "") {
    images.push(info.photo5);
  }
  if (info.photo6 != "") {
    images.push(info.photo6);
  }
  if (info.photo7 != "") {
    images.push(info.photo7);
  }
  if (info.photo8 != "") {
    images.push(info.photo8);
  }
  if (info.photo9 != "") {
    images.push(info.photo9);
  }
  if (info.photo10 != "") {
    images.push(info.photo10);
  }
  if (info.photo11 != "") {
    images.push(info.photo11);
  }
  if (info.photo12 != "") {
    images.push(info.photo12);
  }
  if (info.photo13 != "") {
    images.push(info.photo13);
  }
  if (info.photo14 != "") {
    images.push(info.photo14);
  }
  return images;
}


}