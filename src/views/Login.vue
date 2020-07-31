<template>
  <div class="register">
    <van-nav-bar 
      title="登录" 
      left-text="注册" 
      right-text="关闭" 
      @click-left="goPage('Register')"
      @click-right="goPage('Index')"
    />
    <div class="logo">
      <img class="auto_img" src="../assets/images/1.jpg" />
    </div>
    <van-form @submit="login">
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
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <div class="fr" @click="goPage('ForgetPwd')">忘记密码？</div>
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
      },
      judgePhone:'/^1[3456789]\d{9}$/'
    }
  },

  methods:{
    changePwdIcon() {
      this.isEye = !this.isEye;
      
    }, 
    goPage(name){
      this.$router.push({name})
    },
    login(){
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
          url:'/login',
          data
        }).then(result => {
          this.$toast.clear();
          
          if(result.data.code == 200){
            this.$router.push({name:'Index'})

            //存储token，用于后面登录验证
            localStorage.setItem("__tnek",result.data.token)
          }else{
            this.$toast(result.data.msg)
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