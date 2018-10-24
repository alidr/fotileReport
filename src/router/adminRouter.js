// const Demo = () => import ('@/pages/admin_demo')
const AdminIndex = () => import ('@/pages/admin_index')
const AddCompany = () => import ('@/pages/addCompany')
const CompleteInformation = () => import ('@/pages/completeInformation')
const Announce = () => import ('@/pages/Announce')
const AdminPost = () => import ('@/pages/admin_post')
const CompanyClassList = () =>  import ('@/pages/admin_CompanyClassList')
// const HomeDecoration = () => import ('@/pages/admin_HomeDecoration')
const SalesmanList = () => import ('@/pages/SalesmanList')
const CompanyFollow = () => import ('@/pages/admin_CompanyFollow')
const UserList = () => import ('@/pages/admin_UserList')
const AddUser = () =>import ('@/pages/admin_addUser')
const CompanyContract = () =>import ('@/pages/busniess_companyContract')
const GiveUpCompany = () =>import ('@/pages/busniess_giveUpCompany')
const EditUser = () =>import ('@/pages/admin_editUser')
const EditCompany = () =>import ('@/pages/editCompany')
const AnnounceStyle = () =>import ('@/pages/admin_announceStyle')
const EditCompete = () => import('@/pages/busniess_editCompete')
const ApplyAuthorized = () =>
  import ('@/pages/business_applyAuthorized')
export default [{
  path: '/adminIndex',
  name: 'AdminIndex',
  component: AdminIndex,
  meta: {
      title: '管理员首页'
  }
}, {
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
  path: '/applyAuthorized',
  component: ApplyAuthorized,
  meta: {
    title: '查看授权'
  },
},
 {
  path: '/Announce',
  component: Announce,
  meta: {
      title: '发布公告'
  }
}, {
  path: '/AdminPost',
  component: AdminPost,
  meta: {
    title: '岗位管理'
  },
}, {
  path: '/CompanyClassList',
  component: CompanyClassList,
  meta: {
    title: '公司分类管理'
  },
},{
  path: '/editCompany',
  component: EditCompany,
  meta: {
    title: '编辑公司'
  },
},
{
  path: '/SalesmanList',
  component: SalesmanList,
  meta: {
    title: '业务员列表'
  },
}, {
  path: '/CompanyFollow',
  component: CompanyFollow,
  meta: {
    title: '公司待跟进'
  },
}, {
  path: '/UserList',
  component: UserList,
  meta: {
    title: '用户列表'
  },
}, {
  path: '/addUser',
  component: AddUser,
  meta: {
    title: '新增用户'
  },
},{
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
}, {
  path: '/editUser',
  component: EditUser,
  meta: {
    title: '编辑用户'
  },
},
{
  path: '/announceStyle',
  component: AnnounceStyle,
  meta: {
    title: '公告管理'
  },
},
, {
  path: '/editCompete',
  component: EditCompete,
  meta: {
    title: '编辑竞品信息'
  },
},
]
