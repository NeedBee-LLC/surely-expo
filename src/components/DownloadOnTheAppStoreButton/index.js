import {Image, Linking, Pressable, StyleSheet} from 'react-native';
import {APP_STORE_URL} from '../../constants';

export default function DownloadOnTheAppStoreButton() {
  return (
    <Pressable
      accessibilityLabel="Download on the App Store"
      accessibilityHint="Opens the App Store listing"
      accessibilityRole="button"
      onPress={() => Linking.openURL(APP_STORE_URL)}
    >
      <Image
        accessible={false}
        source={require('./Download_on_the_App_Store_Badge.png')}
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 40,
  },
});
