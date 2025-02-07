import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, Text, TextStyle, View } from 'react-native';
import { AuthStackParamList } from '../../navigations/stack/afterLogin/AuthStackNavigator';
import { authNavigations, colors, getFontStyle } from '../../constants';
import CustomButton from '../../components/CustomButton';
import ImageSlider from '../../components/ImageSlider';

type AuthHomeScreenProps = StackScreenProps<AuthStackParamList, typeof authNavigations.HOME>;

function AuthHomeScreen({ navigation }: AuthHomeScreenProps) {
  const images = [
    require('../../assets/images/MainImage.png'),
    require('../../assets/images/ScheduleImage.png'),
    require('../../assets/images/VocaImage.png'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ImageSlider images={images} />
        <View style={styles.textContainer}>
          <Text style={styles.largeText}>모두함께 갓생 살아요</Text>
          <View style={styles.smallContainer} >
          <Text style={styles.smallText}>작심 3일 스케줄 관리 실패</Text>
          <Text style={styles.smallText}>이제그만 갓생 라이프</Text>
          </View>
        </View>   
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          label="로그인화면으로 이동"
          onPress={() => navigation.navigate(authNavigations.LOGIN)}
        />
        <CustomButton
          label="회원가입 이동"
          color="BLACK"
          onPress={() => navigation.navigate(authNavigations.SIGNUP)}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 32,
    justifyContent: 'space-between',
  },
  textContainer:{
    marginTop: 60,
  },
  largeText: {
    ...getFontStyle('display', 'small', 'bold') ,
    textAlign: 'center',
    color: colors.BLACK,
  } as TextStyle,
  smallContainer:{
    marginTop: 24,
  },
  smallText: {
    ...getFontStyle('titleBody', 'medium', 'medium') ,
    textAlign: 'center',
  } as TextStyle,
  buttonContainer: {
    gap: 16,
    justifyContent: 'flex-end',
    marginVertical: 60,
  },
});

export default AuthHomeScreen;
