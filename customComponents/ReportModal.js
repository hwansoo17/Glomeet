import React from "react";
import { Modal, View, Text, TouchableOpacity, InputAccessoryView, TextInput } from "react-native";


const ReportModal = ({ modalVisible, setModalVisible, reportComment, setReportComment, report, reportEnabled, reportReason, reportNotice, toReport}) => {
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setReportComment('')
        }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity
            style={{flex:1}}
            onPress={() => setModalVisible(false)}/>
          <View style={{minHeight:200, flexDirection: 'row'}}>
          {Platform.OS === 'ios' ? (
            <InputAccessoryView style={{ flexDirection: "row"}}>
              <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{reportReason}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{reportNotice}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex:1}}/>
                  <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
                </View>
                <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                  <TextInput
                    value={reportComment}
                    multiline
                    onChangeText={setReportComment}
                    maxLength={255}/>
                </View>
                <View style={{flex:1}}/>
                <View style={{ flexDirection:"row"}}>
                  <View style={{flex:1}}/>
                  <TouchableOpacity
                    onPress={() => {setModalVisible(false); report()}}
                    disabled={!reportEnabled}
                  >
                    <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{toReport}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </InputAccessoryView>
          ) : (
            <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{reportReason}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{reportNotice}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex:1}}/>
                <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
              </View>
              <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                <TextInput
                  value={reportComment}
                  multiline
                  onChangeText={setReportComment}
                  maxLength={255}/>
              </View>
              <View style={{flex:1}}/>
              <View style={{ flexDirection:"row"}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {setModalVisible(false); report()}}
                  disabled={!reportEnabled}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{toReport}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) }
          </View>
        </View>
      </Modal>
  );
};

export default ReportModal;