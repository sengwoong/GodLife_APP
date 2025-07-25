import React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text, TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, getFontStyle, spacing } from '../constants/index';
import Icon from 'react-native-vector-icons/MaterialIcons';

function EventList({ posts,onChangePressItem }: { posts: any[],onChangePressItem: (itmeIndex: number) => void }) {
  const styles = styling();
  const insets = useSafeAreaInsets();
  console.log("EventList");
  console.log("EventList");
  console.log("posts");
  console.log(posts);
  const handlePressItem = (itmeIndex: number) => {
    onChangePressItem(itmeIndex);
  };

  return (
    <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 1 }}>
      <View style={[styles.innerContainer, { paddingBottom: insets.bottom + 30 }]}>
        {posts?.map((post) => (
          <Pressable key={post.id} style={styles.itemContainer} onPress={() => handlePressItem(post.id)}>
            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                  {post.time}
                </Text>
                {post.hasAlarm && (
                  <Icon name="notifications-active" size={20} color={colors.GRAY} style={styles.alarmIcon} />
                )}
              </View>
              <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                {post.title}
              </Text>
              <Text style={styles.contentText} numberOfLines={3} ellipsizeMode="tail">
                {post.content}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styling = () =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.WHITE,
    }as ViewStyle,
    innerContainer: {
      gap: 2,
    }as ViewStyle,
    itemContainer: {
      flexDirection: 'row',
    }as ViewStyle,
    infoContainer: {
      marginTop: spacing.M16,
      borderColor: colors.GRAY,
      paddingHorizontal: spacing.M16,
      width: '100%',
    } as ViewStyle,
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.M8,
    } as ViewStyle,
    infoText: {
      color: colors.GRAY, 
      backgroundColor: colors.BLACK, 
      ... getFontStyle('body', 'medium', 'regular'),
      padding: spacing.M4,
      borderRadius: 20,
      overflow: 'hidden',
    } as TextStyle,
    alarmIcon: {
      marginRight: spacing.M8,
    } as ViewStyle,
    titleText: {
      color: colors.BLACK,
     ... getFontStyle('titleBody', 'large', 'bold'),
    } as TextStyle, 
    contentText: {
      color: colors.BLACK,
      ... getFontStyle('body', 'medium', 'regular'),
      marginTop: 5,
    } as ViewStyle,
  });

export default EventList;
