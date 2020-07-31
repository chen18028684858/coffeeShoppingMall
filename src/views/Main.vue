<template>
  <div class="main">
    
    <div>
      <router-view></router-view>
    </div>
    
    <!-- Tabbar标签栏 -->
    <van-tabbar v-model="active" @change="toggleTabBar">
      <van-tabbar-item v-for="(item,index) in tabBarData" :key="index" :icon="item.icon">{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        active:0,
        tabBarData:[
          {
            icon:'shop-o',
            title:'菜单',
            routeName:'Index',
            url:'index'
          },
          {
            icon:'orders-o',
            title:'订单',
            routeName:'Order',
            url:'order'
          },
          {
            icon:'shopping-cart-o',
            title:'购物车',
            routeName:'Shopcart',
            url:'shopcart'
          },
          {
            icon:'contact',
            title:'我的',
            routeName:'My',
            url:'my'
          },
        ]
      };
    },
    methods: {
      toggleTabBar(index){
        this.$router.push({name:this.tabBarData[index].routeName})
      }
    },
    created(){
      let url = location.hash;
      for (let i = 0; i < this.tabBarData.length; i++) {
        if(this.tabBarData[i].url == url.split('/')[2]){
          this.active = i;
        }
      };
    },
  }
</script>

<style lang="less" scoped>
.van-tabbar-item--active{
  color: #fa780a;
}
</style>