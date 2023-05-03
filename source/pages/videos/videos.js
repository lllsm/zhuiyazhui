import { AppBase } from "../../appbase";
import {InstApi} from "../../apis/inst.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    console.log(this.Base.Page,'--------------------')
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      url:"",
      data:"",
      msg:"解析加载"
    });
  }
  onMyShow() {
    var that = this;
    let url = this.options.url;
    var inst = new InstApi();
    inst.videos({url},(data)=>{
      console.log(data)
      this.Base.setMyData({
        data:data.data,
        msg:data.msg
      })
    })

  }
  onShareTimeline(){
    let imageUrl = 'https://college.cllsm.top/uploads/20221124/6542156492720249eb1cfba0ca64d803.png';
    return {
      title: '幸运是努力了好久发出的光，快快加入我们吧！',
      // query: 'id='+this.Base.options.id+'&title='+this.options.title,
      imageUrl:imageUrl 
    }
  }
  bin_video(e){
    console.log(e)
    this.Base.download(e.currentTarget.dataset.url)
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success (res) {
        wx.showToast({
          title: '已复制',
          icon: 'none'
        })
      }
    })
  }
  bin_downloadfile(e){
    var that = this;
    wx.showLoading({
      title: '下载中...',
    })
    wx.downloadFile({
        //视频信息的Url
      url: e.currentTarget.dataset.url,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res.tempFilePath);

          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function(res) {
              console.log(res.errMsg)
              wx.hideLoading(); 
              wx.showLoading({
                title: '下载成功，请到手机相册查看——',
              })
            },
            errMsg:function(e){
              console.log(e)
              wx.hideLoading(); 
            }
          })
        }
      }
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bin_video = content.bin_video;
body.bin_downloadfile = content.bin_downloadfile;
Page(body)