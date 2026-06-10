export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/qa/index',
    'pages/cases/index',
    'pages/network/index',
    'pages/mine/index',
    'pages/register/index',
    'pages/profile/index',
    'pages/activities/index',
    'pages/works/index',
    'pages/messages/index',
    'pages/drafts/index',
    'pages/reports/index',
    'pages/blacklist/index',
    'pages/credit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '同行者',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FAF9F7'
  },
  tabBar: {
    color: '#8F8A82',
    selectedColor: '#6B5B95',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/qa/index',
        text: '问答'
      },
      {
        pagePath: 'pages/cases/index',
        text: '案例库'
      },
      {
        pagePath: 'pages/network/index',
        text: '人脉'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
