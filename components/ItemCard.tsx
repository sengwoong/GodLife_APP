import { View, Text, StyleSheet, TextStyle, Image } from 'react-native'
import React from 'react'
import { colors, getFontStyle, spacing } from '../constants'

export default function ItemCard() {
  return (
    <View>
  
        <View style={styles.itemCard}>
      <Image
        source={{ uri: 'https://example.com/product3.png' }}
        style={styles.itemImage}
      />
      {/* 설명창을 감싸는 래퍼 */}
      <View style={styles.itemDescriptionWrapper}>
        <Text style={styles.itemName}>명상 곡 3</Text>
        <Text style={styles.itemDescription}>깊은 휴식을 주는 곡</Text>
      </View>
    </View>

    
    </View>
  )
}
const styles = StyleSheet.create({



   // 추천 상품 섹션
   itemSection: {
    flex: 1, // Flexbox 적용으로 높이를 자동 조정
    backgroundColor: colors.BLACK,
    height: 1050,
    borderRadius: 15,
    paddingHorizontal: spacing.M16,
  },
  sectionTitle: {
    ...getFontStyle('title', 'medium', 'bold'),
    color: colors.WHITE,
    marginBottom: spacing.M8,
  } as TextStyle,
  itemContent:{
    width:"100%",
  },
  itemCard: {
    borderRadius: 15,
    height: 125,
    marginBottom: spacing.M8,
    flexDirection: 'row',
    paddingVertical: spacing.M8,
  },
  itemImage: {
    backgroundColor: colors.GRAY,
    width: 109,
    height: 109,
    borderRadius: 10,
  },


  itemDescriptionWrapper: {
    paddingHorizontal: 10, // 좌우 패딩 추가
    paddingVertical: 5, // 위아래 패딩 추가
    borderRadius: 10, // 모서리 둥글게
    marginLeft: 80, // 이미지와의 간격
  },
  

  itemName: {
    ...getFontStyle('title', 'large', 'bold'),
    color: colors.WHITE,
    textAlign: 'left',
    marginBottom: spacing.M4,
  } as TextStyle,
  itemDescription: {
    ...getFontStyle('body', 'large', 'regular'),
    color: colors.WHITE,
    textAlign: 'left',
  } as TextStyle,


})