import React from "react";
import { Modal, View, Text, TouchableOpacity} from "react-native";

const ChatRoomInfoModal = ({ modalVisible, setModalVisible, openLeaveChatRoomModal, selectedChatRoom, leaveChatRoom, cancel}) => {
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
          <TouchableOpacity style={{flex:3}}
            onPress={() => setModalVisible(false)}/>
          <View style={{
            borderTopRightRadius: 10,
            borderTopLeftRadius:10,
            flex:1,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{flex:6, justifyContent: 'center', borderColor: '#e3e3e3', borderBottomWidth:0.7}}>
              <Text style={{fontFamily:'Pretendard-SemiBold', fontSize:16, color:'#000', paddingLeft:15}}>{selectedChatRoom.title}</Text>
            </View>
            <View style={{flex:0.5}}/>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => {
                openLeaveChatRoomModal(true)
                setModalVisible(false)
                }}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#EC3232', paddingLeft:15}}>{leaveChatRoom}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#000', paddingLeft:15}}>{cancel}</Text>
            </TouchableOpacity>
            <View style={{flex:1}}/>
          </View>
        </View>
      </Modal>
  );
};

export default ChatRoomInfoModal;