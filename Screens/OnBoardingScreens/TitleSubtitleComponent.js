import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitleSubtitleComponent = ({ titles, subtitles }) => (
  <View>
    {titles.map((title, index) => (
      <Text key={index} style={styles.title}>{title}</Text>
    ))}
    <View style={styles.titleMargin}/>
    {subtitles.map((subtitle, index) => (
      <Text key={index} style={styles.subtitle}>{subtitle}</Text>
    ))}
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
    fontSize: 16,
    color: '#181619',
    textAlign: 'center',
  },
});

export default TitleSubtitleComponent;