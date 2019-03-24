let routes = [
  {
    path: "/recommend",
    component: () => import("../components/recommend/recommend.vue"),
    children:[
      {
        path:':id',
        component : () =>import("../components/disc/disc.vue")
      }
    ]
  },
  {
    path: "/rank",
    component: () => import("../components/rank/rank.vue"),
    children:[
      {
        path:':id',
        component:() => import("../components/top-list/top-list.vue")
      }
    ]
  },
  {
    path: "/search",
    component: () => import("../components/search/search.vue"),
    children: [
      //二级路由
      {
        path: ":id",
        component: () => import("../components/singer-detail/singer-datail.vue")
      }
    ]
  },
  {
    path: "/singer",
    component: () => import("../components/singer/singer.vue"),
    children: [
      //二级路由
      {
        path: ":id",
        component: () => import("../components/singer-detail/singer-datail.vue")
      }
    ]
  },
  {
    path: "/",
    redirect: "/recommend"
  }
];
export default routes;
