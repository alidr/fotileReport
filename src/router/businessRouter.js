// const Demo = () => import ('@/pages/business_demo')
const AddCompany = () => import ('@/pages/addCompany')
const CompleteInformation = () => import ('@/pages/completeInformation')
const AppealHome = () =>import ('@/pages/business_appealHome')
const AppealStyle = () =>import ('@/pages/business_appealStyle')
const AppealFollowUp = () =>import ('@/pages/business_appealFollowUp')
const AppealMaterial = () =>import ('@/pages/business_appealMaterial')
const WaitList = () =>import ('@/pages/business_WaitList')
const EditCompany = () =>import ('@/pages/editCompany')
const ApplyAuthorized = () => import('@/pages/business_applyAuthorized')
const UploadContract = () => import('@/pages/business_uploadContract')
const Action = () => import('@/pages/business_action')
const ApprovalRecord = () => import('@/pages/busniess_ApprovalRecord')
const EditCompete = () => import('@/pages/busniess_editCompete')
const MyGroup = () => import('@/pages/business_myGroup')
const CompanyFollow = () =>import ('@/pages/admin_CompanyFollow')
const CompanyContract = () =>import ('@/pages/busniess_companyContract')
const GiveUpCompany = () =>import ('@/pages/busniess_giveUpCompany')



export default [ {
  path: '/addCompany',
  component: AddCompany,
  meta: {
      title: '新建家装公司'
  }
}, {
  path: '/completeInformation',
  component: CompleteInformation,
  meta: {
      title: '完善信息'
  }
}, {
  path: '/appealHome',
  component: AppealHome,
  meta: {
    title: '我要申诉'
  }
}, {
  path: '/appealStyle',
  component: AppealStyle,
  meta: {
    title: '申诉类型'
  }
}, {
  path: '/appealFollowUp',
  component: AppealFollowUp,
  meta: {
    title: '申诉公司状态'
  },
}, {
  path: '/appealMaterial',
  component: AppealMaterial,
  meta: {
    title: '提交申诉资料'
  },
}, {
  path: '/waitList',
  component: WaitList,
  meta: {
    title: '等待列表'
  },
  }, 
{
  path: '/editCompany',
    component: EditCompany,
    meta: {
      title: '编辑公司'
    },
},
  {
    path: '/applyAuthorized',
    component: ApplyAuthorized,
    meta: {
      title: '申请授权'
    },
  }, {
    path: '/uploadContract',
    component: UploadContract,
    meta: {
      title: '上传'
    },
  }, {
    path: '/action',
    component: Action,
    meta: {
      title: '添加跟单'
    },
  }, {
    path: '/approvalRecord',
    component: ApprovalRecord,
    meta: {
      title: '审批记录'
    },
  }, {
    path: '/editCompete',
    component: EditCompete,
    meta: {
      title: '编辑销售数据'
    },
  }, {
    path: '/myGroup',
    component: MyGroup,
    meta: {
      title: '我的小组'
    },
  },{
    path: '/CompanyFollow',
    component: CompanyFollow,
    meta: {
      title: '组员跟进列表',
      keepAlive:true
    },
  },
  {
    path: '/companyContract',
    component: CompanyContract,
    meta: {
      title: '新建公司已签约'
    },
  }, {
    path: '/giveUpCompany',
    component: GiveUpCompany,
    meta: {
      title: '放弃跟进'
    },
  },
]
