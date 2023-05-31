import {
  AppBase
} from "../../appbase";
import {
  MemberApi
} from "../../apis/member.api";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);

    let list = [{
      id: 0,
      value: '未知',
    }, {
      id: 1,
      value: '男',
    }, {
      id: 2,
      value: '女'
    }]


    let nickName = this.Base.options.nickName;
    let mobile = this.Base.options.mobile;
    this.Base.setMyData({
      gender: list,
      avatarUrl: "",
      nickName,
      mobile,
    });

  }
  onMyShow() {
    let imglist = JSON.parse(AppBase.InstInfo.data.banquan);
    let imgvalue = wx.getStorageSync("imgvalue");
    this.Base.setMyData({
      imgvalue,
      imglist
    });
  }
  getUserProfile(e) {
    let uu = this.Base.getMyData().avatarUrl || this.Base.getMyData().memberinfo.avatarUrl;
    if (uu == null || uu == undefined) {
      this.Base.toast("请上传头像才能保存哦！");
      return;
    }
    console.log(this.Base.getMyData().instinfo.switch == 1)
    if (this.Base.getMyData().mobile && this.Base.getMyData().instinfo.switch == 0) {
      let ismobile = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.Base.getMyData().mobile);
      if (!ismobile) {
        this.Base.toast("手机号码格式错误!")
        return
      }
      console.log(ismobile)
    }
    console.log(e.detail.value)
    var str = `是否确认修改`;
    var memberapi = new MemberApi();
    var that = this;
    wx.showModal({
      title: '修改提示',
      content: str,
      success: (res) => {
        console.log(res);
        if (res.confirm) {
          memberapi.updateuser({
            mobile: this.Base.getMyData().mobile || this.Base.getMyData().memberinfo.mobile,
            openid: this.Base.getMyData().UserInfo.openid,
            nickName: this.Base.getMyData().nickName || this.Base.getMyData().memberinfo.nickName,
            avatarUrl: this.Base.getMyData().avatarUrl || this.Base.getMyData().memberinfo.avatarUrl,
          }, (e) => {
            if (e.code == "1") {
              wx.switchTab({
                url: '/pages/wode/wode'
              })
              this.Base.toast("修改成功")
            } else {
              this.Base.toast("修改失败")
            }
          });
        }
      },
      fail: (res) => {

      },
    });
  }

  bindpic(e) {
    var that = this;
    // let uploadpath = this.Base.getMyData().uploadpath;
    // console.log(e.detail.avatarUrl)
    // if(!e.detail.avatarUrl){
    //   this.Base.uploadOneImage("member", (ret) => { 
    //     that.Base.setMyData({
    //       avatarUrl: uploadpath+'member/'+ret
    //     }); 
    //   }, undefined);
    // }
    const { avatarUrl } = e.detail
    this.Base.setMyData({
      avatarUrl
    })
    console.log("进来了")
    let uploadpath = this.Base.getMyData().uploadpath;
    this.Base.uploadAvatarUrl("member", avatarUrl, (ret) => {
      console.log(ret)
      that.Base.setMyData({
        avatarUrl: ret
      });
    }, undefined);



  }
  bin_inp(e) {
    console.log(e)
    this.Base.setMyData({
      nickName: e.detail.value
    })
  }
  bin_inp_mb(e) {
    console.log(e)
    this.Base.setMyData({
      mobile: e.detail.value
    })
  }
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let rr = this.Base.getMyData().imglist[e.detail.value];
    console.log(rr)
    wx.setStorageSync("imgvalue", rr)
    this.onMyShow()
  }

}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getUserProfile = content.getUserProfile;
body.bindpic = content.bindpic;
body.bin_inp = content.bin_inp;
body.bin_inp_mb = content.bin_inp_mb;
body.bindPickerChange = content.bindPickerChange
Page(body)