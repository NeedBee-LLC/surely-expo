import {useRouter} from 'expo-router';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {useToken} from '../../data/token';
import SignInForm from './SignInForm';

jest.mock('../../data/token', () => ({useToken: jest.fn()}));
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('SignInForm', () => {
  const email = 'example@example.com';
  const password = 'password';
  const testToken = 'test_token';

  it('sets the token upon successful login', async () => {
    const mockedServer = nock('http://localhost:3000')
      .post('/oauth/token', {
        grant_type: 'password',
        username: email,
        password,
      })
      .reply(200, {access_token: testToken});

    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    const setToken = jest.fn();
    useToken.mockReturnValue({setToken});

    render(<SignInForm />);

    fireEvent.changeText(screen.getByLabelText('Email'), email);
    fireEvent.changeText(screen.getByLabelText('Password'), password);
    fireEvent.press(screen.getByText('Sign in'));

    await waitFor(() => expect(setToken).toHaveBeenCalledWith(testToken));

    mockedServer.done();
  });
});
