const app = getApp()
import { AppBase } from "../../appbase";
import {ApiUtil} from "../../apis/apiutil.js";
var WxParse = require('../../wxParse/wxParse');
class Content extends AppBase {
  constructor() {super();}
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    var that = this;
    let cont = wx.getStorageSync("content")||AppBase.instinfo.content||this.Base.getMyData().instinfo.content;
    let content = ApiUtil.HtmlDecode(cont);
    console.log(content)
    WxParse.wxParse('content', 'html',content, that, 10);
    this.Base.setMyData({
      isurl:1,
      inpurl:null,
    })
  }
  onMyShow() {
    var that = this;
    let cont = wx.getStorageSync("content")||this.Base.getMyData().instinfo.content;
    let content = ApiUtil.HtmlDecode(cont);
    console.log(content)
    WxParse.wxParse('content', 'html',content, that, 10);
    this.Base.setMyData({})
    that.popup = that.selectComponent("#popup");
    that.popup.showPopup();
    console.log(that.popup.showPopup())

    wx.getClipboardData({
      success (res){
        if(res.data){
           var isurl = that.CheckUrl(that.getStrUrl(res.data))
           console.log(isurl,'_______________________')
          if(isurl===0){
            that.Base.setMyData({
              inpurl:that.getStrUrl(res.data),
              isurl:that.CheckUrl(that.getStrUrl(res.data))
            })

            wx.showModal({
              title: '提示',
              content: '检测到你已复制链接，是否直接解析！',
              success (res) {
                if (res.confirm) {
                  that.binok()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        }
      }
    })


  }
  onUnload(){
  }
  onShareTimeline() {
    let data ={};
    data.imageUrl="https://college.cllsm.top/uploads/20221124/6542156492720249eb1cfba0ca64d803.png";
    data.title=this.Base.getMyData().instinfo.slogen;
    console.log(data)
    return data;
  }
  showPopup() {
    console.log(this.popup)
    this.popup.showPopup();
  }
  //确认事件
  _success() {
    console.log('你点击了确定');
    this.binok()
    this.popup.hidePopup();
  }
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  }
  showPopup() {
    this.Base.setMyData({ isshow: true });
  }
  binok(e){
    
    // this.popup = that.selectComponent("#popup");
    // this.popup.showPopup();
    let url = this.Base.getMyData().inpurl || null;
    if(url=='' || url== null){
      this.Base.toast("要填写地址哦");
      return
    }else{
      wx.navigateTo({
        url: '/pages/videos/videos?url='+this.Base.getMyData().inpurl
      })
    }

  }
  inp_url(e){
    console.log(e)
    this.Base.setMyData({
      inpurl:e.detail.value
    })
  }
  huif(){
    this.Base.setMyData({
      inpurl:this.getStrUrl(this.Base.getMyData().inpurl)
    }) 
  }
  ouy(){
    this.Base.setMyData({
      inpurl:""
    }) 
    this.Base.toast("清空完成");
  }
  zantie(){
    let that =this;
    wx.getClipboardData({
      success (res){
        console.log(res.data)
        if(res.data){
          that.Base.setMyData({
            inpurl:res.data
          })
        }
      }
    })
  }
  getStrUrl(s) {
    var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    s = s.match(reg);
    return(s&&s.length?s[0]:null);
  }
  CheckUrl(url){
    var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if(!reg.test(url)){
      return 1
    }
    else{
      return 0
    }
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.onUnload = content.onUnload;
body.onShareTimeline = content.onShareTimeline;
body.showPopup = content.showPopup;
body._success = content._success;
body._error = content._error;
body.inp_url = content.inp_url;
body.huif = content.huif;
body.getStrUrl = content.getStrUrl;
body.CheckUrl = content.CheckUrl;
body.zantie = content.zantie;
body.binok =content.binok;
body.ouy = content.ouy;
Page(body)