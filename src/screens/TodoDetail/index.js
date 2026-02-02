import {useLocalSearchParams, useRouter} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingIndicator from '../../components/LoadingIndicator';
import ScreenBackground from '../../components/ScreenBackground';
import {useTodos} from '../../data/todos';
import sharedStyles from '../../sharedStyles';
import useIsMounted from '../../utils/useIsMounted';
import DetailDisplay from './DetailDisplay';
import DetailForm from './DetailForm';

export default function TodoDetail() {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const isMounted = useIsMounted();

  const todoClient = useTodos();

  const [todo, setTodo] = useState(null);
  const [category, setCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const storeResponse = useCallback(
    response => {
      if (isMounted.current) {
        setTodo(response.data);
        setCategory(response.included?.[0]);
      }
    },
    [isMounted],
  );

  const loadTodo = useCallback(
    async function () {
      try {
        setErrorMessage(null);
        const response = await todoClient.find({
          id,
          options: {include: 'category'},
        });
        storeResponse(response);
      } catch (error) {
        setErrorMessage('An error occurred loading the todo.');
      }
    },
    [id, todoClient, storeResponse],
  );

  useEffect(() => {
    if (isMounted.current) {
      loadTodo();
    }
  }, [isMounted, loadTodo]);

  const handleSave = ({attributes, relationships}) =>
    todoClient
      .update({
        id,
        attributes,
        relationships,
        options: {include: 'category'},
      })
      .then(storeResponse)
      .then(() => {
        if (isMounted.current) {
          setIsEditing(false);
        }
      });

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  function contents() {
    if (errorMessage) {
      return (
        <View style={sharedStyles.bodyPadding}>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <Button testID="retry-button" mode="contained" onPress={loadTodo}>
            Retry
          </Button>
        </View>
      );
    }

    if (!todo) {
      return <LoadingIndicator />;
    }

    if (isEditing) {
      return (
        <DetailForm
          todo={todo}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      );
    } else {
      return (
        <DetailDisplay
          todo={todo}
          category={category}
          onEdit={() => setIsEditing(true)}
          onUpdate={setTodo}
          onGoBack={goBack}
        />
      );
    }
  }

  return (
    <ScreenBackground>
      <CenterColumn>{contents()}</CenterColumn>
    </ScreenBackground>
  );
}
