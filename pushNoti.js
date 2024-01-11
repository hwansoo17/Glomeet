import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';

const displayNotification = async message => {
    const channelAnnouncement = await notifee.createChannel({
        id: 'default',
        name: '글로밋',
        importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
            channelId: channelAnnouncement,
            smallIcon: 'ic_launcher',
        },
    });
};

export default {
    displayNoti: remoteMessage => displayNotification(remoteMessage),
};