<template>
  <div class="my">
    <div class="picture"  :style="{backgroundImage: 'url(' + myInfo.userBg + ')'}">

      <!-- 登录了的内容 -->
      <div class="islogin" v-if="isLogin">

        <!-- 更换背景 -->
        <div class="change_bg clearfix ">
          <van-uploader :after-read="changeBg">
            <van-button  type="primary">更换背景</van-button>
          </van-uploader>
        </div>

        <!-- 个人信息 -->
        <div class="own_msg">
          <div class="clearfix top">
            <div class="fl tou_xiang">
              <img class="auto_img" :src="myInfo.userImg" >
            </div>
            <div class="fl nick_name">{{myInfo.nickName}}</div>
          </div>
          <div class="desc">简介：{{myInfo.desc ? myInfo.desc : '这个人很懒，什么都没有留下'}}</div>
        </div>
      
      </div>

      <!-- 没有登录的内容 -->
      <div class="noLogin" v-else>
        <div class="noLogin_item">
          <van-button class="btn_box" type="warning" @click="changePage('Login')">请先登录</van-button>
        </div>
      </div>
    </div>

    <div class="msg_list">
      <van-cell @click="changePage(item.name)" :title="item.title" is-link v-for="(item,index) in goPage" :key="index" />
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        myInfo:{},
        goPage:[
          {title:'个人信息',name:'Manage'},
          {title:'地址管理',name:'MyAddress'},
          {title:'我的收藏',name:'Collect'},
          {title:'安全中心',name:'Security'},
        ],
        isLogin:false
      }
    },
    created(){
      this.getMyInfo()
      if(localStorage.getItem('__tnek')){
        this.isLogin = true
      }
    },

    methods:{

      changePage(name){
        if(name === 'Login'){
          this.$router.push({name})
        }else{
          if(!this.isLogin){
            this.$toast('请先登录')
          }else{
            this.$router.push({name})
          }
        }
      },

      

      //获取个人信息
      getMyInfo(){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:"/findMy",
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 'A001'){
            this.myInfo = result.data.result[0]
          }
        }).catch(err => {
          this.$toast.clear();
        })
      },

      //更换背景
      changeBg(file){

        //获取图片base64
        let serverBase64Img = file.content.replace(/^data:image\/[A-Za-z]+;base64,/,"");
        
        //获取图片类型
        let imgType = file.file.type.split('/')[1];
    
        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:"/updateUserBg",
          data:{
            appkey:this.appkey,
            tokenString,
            imgType,
            serverBase64Img
          }
        }).then(result => {
          this.$toast.clear();
          if(result.data.code == 'I001'){
            this.myInfo.userBg = result.data.userBg;
          }

        }).catch(err => {
          this.$toast.clear();
        })
      }

    },
  }
</script>

<style lang="less" scoped>
.my{
  position: fixed;
  width: 100%;
  height: calc(~"100% - 50px");
  background-color: #eee;
  .picture{
    width: 100%;
    height: 160px;
    // background-color: skyblue;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .noLogin{
    width: 100%;
    height: 100%;
    background-color: #999;
    overflow: hidden;
  }
  .noLogin_item{
    width: 100%;
    height: 40px;
    text-align: center;
    margin-top: 55px;
  }
  /deep/ .van-button[data-v-6d0becd5]{
    width: 100px;
    height: 40px;
  }
  .van-button{
    height: 20px;
    margin-top: 5px;
  }
  .van-uploader{
    float: right;
  }
  .van-button--primary{
    border: 0;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, .2);
  }
  .msg_list{
    padding: 10px;
  }
  .top{
    width: 100%;
    height: 60px;
    // background-color: pink;
    margin-top: 20px;
    padding-left: 40px;
  }
  .tou_xiang{
    width: 60px;
    height: 60px;
    background-color: #eee;
    border-radius: 50%;
    overflow: hidden;
  }
  .nick_name{
    line-height: 60px;
    font-size: 16px;
    margin-left: 20px;
    color: #fff;
  }
  .desc{
    font-size: 14px;
    margin-left: 100px;
    color: #fff;

  }
  .van-cell{
    margin-bottom: 10px;
  }
}
</style>