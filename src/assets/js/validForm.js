import {Toast} from 'vant';
class ValidForm {
  constructor(){
    this.validUserFormReg={
      phone:{
        reg : /^1[3-9]\d{9}$/, 
        msg : '昵称格式不正确',
      },
      nickName:{
        reg:/^[\u4e00-\u9fa5\w]{1,10}$/,
        msg:'手机号格式不正确'
      },
      password:{
        reg:/^[a-zA-Z]\w{5,15}$/,
        msg:'密码格式不正确'
      },

      //旧密码
      oldPwd: {
        reg: /^[a-zA-Z]\w{5,15}$/,
        msg: '旧密码格式不正确且以字母开头'
      },

      //邮箱
      email: {
        reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        msg: '邮箱格式不正确'
      },

      //6位数字验证码
      code: {
        reg: /^\d{6}$/,
        msg: '验证格式正确'
      }

    }
  }
  validUserForm(o){
    for(let key in o){
      if(!this.validUserFormReg[key].reg.test(o[key])){
        Toast(this.validUserFormReg[key].msg);
        return false;
      }
    }
    return true;
  }
  
};

export default new ValidForm();