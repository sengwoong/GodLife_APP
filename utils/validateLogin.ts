function isBlank(value: string) {
  return value.trim() === '';
}

type UserInfomation = {
  email: string;
  password: string;
  age?: string;
};

function validateUser(values: UserInfomation) {
  const errors = {
    email: '',
    password: '',
    age: '',
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
  }
  if (!values.age) {
    errors.age = '연령대를 선택해주세요.';
  }

  return errors;
}

function validateLogin(values: UserInfomation) {
  return validateUser(values);
}

function validateSignup(values: UserInfomation & {passwordConfirm: string}) {
  const errors = validateUser(values);
  const signupErrors = {...errors, passwordConfirm: ''};

  if (values.password !== values.passwordConfirm) {
    signupErrors.passwordConfirm = '비밀번호가 일치하지않습니다.';
  }

  return signupErrors;
}


function validateEditProfile(values: {nickname: string}) {
  const errors = {
    nickname: '',
  };

  if (isBlank(values.nickname)) {
    errors.nickname = '닉네임을 입력해주세요.';
  }

  return errors;
}


export {
  validateLogin,
  validateSignup,
  validateEditProfile,
};
