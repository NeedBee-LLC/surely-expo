import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, Text, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import sharedStyles from '../../../sharedStyles';
import Actions from './Actions';
import EventLog from './EventLog';

export default function DetailDisplay({
  todo,
  category,
  onEdit,
  onUpdate,
  onGoBack,
}) {
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={styles.safeAreaView}
    >
      <ScrollView contentContainerStyle={sharedStyles.bodyPadding}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${todo.attributes.name}`}
            style={styles.title}
          >
            <Title>{todo.attributes.name}</Title>
          </Pressable>
          <IconButton
            testID="edit-button"
            icon="pencil"
            accessibilityLabel="Edit"
            onPress={onEdit}
          />
        </View>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit todo details"
        >
          {todo.attributes.notes ? (
            <Text style={styles.sectionSpacing}>{todo.attributes.notes}</Text>
          ) : null}
          {category ? (
            <Text style={styles.sectionSpacing}>
              Category: {category.attributes.name ?? 'none'}
            </Text>
          ) : null}
        </Pressable>
        <EventLog todo={todo} style={styles.sectionSpacing} />
        <Actions todo={todo} onUpdate={onUpdate} onGoBack={onGoBack} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  titleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  sectionSpacing: {
    marginTop: 10,
  },
});
