import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteEntryFromDb, loadEntries, saveEntry } from '../database/db';

export interface DiaryEntry {
	id: string;
	date: string;
	content: string;
	category: string;
	imageUri?: string;
}

interface EntriesState {
	list: DiaryEntry[];
	loading: boolean;
	error: string | null;
}

const initialState: EntriesState = {
	list: [],
	loading: false,
	error: null,
};

export const fetchEntries = createAsyncThunk(
	'entries/fetchEntries',
	async () => {
		const entries = await loadEntries();
		return entries;
	}
);

export const addEntryAsync = createAsyncThunk(
	'entries/addEntry',
	async (entry: DiaryEntry) => {
		await saveEntry(entry);
		return entry;
	}
);

export const updateEntryAsync = createAsyncThunk(
	'entries/updateEntry',
	async (entry: DiaryEntry) => {
		await saveEntry(entry);
		return entry;
	}
);

export const deleteEntryAsync = createAsyncThunk(
	'entries/deleteEntry',
	async (id: string) => {
		await deleteEntryFromDb(id);
		return id;
	}
);

const entriesSlice = createSlice({
	name: 'entries',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEntries.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEntries.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
			})
			.addCase(fetchEntries.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch entries';
			})
			.addCase(addEntryAsync.fulfilled, (state, action) => {
				state.list.unshift(action.payload);
			})
			.addCase(updateEntryAsync.fulfilled, (state, action) => {
				const index = state.list.findIndex(entry => entry.id === action.payload.id);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
			})
			.addCase(deleteEntryAsync.fulfilled, (state, action) => {
				state.list = state.list.filter(entry => entry.id !== action.payload);
			});
	},
});

export const { setLoading, setError } = entriesSlice.actions;
export default entriesSlice.reducer; 