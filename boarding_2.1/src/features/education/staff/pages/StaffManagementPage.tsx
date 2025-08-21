import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Pagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Visibility,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectStaffState, // Changed from selectTeacherState
  selectStaffs, // Changed from selectTeachers
  fetchStaffs, // Changed from fetchTeachers
  deleteStaff, // Changed from deleteTeacher
  setFilters,
  setPagination,
} from '../store/staffSlice';
import {
  selectGenders,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectAcademicState,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { StaffFormModal } from '../components/staffFormModal'; // Changed from TeacherFormModal
import { StaffDetailsModal } from '../components/staffDetailsModal'; // Changed from TeacherDetailsModal
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { Staff, StaffFilters } from '../types/staffType'; // Changed from Teacher, TeacherFilters
import { SUCCESS_MESSAGES } from '~/app/constants';
import { Link } from 'react-router-dom';

/**
 * Staff List Page Component // Changed from Teacher List Page Component
 * Displays staff in a table format with CRUD operations // Changed from Displays teachers
 */
const StaffManagementPage = memo(() => { // Changed from TeacherManagementPage
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectStaffState); // Changed from selectTeacherState
  const staffs = useAppSelector(selectStaffs); // Changed from teachers
  const genders = useAppSelector(selectGenders);
  const { subjects, gradeLevels } = useAppSelector(selectAcademicState);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null); // Changed from selectedTeacher, Teacher
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null); // Changed from teacherToDelete, Teacher

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch required master data
  useEffect(() => {
    if (genders.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (subjects.length === 0 || gradeLevels.length === 0) {
      dispatch(fetchAllAcademicEntities());
    }
  }, [dispatch, genders.length, subjects.length, gradeLevels.length]);

  // Update filters when search term or filter values change
  useEffect(() => {
    const newFilters: StaffFilters = { // Changed from TeacherFilters
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      genderId: genderFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, dispatch, filters]);

  // Fetch staffs when pagination or filters change // Changed from Fetch teachers
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStaffs(fetchParams)); // Changed from fetchTeachers
  }, [pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new staff // Changed from teacher
   */
  const handleAddNew = useCallback(() => {
    setSelectedStaff(null); // Changed from setSelectedTeacher
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit staff // Changed from teacher
   */
  const handleEdit = useCallback((staff: Staff) => { // Changed from teacher: Teacher
    setSelectedStaff(staff); // Changed from setSelectedTeacher
    setFormModalOpen(true);
  }, []);

  /**
   * Handle view staff details // Changed from teacher details
   */
  const handleViewDetails = useCallback((staff: Staff) => { // Changed from teacher: Teacher
    setSelectedStaff(staff); // Changed from setSelectedTeacher
    setDetailsModalOpen(true);
  }, []);

  /**
   * Handle delete staff // Changed from teacher
   */
  const handleDelete = useCallback((staff: Staff) => { // Changed from teacher: Teacher
    setStaffToDelete(staff); // Changed from setTeacherToDelete
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!staffToDelete) return; // Changed from !teacherToDelete

    try {
      await dispatch(deleteStaff(staffToDelete.id)).unwrap(); // Changed from deleteTeacher and teacherToDelete.id
      showToast(`Staff ${SUCCESS_MESSAGES.DELETED}`, 'success'); // Changed from Teacher
      setDeleteDialogOpen(false);
      setStaffToDelete(null); // Changed from setTeacherToDelete
    } catch (error: any) {
      showToast(error.message || 'Failed to delete staff', 'error'); // Changed from teacher
    }
  }, [staffToDelete, dispatch, showToast]); // Changed from teacherToDelete

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedStaff(null); // Changed from setSelectedTeacher
    // Refresh the staff list after modal closes to show any updates // Changed from teacher list
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStaffs(fetchParams)); // Changed from fetchTeachers
  }, []);

  /**
   * Handle details modal close
   */
  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedStaff(null); // Changed from setSelectedTeacher
    // Refresh the staff list after modal closes to show any updates // Changed from teacher list
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchStaffs(fetchParams)); // Changed from fetchTeachers
  }, [dispatch, pagination.page, pagination.limit, filters]);

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Unknown';
  };

  /**
   * Get multiple entity names by IDs
   */
  const getEntityNames = (entities: any[], ids: string[]): string[] => {
    return ids.map(id => getEntityName(entities, id));
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warning';
      case 'PENDING':
        return 'error';

      case 'ARCHIVE':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading && staffs.length === 0) { // Changed from teachers.length
    return <LoadingSpinner message="Loading staff..." />; // Changed from teachers
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Staff Management {/* Changed from Teacher Management */}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage staff information and profiles {/* Changed from teacher information */}
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/admin/education/staff/form" // Changed from teachers/form
          variant="contained"
          startIcon={<Add />}
          // onClick={handleAddNew}
          disabled={loading}
          size="large"
        >
          Add Staff {/* Changed from Add Teacher */}
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}} >
            <TextField
              fullWidth
              size="small"
              placeholder="Search staff by name, email, or phone..." // Changed from teachers
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid  size={{xs: 12, md: 3}} >
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="ARCHIVE">ARCHIVE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid  size={{xs: 12, md: 3}} >
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                value={genderFilter}
                label="Gender"
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <MenuItem value="">All Genders</MenuItem>
                {genders.map((gender) => (
                  <MenuItem key={gender.id} value={gender.id}>
                    {gender.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Staff Table */}
      {staffs.length > 0 ? ( // Changed from teachers.length
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff</TableCell>{/* Changed from Teacher */}
                  <TableCell>Contact</TableCell>
                  <TableCell>Demographics</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffs.map((staff) => ( // Changed from teachers.map((teacher)
                  <TableRow key={staff.id} hover>{/* Changed from teacher.id */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={staff.photoUrl} // Changed from teacher.photoUrl
                          sx={{ width: 50, height: 50 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {staff.firstName} {staff.lastName} {/* Changed from teacher.firstName, teacher.lastName */}
                          </Typography>

                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatPhoneNumber(staff.mobileNumber)} {/* Changed from teacher.mobileNumber */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {staff.emailAddress} {/* Changed from teacher.emailAddress */}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getEntityName(genders, staff.genderId)} {/* Changed from teacher.genderId */}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getEntityNames(subjects, staff.subjectIds).slice(0, 2).map((subjectName, index) => ( // Changed from teacher.subjectIds
                          <Chip
                            key={index}
                            label={subjectName}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {staff.subjectIds.length > 2 && ( // Changed from teacher.subjectIds
                          <Chip
                            label={`+${staff.subjectIds.length - 2}`} // Changed from teacher.subjectIds
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {staff.yearsOfExperience || 0} years {/* Changed from teacher.yearsOfExperience */}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={staff.status} // Changed from teacher.status
                        size="small"
                        color={getStatusColor(staff.status)} // Changed from teacher.status
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(staff)} // Changed from teacher
                        color="info"
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(staff)} // Changed from teacher
                        color="primary"
                        title="Edit Staff" // Changed from Edit Teacher
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(staff)} // Changed from teacher
                        color="error"
                        title="Delete Staff" // Changed from Delete Teacher
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title="No staff found" // Changed from teachers found
          description="No staff available. Add some to get started." // Changed from teachers available
          actionLabel="Add Staff" // Changed from Add Teacher
          onAction={handleAddNew}
        />
      )}

      {/* Staff Form Modal */}
      <StaffFormModal // Changed from TeacherFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        staff={selectedStaff} // Changed from teacher={selectedTeacher}
      />

      {/* Staff Details Modal */}
      <StaffDetailsModal // Changed from TeacherDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        staff={selectedStaff} // Changed from teacher={selectedTeacher}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff" // Changed from Delete Teacher
        message={`Are you sure you want to delete "${staffToDelete?.firstName} ${staffToDelete?.lastName}"? This action cannot be undone.`} // Changed from teacherToDelete
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

StaffManagementPage.displayName = 'StaffManagementPage'; // Changed from TeacherManagementPage';

export { StaffManagementPage }; // Changed from TeacherManagementPage