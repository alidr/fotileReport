export default {
  install(Vue, options) {
    //添加cookie
    Vue.prototype.addCookie = function (objName, objValue, objDays) {
      var str = objName + "=" + escape(objValue);
      if (objDays > 0) {
        var date = new Date();
        var ms = objDays * 24 * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
      }
      if (objDays === Infinity) {
        str += "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      }
      str += "; path=/";
      document.cookie = str;
    }
    global.addCookie = Vue.prototype.addCookie; //  new
  // 获取cookie
    Vue.prototype.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
          return unescape(arr[2]);
        } else {
          return null;
        }
    }
    global.getCookie = Vue.prototype.getCookie; //--------------

    // 删除cookie
    Vue.prototype.delCookie = function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    global.delCookie = Vue.prototype.delCookie;
  }
}