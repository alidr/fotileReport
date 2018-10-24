<template>
    <!-- 公司分类管理 -->
    <div class="CompanyClassList">
      <button class="addClass" type="button">添加分类</button>
      <div class="classList">
        <ul>
          <li>
            <p>传统公司</p>
            <div class="picture">
                <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
              </div>
          </li>
          <li>
            <p>整装公司</p>
            <div class="picture">
                <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
              </div>
          </li>

          <li>
            <p>局部改造</p>
            <div class="picture">
                <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
              </div>
          </li>
          <li>
            <p>橱柜（全国定制）</p>
            <div class="picture">
                <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
              </div>
          </li>
          <li>
            <p>泛家装</p>
            <div class="picture">
                <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
              </div>
          </li>
          <li>
              <p>地产家装</p>
              <div class="picture">
                  <img src="del_03.png" alt="">
                  <img src="edit_03.png" alt="">
                </div>
            </li>
            <li>
                <p>设计公司</p>
                <div class="picture">
                    <img src="del_03.png" alt="">
                    <img src="edit_03.png" alt="">
                  </div>
              </li>
              <li>
                  <p>家装平台</p>
                  <div class="picture">
                      <img src="del_03.png" alt="">
                <img src="edit_03.png" alt="">
                  </div>
                </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
    export default {
      name: 'CompanyClassList'
    }
  
  </script>
  
  <style scoped>
.CompanyClassList{
  width: 100%;
  overflow: hidden;
  padding-top: 18px;
}
.addClass{
  display: block;
  width:80%;
height:40px;
border-radius:20px;
box-shadow:0px 8px 15px rgba(223,174,72,0.2);
margin: 0 auto;
background: linear-gradient(left,#E2C78F,#D5AE61);
font-size:14px;
font-family:PingFangSC-Regular;
color:rgba(255,255,255,1);
line-height: 40px;
text-align: center;
margin-bottom: 20px
}
.classList{
  width: 90%;
  overflow: hidden;
  margin: 0 auto;
} 
.classList ul{
  width: 100%;
  overflow: hidden;
}
.classList ul li{
  width: 100%;
  height:54px;
background:rgba(255,255,255,1);
border-radius:8px;
margin-bottom: 12px;
}
.classList ul li p{
  float: left;
  font-size:16px;
font-family:PingFangSC-Regular;
color:rgba(102,102,102,1);
line-height: 54px;
padding-left: 12px;
}
.classList ul li .picture{
  float: right;
  overflow: hidden;
  margin-right: 18px;
  padding-top: 12px;
}
.classList ul li .picture img{
  float: left;
 display: block;
 width: 30px;
 height: 30px;
 margin-left: 12px;

}

  </style>
  