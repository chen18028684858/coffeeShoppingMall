export const routes = [
  {
    path:'/register',
    name:'Register',
    component: r => require (['../views/Register.vue'],r)
  },
  {
    path:'/login',
    name:'Login',
    component: r => require (['../views/Login.vue'],r)
  },
  {
    path:'/main',
    name:'Main',
    component: r => require (['../views/Main.vue'],r),
    children:[
      {
        path:'index',
        name:'Index',
        component: r => require (['../views/indexViews/Index.vue'],r),
      },
      {
        path:'order',
        name:'Order',
        component: r => require (['../views/indexViews/Order.vue'],r),
      },
      {
        path:'shopcart',
        name:'Shopcart',
        component: r => require (['../views/indexViews/Shopcart.vue'],r),
      },
      {
        path:'my',
        name:'My',
        component: r => require (['../views/indexViews/My.vue'],r),
      },
    ]
  },
  {
    path:'/detail',
    name:'Detail',
    component: r => require (['../views/Detail.vue'],r)
  },
  {
    path:'/address/:aid?',
    name:'Address',
    component: r => require (['../views/Address.vue'],r)
  },
  {
    path:'/myAddress',
    name:'MyAddress',
    component: r => require (['../views/MyAddress.vue'],r)
  },
  {
    path:'/pay',
    name:'Pay',
    component: r => require (['../views/Pay.vue'],r)
  },
  {
    path:'/manage',
    name:'Manage',
    component: r => require (['../views/Manage.vue'],r)
  },
  {
    path:'/collect',
    name:'Collect',
    component: r => require (['../views/Collect.vue'],r)
  },
  {
    path:'/security',
    name:'Security',
    component: r => require (['../views/Security.vue'],r)
  },
  {
    path:'/forgetpwd',
    name:'ForgetPwd',
    component: r => require (['../views/ForgetPwd.vue'],r)
  },


  {
    path:'*',
    redirect:{
      name:'Index'
    }
  }
]