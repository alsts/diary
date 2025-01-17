import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, HelperText, List, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { addEntryAsync } from '../redux/entriesSlice';

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
		<View style={styles.container}>
			<TextInput
				label="What's on your mind?"
				value={content}
				onChangeText={setContent}
				multiline
				style={styles.input}
			/>
			<HelperText type="error" visible={!content.trim()}>
				Entry content cannot be empty
			</HelperText>

			<Button
				mode="outlined"
				onPress={() => setShowCategories(!showCategories)}
				style={styles.categoryButton}
			>
				Category: {category}
			</Button>

			{showCategories && (
				<List.Section>
					{categories.map((cat) => (
						<List.Item
							key={cat}
							title={cat}
							onPress={() => {
								setCategory(cat);
								setShowCategories(false);
							}}
							left={props => <List.Icon {...props} icon="folder" />}
						/>
					))}
				</List.Section>
			)}

			<Button
				icon="camera"
				mode="contained"
				onPress={pickImage}
				style={styles.imageButton}
			>
				Add Image
			</Button>

			{imageUri && (
				<Image source={{ uri: imageUri }} style={styles.image} />
			)}

			<Button
				mode="contained"
				onPress={handleSave}
				style={styles.saveButton}
				disabled={!content.trim() || saving}
				loading={saving}
			>
				Save Entry
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	input: {
		backgroundColor: 'transparent',
	},
	categoryButton: {
		marginVertical: 8,
	},
	imageButton: {
		marginVertical: 8,
	},
	image: {
		width: '100%',
		height: 200,
		marginVertical: 8,
		borderRadius: 8,
	},
	saveButton: {
		marginTop: 16,
	},
});

export default NewEntryScreen; 