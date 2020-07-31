<template>
  <div class="manage">
    <van-nav-bar
      title="账号管理"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />


    <van-cell-group>
      <van-cell title="头像">
        <div class="userImg fr">
          <img class="auto_img" :src="userMsg.userImg" alt="">
          <van-uploader class="upload_box" :after-read="uploadFile" />
        </div>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="用户ID" :value="userMsg.userId" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="手机号" :value="userMsg.phone" />
    </van-cell-group>
    <van-cell-group>
      <van-field @blur="changeMsg({key:'nickName',value:userMsg.nickName,url:'/updateNickName'})" label="昵称" v-model="userMsg.nickName" input-align="right"/>
    </van-cell-group>
    <van-cell-group>
      <van-field
      v-model="userMsg.desc"
      rows="2"
      autosize
      label="简介"
      type="textarea"
      maxlength="20"
      placeholder="请输入简介"
      show-word-limit
      @blur="changeMsg({key:'desc',value:userMsg.desc,url:'/updateDesc'})"
    />
    </van-cell-group>
    
  </div>
</template>

<script>
  export default {
    data(){
      return {
        userMsg:{}
      }
    },
    created(){
      this.getUserMsg()
    },
    methods:{
      //返回
      goBack(){
        this.$router.go(-1);
      },

      //获取用户信息
      getUserMsg(){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:"/findAccountInfo",
          params:{
            appkey:this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 'B001'){
            this.userMsg = result.data.result[0];

          }

        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //上传头像
      uploadFile(file){

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
          url:"/updateAvatar",
          data:{
            appkey:this.appkey,
            tokenString,
            imgType,
            serverBase64Img
          }
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 'H001'){
            this.userMsg.userImg  = result.data.userImg;
          }

        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //修改昵称or简介
      changeMsg(o){

        let tokenString = localStorage.getItem('__tnek');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:o.url,
          data:{
            appkey:this.appkey,
            tokenString,
            [o.key]:o.value
          }
        }).then(result => {
          this.$toast.clear();
          
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.manage{
  .van-cell{
    line-height: 40px;
  }
  .userImg{
    width: 40px;
    height: 40px;
    background-color: #eee;
    position: relative;
  }
  .upload_box{
    position: absolute;
    left: 0;
    top: 0;
  }
  /deep/ .van-uploader__upload{
    width: 40px;
    height: 40px;
    margin: 0;
    opacity: 0;
  }

}
</style>