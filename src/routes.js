import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    meta: {
      title: 'Home'
    },
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    meta: {
      title: 'Get All Enquiries'
    },
    path: '/all-enquiries',
    name: 'All Enquiries',
    component: () => import('@/views/AllEnquiries.vue')
  },
  {
    meta: {
      title: 'Unpaid Dropouts'
    },
    path: '/unpaid-dropouts',
    name: 'Unpaid Dropouts',
    component: () => import('@/views/UnpaidDropouts.vue')
  },
  {
    meta: {
      title: 'Add enquiry'
    },
    path: '/add-enquiry',
    name: 'Add enquiry',
    component: () => import('@/views/AddEnquiry.vue')
  },
  {
    meta: {
      title: 'No enquiry form'
    },
    path: '/no-enquiry-form',
    name: 'No enquiry form',
    component: () => import('@/views/NoEnquiryForm.vue')
  },
  {
    meta: {
      title: 'Update status'
    },
    path: '/update-status',
    name: 'Update status',
    component: () => import('@/views/UpdateStatus.vue')
  },
  {
    meta: {
      title: 'Data not taken'
    },
    path: '/data-not-taken',
    name: 'Data not taken',
    component: () => import('@/views/DataNotTaken.vue')
  },
  {
    meta: {
      title: 'No calls enquiry'
    },
    path: '/no-calls',
    name: 'No calls enquiry',
    component: () => import('@/views/NoCallEnquiry.vue')
  },
  {
    meta: {
      title: 'Stars'
    },
    path: '/stars',
    name: 'Stars',
    component: () => import('@/views/Stars.vue')
  },
  {
    meta: {
      title: 'Referrals'
    },
    path: '/referrals',
    name: 'Referrals',
    component: () => import('@/views/Referrals.vue')
  },
  {
    meta: {
      title: 'Referrals inside'
    },
    path: '/referrals-inside',
    name: 'Referrals inside',
    component: () => import('@/views/ReferralsInside.vue')
  },
  {
    meta: {
      title: 'Escalated to me'
    },
    path: '/escalated-to-me',
    name: 'Escalated to me',
    component: () => import('@/views/EscalatedToMe.vue')
  },
  {
    meta: {
      title: 'Escalated by me'
    },
    path: '/escalated-by-me',
    name: 'Escalated by me',
    component: () => import('@/views/EscalatedByMe.vue')
  },
  {
    meta: {
      title: 'Next batch'
    },
    path: '/next-batch',
    name: 'Next batch',
    component: () => import('@/views/NextBatch.vue')
  },
  {
    meta: {
      title: 'Need online'
    },
    path: '/need-online',
    name: 'Need online',
    component: () => import('@/views/NeedOnline.vue')
  },
  {
    meta: {
      title: 'Missed calls'
    },
    path: '/missed-calls',
    name: 'Missed calls',
    component: () => import('@/views/MissedCalls.vue')
  },
  // {
  //   meta: {
  //     title: 'Me to Other branch'
  //   },
  //   path: '/ob-by-me',
  //   name: 'Me to Other branch',
  //   component: () => import('@/views/ObByMe.vue')
  // },
  {
    meta: {
      title: 'Other branch to me'
    },
    path: '/ob-to-me',
    name: 'Other branch to me',
    component: () => import('@/views/ObToMe.vue')
  },
  {
    meta: {
      title: 'Reminders'
    },
    path: '/reminders',
    name: 'Reminders',
    component: () => import('@/views/Reminders.vue')
  },
  {
    meta: {
      title: 'Internals'
    },
    path: '/internals',
    name: 'Internals',
    component: () => import('@/views/Internals.vue')
  },
  {
    meta: {
      title: 'Call back'
    },
    path: '/call-back',
    name: 'Call back',
    component: () => import('@/views/CallBack.vue')
  },
  {
    meta: {
      title: 'Joined somewhere'
    },
    path: '/joined-somewhere',
    name: 'Joined somewhere',
    component: () => import('@/views/JoinedSomewhere.vue')
  },
  {
    meta: {
      title: 'Already joined'
    },
    path: '/already-joined',
    name: 'Already joined',
    component: () => import('@/views/AlreadyJoined.vue')
  },
  {
    meta: {
      title: 'Coming'
    },
    path: '/coming',
    name: 'Coming',
    component: () => import('@/views/Coming.vue')
  },
  {
    meta: {
      title: 'Got Job'
    },
    path: '/got-job',
    name: 'Got Job',
    component: () => import('@/views/GotJob.vue')
  },
  {
    meta: {
      title: 'Follow Up'
    },
    path: '/follow-up',
    name: 'Follow Up',
    component: () => import('@/views/Follow_Up.vue')
  },
  {
    meta: {
      title: 'Branch calls'
    },
    path: '/branch-calls',
    name: 'Branch calls',
    component: () => import('@/views/BranchRecords.vue')
  },
  {
    meta: {
      title: 'Follow Up Enquiries'
    },
    path: '/follow-up-enquiries',
    name: 'Follow Up Enquiries',
    component: () => import('@/views/FollowUpEnq.vue')
  },
  {
    meta: {
      title: 'Online Courses'
    },
    path: '/online-courses',
    name: 'Online Courses',
    component: () => import('@/views/OnlineEnq.vue')
  },
  // {
  //   meta: {
  //     title: 'Peculiar Courses'
  //   },
  //   path: '/peculiar-courses',
  //   name: 'Peculiar Courses',
  //   component: () => import('@/views/PeculiarEnq.vue')
  // },
  {
    meta: {
      title: 'Rigid Enquiries'
    },
    path: '/rigid-enq',
    name: 'Rigid Enquiries',
    component: () => import('@/views/RigidEnq.vue')
  },
  {
    meta: {
      title: 'Weekend Enquiries'
    },
    path: '/weekend-enq',
    name: 'Weekend Enquiries',
    component: () => import('@/views/WeekendEnq.vue')
  },
  {
    meta: {
      title: 'Enq Followup'
    },
    path: '/enq-follow',
    name: 'Enq Followup',
    component: () => import('@/views/EnqFollowup.vue')
  },
  {
    meta: {
      title: 'Enq Dropout'
    },
    path: '/enq-drop',
    name: 'Enq Dropout',
    component: () => import('@/views/EnqDropout.vue')
  },
  {
    path: '/classroom/:id',
    meta: { title: 'Classroom' },
    component: () => import('@/views/Stream.vue'),
  },
  {
    meta: {
      title: 'Online Batches'
    },
    path: '/online-batches',
    name: 'Online Batches',
    component: () => import('@/views/OnlineBatches.vue')
  },
  {
    meta: {
      title: 'Forgot Password'
    },
    path: '/forgot_password',
    name: 'Forgot Password',
    component: () => import('@/components/ForgotPassword.vue')
  },
  {
    meta: {
      title: 'Login',
      formScreen: true
    },
    path: '/login',
    name: 'login',
    component: Login
  },
  { path: '/:path(.*)', component: NotFound },
  
]
