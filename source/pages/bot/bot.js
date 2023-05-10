const app = getApp();
import { AppBase } from "../../appbase";
import { ApiUtil } from "../../apis/apiutil.js";
var WxParse = require('../../wxParse/wxParse');
import { CollegeApi } from "../../apis/college.api.js";
class Content extends AppBase {
  constructor() { super(); }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    wx.setBackgroundColor({ backgroundColor: '#ffffff' })
    this.Base.setMyData({
      dialoguelist: [],
      messages: "",
      msglist: [],
      imgurl: "url(../../images/ltbj1.jpg)",
      loadings: false,
      tips: "小鸭子正在思考中>>>",
      prompt: "",
      parentMessageId: "",
      long: false,
      questiontime: "",
      answertime: ""
    })
    const { height, top } = wx.getMenuButtonBoundingClientRect();
    this.Base.setMyData({
      margintop: top,
      funcrowheight: height
    })
    let tipslist = wx.getStorageSync("tips");
    this.Base.setMyData({ tipslist })

  }

  onMyShow() {
    var that = this;
    var msglist = wx.getStorageSync("dialoguelist")
    let msgdata = wx.getStorageSync("msglist")
    console.log(msglist)
    if(msglist.length>0){
      msglist.forEach((item,index)=>{
        console.log(index,'++++++++++++++++===')
        let cont =  item.answer;
        let content = ApiUtil.HtmlDecode(cont);
         WxParse.wxParse('answerdata'+index, 'markdown',content, that, 10);
         if(index===msglist.length-1){
          var oo = WxParse.wxParseTemArray("listanswerdata",'answerdata',msglist.length,that)
         console.log(oo,'---------------')
        }
      })
    }
    // let listanswerdatapp = oo;
    // listanswerdatapp.forEach((item,index)=>{
    //   msglist.HH =item;
    // })

    // that.Base.getMyData().msglist.forEach(function(item,index){
    //    WxParse.wxParse('content', 'markdown',ApiUtil.HtmlDecode(item.answer), that, 10);
    // })
    this.Base.setMyData({
      dialoguelist: msglist || [],
      msglist: msgdata || []
    })
    wx.hideLoading();
    that.Base.setMyData({
      scrollTop: msglist.length * 10000 * 2 * 5000,
    })
    let query = wx.createSelectorQuery().in(this)
    query.select('.dialogue_bg').boundingClientRect(res => {
      this.setData({
        dialogue_bgheight: res.height
      })
    })
    query.exec(res => { })


    query.select('.page_s').boundingClientRect(res => {
      this.setData({
        page_sheight: res.height,
        aa: 730 - 75 - 32
      })
    })
    query.exec(res => { })


    let imgvalue = wx.getStorageSync("imgvalue");
    this.Base.setMyData({
      imgvalue
    });
  }
  onShareTimeline() {
    let data = {};
    data.imageUrl = "../../images/icons/bots.png";
    data.title = this.Base.getMyData().instinfo.slogen;
    console.log(data)
    return data;
  }
  inpurl(e) {
    var that = this;
    that.Base.setMyData({
      messages: e.detail.value
    })
  }
  onReachBottom() {
    wx.createSelectorQuery().select('.message-box-list').boundingClientRect((rect) => {
      const scrollViewHeight = rect.height;
      const contentHeight = rect.scrollHeight;
      console.log(rect)

      // TODO: 滚动条置底操作
    }).exec();
  }
  okbnt() {
    // this.requestData()
    var that = this;
    let parentMessageId = this.Base.getMyData().parentMessageId || wx.getStorageSync("parentMessageId") || "";
    var msgbot = {
      "prompt": that.Base.getMyData().messages,
      "options": { parentMessageId },
    }
    if (this.Base.getMyData().parentMessageId == "") {
      msgbot.options = {};
    }
    let msg = this.Base.getMyData().messages;
    if (msg == "") {
      this.Base.toast("要填内容哦");
      return
    }
    let dialogue = {
      question: msg,
      answer: "",
      questiontime: this.getTime()
    };
    that.Base.setMyData({
      questiontime: this.getTime()
    })
    //     //建立 WebSocket 连接
    var websocket = wx.connectSocket({
      url: 'wss://gpt.cllsm.top:8443',
      success: (res) => {
        that.Base.setMyData({ loadings: true })
        if (that.Base.getMyData().loadings) {
          var intervalId = setInterval(function () {
            console.log(that.getRandomInt(0, that.Base.getMyData().tipslist.length))
            let tipslist = that.Base.getMyData().tipslist;
            let tips = tipslist[Number(that.getRandomInt(0, that.Base.getMyData().tipslist.length) - 1)].value;
            that.Base.setMyData({ tips })
          }, 3000);
          that.Base.setMyData({ intervalId })
        }


        console.log('WebSocket connected')
        wx.onSocketOpen(() => {
          console.log('WebSocket opened')
          // 发送消息
          wx.sendSocketMessage({
            data: JSON.stringify(msgbot),
            success: function () {
              console.log('WebSocket message sent');
            }
          });
        })
      }


    })
    wx.onSocketMessage((res) => {
      that.Base.setMyData({
        answertime: this.getTime(),
      })
      this.Base.setMyData({ loadings: false })
      this.Base.setMyData({ long: true })
      clearInterval(that.Base.getMyData().intervalId);
      var datas = JSON.parse(res.data)
      if (datas.code == 0) {
        let msg = datas.data.toString()
        const lines = msg.split('\n');
        const lastLine = lines[lines.length - 1];
        that.Base.setMyData({
          scrollTop: 10000 * 2 * 5000,
          prompt: JSON.parse(lastLine).text,
          parentMessageId: JSON.parse(lastLine).id,
        })
        wx.setStorageSync("parentMessageId", that.Base.getMyData().parentMessageId)
        // that.onMyShow()

        let cont = JSON.parse(lastLine).text;
        let content = ApiUtil.HtmlDecode(cont);
         WxParse.wxParse('content', 'markdown',content, that, 10);
      } else {
        that.Base.setMyData({
          scrollTop: 10000 * 2 * 5000,
          prompt: datas.msg,
        })
        that.Base.toast("请求失败了")
        // that.onMyShow()
      }
      dialogue.answer = that.Base.getMyData().prompt;
      dialogue.answertime = this.getTime();
    })

    // 监听 WebSocket 错误事件
    wx.onSocketError((res) => {
      console.error('WebSocket 错误：', res);
      that.Base.toast("请求失败了")
      this.Base.setMyData({ loadings: false })
      clearInterval(that.Base.getMyData().intervalId);
      this.Base.toast("提交失败请稍后重试！");
    });

    // 监听 WebSocket 连接关闭事件
    wx.onSocketClose(() => {
      console.log('WebSocket 连接已关闭');
      that.Base.toast("请求成功了")
      that.Base.getMyData().dialoguelist.push(dialogue)
      wx.setStorageSync("dialoguelist", that.Base.getMyData().dialoguelist)
      that.Base.setMyData({ messages: "" })
      this.Base.setMyData({ long: false })
      that.onMyShow();
    });


    return




    that.Base.setMyData({ loadings: true })
    if (that.Base.getMyData().loadings) {
      var intervalId = setInterval(function () {
        console.log(that.getRandomInt(0, that.Base.getMyData().tipslist.length))
        let tipslist = that.Base.getMyData().tipslist;
        let tips = tipslist[Number(that.getRandomInt(0, that.Base.getMyData().tipslist.length) - 1)].value;
        that.Base.setMyData({ tips })
      }, 3000);
      that.Base.setMyData({ intervalId })
    }
    var college = new CollegeApi();
    college.aibot2({ msgbot: encodeURI(JSON.stringify(msgbot)) }, (data) => {
      if (data.data) {
        that.Base.setMyData({ long: false })
        console.log(data.data)
        // const str = '第一行\n第二行\n最后一行';
        // const responseTextRepace = data.data.replace(/^\s*$(?:\r\n?|\n)/gm, '@').replace(/[DONE]/g, '').replace(/data:/g, '').slice(0, -1).replace(/[DONE]/g, '');
        // const responseTextRepaceArr = responseTextRepace.split('@');
        // let content = '';
        // responseTextRepaceArr.pop();
        // responseTextRepaceArr.forEach((item) => {
        //   // console.log(JSON.parse(item))
        //   if (JSON.parse(item).choices[0].delta.content) {
        //     content = content + JSON.parse(item).choices[0].delta.content;
        //     console.log(content)
        //   }
        // });
        that.Base.setMyData({
          answertime: that.getTime()
        })
        that.Base.setMyData({ loadings: false })
        clearInterval(that.Base.getMyData().intervalId);
        that.Base.setMyData({
          scrollTop: 10000 * 2 * 5000,
          prompt: data.data.text,
          parentMessageId: data.data.id,
        })
        wx.setStorageSync("parentMessageId", that.Base.getMyData().parentMessageId)
        dialogue.answer = data.data.text;
        dialogue.answertime = that.getTime();

        that.Base.getMyData().dialoguelist.push(dialogue)
        wx.setStorageSync("dialoguelist", that.Base.getMyData().dialoguelist)

        // wx.setStorageSync("msglist", that.Base.getMyData().msglist)
        that.Base.setMyData({
          data: data.data,
          messages: ""
        })
        // that.requestData(msgbot)
        that.onMyShow();

        // if (that.Base.getMyData().msglist.length == 9) {
        //   that.Base.getMyData().msglist.push(assistantmsg)
        //   wx.setStorageSync("msglist", that.Base.getMyData().msglist)
        // } else if (that.Base.getMyData().msglist.length >= 10) {
        //   that.Base.getMyData().msglist.push(assistantmsg)
        //   var newData = that.Base.getMyData().msglist.slice(2);
        //   wx.setStorageSync("msglist", newData)
        // } else {
        // }
      } else {
        that.Base.setMyData({ loadings: false })
        clearInterval(that.Base.getMyData().intervalId);
        that.Base.toast("提交失败请稍后重试！");
      }
      wx.hideLoading();
    })












  }
  requestData() {
    var msgbot = {
      "prompt": '写一篇作文我的爸爸，500字',
      "options": {},
      "systemMessage": "You are 追鸭追, A large language model based on chatGPT3.5. Follow the user's instructions carefully. Respond using markdown."
    }
    wx.request({
      url: 'http://198.44.185.221:1002/api/chat-process', // 流媒体地址
      data: msgbot,
      method: "POST",
      Range: 'bytes=300',
      header: {
        'content-type': 'application/json' // 默认值
      },
      responseType: 'arraybuffer', // 指定响应数据类型为 ArrayBuffer
      success: function (res) {
        console.log(res.data)
        // 将 ArrayBuffer 转换成文本
        var text = new TextDecoder('utf-8').decode(res.data)
        // 将文本转换成数组
        console.log(text)
        const lines = text.split('\n');
        const lastLine = lines[lines.length - 1];
        console.log(JSON.parse(lastLine))
        // 获取响应流
        // let msg = res.data.toString('utf-8')
        // const str = '第一行\n第二行\n最后一行';
        // const lines = msg.split('\n');
        // const lastLine = lines[lines.length - 1];
        // console.log(JSON.parse(lastLine))
      }
    })
  }



  bntcol() {
    var that = this;
    wx.showModal({
      title: '追鸭追提醒',
      content: '确认删除全部记录？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.Base.setMyData({
            dialoguelist: [],
            msglist: [],
            parentMessageId: ""
          })
          wx.setStorageSync("dialoguelist", that.Base.getMyData().dialoguelist)
          wx.setStorageSync("msglist", that.Base.getMyData().msglist)
          wx.setStorageSync("parentMessageId", that.Base.getMyData().parentMessageId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
  About() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
  getTime() {
    // 创建日期对象
    var now = new Date();

    // 获取年、月、日、小时、分钟和秒
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    // 格式化为字符串
    return (month < 10 ? '0' : '') + month + '月' +
      (day < 10 ? '0' : '') + day + '日' + ' ' +
      (hour < 10 ? '0' : '') + hour + ':' +
      (minute < 10 ? '0' : '') + minute;
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  lastIndexOf(str, char, fromIndex = str.length - 2) {
    for (let i = fromIndex; i >= 0; i--) {
      if (str[i] === char) {
        // return i;
      }
    }
    return -1;
  }
  bincopy(e){
    console.log(e)

    wx.setClipboardData({
      data: e.currentTarget.dataset.data,
      success (res) {
        console.log(res);
      }
    })
  }







}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.okbnt = content.okbnt;
body.inpurl = content.inpurl;
body.bntcol = content.bntcol;
body.onShareTimeline = content.onShareTimeline;
body.getTime = content.getTime;
body.onReachBottom = content.onReachBottom;
body.About = content.About;
body.getRandomInt = content.getRandomInt;
body.lastIndexOf = content.lastIndexOf;
body.requestData = content.requestData;
body.bincopy = content.bincopy;
Page(body)