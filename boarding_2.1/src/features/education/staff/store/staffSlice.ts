import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Staff, // Changed from Teacher
  CreateStaffDto, // Changed from CreateTeacherDto
  UpdateStaffDto, // Changed from UpdateTeacherDto
  StaffFilters, // Changed from TeacherFilters
} from '../types/staffType';
import { staffApi } from '../services/staffApi'; // Changed from teacherApi

/**
 * Staff slice state interface // Changed from Teacher slice state interface
 */
export interface StaffState { // Changed from TeacherState
  // Data
  staffs: Staff[]; // Changed from teachers: Teacher[]
  selectedStaff: Staff | null; // Changed from selectedTeacher: Teacher | null

  // UI State
  loading: boolean;
  error: string | null;
  filters: StaffFilters; // Changed from TeacherFilters

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Initial state for staff slice // Changed from Initial state for teacher slice
 */
const initialState: StaffState = { // Changed from TeacherState
  staffs: [], // Changed from teachers: []
  selectedStaff: null, // Changed from selectedTeacher: null
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
 * Fetch staffs with pagination and filtering // Changed from Fetch teachers
 */
export const fetchStaffs = createAsyncThunk( // Changed from fetchTeachers
  'staff/fetchStaffs', // Changed from teacher/fetchTeachers
  async (params: { page?: number; limit?: number; filters?: StaffFilters } = {}) => { // Changed from TeacherFilters
    return await staffApi.getStaff(params); // Changed from teacherApi.getTeachers
  }
);

/**
 * Fetch staff by ID // Changed from Fetch teacher by ID
 */
export const fetchStaffById = createAsyncThunk( // Changed from fetchTeacherById
  'staff/fetchStaffById', // Changed from teacher/fetchTeacherById
  async (id: string) => {
    return await staffApi.getStaffById(id); // Changed from teacherApi.getTeacherById
  }
);

/**
 * Create new staff // Changed from Create new teacher
 */
export const createStaff = createAsyncThunk( // Changed from createTeacher
  'staff/createStaff', // Changed from teacher/createTeacher
  async (data: CreateStaffDto) => { // Changed from CreateTeacherDto
    return await staffApi.createStaff(data); // Changed from teacherApi.createTeacher
  }
);

/**
 * Update staff // Changed from Update teacher
 */
export const updateStaff = createAsyncThunk( // Changed from updateTeacher
  'staff/updateStaff', // Changed from teacher/updateTeacher
  async ({ id, data }: { id: string; data: UpdateStaffDto }) => { // Changed from UpdateTeacherDto
    return await staffApi.updateStaff(id, data); // Changed from teacherApi.updateTeacher
  }
);

/**
 * Delete staff // Changed from Delete teacher
 */
export const deleteStaff = createAsyncThunk( // Changed from deleteTeacher
  'staff/deleteStaff', // Changed from teacher/deleteTeacher
  async (id: string) => {
    await staffApi.deleteStaff(id); // Changed from teacherApi.deleteTeacher
    return id;
  }
);

/**
 * Staff slice definition // Changed from Teacher slice definition
 */
const staffSlice = createSlice({ // Changed from teacherSlice
  name: 'staff', // Changed from 'teacher'
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<StaffFilters>) => { // Changed from TeacherFilters
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
    clearSelectedStaff: (state) => { // Changed from clearSelectedTeacher
      state.selectedStaff = null; // Changed from selectedTeacher
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch staffs // Changed from Fetch teachers
      .addCase(fetchStaffs.pending, (state) => { // Changed from fetchTeachers
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => { // Changed from fetchTeachers
        state.loading = false;
        state.staffs = action.payload.data; // Changed from teachers
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchStaffs.rejected, (state, action) => { // Changed from fetchTeachers
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staffs'; // Changed from teachers
      })

      // Fetch staff by ID // Changed from Fetch teacher by ID
      .addCase(fetchStaffById.pending, (state) => { // Changed from fetchTeacherById
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => { // Changed from fetchTeacherById
        state.loading = false;
        state.selectedStaff = action.payload; // Changed from selectedTeacher
      })
      .addCase(fetchStaffById.rejected, (state, action) => { // Changed from fetchTeacherById
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch staff'; // Changed from teacher
      })

      // Create staff // Changed from Create teacher
      .addCase(createStaff.pending, (state) => { // Changed from createTeacher
        state.loading = true;
        state.error = null;
      })
      // Create staff - professionalExperience/references অপশনাল হ্যান্ডলিং // Changed from Create teacher
      .addCase(createStaff.fulfilled, (state, action) => { // Changed from createTeacher
        state.loading = false;

        // নেস্টেড অবজেক্ট যোগ করা
        const newStaff = { // Changed from newTeacher
          ...action.payload,
          professionalExperience: action.payload.professionalExperience || [],
          references: action.payload.references || [],
        };

        state.staffs.unshift(newStaff); // Changed from teachers.unshift(newTeacher)
        state.pagination.total += 1;
      })
      .addCase(createStaff.rejected, (state, action) => { // Changed from createTeacher
        state.loading = false;
        state.error = action.error.message || 'Failed to create staff'; // Changed from teacher
      })

      // Update staff // Changed from Update teacher
      .addCase(updateStaff.pending, (state) => { // Changed from updateTeacher
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => { // Changed from updateTeacher
        state.loading = false;
        const index = state.staffs.findIndex(staff => staff.id === action.payload.id); // Changed from teachers.findIndex(teacher => teacher.id === action.payload.id)
        if (index !== -1) {
          state.staffs[index] = action.payload; // Changed from teachers[index]
        }
        if (state.selectedStaff?.id === action.payload.id) { // Changed from selectedTeacher?.id
          state.selectedStaff = action.payload; // Changed from selectedTeacher
        }
      })
      .addCase(updateStaff.rejected, (state, action) => { // Changed from updateTeacher
        state.loading = false;
        state.error = action.error.message || 'Failed to update staff'; // Changed from teacher
      })

      // Delete staff // Changed from Delete teacher
      .addCase(deleteStaff.pending, (state) => { // Changed from deleteTeacher
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => { // Changed from deleteTeacher
        state.loading = false;
        state.staffs = state.staffs.filter(staff => staff.id !== action.payload); // Changed from teachers.filter(teacher => teacher.id !== action.payload)
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedStaff?.id === action.payload) { // Changed from selectedTeacher?.id
          state.selectedStaff = null; // Changed from selectedTeacher
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => { // Changed from deleteTeacher
        state.loading = false;
        state.error = action.error.message || 'Failed to delete staff'; // Changed from teacher
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  clearSelectedStaff, // Changed from clearSelectedTeacher
} = staffSlice.actions; // Changed from teacherSlice.actions

// Export selectors
export const selectStaffState = (state: { staff: StaffState }) => state.staff; // Changed from selectTeacherState and TeacherState
export const selectStaffs = (state: { staff: StaffState }) => state.staff.staffs; // Changed from selectTeachers and teachers
export const selectSelectedStaff = (state: { staff: StaffState }) => state.staff.selectedStaff; // Changed from selectSelectedTeacher and selectedTeacher
export const selectStaffLoading = (state: { staff: StaffState }) => state.staff.loading; // Changed from selectTeacherLoading
export const selectStaffError = (state: { staff: StaffState }) => state.staff.error; // Changed from selectTeacherError
export const selectStaffFilters = (state: { staff: StaffState }) => state.staff.filters; // Changed from selectTeacherFilters
export const selectStaffPagination = (state: { staff: StaffState }) => state.staff.pagination; // Changed from selectTeacherPagination

// Export reducer
export default staffSlice.reducer; // Changed from teacherSlice.reducer