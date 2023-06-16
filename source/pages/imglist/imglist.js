// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  CollegeApi
} from "../../apis/college.api.js";
import Notify from '@vant/weapp/notify/notify';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      checkstate: '',
      isadd: false,
      showimg:false,
      imagelist: [],
      leftList: [],
      rightList: []
    });
    const {
      height,
      top
    } = wx.getMenuButtonBoundingClientRect();
    this.Base.setMyData({
      margintop: top,
      funcrowheight: height
    })
    // Notify({
    //   type: 'success',
    //   message: '长按可删除~'
    // });
  }
  onMyShow() {
    var that = this;
    var collegeapi = new CollegeApi();
    collegeapi.userbglist({}, (userbglist) => {
      var list  =userbglist.data;
      console.log(list)
      for(var i = 0; i < list.length; i++){
        if(list[i].class_images){
          list[i].class_images=list[i].class_images.split(",");
        }
      }
      this.Base.setMyData({
        userbglist:list
      })
    })
  }
  bin_key(e) {
    let keyword = e.detail.value;
    this.Base.toast(keyword)
    this.Base.setMyData({
      keyword
    })
  }
  addmsg() {
    this.Base.setMyData({
      isadd: true
    })
  }
  onClose() {
    this.Base.setMyData({
      isadd: false
    });
  }
  img_submit() {
    var that = this;
    var collegeapi = new CollegeApi();
    let imagelist = this.Base.getMyData().imagelist;

    if(imagelist.length==1){
      Notify({ type: 'danger', message: '请上传两张以上照片~',safeAreaInsetTop:true});
      this.Base.toast("请上传两张以上照片~");
      return;
    }

    collegeapi.addimgbg({
      imagelist:encodeURI( JSON.stringify(imagelist))
    }, (addclassimg) => {
      if (addclassimg.code == 1) {
        Notify({
          type: 'success',
          message: '上传成功~'
        });
        that.Base.toast("上传成功~");
        that.onMyShow();
        that.Base.setMyData({
          isadd: false,
          imagelist: "",
        })
      } else {
        Notify({
          type: 'danger',
          message: '上传失败~',
          safeAreaInsetTop: true
        });
        that.Base.toast("上传失败~");
        that.Base.setMyData({
          isadd: false,
          imagelist: "",
        })
      }
    })

  }
  deleteimg(e) {
    var idx = e.currentTarget.id;
    var imagelist = this.Base.getMyData().imagelist;
    imagelist.splice(idx,1);
    this.Base.setMyData({
      imagelist
    })
  }
  uploadimg(e) {
    var idx = e.currentTarget.id;
    console.log(idx)
    var imagelist = this.Base.getMyData().imagelist;
    this.Base.uploadImage("member", (ret) => {
      console.log(ret)
      if(idx>=0&&idx!=""){
        imagelist[idx].img = ret;
      }else {
        imagelist.push({
          img:ret
        })
      }
     console.log(ret)
      this.Base.setMyData({
        imagelist
      })
    }, 9)
  }
  previewImage(e) {
    var that = this;
    console.log(e)
    let imglist = this.Base.getMyData().userbglist;
    let uploadpath = this.Base.getMyData().uploadpath;
    var idx = e.currentTarget.dataset.idx;
    var idxs = e.currentTarget.dataset.idxs;
    console.log(idx)
    console.log(imglist[idx])
    let imglists = [];
    let listimg= imglist[idx].class_images;
    for (let i = 0; i < listimg.length; i++) {
        imglists.push(uploadpath + listimg[i]);
    }
    console.log(imglists[idxs])
    console.log(imglists)
    wx.previewImage({
      current: imglists[idxs], //当前点击的图片链接
      urls: imglists //图片数组
    })
  }
  setImage(e) {
    var that = this;
    console.log(e.currentTarget.dataset.src)
    var collegeapi = new CollegeApi();
    wx.showModal({
      title: '追鸭追提醒',
      content: '确认把当前图片设置为聊天背景？',
      success(res) {
        if (res.confirm) {
          collegeapi.updateimgbg({
            imgbg_id: e.currentTarget.dataset.src
          }, (updateimgbg) => {
            if (updateimgbg.code == 1) {
              Notify({
                type: 'success',
                message: '修改成功~'
              });
              that.Base.toast("修改成功~");
              wx.navigateBack({
                delta: 1
              })
            }

          })
          that.onMyShow()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  del(e) {
    var that = this;
    var collegeapi = new CollegeApi();
    wx.showModal({
      title: '追鸭追提醒',
      content: '确认删除当前聊天背景？',
      success(res) {
        if (res.confirm) {
          collegeapi.delimgbg({
            id: e.currentTarget.dataset.id
          }, (updateimgbg) => {
            if (updateimgbg.code == 1) {
              Notify({
                type: 'success',
                message: '删除成功~'
              });
              that.Base.toast("删除成功~");
            } else {
              Notify({
                type: 'warning',
                message: '删除失败~'
              });
              that.Base.toast("删除失败~");
            }

          })
          that.onMyShow()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    this.onMyShow()
  }

  //下载图片
  picDown(e) {
    console.log(e.currentTarget.dataset.src)
    wx.downloadFile({
      url: e.currentTarget.dataset.src, //图片的地址
      success: function (res) {
        const tempFilePath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath, //设置下载图片的地址
          success: function () {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '图片已保存到相册',
              showCancel: false,
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存到相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
          },
          complete(res) {
            wx.hideLoading()
          }
        })
      }
    })
  }
  showimg(){
    this.Base.setMyData({
      showimg:!this.Base.getMyData().showimg
    })
  }
  input_search(){
    this.Base.toast("敬请期待")
  }


}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.addmsg = content.addmsg;
body.onClose = content.onClose;
body.img_submit = content.img_submit;
body.deleteimg = content.deleteimg;
body.uploadimg = content.uploadimg;
body.previewImage = content.previewImage;
body.del = content.del;
body.setImage = content.setImage;
body.picDown = content.picDown;
body.showimg = content.showimg;
body.input_search = content.input_search;
Page(body)