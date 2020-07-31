<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="collect_list">
      <div class="collect_item clearfix"  v-for="(item,index) in like" :key="index">
        <div @click="goDetail(item.pid)">
          <div class="fl item_img">
            <img class="auto_img" :src="item.smallImg" >
          </div>
          <div class="fl item_desc">
            <div class="names">
              <div class="zh_name">{{item.name}}</div>
              <div class="en_name">{{item.enname}}</div>
            </div>
            <div class="price clearfix">
              <div class="fl">{{item.price}}</div>
              
            </div>
          </div>
        </div>
        <div class="clearfix">
          <button class="fr no_like" @click="setNotLike(item.pid,index)">取消收藏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        like:[]
      }
    },

    created(){
      this.findAllLike()
    },

    methods:{


      goBack(){
        this.$router.go(-1);
      },


      findAllLike(){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:"/findAllLike",
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 2000){
            this.like = result.data.result
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },


      setNotLike(pid,i){

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
          method:'POST',
          url:'/notlike',
          data:{
            appkey:this.appkey,
            pid,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 900){
            this.like.splice(i,1)
            this.$toast(result.data.msg);
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },


      goDetail(pid){
        this.$router.push({name:'Detail',query:{pid}})
      },


    }

  }
</script>

<style lang="less" scoped>
.collect{
  .collect_list{
    padding: 10px;
  }
  .collect_item{
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
  }
  .item_img{
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    background-color: skyblue;
  }
  .zh_name{
    height: 30px;
    line-height: 30px;
  }
  .en_name{
    height: 30px;
  }
  .item_desc{
    margin-left: 10px;
    width: calc(~"100% - 100px");
  }
  .price{
    width: 100%;
  }
  .no_like{
    border-radius: 10px;
    border: 1px solid #eee;
  }
}
</style>