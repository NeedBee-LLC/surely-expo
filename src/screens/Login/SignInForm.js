import {useRouter} from 'expo-router';
import {StyleSheet} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {useStyleQueries} from 'react-native-style-queries';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import ButtonGroup from '../../components/ButtonGroup';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import ScreenBackground from '../../components/ScreenBackground';
import loginHttpClient from '../../data/loginHttpClient';
import {useToken} from '../../data/token';
import sharedStyleQueries from '../../sharedStyleQueries';
import sharedStyles from '../../sharedStyles';

export default function SignInForm() {
  const {setToken} = useToken();
  const router = useRouter();
  const responsiveStyles = useStyleQueries(sharedStyleQueries);
  const onLogIn = ({username, password}) =>
    oauthLogin({
      httpClient: loginHttpClient,
      username,
      password,
    }).then(setToken);
  const {username, password, error, handleChange, handleLogIn} =
    useLoginForm(onLogIn);

  return (
    <ScreenBackground style={sharedStyles.bodyPadding}>
      <CenterColumn>
        <Title style={styles.tagline}>
          A focused todo app giving you only what you need to get your todos
          done.
        </Title>
        <TextInput
          testID="email-field"
          label="Email"
          accessibilityLabel="Email"
          value={username}
          onChangeText={handleChange('username')}
          onSubmitEditing={handleLogIn}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          testID="password-field"
          label="Password"
          accessibilityLabel="Password"
          value={password}
          onChangeText={handleChange('password')}
          onSubmitEditing={handleLogIn}
          secureTextEntry
        />
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonGroup>
          <Button
            mode="outlined"
            testID="sign-up-button"
            onPress={() => router.push('/signup')}
            style={responsiveStyles.button}
            accessibilityLabel="Sign up"
          >
            Sign up
          </Button>
          <Button
            mode="contained"
            testID="sign-in-button"
            onPress={handleLogIn}
            style={responsiveStyles.button}
            accessibilityLabel="Sign in"
          >
            Sign in
          </Button>
        </ButtonGroup>
      </CenterColumn>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  tagline: {
    textAlign: 'center',
    marginTop: 20,
  },
});
