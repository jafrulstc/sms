import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Stuff,
  CreateStuffDto,
  UpdateStuffDto,
  StuffFilters,
} from '~/features/education/stuffs/types/staffType';
import { StuffApi } from '~/features/education/stuffs/services/stuffApi';

/**
 * Stuff slice state interface
 */
export interface StuffState {
  // Data
  Stuffs: Stuff[];
  selectedStuff: Stuff | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: StuffFilters;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for Stuff slice
 */
const initialState: StuffState = {
  Stuffs: [],
  selectedStuff: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks for API operations

/**
 * Fetch Stuffs with pagination and filtering
 */
export const fetchStuffs = createAsyncThunk(
  'Stuff/fetchStuffs',
  async (params: { page?: number; limit?: number; filters?: StuffFilters } = {}) => {
    return await StuffApi.getStuffs(params);
  }
);

/**
 * Fetch Stuff by ID
 */
export const fetchStuffById = createAsyncThunk(
  'Stuff/fetchStuffById',
  async (id: string) => {
    return await StuffApi.getStuffById(id);
  }
);

/**
 * Create new Stuff
 */
export const createStuff = createAsyncThunk(
  'Stuff/createStuff',
  async (data: CreateStuffDto) => {
    return await StuffApi.createStuff(data);
  }
);

/**
 * Update Stuff
 */
export const updateStuff = createAsyncThunk(
  'Stuff/updateStuff',
  async ({ id, data }: { id: string; data: UpdateStuffDto }) => {
    return await StuffApi.updateStuff(id, data);
  }
);

/**
 * Delete Stuff
 */
export const deleteStuff = createAsyncThunk(
  'Stuff/deleteStuff',
  async (id: string) => {
    await StuffApi.deleteStuff(id);
    return id;
  }
);

/**
 * Stuff slice definition
 */
const StuffSlice = createSlice({
  name: 'Stuff',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StuffFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset pagination when filtering
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<typeof initialState.pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedStuff: (state) => {
      state.selectedStuff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stuffs
      .addCase(fetchStuffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStuffs.fulfilled, (state, action) => {
        state.loading = false;
        state.Stuffs = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchStuffs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Stuffs';
      })

      // Fetch Stuff by ID
      .addCase(fetchStuffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStuffById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStuff = action.payload;
      })
      .addCase(fetchStuffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Stuff';
      })

      // Create Stuff
      .addCase(createStuff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStuff.fulfilled, (state, action) => {
        state.loading = false;
        state.Stuffs.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createStuff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create Stuff';
      })

      // Update Stuff
      .addCase(updateStuff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStuff.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.Stuffs.findIndex(Stuff => Stuff.id === action.payload.id);
        if (index !== -1) {
          state.Stuffs[index] = action.payload;
        }
        if (state.selectedStuff?.id === action.payload.id) {
          state.selectedStuff = action.payload;
        }
      })
      .addCase(updateStuff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update Stuff';
      })

      // Delete Stuff
      .addCase(deleteStuff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStuff.fulfilled, (state, action) => {
        state.loading = false;
        state.Stuffs = state.Stuffs.filter(Stuff => Stuff.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedStuff?.id === action.payload) {
          state.selectedStuff = null;
        }
      })
      .addCase(deleteStuff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete Stuff';
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedStuff,
} = StuffSlice.actions;

// Export selectors
export const selectStuffState = (state: { stuff: StuffState }) => state.stuff;
export const selectStuffs = (state: { stuff: StuffState }) => state.stuff.Stuffs;
export const selectSelectedStuff = (state: { stuff: StuffState }) => state.stuff.selectedStuff;
export const selectStuffLoading = (state: { stuff: StuffState }) => state.stuff.loading;
export const selectStuffError = (state: { stuff: StuffState }) => state.stuff.error;
export const selectStuffFilters = (state: { stuff: StuffState }) => state.stuff.filters;
export const selectStuffPagination = (state: { stuff: StuffState }) => state.stuff.pagination;

// Export reducer
export default StuffSlice.reducer;