import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { deleteEntryAsync, updateEntryAsync } from '../redux/entriesSlice';
import { RootState } from '../redux/store';
import { theme } from '../styles/theme';

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
			<View style={styles.centered}>
				<Text variant="titleMedium">Entry not found</Text>
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
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Deleting entry...</Text>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollContent}
		>
			<View style={styles.cardContainer}>
				<Card style={styles.card}>
					<Card.Content>
						<View style={styles.header}>
							<View style={styles.headerInfo}>
								<Text variant="titleLarge" style={styles.date}>
									{new Date(entry.date).toLocaleDateString()}
								</Text>
								<Text variant="labelSmall" style={styles.category}>
									{entry.category}
								</Text>
							</View>
							<View style={styles.actions}>
								{isEditing ? (
									<View style={styles.editActions}>
										<Button
											mode="contained"
											onPress={handleSave}
											loading={saving}
											disabled={saving || !editedContent.trim()}
											style={styles.actionButton}
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
											style={[styles.actionButton, styles.cancelButton]}
										>
											Cancel
										</Button>
									</View>
								) : (
									<View style={styles.iconButtons}>
										<IconButton
											icon="pencil"
											mode="contained-tonal"
											size={20}
											onPress={() => setIsEditing(true)}
										/>
										<IconButton
											icon="delete"
											mode="contained-tonal"
											size={20}
											onPress={handleDelete}
											iconColor={theme.colors.error}
											style={styles.deleteButton}
										/>
									</View>
								)}
							</View>
						</View>

						<View style={styles.contentContainer}>
							{isEditing ? (
								<TextInput
									value={editedContent}
									onChangeText={setEditedContent}
									multiline
									mode="outlined"
									style={styles.input}
									contentStyle={styles.inputContent}
								/>
							) : (
								<Text variant="bodyLarge" style={styles.content}>
									{entry.content}
								</Text>
							)}
						</View>

						{entry.imageUri && (
							<Card style={styles.imageCard}>
								<Card.Cover
									source={{ uri: entry.imageUri }}
									style={styles.image}
									resizeMode="cover"
								/>
							</Card>
						)}
					</Card.Content>
				</Card>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	scrollContent: {
		flexGrow: 1,
	},
	cardContainer: {
		padding: theme.spacing.md,
	},
	card: {
		backgroundColor: theme.colors.surface,
		elevation: theme.elevation.small,
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: theme.spacing.md,
		color: theme.colors.primary,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: theme.spacing.lg,
		paddingBottom: theme.spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: `${theme.colors.primary}20`,
	},
	headerInfo: {
		flex: 1,
		marginRight: theme.spacing.md,
	},
	date: {
		color: theme.colors.primary,
		fontWeight: '600',
	},
	category: {
		color: theme.colors.secondary,
		textTransform: 'uppercase',
		marginTop: theme.spacing.xs,
	},
	contentContainer: {
		marginBottom: theme.spacing.lg,
	},
	content: {
		fontSize: 16,
		lineHeight: 24,
		color: theme.colors.text,
	},
	input: {
		backgroundColor: 'transparent',
		minHeight: 120,
	},
	inputContent: {
		fontSize: 16,
		lineHeight: 24,
		padding: theme.spacing.sm,
	},
	imageCard: {
		marginTop: theme.spacing.md,
		elevation: 0,
		backgroundColor: 'transparent',
		overflow: 'hidden',
	},
	image: {
		height: 200,
		borderRadius: theme.roundness,
	},
	actions: {
		flexShrink: 0,
	},
	editActions: {
		flexDirection: 'column',
		alignItems: 'flex-end',
	},
	iconButtons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButton: {
		minWidth: 100,
		marginBottom: theme.spacing.xs,
	},
	cancelButton: {
		marginTop: theme.spacing.xs,
	},
	deleteButton: {
		marginLeft: theme.spacing.sm,
	},
});

export default EntryDetailScreen; 