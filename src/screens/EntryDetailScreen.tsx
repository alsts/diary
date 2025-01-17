import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { deleteEntryAsync, updateEntryAsync } from '../redux/entriesSlice';
import { RootState } from '../redux/store';

type EntryDetailScreenProps = {
	navigation: NativeStackNavigationProp<RootStackParamList, 'EntryDetail'>;
	route: RouteProp<RootStackParamList, 'EntryDetail'>;
};

const EntryDetailScreen = ({ navigation, route }: EntryDetailScreenProps) => {
	const dispatch = useDispatch();
	const entry = useSelector((state: RootState) =>
		state.entries.list.find(e => e.id === route.params.entryId)
	);

	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(entry?.content || '');
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	if (!entry) {
		return (
			<View style={styles.container}>
				<Text>Entry not found</Text>
			</View>
		);
	}

	const handleSave = async () => {
		if (editedContent.trim()) {
			setSaving(true);
			try {
				await dispatch(updateEntryAsync({
					...entry,
					content: editedContent,
				})).unwrap();
				setIsEditing(false);
			} catch (error) {
				alert('Failed to update entry');
			} finally {
				setSaving(false);
			}
		}
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await dispatch(deleteEntryAsync(entry.id)).unwrap();
			navigation.goBack();
		} catch (error) {
			alert('Failed to delete entry');
			setDeleting(false);
		}
	};

	if (deleting) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>Deleting entry...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.date}>
					{new Date(entry.date).toLocaleDateString()}
				</Text>
				<Text style={styles.category}>{entry.category}</Text>
			</View>

			{isEditing ? (
				<TextInput
					value={editedContent}
					onChangeText={setEditedContent}
					multiline
					style={styles.input}
				/>
			) : (
				<Text style={styles.content}>{entry.content}</Text>
			)}

			{entry.imageUri && (
				<Image source={{ uri: entry.imageUri }} style={styles.image} />
			)}

			<View style={styles.actions}>
				{isEditing ? (
					<>
						<Button
							mode="contained"
							onPress={handleSave}
							loading={saving}
							disabled={saving}
						>
							Save
						</Button>
						<Button
							mode="outlined"
							onPress={() => {
								setIsEditing(false);
								setEditedContent(entry.content);
							}}
							disabled={saving}
						>
							Cancel
						</Button>
					</>
				) : (
					<>
						<IconButton
							icon="pencil"
							size={24}
							onPress={() => setIsEditing(true)}
						/>
						<IconButton
							icon="delete"
							size={24}
							onPress={handleDelete}
						/>
					</>
				)}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	date: {
		fontSize: 16,
		color: '#666',
	},
	category: {
		fontSize: 16,
		color: '#666',
		fontStyle: 'italic',
	},
	content: {
		fontSize: 18,
		lineHeight: 24,
		marginBottom: 16,
	},
	input: {
		backgroundColor: 'transparent',
		marginBottom: 16,
	},
	image: {
		width: '100%',
		height: 200,
		borderRadius: 8,
		marginBottom: 16,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 16,
	},
});

export default EntryDetailScreen; 