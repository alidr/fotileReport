<template>
  <!-- 上传合同 -->
  <div id="uploadContract">
    <span class="missionImg" v-if='book'>
      <span class="mui-icon mui-icon-plusempty fileBook">
        <div class="vue-upload-img-multiple vueImg">
          <div v-if="image!=''">
            <ul>
              <img class="img" :src="image" />
              <a href="javascript:void(0);">
                <span id="close" @click='delImageB'>X</span>
              </a>
            </ul>
          </div>
          <div class="unload-ImgCon ">
            <div v-if="!image" class="unload-Img">
              <input type="file" @change="onFileChange" accept="image/*">
              <i>+</i>
            </div>
          </div>
        </div>
      </span>
    </span>
    <div class="imgDiv" v-if='heTong'>
      <div class="file">
        <span class="mission_img">
          <span class="mui-icon mui-icon-plusempty file">
            <div class="vue-upload-img-multiple">
              <div v-if="image1!=''">
                <ul>
                  <img class="img" :src="image1" />
                  <a href="javascript:void(0);">
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
                  <img class="img" :src="image2" />
                  <a href="javascript:void(0);">
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
                  <img class="img" :src="image3" />
                  <a href="javascript:void(0);">
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
      <div class="file" v-if="image3!=''">
        <span class="mission_img">
          <span class="mui-icon mui-icon-plusempty file">
            <div class="vue-upload-img-multiple">
              <div v-if="image4!=''">
                <ul>
                  <img class="img" :src="image4" />
                  <a href="javascript:void(0);">
                    <span id="close" @click='delImage(4)'>X</span>
                  </a>
                </ul>
              </div>
              <div class="unloadImgCon">
                <div v-if="!image4">
                  <input type="file" @change="onFileChange4" accept="image/*">
                  <i :style="note"></i>
                </div>
              </div>
            </div>
          </span>
        </span>
      </div>
      <div class="file" v-if="image4!=''">
        <span class="mission_img">
          <span class="mui-icon mui-icon-plusempty file">
            <div class="vue-upload-img-multiple">
              <div v-if="image5!=''">
                <ul>
                  <img class="img" :src="image5" />
                  <a href="javascript:void(0);">
                    <span id="close" @click='delImage(5)'>X</span>
                  </a>
                </ul>
              </div>
              <div class="unloadImgCon">
                <div v-if="!image5">
                  <input type="file" @change="onFileChange5" accept="image/*">
                  <i :style="note"></i>
                </div>
              </div>
            </div>
          </span>
        </span>
      </div>
      <div class="file" v-if="image5!=''">
        <span class="mission_img">
          <span class="mui-icon mui-icon-plusempty file">
            <div class="vue-upload-img-multiple">
              <div v-if="image6!=''">
                <ul>
                  <img class="img" :src="image6" />
                  <a href="javascript:void(0);">
                    <span id="close" @click='delImage(6)'>X</span>
                  </a>
                </ul>
              </div>
              <div class="unloadImgCon">
                <div v-if="!image6">
                  <input type="file" @change="onFileChange6" accept="image/*">
                  <i :style="note"></i>
                </div>
              </div>
            </div>
          </span>
        </span>
      </div>
    </div>
    <div class="feiYongDiv" v-if='feiYong'>
      <div class="imgBox">
        <div v-for="(item,index) in ImageUrl" :key='index' class="imgList">
          <i @click="deleteImg(item,index)" class="close">X</i>
          <img :src="getImgHost()+item.ImageUrl" alt="" :data-ID='item.ID'>
        </div>
        <div v-for="(t,i) in newImgUrl" :key='i' class="imgList" v-if="newImgUrl.length>0">
          <i @click="deleteNewImg(t,i)" class="close">X</i>
          <img :src="t" alt="">
        </div>
        <div class="uploadBox">
          <input type="file" accept="image/*" class="inputBox" @change="handleInput($event)">
          <i :style='note'></i>
        </div>
      </div>

    </div>

    <div class="btn">
      <p v-if='text'>最多上传6张图片</p>
      <button href="javascript:;" id="button" class="confirm" @click="upload" v-if='moreImg'>上传图片</button>
      <button href="javascript:;" id="button" class="confirm" @click="upload" v-if='bookBtn' :disabled="isDisable">确认上传</button>
      <button href="javascript:;" class="cancel" id="button" @click="cancel" v-if='btnflag'>取消上传</button>
    </div>
    <!-- <div class="msg">
      <p>1、签约合同在审核失败的时候可以重新上传 </p>
      <p>2、凭证多次重新上传</p>
    </div> -->
    <div class="maskLoading" v-if='loading'>
      <cube-loading></cube-loading>
    </div>
    <cube-button @click="showToastMask" v-if='imgLoading'>图片处理中</cube-button>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import lrz from 'lrz';
  export default {
    data() {
      return {
        imgLoading: false,
        feiYong: false, //费用凭证
        isDisable: false,
        loading: false,
        text: false, //最多上传六张
        btnflag: true, //上传授权书的取消上传
        bookBtn: true, //上传授权书的确认上传
        moreImg: false, //上传合同的上传图片
        CompanyID: 0,
        files: [],
        image: "",
        detail: '',
        // CompanyID:'',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        image6: '',
        note: {
          backgroundImage: "url(" + require("./addimg_03.png") + ")",
          backgroundPosition: 'center',
          backgroundRepeat: "no-repeat",
          backgroundSize: "28px auto",
        },
        imgArr: [],
        book: false, //上传授权书
        heTong: true, //上传合同
        ImageUrl: [],
        newImgUrl: [],
        delImgArr: [],
        imgLen: '',
        newImgLen: '',
        base64Img: '',
        textNum: 0
      }
    },

    created() {
      this.CompanyID = this.$route.query.id
      this.obtainImg()
      this.style = this.$route.query.style
      if (this.style == 2) {
        this.heTong = true
        this.book = false
        this.text = true
        this.btnflag = false
        this.bookBtn = false
        this.moreImg = true
      } else if (this.style == 1) {
        this.heTong = false
        this.book = true
        this.text = false
        this.btnflag = true
        this.bookBtn = true
        this.moreImg = false
      } else if (this.style == 3) {
        this.heTong = false
        this.book = true
        this.text = false
        this.btnflag = true
        this.bookBtn = true
        this.moreImg = false
      } else if (this.style == 4) {
        this.heTong = false
        this.feiYong = true
        this.book = false
        this.text = false
        this.btnflag = false
        this.bookBtn = false
        this.moreImg = true
      }
    },
    methods: {
      upload() {
        this.isDisable = true
        this.loading = true
        this.imgArr = []
        this.imgArr = [this.image1, this.image2, this.image3, this.image4, this.image5, this.image6]
        if (this.style == 2) {
          console.log(this.imgArr)
          axios({
            url: this.getHost() + '/Company/ContractImageSave',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              CompanyID: this.CompanyID,
              ContractImage: this.imgArr
            })
          }).then(res => {
            if (res.data.Status === 1) {
              this.getToast("上传成功", 'warn')
              setTimeout(() => {
                this.isDisable = false
                this.loading = false
                this.$router.replace({
                  path: '/companyDetail',
                  query: {
                    id: this.CompanyID
                  }
                })
                this.$router.go(-1)
              }, 2000);
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.isDisable = false
              this.loading = false
              this.getToast(res.data.Message, 'warn')
            }
          })
        } else if (this.style == 1) {
          axios({
            url: this.getHost() + '/Company/AuthBookImageSave',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              CompanyID: this.CompanyID,
              AuthBookImage: this.image
            })
          }).then(res => {
            if (res.data.Status === 1) {
              this.getToast("上传成功", 'warn')
              setTimeout(() => {
                this.isDisable = false
                this.loading = false
                this.$router.replace({
                  path: '/companyDetail',
                  query: {
                    id: this.CompanyID
                  }
                })
                this.$router.go(-1)
              }, 2000);
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.isDisable = false
              this.loading = false
              this.getToast(res.data.Message, 'warn')
            }
          })
        } else if (this.style == 3) {
          axios({
            url: this.getHost() + '/Company/ProveImageSave',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.CompanyID,
              ProveImage: this.image
            })
          }).then(res => {
            if (res.data.Status === 1) {
              this.getToast("上传成功", 'warn')
              setTimeout(() => {
                this.isDisable = false
                this.loading = false
                this.$router.replace({
                  path: '/companyDetail',
                  query: {
                    id: this.CompanyID
                  }
                })
                this.$router.go(-1)
              }, 2000);
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.isDisable = false
              this.loading = false
              this.getToast(res.data.Message, 'warn')
            }
          })
        } else if (this.style == 4) {
          this.loading = true
          if (this.delImgArr.length > 0) {
            axios({
              url: this.getHost() + '/Company/DelExpenseVoucher',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                ImageId: this.delImgArr,
                CompanyID: this.CompanyID,
              })
            }).then(res => {
              if (res.data.Status === 1) {
                this.getToast("上传成功", 'warn')
                this.textNum = 1
                setTimeout(() => {
                  this.isDisable = false
                  this.loading = false
                  this.$router.replace({
                    path: '/companyDetail',
                    query: {
                      id: this.CompanyID
                    }
                  })
                  this.$router.go(-1)
                }, 2000);
              } else if (res.data.Status < 0) {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              } else {
                this.isDisable = false
                this.loading = false
                this.getToast(res.data.Message, 'warn')
              }
            })

          }
          if (this.newImgUrl.length > 0) {
            console.log(this.newImgUrl)
            axios({
              url: this.getHost() + '/Company/ExpenseVoucherSave',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                CompanyID: this.CompanyID,
                ImageUrl: this.newImgUrl
              })
            }).then(res => {
              if (res.data.Status === 1) {
                if (this.textNum != 1) {
                  this.getToast("上传成功", 'warn')
                }
                setTimeout(() => {
                  this.isDisable = false
                  this.loading = false
                  this.$router.replace({
                    path: '/companyDetail',
                    query: {
                      id: this.CompanyID
                    }
                  })
                  this.$router.go(-1)
                }, 2000);
              } else if (res.data.Status < 0) {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              } else {
                this.isDisable = false
                this.loading = false
                this.getToast(res.data.Message, 'warn')
              }
            })
          } else {
            this.loading = false
            this.getToast('未选择凭证', 'warn')
          }
        }
      },
      cancel() {
        this.$router.replace({
          path: '/companyDetail',
          query: {
            id: this.CompanyID
          }
        })
        this.$router.go(-1)
      },
      onFileChange: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImageB(files);
      },
      // createImage(file) {
      //   var vm = this;
      //   var reader = null;
      //   reader = new window.FileReader();
      //   reader.readAsDataURL(file[0]);
      //   reader.onload = function (e) {
      //     vm.image = e.target.result;
      //     console.log(e.target.result)
      //   }
      // },
      delImageB() {
        this.image = "";
      },
      // 获取费用凭证
      obtainImg() {
        axios({
          url: this.getHost() + '/Company/ExpenseVoucherList',
          method: 'post',
          data: qs.stringify({
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            Id: this.CompanyID
          })
        }).then(res => {
          this.ImageUrl = res.data.Data
        })
      },
      // 上传费用凭证
      handleInput(e) {
        const toast = this.$createToast({
          txt: '图片处理中',
          time: 0,
          mask: true
        })
        toast.show()
        let file = e.target.files[0];
        let reader = new window.FileReader()
        let that = this
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          lrz(e.target.result)
            .then(function (rst) {
              // 处理成功会执行
              toast.hide()
              that.base64Img = rst.base64;
              that.newImgUrl.push(that.base64Img)

            });

        }
      },
      deleteNewImg(item, index) {
        this.newImgUrl.splice(index, 1)
      },
      deleteImg(item, index) {
        this.delImgArr.push(item.ID)
        this.ImageUrl.splice(index, 1)

      },
      onFileChange1: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 1);
      },
      onFileChange2: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 2);

      },
      onFileChange3: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 3);

      },
      onFileChange4: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 4);

      },
      onFileChange5: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 5);
      },
      onFileChange6: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files, 6);

      },
      createImageB(file) {
        const toast = this.$createToast({
          txt: '图片处理中',
          time: 0,
          mask: true
        })
        toast.show()
        var vm = this;
        var reader = null;
        reader = new window.FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = function (e) {
          vm.image = e.target.result;
          lrz(e.target.result)
            .then(function (rst) {
              // 处理成功会执行
              toast.hide()
              vm.image = rst.base64;
            })
        }
      },
      createImage(file, index) {
        const toast = this.$createToast({
          txt: '图片处理中',
          time: 0,
          mask: true
        })
        toast.show()
        var vm = this;
        var reader = null;
        reader = new window.FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = function (e) {
          if (index == 1) {
            vm.image1 = e.target.result;
          } else if (index == 2) {
            vm.image2 = e.target.result;
          } else if (index == 3) {
            vm.image3 = e.target.result;
          } else if (index == 4) {
            vm.image4 = e.target.result;
          } else if (index == 5) {
            vm.image5 = e.target.result;
          } else if (index == 6) {
            vm.image6 = e.target.result;
          }
          lrz(e.target.result)
            .then(function (rst) {
              toast.hide()
              // 处理成功会执行
              if (index == 1) {
                vm.image1 = rst.base64;
              } else if (index == 2) {
                vm.image2 = rst.base64;
              } else if (index == 3) {
                vm.image3 = rst.base64;
              } else if (index == 4) {
                vm.image4 = rst.base64;
              } else if (index == 5) {
                vm.image5 = rst.base64;
              } else if (index == 6) {
                vm.image6 = rst.base64;
              }
            })
        }
      },
      delImage(index) {
        // this.image = "";
        if (index == 1) {
          if (this.image2 != "") {
            this.image1 = this.image2;
            if (this.image3 != "") {
              this.image2 = this.image3;
              this.image3 = "";
              if (this.image4 != "") {
                this.image3 = this.image4;
                this.image4 = "";
                if (this.image5 != "") {
                  this.image4 = this.image5;
                  this.image5 = "";
                  if (this.image6 != "") {
                    this.image5 = this.image6;
                    this.image6 = "";
                  } else {
                    this.image5 = "";
                  }
                } else {
                  this.image4 = "";
                }
              } else {
                this.image3 = "";
              }
            } else {
              this.image2 = "";
            }
          } else {
            this.image1 = ""
          }

        } else if (index == 2) {
          if (this.image3 != "") {
            this.image2 = this.image3;
            this.image3 = "";
          } else {
            this.image2 = "";
          }

        } else if (index == 3) {
          if (this.image4 != "") {
            this.image3 = this.image4;
            this.image4 = "";
          } else {
            this.image3 = "";
          }
        } else if (index == 4) {
          if (this.image5 != "") {
            this.image4 = this.image5;
            this.image5 = "";
          } else {
            this.image4 = "";
          }
        } else if (index == 5) {
          if (this.image6 != "") {
            this.image5 = this.image6;
            this.image5 = "";
          } else {
            this.image5 = "";
          }
        } else if (index == 6) {
          this.image5 = "";
        }

      },
    }
  }

</script>

<style scoped>
  .maskLoading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  #uploadContract {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    overflow-y: auto;
  }

  .unloadImgCon {
    width: 100%;
    box-sizing: border-box;
  }

  .unload-ImgCon {
    width: 100%;
    padding: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .unloadImg {
    width: 97px;
    height: 97px;
    position: relative;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ccc;
    font-size: 60px;
  }

  .unload-Img {
    width: 100%;
    height: 60vh;
    position: relative;
    background-color: #f0f0f0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: #ccc;
    font-size: 60px;
  }

  .unloadImg>input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 97px;
    height: 97px;
  }

  .unload-Img>input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60vh;
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;
    position: fixed;
    bottom: 46px;
    width: 100%;
  }

  .btn p {
    font-size: 12px;
    color: #cccccc;
    line-height: 35px;
  }

  #button {
    display: block;
    width: calc(100% - 60px);
    text-align: center;
  }

  #button.cancel {
    background-image: linear-gradient(#ccc, #ccc);
    margin-top: 25px;
  }

  .msg {
    width: 100%;
    height: 50px;
    background-color: #fff5e7;
    color: #d3b488;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-left: 20px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
  }

  #close {
    position: absolute;
    right: 5px;
    top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    border-radius: 15px;
    font-size: 20px;
  }

  .mission_img {
    width: 100%;
    height: 60vh;
    display: inline-block;
    box-sizing: border-box;
  }

  .missionImg {
    width: 100%;
    height: 72vh;
    display: inline-block;
    padding: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
  }

  .mission_img .img {
    width: 100%;
  }

  .missionImg .img {
    width: 100%;
  }

  .imgDiv {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-top: 40px;
    flex-wrap: wrap;
  }

  .imgDiv>div {
    width: 98px;
    margin: 8px 6px;
    position: relative;
  }

  .unloadImgCon i {
    display: inline-block;
    width: 28px;
    height: 28px;

  }

  .file {
    width: 97px;
    height: 97px;
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
    width: 97px;
    height: 97px;
  }

  .file img {
    width: 97px;
    height: 97px;
  }

  .mission_img {
    width: 97px;
    height: 97px;
  }

  #close,
  .close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 4px;
    right: 8px;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 12px;
    z-index: 100;
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

  .actionDetail>div {
    padding: 10px 0;
  }

  .actionDetail>div textarea {
    width: 100%;
    font-size: 14px;
  }

  .unloadImg {
    background-color: #fff;
    height: 80vh;
    padding: 0 10px;
  }

  .unloadImg .title {
    border: none;
  }

  .vueImg {

    width: 100%;
  }

  .feiYongDiv {
    width: 94%;
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 100px;
  }

  .imgBox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .imgList {
    margin: 6px;
    width: 97px;
    height: 97px;
    border: 1px solid #f0f0f0;
    position: relative;

  }

  /* .imgBox ul{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  } */
  .imgList img {
    width: 80%;
    height: 80%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .uploadBox {
    width: 97px;
    height: 97px;
    background: #f0f0f0;
    position: relative;
    border: 1px solid transparent;
    margin: 6px;
  }

  .uploadBox i {
    width: 100%;
    height: 100%;
    display: block;
  }

  .inputBox {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 0;
  }

</style>
