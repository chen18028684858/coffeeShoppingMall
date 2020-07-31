<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="goBack" />

    <div class="order_box">
      <div @click="openPopup">
        <div class="address"  >{{userAddress.address}}</div>

      </div>

      <div class="order_content">

        <div class="order_item" >

          <div class="items" v-for="(item,index) in orderData" :key="index">
          
            <div class="clearfix">

              <div class="fl pro_img">
                <img class="auto_img" :src="item.small_img">
              </div>

              <div class="fl pro_info">
                <div class="fl">
                  <div class="names">
                    <div class="zh_name">{{item.name}}</div>
                    <div class="en_name">{{item.enname}}</div>
                  </div>
                  <div class="rule">{{item.rule}}</div>
                </div>
                <div class="fr">
                  <div class="price">￥{{item.price}}</div>
                  <div class="count">x{{item.count}}</div>
                </div>
              </div>

            </div>

          </div>

          <div class="order_totle clearfix">
            <div class="fr clearfix">
              <span class="fl total_count">共计 {{counts}} 件商品 合计：</span>
              <span class="fl total_price">￥{{total}}</span>
            </div>
          </div>

        </div>

      </div>
    </div>



    <van-submit-bar :price="total * 100" button-text="立即结算" button-type="info" @submit="commit"  />

    <van-popup class="popup-box" v-model="isOpen" position="bottom" >
      <van-address-list v-model="aid" :list="addressList" default-tag-text="默认" @add="gopage" @select="selectAddress"  />
    </van-popup>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        isOpen:false,
        aid:'',
        addressList:[],
        userAddress:{
          address: '请选择收货地址',
          phone: '',
          receiver: ''
        },
        orderData:[],
        counts:0,
        total:0,
        sids:[]
      }
    },
    created(){

      //截取查询参数sids
      this.sids = this.$route.query.sids.split('-')

      this.getAddressData();

      this.getPayOrderData(this.sids)
    },
    methods:{

      //返回
      goBack(){
        this.$router.go(-1)
      },

      //显示收货地址选择栏
      openPopup() {
        this.isOpen = true;
      },

      //获取地址信息
      getAddressData(){
        
        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:'/findAddress',
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear()
          if(result.data.code == 20000){
            result.data.result.forEach(v => {
              let currentAddress = {
                id:v.aid,
                tel:v.tel,
                name:v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault:Boolean(v.isDefault)
              };

              if(v.isDefault){
                this.aid = v.aid;

                //如果存在默认地址，则默认选择默认地址
                this.userAddress.address = currentAddress.address;
              }

              this.addressList.push(currentAddress);
            })
          }
        }).catch(err => {
          this.$toast.clear()
          
        })

      },

      //选择地址
      selectAddress(item){
        this.isOpen = false;
        this.address = item.address;

        this.userAddress = {
          address: item.address,
          phone: item.tel,
          receiver: item.name
        }
      },

      //获取提交订单数据
      getPayOrderData(sids){

        let tokenString = localStorage.getItem('__tnek')

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })  

        this.axios({
          method:'GET',
          url:'/commitShopcart',
          params:{
            appkey:this.appkey,
            tokenString,
            sids:JSON.stringify(sids)
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 50000){
            result.data.result.forEach(v => {
              this.counts += v.count;
              this.total += v.count * v.price;
            })

            this.orderData = result.data.result;
          }
        }).catch(err =>{
          this.$toast.clear();
          
        })

      },

      //立即结算
      commit(){
        if(this.userAddress.address == '请选择收货地址'){
          this.$toast('请选择收货地址');
          return
        }

        let tokenString = localStorage.getItem('__tnek')

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:'/pay',
          data:{
            appkey:this.appkey,
            tokenString,
            sids:JSON.stringify(this.sids),
            phone:this.userAddress.phone,
            address:this.addressList.address,
            receiver:this.userAddress.receiver
          }
        }).then(result => {
          this.$toast.clear()
          if(result.data.code == 60000){
            this.$router.push({name:'Order'});
          }
        }).catch(err => {
          this.$toast.clear()
          
        })

      },

      gopage(){
        this.$router.push({name:'Address'})
      }


    }
  }
</script>

<style lang="less" scoped>
.pay{
  /deep/ .van-nav-bar__text , /deep/ .van-icon{
    color: #70432e;
  }
  .order_box{
    padding: 10px;
  }
  .address{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #fff;
    border-radius: 10px;
    padding-left: 10px;
  }
  .order_content{
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
  }
  .order_item{
    padding-bottom: 10px;
  }
  .pro_img{
    width: 60px;
    height: 60px;
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