import React from 'react';


import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { DrawerActions, useNavigation } from '@react-navigation/native';

function HomeHeaderLeft() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ padding: 10 }}
        >
            <Icon 
                name="menuunfold"
                size={24}
                color="#000000"
            />
        </TouchableOpacity>
    );
}

export default HomeHeaderLeft;
