import React from "react";
import { Modal, View, Text, TouchableOpacity} from "react-native";

const BlockModal = ({ modalVisible, setModalVisible, blockNotice, cancel, toBlock, blockUser}) => {
  return (
<Modal
  animationType="fade"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false);
  }}
>
  <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
    <TouchableOpacity style={{flex:6}}
      onPress={() => setModalVisible(false)}/>
    <View style={{flex:1, backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
      <View style={{flex:1}}/>
      <Text style={{fontFamily:'Pretendard-Medium', fontSize:18, color:'#000', textAlign:'center'}}>{blockNotice}</Text>
      <View style={{flex:2}}/>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:4}}/>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {setModalVisible(false);}}
        >
          <Text style={{fontFamily:'Pretendard-Medium', fontSize:16, color:'#6B7079', paddingLeft:15}}>{cancel}</Text>
        </TouchableOpacity>
        <View style={{flex:1}}/>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {setModalVisible(false); blockUser();}}
        >
          <Text style={{fontFamily:'Pretendard-Medium', fontSize:16, color:'#EC3232', paddingLeft:15}}>{toBlock}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}/>
    </View>
  </View>
</Modal>
  );
};

export default BlockModal;