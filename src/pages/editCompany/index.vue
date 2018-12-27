<template>
  <div id="editCompany">
    <div class="companyInfo">
      <div class="input">
        <span>公司类型</span>
        <input type="text" placeholder="请选择" readonly="readonly" unselectable="on" onfocus="this.blur()" :value="data.CategoryName">
      </div>
      <div class="input" @click="showAscType">
        <span>归属类型<i>*</i></span>
        <input type="text" placeholder="请选择" readonly v-model="ascription" :asc="ascId" unselectable="on" onfocus="this.blur()">
        <i class="arrow"></i>
      </div>
      <div class="input">
        <span>家装公司全称</span>
        <input type="text" placeholder="请输入家装公司全称" :value="data.Name" readonly="readonly" unselectable="on" onfocus="this.blur()">
      </div>
      <div class="input">
        <span>家装公司简称<i>*</i></span>
        <input type="text" placeholder="请输入家装公司简称" v-model="data.ShortName">
      </div>
      <div class="input" @click="showPicker">
        <span>省市区<i>*</i></span>
        <input type="text" placeholder="省市区" v-model="area" :areaId="areaId" readonly="readonly" unselectable="on" onfocus="this.blur()">
        <i class="arrow"></i>
      </div>
      <div class="input">
        <span>公司地址<i>*</i></span>
        <input type="text" placeholder="请输入公司地址" v-model="data.Address">
      </div>
       <div class="input">
         <span>门牌号</span>
         <input type="text" placeholder="请输入门牌号，例302室" v-model='data.HouseNumber'>
       </div>
      <div class="input">
        <span>公司状态</span>
        <input type="text" placeholder="请选择" v-model="data.StatusName" readonly>
      </div>
    </div>
    <div class="personInfo">
      <div class="input">
        <span>联系人姓名</span>
        <input type="text" placeholder="请输入联系人姓名" v-model="data.UserName">
      </div>
      <div class="input">
        <span>联系人职位</span>
        <input type="text" placeholder="请输入联系人职位" v-model="data.JobName">
      </div>
      <div class="input">
        <span>联系人手机号码</span>
        <input type="text" placeholder="请输入联系人手机号码" v-model="data.Mobile" maxlength="11">
      </div>
      <div class="input">
        <span>联系人地址</span>
        <input type="text" placeholder="请输入联系人地址" v-model="data.UserAddress">
      </div>
      <div class="input">
        <span>备注说明</span>
        <input type="text" placeholder="请输入备注说明" v-model="data.Remark">
      </div>
    </div>

    <div class="Material">
      <p class="title">门头照</p>
      <div class="file">
        <span class="mission_img">
          <span class="mui-icon mui-icon-plusempty file">
            <div class="vue-upload-img-multiple">
              <div v-if="image!=''">
                <ul>
                  <img class="img" :src="image" />
                  <a href="javascript:void(0);">
                    <span id="close" @click='delImage'>X</span>
                  </a>
                </ul>
              </div>
              <div class="unloadImgCon">
                <div v-if="!image" class="unloadImg">
                  <input type="file" @change="onFileChange" accept="image/*">
                  <i>+</i>
                </div>
              </div>
            </div>
          </span>
        </span>
      </div>
    </div>
    <a href="javascript:;" id="button" @click="commitInfo">保存</a>
  </div>
</template>
<script>
  import qs from 'qs'
  import axios from "axios";
  import json from "../completeInformation/area.json";
  import lrz from 'lrz';
  const dataTpye = [{
      text: '家装',
      value: 1,

    },
    {
      text: '门店',
      value: 2,

    }
  ]
  export default {
    data() {
      return {
        data: {
          ID: '',
          CategoryID: '',
          Name: '',
          ShortName: '',
          Status: '',
          StatusName: '',
          HouseNumber:'',
          ProvinceCode: '',
          CityCode: '',
          AreaCode: '',
          UserName: '',
          Address: '',
          JobName: '',
          Mobile: '',
          UserAddress: '',
          Remark: '',
          HeadImageUrl: '',


        },
        area: '',
        areaId: [],
        image: "",
        imageTem: '',
        ascription: '',
        ascId: 0,
      }
    },
    created() {
      this.Id = this.$route.query.id
      this.getCompanyInfo()
      this.initPicker()
    },
    mounted() {
      this.initPicker()
      this.ascType()
    },
    methods: {
      onFileChange: function (e) {
        var dom = e.currentTarget;
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.createImage(files);

      },
      createImage(file) {
        var vm = this;
        var reader = null;
        reader = new window.FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = function (e) {
          vm.image = e.target.result;
          lrz(e.target.result)
            .then(function (rst) {
              // 处理成功会执行
              vm.image = rst.base64;
            })
            .catch(function (err) {
              // 处理失败会执行
              this.getToast("上传图片过大，请重试", "warn");
            })

        }
      },
      delImage() {
        this.image = "";
      },
      getCompanyInfo() {
        axios({
            url: this.getHost() + '/Company/CompanyInfoById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.Id
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.data = res.data.Data
              this.ascId = this.data.TypeID
              this.ascId-=1
              this.pickerType.$updateProps({
                selectedIndex:[this.ascId]
              })
              console.log(this.ascId)
              if (this.ascId ==0) {
                this.ascription = '家装'
              } else if (this.ascId == 1) {
                this.ascription = '门店'
              }
              this.area = this.data.PCAName
              this.areaId = [this.data.ProvinceCode, this.data.CityCode, this.data.AreaCode]
              if (this.data.HeadImageUrl) {
                this.imageTem = this.getImgHost() + this.data.HeadImageUrl
                this.image = this.getImgHost() + this.data.HeadImageUrl
              }

            } else if (res.data.Status < 0) {
              this.getToast("登录失效，请重新登录", 'warn')
              setTimeout(() => {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              }, 2000);
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      //配置分类picker
      initPicker() {
        this.picker = this.$createCascadePicker({
          title: '省市区',
          data: json.provincelist,
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.LastInfo = ""
            this.area = selectedText
            this.areaId = selectedVal
            console.log(this.area)
          },
          onCancel: () => {
            this.getToast("取消选择", 'correct')
          }
        })
      },
      //显示分类picker
      showPicker() {
        this.picker.show()
      },
      // 归属类型
      showAscType() {
        this.pickerType.show()
      },
      ascType() {
        this.pickerType = this.$createPicker({
          title: '归属类型',
          data: [dataTpye],
          onSelect: (selectedVal, selectedIndex, selectedText) => {
            this.ascription = selectedText
            this.ascId = selectedVal[0]
            console.log(this.ascId, this.ascription);

          },
          onCancel: () => {
            this.getToast("取消选择", 'correct')
          }
        })
      },
      //提交信息
      commitInfo() {
        if (!this.area) {
          this.getToast("请选择公司地址", 'warn')
        } else if (!this.ascId) {
          this.getToast("请输入归属类型", 'warn')
          return
        } else if (!this.data.Address) {
          this.getToast("请输入公司详细地址", 'warn')
        } else {
          if (this.image == this.imageTem) {
            this.image = ""
          }
          this.axiosloading()
          axios({
              url: this.getHost() + '/Company/CompanySave',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                ID: this.Id,
                CategoryID: this.data.CategoryID,
                Name: this.data.Name,
                ShortName: this.data.ShortName,
                Area: this.areaId,
                Address: this.data.Address,
                Status: this.data.Status,
                UserName: this.data.UserName,
                JobName: this.data.JobName,
                Mobile: this.data.Mobile,
                UserAddress: this.data.UserAddress,
                Remark: this.data.Remark,
                HeadImageUrl: this.image,
                TypeID: this.ascId
              })
            })
            .then(res => {
              if (res.data.Status === 1) {
                this.getToast("编辑成功,跳转公司详情", 'correct')
                setTimeout(() => {
                  if (this.AccessId==-1) {
                    this.$router.push({path:"/adminIndex"})
                  }else{
                  this.$router.replace({
                    path: "/companyDetail",
                    query: {
                      id: this.Id
                    }
                  })
                  this.$router.go(-1)
                  }
                }, 2000);
              } else if (res.data.Status < 0) {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              } else {
                this.getToast(res.data.Message, 'warn')
              }
            })
            .catch(res => {
              this.getToast(res.data.Message, 'warn')
            })
        }
      }
    }

  }

</script>
<style scoped>
  @import '../../common/input.css';

  #close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 12px;
  }

  #editCompany {
    width: 100%;
    overflow: hidden;
    padding-top: 10px;
    box-sizing: border-box;
    position: relative;
  }

  .companyInfo,
  .personInfo {
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
  }

  .companyInfo span,
  .companyInfo input,
  .personInfo span,
  .personInfo input,
    {
    margin: 0;
  }

  .title {
    height: 40px;
    background-color: #fff;
    display: flex;
    align-items: center;
    color: #666666;
    font-size: 15px;
    margin-right: 20px;
  }

  .Material {
    padding: 15px 15px 15px 25px;
    box-sizing: border-box;
    height: 45vh;
    /* margin-bottom: 30px; */
    background-color: #fff;
    display: flex;
  }

  .Material .title {
    width: 0;
    flex-grow: 1;
  }

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

  #button {
    width: calc(100% - 60px);
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%)
  }

</style>
