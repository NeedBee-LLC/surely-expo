import {useRouter} from 'expo-router';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useStyleQueries} from 'react-native-style-queries';
import ButtonGroup from '../../components/ButtonGroup';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import ScreenBackground from '../../components/ScreenBackground';
import {useUsers} from '../../data/users';
import sharedStyleQueries from '../../sharedStyleQueries';
import sharedStyles from '../../sharedStyles';

export default function SignUpForm({onSignUpSuccess}) {
  const responsiveStyles = useStyleQueries(sharedStyleQueries);
  const router = useRouter();
  const userClient = useUsers();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!email) {
      setError('Email is required.');
      return false;
    }
    if (!password) {
      setError('Password is required.');
      return false;
    }
    if (!passwordConfirmation) {
      setError('Password confirmation is required.');
      return false;
    } else if (passwordConfirmation !== password) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  }

  function handleSignUpSuccess() {
    setSuccess(true);
  }

  function handleSignUp() {
    if (!validate()) {
      return;
    }

    userClient
      .create({attributes: {email, password}})
      .then(handleSignUpSuccess)
      .catch(errorResponse => {
        if (errorResponse?.data?.errors?.[0]?.detail) {
          setError(errorResponse?.data?.errors?.[0]?.detail);
        } else if (errorResponse?.message) {
          setError(errorResponse?.message);
        } else {
          setError('An error occurred. Please try again.');
          console.log(errorResponse);
        }
      });
  }

  function contents() {
    if (success) {
      return (
        <>
          <Text testID="sign-up-successful-message">
            Sign up successful. Sign in with the email and password you used to
            sign up.
          </Text>
          <ButtonGroup>
            <Button
              mode="contained"
              testID="go-to-sign-in-button"
              onPress={() => router.push('/signin')}
              style={responsiveStyles.button}
            >
              Go to sign in
            </Button>
          </ButtonGroup>
        </>
      );
    } else {
      return (
        <>
          <TextInput
            testID="email-field"
            label="Email"
            accessibilityLabel="Email"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={handleSignUp}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            testID="password-field"
            label="Password"
            accessibilityLabel="Password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleSignUp}
            secureTextEntry
          />
          <TextInput
            testID="password-confirmation-field"
            label="Confirm password"
            accessibilityLabel="Confirm password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            onSubmitEditing={handleSignUp}
            secureTextEntry
          />
          <ErrorMessage>{error}</ErrorMessage>
          <ButtonGroup>
            <Button
              mode="outlined"
              testID="cancel-button"
              onPress={() => router.push('/signin')}
              style={responsiveStyles.button}
              accessibilityLabel="Cancel"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              testID="submit-sign-up-button"
              onPress={handleSignUp}
              style={responsiveStyles.button}
              accessibilityLabel="Sign up"
            >
              Sign up
            </Button>
          </ButtonGroup>
          <Text style={styles.freeMessage}>
            Accounts are free for now. If Surely gets popular we may need to
            make a change then 😃
          </Text>
        </>
      );
    }
  }

  return (
    <ScreenBackground style={sharedStyles.bodyPadding}>
      <CenterColumn>{contents()}</CenterColumn>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  freeMessage: {
    lineHeight: 25,
    marginTop: 20,
  },
});
