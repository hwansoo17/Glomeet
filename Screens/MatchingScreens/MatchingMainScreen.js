import React from "react";
import {View, Text, TouchableOpacity,StyleSheet,Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MatchingMainScreen = ({navigation}) => {
    
    return (
        <View style={styles.backgroundContainer}>
            <Image
                source={require('../../assets/advertisement.png')}
                style={styles.noticeImage} 
                accessibilityRole="image"
                accessibilityLabel="알림"
                resizeMode="contain"
            />
            <Text style={styles.matchingTitle}>오늘의 <Text style ={{color:"#5782F1"}}>매칭</Text>을 시작해보세요!</Text>
            <Text style={styles.matchingSubtitle}>오늘은 또 어떤 새로운 친구를 만날까?</Text>
            <Image
                source={require('../../assets/character.png')}
                style={styles.characterImage} 
                accessibilityRole="image"
                accessibilityLabel="캐릭터"
                resizeMode="contain"
            />
            <View style={styles.pointBox}>
                <Text style={styles.pointTitle}>보유 포인트</Text>
                <Text style={styles.pointAmount}>1,400P</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('MatchingFilter')} style={styles.matchingButton}>
                <Text style={styles.matchingButtonText}>매칭하러 가기</Text>
            </TouchableOpacity>
            </View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: "80%", 
        marginBottom: '10%', 
        paddingHorizontal: '5%',

    },
    noticeImage: {
        width: '90%', 
        marginBottom: '5%', 
        marginLeft: 20,
    },
    characterImage: {
        width: '90%',
        marginTop: "5%",
        marginBottom: '15%', 
    },
    matchingTitle: {
        fontFamily: 'Pretendard',
        fontWeight: '700',
        fontSize: 26,
        lineHeight: 31,
        textAlign: 'center',
        marginTop: '10%', 
        marginBottom: '3%', 
        color:'#000000',
    },
    matchingSubtitle: {
        fontFamily: 'Pretendard',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'center',
        color: '#B4B4B4',
        marginBottom: '5%', 
    },
    matchingButton: {
        width: '70%', 
        height: 50, 
        backgroundColor: '#5782F1',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '10%',
        marginBottom: '0%', 
    },
    matchingButtonText: {
        fontFamily: 'Pretendard',
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 21,
        color: '#FFFFFF',
    },
    pointBox: {
        position: 'absolute',
        width: '45%', 
        backgroundColor: '#FFFFFF',
        borderColor: '#D3D3D3',
        borderWidth: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '15%', 
    },
    pointTitle: {
        fontFamily: 'Pretendard',
        fontWeight: '500',
        fontSize: 11,
        lineHeight: 13,
        letterSpacing: 0.0703846,
        color: '#949698',
        marginBottom: '3%', 
        marginTop: '3%', 
    },
    pointAmount: {
        fontFamily: 'Pretendard',
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
        letterSpacing: 0.0703846,
        color: '#6E87E5',
        marginTop: '3%',
        marginBottom: '3%', 
    }
    
});



export default MatchingMainScreen;