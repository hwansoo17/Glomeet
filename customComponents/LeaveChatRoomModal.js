import React from "react";
import { Modal, View, Text, TouchableOpacity, Image} from "react-native";

const LeaveChatRoomModal = ({ modalVisible, setModalVisible, selectedChatRoom, leaveChatRoom, askLeaveChatRoom, cancel, leave}) => {
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
      <TouchableOpacity 
        style={{flex:5}}
        onPress={() => setModalVisible(false)}/>
      <View style={{flex:3, flexDirection: 'row'}}>
        <TouchableOpacity 
        style={{flex:1}}
        onPress={() => setModalVisible(false)}
        />
        <View style={{flex:7, backgroundColor: "white",shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{ backgroundColor: 'grey', width:48, height:48, borderRadius: 24, marginRight:10}}>
              <Image 
                src={selectedChatRoom.imageAddress}
                style={{width:48, height:48, borderRadius: 24}}/>
            </View>
            <View>
              <Text style= {{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#000'}} numberOfLines={1} ellipsizeMode="tail">{selectedChatRoom.title}</Text>
            </View>
          </View>
          <View style={{flex:1}}/>
          <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079'}}>{askLeaveChatRoom}</Text>
          <View style={{flex:1}}/>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={{flex:2}}/>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
            >
              <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#6B7079'}}>{cancel}</Text>
            </TouchableOpacity>
            <View style={{flex:1}}/>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false)
                leaveChatRoom(selectedChatRoom)
              }}
            >
              <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 16, color: '#EC3232'}}>{leave}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
        style={{flex:1}}
        onPress={() => setModalVisible(false)}
        />
      </View>
      <TouchableOpacity 
        style={{flex:5}}
        onPress={() => setModalVisible(false)}/>
    </View>
  </Modal>
  );
};

export default LeaveChatRoomModal;