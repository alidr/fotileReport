<template>
  <!-- 申请授权 -->
  <div id="applyAuthorized">
    <div class="apply">
      <div class="input timeInput">
        <span>合作时间<i>*</i></span>
        <div class="timeChang">
            <cube-button @click="showDateSegmentPicker" v-if="lookStyle==1">
              <span class="gray" v-if='startDate==""'>请输入合同时间</span>
              <p class="time" v-else ><span>{{startDate}}</span>至<span>{{endDate}}</span></p>
            </cube-button>
            <p class="time" v-if="lookStyle==2"><span>{{startDate}}</span>至<span>{{endDate}}</span></p>
        </div>
      </div>
      <div class="input">
        <span>全年预估销额<i>*</i></span>
        <input type="number" placeholder="请输入销量值" v-model="estimate" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()">
        <input type="number" placeholder="请输入销量值" v-model="estimate" v-if="lookStyle==1" >
        元
      </div>
      <div class="input">
        <span>进场费<i>*</i></span>
        <input type="number" placeholder="请输入进场费" v-model="slotAll" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()">
        <input type="number" placeholder="请输入进场费" v-model="slotAll" v-if="lookStyle==1">元
      </div>
      <div class="input">
        <span>活动费<i>*</i></span>
        <input type="number" placeholder="请输入活动费" v-model="activities" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()">
        <input type="number" placeholder="请输入活动费" v-model="activities" v-if="lookStyle==1">
        元
      </div>
      <div class="input">
        <span>固定费用<i>*</i></span>
        <input type="number" placeholder="请输入固定费用" v-model="price" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()">
        <input type="number" placeholder="请输入固定费用" v-model="price" v-if="lookStyle==1" >
        元
      </div>
      <div class="input explain">
        <span class="span">固定费用说明<i>*</i></span>
        <textarea name="" id="" placeholder="请输入费用明细，不得超过200个字" v-model="explain" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()" maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>
        <textarea name="" id="" placeholder="请输入费用明细，不得超过200个字" v-model="explain" v-if="lookStyle==1" maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>
      </div>
      <div class="input input1">
        <span>扣点形式<i>*</i></span>
        <div>
          <span>卖价倒扣了</span>
          <input class="kouDian" type="number" placeholder="请输入" v-model="discount" v-if="lookStyle==2" readonly="readonly" unselectable="on" onfocus="this.blur()">
          <input class="kouDian" type="number" placeholder="请输入" v-model="discount" v-if="lookStyle==1">
          <span>个点</span>
        </div>

      </div>
      <div class="jiLi">
        <div class="inputTitle">
          <span>激励性返利<i>*</i></span>
          <span class="weui-switch" :class="{'weui-switch-on' : me_checked}" :value="value" @click="toggle" v-if='lookStyle==1'>
            <i class="si" v-if='me_checked'>{{yesText}}</i>
            <i class="fou" v-else>{{noText}}</i>
          </span>
          <span v-if='this.me_checked&&lookStyle==2'>有</span>
          <span v-if='!this.me_checked&&lookStyle==2'>否</span>

        </div>
        <ul class="jiList" v-if='me_checked&&lookStyle==1'>
          <li v-for='(item,index) in jiLiArr' :key='index'>
            <img :src='item.src' alt="" v-if='me_checked&&lookStyle==1&&index>=1' @click.stop="delindex(index)">
            <div>
              <span>{{item.year}}</span>
              <input class="kouDian" type="number" placeholder="请输入"  v-model='jilib[index].SalePrice'>
              <span>{{item.wan}},</span>
              <span>{{item.fanli}}</span>
              <input class="kouDian" type="number" placeholder="请输入"  v-model='jilib[index].BucklePoint'>
              <span>{{item.dian}}</span>
            </div>
          </li>
        </ul>
        <ul class="jiList"  v-if='me_checked&&lookStyle==2'>
            <li v-for='(item,index) in jilic' :key='index'>
              <div>
                <span>年销售</span>
                <input class="kouDian" type="number" placeholder="请输入" v-if="lookStyle==2" v-model='item.SalePrice'  readonly="readonly" unselectable="on" onfocus="this.blur()">
                <span>万,</span>
                <span>返利</span>
                <input class="kouDian" type="number" placeholder="请输入" v-if="lookStyle==2" v-model='item.BucklePoint'  readonly="readonly" unselectable="on" onfocus="this.blur()">
                <span>个点</span>
              </div>
            </li>
          </ul>
        <div class="addMsg" v-if='me_checked&&lookStyle==1' @click='addFanli()'>
          <span>添加返利信息</span>
          <img src="./tianjia.png" alt="">
        </div>
      </div>
    </div>
    <a href="javascript:;" id="button" @click="commit" v-if="lookStyle==1">确认提交</a>
  </div>
</template>
<script>
  import qs from 'qs';
  import axios from "axios";
 
  const dateSegmentData = [
  {
    is: 'cube-date-picker',
    title: '合同开始时间',
    min: new Date(2000, 0, 1),
    max: new Date(2030, 11, 31)
  },
  {
    is: 'cube-date-picker',
    title: '合同结束时间',
    min: new Date(2000, 0, 1),
    max: new Date(2030, 11, 31)
  }
]

  export default {
    name: "ApplyAuthorized",
    data() {
      return {
        startDate: '',
        endDate: '',
        date: '',
        price: '',
        discount: '',
        Rebate: '',
        ID: '',
        lookStyle: '',
        estimate: '', //预估值
        slotAll: '', //进场费
        activities: '', //活动费
        value: true,
        sales: '', //年销售
        rebate: '', //返利
        flag: false,
        me_checked: false,
        yesText: '是',
        noText: '否',
        explain: '',
        SalePrice: '',
        BucklePoint: '',
        list: [],
        listItem: {},
        aa: false,
        jilic:[],
        flag:false,
        jilib: [{
          SalePrice: "",
          BucklePoint: ""
        }],
        jiLiA: {
          src: require('./shanchu-3.png'),
          year: '年销售',
          wan: '万',
          fanli: '返利',
          dian: '个点',
          id: 1,
          SalePrice: '',
          BucklePoint: '',
        },
        jiLiArr: [{
          src: require('./shanchu-3.png'),
          year: '年销售',
          wan: '万',
          fanli: '返利',
          dian: '个点',
          id: 1,
          SalePrice: '',
          BucklePoint: '',

        }],


      }
    },
   
    mounted () {
    this.dateSegmentPicker = this.$createSegmentPicker({
      data: dateSegmentData,
      onSelect: (selectedDates, selectedVals, selectedTexts) => {
        this.startDate=selectedTexts[0].join('-')
        this.endDate=selectedTexts[1].join('-')
        console.log(this.startDate) 
      },
      onNext: (i, selectedDate, selectedValue, selectedText) => {
        dateSegmentData[1].min = selectedDate
        if (i === 0) {
          this.dateSegmentPicker.$updateProps({
            data: dateSegmentData
          })
        }
      }
    })
  },
    created() {
      this.ID = this.$route.query.id

      this.lookStyle = this.$route.query.lookStyle
      if (this.lookStyle == 2) {
        this.gitInfo()
      }

    },
    methods: {
      showDateSegmentPicker() {
      this.dateSegmentPicker.show()
    },
     
      gitInfo() {
        this.axiosloading()
        axios({
            url: this.getHost() + '/Company/ApplyAuth',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.startDate = res.data.Data.CoopStartDate
              this.endDate = res.data.Data.CoopEndDate
              this.estimate = res.data.Data.SalePrice
              this.slotAll = res.data.Data.DoorMoney
              this.activities = res.data.Data.ActivityFee
              this.price = res.data.Data.FixedFee
              this.discount = res.data.Data.BucklePoint
              this.me_checked = res.data.Data.IsRebate
              this.explain = res.data.Data.FixedContent
              this.jilic = res.data.Data.list
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
      showDatePicker() {
        if (this.lookStyle == 1) {
          if (!this.datePicker) {
            this.datePicker = this.$createDatePicker({
              title: '选择日期',
              min: new Date(2010, 1, 1),
              max: new Date(2020, 12, 31),
              value: new Date(),
              onSelect: this.selectHandle,
              onCancel: this.cancelHandle
            })
          }
          this.datePicker.show()
        }
      },
      selectHandle(date, selectedVal, selectedText) {
        this.date = this.formatDate(date)
      },
      cancelHandle() {
        this.getToast("取消选择", 'warn')
      },
      formatDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      //提交estimate
      commit() {
        for(var i=0;i<this.jilib.length;i++){
              console.log(this.jilib[i].SalePrice)
              if(this.jilib[i].SalePrice&&this.jilib[i].BucklePoint){
                this.flag=false
              }else{
                this.flag=true
              }
          }
        if (!this.startDate&&!this.endDate) {
          this.getToast("请选择合作时间", 'warn')
        } else if (this.me_checked&&this.flag) {
          this.getToast("请输入激励性返利", 'warn')
        }else if (!this.estimate) {
          this.getToast("请输入全年预售额", 'warn')
        } else if (!this.slotAll) {
          this.getToast("请输入进场费", 'warn')
        } else if (!this.activities) {
          this.getToast("请输入活动费", 'warn')
        } else if (!this.price) {
          this.getToast("请输入固定费用", 'warn')
        } else if (!this.explain) {
          this.getToast("请输入固定费用说明", 'warn')
        } else if (!this.discount) {
          this.getToast("请输入扣点", 'warn')
        }else {
          this.axiosloading()
          axios({
              url: this.getHost() + '/Company/ApplyAuthSave',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                CompanyID: this.ID,
                FixedCharge: this.price,
                BucklePoint: this.discount,
                list: this.jilib,
                CoopStartDate: this.startDate,
                CoopEndDate: this.endDate,
                SalePrice: this.estimate,
                DoorMoney: this.slotAll,
                ActivityFee: this.activities,
                FixedFee: this.price,
                FixedContent: this.explain,
                IsRebate: this.me_checked,
              })
            })
            .then(res => {
              if (res.data.Status === 1) {
                this.getToast("提交成功", 'correct')
                setTimeout(() => {
                  this.$router.push({
                    path: '/companyDetail',
                    query: {
                      id: this.ID
                    }
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
        }
      },

      toggle() {
        this.me_checked = !this.me_checked;
      },
      addFanli() {
        this.jilib.push({
          SalePrice: '',
          BucklePoint: ''
        })
        this.jiLiArr.push(this.jiLiA);

      },
      delindex(index) {
        console.log(index)
        this.jilib.splice(index, 1)
        this.jiLiArr.splice(index, 1);
        this.jiLiArr.slice();
      },

    }

  }

</script>
<style scoped>
  @import '../../common/input.css';
  .timeChang .cube-btn::after{
  border:none!important;
  outline: none!important;
}
  #applyAuthorized {
    padding-top: 10px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    padding-bottom: 47px;
  }

  .apply {
    box-sizing: border-box;
    /* background-color: #fff; */
    margin-bottom: 44px;
  }

  .apply input {
    margin: 0 8px 0 10px;
  }

  .input {
    padding: 0 10px;
  }

  .apply span,
  .apply .arrow {
    margin: 0;
  }

  #button {
    width: 82%;
    margin: 0 auto;
  }

  .kouDian {
    flex-grow: 0 !important;
    width: 42px !important;
    margin: 0 !important;
  }

  .input1 {
    justify-content: space-between;
  }

  .jiLi {
    width: 100% !important;
    margin-top: 14px;
    background-color: white;
    overflow: hidden;
  }

  .jiList img {
    display: block;
    float: left;
    width: 19px;
    height: 19px;
  }

  .jiList li {
    width: 92%;
    margin: 0 auto;
    border-bottom: 1px solid #F0F0F0;
    padding: 14px 0;
    overflow: hidden;
  }

  .jiList li div {
    float: right;
  }

  .addMsg {
    margin-right: 14px;
    float: right;
    display: flex;
    padding-top: 16px;
    padding-bottom: 15px;
  }

  .addMsg span {
    line-height: 20px;
  }

  .addMsg img {
    display: block;
    width: 19px;
    height: 19px;
    margin-left: 13px;

  }

  .weui-switch {
    display: block;
    position: relative;
    width: 72px;
    height: 32px;
    border: 1px solid #DFDFDF;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #DFDFDF;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }

  .weui-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 30px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }

  .weui-switch:after {
    content: " ";
    position: absolute;
    top: -1px;
    left: 0;
    width: 32px;
    height: 32px;
    border-radius: 15px;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }

  .weui-switch-on {
    border-color: #d5ae62;
    background-color: #d5ae62;
  }

  .weui-switch-on:before {
    border-color: #d5ae62;
    background-color: #d5ae62;
  }

  .weui-switch-on:after {
    transform: translateX(40px);
  }

  .si {
    position: absolute;
    top: 0;
    left: 12px;
    color: white;
    font-style: normal;
    font-size: 16px;
    line-height: 30px;
  }

  .fou {
    position: absolute;
    top: 0;
    right: 12px;
    color: #CCCCCC;
    font-style: normal;
    font-size: 16px;
    line-height: 30px;
  }

  .explain {
    display: block;
    height: 90px;

  }

  textarea {
    width: 100%;
    height: 50%;
  }

  .explain .span {
    display: block;
    padding: 16px 0 10px 0;
  }

  .timeChang {
    display: flex;
    justify-content: space-between;
    line-height: 26px;
  }
  .time{
    color:#666666!important;

  }
  .time span {
    margin: 0 10px;
    color:#666666!important;

  }
  .time span:last-child{
    margin-right: 0;
  }
  .timeChang .gray{
    font-size: 14px;
    color:#CCCCCC!important;
}
  .timeInput {
    justify-content: space-between;
  }
.kouDian{
  text-align: center!important;
}
</style>
