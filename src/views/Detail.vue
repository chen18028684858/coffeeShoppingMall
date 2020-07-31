<template>
  <div class="detail">

    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="goPage()"
    />

    <!-- 顶部图片展示 -->
    <div class="detail_top">
      <img class="auto_img" :src="productData.large_img">
    </div>

    <!-- 商品信息展示 -->
    <div class="detail_content">
      <div class="product_name clearfix">
        <div class="fl">{{productData.name}}</div>
        <div class="fr product_icon" @click="likeAndNotLike"><img class="auto_img" :src="require('../assets/images/'+(isLike ? 'like_active.png' : 'like.png'))" ></div>
      </div>


      <div class="product_type">
        <div class="type_row clearfix" v-for="(item,index) in productData.rules" :key="index">
          <div class="type_name fl">{{item.title}}</div>
          <div class=" clearfix fl">
            <div class="fl type_list" :class="{active : v.isActive}" @click="toggleRuleTag(item,v)" v-for="(v,i) in item.tag" :key="i">{{v.name}}</div>
          </div>
        </div>
        
      </div>

      <div class="describe">
        <div class="des_title mb">商品描述</div>
        <div class="des_cont mb" v-for="(item, index) in productData.desc" :key="index">{{item}}</div>
        
      </div>

      <div class="pro_price">
        <div class="clearfix">
          <div class="fl price">￥{{productData.price}}</div>
          <div class="fr">
            <van-stepper v-model="count" theme="round" button-size="22" disable-input />
          </div>
        </div>
      </div>
    </div>


    <van-goods-action>
      <van-goods-action-icon @click="goShopcart" icon="cart-o" text="购物车"  :badge="shopcartRows" />
      <van-goods-action-button @click="addShopCart" color="linear-gradient(to right,#fece79,#fdba47)" type="warning" text="加入购物车" />
      <van-goods-action-button @click="addShopCart(true)" color="#fa780a" type="danger" text="立即购买" />
    </van-goods-action> 
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //商品数量
        count: 1,
        //商品id
        pid:'',
        //商品详情数据
        productData:{},
        //判断收藏
        isLike:false,
        //购物车条数
        shopcartRows:0
      };
    },

    created(){
      //获取商品id
      this.pid=this.$route.query.pid;
      //获取商品详情信息
      this.getProductDetail(this.pid);
      //查询是否收藏
      this.findLike(this.pid);
      //查询购物车商品条数
      this.findShopcart()
    },

    methods:{
      //跳转页面
      goPage(){
        this.$router.go(-1)
      },

      // 获取商品详情
      getProductDetail(pid){

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method: 'GET',
          url:'/productDetail',
          params:{
            pid,
            appkey:this.appkey
          }
        }).then(result => {
          this.$toast.clear();
          // 
          if(result.data.code == 600){
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);

            // 商品规格
            let productRule = ['tem','sugar','milk','cream'];
            let rules = [];
            // [{title: '温度', tag: [{name: '冷'}, {name: '热'}]}, {title: '糖', tag: [{name: '全糖'}, {name: '半糖'}]}]
            productRule.forEach(v => {
              if(data[v]!=''){
                let rule = {
                  title:data[v + '_desc'],
                  tag:[]
                };
                let tag = data[v].split(/\//);
                tag.forEach((item,i) => {
                  let t = {
                    name:item,
                    isActive: i==0
                  };
                  rule.tag.push(t);
                })
                rules.push(rule);
              }
            })
            // 
            data.rules = rules;
            this.productData = data
            // 
          }
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //切换商品规格
      toggleRuleTag(item,v){
        // 
        // 
        if(v.isActive){
          return
        }

        for(let i=0; i<item.tag.length; i++){
          if(item.tag[i].isActive){
            item.tag[i].isActive = false;
            break;
          }
        }
        v.isActive=true;
      },

      //收藏or取消 收藏商品
      likeAndNotLike(){
        //获取token
        let tokenString = localStorage.getItem('__tnek');

        //请求路径，收藏：like，取消收藏：notlike
        let url = this.isLike ? '/notlike' : '/like'

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'POST',
          url,
          data:{
            appkey:this.appkey,
            pid:this.pid,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          // 
          if(result.data.code == 800 || result.data.code == 900){
            //收藏成功
            this.isLike = result.data.code == 800;
            this.$toast(result.data.msg);
          }else{
            this.$router.push({name:'Login'});
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //查询当前商品是否被收藏
      findLike(pid){
        //获取token
        let tokenString = localStorage.getItem('__tnek');

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'findlike',
          params:{
            appkey:this.appkey,
            pid,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code==1000){
            this.isLike = result.data.result.length > 0;
          }
          // 
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //查询购物车
      findShopcart(){
        //获取token
        let tokenString = localStorage.getItem('__tnek');

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method: 'GET',
          url:'/findAllShopcart',
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          // 
          if(result.data.code == 5000){
            this.shopcartRows = result.data.result.length;
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //加入购物车
      addShopCart(buy){
        //获取token
        let tokenString = localStorage.getItem('__tnek')

        //获取商品规格
        let rules = this.productData.rules;

        let rule = [];
        rules.forEach(v => {
          for(let i=0; i<v.tag.length; i++){
            if(v.tag[i].isActive){
              rule.push(v.tag[i].name);
              break;
            }
          }
        })

        this.$toast.loading({
          message:'加载中...',
          forbidClick:true,
          duration:0
        })

        this.axios({
          method: 'POST',
          url:'/addShopcart',
          data:{
            appkey:this.appkey,
            tokenString,
            //商品ID
            pid:this.pid,
            //商品数量
            count:this.count,
            rule:rule.join('/')
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 3000){
            if(result.data.status == 1){
              this.shopcartRows++;
            }

            this.$toast(result.data.msg);

            //如果是立即购买, 先将商品加入到购物车，在跳转到结算页面(提交订单页面)
            if(buy === true){
              setTimeout(() => {
                this.$router.push({name:'Pay',query:{sids:result.data.sid}});
              },300)
            }
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //跳转购物车页面
      goShopcart(){
        this.$router.push({name:'Shopcart'})
      }

      
    }
  }
</script>

<style lang="less" scoped>
.detail{
  background-color: #eee;
  padding-bottom: 70px;
  padding-top: 46px;
}
/deep/ .van-nav-bar__text{
  color: #70432e;
}
/deep/ .van-icon{
  color: #70432e;
}
/deep/ .van-nav-bar__title{
  color: #70432e;
}
.detail_content{
  padding: 10px;
  font-size: 14px;
  background-color: white;
  .product_name{
    line-height: 28px;
    margin-top: 10px;
  }
  .product_icon{
    width: 26px;
    height: 26px;
  }
  .product_type{
    margin-top: 10px;
    font-size: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .type_row{
      margin-bottom: 10px;
      .type_name{
        width: 60px;
        line-height: 28px;
      }
      .type_list{
        width: 60px;
        height: 26px;
        text-align: center;
        line-height: 28px;
        background-color: #eee;
        border-radius: 13px;
        margin-right: 10px;
        &:last-child{
          margin-right: 0;
        }
        &.active{
          background-color: #fa780a;
          color: white;
        }
      }
    }
  }
  .describe{
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .mb{
      margin-bottom: 10px;
    }
    .des_cont{
      font-size: 12px;
      color: #888;
    }
  }
  .pro_price{
    margin-top: 20px;
    .price{
      color: #fa780a;
    }
    /deep/ .van-stepper__minus{
      color: #fa780a;
      border-color: #fa780a;
    }
    /deep/ .van-stepper__plus{
      background-color: #fa780a;
    }
  }
}
</style>