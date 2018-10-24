<template>
<!-- 添加跟单 -->
  <div id="addAction"> 
    <div class="actionDetail">
      <p class="title">跟单详情</p>
      <div>
        <textarea name="" id="" cols="30" rows="6" placeholder="请填跟进内容(必填, 请输入100字以内)" v-model="detail" maxlength="100" onchange="this.value=this.value.substring(0, 100)" onkeydown="this.value=this.value.substring(0, 100)" onkeyup="this.value=this.value.substring(0, 100)" ></textarea>
      </div>
    </div>
    <div class="unloadImg">
      <p class="title">上传跟单图片</p>
      <div class="imgDiv">
        <div class="file">
            <span class="mission_img">
              <span class="mui-icon mui-icon-plusempty file">
                <div class="vue-upload-img-multiple">
                <div v-if="image1!=''">
                  <ul>
                    <img class="img" :src="image1"  />
                    <a href="javascript:void(0);" >
                      <span id="close" @click='delImage(1)'>X</span>
                    </a>
                  </ul>
                </div>
                <div class="unloadImgCon">
                  <div v-if="!image1">
                    <input type="file" @change="onFileChange1" accept="image/*">
                    <i :style="note"></i>
                  </div>
                </div>
              </div>
            </span>
          </span>
        </div>
        <div class="file" v-if="image1!=''">
            <span class="mission_img">
              <span class="mui-icon mui-icon-plusempty file">
                <div class="vue-upload-img-multiple">
                <div v-if="image2!=''">
                  <ul>
                    <img class="img" :src="image2"  />
                    <a href="javascript:void(0);" >
                      <span id="close" @click='delImage(2)'>X</span>
                    </a>
                  </ul>
                </div>
                <div class="unloadImgCon">
                  <div v-if="!image2">
                    <input type="file" @change="onFileChange2" accept="image/*">
                    <i :style="note"></i>
                  </div>
                </div>
              </div>
            </span>
          </span>
        </div>
        <div class="file" v-if="image2!=''">
            <span class="mission_img">
              <span class="mui-icon mui-icon-plusempty file">
                <div class="vue-upload-img-multiple">
                <div v-if="image3!=''">
                  <ul>
                    <img class="img" :src="image3"  />
                    <a href="javascript:void(0);" >
                      <span id="close" @click='delImage(3)'>X</span>
                    </a>
                  </ul>
                </div>
                <div class="unloadImgCon">
                  <div v-if="!image3">
                    <input type="file" @change="onFileChange3" accept="image/*">
                    <i :style="note"></i>
                  </div>
                </div>
              </div>
            </span>
          </span>
        </div>
        <p>最多上传3张图片</p>
      </div>
    </div>
    <!-- 调试上传图片问题 -->
      <!-- 上传图片3
    <input type="file">
   <a href="/a.html">跳转至a.html</a>
   <router-link to="/test">跳转test.vue</router-link> -->
   <a href="javascript:;" class="one" id="button" @click="commit">添加行动</a>
</div> 
</template>
<script>
import qs from "qs";
import axios from "axios";
import lrz from 'lrz'

export default {
  data() {
    return {
      detail: "",
      CompanyID: "",
      image1: "",
      image2: "",
      image3: "",
      note: {
        backgroundImage: "url(" + require("./images/addimg_03.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "28px auto"
      }
    };
  },
  created() {
    this.CompanyID = this.$route.query.id;
  },
  methods: {
    onFileChange1: function(e) {
      var dom = e.currentTarget;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files, 1);
    },
    onFileChange2: function(e) {
      var dom = e.currentTarget;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files, 2);
    },
    onFileChange3: function(e) {
      var dom = e.currentTarget;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files, 3);
    },
    createImage(file, index) {
      var vm = this;
      var reader = null;
      reader = new window.FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = function(e) {
        if (index == 1) {
          vm.image1 = e.target.result;
        } else if (index == 2) {
          vm.image2 = e.target.result;
        } else if (index == 3) {
          vm.image3 = e.target.result;
        }
        lrz(e.target.result)
        .then(function (rst) {
          // 处理成功会执行
          if (index == 1) {
            vm.image1 = rst.base64;
          } else if (index == 2) {
            vm.image2 = rst.base64;
          } else if (index == 3) {
            vm.image3 = rst.base64;
          }
        })
        .catch(function (err) {
          // 处理失败会执行
          this.getToast("上传图片过大，请重试", "warn");
        })
      };
    },
    delImage(index) {
      // this.image = "";
      if (index == 1) {
        if (this.image2 != "") {
          this.image1 = this.image2;
          if (this.image3 != "") {
            this.image2 = this.image3;
            this.image3 = "";
          } else {
            this.image2 = "";
          }
        } else {
          this.image1 = "";
        }
      } else if (index == 2) {
        if (this.image3 != "") {
          this.image2 = this.image3;
          this.image3 = "";
        } else {
          this.image2 = "";
        }
      } else if (index == 3) {
        this.image3 = "";
      }
    },
    commit() {
      if (!this.detail) {
        this.getToast("请输入详细跟单内容", "warn");
        return;
      }
      this.axiosloading();
      axios({
        url: this.getHost() + "/Company/AddDocumentary",
        method: "post",
        data: qs.stringify({
          UserId: getCookie("UserId"),
          token: getCookie("token"),
          CompanyID: this.CompanyID,
          ImageUrl1: this.image1,
          ImageUrl2: this.image2,
          ImageUrl3: this.image3,
          Content: this.detail
        })
      }).then(res => {
        console.log(res);
        if (res.data.Status === 1) {
          this.getToast("操作成功", "loading");
          setTimeout(() => {
            if (this.$route.query.jump == "home") {
              this.$router.push({
                path: "/home"
              });
            } else {
              this.$router.push({
                path: "/companyDetail",
                query: {
                  id: this.CompanyID
                }
              });
            }
          }, 2000);
        } else if (res.data.Status < 0) {
          this.getToast("登录失效，请重新登录", "warn");
          setTimeout(() => {
            this.delCookie("UserId");
            this.delCookie("token");
            this.setAccessId("");
            location.replace("/");
          }, 2000);
        } else {
          this.getToast(res.data.Message, "warn");
        }
      });
    }
  }
};
</script>
<style scoped>
.file {
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
.file input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  width: 80px;
  height: 80px;
}
.file img {
  width: 80px;
  height: 80px;
}
.mission_img {
  width: 80px;
  height: 80px;
}
#close {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 12px;
}

#addAction {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.actionDetail {
  padding: 0 10px;
  background-color: #fff;
  border-radius: 4px;
  margin: 15px 0 25px;
}
.title {
  height: 40px;
  background-color: #fff;
  display: flex;
  align-items: center;
  color: #808080;
  font-size: 15px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
}
.actionDetail > div {
  padding: 10px 0;
}
.actionDetail > div textarea {
  width: 100%;
  font-size: 14px;
}

.unloadImg {
  background-color: #fff;
  height: 30vh;
  padding: 0 10px;
}
.unloadImg .title {
  border: none;
}
.imgDiv {
  display: flex;
  align-items: center;
  padding-left: 10px;
  box-sizing: border-box;
}
.imgDiv > div {
  width: 80px;
  margin-right: 10px;
  position: relative;
}
/* .imgDiv>div input[type="file"]{
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.imgDiv>div img{
  width: 100%;
} */
.imgDiv > p {
  width: 0;
  flex-grow: 1;
  text-align: right;
  align-self: flex-end;
  margin-right: 2px;
  color: #ccc;
  font-size: 12px;
}
#button {
  width: calc(100% - 80px);
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 6px 10px rgba(223, 174, 72, 0.2);
}
.unloadImgCon i {
  display: inline-block;
  width: 28px;
  height: 28px;
}
</style>


