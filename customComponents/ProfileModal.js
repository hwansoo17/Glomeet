import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";


const ProfileModal = ({ modalVisible, setModalVisible, selectedChatUser, openBlockModal, openReportModal, blockText, reportText }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity style={{ flex: 2 }} onPress={() => setModalVisible(false)} />
        <View style={{ flex: 3, flexDirection: 'row' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
          <View style={{
            flex: 7,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderRadius: 10,
            padding: 20,
            alignItems: 'center'
          }}>
            <View style={{ flex: 0.8 }} />
            <View style={{ width: 160, height: 160, borderRadius: 20, overflow: 'hidden', backgroundColor: 'grey' }}>
              <Image src={selectedChatUser.imageAddress} style={{ width: 160, height: 160 }} />
            </View>
            <View style={{ flex: 1 }} />
            <Text style={{ fontFamily: "GmarketSansTTFBold", fontSize: 28, color: '#000' }}>
              {selectedChatUser.senderNickName}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  openBlockModal(true);
                }}
              >
                <Text style={{ fontFamily: "Pretendard-SemiBold", fontSize: 14, color: '#EC3232' }}>
                  {blockText}
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  openReportModal(true);
                }}
              >
                <Text style={{ fontFamily: "Pretendard-SemiBold", fontSize: 14, color: '#EC3232' }}>
                  {reportText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
        </View>
        <TouchableOpacity style={{ flex: 2 }} onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
};

export default ProfileModal;
