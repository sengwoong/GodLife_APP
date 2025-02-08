import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { spacing } from '../../constants';

interface MarginProps {
    size: keyof typeof spacing;
    children?: React.ReactNode;
  }
  
  export default function Margin({ size, children }: MarginProps) {
    return <View style={[ { margin: spacing[size] }]}>{children}</View>;
  }
