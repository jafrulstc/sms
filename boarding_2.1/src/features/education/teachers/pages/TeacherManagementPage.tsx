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
  selectTeacherState,
  selectTeachers,
  fetchTeachers,
  deleteTeacher,
  setFilters,
  setPagination,
} from '../store/teacherSlice';
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
import { TeacherFormModal } from '../components/TeacherFormModal';
import { TeacherDetailsModal } from '../components/TeacherDetailsModal';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { Teacher, TeacherFilters } from '../types/teacherType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { Link } from 'react-router-dom';

/**
 * Teacher List Page Component
 * Displays teachers in a table format with CRUD operations
 */
const TeacherManagementPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectTeacherState);
  const teachers = useAppSelector(selectTeachers);
  const genders = useAppSelector(selectGenders);
  const { subjects, gradeLevels } = useAppSelector(selectAcademicState);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

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
    const newFilters: TeacherFilters = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      genderId: genderFilter || undefined,
    };

    // Only dispatch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      dispatch(setFilters(newFilters));
    }
  }, [debouncedSearchTerm, statusFilter, genderFilter, dispatch, filters]);

  // Fetch teachers when pagination or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchTeachers(fetchParams));
  }, [pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle add new teacher
   */
  const handleAddNew = useCallback(() => {
    setSelectedTeacher(null);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle edit teacher
   */
  const handleEdit = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormModalOpen(true);
  }, []);

  /**
   * Handle view teacher details
   */
  const handleViewDetails = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDetailsModalOpen(true);
  }, []);

  /**
   * Handle delete teacher
   */
  const handleDelete = useCallback((teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!teacherToDelete) return;

    try {
      await dispatch(deleteTeacher(teacherToDelete.id)).unwrap();
      showToast(`Teacher ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete teacher', 'error');
    }
  }, [teacherToDelete, dispatch, showToast]);

  /**
   * Handle form modal close
   */
  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedTeacher(null);
    // Refresh the teacher list after modal closes to show any updates
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchTeachers(fetchParams));
  }, []);

  /**
   * Handle details modal close
   */
  const handleDetailsModalClose = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedTeacher(null);
    // Refresh the teacher list after modal closes to show any updates
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };
    dispatch(fetchTeachers(fetchParams));
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

  if (loading && teachers.length === 0) {
    return <LoadingSpinner message="Loading teachers..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Teacher Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage teacher information and profiles
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/admin/education/teachers/form"
          variant="contained"
          startIcon={<Add />}
          // onClick={handleAddNew}
          disabled={loading}
          size="large"
        >
          Add Teacher
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6}}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search teachers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
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

          <Grid size={{xs: 12, md: 3}}>
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

      {/* Teachers Table */}
      {teachers.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Demographics</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={teacher.photoUrl}
                          sx={{ width: 50, height: 50 }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {teacher.firstName} {teacher.lastName}
                          </Typography>

                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatPhoneNumber(teacher.mobileNumber)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {teacher.emailAddress}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getEntityName(genders, teacher.genderId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getEntityNames(subjects, teacher.subjectIds).slice(0, 2).map((subjectName, index) => (
                          <Chip
                            key={index}
                            label={subjectName}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {teacher.subjectIds.length > 2 && (
                          <Chip
                            label={`+${teacher.subjectIds.length - 2}`}
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {teacher.yearsOfExperience || 0} years
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={teacher.status}
                        size="small"
                        color={getStatusColor(teacher.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(teacher)}
                        color="info"
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(teacher)}
                        color="primary"
                        title="Edit Teacher"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(teacher)}
                        color="error"
                        title="Delete Teacher"
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
          title="No teachers found"
          description="No teachers available. Add some to get started."
          actionLabel="Add Teacher"
          onAction={handleAddNew}
        />
      )}

      {/* Teacher Form Modal */}
      <TeacherFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        teacher={selectedTeacher}
      />

      {/* Teacher Details Modal */}
      <TeacherDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        teacher={selectedTeacher}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete "${teacherToDelete?.firstName} ${teacherToDelete?.lastName}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

TeacherManagementPage.displayName = 'TeacherManagementPage';

export { TeacherManagementPage };