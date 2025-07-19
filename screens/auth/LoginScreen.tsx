import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextStyle, View, Alert } from 'react-native';
import { useLogin } from '../../server/query/hooks/useAuth';
import CustomButton from '../../components/CustomButton';
import { TextInput } from 'react-native-gesture-handler';
import { colors, getFontStyle } from '../../constants';
import useForm from '../../components/hooks/useForm';
import InputField from '../../components/InputField';
import { validateLogin } from '../../utils/validateLogin';
import useAuthStore from '../../store/useAuthStore';

function LoginScreen() {
  const passwordRef = useRef<TextInput | null>(null);
  const loginMutation = useLogin();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const [message, setMessage] = useState<string | null>(null);

  const { values, errors, touched, getTextInputProps, setFieldValue } = useForm({
    initialValue: { email: '', password: '' },
    validate: validateLogin,
  });

  const onSubmit = async () => {
    setMessage('오브젝트탐생중');
    const validationErrors = validateLogin(values);
    if (Object.keys(validationErrors).length > 0) {

      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldValue(field, values[field as keyof typeof values]);
      });
    }
    
      setMessage('로그인 시도중중');
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      
      setAuth(
        { username: response.user },
        response.token 
      );
      
      setMessage('로그인 성공');
      
    } catch (error) {
      setMessage('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.largeText}>갓생</Text>
        <View style={styles.smallContainer}>
          <Text style={styles.smallText}>프리미엄 스케줄 관리</Text>
          <Text style={styles.smallText}>이번생 포기 안하기</Text>
        </View>
      </View>

      <View style={styles.loginContainer}>
        <InputField
          autoFocus
          placeholder="이메일"
          error={errors.email}
          touched={touched.email}
          inputMode="email"
          returnKeyType="next"
          submitBehavior="blurAndSubmit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...getTextInputProps('email')}
        />

        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          error={errors.password}
          touched={touched.password}
          secureTextEntry
          returnKeyType="join"
          {...getTextInputProps('password')}
        />
        
        <CustomButton
          label="로그인"
          variant="filled"
          size="large"
          onPress={onSubmit}
          disabled={loginMutation.isPending}
        />

         <Text style={styles.messageText}>{message}|| ㅁㄴㅇㅁㄴㅇ</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  largeText: {
    ... getFontStyle('display', 'large', 'bold'),
    color: colors.BLACK,
    textAlign: 'center',
  }as TextStyle,
  smallContainer: {
    marginTop: 16,
  },
  smallText: {
    ... getFontStyle('title', 'medium', 'medium'),
    textAlign: 'center',
  }as TextStyle,
  loginContainer: {
    gap: 8, 
  },
  messageText: {
    textAlign: 'center',
    color: colors.BLACK,
    marginTop: 20,
  },
});

export default LoginScreen;
