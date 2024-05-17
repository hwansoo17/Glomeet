import React from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const SelectableList = ({ data, selectItem, selectedItem, renderItemStyle }) => {
  const {t} = useTranslation()
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[ 
        styles.item,
        renderItemStyle, 
        selectedItem === item && styles.isSelected // 선택된 아이템인 경우 스타일을 적용
      ]}
      onPress={() => selectItem(item)}
    >
      <Text style={[styles.textstyle, selectedItem === item && styles.activeTextStyle]}>{t(`onboarding.${item}`)}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ECE9E9',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  isSelected: {
    backgroundColor: '#5782F1',
    borderColor: '#5782F1',
  },
  textstyle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    color: '#868686',
  },
  activeTextStyle: {
    color: 'white', // 활성화된 아이템의 텍스트 색상 변경
  },
  separator: {
    height: 16,
  },
});

export default SelectableList;