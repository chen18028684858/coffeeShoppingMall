<template>
  <div class="my_address">
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <van-address-list
      v-model="aid"
      :list="addressList"
      default-tag-text="默认"
      @add="goAddress"
      @edit="goAddress"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        aid: '1',
        addressList:[]
        
      };
    },
    created(){
      this.getAddressData();
    },
    methods:{
      //获取地址数据
      getAddressData(){

        let tokenString = localStorage.getItem('__tnek')

        this.$toast.loading({
          message:'加载中...',
          forbidClick:true,
          duration:0
        })

        this.axios({
          method:'GET',
          url:'/findAddress',
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 20000){
            result.data.result.forEach(v => {
              let currentAddress = {
                id:v.aid,
                tel:v.tel,
                name:v.name,
                address:v.province + v.county + v.addressDetail,
                isDefault:Boolean(v.isDefault)
              };
              if(v.isDefault){
                this.aid =  v.aid
              }
              this.addressList.push(currentAddress);
            });
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //新增，编辑地址，新增地址不要携带aid, 编辑地址需要携带aid, aid： 地址id
      goAddress(address){
        let o ={
          name:'Address'
        };

        if(address){
          o.params = {
            aid:address.id
          }
        }
        this.$router.push(o);
      },

      //返回
      goBack(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
.my_address{
  /deep/ .van-address-item .van-radio__icon--checked .van-icon{
    background-color: #fa780a;
    border-color: #fa780a
  }
  /deep/ .van-tag--danger{
    background-color: #fa780a;
  }
  /deep/ .van-button--danger{
    background-color: #fa780a;
    border-color: #fa780a
  }
}
</style>