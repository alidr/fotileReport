const Appeal = () =>import ('@/pages/dealer_Appeal')
const ApprovalCompany = () =>import ('@/pages/manager_approvalCompany')
// const CompanyContract = () =>import ('@/pages/manager_companyContract')
const GiveUpCompany = () =>
  import ('@/pages/busniess_giveUpCompany')
const UserList = () =>import ('@/pages/admin_UserList')
const AppealManger = () =>import ('@/pages/manager_AppealManger')
const AddUser = () =>import ('@/pages/admin_addUser')
const EditUser = () =>
  import ('@/pages/admin_editUser')
const WaitGroup = () =>import ('@/pages/dealer_waitGroup')
const GroupMember = () =>import ('@/pages/manager_GroupMember')

const UploadContract = () =>
  import ('@/pages/business_uploadContract')
const ApplyAuthorized = () =>
  import ('@/pages/business_applyAuthorized')

export default [
{
  path: '/approvalCompany',
  component: ApprovalCompany,
  meta: {
      title: '新建公司待审批'
  },
},
// {
//   path: '/companyContract',
//   component: CompanyContract,
//   meta: {
//       title: '新建公司已签约'
//   },
// },
{
  path: '/giveUpCompany',
  component: GiveUpCompany,
  meta: {
      title: '放弃跟进'
  },
}, {
  path: '/appealManger',
  component: AppealManger,
  meta: {
    title: '跟进审批'
  },
}, {
  path: '/UserList',
  component: UserList,
  meta: {
    title: '用户列表'
  },
}, {
  path: '/appeal',
  component: Appeal,
  meta: {
    title: '申诉审批'
  },
},
{
  path: '/appeal',
  component: Appeal,
  meta: {
    title: '申诉审批'
  },
},
{
  path: '/addUser',
  component: AddUser,
  meta: {
    title: '添加用户'
  },
},
{
  path: '/waitGroup',
  component: WaitGroup,
  meta: {
    title: '待审批小组'
  },
},
{
  path: '/groupMember',
  component: GroupMember,
  meta: {
    title: '小组详情'
  },
},

  {
    path: '/editUser',
    component: EditUser,
    meta: {
      title: '编辑用户'
    },
  },

   {
     path: '/uploadContract',
     component: UploadContract,
     meta: {
       title: '上传'
     },
   },

   {
     path: '/applyAuthorized',
     component: ApplyAuthorized,
     meta: {
       title: '申请授权'
     },
   },
]

