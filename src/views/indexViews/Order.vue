<template>
  <div class="order">

    <div v-if="isLogin">
      <van-tabs v-model="activeStatus" color="#fa780a" @change="changeStatusList" line-height="2" title-active-color="#fa780a">
        <van-tab :title="item.title" :name="item.name" v-for="(item, index) in tabMsg" :key="index">

          <van-empty v-if="orderNums.length == 0" description="你没有订单，快去逛逛下单吧" />

          <div class="order_content" >
            
            <div class="order_items">
              <!-- 每一订单 start-->
              <div class="order_item" v-for="(item,index) in orderNums" :key="index" >
                
                  
                  <div class="order_item_title">
                    <div class="fl order_no">{{item}}</div>
                    <div class="fr" v-if="productList[item].status == 2">
                      <span class="confirm fl">已收货</span>
                      <span class="delete fl" @click="deleteOrder(item)">
                        <van-icon class="delete-icon" name="delete" />
                      </span>
                    </div>
                    <div class="fr" v-else>
                      <span class="confirm" @click="confirmReceipt(item)">确认收货</span>
                      
                    </div>
                  </div>

                  <div class="items" v-for="(v,i) in productList[item].data" :key="i" >
                  
                    <div class="clearfix">

                      <div class="fl pro_img">
                        <img class="auto_img" :src="v.smallImg">
                      </div>

                      <div class="fl pro_info">
                        <div class="fl">
                          <div class="names">
                            <div class="zh_name">{{v.name}}</div>
                            <div class="en_name">{{v.enname}}</div>
                          </div>
                          <div class="rule">{{v.rule}}</div>
                        </div>
                        <div class="fr">
                          <div class="price">￥{{v.price}}</div>
                          <div class="count">x{{v.count}}</div>
                        </div>
                      </div>

                    </div>

                  </div>

                

                <div class="order_totle clearfix">
                  <div class="fl time">{{productList[item].date | dateRule('yyyy-MM-dd hh:mm:ss')}}</div>
                  <div class="fr clearfix">
                    <span class="fl total_count">共计 {{productList[item].count}} 件商品 合计：</span>
                    <span class="fl total_price">￥{{productList[item].total}}</span>
                  </div>
                </div>

              </div>
              <!-- 每一订单 end-->
            </div>

          </div>


        </van-tab>


      </van-tabs>
    </div>
    <div v-else>
      <van-empty description="请先登录" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isLogin: false,
        activeStatus: "0",
        orderNums:[],
        productList:{},
        tabMsg:[
          {title:'全部',name:0},
          {title:'待收货',name:1},
          {title:'已收货',name:2},
        ]
      };
    },
    created(){

      if(localStorage.getItem('__tnek')) {
        this.isLogin = true;
      }
      this.getProInOrder()

    },
    methods:{
      
      //切换不同状态的订单栏
      changeStatusList(a){
        this.getProInOrder();
      },

      //获取订单中的商品
      getProInOrder(){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'GET',
          url: '/findOrder',
          params: {
            appkey: this.appkey,
            tokenString,
            status: this.activeStatus
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 70000){
            
            //降序排序
            result.data.result.sort((a,b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })

            //获取订单编号
            let oidS = [];

            //查询是否存在订单编号
            result.data.result.forEach(v => {
              if(oidS.indexOf(v.oid)){
                oidS.push(v.oid);
              }
            })

            this.orderNums = oidS;

            //根据订单编号获取订单数据
            let productList = {};

            result.data.result.forEach(v => {
              if(!productList[v.oid]){
                productList[v.oid]={
                  data:[v],
                  status:v.status,
                  date:v.createdAt,
                  count:v.count,
                  total:v.count * v.price
                };

              }else{
                productList[v.oid].count += v.count;
                productList[v.oid].total += v.count * v.price;
                productList[v.oid].data.push(v);
              }
            })

            this.productList = productList;

          }
        }).catch(err => {
          this.$toast.clear();
          

        })
      },

      //确认收货
      confirmReceipt(oid){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url: '/receive',
          data: {
            appkey: this.appkey,
            tokenString,
            oid
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 80000){
            this.productList[oid].status = 2;

            if(this.activeStatus == 1){
              let i = this.orderNums.indexOf(oid);
              this.orderNums.splice(i,1)
            }
          }
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //删除已收货订单
      deleteOrder(oid){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'POST',
          url: '/removeOrder',
          data: {
            appkey: this.appkey,
            tokenString,
            oid
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 90000){
            let i = this.orderNums.indexOf(oid);
            this.orderNums.splice(i,1)
          }
        }).catch(err => {
          this.$toast.clear();
          
        })

      }

    }
  }
</script>

<style lang="less" scoped>
.order{
  .order_item_title{
    height: 25px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    line-height: 25px;
  }
  .order_no{
    color: #999;
    font-size: 12px; 
    margin-top: 3px;
    padding-left: 5px;
  }

  .confirm{
    color: #666;
    font-size: 14px;

  }

  .delete{
    display: block;
    font-size: 18px;
    color: #666;
    margin-left: 10px;
    margin-top: 3px;
  }
  
  .order_item{
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
  }

  .order_content{
    // margin-top: 10px;
    position: fixed;
    width: calc(~"100% - 20px");
    height: calc(~"100% - 94px");
    background-color: #eee;
    overflow-y: auto;
    padding: 10px;
  }
 
  .pro_img{
    width: 60px;
    height: 60px;
    // background-color: skyblue;
  }
  .pro_info{
    width: calc(~"100% - 70px");
    margin-left: 10px;
  }
  .names{
    height: 40px;
  }
  .zh_name{
    font-size: 14px;
  }
  .en_name{
    font-size: 12px;
    color: #999;
  }
  .price{
    height: 40px;
    font-size: 14px;
    color: #888;
    text-align: right;
  }
  .rule{
    height: 20px;
    line-height: 20px;
    color: #999;
    font-size: 12px;
  }
  .count{
    height: 20px;
    line-height: 20px;
    color: #888;
    text-align: right;
  }
  .items{
    padding-bottom: 10px;
    padding-left: 10px;
    // border-bottom: 1px solid #eee;
  }
  .order_totle{
    border-bottom: 1px solid #e8e8e8;
  }
  .total_count{
    font-size: 12px;
    height: 40px;
    color: #999;
    line-height: 40px;
  }
  .total_price{
    font-weight: 700;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
  }
  .time{
    height: 40px;
    line-height: 40px;
    color: #999;
  }
  /deep/ .van-tag--danger{
    background-color: #fa780a;
  }
  /deep/ .van-button--danger, /deep/ .van-button--info{
    background-color: #fa780a;
    border-color: #fa780a;
  }
  /deep/ .van-submit-bar__price{
    color: #fa780a;
  }
  /deep/ .van-address-item .van-radio__icon--checked .van-icon{
    background-color: #fa780a;
    border-color: #fa780a;
    color: #fff;
  }
}
</style>