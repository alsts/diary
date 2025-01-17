import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, List, Surface, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { addEntryAsync } from '../redux/entriesSlice';
import { theme } from '../styles/theme';

type NewEntryScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'NewEntry'>;
};

const categories = ['Personal', 'Work', 'Travel', 'Family', 'Other'];

const NewEntryScreen = ({ navigation }: NewEntryScreenProps) => {
	const dispatch = useDispatch();
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('Personal');
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [showCategories, setShowCategories] = useState(false);
	const [saving, setSaving] = useState(false);

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to make this work!');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
		}
	};

	const handleSave = async () => {
		if (content.trim()) {
			setSaving(true);
			try {
				await dispatch(addEntryAsync({
					id: Date.now().toString(),
					date: new Date().toISOString(),
					content,
					category,
					imageUri: imageUri || undefined,
				})).unwrap();
				navigation.goBack();
			} catch (error) {
				alert('Failed to save entry');
			} finally {
				setSaving(false);
			}
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Surface style={styles.surface}>
				<TextInput
					label="What's on your mind?"
					value={content}
					onChangeText={setContent}
					multiline
					numberOfLines={6}
					mode="outlined"
					style={styles.input}
				/>
				<HelperText type="error" visible={!content.trim()}>
					Entry content cannot be empty
				</HelperText>

				<Card style={styles.categoryCard}>
					<Card.Content>
						<Text variant="titleMedium" style={styles.sectionTitle}>Category</Text>
						<Button
							mode="outlined"
							onPress={() => setShowCategories(!showCategories)}
							icon={showCategories ? 'chevron-up' : 'chevron-down'}
							style={styles.categoryButton}
						>
							{category}
						</Button>

						{showCategories && (
							<View style={styles.categoriesList}>
								{categories.map((cat) => (
									<List.Item
										key={cat}
										title={cat}
										onPress={() => {
											setCategory(cat);
											setShowCategories(false);
										}}
										left={props => <List.Icon {...props} icon="folder" color={theme.colors.primary} />}
										style={[
											styles.categoryItem,
											cat === category && styles.selectedCategory
										]}
									/>
								))}
							</View>
						)}
					</Card.Content>
				</Card>

				<Card style={styles.imageCard}>
					<Card.Content>
						<Text variant="titleMedium" style={styles.sectionTitle}>Image</Text>
						<Button
							icon="camera"
							mode="contained"
							onPress={pickImage}
							style={styles.imageButton}
						>
							Add Image
						</Button>

						{imageUri && (
							<View style={styles.imagePreviewContainer}>
								<Image source={{ uri: imageUri }} style={styles.imagePreview} />
								<Button
									icon="close"
									mode="contained-tonal"
									onPress={() => setImageUri(null)}
									style={styles.removeImageButton}
								>
									Remove
								</Button>
							</View>
						)}
					</Card.Content>
				</Card>

				<Button
					mode="contained"
					onPress={handleSave}
					style={styles.saveButton}
					disabled={!content.trim() || saving}
					loading={saving}
				>
					Save Entry
				</Button>
			</Surface>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	surface: {
		margin: theme.spacing.md,
		padding: theme.spacing.md,
		borderRadius: theme.roundness,
		backgroundColor: theme.colors.surface,
		elevation: theme.elevation.small,
	},
	input: {
		backgroundColor: 'transparent',
	},
	sectionTitle: {
		marginBottom: theme.spacing.sm,
		color: theme.colors.primary,
	},
	categoryCard: {
		marginTop: theme.spacing.md,
		backgroundColor: theme.colors.surface,
		elevation: 0,
	},
	categoryButton: {
		marginBottom: theme.spacing.sm,
	},
	categoriesList: {
		backgroundColor: theme.colors.background,
		borderRadius: theme.roundness,
		overflow: 'hidden',
	},
	categoryItem: {
		paddingVertical: theme.spacing.xs,
	},
	selectedCategory: {
		backgroundColor: `${theme.colors.primary}10`,
	},
	imageCard: {
		marginTop: theme.spacing.md,
		backgroundColor: theme.colors.surface,
		elevation: 0,
	},
	imageButton: {
		marginBottom: theme.spacing.sm,
	},
	imagePreviewContainer: {
		alignItems: 'center',
	},
	imagePreview: {
		width: '100%',
		height: 200,
		borderRadius: theme.roundness,
		marginVertical: theme.spacing.sm,
	},
	removeImageButton: {
		marginTop: theme.spacing.sm,
	},
	saveButton: {
		marginTop: theme.spacing.lg,
	},
});

export default NewEntryScreen; 