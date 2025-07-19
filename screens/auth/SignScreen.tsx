import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextStyle, View, Alert } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { TextInput } from 'react-native-gesture-handler';
import useForm from '../../components/hooks/useForm';
import { validateLogin, validateSignup } from '../../utils/validateLogin';
import { colors, getFontStyle } from '../../constants';
import SelectButton from '../../components/SelectButton';
import { useLogin, useSignUp } from '../../server/query/hooks/useAuth';
import useAuthStore from '../../store/useAuthStore';


function SignScreen() {
  const nicknameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  
  const login = useForm({
    initialValue: {
      email: '',
      nickname: '',
      password: '', 
      passwordConfirm: '',
      age: '',
    },
    validate: validateSignup,
  });

  const signUpMutation = useSignUp();
  const signInMutation = useLogin();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  
  const handleSignUp = async () => {
    const ageMap: { [key: string]: number } = {
      '10대': 10,
      '20대': 20,
      '30대': 30,
      '40대': 40,
      '50대 이상': 50
    };

    try {
      // 회원가입
      await signUpMutation.mutateAsync({
        email: login.values.email,
        nickName: login.values.nickname,
        password: login.values.password,
        age: ageMap[login.values.age] || 0, 
      });
      
      // 회원가입 성공 후 자동 로그인
      const response = await signInMutation.mutateAsync({
        email: login.values.email,
        password: login.values.password,
      });

      // 로그인 성공 시 인증 정보 저장
      setAuth(
        { username: response.user },
        response.token 
      );


    } catch (error) {
      Alert.alert('오류', '회원가입 또는 로그인에 실패했습니다.');
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
          error={login.errors.email}
          touched={login.touched.email}
          inputMode="email"
          returnKeyType="next"
          onSubmitEditing={() => nicknameRef.current?.focus()}
          {...login.getTextInputProps('email')}
        />
        <InputField
          ref={nicknameRef}
          placeholder="닉네임"
          error={login.errors.nickname}
          touched={login.touched.nickname}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...login.getTextInputProps('nickname')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          error={login.errors.password}
          touched={login.touched.password}
          secureTextEntry
          returnKeyType="join"
          {...login.getTextInputProps('password')}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder="비밀번호 확인"
          error={login.errors.passwordConfirm}
          touched={login.touched.passwordConfirm}
          secureTextEntry
          returnKeyType="join"
          {...login.getTextInputProps('passwordConfirm')}
        />
        

        <SelectButton
          options={['10대', '20대', '30대', '40대', '50대 이상']}
          selectedOption={login.values.age}
          onSelect={(value) => {
           
            login.setFieldValue('age', value);
          
          }}
        />
        
        <CustomButton
          label="회원가입"
          variant="filled"
          size="large"
          onPress={handleSignUp}
          disabled={signUpMutation.isPending}
        />
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
});

export default SignScreen;


