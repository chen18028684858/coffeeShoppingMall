<template>
  <div class="register">
    <van-nav-bar 
      title="注册" 
      left-text="登录" 
      right-text="关闭" 
      @click-left="goPage('Login')"
      @click-right="goPage('Index')"
    />
    <div class="logo">
      <img class="auto_img" src="../assets/images/1.jpg" />
    </div>
    <van-form @submit="register">
      <van-field
        type="text"
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="输入11位手机号"
        left-icon="phone-o"
        :rules="[
          { 
            required: true, 
            message: '请填写手机号' 
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请填写正确的手机号'
          }
        ]"
      />
      <van-field
        type="text" 
        v-model="userInfo.nickName"
         
        label="昵称" 
        placeholder="字母数字_组合(1-10位)" 
        left-icon="user-o" 
        :rules="[{ required: true, message: '请填写昵称' }]"
      />
      <van-field
        :type="isEye ? 'text' : 'password'"
        v-model="userInfo.password"
        
        label="密码"
        placeholder="字母开头数字_组合(6-16位)"
        left-icon="lock"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        @click-right-icon="changePwdIcon"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      
      <div class="reg_btn">
        <van-button round block type="info" native-type="submit">注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

import validForm from '../assets/js/validForm'

export default {
  data(){
    return {
      isEye:true,
      userInfo:{
        phone:'',
        password:'',
        nickName:'',
      },
      judgePhone:'/^1[3456789]\d{9}$/'
    }
  },

  methods:{
    //切换密码框的眼睛
    changePwdIcon() {
      this.isEye = !this.isEye;
      // if(this.isEye){
      //   Event.path[0].className = 'van-icon van-icon-closed-eye'
      //   Event.path[2].children[0].type = 'password'
      // }else{
      //   Event.path[0].className = 'van-icon van-icon-eye-o'
      //   Event.path[2].children[0].type = 'text'
      // }
    }, 
    goPage(name){
      this.$router.push({name})
    },
    register(){
      if(validForm.validUserForm(this.userInfo,this)){
        let data = Object.assign({},this.userInfo);
        data.appkey = this.appkey;
        //开启加载提示
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration:0
        });
        this.axios({
          method:'POST',
          url:'/register',
          data
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 100){
            this.$router.push({name:'Login'})
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
};
// 手机号码正则表达式： /^1[3456789]\d{9}$/
</script>

<style lang="less" scoped>
.register {
  
  .logo {
    width: 100px;
    height: 100px;
    margin: 80px auto;
  }
  .reg_btn {
    margin-top: 40px;
    padding: 0 20px;
    button {
      background-color: #70432e;
      border-color: #70432e;
    }
  }
  /deep/ .van-nav-bar__text{
    color: #70432e;
  }
}
</style>