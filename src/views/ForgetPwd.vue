<template>
  <div class="forget">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="goBack" />
    <div class="forgetBox">

      <!-- 邮箱验证栏 -->
      <div v-if="!goNext">

        <van-form>
          
          <van-field
            v-model="codeInfo.email"
            type="text"
            label="邮箱"
            placeholder="邮箱地址"
          />

          <van-field
            key="code"
            v-model="codeInfo.code"
            center
            clearable
            label="邮箱验证码"
            placeholder="请输入邮箱验证码"
          >
            <template #button>
              <van-button size="small" type="primary" @click="sendCode" :disabled="send">{{text}}</van-button>
            </template>
          </van-field>

          <div class="nextBtn">
            <van-button round block type="warning" @click="isNext" native-type="submit">提交</van-button>
          </div>

        </van-form>

      </div>

      <!-- 修改密码栏 -->
      <div v-else>

        <van-form @submit="changePwd">

          <van-field
            v-model="userMsg.phone"
            type="text"
            label="手机号"
            placeholder="注册时手机号"
            left-icon="phone-o"
            maxlength="11"
          />
          <van-field
            v-model="userMsg.password"
            :type="isEye ? 'text' : 'password'"
            label="新密码"
            placeholder="字母数字_组合(6-16位)"
            left-icon="lock"
            :right-icon="isEye ? 'eye-o' : 'closed-eye'"
            @click-right-icon="changePwdIcon"
            maxlength="16"
          />
          <div class="subBtn">
            <van-button round block type="warning" native-type="submit">提交</van-button>
          </div>

        </van-form>

      </div>

    </div>
  </div>
</template>

<script>
import validForm from "../assets/js/validForm.js";
  export default {
    data(){
      return {
        isEye:true,
        goNext:false,
        
        userMsg:{
          phone:'',
          password:''
        },
        codeInfo:{
          email:'',
          code:'',
        },

        //按钮文本内容
        text:'发送验证码',

        //控制按钮display
        send:false

      }
    },

    created(){

    },
    
    methods:{

      //返回
      goBack(){
        if(this.goNext){
          this.goNext = false
        }else{
          this.$router.go(-1)
        }
      },

      //切换密码框的眼睛
      changePwdIcon() {
        this.isEye = !this.isEye;
      },

      //验证成功
      isNext(){
        
        if(!validForm.validUserForm(this.codeInfo)){
          return;
        }

        //发起发送验证码请求
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: "POST",
          url: "/checkValidCode",
          data: {
            appkey: this.appkey,
            validCode: this.codeInfo.code
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'K001') {
            this.goNext = true;
          } else {
            this.$toast(result.data.msg);
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        });

      },
      
      //发送验证码
      sendCode(){
        if (!validForm.validUserForm({email: this.codeInfo.email})) {
          return;
        }

        //获取邮箱验证码
        let num = 60;
        this.text = num + '秒后重新发送';
        this.send = true;
        let timer = setInterval(() => {
          if(num == 0){
            clearInterval(timer);
            timer = null;
            this.text = '发送验证码';
            this.send = false
          }else{
            num--;
            this.text = num + '秒后重新发送';
          }
        },1000)

        //发起发送验证码请求
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: "POST",
          url: "/emailValidCode",
          data: {
            appkey: this.appkey,
            email: this.codeInfo.email
          }
        }).then(result => {
          this.$toast.clear();

          this.$toast(result.data.msg);
          
        }).catch(err => {
          this.$toast.clear();
          
        });


      },

      //提交修改密码
      changePwd(){
        if (!validForm.validUserForm(this.userMsg)) {
          return;
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: "POST",
          url: "/retrievePassword",
          data: {
            appkey: this.appkey,
            phone: this.userMsg.phone,
            password: this.userMsg.password
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'L001') {
            this.$router.push({name: 'Login'});
          } else {
            this.$toast(result.data.msg);
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        });

      }

    }
  }
</script>

<style lang="less" scoped>
.forget{
  .van-button--primary{
    background-color: #ff976a;
    border-color: #ff976a;
  }
  .forgetBox{
    padding: 10px;
  }
  .nextBtn , .subBtn{
    margin-top: 10px;
  }
}
</style>