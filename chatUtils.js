import AsyncStorage from "@react-native-async-storage/async-storage";

  export const formatDate = (sendAt) => {
    const messageDate = new Date(sendAt);
    const today = new Date();
    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();
    if (isToday) {
      // 12시간 기준으로 오전/오후 포맷으로 변경
      let hours = messageDate.getHours();
      const minutes = messageDate.getMinutes();
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0시는 12로 표시
      const strTime = `${ampm} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      return strTime;
    } else {
      // 날짜만 표시
      return `${messageDate.getFullYear()}-${messageDate.getMonth() + 1}-${messageDate.getDate()}`;
    }
  };

  export const getChatRoomsLastLeftAtMap = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const chatRoomKeys = allKeys.filter(key => key.startsWith('lastRead;'));

      const chatRoomsLastLeftAtMap = {};

      await Promise.all(chatRoomKeys.map(async key => {
        const roomId = key.substring('lastRead;'.length);
        const leftTime = await AsyncStorage.getItem(key);
        chatRoomsLastLeftAtMap[roomId] = leftTime;
      }));
      return chatRoomsLastLeftAtMap;
    } catch (error) {
      return {};
    }
  };