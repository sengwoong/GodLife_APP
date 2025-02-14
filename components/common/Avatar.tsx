import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { colors, spacing } from '../../constants';

interface AvatarProps {
  uri?: string;
  size?: number;
  onPress?: () => void;
  showBadge?: boolean;
  username?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 40,
  onPress,
  showBadge = false,
  username,
}) => {
  const defaultImage = 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Image
          source={{ uri: uri || defaultImage }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
        {showBadge && <View style={styles.badge} />}
      </View>
      {username && <Text style={styles.username}>{username}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.GREEN,
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  username: {
    marginTop: spacing.M4,
    fontSize: 12,
    color: colors.BLACK,
  },
});

export default Avatar; 