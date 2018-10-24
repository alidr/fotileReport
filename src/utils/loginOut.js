import axios from "axios";
import qs from 'qs';

export function loginOut() {
  return new Promise((resolve, reject) => {
    const url = getHost()+ '/UserInfo/LoginOut'
    // let url = hostUrl + '/UserInfo/LoginOut'
    axios.post(url, qs.stringify({
        UserId: getCookie("UserId"),
        token: getCookie("token")
      })).then(res => {
        if (res.data.Status == 1) {
            resolve(res.data.Data)
        } else {
          reject(res.data.Messsage)
        }
      })
      .catch(err => {
        reject(res.data.Messsage)
      })
  })
}



// let loginOut ={
//   out:()=> {
//     axios({
//       url: this.getHost() + '/UserInfo/LoginOut',
//       method: 'post',
//       data: qs.stringify({
//         UserId: this.getCookie("id"),
//         token: this.getCookie("Token")
//       })
//     }).then(res => {
//       if (res.data.Status == 1) {
//         this.delCookie("id")
//         this.delCookie("Token")
//         this.setAccessId('')
//         location.replace('/')
//       }
//     })
//   }
// }

// export default loginOut