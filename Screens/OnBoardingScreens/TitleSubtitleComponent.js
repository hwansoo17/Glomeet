import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitleSubtitleComponent = ({ title, subtitle }) => (
  <View>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.titleMargin}/>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#181619',
    fontSize: 24,
    textAlign: 'center',
  },
  titleMargin: {
    height:20
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#898989',
    textAlign: 'center',
  },
});

export default TitleSubtitleComponent;