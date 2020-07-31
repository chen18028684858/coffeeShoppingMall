<template>
  <div class="menu">
    <!-- banner轮播图 -->
    <van-swipe :autoplay="3000" indicator-color="#ffffff">
      <van-swipe-item v-for="(item,index) in banner" :key="index">
        <img class="auto_img" :src="item.bannerImg" alt="">
      </van-swipe-item>
      
    </van-swipe>

    <!-- 菜单内容 -->
    <div class="main_content">

      <!-- 侧边栏导航标签 -->
      <div class="aside_menu fl">
        <div class="item" :ref="'item'+index" @click="changeAsideMenu(item,index)" :class="{active : item.isActive}" v-for="(item,index) in typeData" :key="index">{{item.typeDesc}}</div>
        
        <div class="line" :style="{top: top + 'px'}"></div>
      </div>

      <!-- 内容 -->
      <div class="content clearfix fl">
        <div class="list fl" @click="goDetail(item.pid)" v-for="(item,index) in productData" :key="index">
          <div class="clearfix">
            <div class="fl img_cont">
              <img class="auto_img" :src="item.smallImg" alt="">
            </div>
            <div class="fl">
              <div class="pro_name one_text">{{item.name}}</div>
              <div class="pro_enname one_text">{{item.enname}}</div>
              <div class="pro_price">￥{{item.price}}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {createNamespacedHelpers} from 'vuex'

const {mapState,mapMutations} = createNamespacedHelpers('menuModule')

  export default {
    data(){
      return{
        banner:[],
        typeData:[],
        top:14,
        // height:0,
        productData:[],
        isActiveType:''
      }
    },

    created(){
      //获取banner数据
      this.getBanner();

      //获取商品类型数据
      this.getDataType()

      //根据类型获取商品数据
      if(this.isActiveType==""){
        this.getProductByType({type:'isHot'});
      }else{
        this.getProductByType({type:this.isActiveType});
      }

      this.moveLine();

    },

    computed:{
      ...mapState(['bannerDataCache','typeDataCache','products','height'])
    },

    methods:{

      ...mapMutations(['changeData','changeProducts']),
      
      //初始化时移动线条
      moveLine(){
        // 
        for(let i=0; i<this.typeData.length; i++){
          if(this.typeData[i].isActive){
            this.top = i * this.height + 14 
            return;
          }
        }
      },

      //获取banner数据
      getBanner(){

        //获取vuex的banner缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
        if( this.bannerDataCache.length > 0 ){
          this.banner = this.bannerDataCache;
          // 
          return;
        }

        //开启加载提示
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration:0
        });


        this.axios({
          method: 'GET',
          url:'/banner',
          params:{
            appkey:this.appkey,
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code==300){
            this.banner = result.data.result;
            // 
            // this.$store.commit('menuModule/changeData',{
            //   key:'bannerDataCache',
            //   value:result.data.result
            // })
            this.changeData({key:'bannerDataCache',value:result.data.result})
          }

        }).catch(err =>{
          this.$toast.clear();
          
        })
      },

      //获取侧边栏导航商品类型
      getDataType(){

        //获取vuex的侧边栏菜单缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
        if(this.typeDataCache.length > 0){
          this.typeData = this.typeDataCache;
          for(let i=0; i<this.typeData.length; i++){
            if(this.typeData[i].isActive){
              this.isActiveType = this.typeData[i].type;
              break;
            }
          }
          // 
          return
        }

        //开启加载提示
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration:0
        });


        this.axios({
          method:'GET',
          url:'/type',
          params:{
            appkey:this.appkey
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 400){
            result.data.result.forEach(v => {
              v.isActive = false;
            })
            result.data.result.unshift({type:'isHot',typeDesc:'最新推荐',isActive:true});
            this.typeData = result.data.result;

            this.$nextTick(() => {
              //获取侧边栏菜单标签高度
              let firstItemHeight = this.$refs.item0[0].clientHeight;
              // this.height = firstItemHeight;
              this.changeData({
                key:'height',
                value:firstItemHeight
              })
            })
            
            //缓存侧边栏菜单数据在vuex
            this.changeData({
              key:'typeDataCache',
              value:result.data.result
            })
            // 

            //根据类型获取商品数据
            // this.getProductByType({type: 'isHot'});
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //切换侧边栏标签
      changeAsideMenu(item,index){
        if(item.isActive){
          return
        }

        for(let i=0; i<this.typeData.length; i++){
          if(this.typeData[i].isActive){
            this.typeData[i].isActive=false;
            break;
          }
        }

        item.isActive=true;

        //移动线条
        this.top = 14 + this.height * index;

        //根据类型获取商品数据
        this.getProductByType(item);
      },

      //切换侧边栏标签对应的内容
      getProductByType(item){

        //在缓存获取商品数据
        if(this.products[item.type]){
          this.productData = this.products[item.type];
          // 
          return;
        }

        this.productData = []

        let params = {
          appkey :this.appkey,
          key: 'type',
          value:item.type
        };

        //最新推荐
        if(item.type=='isHot'){
          params.key = 'isHot',
          params.value = 1
        };

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method: 'GET',
          url:'/typeProducts',
          params
        }).then(result => {
          this.$toast.clear();
          // 
          if(result.data.code == 500){
            this.productData = result.data.result;
            this.pid = result.data.result[0].pid;
            // 
            // 
            //缓存商品数据
            this.changeProducts({
              type:item.type,
              value:result.data.result
            })
            // 
          }
        }).catch(err => {
          
        })
      },

      goDetail(pid){
        this.$router.push({name:'Detail',query:{pid}})
      }
    }
  }
</script>

<style lang="less" scoped>
  //menu整体样式
  .menu{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 50px;
    background-color: #fff;
  }

  //menu内容样式
  .main_content{
    height: calc(~"100% - 163.03px");
  }

  //左侧导航栏
  .aside_menu{
    width: 100px;
    height: 100%;
    background-color: #f7f7f7;
    position: relative;
    overflow-y: auto;
    .item{
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 14px;
      &.active{
        color: #000;
        font-weight: 700;
        background-color: white;
      }
    }
    .line{
      position: absolute;
      width: 4px;
      height: 14px;
      background-color: #fa780a;
      left: 0;
      top: 0;
      transition: top .2s ease;
    }
  }

  //内容
  .content{
    width: calc(~"100% - 120px");
    height: calc(~"100% - 20px");
    // background-color: skyblue;
    padding: 10px;
    overflow-y: auto;
    .list{
      width: calc(~"100% - 10px");
      // height: 100px;
      // background-color: pink;
      padding: 10px;
      margin-bottom: 10px;
      .img_cont{
        width: 80px;
        height: 80px;
        margin-right: 10px;
      }
      .pro_name{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
      .pro_enname{
        height: 30px;
        font-size: 12px;
        color: #ccc;
      }
      .pro_price{
        height: 20px;
        font-size: 14px;
        color: #70432e;
      }
      
    }
  }
</style>