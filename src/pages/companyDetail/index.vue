<template>
  <!-- 公司详情 -->
  <div id="companyDetail">
    <!-- 家装公司基础信息 -->
    <div class="contetn">
      <div class="basicInfo">
        <div class="basicInfoTop">
          <div class="basic">
            <p class="status">
              <span>{{data.StatusName}}</span>
              <span>{{data.Name}}</span>
            </p>
            <div class="basicText">
              <p class="person">业务员<span>{{data.UName}}</span></p>
              <p class="spanText">归属类型<span>{{data.TypeName}}</span></p>
            </div>

          </div>
          <div class="topIcon">
            <span @click="showMask(true)" v-if="edit">
              <img src="./Settings.png" alt="">
            </span>
            <span v-if="stylePlay!=1">
              <img src="./common.png" alt="" v-if="!data.IsEmphasis" @click="Emphasis(false)">
              <img src="./collect.png" alt="" v-if="data.IsEmphasis" @click="Emphasis(true)">
            </span>
          </div>

        </div>
        <div class="basicInfoBottom">
          <p>
            <i><img src="./name.png" alt=""></i>
            <span>联系人</span>
            <span class="color">{{data.UserName}}</span>
            <i class="job"><img src="./job.png" alt=""></i>
            <span>岗位</span>
            <span class="color">{{data.JobName}}</span>
          </p>
          <p>
            <i><img src="./tel.png" alt=""></i>
            <span>联系方式</span>
            <span class="color">{{data.Mobile}}</span>
          </p>
          <p>
            <i><img src="./address.png" alt=""></i>
            <span>联系地址</span>
            <span class="color">{{data.UserAddress}}</span>
          </p>
          <p>
            <i><img src="./photo.png" alt=""></i>
            <span>门头照</span>
            <span class="ImageBtn" v-if="data.HeadImageUrl==''">查看门头照</span>
            <span class="ImageBtn active" v-if="data.HeadImageUrl" @click="getImg(data.HeadImageUrl)">查看门头照</span>
          </p>
          <div v-if="isExpend" class="otherInfo">
            <p>
              <span>公司类型</span>
              <span class="color">{{data.CategoryName}}</span>
            </p>
            <p>
              <span>公司简称</span>
              <span class="color">{{data.ShortName}}</span>
            </p>
            <p>
              <span>公司地址</span>
              <span class="color">{{data.PCAName}}{{data.Address}}</span>
            </p>
          </div>

          <p id="expend" @click="handleExpend"><span>{{expendWord}}</span></p>
        </div>

      </div>
      <!-- 卡片 -->
     <div class="cube">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(slide,index) in swiperSlides" :key="index" :class="{'swiper-no-swiping':infoExtend !== -1}">
            <div class="followInfo followInfoBanner" :class="{marginLeft7:index===0,marginLeft5:index!==0,height:infoExtend == -1}">
              <div class="followDays">
                <p v-if="slide.Status === 1 || slide.Status === 2">当前已跟进<span>{{slide.NowFollowDay}}</span>/{{slide.FollowDay}}天</p>
                <p v-if="slide.Status === 3">合同剩余时间<span>{{slide.EndTime}}</span>天</p>
                <p v-if="slide.Status === -3">历史合同<span style="font-size:10px;">（{{slide.CoopStartDate}} ~ {{slide.CoopEndDate}}）</span></p>
                <a href="javascript:;" @click="approvalRecord(ID)">审批记录>></a>
              </div>
              <p class="uploadAuthorized" v-if="btnActive || (infoExtend == index)">
                <a class='flex'>
                  <span class="round" :class="{'active':btnActive}">
                    <i :class="{'active':btnActive}">1</i></span>
                <span class="statusDetail" :class="{'active':btnActive}">互有意向，申请授权</span>
                </a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btnActive}" v-if="applyshou" @click="applyAuthorized(1)">申请授权</a>
                <a href="javascript:;" class="applyBtn active" v-if="!applyshou" @click="applyAuthorized(2)">查看授权凭证</a>
                <!-- <span class="applyStatus active" >审核通过</span> -->
              </p>
              <span class="line" v-if="infoExtend == index"></span>
              <p class="uploadContract" v-if="btn2Active || (infoExtend ==index)">
                <a class='flex'>
                <span class="round" :class="{'active':btn2Active}"><i :class="{'active':btn2Active}">2</i></span>
                <span class="statusDetail" :class="{'active':btn2Active}">授权书照片</span>
                </a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btn2Active}" v-if="applyshu" @click="btn2Active && uploadContract(1)">上传授权书</a>
                <a href="javascript:;" class="applyBtn active" v-if="!applyshu" @click="getImg(slide.AuthBookImage)">查看授权书</a>
                <span class="applyStatus active" v-if="reApplyshu" @click="uploadContract(1)">重新上传</span>
              </p>
              <span class="line" v-if="infoExtend == index"></span>
              <p class="applyAuthorized" v-if="btn3Active || (infoExtend == index)">
                <a class='flex'>
                <span class="round" :class="{'active':btn3Active}"><i :class="{'active':btn3Active}">3</i></span>
                <span class="statusDetail" :class="{'active':btn3Active}">签约成功，上传合同</span>
                </a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btn3Active}" v-if="applyhe" @click="uploadContract(2)">上传签约合同</a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btn3Active}" v-if="applquyu">上传签约合同</a>
                <a href="javascript:;" class="applyBtn active" v-if="!applyhe&&!applquyu" @click="showImagePreviewHT(slide.ContractImage)">查看合同</a>
              </p>
              <span class="line" v-if="infoExtend == index"></span>
              <p class="uploadContract" v-if="btn4Active || (infoExtend == index)">
                <a class='flex'>
                <span class="round" :class="{'active':btn4Active}"><i :class="{'active':btn4Active}">4</i></span>
                <span class="statusDetail" :class="{'active':btn4Active}">上传签约凭证</span>
                </a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btn4Active}" @click="uploadContract(4)" v-if='applyqy'>上传费用凭证</a>
                <a href="javascript:;" class="applyBtn" :class="{'active':btn4Active}" v-if='freeBtn'>上传费用凭证</a>
                <a href="javascript:;" class="applyBtn active" v-if="!applyqy&&!freeBtn" @click="showImagePreviewPZ(slide.ExpenseVoucherList)">查看费用凭证</a>
                <span class="applyStatus active" v-if="reApplyqy" @click="uploadContract(4)">编辑上传</span>
              </p>
              <p class="handleExtend flex" @click="handleInfoExtend(slide,index)">{{infoExtendWord}}</p>
            </div>
          </swiper-slide>
          <swiper-slide v-if="swiperRe.Status !== ''">
            <div class="followInfo followInfoBanner applyRenewal flex height" @click="linkDetail(swiperRe.RenewId)">
              <p class="flex" style="margin-top:20px;">
                <img src="./add.png" alt="" v-if="swiperRe.Status === '-2'">
                <span>{{swiperReWord}}</span>
              </p>
              <button v-if="swiperRe.Status !== '-2'">查看详情</button>
            </div>
          </swiper-slide>
        </swiper>
     </div>
      <!-- <router-link to='/test'>测试</router-link> -->
      <!-- 跟进信息 -->
      <!-- <div class="followInfo" v-if="infoExtend" style="margin:0 15px;">
        <div class="followDays">
          <p v-if="slide.Status === 1 || slide.Status === 2">当前已跟进<span>{{slide.NowFollowDay}}</span>/{{slide.FollowDay}}天</p>
          <p v-if="slide.Status === 3">合同剩余时间<span>{{slide.EndTime}}</span>天</p>
          <p v-if="slide.Status === -3">历史合同<span style="font-size:10px;">（{{slide.CoopStartDate}} ~ {{slide.CoopEndDate}}）</span></p>
          <a href="javascript:;" @click="approvalRecord(ID)">审批记录>></a>
        </div>
        <p class="uploadAuthorized">
          <a class='flex'>
          <span class="round" :class="{'active':btnActive}"><i :class="{'active':btnActive}">1</i></span>
          <span class="statusDetail" :class="{'active':btnActive}">洽谈成功，申请授权</span>
          </a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btnActive}" v-if="applyshou" @click="applyAuthorized(1)">申请授权</a>
          <a href="javascript:;" class="applyBtn active" v-if="!applyshou" @click="applyAuthorized(2)">查看授权凭证</a>
        </p>
        <span class="line"></span>
        <p class="uploadContract">
          <a class='flex'>
          <span class="round" :class="{'active':btn2Active}"><i :class="{'active':btn2Active}">2</i></span>
          <span class="statusDetail" :class="{'active':btn2Active}">授权书照片</span>
          </a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btn2Active}" v-if="applyshu" @click="btn2Active && uploadContract(1)">上传授权书</a>
          <a href="javascript:;" class="applyBtn active" v-if="!applyshu" @click="getImg(slide.AuthBookImage)">查看授权书</a>
          <span class="applyStatus active" v-if="reApplyshu" @click="uploadContract(1)">重新上传</span>
        </p>
        <span class="line"></span>
        <p class="applyAuthorized">
          <a class='flex'>
          <span class="round" :class="{'active':btn3Active}"><i :class="{'active':btn3Active}">3</i></span>
          <span class="statusDetail" :class="{'active':btn3Active}">签约成功，上传合同</span>
          </a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btn3Active}" v-if="applyhe" @click="uploadContract(2)">上传签约合同</a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btn3Active}" v-if="applquyu">上传签约合同</a>
          <a href="javascript:;" class="applyBtn active" v-if="!applyhe&&!applquyu" @click="showImagePreviewHT(slide.ContractImage)">查看合同</a>
        </p>
        <span class="line"></span>
        <p class="uploadContract">
          <a class='flex'>
          <span class="round" :class="{'active':btn4Active}"><i :class="{'active':btn4Active}">4</i></span>
          <span class="statusDetail" :class="{'active':btn4Active}">上传签约凭证</span>
          </a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btn4Active}" @click="uploadContract(4)" v-if='applyqy'>上传费用凭证</a>
          <a href="javascript:;" class="applyBtn" :class="{'active':btn4Active}" v-if='freeBtn'>上传费用凭证</a>
          <a href="javascript:;" class="applyBtn active" v-if="!applyqy&&!freeBtn" @click="showImagePreviewPZ(slide.ExpenseVoucherList)">查看费用凭证</a>
          <span class="applyStatus active" v-if="reApplyqy" @click="uploadContract(4)">编辑上传</span>
        </p>
      </div> -->
      <!-- 跟单时间线 -->
      <div class="followTime">
        <div class="followTimeTop">
          <p>
            <span>跟单时间线</span>
            （{{timeList.length}}）
            <span class="upload noImg" @click="addFollow('detail')" v-if="show">添加跟单行动</span>
          </p>

        </div>
        <div class="followTimeBottom">
          <div class="followTimeDetail" v-for="(item,index) in timeList" :key="index" v-show="index<isExtendTimeLine">
            <p class="Date">
              <span>{{item.CreateDate}}</span>
              <span class="personText">跟进人 {{item.UserName}}</span>
              <i @click="deleteShopMask(true,item.ID,1)" v-if="show"><img src="./delete.png" alt=""></i>
            </p>
            <div class="detail">{{item.Content}}</div>
            <div class="timeLineImg" @click="getTimeImg(item.Image)">
              <img :src="getImgHost()+item.Image1" alt="" v-if="item.Image1!=''" >
              <img :src="getImgHost()+item.Image2" alt="" v-if="item.Image2!=''" >
              <img :src="getImgHost()+item.Image3" alt="" v-if="item.Image3!=''" >
            </div>
          </div>
          <div class="infoNull" v-if="timeList.length==0">
            信息为空
          </div>
          <p id="expend" @click="expendTimeLine" v-if="timeList.length>1"><span>{{timeLineWord}}</span></p>
        </div>

      </div>
      <!-- 竞品分析 -->
      <div class="competition">
        <div class="followDays">
          <p>销售分析 <span class="month">{{complete.Month}}月</span></p>
          <a href="javascript:;" @click="allMonth">所有月份>></a>
        </div>
        <div class="competitionInfo" v-if="infoNull">
          <p>
            <span>公司销量</span>
            <span>{{complete.CompanySaleCount}}</span>
          </p>
          <p>
            <span>竞品销量</span>
            <span>{{complete.SaleCount}}</span>
          </p>
          <p>
            <span>竞品出样量</span>
            <span>{{complete.SampleCount}}</span>
          </p>
        </div>
        <div class="competitionNum" v-if="infoNull">
          <p>门店数&emsp;<span>{{complete.ShopCount}}</span></p>
          <p>开工数&emsp;<span>{{complete.WorkCount}}</span></p>
          <p>设计师数&emsp;<span>{{complete.StylistCount}}</span></p>
        </div>
        <div class="infoNull" v-if="!infoNull">
          信息为空
        </div>
        <div id="button" v-if="edit" @click="editCompete">编辑当前月份数据</div>
      </div>
      <!-- 直营店信息 -->
      <div class="shopInfo">
        <div class="followDays">
          <p>直营门店信息</p>

          <div v-if="noHasImg">
            <!-- <span class="upload" @click="look" v-if="busniessShopShow">查看直营分店证明</span> -->
            <span class="upload" :class="{noImg:data.ProveImage}" @click="look" v-if="busniessShopShow">查看直营分店证明</span>
            <span class="upload" :class="{noImg:data.ProveImage}" @click="look" v-if="!busniessShopShow">查看证明</span>
            <span class="reUpload" @click="uploadContract(3)" v-if="!busniessShopShow">上传直营分店证明</span>
          </div>
        </div>
        <div class="ShopMsg" v-if="afterUpload">
          <p>合同签约成功后</p>
          <p>才可添加该模块信息</p>
        </div>
        <div class="ShopDetailInfo" v-if="ShopListShow">
          <p v-for="(item,index) in shopList" :key="index">{{item.Name}}<span>{{item.Address}}</span><i @click="deleteShopMask(true,item.ID,2)"><img
                src="./delete.png" alt="" v-if="show"></i></p>
        </div>
        <div class="followDays addShop">
          <span class="upload" v-if="show&&!applyhe" @click="addShop(true)">添加直营门店</span>
        </div>
      </div>
    </div>
    <!-- 遮罩 -->
    <div id="mask" v-show="isShowMask">
      <div class="maskContain" v-if="nav">
        <a href="javascript:;" class="modifyPsd" @click="editCompany(ID)" v-if="edit">编辑公司信息</a>
        <a href="javascript:;" class="loginOut" @click="showGiveUp(true)" v-if="AccessId ==5 ">放弃跟进</a>
        <a href="javascript:;" class="delete" @click="showDelete(true)">删除</a>
        <a href="javascript:;" class="cancel" @click="showMask(false)">取消</a>
      </div>
      <div class="maskContain" v-if="giveUp">
        <p class="title">放弃跟进原因</p>
        <div class="textarea">
          <textarea name="" id="" cols="30" rows="6" v-model="giveUpReason"></textarea>
        </div>
        <div class="btn">
          <span class="cancel" @click="showGiveUp(false)">取消放弃</span>
          <span class="confirm" @click.stop="giveUpFollow">确认放弃</span>
        </div>
      </div>
      <div class="maskContain" v-if="isDelete">
        <div class="content">
          确认删除该家装公司？
        </div>
        <div class="btn">
          <span class="cancel" @click="showDelete(false)">取消</span>
          <span class="confirm" @click="confirmDelete">确认</span>
        </div>
      </div>
    </div>
    <div id="mask" v-show="isImgMask" @click="hideImgMask">
      <div class="img" v-if="isShowImg">
        <img v-gallery="'groupName'" :src="src" alt="">
      </div>
    </div>
    <!--  -->
    <div id="mask" v-show="addShopMask">
      <div class="maskContain">
        <p class="title">添加直营门店</p>
        <div class="input">
          <span>直营门店名称<i>*</i></span>
          <input type="text" placeholder="请输入直营门店名称" v-model="shopName">
        </div>
        <div class="input">
          <span>门店地址<i>*</i></span>
          <input type="text" placeholder="请输入直营门店地址" v-model="shopAdress">
        </div>
        <div class="btn">
          <span class="cancel" @click="addShop(false)">取消</span>
          <span class="confirm" @click.stop="comfirmAddShop">确认</span>
        </div>
      </div>
    </div>
    <div id="mask" v-show="deleteShopWarn">
      <div class="maskContain">
        <div class="content">
          确认删除吗？
        </div>
        <div class="btn">
          <span class="cancel" @click="deleteShopMask(false)">取消</span>
          <span class="confirm" @click="deleteSelect">确认</span>
        </div>
      </div>
    </div>
    <!-- <div class="swiperMask" v-if='ImgMaskH'>
      <i @click.stop="imgMask" class="closeSwiper">
        <img src="./close.png" alt="">
      </i>
      <swiper :options="swiperOption" ref="mySwiper">
        <div class="swiper-slide games" v-for='(t,index) in imgArr' :key='index'>
          <img :src="getImgHost()+t" alt="" v-gallery="'groupName'">
        </div>
      </swiper>
    </div> -->
  </div>
</template>
<script>
  import qs from 'qs'
  import axios from "axios";
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper';
  import {
    mapGetters,
    mapMutations
  } from 'vuex';
  export default {
    data() {
      return {
        freeBtn: false,
        applyqy: true, //签约凭证
        // swiperOption: {
        //   autoplay: 4000,
        //   resistanceRatio: 0,
        //   initialSlide: 0,
        //   autoplayDisableOnInteraction: false,
        //   preventLinksPropagation: true,
        //   pagination: ".swiper-pagination",
        //   observer: true, //修改swiper自己或子元素时，自动初始化swiper
        //   observeParents: true, //修改swiper的父元素时，自动初始化swiper
          
        // },
        noHasImg: false,
        shopID: '',
        deleteShopWarn: false,
        shopName: '',
        shopAdress: '',
        giveUpReason: '',
        isShowMask: false,
        isImgMask: false,
        nav: false,
        giveUp: false,
        isDelete: false,
        ID: -1,
        styleId: -1,
        data: {
          Status: '',
          StatusName: '',
          Name: '',
          IsEmphasis: '',
          UName: '',
          UserName: '',
          JobName: '',
          Mobile: '',
          UserAddress: '',
          HeadImageUrl: '',
          FollowDay: '',
          NowFollowDay: '',
          AuthBookImage: '',
          ContractImage: '',
          IsShowLook: false,
          ProveImage: ''
        },
        isShowImg: false,
        src: [],
        isExpend: false,
        expendWord: "展开",
        applyshou: true,
        applyshu: true,
        reApplyshu: false,
        reApplyqy: false, //重新上传费用凭证
        applyhe: true,
        btnActive: false,
        btn2Active: false,
        btn3Active: false,
        btn4Active: false,

        timeList: [],
        timeLineWord: '展开',
        isExtendTimeLine: 1,
        complete: {
          Month: '',
          SaleCount: '',
          WorkCount: '',
          SampleCount: '',
          ShopCount: '',
          StylistCount: '',
          CompanySaleCount: '', //公司销量
        },
        infoNull: false,
        //show业务员独有的部分
        show: false,
        busniessShopShow: false,
        ShopListShow: false,
        heShow: false,
        shopList: [],
        edit: false,
        afterUpload: true,
        addShopMask: false,
        stylePlay: '',
        type: -1,
        timeId: '',
        ImgMaskH: false,
        imgArr: [],
        imgStr: '',
        typeGui: '',
        applquyu: false,
        ExpenseVoucherList: '', //费用凭证
        imgs: [],
        imgMaskArrHT: [],
        imgMaskArrPZ:[],
        timeLineImg:[],
        swiperOption: {
          slidesPerView: 1.05,
          spaceBetween: 0,
          freeMode: true,
          centeredSlides: true,
          noSwiping : true
        },
        swiperSlides: [],
        infoExtend:-1,
        infoExtendWord:'展开',
        swiperRe:{}
      }

    },
    created() {
      sessionStorage.removeItem('_info')
      localStorage.removeItem("companyId")
      this.stylePlay = this.$route.query.stylePlay || ""
      this.ID = this.$route.query.id
      this.showModel()
      this.getTimeLine(this.ID)
      this.getComplete(this.ID)
      this.getCompanyContractList(this.ID)
    },
    computed: {
      swiperReWord:function () {
        if (this.swiperRe.Status==0) {
          return '续签申请中'
        } else if (this.swiperRe.Status==1) {
          return '续签申请成功'
        } else if (this.swiperRe.Status==-1) {
          return '续签申请失败'
        } else if (this.swiperRe.Status==-2) {
          return '申请续签'
        }
      },
      ...mapGetters([
        'AccessId'
      ]),
      // swiper,
      // swiperSlide,
      // swiper() {
      //   return this.$refs.mySwiper.swiper
      // }
    },
    
    methods: {
      linkDetail(id) {
        if (this.swiperRe.Status === '-2' ) {
          const _info = {
            '_companyName':this.data.Name,
            '_UName':this.data.UName,
            '_companyId': this.ID
          }
          sessionStorage.setItem('_info',JSON.stringify(_info))
          this.$router.push({path:'/applyRenewal'})
        }else{
          this.$router.push({path:'/renewalDetail',query:{reId:id,companyId:this.ID}})
        }
      },
      getCompanyContractList(id) {
        axios({
            url: this.getHost() + '/Company/CompanyContractListById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: id
            })
          })
        .then(res => {
          if (res.data.Status === 1) {
            this.swiperSlides = res.data.Data.list
            this.swiperRe = res.data.Data.model
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
        .catch(err => {
          alert(err)
        })
      },
      handleInfoExtend(slide,index) {
        if (this.infoExtend === index) {
          this.infoExtend = -1
          this.infoExtendWord = "展开"
        }else{
          this.infoExtend = index
          this.infoExtendWord =  "收起"
        }
        if (this.infoExtend) {
          this.slide = slide
        }
      },
      deleteSelect() {
        if (this.type == 1) {
          this.deleteTimeLine()
        } else {
          this.deleteShop()
        }
      },

      deleteShop() {
        axios({
            url: this.getHost() + '/Company/DelShopById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.shopID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.deleteShopMask(false)
              this.getToast("删除成功", 'correct')
              this.getShop(this.ID)
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
      deleteShopMask(bool, ID, type) {
        this.deleteShopWarn = bool;
        if (type == 1) {
          this.timeId = ID || ""
        } else {
          this.shopID = ID || ""
        }

        this.type = type
      },
      comfirmAddShop() {
        if (!this.shopName) {
          this.getToast("请输入直营店名字")
          return
        } else if (!this.shopAdress) {
          this.getToast("请输入直营店地址")
          return
        }
        axios({
            url: this.getHost() + '/Company/ShopSave',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              CompanyID: this.ID,
              Name: this.shopName,
              Address: this.shopAdress
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.addShop(false)
              this.getToast("添加直营店成功", 'warn')
              this.getShop(this.ID)
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
      addShop(bool) {
        this.addShopMask = bool
      },
      look() {
        if (this.data.Status !== 3) {
          this.getToast("该公司还未签约", 'warn')
        } else {
          if (this.data.ProveImage) {
            this.getImg(this.data.ProveImage)
          } else {
            return
          }

        }
      },
      //判断是否为业务员
      showModel() {
        if (this.AccessId == 5 && this.stylePlay == '') {
          //show业务员独有的部分
          this.show = true
        } else {
          this.show = false
        }
        this.getInfo(this.ID)

      },
      //判断直营店模块
      // showShopModel(){

      // },
      // 菜单弹层
      showMask(bool) {
        this.isShowMask = bool;
        this.nav = bool;
        this.giveUp = false;
        this.isDelete = false;
      },
      // 放弃跟进
      showGiveUp(bool) {

        this.isShowMask = bool;
        this.giveUp = bool;
        this.nav = false;
        this.isDelete = false;
      },
      // 删除
      showDelete(bool) {
        this.isShowMask = bool;
        this.isDelete = bool;
        this.nav = false;
        this.giveUp = false;
      },
      //跳转添加跟单行动
      addFollow(jump) {
        this.$router.push({
          path: '/action',
          query: {
            id: this.ID,
            jump: jump
          }
        })
      },
      //获取基础信息
      getInfo(ID) {
        axios({
            url: this.getHost() + '/Company/CompanyDetailById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.data = res.data.Data
              //公司状态
              // 是否为已签约
              if (this.data.Status == 3) {
                //已签约是否有证明
                if (this.data.Status == 3) {
                  //查看直营店按钮
                  this.noHasImg = true
                  if (this.show) {
                    this.busniessShopShow = false
                  } else {
                    this.busniessShopShow = true
                  }
                  this.ShopListShow = true
                  this.afterUpload = false
                  this.getShop(this.ID)
                } else {
                  this.noHasImg = false
                  // if (this.show) {
                  //   this.busniessShopShow = false
                  // }else{
                  // this.busniessShopShow = true
                  // }
                }
              } else {
                //上传提醒
                this.afterUpload = true
                this.busniessShopShow = true
              }

              //   if (this.data.Status==3) {
              //     if (this.show) {
              //       if (this.data.ProveImage) {
              //         this.getShop(this.ID)
              //         this.ShopListShow=true
              //       }else{
              //         this.busniessShopShow = true
              //       } 
              //   } 
              // }else{
              //    this.lookShop = true
              // }
              //业务员

              if ((this.AccessId == 5 && this.stylePlay == "") || this.AccessId == -1) {
                this.edit = true

              }
              if (this.AccessId == 5 && this.stylePlay == "" && this.data.UserID == getCookie('UserId')) {
                if (this.data.IsShowLook) {
                  this.applyshou = false
                } else {
                  this.applyshou = true
                  this.btnActive = true
                }
                // applyhe 上传合同按钮
                //！applyhe查看合同按钮
                //btn3Active亮不亮
                if (this.data.AuthBookImage && this.data.Status == 2) {
                  this.applyhe = true
                  this.btn3Active = true
                  if (this.data.ContractImage == '' || this.data.ContractImage == null) {
                    this.applyhe = true
                    this.btn3Active = true
                  } else {
                    this.applyhe = false
                    this.btn3Active = true
                  }
                }

                // else if (this.data.AuthBookImage && this.data.Status == 2) {
                //   this.applyhe = true
                //   this.btn3Active = true
                //  } else if (this.data.ContractImage && (this.data.Status == 2 || this.data.Status == 3)) {
                //   this.applyhe = false
                //   this.applquyu = false
                //   this.btn3Active = true
                // }
                if (this.data.Status == 3) {
                  this.btn3Active = false
                  this.btn4Active = true
                  this.applyqy = false
                  this.applyhe = false
                  console.log(this.data.Status)
                  if (this.data.ExpenseVoucherList == '' || this.data.ExpenseVoucherList == null) {
                    this.applyqy = true
                    this.btn4Active = true
                  } else {
                    this.reApplyqy = true
                    this.applyqy = false

                  }
                }
                // if (this.data.ContractImage&&(this.data.Status==2||this.data.Status==3)) {

                //   this.applyhe = false
                // }else{
                //   this.applyhe = true
                //   this.btn3Active = true
                // }
              } else {
                if (this.data.IsShowLook) {
                  this.applyshou = false
                } else {
                  this.applyshou = true
                  this.btnActive = false
                }

                if (this.data.ContractImage == "" || this.data.ContractImage == null) {
                  this.applyhe = true
                  this.btn3Active = false
                } else {
                  this.imgStr = this.data.ContractImage
                  this.imgArr = this.imgStr.split(',')
                  this.applyhe = false
                  this.applquyu = false
                  this.btn3Active = false
                }
                if (this.data.ExpenseVoucherList == '' || this.data.ExpenseVoucherList == null) {
                  this.applyqy = false
                  this.btn4Active = false
                  this.freeBtn = true
                } else {
                  this.reApplyqy = false
                  this.applyqy = false

                }
              }
              //区域经理
              if (this.AccessId == 3) {
                this.applyhe = false
                this.applquyu = true
                if (this.data.AuthBookImage) {
                  this.applyshu = false
                  this.reApplyshu = true
                  this.btn2Active = true
                  this.applquyu = false
                  this.applyhe = false
                  if (this.data.ContractImage) {
                    this.applquyu = false
                    this.applyhe = false

                  } else {
                    this.applquyu = true
                    this.applyhe = false
                  }

                } else {
                  if (this.data.Status == 2 || this.data.Status == 3) {
                    this.applyshu = true
                    this.btn2Active = true
                    this.applquyu = true
                    this.applyhe = false
                  } else {
                    this.applyshu = true
                    this.btn2Active = false
                  }
                }
              } else {
                this.reApplyshu = false
                if (this.data.AuthBookImage) {
                  this.applyshu = false
                } else {
                  this.applyshu = true
                  this.btn2Active = false
                }
              }
            } else if (res.data.Status < 0) {
              this.getToast(res.data.Message, 'warn')
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
      //获取跟单时间线信息
      getTimeLine(ID) {
        axios({
            url: this.getHost() + '/Company/CompanyDocList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.timeList = res.data.Data.list
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      //获取竞品信息
      getComplete(ID) {
        axios({
            url: this.getHost() + '/Company/CompanyAnalyzeByYM',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Year: '',
              Month: '',
              CompanyID: ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.complete = res.data.Data
              if (this.complete.Code == 1) {
                this.infoNull = true
              } else {
                this.infoNull = false
              }
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      //获取直营门店
      getShop(ID) {
        axios({
            url: this.getHost() + '/Company/ShopList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              id: ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.shopList = res.data.Data.list
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      //跳转编辑公司
      editCompany(id) {
        this.$router.push({
          path: '/editCompany',
          query: {
            id: id
          }
        })
      },
      //
      // editCompete(){
      //   this.$router.push({
      //     path:'/editCompete',
      //     query:{
      //       id:this.ID,
      //       month:this.complete.Month
      //       }
      //   })
      // },

      editCompete() {
        this.$router.push({
          path: '/editCompete',
          query: {
            id: this.ID,
            month: this.complete.Month,
            year: ""
          }
        })
      },
      getTimeImg(src){
        this.$createImagePreview().remove()
        this.imgArr = src.split(',')
        this.imgArr.forEach((item, index) => {
          let itemSrc = this.getImgHost() + item
          let itemSrcId= this.timeLineImg.indexOf(itemSrc)
          if (itemSrcId < 0) {
            this.timeLineImg.push(this.getImgHost() + item)
          }
        });
        this.$createImagePreview({
          imgs: this.timeLineImg,
          zIndex:10000,
          preventDefault:false
        }).show()
      },
      getImg(src) {
        this.$createImagePreview().remove()
        this.src = [this.getImgHost() + src]
        console.log(this.src)
        this.$createImagePreview({
          imgs: this.src,
          zIndex:10000,
          preventDefault:false
        }).show()
      },
      showImagePreviewHT(src) {
        this.$createImagePreview().remove()
        this.imgArr = src.split(',')
        this.imgArr.forEach((item, index) => {
          let itemSrc = this.getImgHost() + item
          let itemSrcId= this.imgMaskArrHT.indexOf(itemSrc)
          if (itemSrcId < 0) {
            this.imgMaskArrHT.push(this.getImgHost() + item)
          }
        });
        this.$createImagePreview({
          imgs: this.imgMaskArrHT,
          zIndex:10000,
          preventDefault:false
        }).show()
      },
      showImagePreviewPZ(src) {
        this.$createImagePreview().remove()
        this.imgArr = src.split(',')
        this.imgArr.forEach((item, index) => {
          let itemSrc = this.getImgHost() + item
          let itemSrcId = this.imgMaskArrPZ.indexOf(itemSrc)
          if (itemSrcId < 0) {
            this.imgMaskArrPZ.push(this.getImgHost() + item)
          }
        });
        this.$createImagePreview({
          imgs: this.imgMaskArrPZ,
          zIndex:10000,
          preventDefault:false
        }).show()
      },
      imgMask() {
        this.ImgMaskH = false
      },
      hideImgMask() {
        this.isImgMask = false
      },
      handleExpend() {
        this.isExpend = !this.isExpend
        this.expendWord = this.isExpend ? "收起" : "展开"
      },
      expendTimeLine() {
        this.isExtendTimeLine = this.isExtendTimeLine == 1 ? this.timeList.length : 1

        if (this.timeList.length == 1) {
          this.timeLineWord = ""
        } else {
          this.timeLineWord = this.isExtendTimeLine == 1 ? "展开" : "收起"
        }
      },
      //删除时间线
      deleteTimeLine() {
        axios({
            url: this.getHost() + '/Company/DelDocumentary',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.timeId
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.getToast("删除成功", 'correct')
              this.getTimeLine(this.ID)
              this.deleteShopMask(false)
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      allMonth() {
        this.$router.push({
          path: '/competeProduct',
          query: {
            id: this.ID,
            stylePlay: this.stylePlay || ""
          }
        })
      },
      approvalRecord(ID) {
        localStorage.setItem("companyId", ID)
        this.$router.push({
          path: '/approvalRecord'
        })

      },
      //申请授权
      //num==1 申请
      //num==2 查看
      applyAuthorized(num) {
        if (this.btnActive || !this.applyshou) {
          this.$router.push({
            path: '/applyAuthorized',
            query: {
              id: this.ID,
              lookStyle: num
            }
          })
        }
      },
      //上传合同
      //1授权书
      //2合同
      uploadContract(num) {
        if (this.btn3Active || this.btn2Active || this.btn4Active) {
          this.$router.push({
            path: '/uploadContract',
            query: {
              id: this.ID,
              style: num
            }
          })
        }
      },

      //放弃跟进
      giveUpFollow() {
        if (!this.giveUpReason) {
          this.getToast("请输入放弃跟进的原因", 'warn')
          return
        }
        axios({
            url: this.getHost() + '/Company/AbandonCompanyById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID,
              AbandonReason: this.giveUpReason
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.getToast("放弃跟进成功", 'warn')
              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
              }, 2000);
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
      confirmDelete() {
        axios({
            url: this.getHost() + '/Company/DelCompanyById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.getToast("删除成功", 'warn')
              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
              }, 2000);
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
      //重点关注
      Emphasis(bool) {
        this.data.IsEmphasis = !this.data.IsEmphasis
        axios({
            url: bool ? this.getHost() + '/Company/CancelEmphasisById' : this.getHost() + '/Company/SetEmphasisById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {

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
      ...mapMutations({
        setAccessId: 'SET_ACCESSID'
      }),
    },

  }

</script>
<style scoped>
  @import '../../common/mask.css';
  @import '../../common/input.css';
  @import 'swiper/dist/css/swiper.css';
  @import './index.css';
</style>
