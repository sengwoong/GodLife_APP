function isBlank(value: string) {
  return value.trim() === '';
}

type UserInfomation = {
  email: string;
  password: string;
  nickname: string;
  age: string;
};

function validateUser(values: UserInfomation) {
  const errors = {
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    age: '',
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
  }
  if (!values.nickname || values.nickname.trim() === '') {
    errors.nickname = '닉네임을 입력해주세요.';
  }
  if (!values.age) {
    errors.age = '연령대를 선택해주세요.';
  }

  return errors;
}

function validateLogin(values: Omit<UserInfomation, 'passwordConfirm' | 'nickname' | 'age'>) {
  const errors = {
    email: '',
    password: '',
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  if (!(values.password.length >= 8 && values.password.length <= 20)) {
    errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
  }

  return errors;
}

function validateSignup(values: UserInfomation & { passwordConfirm: string }) {
  const errors = validateUser(values);

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
}

function validateEditProfile(values: { nickname: string }) {
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
