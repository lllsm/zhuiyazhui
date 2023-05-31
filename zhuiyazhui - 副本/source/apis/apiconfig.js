export class ApiConfig {

  static GetApiUrl() {
    return "https://college.cllsm.top/api/";
    return "http://127.0.0.1/api/";
  }
  static GetApiVideoUrl() {
    return "https://api.cllsm.top";
    return "http://127.0.0.1/api/";
  }
  static GetApiBotUrl() {
    return "https://api.gptbot.cc/v1";
  }
  static Getjutuike(){
    return "https://api.jutuike.com/union/";
  }
  static GetUploadPath() {
    return "https://college.cllsm.top";
    // return "http://127.0.0.1";
  }
  static GetFileUploadAPI() {
    return "https://college.cllsm.top/api/common/upload";
    return "http://127.0.0.1/api/common/upload";
  }

  static GetHeader() {
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'UNICODE': ApiConfig.UNICODE,
      'TOKEN': ApiConfig.TOKEN
    };
    return headers;
  }
  static UNICODE = "";
  static SetUnicode(unicode) {
    ApiConfig.UNICODE = unicode;
  }
  static TOKEN = "";
  static SetToken(token) {
    ApiConfig.TOKEN = token;
  }

  static showLoadingCounter = 0;
  static ShowLoading = function () {
    return;
    if (ApiConfig.showLoadingCounter == 0) {
      wx.showLoading({
        title: '加载中',
      });
    }
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter + 1;
  }

  static CloseLoading = function () {
    return;
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter - 1;
    if (ApiConfig.showLoadingCounter == 0) {
      console.log(ApiConfig.showLoadingCounter);
      wx.hideLoading();
    }
  }




}