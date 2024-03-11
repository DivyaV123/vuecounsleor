import {
  mdiAccountGroup,
  mdiAccountOff,
  mdiAccountQuestion,
  mdiAccountAlert,
  mdiStarCheck,
  mdiAccountArrowLeft,
  mdiAccountArrowRight,
  mdiAccountSwitch,
  mdiPhoneClassicOff,
  mdiPageNext,
  mdiCastEducation,
  mdiPhoneMissed,
  mdiArrangeBringForward,
  mdiArrangeSendBackward,
  mdiPhoneClock,
  mdiAccountRemove,
  mdiAccountCheck,
  mdiAccountConvert,
  mdiAccountTie
} from '@mdi/js'

export default [
  'General List',
  [
    {
      to: '/',
      icon: mdiAccountGroup,
      label: 'Enquiries',
      short: 'Enq'
    }
  ],
  'Other Lists',
  [
    {
      to: '/missed-calls',
      label: 'Missed calls',
      icon: mdiPhoneMissed,
      short: 'Msc'
    },
    {
      to: '/no-enquiry-form',
      label: 'No Enquiry Form',
      icon: mdiAccountOff,
      short: 'Nef'
    },
    {
      to: '/update-status',
      label: 'No Status List',
      icon: mdiAccountQuestion,
      short: 'Nos'
    },
    {
      to: '/no-calls',
      label: 'Zero Call Back',
      icon: mdiPhoneClassicOff,
      short: 'Zcb'
    },
    {
      to: '/data-not-taken',
      label: 'Data not taken',
      icon: mdiAccountAlert,
      short: 'Dnt'

    },
    {
      to: '/stars',
      label: 'Star List',
      icon: mdiStarCheck,
      short: 'Sts'
    },
    // {
    //   to: '/escalated-to-me',
    //   label: 'Escalated to me',
    //   icon: mdiAccountArrowLeft,
    //   short: 'Etm'
    // },
    // {
    //   to: '/escalated-by-me',
    //   label: 'Escalated by me',
    //   icon: mdiAccountArrowRight,
    //   short: 'Ebm'
    // },
    {
      to: '/referrals',
      label: 'Referral List',
      icon: mdiAccountSwitch,
      short: 'Ref'
    },
    // {
    //   to: '/next-batch',
    //   label: 'Next batch',
    //   icon: mdiPageNext,
    //   short: 'Nba'
    // },
    {
      to: '/need-online',
      label: 'Need Online',
      icon: mdiCastEducation,
      short: 'Nol'
    },
    // {
    //   to: '/ob-by-me',
    //   label: 'Me to Other branch',
    //   icon: mdiArrangeBringForward,
    //   short: 'Mob'
    // },
    {
      to: '/ob-to-me',
      label: 'Other branch to me',
      icon: mdiArrangeSendBackward,
      short: 'Obt'
    },
    {
      to: '/call-back',
      label: 'Call Back',
      icon: mdiPhoneClock,
      short: 'Cab'
    },
    {
      to: '/joined-somewhere',
      label: 'Joined Somewhere',
      icon: mdiAccountRemove,
      short: 'Jsw'
    },
    {
      to: '/already-joined',
      label: 'Already Joined',
      icon: mdiAccountCheck,
      short: 'Alj'
    },
    {
      to: '/coming',
      label: 'Coming',
      icon: mdiAccountConvert,
      short: 'Cmg'
    },
    {
      to: '/got-job',
      label: 'Got job',
      icon: mdiAccountTie,
      short: 'Gtj'
    },

  ],


]
