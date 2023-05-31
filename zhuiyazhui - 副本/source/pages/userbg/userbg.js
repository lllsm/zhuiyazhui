// pages/content/content.js
import { AppBase } from "../../appbase";
import { CollegeApi } from "../../apis/college.api.js";
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
      imagebg: "",
      leftList: [],
      rightList: []
    });
    const { height, top } = wx.getMenuButtonBoundingClientRect();
    this.Base.setMyData({
      margintop: top,
      funcrowheight: height
    })
    Notify({ type: 'success', message: '长按可删除~' });
  }
  onMyShow() {
    var that = this;
    var collegeapi = new CollegeApi();
    collegeapi.userbglist({}, (userbglist) => {
      this.Base.setMyData({
        userbglist: userbglist.data
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
    this.Base.setMyData({ isadd: false });
  }
  img_submit() {
    var that = this;
    var collegeapi = new CollegeApi();
    let imagebg = this.Base.getMyData().imagebg;

    collegeapi.addimgbg({ imagebg }, (addclassimg) => {
      if (addclassimg.code == 1) {
        Notify({ type: 'success', message: '上传成功~' });
        that.Base.toast("上传成功~");
        that.onMyShow();
        that.Base.setMyData({
          isadd: false,
          imagebg: "",
        })
      } else {
        Notify({ type: 'danger', message: '上传失败~', safeAreaInsetTop: true });
        that.Base.toast("上传失败~");
        that.Base.setMyData({
          isadd: false,
          imagebg: "",
        })
      }
    })

  }
  deleteimg(e) {
    this.Base.setMyData({
      imagebg: ""
    })
  }
  uploadimg(e) {
    var idx = e.currentTarget.id;
    console.log(idx)
    var imagebg = this.Base.getMyData().imagebg;
    this.Base.uploadImage("member", (ret) => {
      console.log(ret)
      this.Base.setMyData({
        imagebg: ret
      })
    }, 1)
  }
  previewImage(e) {
    var that = this;
    var collegeapi = new CollegeApi();
    console.log(e)
    let imglist = this.Base.getMyData().userbglist;
    let uploadpath = this.Base.getMyData().uploadpath;
    var idx = e.target.id;

    let imglists = [];
    for (let i = 0; i < imglist.length; i++) {
      imglists.push(uploadpath + imglist[i].class_image);
    }
    console.log(imglists[idx])
    console.log(imglists)
    wx.previewImage({
      current: imglists[idx],//当前点击的图片链接
      urls: imglists//图片数组
    })



  }
  setImage(e){
    var that = this;
    var collegeapi = new CollegeApi();
    wx.showModal({
      title: '追鸭追提醒',
      content: '确认把当前图片设置为聊天背景？',
      success(res) {
        if (res.confirm) {
          collegeapi.updateimgbg({ imgbg_id: e.currentTarget.dataset.id }, (updateimgbg) => {
            if (updateimgbg.code == 1) {
              Notify({ type: 'success', message: '修改成功~' });
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
          collegeapi.delimgbg({ id: e.currentTarget.dataset.id }, (updateimgbg) => {
            if (updateimgbg.code == 1) {
              Notify({ type: 'success', message: '删除成功~' });
              that.Base.toast("删除成功~");
            }else{
              Notify({ type: 'warning', message: '删除失败~' });
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
Page(body)