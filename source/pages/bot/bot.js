const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null;
// 在页面中定义激励视频广告
let videoAd = null
import {
  AppBase
} from "../../appbase";
import {
  ApiUtil
} from "../../apis/apiutil.js";
var WxParse = require('../../wxParse/wxParse');
import {
  CollegeApi
} from "../../apis/college.api.js";
import {
  MemberApi
} from "../../apis/member.api.js";
import { WechatApi } from '../../apis/wechat.api';


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    var that = this;
    wx.setBackgroundColor({
      backgroundColor: '#ffffff'
    })
    this.Base.setMyData({
      nickName: "",
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
      answertime: "",
      isupdate: false,
      isusedata: wx.getStorageSync("isnickname") || false,
      textareaHeight: 90,
      switchover:true
    })
    const {
      height,
      top
    } = wx.getMenuButtonBoundingClientRect();
    this.Base.setMyData({
      margintop: top,
      funcrowheight: height
    })
    let tipslist = wx.getStorageSync("tips");
    this.Base.setMyData({
      tipslist
    })


    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-90c6231e75da2c65'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-ca124a881e9783bf'
      })
      videoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      videoAd.onError((err) => {
        console.log('激励视频 广告加载失败')
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          this.Base.toast("次数发放成功！")
          var memberapi = new MemberApi();
          memberapi.updatescore({}, (updatescore) => {
            console.log(updatescore)
            that.onMyShow()
            that.onShow();
          })
          that.onMyShow()

        } else {
          this.Base.toast("播放中途退出，次数发放失败！")
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  }

  onMyShow() {
    var that = this;
    var msglist = wx.getStorageSync("dialoguelist")
    let msgdata = wx.getStorageSync("msglist")
    if (msglist.length > 0) {
      for(var i =0;i < msglist.length;i++){

        let cont = msglist[i].answer;
        console.log(typeof cont)
        if(typeof cont!='object'){
          let obj = app.towxml(cont,'markdown',{
            // theme:'dark',
            events:{
              tap:e => {
                console.log('tap',e);
                that.bincopys(cont)
              },
              change:e => {
                console.log('todo',e);
                that.bincopys(cont)
              }
            }
          });
          msglist[i].answer = obj;
        }

      }
    }


    


    this.Base.setMyData({
      dialoguelist: msglist || [],
      msglist: msgdata || []
    })
    wx.hideLoading();
    that.Base.setMyData({
      scrollTop: 500 * 2 * 500000000,
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

    let isnickname = (AppBase.memberinfo.nickname == this.Base.getMyData().UserInfo.openid || AppBase.memberinfo.nickname == '微信昵称' || AppBase.memberinfo.wxnickName == '微信昵称' || AppBase.memberinfo.wxnickName == null);
    console.log(isnickname)
    wx.setStorageSync('isnickname', isnickname)


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
    var that = this;
    var wechatApi = new WechatApi();
    let msg = this.Base.getMyData().messages;
    if (msg == "") {
      this.Base.toast("要填内容哦");
      return
    }
    this.showLoadings()
    let parentMessageId = this.Base.getMyData().parentMessageId || wx.getStorageSync("parentMessageId") || "";
    var msgbot = {
      "prompt": that.Base.getMyData().messages,
      "options": {
        parentMessageId
      },
      "token": that.Base.getMyData().instinfo.wechataccount
    }
    if (this.Base.getMyData().parentMessageId == "") {
      msgbot.options = {};
    }
    this.ismsg(msg)
      .then((label) => {
        if (label !== 100) {
          that.msgseccheck(label)
          that.Base.setMyData({
            messages: ""
          })
          return
        } else {
          that.checkscore()
            .then((score) => {
              console.log(score, "=============================")
              if (score <= 0) {
                console.log("积分不足")
                that.hideLoadings()
                wx.showModal({
                  title: '提示',
                  content: '您所剩的次数不足，请获取次数，当前次数' + score,
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      that.showvideoAd()
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              } else {
                var dialogue = {
                  // question: that.replaceSensitiveWords(msg),
                  question: (msg),
                  answer: "",
                  questiontime: this.getTime()
                };
                that.Base.setMyData({
                  questiontime: this.getTime()
                })
                var weburl = "wss://gpt.cllsm.top:8443";
                if (that.Base.getMyData().instinfo.state == '2') {
                  weburl = "wss://gpt.cllsm.top:5657";
                }

                //     //建立 WebSocket 连接
                var websocket = wx.connectSocket({
                  url: weburl,
                  success: (res) => {
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
                that.Base.setMyData({
                  websocket
                })
                // 监听 WebSocket 错误事件
                wx.onSocketError((res) => {
                  console.error('WebSocket 错误：', res);
                  that.Base.toast("请求失败了");
                  that.hideLoadings();
                });
                wx.onSocketMessage((res) => {
                  // console.log(res.data)
                  that.hideLoadings()
                  this.Base.setMyData({
                    long: true
                  })
                  var datas = JSON.parse(res.data)
                  that.Base.setMyData({
                    answertime: this.getTime(),
                  })
                  if (datas.code == 0) {
                    let msg = datas.data.toString()
                    if (that.Base.getMyData().instinfo.state == '2') {
                      if (msg == '    [error]请登录') {
                        msg = "鸭鸭提醒：请求过于频繁，请过一会再来，鸭鸭等你，要注意休息哦！"
                      }
                      that.Base.setMyData({
                        scrollTop: 500 * 2 * 500000000,
                        // prompt:that.replaceSensitiveWords(msg),
                        prompt: (msg),
                      })
                    } else {
                      let msg = datas.data.toString()
                      const lines = msg.split('\n');
                      const lastLine = lines[lines.length - 1];
                      that.Base.setMyData({
                        scrollTop: 500 * 2 * 500000000,
                        // prompt: that.replaceSensitiveWords(JSON.parse(lastLine).text),
                        prompt: (JSON.parse(lastLine).text),
                        parentMessageId: JSON.parse(lastLine).id,
                      })
                      wx.setStorageSync("parentMessageId", that.Base.getMyData().parentMessageId)
                    }
                    //处理markdown，有问题
                    // let cont = that.replaceSensitiveWords(JSON.parse(lastLine).text);
                    // let content = ApiUtil.HtmlDecode(cont);
                    // WxParse.wxParse('content', 'markdown', content, that, 10);
                  } else {
                    that.Base.setMyData({
                      scrollTop: 500 * 2 * 500000000,
                      prompt: datas.msg,
                    })
                    that.Base.toast("请求失败了")
                  }
                })
                // 监听 WebSocket 连接关闭事件
                wx.onSocketClose(() => {
                  let prompt = that.Base.getMyData().prompt;
                  console.log('WebSocket 连接已关闭');
                  that.Base.toast("请求成功了")
                  this.ismsg(prompt)
                    .then((label) => {
                      if (label != 100) {
                        that.msgseccheck(label)
                        that.Base.setMyData({
                          prompt: "你好，经扫描回答内容，该内容涉及国家法律法规禁止的内容，违反相关法律法规和平台规范，为维护绿色健康的平台生态，坚持正确价值导向"
                        })
                      }
                      dialogue.answer = that.Base.getMyData().prompt;
                      dialogue.answertime = this.getTime();
                      that.Base.getMyData().dialoguelist.push(dialogue)
                      wx.setStorageSync("dialoguelist", that.Base.getMyData().dialoguelist)
                      this.Base.setMyData({
                        long: false
                      })
                      var collegeapi = new CollegeApi();
                      collegeapi.addbotmsg({
                        botmsg: that.Base.getMyData().prompt,
                        usermsg: that.Base.getMyData().messages,
                      }, (res) => {
                        that.Base.setMyData({
                          messages: ""
                        })
                      })
                      wechatApi.reducescore({ openid: that.Base.getMyData().UserInfo.openid, }, (res) => { that.onShow(); console.log(res) })
                      that.onMyShow();
                    })
                    .catch((error) => {
                      console.log(error);
                      that.Base.toast("提交失败请稍后重试！");
                      // 在这里处理错误
                    });
                });
              }
            })
            .catch((error) => {
              console.log(error);
              that.Base.setMyData({
                loadings: true
              })
              that.hideLoadings()
              that.Base.toast("提交失败请稍后重试！");
              // 在这里处理错误
            });

        }
      })
      .catch((error) => {
        console.log(error);
        that.Base.setMyData({
          loadings: true
        })
        that.hideLoadings()
        that.Base.toast("提交失败请稍后重试！");
        // 在这里处理错误
      });

    return




    that.Base.setMyData({
      loadings: true
    })
    if (that.Base.getMyData().loadings) {
      var intervalId = setInterval(function () {
        console.log(that.getRandomInt(0, that.Base.getMyData().tipslist.length))
        let tipslist = that.Base.getMyData().tipslist;
        let tips = tipslist[Number(that.getRandomInt(0, that.Base.getMyData().tipslist.length) - 1)].value;
        that.Base.setMyData({
          tips
        })
      }, 3000);
      that.Base.setMyData({
        intervalId
      })
    }
    var college = new CollegeApi();
    college.aibot2({
      msgbot: encodeURI(JSON.stringify(msgbot))
    }, (data) => {
      if (data.data) {
        that.Base.setMyData({
          long: false
        })
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
        that.Base.setMyData({
          loadings: false
        })
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
        that.Base.setMyData({
          loadings: false
        })
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
        // console.log(res.data)
        // 将 ArrayBuffer 转换成文本
        var text = new TextDecoder('utf-8').decode(res.data)
        // 将文本转换成数组
        // console.log(text)
        const lines = text.split('\n');
        const lastLine = lines[lines.length - 1];
        // console.log(JSON.parse(lastLine))
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
  bincopy(e) {
    console.log(e)

    wx.setClipboardData({
      data: e.currentTarget.dataset.data || e,
      success(res) {
        console.log(res);
      }
    })
  }
  bincopys(e) {
    console.log(e)

    wx.setClipboardData({
      data:  e,
      success(res) {
        console.log(res);
      }
    })
  }
  getUserProfile(e) {
    var that = this;
    var avatarUrl = this.Base.getMyData().avatarUrl || this.Base.getMyData().memberinfo.avatarUrl;
    var nickName = this.Base.getMyData().nickName;
    var openid = this.Base.getMyData().UserInfo.openid;
    if (avatarUrl == null || avatarUrl == undefined) {
      this.Base.toast("请上传头像才能保存哦！");
      return;
    }
    if (nickName == null || nickName == undefined || nickName == '') {
      this.Base.toast("请检查昵称哦！");
      return;
    }
    var str = `是否确认修改`;
    var memberapi = new MemberApi();

    wx.showModal({
      title: '修改提示',
      content: str,
      success: (res) => {
        console.log(res);
        if (res.confirm) {
          memberapi.updatenickname({
            openid,
            nickName,
            avatarUrl
          }, (e) => {
            if (e.code == "1") {
              that.onMyShow()
              that.Base.toast("修改成功");
            } else {
              that.onMyShow()
              that.Base.toast("请换一个昵称后，再次修改")
            }
          });
        }
      },
      fail: (res) => {
        that.onMyShow()
      },
    });
    that.onMyShow()
  }
  msgseccheck(e) {
    var that = this;
    switch (e) {
      case 100:
        break;
      case 10001:
        wx.showModal({
          title: '提示',
          content: '内容包含广告，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20001:
        wx.showModal({
          title: '提示',
          content: '内容包含时政，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20002:
        wx.showModal({
          title: '提示',
          content: '内容包含色情，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20003:
        wx.showModal({
          title: '提示',
          content: '内容包含辱骂，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20006:
        wx.showModal({
          title: '提示',
          content: '内容包含违法犯罪，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20008:
        wx.showModal({
          title: '提示',
          content: '内容包含欺诈，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20012:
        wx.showModal({
          title: '提示',
          content: '内容包含低俗，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 20013:
        wx.showModal({
          title: '提示',
          content: '内容包含版权，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      case 21000:
        wx.showModal({
          title: '提示',
          content: '内容包含其他，为维护绿色健康的平台生态，坚持正确价值导向',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
    }
  }
  ismsg(msg) {
    var memberapi = new MemberApi();
    var that = this;
    return new Promise(function (resolve, reject) {
      memberapi.msgseccheck({
        content: msg,
        version: 2,
        scene: 1,
        openid: that.Base.getMyData().UserInfo.openid,
        type: 'B'
      }, (msgseccheck) => {
        if (!msgseccheck.data.result) { // error checking
          reject(new Error("msgseccheck error"));
          return;
        }
        resolve(msgseccheck.data.result.label);
      })
    });
  }

  checkscore() {
    var wechatApi = new WechatApi();
    var that = this;
    return new Promise(function (resolve, reject) {
      wechatApi.checkscore({
        openid: that.Base.getMyData().UserInfo.openid,
      }, (data) => {
        if (data.code == 0) { // error checking
          reject(new Error("msgseccheck error"));
          return;
        }
        console.log(data.data, "------------------")
        resolve(data.data);
      })
    });
  }
  bin_inp(e) {
    console.log(e)
    this.Base.setMyData({
      nickName: e.detail.value
    })
  }
  bindpic(e) {
    var that = this;
    console.log(e)
    const {
      avatarUrl
    } = e.detail
    this.Base.setMyData({
      avatarUrl
    })
    let uploadpath = this.Base.getMyData().uploadpath;
    this.Base.uploadAvatarUrl("member", avatarUrl, (ret) => {
      console.log(ret)
      that.Base.setMyData({
        avatarUrl: ret
      });
    }, undefined);
  }

  replaceSensitiveWords(text) {
    const sensitiveWords = this.Base.getMyData().sensitiveWords;
    for (const word of sensitiveWords) {
      let words = word.trim();
      if (text.includes(words)) {
        const regex = new RegExp(words, 'g');
        text = text.replace(regex, '*'.repeat(words.length));
      }
    }
    return text;
  }
  showLoadings() {
    var that = this;
    that.Base.setMyData({
      loadings: true
    })
    if (that.Base.getMyData().loadings) {
      var intervalId = setInterval(function () {
        let tipslist = that.Base.getMyData().tipslist;
        let tips = tipslist[Number(that.getRandomInt(0, that.Base.getMyData().tipslist.length) - 1)].value;
        that.Base.setMyData({
          tips
        })
      }, 3000);
      that.Base.setMyData({
        intervalId
      })
    }
  }
  hideLoadings() {
    var that = this;
    this.Base.setMyData({
      loadings: false
    })
    clearInterval(that.Base.getMyData().intervalId);
  }
  stop() {
    //停止响应
    this.Base.getMyData().websocket.close();
  }
  AddHeight() {
    this.Base.setMyData({
      textareaHeight: 200
    })

  }
  ReduceHeight() {
    this.Base.setMyData({
      textareaHeight: 90
    })
  }
  showvideoAd() {

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  }
  bntswitchover(){
    this.Base.setMyData({
      switchover: !this.Base.getMyData().switchover
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
body.getUserProfile = content.getUserProfile;
body.msgseccheck = content.msgseccheck;
body.ismsg = content.ismsg;
body.bin_inp = content.bin_inp;
body.bindpic = content.bindpic;
body.replaceSensitiveWords = content.replaceSensitiveWords;
body.showLoadings = content.showLoadings;
body.hideLoadings = content.hideLoadings;
body.stop = content.stop;
body.AddHeight = content.AddHeight;
body.ReduceHeight = content.ReduceHeight;
body.showvideoAd = content.showvideoAd;
body.checkscore = content.checkscore;
body.bincopys = content.bincopys;
body.bntswitchover = content.bntswitchover;

Page(body)