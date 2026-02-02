import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useStyleQueries} from 'react-native-style-queries';
import ButtonGroup from '../components/ButtonGroup';
import CenterColumn from '../components/CenterColumn';
import ErrorMessage from '../components/ErrorMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import ScreenBackground from '../components/ScreenBackground';
import {useCategories} from '../data/categories';
import logError from '../logError';
import sharedStyleQueries from '../sharedStyleQueries';
import sharedStyles from '../sharedStyles';
import useIsMounted from '../utils/useIsMounted';

export default function CategoryDetail() {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const responsiveStyles = useStyleQueries(sharedStyleQueries);
  const isMounted = useIsMounted();

  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const categoryClient = useCategories();

  const isNewCategory = id === 'new';

  useEffect(() => {
    if (isMounted.current && !isNewCategory) {
      categoryClient
        .find({id})
        .then(response => {
          if (isMounted.current) {
            const returnedCategory = response.data;
            setCategory(returnedCategory);
            setName(returnedCategory.attributes.name);
          }
        })
        .catch(logError);
    }
  }, [id, isNewCategory, categoryClient, isMounted]);

  const goBack = () => router.push('/categories');

  async function handleSave() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const attributes = {name};
      if (isNewCategory) {
        await categoryClient.create({attributes});
      } else {
        await categoryClient.update({id, attributes});
      }
      goBack();
    } catch (e) {
      setIsLoading(false);
      setErrorMessage('An error occurred saving the category.');
      logError(e);
    }
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await categoryClient.delete({id});
      goBack();
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred deleting the category.');
      logError(error);
    }
  }

  function contents() {
    if (!isNewCategory && !category) {
      return <LoadingIndicator />;
    }

    return (
      <View style={sharedStyles.bodyPadding}>
        <TextInput
          testID="name-field"
          label="Category name"
          accessibilityLabel="Category name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          multiline
          style={styles.nameInput}
        />
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <ButtonGroup>
          <Button
            testID="cancel-button"
            mode="outlined"
            onPress={goBack}
            style={responsiveStyles.button}
            disabled={isLoading}
            accessibilityLabel="Cancel"
          >
            Cancel
          </Button>
          {!isNewCategory && (
            <Button
              testID="delete-button"
              mode="outlined"
              onPress={handleDelete}
              style={responsiveStyles.button}
              disabled={isLoading}
              accessibilityLabel="Delete"
            >
              Delete
            </Button>
          )}
          <Button
            testID="save-button"
            mode="contained"
            icon="content-save"
            onPress={handleSave}
            style={responsiveStyles.button}
            disabled={isLoading}
            accessibilityLabel="Save"
          >
            Save
          </Button>
        </ButtonGroup>
      </View>
    );
  }

  return (
    <ScreenBackground>
      <CenterColumn>{contents()}</CenterColumn>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    fontSize: 20,
  },
});
