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
import {
  WechatApi
} from '../../apis/wechat.api';


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
      textareaHeight: 90,
      switchover: true
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
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
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
          this.Base.toast("积分发放成功！")
          var memberapi = new MemberApi();
          memberapi.updatescore({}, (updatescore) => {
            console.log(updatescore)
            that.onMyShow()
            that.onShow();
          })
          that.onMyShow()

        } else {
          this.Base.toast("播放中途退出，积分发放失败！")
          // 播放中途退出，不下发游戏奖励
        }
      })
    }

    let ee = decodeURIComponent(('data: 15d0b6f46f18ce9ec7af32d4ea28da594a51a13f1fdb85228cff7c3e662bcb628e7e9a075c1aeb97071ae0f879c078a1'))
    console.log(ee,"--------------------7777777777-------------")



  }

  onMyShow() {
    var that = this;
    let isnickname = (AppBase.memberinfo.nickname == this.Base.getMyData().UserInfo.openid || AppBase.memberinfo.nickname == '微信昵称' || AppBase.memberinfo.wxnickName == '微信昵称' || AppBase.memberinfo.wxnickName == null);
    console.log(isnickname)
    wx.setStorageSync('isnickname', isnickname)
    this.Base.setMyData({
      isusedata: wx.getStorageSync("isnickname") || false,
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
    query.exec(res => {})


    query.select('.page_s').boundingClientRect(res => {
      this.setData({
        page_sheight: res.height,
        aa: 730 - 75 - 32
      })
    })
    query.exec(res => {})
    let imgvalue = wx.getStorageSync("imgvalue");
    this.Base.setMyData({
      imgvalue
    });
  }
  onShareTimeline() {
    let data = {};
    data.imageUrl = "https://college.cllsm.top/uploads/20230731/317acb6b257e40e2df5d44d8132287df.png";
    data.title = this.Base.getMyData().instinfo.slogen;
    console.log(data)
    return data;
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
    this.showLoadings()
    that.checkscore()
      .then((score) => {
        if (score <= 0) {
          console.log("积分不足")
          that.hideLoadings()
          wx.showModal({
            title: '提示',
            content: '您所剩的积分不足，请获取积分，当前积分' + score,
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
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success: (res) => {
              // 选择成功后，调用后端接口进行PDF转DOCX
              wx.uploadFile({
                url: 'https://gpt.cllsm.top:4080/convert', // 修改为你的后端接口地址
                filePath: res.tempFiles[0].path,
                name: 'file',
                success: (res) => {
                  console.log(res)
                  // 转换成功后，获取返回的DOCX文件并保存到本地
                  that.Base.setMyData({
                    filePath: JSON.parse(res.data).docx_path
                  })
                  var str = that.Base.getMyData().filePath
                  var index = str.indexOf(".");
                  if (index !== -1) {
                    var result = str.substr(0, index) + str.substr(index + 1);
                    console.log(result);
                  } else {
                    console.log(str);
                  }
                  var filePath = result;

                  wx.downloadFile({
                    url: `https://gpt.cllsm.top:4080${filePath}`, // 修改为你的后端接口地址
                    success: (res) => {
                      that.hideLoadings()
                      // 打开文档
                      wx.openDocument({
                        filePath: res.tempFilePath,
                        fileType: 'docx',
                        success: function (res) {
                          console.log('打开文档成功')
                          wx.showToast({
                            title: '打开文档成功',
                            icon: 'success',
                          });
                        },
                        fail: function (res) {
                          wx.showToast({
                            title: '打开文档失败',
                            icon: 'success',
                          });
                        }
                      });
                      wx.showModal({
                        title: '提示',
                        content: '确认复制下载链接，如打开失败可粘贴链接到浏览器直接下载',
                        showCancel: false,
                        confirmText: "复制链接",
                        success(res) {
                          if (res.confirm) {
                            wx.setClipboardData({
                              data: `https://gpt.cllsm.top:4080${filePath}`,
                              success(res) {
                                wx.showToast({
                                  title: '下载链接已复制',
                                  icon: 'none'
                                })
                              }
                            })
                          }
                        },
                        fail: function (res) {
                          console.log(res, "是啊")
                        }
                      })



                      // 保存文件
                      wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: (res) => {
                          wx.showToast({
                            title: '文件保存成功',
                            icon: 'success',
                          });
                        },
                      });
                      wechatApi.reducescore({
                        openid: that.Base.getMyData().UserInfo.openid,
                      }, (res) => {
                        that.onShow();
                        console.log(res)
                      })
                    },
                    fail: function (res) {
                      that.onShow()
                      wx.showToast({
                        title: '转换失败',
                        icon: 'success',
                      });
                    }
                  });
                },
                fail: function (res) {
                  that.onShow()
                  wx.showToast({
                    title: '转换失败',
                    icon: 'success',
                  });
                }
              })




            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        that.hideLoadings()
        that.Base.toast("转换失败请稍后重试！");
        // 在这里处理错误
      });

  }
  bntjpg() {
    var that = this;
    var wechatApi = new WechatApi();
    this.showLoadings()
    that.checkscore()
      .then((score) => {
        if (score <= 0) {
          console.log("积分不足")
          that.hideLoadings()
          wx.showModal({
            title: '提示',
            content: '您所剩的积分不足，请获取积分，当前积分' + score,
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
          wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success: (res) => {
              // 选择成功后，调用后端接口进行PDF转DOCX
              wx.uploadFile({
                url: 'https://gpt.cllsm.top:4080/converttojpg', // 修改为你的后端接口地址
                filePath: res.tempFiles[0].path,
                name: 'file',
                success: (res) => {
                  console.log(res)
                  // 转换成功后，获取返回的DOCX文件并保存到本地
                  that.Base.setMyData({
                    filePath: JSON.parse(res.data).zip_filename
                  })
                  var filePath = that.Base.getMyData().filePath
                  wx.downloadFile({
                    url: `https://gpt.cllsm.top:4080/downloadzip/${filePath}`, // 修改为你的后端接口地址
                    success: (res) => {
                      that.hideLoadings()
                      wx.showModal({
                        title: '提示',
                        content: '确认复制下载链接，如打开失败可粘贴链接到浏览器直接下载',
                        showCancel: false,
                        confirmText: "复制链接",
                        success(res) {
                          if (res.confirm) {
                            wx.setClipboardData({
                              data: `https://gpt.cllsm.top:4080/downloadzip/${filePath}`,
                              success(res) {
                                wx.showToast({
                                  title: '下载链接已复制',
                                  icon: 'none'
                                })
                              }
                            })
                          }
                        },
                        fail: function (res) {
                          console.log(res, "是啊")
                        }
                      })



                      // 保存文件
                      wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: (res) => {
                          wx.showToast({
                            title: '文件保存成功',
                            icon: 'success',
                          });
                        },
                      });
                      wechatApi.reducescore({
                        openid: that.Base.getMyData().UserInfo.openid,
                      }, (res) => {
                        that.onShow();
                        console.log(res)
                      })
                    },
                    fail: function (res) {
                      that.onShow()
                      wx.showToast({
                        title: '转换失败',
                        icon: 'success',
                      });
                    }
                  });
                },
                fail: function (res) {
                  that.onShow()
                  wx.showToast({
                    title: '转换失败',
                    icon: 'success',
                  });
                }
              })




            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        that.hideLoadings()
        that.Base.toast("转换失败请稍后重试！");
        // 在这里处理错误
      });
  }
  About() {
    wx.navigateTo({
      url: '/pages/about/about',
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
              that.onShow()
            } else {
              that.onMyShow()
              that.onShow()
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

  checkscore() {
    // 积分查验
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
  bntswitchover() {
    this.Base.setMyData({
      switchover: !this.Base.getMyData().switchover
    })
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  remove_background() {
    var that = this;
    this.showLoadings()

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        
        console.log(res)
        console.log(res.tempFiles[0].tempFilePath)
        // 将图像数据转换为base64编码字符串
        const base64Image = wx.getFileSystemManager().readFileSync(res.tempFiles[0].tempFilePath, 'base64');
        // 发送POST请求
        wx.request({
          url: 'https://gpt.cllsm.top:4080/removebackground',
          method: 'GET',
          data: {
            image: base64Image
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.hideLoadings()
            // 请求成功，获取抠图结果
            const path = res.data.path;

            if(res.data.path){
              wx.setClipboardData({
                data: `https://gpt.cllsm.top:4080/image/${path}`,
                success(res) {
                  wx.showToast({
                    title: '下载链接已复制',
                    icon: 'none'
                  })
                }
              })
              wechatApi.reducescore({
                openid: that.Base.getMyData().UserInfo.openid,
              }, (res) => {
                that.onShow();
                console.log(res)
              })
            }

            // TODO: 处理抠图结果
          },
          fail: function (res) {
            // 请求失败
            console.log('请求失败', res);
            that.hideLoadings()
          }
        });


      },
      fail(err){
        console.log(err)
      }
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.okbnt = content.okbnt;
body.onShareTimeline = content.onShareTimeline;
body.onReachBottom = content.onReachBottom;
body.About = content.About;
body.getRandomInt = content.getRandomInt;
body.getUserProfile = content.getUserProfile;
body.bin_inp = content.bin_inp;
body.bindpic = content.bindpic;
body.showLoadings = content.showLoadings;
body.hideLoadings = content.hideLoadings;
body.AddHeight = content.AddHeight;
body.ReduceHeight = content.ReduceHeight;
body.showvideoAd = content.showvideoAd;
body.checkscore = content.checkscore;
body.bntswitchover = content.bntswitchover;
body.bntjpg = content.bntjpg;
body.remove_background = content.remove_background;
Page(body)