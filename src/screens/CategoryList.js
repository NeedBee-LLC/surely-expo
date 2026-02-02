import {useFocusEffect} from 'expo-router';
import {useRouter} from 'expo-router';
import sortBy from 'lodash/sortBy';
import {useCallback, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {Button, IconButton, List} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CenterColumn from '../components/CenterColumn';
import ErrorMessage from '../components/ErrorMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import NoTodosMessage from '../components/NoTodosMessage';
import ScreenBackground from '../components/ScreenBackground';
import {useCategories} from '../data/categories';
import logError from '../logError';
import {
  arrayWithItemMovedDownward,
  arrayWithItemMovedUpward,
  elementsWithIndex,
} from '../utils/array';

export default function CategoryList() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [categories, setCategories] = useState(null);
  const categoryClient = useCategories();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onPressCategory = category => router.push(`/categories/${category.id}`);

  const handleAdd = () => router.push('/categories/new');

  const loadFromServer = useCallback(async () => {
    setErrorMessage(null);
    try {
      const {data} = await categoryClient.all();
      setCategories(sortBy(data, 'attributes.sort-order'));
      return data;
    } catch (error) {
      logError(error);
      setErrorMessage('An error occurred while loading todos.');
    }
  }, [categoryClient]);

  useFocusEffect(
    useCallback(() => {
      loadFromServer().then(() => {
        setShowLoadingIndicator(false);
      });
    }, [loadFromServer]),
  );

  async function reloadFromPull() {
    setIsRefreshing(true);
    await loadFromServer();
    setIsRefreshing(false);
  }

  async function reloadFromButton() {
    setShowLoadingIndicator(true);
    const newCategories = await loadFromServer();
    setShowLoadingIndicator(false);
    if (newCategories.length > 0) {
      flatListRef.current.scrollToIndex({index: 0});
    }
  }

  async function moveUpward(categoryToMove) {
    setErrorMessage(null);
    const categoriesAfterMove = arrayWithItemMovedUpward(
      categories,
      categoryToMove,
    );
    try {
      await updateCategorySortOrder(categoriesAfterMove);
    } catch (error) {
      setErrorMessage('An error occurred moving category up.');
    }
  }

  async function moveDownward(categoryToMove) {
    setErrorMessage(null);
    const categoriesAfterMove = arrayWithItemMovedDownward(
      categories,
      categoryToMove,
    );
    try {
      await updateCategorySortOrder(categoriesAfterMove);
    } catch (error) {
      setErrorMessage('An error occurred moving category down.');
    }
  }

  async function updateCategorySortOrder(sortedCategories) {
    const categoriesWithIndex = elementsWithIndex(sortedCategories);
    for (const [category, sortOrder] of categoriesWithIndex) {
      if (category.sortOrder !== sortOrder) {
        await categoryClient.update({
          id: category.id,
          attributes: {'sort-order': sortOrder},
        });
      }
    }
    return loadFromServer();
  }

  function contents() {
    if (categories?.length === 0) {
      return <NoTodosMessage>No categories yet</NoTodosMessage>;
    } else {
      return (
        <View>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <FlatList
            testID="category-list"
            ref={flatListRef}
            data={categories}
            keyExtractor={todo => todo.id}
            onRefresh={reloadFromPull}
            refreshing={isRefreshing}
            contentContainerStyle={{paddingBottom: insets.bottom}}
            renderItem={({item: category}) => (
              <List.Item
                key={category.id}
                title={category.attributes.name}
                accessibilityRole="button"
                accessibilityLabel={category.attributes.name}
                onPress={() => onPressCategory(category)}
                right={() => (
                  <>
                    <IconButton
                      testID="move-up-button"
                      icon="arrow-up"
                      accessibilityLabel="Move up"
                      onPress={() => moveUpward(category)}
                    />
                    <IconButton
                      testID="move-down-button"
                      icon="arrow-down"
                      accessibilityLabel="Move down"
                      onPress={() => moveDownward(category)}
                    />
                  </>
                )}
              />
            )}
          />
        </View>
      );
    }
  }

  return (
    <ScreenBackground>
      <CenterColumn>
        <View style={styles.buttonContainer}>
          {Platform.OS === 'web' && (
            <Button
              mode="outlined"
              style={styles.reloadButton}
              onPress={reloadFromButton}
            >
              Reload
            </Button>
          )}
          <Button
            testID="add-button"
            mode="outlined"
            icon="plus"
            onPress={handleAdd}
            accessibilityLabel="Add"
          >
            Add
          </Button>
        </View>
        {showLoadingIndicator && <LoadingIndicator />}
        {contents()}
      </CenterColumn>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 15,
  },
  reloadButton: {
    marginBottom: 15,
  },
});
