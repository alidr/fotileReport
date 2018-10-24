<template>
  <!-- 经销商跟进审批 -->
  <div class="appealFollowUp">
      <div class="btn">
          <button type="button">授权审批</button>
          <button type="button">合同审批</button>
        </div>
        <div class="appealList">
          <ul>
              <li>
                <span>授权审批</span>
                <i>提交日期 2018/05/23</i>
                  <div class="up">
                      <span class="name">家装公司名称</span>
                      <span class="salesman">业务员×××</span>
                    <div class="upBtn">
                      <button type="button" class="no">不通过</button>
                      <button type="button" class="yes">审批通过</button>
                    </div>
                  </div>
                  <div class="down">
                    <i>查看授权申请文件</i>
                    <router-link to="/">
                      <span>点击进入公司详情页>></span>
                    </router-link>
                  </div>
                </li>
          </ul>
        </div>
      
  </div>
</template>

<script>
  export default {
    name: 'appealFollowUp'
  }

</script>

<style scoped>
.btn {
    width: 58%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
  }

  .btn button {
    display: black;
    height: 29px;
    border-radius: 4px;
    padding: 0 22px;
    line-height: 29px;
    text-align: center;
    font-size: 14px;
    
    
    
  }

  .btn button:nth-child(1) {
    background: #E2C78F;
    color: rgba(255, 255, 255, 1);
    

  }

  .btn button:nth-child(2) {
    color: rgba(179, 179, 179, 1);
    border: 1px solid #959595;
    background: none;

  }
  .appealList {
    width: 94%;
    margin: 0 auto;
    overflow: hidden;
  }

  .appealList ul li {
    overflow: hidden;
    background: white;
    padding-top: 12px;
    margin-bottom: 9px;
    padding-bottom: 20px;
    border-radius:4px;
  }
  .appealList ul li>span {
    display: inline-block;
    background: rgba(246, 234, 212, 1);
    border-radius: 0px 10px 10px 0px;
    padding: 0 14px;
    margin-bottom: 6px;
    font-size: 10px;
    font-family: PingFangSC-Regular;
    color: rgba(187, 159, 97, 1);
    line-height: 20px;
    text-align: center;
    margin-right: 140px;
  }
  .appealList ul li>i {
    font-style: normal;
    font-size: 12px;
    color:rgba(76,76,76,1);
    line-height: 20px;
  }

  .appealList ul li .up {
    width: 92%;
    overflow: hidden;
    margin: 0 auto; 
    border-bottom: 1px solid rgba(177, 177, 177, 1);
    padding-bottom: 8px;
    margin-bottom: 14px;
    margin-left:20px;
    position: relative;
    
  }

  .appealList ul li .up .name {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 28px;
    border:none;
    margin-right: 0;
  }

  .appealList ul li .up .salesman {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 28px;
    margin-left: 4px;
    border:none;
    margin-right: 0;
    padding: 0;
  }


  .appealList ul li .up .upBtn {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    width: 40%;
    position: absolute;
    right: 0;
    top: 0;
  }

  .appealList ul li .up .upBtn button {
    display: inline-block;
    border-radius: 3px;
    padding: 0 10px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
  }

  .appealList ul li .up .upBtn button:nth-child(1) {
    background: rgba(228, 228, 228, 1);
    color: rgba(178, 178, 178, 1);
  }

  .appealList ul li .up .upBtn button:nth-child(2) {
    background: rgba(226, 199, 143, 1);
    color: rgba(255, 255, 255, 1);
  }

  .appealList ul li .down {
    width: 90%;
    overflow: hidden;
    margin-left: 20px;

  }

  .appealList ul li .down i {
    font-style: normal;
    font-size: 12px;
    color: rgba(242, 111, 83, 1);
    margin-right:80px;
  }

  .appealList ul li .down a {
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
  }


</style>
