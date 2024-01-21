import notifee, {AndroidImportance} from '@notifee/react-native';

const displayNotification = async (title, body) => {
    const channelAnnouncement = await notifee.createChannel({
        id: 'default',
        name: '글로밋',
        importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
        title: title,
        body: body,
        android: {
            channelId: channelAnnouncement,
            smallIcon: 'ic_launcher',
        },
    });
};

export default {
    displayNoti: (title, body) => displayNotification(title, body),
};