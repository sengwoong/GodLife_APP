import React, { useMemo, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TextStyle, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import Margin from '../../components/division/Margin';
import BulletinBoard from '../../components/BulletinBoard';
import { colors, getFontStyle, spacing } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { PostNavigations } from '../../constants';
import { PostStackParamList } from '../../navigations/stack/beforeLogin/PostStackNavigator';
import PostMenu from '../../components/PostMenu';

type PostDetailScreenNavigationProp = StackNavigationProp<PostStackParamList>;

export const PostDetailScreen = () => {
  const CategoryButtons = [
    { label: '상품정보', id: 'product-info' }, 
    { label: '구매평', id: 'reviews' },         
    { label: '반품교환', id: 'returns' },     
    { label: 'QA', id: 'questions' },          
  ];

  const [activeButton, setActiveButton] = useState('상품정보'); 

  const product_content = useMemo(
    () => [
      { id: 20, title: 'apple', content: '사과' },
      { id: 31, title: 'banana', content: '바나나'},
      { id: 10, title: 'taxi', content: '택시' },
    ],
    []
  );

  const navigateToContent = (Index: number) => {
    console.log(Index);
  };

  const navigation = useNavigation<PostDetailScreenNavigationProp>();

  const handleUserPress = () => {
    navigation.navigate(PostNavigations.POSTAVATAR, { userName: '고민해결사' });
  };

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <SafeAreaView style={styles.container}>
          <View style={styles.product__container}>
            {/* Product Image and Name */}
            <View style={styles.product__header}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }} 
                style={styles.product__image}
              />
              <View style={styles.product__info}>
                <Text style={styles.product__title}>아름다운 삶을 위한 패키지</Text>
                <TouchableOpacity onPress={handleUserPress}>
                  <Text style={styles.product__owner}>고민해결사</Text>
                </TouchableOpacity>
                <Text style={styles.product__price}>32000point</Text>
                <View style={styles.product__actions}>
                  <CustomButton color="BLACK" shape="rounded" size="text_size" label="좋아요" />
                  <CustomButton color="BLACK" shape="rounded" size="text_size" label="장바구니" />
                </View>
              </View>
            </View>
            <Margin size={'M12'} />
            <CustomButton color="BLACK" size="large" label="구매하기" />
          </View>

          <View style={styles.navigation}>
            {CategoryButtons.map((button) => (
              <PostMenu
                key={button.id}
                label={button.label}
                color={"상품정보" === button.label ? 'BLACK' : 'WHITE'}
              />
            ))}
          </View>

          {/* Product Information */}
          <View style={styles.section}>
            <Text style={styles.section__title}>상품 정보</Text>
            <Margin size={'M4'} />
            <BulletinBoard data={product_content} onItemPress={navigateToContent} />
          </View>

          {/* Purchase Section */}
          <View style={styles.section}>
            <Text style={styles.section__title}>구매평</Text>
            <Margin size={'M4'} />
            <BulletinBoard data={product_content} onItemPress={navigateToContent} />
            <Margin size={'M8'} />
            <TextInput placeholder="구매평을 남기기 위해 댓글을 작성 하세요" style={styles.section__input} />
            <Margin size={'M4'} />
            <CustomButton size="large" label="구매평 남기기" />
          </View>

          {/* Refund and QA Section */}
          <View style={styles.section}>
            <Text style={styles.section__title}>반품/교환</Text>
            <Margin size={'M4'} />
            <Text style={styles.section__text}>
              다운로드 전에는 반품이 가능합니다.
            </Text>
            <Text style={styles.section__text}>
              결재후 20일 이후에는 반품이 불가능 합니다.
            </Text>
            <Text style={styles.section__text}>
              반품한 모든 금액은 당사의 포인트로 반환 됩니다.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.section__title}>Q&A</Text>
            <BulletinBoard data={product_content} onItemPress={navigateToContent} />
            <Margin size={'M8'} />
            <TextInput placeholder="qa 를 입력 혹은 클릭하여 수정하세요" style={styles.section__input} />
            <Margin size={'M4'} />
            <CustomButton color='BLACK' size="large" label="질문하기" />
          </View>
        </SafeAreaView>
      }
      keyExtractor={() => 'header'}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  product__container: {
    margin: spacing.M16,
  },
  product__header: {
    flexDirection: 'row',
  },
  product__image: {
    width: 164,
    height: 262,
    borderRadius: 10,
    marginRight: spacing.M12,
  },
  product__info: {
    flex: 1,
  },
  product__title: {
    ...getFontStyle('title', 'large', 'bold'),
    marginTop: spacing.M12,
  } as TextStyle,
  product__owner: {
    ...getFontStyle('title', 'medium', 'medium'),
    marginTop: spacing.M12,
    textDecorationLine: 'underline',
  } as TextStyle,
  product__price: {
    ...getFontStyle('body', 'medium', 'medium'),
    color: colors.BLACK,
    marginTop: spacing.M12,
  } as TextStyle,
  product__actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.M12,
    marginTop: spacing.M12,
  },
  navigation: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 160,
  },
  section: {
    padding: spacing.M16,
  },
  section__title: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.BLACK,
  } as TextStyle,
  section__text: {
    ...getFontStyle('body', 'medium', 'medium'),
  } as TextStyle,
  section__input: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 5,
    padding: spacing.M12,
  },
});