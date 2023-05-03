/****

import { WechatApi } from "../apis/wechat.api";
 */
import {
  ApiConfig
} from "apis/apiconfig.js";
import {
  ApiUtil
} from "apis/apiutil.js";
import {
  MemberApi
} from "apis/member.api";
import {
  WechatApi
} from "apis/wechat.api";
export class AppBase {
  static BRANDAPPLE = 12;
  static QQMAPKEY = "IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5";
  static UserInfo = {};
  static InstInfo = {};
  static lastlat = 0;
  static lastlng = 0;
  static lastdistance = 0;
  static lastaddress = {
    address: {
      ad_info: {
        adcode: "",
        city: ""
      }
    }
  };
  static CITYID = 440300;
  static CITYNAME = "深圳市";
  static CITYSET = false;
  unicode = "wx_college";
  needauth = false;
  phone = null;
  pagetitle = null;
  app = null;
  options = null;
  data = {
    uploadpath: ApiConfig.GetUploadPath(),
    copyright: {
      name: "",
      website: "mecloud.com"
    }
  };
  Page = null;
  util = ApiUtil;
  constructor() {
    this.app = getApp();
    this.me = this;
    ApiConfig.SetToken("c3a76617-1bf5-43c7-be17-121a5aeb8a0a");
  }
  setPageTitle(instinfo) {
    wx.setNavigationBarTitle({
      title: instinfo.name,
    })
  }
  generateBodyJson() {
    var base = this;
    return {
      Base: base,
      /**
       * 页面的初始数据
       */
      data: base.data,
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: base.onLoad,

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: base.onReady,

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: base.onShow,

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: base.onHide,

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: base.onUnload,

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: base.onPullDownRefresh,

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: base.onReachBottom,

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: base.onShareAppMessage,
      onMyShow: base.onMyShow,
      phonenoCallback: base.phonenoCallback,
      viewPhoto: base.viewPhoto,
      phoneCall: base.phoneCall,
      openMap: base.openMap,
      backPage: base.backPage,
      backHome: base.backHome,
      logout: base.logout,
      switchTab: base.switchTab,
      closePage: base.closePage,
      gotoPage: base.gotoPage,
      navtoPage: base.navtoPage,
      openContent: base.openContent,
      getPhoneNo: base.getPhoneNo,
      getUserInfo: base.getUserInfo,
      dataReturn: base.dataReturn,
      dataReturnCallback: base.dataReturnCallback,
      loadtabtype: base.loadtabtype,
      contactkefu: base.contactkefu,
      contactweixin: base.contactweixin,
      download: base.download,
      checkPermission: base.checkPermission,
      recorderManager: base.recorderManager,
      backtotop: base.backtotop,
      xuanzechenshi: base.xuanzechenshi,
      topage: base.topage,
      shoucang: base.shoucang,
      tishi: base.tishi,
      tishi2: base.tishi2,
      tishi3: base.tishi3,
      clock: base.clock,
      close: base.close,
      search:base.search,
      BackPage: base.BackPage,
      toHome: base.toHome,
      goarticle: base.goarticle,
      addresscallback: base.addresscallback,

      btnClick : base.btnClick,
      btnClickTo : base.btnClickTo,
      start : base.start,
      fadeInDlg:base.fadeInDlg,
      fadeOutDlg:base.fadeOutDlg,
      preventTouchMove:base.preventTouchMove,
      ketai:base.ketai,
      ketai1:base.ketai1,
      getUserProfile:base.getUserProfile
    }
  }
  log() {
    console.log("yeah!");
  }

  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  }
  toHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }
 
  onLoad(options) {
    this.Base.options = options;
    console.log(options);
    console.log("onload");
    // this.start();
    this.Base.setBasicInfo();
    this.Base.setMyData({
      options: options,
    });
    ApiConfig.SetUnicode(this.Base.unicode);
  }

  addresscallback(res){
    console.log("addresscallback",res);
  }

  gotoOpenUserInfoSetting() {
    var that = this;
    wx.showModal({
      title: '需要您授权才能正常使用小程序',
      content: '请点击“去设置”并启用“用户信息”，然后确定即可正常使用',
      confirmText: "去设置",
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({

          })
        } else {
          that.gotoOpenUserInfoSetting();
        }
      }
    })
  }

  setBasicInfo() {
    var that = this;
  }
  onReady() {
    console.log("onReady");
  }
  
  onShow() {
    var that = this;
    var memberapi = new MemberApi();
    //加载素材
    // instapi.resources({}, (res) => {
    //   this.Base.setMyData({
    //     res
    //   });
    // });
    memberapi.inst({}, (instinfo) => {
      if (instinfo == null || instinfo == false) {
        return;
      }
      AppBase.InstInfo = instinfo;
      this.Base.setMyData({
        instinfo: instinfo.data
      });
      wx.setStorage({
        key:"content",
        data:instinfo.data.content
      })
      let tips =  JSON.parse(instinfo.data.banquan);
      console.log(instinfo.data.banquan,"--------------------------")
      wx.setStorage({
        key:"tips",
        data:tips
      })
      if (this.Base.pagetitle == null) {
        this.Base.setPageTitle(instinfo);
      } else {

      }
    }, false);

    
    if (AppBase.UserInfo.openid == undefined) {
      // 登录
      console.log("onShow");
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log("res");
          console.log(res);
          // getUserInfo
          // getUserProfile
            var memberapi = new MemberApi();
              memberapi.getuserinfo({
                type:'A',
                code: res.code,
                grant_type: "authorization_code"
              }, data => {
                console.log("here");
                console.log(data.data.openid);
                AppBase.UserInfo.openid = data.data.openid;
                AppBase.UserInfo.session_key = data.data.session_key;
                console.log(AppBase.UserInfo);
                // ApiConfig.SetToken(data.data.openid);
                console.log("goto update info");
                //this.loadtabtype();
                wx.showLoading({
                  title: '加载中',
                })
                memberapi.login(AppBase.UserInfo, (data) => {
                  console.log(data.data)
                  ApiConfig.SetToken(data.data);
                  console.log(AppBase.UserInfo);
                  that.Base.setMyData({
                    UserInfo: AppBase.UserInfo
                  });
                  wx.hideLoading();
                  new Promise((resolve,reject) => {
                      resolve("then是异步");
                  }).then((res) => {
                    that.checkPermission();
                  }).then(()=>{
                    that.onMyShow();
                  })
                });
              });
        },
        // fail:userloginres=>{
        //   console.log("auth fail");
        //   console.log(userloginres);


        //   var memberapi = new MemberApi();
        //   memberapi.getuserinfo({
        //     code: res.code,
        //     grant_type: "authorization_code"
        //   }, data => {
        //     console.log("here");
        //     console.log(data.data.openid);
        //     AppBase.UserInfo.openid = data.data.openid;
        //     AppBase.UserInfo.session_key = data.data.session_key;
        //     console.log(AppBase.UserInfo);
        //     // ApiConfig.SetToken(data.data.openid);
        //     console.log("goto update info");
        //     //this.loadtabtype();
        //     memberapi.login(AppBase.UserInfo, (data) => {
        //       console.log(data.data)
        //       ApiConfig.SetToken(data.data);
        //       console.log(AppBase.UserInfo);
        //       that.Base.setMyData({
        //         UserInfo: AppBase.UserInfo
        //       });
        //       if (this.Base.needauth == true) {
        //         // wx.redirectTo({
        //         //   url: '/pages/auth/auth',
        //         // })
        //       } else {
        //         that.onMyShow();
        //       }
        //     });
        //     that.onMyShow();
        //     // that.Base.getAddress();
        //   });
        // }


      })

      return false;
    } else {
      if (that.setMyData != undefined) {
        that.setMyData({
          UserInfo: AppBase.UserInfo
        });
      } else {
        that.Base.setMyData({
          UserInfo: AppBase.UserInfo
        });
      }
      //this.loadtabtype();
      that.Base.setMyData({
        UserInfo: AppBase.UserInfo
      });
      new Promise((resolve,reject) => {
          resolve("then是异步");
      }).then((res) => {
        that.checkPermission();
      }).then(()=>{
        that.onMyShow();
      })

    }
    // that.checkPermission();
  }
  checkPermission() {
    console.log('checkPermission')
    var memberapi = new MemberApi();
    var that = this;
    memberapi.Userinfo({}, (info) => {
      this.Base.setMyData({
        memberinfo: info.data
      });
    })
    that.onMyShow();
  }


  loadtabtype() {
    console.log("loadtabtype");
    var memberapi = new MemberApi();
    // memberapi.update(AppBase.UserInfo, () => {});
  }

  onMyShow() {
    console.log("onMyShow");
    this.onShow();
    wx.stopPullDownRefresh();
  }
  onHide() {
    console.log("onHide");
  }
  onUnload() {
    console.log("onUnload");
  }
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    this.onShow();
    wx.stopPullDownRefresh();
  }
  onReachBottom() {
    console.log("onReachBottom");
  }
  onShareAppMessage() {

  }

  dataReturn(data) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log("????");
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.dataReturnCallback(this.Base.options.callbackid, data);
    wx.navigateBack();
  }

  dataReturnCallback(callbackid, data) {
    console.log("please use dataReturnCallback(callbackid, data)");
  }

  setMyData(obj) {
    console.log(obj);
    this.Page.setData(obj);
  }
  getMyData() {
    return this.Page.data;
  }
  getPhoneNo(e) {
    var that = this;

    var api = new WechatApi();

    e.detail.session_key = AppBase.UserInfo.session_key;
    e.detail.openid = AppBase.UserInfo.openid;

    api.decrypteddata(e.detail, (ret) => {
      console.log(ret, '最最最');

      that.phonenoCallback(ret.return.phoneNumber, e, ret.code);
      console.log(ret.return.phoneNumber,'phoneNumber')

    });
  }
  phonenoCallback(mobile, e, result) {

    if (result == '0') {
      var memberapi = new MemberApi();
      memberapi.updateshouji({
        mobile: mobile
      }, (updatetouxiang) => {

        var memberapi = new MemberApi();

        var that = this;
        memberapi.Userinfo({}, (info) => {
          this.Base.setMyData({
            memberinfo: info.data
          });

          this.Base.setMyData({
            mobile: mobile
          });

          wx.showToast({
            title: '获取成功',
            icon: 'none'
          })

        });

        //this.checkPermission();
      });
    } else {
      console.log('不出来')
    }

  }

  viewPhoto(e) {
    var img = e.currentTarget.id;
    console.log(img);
    wx.previewImage({
      urls: [img],
    })
  }
  viewGallary(modul, photos, current = "") {
    var nphotos = [];
    for (var i = 0; i < photos.length; i++) {
      nphotos.push(ApiConfig.GetUploadPath() + modul + "/" + photos[i]);
    }
    current = ApiConfig.GetUploadPath() + modul + "/" + current;
    console.log(nphotos);
    wx.previewImage({
      urls: nphotos,
      current: current
    })
  }
  phoneCall(e) {
    var tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }

  uploadFile(modul, filename, filePath, callback) {
    var tempFilePaths = filename
    var filePath = filePath;
    console.log("ssssssssssss" + tempFilePaths);
    console.log(filePath);
    wx.uploadFile({
      url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {
        'module': modul,
        "field": "file",
      },
      header: {
        'token': ApiConfig.TOKEN
      },
      success: function(res) {
        console.log(res);
        var data = JSON.parse(res.data)

        if ( data.code == 1) {
          var photo =data.data.url;
          callback(photo);
        } else {
          console.error(data.msg);
          wx.showToast({
            title: data.msg|| "上传失败！",
            icon: 'none',
            duration: 2000
          })
        }
        //do something
      }
    });
  }

  uploadImage(modul, callback, count = 1, completecallback) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: count,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            header: {
              'token': ApiConfig.TOKEN
            },
            success: function(res) {
              var data = JSON.parse(res.data)
              console.log(data,"999999999999999999");
              if ( data.code == 1) {
                var photo =data.data.url;
                callback(photo);
              } else {
                console.error(data.msg);
                wx.showToast({
                  title: data.msg|| "上传失败！",
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  uploadOneImage(modul, callback, completecallback) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            header: {
              'token': ApiConfig.TOKEN
            },
            success: function(res) {
              var data = JSON.parse(res.data)
              console.log(data,"999999999999999999");
              if ( data.code == 1) {
                var photo =data.data.url;
                callback(photo);
              } else {
                console.error(data.msg);
                wx.showToast({
                  title: data.msg|| "上传失败！",
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }
  uploadAvatarUrl(modul,filePath ,callback, completecallback) {
    wx.uploadFile({
      url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {
        'module': modul,
        "field": "file"
      },
      header: {
        'token': ApiConfig.TOKEN
      },
      success: function(res) {
        var data = JSON.parse(res.data)
        console.log(data,"999999999999999999");
        if ( data.code == 1) {
          var photo =data.data.url;
          callback(photo);
        } else {
          console.error(data.msg);
          wx.showToast({
            title: data.msg|| "上传失败！",
            icon: 'none',
            duration: 2000
          })
        }
      }
    });

        if (completecallback != undefined) {
          completecallback();
        }
      }


  uploadVideo(modul, callback, completecallback) {
    wx.chooseVideo({
      compressed: true, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [];
        tempFilePaths.push(res.tempFilePath);
        //res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            header: {
              'token': ApiConfig.TOKEN
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
        if (completecallback != undefined) {
          completecallback();
        }
      }
    })
  }

  takeImage(modul, callback) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            header: {
              'token': ApiConfig.TOKEN
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }


  takeVideo(modul, callback) {
    wx.chooseVideo({
      compressed: false,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      maxDuration: 60,
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = [res.tempFilePath];
        for (var i = 0; i < tempFilePaths.length; i++) {

          wx.uploadFile({
            url: ApiConfig.GetFileUploadAPI(), //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'module': modul,
              "field": "file"
            },
            header: {
              'token': ApiConfig.TOKEN
            },
            success: function(res) {
              console.log(res);
              var data = res.data
              if (data.substr(0, 7) == "success") {
                data = data.split("|");
                var photo = data[2];
                callback(photo);
              } else {
                console.error(res.data);
                wx.showToast({
                  title: '上传失败，请重试',
                  icon: 'warn',
                  duration: 2000
                })
              }
              //do something
            }
          });
        }
      }
    })
  }
  info(message) {
    wx.showModal({
      title: '提示',
      content: message,
      showCancel: false
    })
  }
  warning(message) {
    wx.showModal({
      title: '警告',
      content: message,
      showCancel: false
    })
  }
  error(message) {
    wx.showModal({
      title: '错误',
      content: message,
      showCancel: false
    })
  }

  backHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }

  gotoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  navtoPage(e) {
    console.log(e);
    var dataset = e.currentTarget.dataset;
    var page = dataset.page;
    var parameter = dataset.param;
    if (parameter != "") {
      parameter = "?" + parameter;
    }
    var url = "../" + page + "/" + page + parameter;
    console.log(url);
    wx.navigateTo({
      url: url,
    })
  }
  switchTab(e) {
    console.log(e);
    var page = e.currentTarget.id;
    var url = "../" + page + "/" + page;
    console.log(url);
    wx.redirectTo({
      url: url,
    })
  }
  closePage() {

  }
  openContent(e) {
    var title = e.target.dataset.title;
    var keycode = e.target.dataset.keycode;
    wx.navigateTo({
      url: '/pages/content/content?keycode=' + keycode + "&title=" + title,
    })
  }
  console(key, val) {
    var json = {
      key,
      val
    };
    console.log(json);
  }

  checkRealname(callback) {
    var memberapi = new MemberApi();
    memberapi.checkrealname({}, (ret) => {
      if (ret == false) {
        wx.navigateTo({
          url: '/pages/signup/signup',
        })
      } else {
        callback();
      }
    });
  }

  download(url, callback, open = false) {
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          var tempFilePath = res.tempFilePath;
          console.log("tempFilePath", tempFilePath);
          wx.saveFile({
            tempFilePath: tempFilePath,
            fail: function(savefail) {
              console.log("savefail", savefail);
            },
            success: function(res) {
              var savedFilePath = res.savedFilePath;
              console.log("savedFilePath", savedFilePath, res);
              if (open == true) {
                wx.openDocument({
                  filePath: savedFilePath,
                });
              }
              console.log(savedFilePath);
              if (callback != null) {
                callback(savedFilePath);
              }
            }
          })
        }
      }
    })
  }

  contactkefu() {
    var instinfo = this.Base.getMyData().instinfo;
    console.log(instinfo);
    wx.showActionSheet({
      itemList: ["拨打热线", "添加客服"],
      success(e) {
        if (e.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: instinfo.tel
          })
        } else {
          var img = ApiConfig.GetUploadPath() + "inst/" + instinfo.kefuerweima;
          console.log(img);
          wx.previewImage({
            urls: [img],
          })
        }
      }
    })
  }
  contactweixin() {
    //wechatno
    var instinfo = this.Base.getMyData().instinfo;
    console.log(instinfo);
    wx.showActionSheet({
      itemList: [instinfo.wechatno, "一键复制"],
      success(e) {
        if (e.tapIndex == 0) {

        } else {
          wx.setClipboardData({
            data: instinfo.wechatno,
          })
        }
      }
    })
  }
  toast(msg) {  
    wx.showToast({
      title: msg,
      icon: "none"
    })
  }
  backtotop() {
    console.log("backtotop");
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }

  getUserInfo() {
    var that = this;
    var memberapi = new MemberApi();
    var memberinfo = this.Base.getMyData().memberinfo
    if (memberinfo == null) {
      memberapi.Userinfo({}, (info) => {
        this.Base.setMyData({
          memberinfo: info.data
        });
      })
    }
    getUserInfo
    getUserProfile
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: userres => {
        var openid = AppBase.UserInfo.openid;
        var session_key = AppBase.UserInfo.session_key;
        AppBase.UserInfo = userres.userInfo;
        AppBase.UserInfo.openid = openid;
        AppBase.UserInfo.session_key = session_key;
        console.log("loginres4", userres);
        
        console.log(this.Base.getMyData().memberinfo, '11');
        var memberinfo = this.Base.getMyData().memberinfo;
        var json = null;
          json = AppBase.UserInfo;
        memberapi.update(json, () => {
          console.log(AppBase.UserInfo);
          that.Base.setMyData({
            UserInfo: AppBase.UserInfo
          });

          memberapi.Userinfo({}, (info) => {
            this.Base.setMyData({
              memberinfo: info.data
            });
          })
        });


        var api = new WechatApi();
        // api.decrypteddata({
        //   iv: userres.iv,
        //   encryptedData: userres.encryptedData
        // }, ret => {
        //   AppBase.jump = true;
        //   AppBase.UserInfo.unionid = ret.return.openId;
        //   ApiConfig.SetToken(ret.return.openId);
        //   console.log("loginres5", ret);
        //   console.log("loginres6", AppBase.UserInfo);
        //   var json = null;
        //   json = AppBase.UserInfo;
          
        //   json.primary_id = memberinfo.id;
        //   memberapi.update(json, () => {
        //     console.log(AppBase.UserInfo);
        //     that.Base.setMyData({
        //       UserInfo: AppBase.UserInfo
        //     });

        //     memberapi.Userinfo({}, (info) => {
        //       this.Base.setMyData({
        //         memberinfo: info
        //       });
        //     })
        //   });

        // });

      },
      fail: userloginres => {
        console.log("auth fail");
        console.log(userloginres);

        if (that.Base.needauth == true) {

        }
        
      }
    })
  }

  getUserProfile() {
    var memberapi = new MemberApi();
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log('wx.getUserProfile success，获取的用户信息：', res);

        this.setData({
          userInfo: res.userInfo,
        });
        memberapi.updateuser({openid:AppBase.UserInfo.openid,avatarUrl:res.userInfo.avatarUrl,nickName:res.userInfo.nickName},(ret)=>{
          memberapi.Userinfo({}, (info) => {
            this.Base.setMyData({
              memberinfo: info.data
            });
          })
        })
      },

      fail(err) {
        console.log('wx.getUserProfile failed', err.errMsg);

        wx.showModal({
          title: '获取用户信息失败',
          content: JSON.stringify(err),
          showCancel: false,
        });
      },

      complete() {
        console.log('wx.getUserProfile completed');
      },
    });
  }

  topage(e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.id;

    wx.navigateTo({
      url: '/pages/' + name + '/' + name + '?id=' + id
    })

  }




  btnClickTo() {
    this.Base.setMyData({popup:true});
    
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    // this.animation = animation
    animation.translateY(0).step()
    this.setData({
      animation: animation.export()
    })
   
  }
  btnClick () {
    this.Base.setMyData({popup:false}); 
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 400,
      timingFunction: "ease",
      delay: 0
    })
    // this.animation = animation
    animation.translateY(1000).step()
    this.setData({
      animation: animation.export(),
      
    })
    
    
  }
  start(){
    var  animation = wx.createAnimation({
      transformOrigin: "0% 0%",
      duration: 0,
      timingFunction: "linear",
      delay: 0
    }) 
    animation.translateY(1000).step()
    this.setData({
      animation: animation.export(),
    })
  }
  fadeInDlg(){ 
    var animation = wx.createAnimation({
      duration:0,
      timingFunction:'step-start',
    })
    animation.opacity(0).scale(0.8,0.8).step();
    this.setData({
      animationData: animation.export()
    })
    animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.opacity(1).scale(1,1).step()
    this.setData({
      animationData:animation.export()
    })

    var animationBg = wx.createAnimation({
      duration: 500,
      timingFunction: 'step-start',
    })
    animationBg.opacity(0).step()
    animationBg = wx.createAnimation({
      duration:500,
      timingFunction:'ease',
    })
    animationBg.opacity(0.5).step()
    this.setData({
      animationBgData:animationBg.export()
    })
  }
  fadeOutDlg(){
    var _this = this
    var animation = wx.createAnimation({
      duration:200,
      timingFunction:'ease',
    })
    animation.opacity(0).scale(0.8, 0.8).step();
    this.setData({
      animationData:animation.export()
    })

    var animationBg = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    animationBg.opacity(0).step()
    this.setData({
      animationBgData: animationBg.export()
    })

 
  }
  preventTouchMove() {
    //阻止触摸
  }

   withData(param){
    return param < 10 ? '0' + param : '' + param;
     }
     getLoopArray(start,end){
       var start = start || 0;
     var end = end || 1;
     var array = [];
      for (var i = start; i <= end; i++) {
        array.push(withData(i));
  }
      return array;
   }
    getMonthDay(year,month){
      var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
   
     switch (month) {
      case '01':
       case '03':
       case '05':
        case '07':
        case '08':
        case '10':
       case '12':
          array = getLoopArray(1, 31)
          break;
       case '04':
    case '06':
      case '09':
    case '11':
       array = getLoopArray(1, 30)
      break;
     case '02':
     array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
       break;
     default:
     array = '月份格式不正确，请重新输入！'
   }
  return array;
 }
  getNewDateArry(){
   // 当前时间的处理
   var newDate = new Date();
   var year = withData(newDate.getFullYear()),
      mont = withData(newDate.getMonth() + 1),
       date = withData(newDate.getDate()),
       hour = withData(newDate.getHours()),
       minu = withData(newDate.getMinutes()),
        seco = withData(newDate.getSeconds());

   return [year, mont, date, hour, minu, seco];
 }
  dateTimePicker(startYear,endYear,date) {
  // 返回默认显示的数组和联动数组的声明
   var dateTime = [], dateTimeArray = [[],[],[],[],[],[]];
   var start = startYear || 1978;
   var end = endYear || 2100;
   // 默认开始显示数据
    var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
   // 处理联动列表数据
   /*年月日 时分秒*/ 
   dateTimeArray[0] = getLoopArray(start,end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
   dateTimeArray[4] = getLoopArray(0, 59);
   dateTimeArray[5] = getLoopArray(0, 59);

   dateTimeArray.forEach((current,index) => {
     dateTime.push(current.indexOf(defaultDate[index]));
   });
 
   return {
     dateTimeArray: dateTimeArray,
     dateTime: dateTime
   }
 }
//  module.exports = {
//    dateTimePicker: dateTimePicker,
//   getMonthDay: getMonthDay
//   }


}