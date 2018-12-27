<template>
  <!-- 公司待跟进 -->
  <div class="CompanyFollow" :class="{active:Mask}">
    <div class="top companyTop">
      <div class="search">
        <input type="text" placeholder="请搜索公司名称关键词" v-model="keyword">
        <span @click="search">搜索</span>
      </div>
      <div class="FilterConditions ">
        <!-- 组员筛选title -->
        <div class="filter" @click="maskStatus(3)" v-if='!postShow'>
          <div>
            <span class="filterResult" :class="{active:hasMask[3]}">{{salesNum!=0?groupText:groupSelect}}</span>
            <span v-if='salesNum!=0' :class="{active:hasMask[3]}">({{salesNum}})</span>
            <img src="./2.png" class="icon" alt="" v-if='hasMask[3]'>
            <img src="./1.png" class="icon" alt="" v-else>
          </div>
        </div>
        <i v-if='!postShow'></i>
        <div class="filter" @click="maskStatus(2)">
          <div>
            <span class="filterResult" :class="{active:hasMask[2]}">{{gaojiSelect}}</span>
            <span v-if='moreNum!=0' :class="{active:hasMask[2]}">({{moreNum}})</span>
            <img src="./2.png" class="icon" alt="" v-if='hasMask[2]'>
            <img src="./1.png" class="icon" alt="" v-else>
          </div>
        </div>
        <div class="mask" v-show="hasMask[0]"></div>
        <div class="mask" v-show="hasMask[2]"></div>
        <div class="mask" v-show="hasMask[3]"></div>

      </div>
       <div class="allMask">

        <!-- 岗位筛选 -->
        <div class="allListMask" v-show="hasMask[0]">

          <div>
            <div class="allListMask" v-show="hasMask[0]">
              <div>
                <div class="leftUl  widthUL grayF9">
                  <ul class="leftList" v-show='showDistrib'>
                    <li v-if='allColor' :class='{active:textColor}'>全部{{allText}}</li>
                    <li v-for='(item,index) in leftList' @click='leftClick(item,index)' :class='{active:index==leftActive}'>{{item.Name}}</li>
                    <li v-if='!allColor' :class='{active:leftTextColor}' v-html='rightAllText' @click='allClick&&leftAllClick()' ></li>
                  </ul>
                </div>
                <!-- 业务员列表 -->
                <div class="scroll-list-wrap saleWarp" v-show="showDistrib">
                  <cube-scroll ref="scrollSale" :data="Status" :options="saleOptions">
                    <ul class="rightList white" v-show='showDistrib'>
                        <li v-if='allColor' :class='{active:textColor}'>全部{{allText}}</li>
                      <li @click='rightAllClick()' :class='{active:textColor}' v-html='leftAllText' v-else></li>
                      <li v-for="(item,index) in Status" :key='index' :dataZM='item.ZM' @click='clickFlag&&index!=rightActive&&item.list.length>0&&rightClick(item,index)'
                        :class='{active:index==rightActive}'>
                        <span>{{item.Name}}</span>
                        <div class="checkIcon" @click='checkSales(item)' v-if='checkBox'>
                          <i class="emptyBox" :class="{emptyBox:true,checkBoxIcon:isFoodActive.indexOf(item.ID)>-1||boxFlag}"></i>
                        </div>
                      </li>
                    </ul>
                  </cube-scroll>

                </div>
              </div>
              <div class="stateBtn">
                <button type="button" class="gray" @click='rightAllClick()'>重 置</button>
                <button type="button" class="yellow" @click='sureSales()'>确 认</button>
              </div>
            </div>
          </div>

        </div>
      
        <!-- 高级筛选 -->
        <div class="stateContent" v-show="hasMask[2]">
          <div class="stateUl">
           
            <!-- 公司分类 -->
            <h3>公司分类</h3>
            <ul class="companyList">
              <li :class='{active:allClassify}' @click='checkClassify()'>公司分类</li>
              <li v-for="(item,index) in Style" :key="index" :class="{active:isStyle.indexOf(item.ID)>-1}" @click="companyCheck(item)">{{item.Name}}</li>
            </ul>

             <!-- 全部状态 -->
             <h3 v-if='!postShow'>全部状态</h3>
             <ul class="allState" v-if='!postShow'>
               <li :class='{active:allStatus}' @click='checkAllStatus()'>全部</li>
               <li v-for="(item,index) in allStateText" :key="index" :class="{active:isStatus.indexOf(item.ID)>-1}"
                 @click="stateCheck(item)">{{item.Name}}</li>
             </ul>
          </div>
          <div class="stateBtn">
            <button type="button" class="gray" @click='resetState(allStateText)'>重 置</button>
            <button type="button" class="yellow" @click='sureState()'>确 认</button>
          </div>
        </div>
          <!-- 组员筛选 -->
          <div class="groupMaskBig" v-show="hasMask[3]">
            <div class="groupMask">
              <div class="scroll-list-wrap saleWarp">
                <cube-scroll ref="scrollSale" :data="Status" :options="saleOptions">
                  <ul class="selectListPerson">
                    <li  :class='{active:textColor}' @click='allGroup()'>{{personSelect}}</li>
                    <li v-for="(item,index) in Person" :key='index' :dataZM='item.ZM' 
                    :class="{active:index==personHasActive}">
                      <span>{{item.Name}}</span>
                      <div class="checkIcon" @click='checkGroup(item)' v-if='!checkBox'>
                        <i class="emptyBox" :class="{emptyBox:true,checkBoxIcon:isFoodActive.indexOf(item.ID)>-1}"></i>
                      </div>
                    </li>
                  </ul>
                </cube-scroll>
              </div>
              <div class="stateBtn">
                <button type="button" class="gray" @click='resetGroup()'>重 置</button>
                <button type="button" class="yellow" @click='sureGroup()'>确 认</button>
              </div>
            </div>
          </div>
      </div>
      <div class="letterSort" v-if="hasMask[3]||hasMask[0]&&sortArr.length>0">
        <p v-for='(item,index) in sortArr' @click='namePosition(item,index)' :class='{active:index==zmFlag}'>{{item}}</p>
      </div>
   


    </div>
<div class="scroll-list-wrap">
  <cube-scroll
    ref="scroll"
    :data="list"
    :options="options"
    @pulling-up="onPullingUp">
    <div>
        <div class="contentList" v-for="(item,index) in list" :key="index" @click="companyDetail(item.ID)">
          <div class="contentListTop">
              <p class="firstLine">
                <span :class="{qiaTan:item.Status==1,qianYue:item.Status==2,qianYued:item.Status==3,fangQi:item.Status==-1,xinJian:item.Status==0,guoQi:item.Status==-3}">{{item.StatusName}}</span>
                <span v-if="item.Status!=3">剩余保护期:{{item.EndDate}}天</span>
                <span v-if="item.Status==3">合同剩余时间:{{item.EndTime}}天</span>
              </p>
              <p class="twoLine">
                
                <a href="javascript:;" class="round" :class="{'active':checkBoxs[index]}" @click.stop="check(index,item.ID)" ><b
                    :class="{'active':checkBoxs[index]}"></b></a>
                    <!-- 公司评级 -->
                    <!-- <a href="javascript:;"  class="bigIcon"><span class="smallIcon"><b>B+</b></span></a> -->
                <a href="javascript:;" class="name">{{item.Name}}</a>
              </p>
              <i v-if="item.IsEmphasis"></i>
            </div>
            <div class="contentListBottom">
                <i v-if="!item.CreateDate==''">{{item.CreateDate}}</i>
              <p v-if="!item.CreateDate==''">{{item.Content}}</p>
              <b v-if="!item.CreateDate==''">{{item.UserName}}</b>
              <i v-if="item.CreateDate==''">暂无跟单消息</i>
            </div>
        </div>
      <empty v-if='emptyFlag'></empty>
    </div>
  </cube-scroll>
</div>

    <footer v-if="!selected">
      <span :class="{active:checkAllBox}" @click="checkAll(list)"></span>
      <p>已选择
        <b>{{idList.length}}</b>个家装公司</p>
      <button type="button" @click="distribution">分配业务员</button>
    </footer>

     <!-- <empty v-if='emptyFlag'></empty> -->
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import { mapGetters, mapMutations } from 'vuex'
  import empty from "../../components/empty"
  export default {
    name: 'CompanyFollow',
    data(){
      return{
        allshuXing:true,
        rightActive:-1,
        leftActive:-1,
        showDistrib: true, //经销商显示隐藏
        textColor: true,
        sortArr: [], //字母排序
        postShow: true, //岗位筛选显示隐藏
        moreNum: 0, //高级筛选数量现实
        salesNum: 0, //岗位筛选业务员数量显示
        salesNumFlag: false,
        salesmanFlag: true, //全部业务员
        distribFlag: true, //全部经销商
        allClassify: true, //全部公司分类
        allStatus: true, //全部公司状态
        isStyle: [],
        isStatus: [],
        salesArr: [],
        isFoodActive: [],
        
        salesMask: false, //业务员列表
        // 全部分类
        allStateText: [{
          ID: 1,
          Name: '洽谈中',
          check: false,
        }, {
          ID: 2,
          Name: '签约中',
          check: false,
        }, {
          ID: 3,
          Name: '已签约',
          check: false,
        }, {
          ID: -3,
          Name: '已过期',
          check: false,
        }],
        topHight: 0,
        zmArr: [],
        nameData: [],
        salesText: '业务员',
        groupText: '组员',
        leftList: [],
        rightList: [],
        allText: '',
        linShiArr: [],
        positionID: [],
        leftAllText: '',
        rightIdArr: [],
        checkBox: false,
        clickFlag: true,
        allColor: true,
        boxFlag: false,
        startArr: [],
        zmFlag: -1,
        allClick:true,
        quanBu:'全部',
        leftTextColor:true,
        JobID:[],
        pageCount:1,
        page:1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
        list:[],
        checkBoxs:[],
        checkAllBox:false,
        idList:[],
        selected:true,
        emptyFlag: false,
        keyword:'',
        StatusID:'',
        TypeID:'',
        SaleID:[],
        Mask: false,
        Person: [],
        personHasActive: -1,
        personSelect: "全部组员",
        // 全部分类
        shuXing:-1,
        shuXingText: [{
          ID: 1,
          Name: '家装公司',
          check: false,
        }, {
          ID: 2,
          Name: '报备小区',
          check: false,
        }],
        // 公司类型列表
        Style: [],
        hasMask: [false, false,false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        statusHasActive: 0,
        statusSelect: "岗位",
        groupSelect:'组员',
        emptyFlag: false,
        gaojiSelect: "高级筛选",
        moreNum: 0, //高级筛选数量现实
        allClassify: true, //全部公司分类
        allStatus: true, //全部公司状态
        isStatus: [],
        isStyle: [],
        Status:[],
      }
    },
    components:{
      empty
    },
    created(){
      localStorage.removeItem("CompanyID")
      if (this.AccessId==-1) {
        this.getList()
      }else if (this.AccessId==5){
        this.getMyMember()
        this.postShow = false
        this.getPersonList()
      } 
      this.getStyleList()
      
    },
     computed: {
        options() {
        return {
          pullUpLoad: this.pullUpLoadObj,
          scrollbar: true
        }
      },
      saleOptions() {
        return {
          pullingDown: false,
          beforePulldown: true,
          isPullingDown: false,
          pulldown: false,
          pullup: false
        }
      },
      pullUpLoadObj: function() {
        return {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {
            more: this.pullUpLoadMoreTxt,
            noMore: this.pullUpLoadNoMoreTxt
          }
        }
      },
      ...mapGetters([
        'AccessId'
      ])
    },
    components:{
      empty
    },
    methods:{
      onPullingUp() {
          // 更新数据
      
           
           if (this.pageCount>=this.page) {
                if (this.AccessId==-1) {
                this.getList()
              }else if (this.AccessId==5){
                this.getMyMember()
              } 
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
      getPersonList(){
        axios({
          url:this.getHost()+'/UserInfo/GetGroupUserList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')

          })
        })
        .then(res=>{
          if (res.data.Status===1) {
            this.Person = res.data.Data.list
            this.sortArr=res.data.Data.zmlist
          }else if (res.data.Status<0) {
            this.getToast("登录失效，请重新登录",'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
      //  personListActive(index, name,id) {
      //   this.personHasActive = index
      //   // this.personSelect = name
      //   this.hasMask[3] = false
      //   this.SaleID=id
      //   this.getMyMember()
      // },
      search(){
        this.page = 1
        if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.postShow = false
        } 
      },
       getStyleList(){
        axios({
          url:this.getHost()+'/Notice/CompanyList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')
          })
        })
        .then(res=>{
          if (res.data.Status===1) {
            this.Style = res.data.Data.list
            
          }else if (res.data.Status<0) {
            this.getToast("登录失效，请重新登录",'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
       // 岗位筛选遮罩
       maskStatus(index) {
        if (this.hasMask[index] == true) {
          this.hasMask[index] = false
        } else {
          this.hasMask = [false, false, false]
          
          if (this.AccessId == 2) {
            this.allText = '区域经理'
          }
          if (this.AccessId == 1) {
            this.allText = '部门经理'
          }
          if (this.AccessId == 3) {
            this.allText = '经销商'
          }
          if (this.AccessId == 4) {
            this.allText = '业务员'
          }
          if (this.AccessId == -1) {
            this.allText = '分总'
          }
          if(this.Status.length>0){

          }else{
            if(index==3){
            this.getPersonList()
          }else if(index==0){
            axios({
                url: this.getHost() + '/Company/UserInfoListById',
                method: 'post',
                data: qs.stringify({
                  UserId: getCookie('UserId'),
                  token: getCookie('token'),
                })
              })
              .then(res => {
                if (res.data.Status == 1) {
                  this.Status = res.data.Data.list
                  this.sortArr =res.data.Data.zmlist
                  this.Status.forEach((t, i) => {
                    t.flag = false
                    t.positionID = 1
                    this.startArr = this.Status
                    t.list.forEach((m) => {
                      m.flag = false
                      m.positionID = 2
                      m.list.forEach((q) => {
                        q.flag = false
                        q.positionID = 3
                        q.list.forEach((x) => {
                          x.flag = false
                          x.positionID = 4
                          x.list.forEach((n) => {
                            n.flag = false
                            n.positionID = 5
                          })
                        })
                      })
                    })
                  })
               
                }

              })
              }
            }
          this.hasMask[index] = true
        }
        this.Mask = this.hasMask[index] ? true : false

      },
      //右边全部按钮点击
      rightAllClick(){
        if(this.salesNum!=0){
          this.isFoodActive=[]
          this.textColor=true
          this.rightAllText=this.leftAllText
          this.salesNum=0
          return false
        }
        this.Status.forEach((y)=>{
          this.textColor=true
          this.leftTextColor=true
          this.rightActive=-1
          let JobIDLen
          let rightID=this.rightIdArr.indexOf(y.ID)
          this.leftList.forEach((s)=>{
            JobIDLen=this.JobID.indexOf(s.JobID)
          if(this.JobID.indexOf(s.JobID)<=-1){
            this.JobID.push(s.JobID)
          }
         
        })
        if(JobIDLen==-1&&this.leftAllText!=this.rightAllText){
          this.leftList.splice(JobIDLen)
            this.positionID.splice(JobIDLen)
            this.rightIdArr.splice(rightID)
        console.log(JobIDLen)

        }
        if(JobIDLen>-1&&this.leftAllText!=this.rightAllText){
          console.log(JobIDLen,'JobIDLen')
            this.leftActive=-1
            this.leftTextColor=true
            this.textColor=true
            this.leftList.splice(JobIDLen)
            this.positionID.splice(JobIDLen)
            this.rightIdArr.splice(rightID)
        }
        
          if (y.JobID == 1) {
            this.leftAllText = this.quanBu+'分总'
          }
          if (y.JobID == 2) {
            this.leftAllText = this.quanBu+'部门经理'
          }
          if (y.JobID == 3) {
            this.leftAllText = this.quanBu+'区域经理'
            
          }
          if (y.JobID == 4) {
            this.leftAllText = this.quanBu+'经销商'
          }
          if (y.JobID == 5) {
            this.leftAllText = this.quanBu+'业务员'
            if(this.isFoodActive.indexOf(y.ID)>-1){
              this.isFoodActive=[]
              this.textColor=true
              this.leftTextColor=true
              this.allColor=false
            }
          }
         this.rightAllText=this.leftAllText
        })

      },
      //左边全部按钮点击
      leftAllClick() {
        this.textColor=true
        this.leftTextColor=true
        this.leftActive=-1
        this.rightActive=-1
        let allSale=this.leftList[this.leftList.length-1]
        this.Status=allSale.list
        this.leftAllText=this.rightAllText
        allSale.list.forEach((i)=>{
          if(i.list.length==0){
            this.checkBox=true
          }
        })

      },
      //右边列表的点击
      rightClick(item, index) {
        if (item.JobID == 1) {
            this.leftAllText = this.quanBu+"部门经理"
          }
          if (item.JobID == 2) {
            this.leftAllText = this.quanBu+"区域经理"
          }
          if (item.JobID == 3) {
            this.leftAllText = this.quanBu+"经销商"
          }
          if (item.JobID == 4) {
            this.leftAllText = this.quanBu+"业务员"
          }
          this.rightAllText=this.leftAllText
         
        this.allColor = false
        let positionID = this.positionID.indexOf(item.positionID)
        let rightID = this.rightIdArr.indexOf(item.ID)
        
        if (this.leftList.length == 0) {
          this.leftList.push(item)
          this.rightIdArr.push(item.ID)
          this.leftActive=-1
          this.leftTextColor=true
          this.textColor=true
          this.positionID.push(item.positionID)
        }
        if (this.leftList.length == 1) {
          this.leftList.forEach((g) => {
            if (item.positionID != g.positionID) {
              if (this.rightIdArr.indexOf(item.ID) < 0) {
                this.rightIdArr.push(item.ID)
                this.leftList.push(item)
                this.leftActive=-1
                this.leftTextColor=true
                this.textColor=true
              }
              if (this.positionID.indexOf(item.positionID) < 0) {
                this.positionID.push(item.positionID)
              }
            }

            if (item.positionID == g.positionID) {

              this.rightIdArr = []
              this.leftList = []
              if (this.rightIdArr.indexOf(item.ID) < 0) {

                this.rightIdArr.push(item.ID)
                this.leftList.push(item)
                this.leftActive=-1
                this.leftTextColor=true
                this.textColor=true
              }
            }

          })

        }
        if (this.leftList.length > 1) {
          this.leftList.forEach((g) => {
            if (this.rightIdArr.indexOf(item.ID) < 0) {
              this.rightIdArr.push(item.ID)
              this.leftList.push(item)
              this.leftActive=-1
              this.leftTextColor=true
              this.textColor=true
              if (this.positionID.indexOf(item.positionID) < 0) {
                this.positionID.push(item.positionID)
              }
            }else{
            }
            if (item.positionID == g.positionID && item.ID != g.ID) {
              this.leftActive=-1
              this.leftTextColor=true
              this.textColor=true
              this.leftList.splice(positionID, this.leftList.length - 1 - positionID)
              this.positionID.splice(positionID + 1, this.positionID.length - 1 - positionID)
              this.rightIdArr.splice(rightID + 1, this.rightIdArr.length - 1 - rightID)
            }
          })
        }
        this.rightActive = -1

        item.list.forEach((k, l) => {
          if (k.list.length <= 0) {
            this.clickFlag = false
            this.checkBox = true
            this.leftActive = -1
            this.textColor = true
            this.leftTextColor=true
          } else {
            this.checkBox = false
            this.clickFlag = true
          }
        })
        this.Status = item.list
        this.sortArr = item.zmlist
      },
      //左边列表的点击
      leftClick(item, index) {
        if (item.JobID == 1) {
            this.leftAllText = this.quanBu+"分总"
          }
          if (item.JobID == 2) {
            this.leftAllText = this.quanBu+"部门经理"
          }
          if (item.JobID == 3) {
            this.leftAllText = this.quanBu+"区域经理"
          }
          if (item.JobID == 4) {
            this.leftAllText = this.quanBu+"经销商"
          }
         
        this.leftActive = index
        if (this.leftActive >= 0) {
          this.textColor = false
          this.leftTextColor=false
        }
        if (item.list.length >= 0) {
          this.checkBox = false
          this.clickFlag = true

        } else {
          this.checkBox = true
          this.clickFlag = false
        }
        this.leftActive = index
        let idArr = []
        this.leftList.forEach((e, f) => {
          e.list.forEach((c, d) => {
            if (idArr.indexOf(c.ID) < 0) {
              idArr.push(c.ID)
            }
            if (item.ID == c.ID) {
              this.Status = e.list
              this.sortArr = e.zmlist
              this.rightActive = d
            }
          })
        })

        if (idArr.indexOf(item.ID) < 0) {
          this.Status = this.startArr
          this.Status.forEach((t, i) => {
            this.sortArr = t.zmlist
            if (t.ID === item.ID) {
              this.rightActive = i
            }
          })
        }
      },
      checkSales(item) {
        this.topHight = event.currentTarget.offsetTop
        this.salesmanFlag = false
        let id = item.ID
        let indexId = this.isFoodActive.indexOf(id);
        if (indexId < 0) {
          this.isFoodActive.push(id);
          this.salesNum = this.isFoodActive.length
          this.SaleID = this.isFoodActive.join(',')
          this.rightAllText="业务员"+"("+this.salesNum+")"

        } else {
          this.isFoodActive.splice(indexId, 1);
          this.salesNum = this.isFoodActive.length
          this.rightAllText="业务员"+"("+this.salesNum+")"
          if (this.salesNum == 0) {
            this.rightAllText = this.quanBu+"业务员"
            this.leftAllText = this.quanBu+"业务员"
            this.textColor=true
          }
          this.SaleID = this.isFoodActive.join(',')
        }
        if (this.isFoodActive.indexOf(item.ID) > -1) {
          this.textColor = false
          this.leftTextColor=true
        }
      },

      //岗位确定
      sureSales(){
        this.hasMask=[false,false,false]
      },
      // 组员多选
      checkGroup(item) {
        let id = item.ID
        let indexId = this.isFoodActive.indexOf(id);
        if (indexId < 0) {
          this.isFoodActive.push(id);
          this.salesNum = this.isFoodActive.length
          this.SaleID = this.isFoodActive.join(',')

        } else {
          this.isFoodActive.splice(indexId, 1);
          this.salesNum = this.isFoodActive.length
          this.SaleID = this.isFoodActive.join(',')
        }
        if (this.isFoodActive.indexOf(item.ID) > -1) {
          this.textColor = false
        }else{
          this.textColor = true
        }
      },
       // 首字母定位
       namePosition(item, index) {
        this.zmFlag = index
        let newList = this.sortArr.slice(0, this.sortArr.indexOf(item))
        let number = 0
        this.Status.forEach((el) => {
          if (newList.indexOf(el.ZM) > -1) {
            number++
          }
        })
        this.scrollTo(number)
      },
      scrollTo(number) {
        var liHeight = 40 //li的高度
        this.$refs.scrollSale.scrollTo(0, this.scrollToY = -((number) * liHeight), )
      },

      //组员确定
      sureGroup(){
           this.SaleID=this.isFoodActive.join(',')
           this.hasMask=[false,false,false]
           this.page=1
        this.getMyMember()
        this.$refs.scroll.scrollTo(0,0)
      },
      //全部组员点击
      allGroup(){
        this.isFoodActive=[]
        this.textColor=true
      },
      // 组员重置
      resetGroup(){
        this.isFoodActive=[]
        this.textColor=true
      },
      statusListActive(index, name,id) {
        this.statusHasActive = index
        this.statusSelect = name
        this.hasMask[0] = false
        this.StatusID = id
        this.page = 1
         if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.postShow = false
        } 
      },
      styleListActive(index, name,id) {
        this.styleHasActive = index
        this.styleSelect = name
        this.hasMask[1] = false
        this.TypeID=id
        this.page = 1
         if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.postShow = false
        } 
             
      },
      companyDetail(id){
        this.$router.push({
          path:'/companyDetail',
          query:{
            id:id,
            stylePlay:1
          }
        })
      },
      getMyMember(){
        axios({
          url:this.getHost()+'/UserInfo/GetUserCompanyList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Status:this.StatusID,
            CategoryID:this.TypeID,
            Keyword:this.keyword,
            SaleID:this.SaleID,
            // Page:1
          })
        })
        .then(res=>{
          if (res.data.Status===1) {
            this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.list = res.data.Data.list
                }else{
               if (this.list.length>0&&this.page>1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.list = this.list.concat(res.data.Data.list)
                  
                }
                }
              this.page++
              if (this.list.length==0) {
                this.emptyFlag = true
              }else{
                this.emptyFlag = false
              }


            // this.list  = res.data.Data.list    
            // if (this.list.length==0) {
            //     this.emptyFlag = true
            // }else{
            //     this.emptyFlag = false
            // }      
          }else if (res.data.Status<0) {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
      getList(page){
        axios({
          url:this.getHost()+'/Admin/WaitFollowList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Status:this.StatusID,
            CompanyTypeID:this.TypeID,
            Keyword:this.keyword,
            page:page||1
          })
        })
        .then(res=>{
          if (res.data.Status===1) {
           this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.list = res.data.Data.list
                }else{
               if (this.list.length>0&&this.page>1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.list = this.list.concat(res.data.Data.list)
                  
                }
                }
              this.page++
              if (this.list.length==0) {
                this.emptyFlag = true
              }else{
                this.emptyFlag = false
              }
            for (let i = 0; i < this.list.length; i++) {
              this.checkBoxs.push(false)
              
            } 
            
            if (this.list.length==0) {
                this.emptyFlag = true
            }else{
                this.emptyFlag = false
            } 
                      
          }else if (res.data.Status<0) {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
      check(index,id){
        if (this.checkBoxs[index]) {
          this.checkBoxs[index]=false
          this.checkAllBox = false
          for (let i = 0; i <  this.idList.length; i++) {
          if (this.idList[i]==id) {
            this.idList.splice(i)
            }
          }

          for (let i = 0; i < this.checkBoxs.length; i++) {
          if (this.checkBoxs[i]) {
             this.checkAllBox = true
          }
        }
          
        }else{
          this.checkBoxs[index]=true
          this.idList.push(id)
          this.checkAllBox = true
        } 

        this.idList = this.idList.slice()
        this.checkBoxs = this.checkBoxs.slice()
        

      },
      checkAll(list){
        
        if (this.checkAllBox) {
          this.checkAllBox =false
          this.idList = this.idList.splice()
          for (let i = 0; i <list.length; i++) {
            this.checkBoxs[i]= false
          }
          this.checkBoxs = this.checkBoxs.slice()
        }else{
          
          this.checkAllBox = true
          for (let i = 0; i < list.length; i++) {
            this.checkBoxs[i] = true
            this.idList.push(list[i].ID)
          }
           this.checkBoxs = this.checkBoxs.slice()
           this.idList = this.idList.slice()
        }

      },
      // 全部公司属性
      checkAllshuXing(){
        this.allshuXing=true
        this.shuXing=-1
      },
      shuXingCheck(item,index){
        this.shuXing=index
        this.allshuXing=false
      },
       //点击全部分类
       checkAllStatus() {
        this.allStatus = true
        this.isStatus = []
        this.StatusID = ''
      },
       //点击公司分类
       checkClassify() {
        this.allClassify = true
        this.isStyle = []
        this.TypeID = ''
      },
      companyCheck(item) {
        this.allClassify = false
        let id = item.ID
        let indexId = this.isStyle.indexOf(id);
        if (indexId < 0) {
          this.isStyle.push(id);
          this.TypeID = this.isStyle.join(',')
        } else {
          this.isStyle.splice(indexId, 1);
          this.TypeID = this.isStyle.join(',')
        }
      },
      //高级筛选点击重置
      resetState() {
        this.isStyle = []
        this.isStatus = []
        this.TypeID = ''
        this.StatusID = ''
        this.allClassify = true
        this.allStatus = true
      },
      //高级筛选点击确认
      sureState() {
        this.moreNum = this.isStatus.length + this.isStyle.length
        this.page = 1
        this.hasMask=[false,false,false]
        this.$refs.scroll.scrollTo(0,0)
        if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
        } 
      },
      stateCheck(item) {
        this.allStatus = false
        let id = item.ID
        let indexId = this.isStatus.indexOf(id);
        if (indexId < 0) {
          this.isStatus.push(id);
          this.StatusID = this.isStatus.join(',')
        } else {
          this.isStatus.splice(indexId, 1);
          this.StatusID = this.isStatus.join(',')
        }
      },
      distribution(){
        if (this.idList.length==0) {
          this.getToast("请选择要分配的公司",'warn')
        }else{
          localStorage.setItem("CompanyID",JSON.stringify(this.idList))
          this.$router.push({
            path:'/SalesmanList'
          })
        }
      }

    }
  }

</script>

<style scoped>
  /* @import '../../common/filter.css'; */
  @import '../../common/filterH.css';
  @import '../../common/focusList.css';
  .scroll-list-wrap {
  height: calc(100vh - 150px);
}
  
  .CompanyFollow {
    width: 100%;
    overflow: hidden;
  }

  .top {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 20px;
    background: white;
    margin-bottom: 12px;
  }

  .top .search {
    width: 92%;
    height: 44px;
    margin: 0 auto;
    position: relative;

  }

  .top .search input {
    width: 80%;
    height: 96%;
    border: none;
    background: none;
    padding-left: 14px;
    border: 1px solid rgba(208, 208, 208, 1);
    border-radius: 4px;

  }

  .top .search span {
    display: block;
    width: 18%;
    height: 44px;
    background: rgba(182, 160, 121, 1);
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 44px;
    text-align: center;
  }

  .top .classList {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 22px;
    display: flex;
    justify-content: space-between;
  }
  .top .classList .filter{
    margin-right: 0;
    width: 42%;
    flex: none;
  }




  .companyList {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
  }

  .companyList ul {
    width: 100%;
    overflow: hidden;
  }

  .companyList ul li {
    width: 100%;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }

i{
  font-style: normal;
}

  footer {
    width: 100%;
    height: 55px;
    background: #636770;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  footer span {
    float: left;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-left: 6px;
    border: 1px solid #ccc;
    position: relative;
    margin-right: 14px;
    margin-top: 19px;
    margin-left: 36px;
  }
  footer span.active{
     border: 1px solid rgba(226, 199, 143, 1);
  }
  footer span.active::before{
    background: rgba(226, 199, 143, 1);
  }
  footer span::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    background: #ccc;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;


  }

  footer p {
    float: left;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 55px;
  }

  footer button {
    float: right;
    display: block;
    width: 115px;
    height: 40px;
    border-radius: 4px;
    background: #E2C78F;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    text-align: center;
    margin-right: 24px;
    margin-top: 8px;
  }
  .contentListTop {
    margin-left: 0px;
  }

  .contentListBottom {
    margin-left: 0px;
  }

  .firstLine span:nth-child(1) {
    margin-left: 30px;
  }

  .twoLine .round {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-right: 15px;
  }

  .twoLine .round.active {
    border: 1px solid #E2C78F;
  }

  .twoLine .round b {
    display: flex;
    width: 14px;
    height: 14px;
    border-radius: 8px;
    background-color: #ccc;
  }

  .twoLine .round b.active {
    background-color: #E2C78F;
  }
 .fangQi {
  background: #CFCFCF;
}

.xinJian {
  background: #BFDBC3;
}

.qiaTan {
  background: #ECDBBD;
}
.qianYue{
  background: #F4B5A7;
}
.qianYued{
  background: #F3CF9D;
}
.guoQi{
  background: #CDDFEE;
}
.groupMask {
    width: 100%;
    max-height: 60vh;
    overflow-y: auto;
    padding-bottom: 80px;
  }
  .groupMask li{
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F5F5F5;
    padding-left: 15px;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid #E6E6E6;
  }
</style>
