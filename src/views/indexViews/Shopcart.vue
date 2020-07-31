<template>
  <van-list class="shopcart" v-model="loadOptions.isLoading" :finished="loadOptions.isFinished" :finished-text="loadOptions.finishedText" @load="loadData" :offset="50">

    <div v-if="isLogin">
    
      <div v-if="shopcartData.length == 0">
        <van-empty description="购物车空空如也" />
      </div>

      <div v-else>
        <van-nav-bar
          title="购物车列表"
          left-text="<返回"
          :fixed="true"
          :placeholder="true"
          @click-left="goBack"
          @click-right="manage"
          :right-text="isManage ? '管理' : '完成'"
        />
        <!-- 商品列表 -->
        <div class="list">
          <van-swipe-cell class="list_items" v-for="(item,index) in shopcartData" :key="index" >
            <div class="list_item clearfix">
              <!-- 单选框 -->
              <div class="fl checkbox_item">
                <van-checkbox v-model="item.isCheck" @change="simpleSelect"></van-checkbox>
              </div>

              <!-- 商品信息 -->
              <div class="fl product_info clearfix">
                <!-- 商品图片 -->
                <div class="product_img fl">
                  <img class="auto_img" :src="item.small_img">
                </div>
                <!-- 商品详情 -->
                <div class="fl product_content">
                  <!-- 商品名称 -->
                  <div class="product_name">
                    <div class="clearfix">
                      <div class="fl product_title">{{item.name}}</div>
                      <div class="fl product_type">{{item.rule}}</div>
                    </div>
                    <div class="product_enname">{{item.enname}}</div>
                  </div>
                  <!-- 商品价格 -->
                  <div class="product_price">
                    <div class="fl price">￥{{item.price}}</div>
                    <div class="fr product_count">
                      <van-stepper
                        v-model="item.count"
                        :integer="true"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="changeCount(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button class="deleButton" square type="danger" text="删除" @click="deleteShopcart([item.sid],index)" />
            </template>
          </van-swipe-cell>
        </div>

        <!-- 提交订单 -->
        <div v-if="isManage">
          <van-submit-bar :disabled="isNotHasCheck" class="submit-bar" :price="total" @submit="sumbitOrder" button-text="提交订单" button-type="info">
            <van-checkbox @click="allSelect" v-model="allCheck">全选</van-checkbox>
          </van-submit-bar>
        </div>
        <div v-else>
          <van-submit-bar :disabled="isNotHasCheck" class="submit-bar submit-bar-delete" button-text="删除选择" button-type="info" @submit="deleteMoreShopcart">
            <van-checkbox @click="allSelect" v-model="allCheck">全选</van-checkbox>
          </van-submit-bar>
        </div>

      </div>

    </div>
    <div v-else>
      <van-empty description="请先登录" />
    </div>
  </van-list>
</template>

<script>
export default {
  data(){
    return{
      isLogin:false,
      isManage:true,
      allCheck:false,
      isNotHasCheck: true,
      shopcartData:[],
      allShopcartData: [],
      loadCount: 8,
      loadOptions:{
        isLoading:true,
        isFinished:false,
        finishedText:"没有数据可加载了"
      },
      //总金额
      total:0
    }
  },

  created(){
    if(localStorage.getItem('__tnek')) {
      this.isLogin = true;
    }
    this.getShopcartInfo();
  },

  methods:{
    //获取购物车数据
    getShopcartInfo(){
      //获取token
      let tokenString = localStorage.getItem('__tnek')
      //开启加载提示
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration:0
      });

      this.axios({
        method:'GET',
        url:'/findAllShopcart',
        params:{
          appkey : this.appkey,
          tokenString
        }
      }).then(result => {
        this.$toast.clear()
        // 
        if(result.data.code == 5000){
          result.data.result.forEach(v => {
            v.isCheck = false;
          })
          this.allShopcartData = result.data.result;
          this.shopcartData = this.allShopcartData.splice(0, this.loadCount);

          // 

          if(this.allShopcartData.length > 0){
            this.loadOptions.isLoading = false;
          }else {
            this.loadOptions.isLoading = true;
            this.loadOptions.isFinished = true;
          }

          if(this.shopcartData.length == 0){
            this.loadOptions.finishedText = '';
          }
        }
      }).catch(err => {
        this.$toast.clear()
        
      })
    },

    //懒加载购物车数据
    loadData(){
      setTimeout(() => {
        this.shopcartData.push(...this.allShopcartData.splice(0,this.loadCount));
        if(this.allShopcartData.length == 0){
          this.loadOptions.isLoading = true;
          this.loadOptions.isFinished = true;
        }
      },1000)
    },

    //全选
    allSelect(){

      this.allShopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      })

      this.shopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      })

      this.isNotHasCheck = !this.allCheck;

      this.sum();
    },

    //单选
    simpleSelect(){

      this.sum();

      this.isNotHasCheck = true;

      for(let i=0; i<this.shopcartData.length;i++){
        if(this.shopcartData[i].isCheck){
          this.isNotHasCheck = false;
          break;
        }
      }

      for(let i=0; i<this.shopcartData.length;i++){
        if(!this.shopcartData[i].isCheck){
          this.allCheck = false;
          return;
        }
      }

      this.allCheck = true
    },

    //管理
    manage(){
      this.isManage = !this.isManage
    },

    //修改购物车数量
    changeCount(item){
      let tokenString = localStorage.getItem('__tnek');

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method:'POST',
        url:'/modifyShopcartCount',
        data:{
          appkey:this.appkey,
          tokenString,
          sid:item.sid,
          count:item.count
        }
      }).then(result => {
        this.$toast.clear();
        
        if(result.data.code == 6000){

          this.sum();

        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //单个删除购物车
    deleteShopcart(sids,index){
      let tokenString = localStorage.getItem('__tnek')

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method:'POST',
        url:'/removeShopcart',
        data:{
          appkey:this.appkey,
          tokenString,
          sids:JSON.stringify(sids)
        }
      }).then(result => {
        this.$toast.clear();
        if(result.data.code == 7000){
          this.shopcartData.splice(index,1)
          if(this.shopcartData.length == 0){
            this.loadOptions.finishedText = "";
          }

          this.sum();

          this.$toast.success('删除成功')
        }else{
          this.$toast.fail('删除失败')
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //删除多个购物车商品
    deleteMoreShopcart(){
      //获取删除商品的sid
      let sids = [];
      this.shopcartData.forEach(v => {
        if(v.isCheck){
          sids.push(v.sid);
        }
      })

      let tokenString = localStorage.getItem('__tnek')

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })

      this.axios({
        method:'POST',
        url:'/removeShopcart',
        data:{
          appkey:this.appkey,
          tokenString,
          //sid购物车唯一标识集合字符串
          sids:JSON.stringify(sids)
        }
      }).then(result => {
        this.$toast.clear();

        if(result.data.code == 7000){

          //删除页面的购物车商品
          for(let i=this.shopcartData.length-1; i>=0; i--){
            if(this.shopcartData[i].isCheck){
              this.shopcartData.splice(i,1);
            }
          }

          this.sum();

          if(this.shopcartData.length == 0){
            this.allCheck = false;
            this.isManage = true;
            this.loadOptions.finishedText = '';
          }

          this.$toast.success('删除成功')
        }else{
          this.$toast.fail('删除失败')
        }

      }).catch(err => {
        this.$toast.clear();
        
      })
    },

    //计算总金额
    sum(){
      this.total = 0;
      this.shopcartData.forEach(v => {
        if(v.isCheck){
          this.total += v.count * v.price * 100
        }
      })
    },

    //提交订单
    sumbitOrder(){

      //获取购物车sid
      let sids = [];

      this.shopcartData.forEach(v => {
        if(v.isCheck){
          sids.push(v.sid)
        }
      })

      this.$router.push({name:'Pay',query:{
        sids:sids.join('-')
      }})
    },

    //返回
    goBack(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="less" scoped>
.shopcart{
  /deep/ .van-nav-bar__text{
    color: #70432e;
  }
  /deep/ .van-nav-bar__arrow ,/deep/ .van-nav-bar__title{
    color: #70432e;
  }
  /deep/ .van-icon{
      background-color: #fa780a;
      border-color: #fa780a;
  }
  padding-bottom: 100px;
  .list{
    // background-color: skyblue;
    border-bottom: 1px solid #eee;
    .list_item{
      padding: 10px;
      height: 80px;
      border-bottom: 1px solid #eee;
      background-color: white;
    }
    /deep/ .deleButton{
      height: 100px;
      background-color: #fa780a;
      border-color: #fa780a;
    }
    .checkbox_item{
      width: 20px;
      height: 20px;
      margin-top: 30px;
    }
    
    .product_info{
      width: calc(~'100% - 30px');
      height: 80px;
      margin-left: 10px;
    }
    .product_img{
      width: 80px;
      height: 80px;
      background-color: skyblue;
    }
    .product_content{
      margin-left: 10px;
      width: calc(~"100% - 90px");
    }
    .product_title{
      font-size: 16px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .product_type{
      font-size: 12px;
      padding-top: 3px;
      color: #333;
    }
    .product_enname{
      margin-bottom: 10px;
    }
    .product_price{
      height: 30px;
    }
    .price{
      line-height: 30px;
      font-size: 16px;
      color: #fa780a;
    }
    /deep/ .van-stepper__minus{
      color: #fa780a;
      border-color: #fa780a;
    }
    /deep/ .van-stepper__plus{
      background-color: #fa780a;
    }
    .product_count{
      margin-top: 3px;
    }

  }
  /deep/ .submit-bar{
    bottom: 50px;
  }

  /deep/ .van-submit-bar__price{
    color: #fa780a;
  }
  /deep/ .van-button--info{
    background-color: #fa780a;
    border-color: #fa780a;
  }
  /deep/ .submit-bar-delete .van-button{
    margin-left: auto;
  }
}
</style>