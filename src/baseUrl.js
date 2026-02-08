import {Platform} from 'react-native';

const LOCAL_IP = null;
// ifconfig | grep "inet "
// const LOCAL_IP = '10.0.1.52';

function getBaseUrl() {
  if (LOCAL_IP) {
    return `http://${LOCAL_IP}:3000`;
  }

  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    } else {
      return 'http://localhost:3000';
    }
  } else {
    return 'https://beta.api.surelytodo.com';
  }
}

const baseUrl = getBaseUrl();

export default baseUrl;
