import React, { useEffect, useState, useRef, memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { Person, CloudUpload, Delete, AttachFile } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectNationalities,
  fetchNationalities,
} from '~/features/core/store/geographySlice';
import { AddressFields } from '~/features/core/components/general/AddressFields';
import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
import { createStudent, updateStudent } from '../store/studentSlice';
import { studentSchema, type StudentFormData } from '../schemas/studentSchema';
import type { Student } from '../types';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

interface StudentFormProps {
  student?: Student | null;
  onSuccess?: (student: Student) => void;
}

/**
 * Student form component
 */
const StudentForm = memo(({ student, onSuccess }: StudentFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);

  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileUploading, setFileUploading] = useState<Record<string, boolean>>({});

  const photoInputRef = useRef<HTMLInputElement>(null);
  const studentNidInputRef = useRef<HTMLInputElement>(null);
  const studentBrnInputRef = useRef<HTMLInputElement>(null);
  const fatherNidInputRef = useRef<HTMLInputElement>(null);
  const motherNidInputRef = useRef<HTMLInputElement>(null);
  const digitalSignatureInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(student);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      email: '',
      healthCondition: '',
      nidNumber: '',
      brnNumber: '',
      genderId: '',
      bloodGroupId: '',
      religionId: '',
      nationalityId: '',
      presentAddress: {},
      permanentAddress: {},
      sameAsPresent: false,
      studentPhoto: '',
      studentNidFile: '',
      studentBrnFile: '',
      fatherNidFile: '',
      motherNidFile: '',
      digitalSignatureFile: '',
      studentNidFileName: '',
      studentBrnFileName: '',
      fatherNidFileName: '',
      motherNidFileName: '',
      digitalSignatureFileName: '',
      status: STATUSES_OBJECT.ACTIVE,
    },
  });

  const sameAsPresent = watch('sameAsPresent');
  const presentAddress = watch('presentAddress');

  // Fetch required master data
  useEffect(() => {
    if (genders.length === 0 || bloodGroups.length === 0 || religions.length === 0) {
      dispatch(fetchAllSimpleEntities());
    }
    if (nationalities.length === 0) {
      dispatch(fetchNationalities({ page: 1, limit: 1000, filters: {} }));
    }
  }, [dispatch, genders.length, bloodGroups.length, religions.length, nationalities.length]);

  // Reset form when student changes
  useEffect(() => {
    if (student) {
      const defaultValues: StudentFormData = {
        firstName: student.firstName,
        lastName: student.lastName,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dateOfBirth: student.dateOfBirth,
        email: student.email || '',
        healthCondition: student.healthCondition || '',
        nidNumber: student.nidNumber || '',
        brnNumber: student.brnNumber || '',
        genderId: student.genderId,
        bloodGroupId: student.bloodGroupId || '',
        religionId: student.religionId || '',
        nationalityId: student.nationalityId || '',
        presentAddress: student.presentAddress || {},
        permanentAddress: student.permanentAddress || {},
        sameAsPresent: student.sameAsPresent || false,
        studentPhoto: student.studentPhoto || '',
        studentNidFile: student.studentNidFile || '',
        studentBrnFile: student.studentBrnFile || '',
        fatherNidFile: student.fatherNidFile || '',
        motherNidFile: student.motherNidFile || '',
        digitalSignatureFile: student.digitalSignatureFile || '',
        studentNidFileName: student.studentNidFileName || '',
        studentBrnFileName: student.studentBrnFileName || '',
        fatherNidFileName: student.fatherNidFileName || '',
        motherNidFileName: student.motherNidFileName || '',
        digitalSignatureFileName: student.digitalSignatureFileName || '',
        status: student.status,
      };
      reset(defaultValues);
      setPhotoPreview(student.studentPhoto || null);
    } else {
      reset({
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        email: '',
        healthCondition: '',
        nidNumber: '',
        brnNumber: '',
        genderId: '',
        bloodGroupId: '',
        religionId: '',
        nationalityId: '',
        presentAddress: {},
        permanentAddress: {},
        sameAsPresent: false,
        studentPhoto: '',
        studentNidFile: '',
        studentBrnFile: '',
        fatherNidFile: '',
        motherNidFile: '',
        digitalSignatureFile: '',
        studentNidFileName: '',
        studentBrnFileName: '',
        fatherNidFileName: '',
        motherNidFileName: '',
        digitalSignatureFileName: '',
        status: STATUSES_OBJECT.ACTIVE,
      });
      setPhotoPreview(null);
    }
  }, [student, reset]);

  // Update permanent address when "same as present" is checked
  useEffect(() => {
    if (sameAsPresent && presentAddress) {
      setValue('permanentAddress', presentAddress);
    }
  }, [sameAsPresent, presentAddress, setValue]);

  /**
   * Handle photo upload
   */
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      showToast(validation.error!, 'error');
      return;
    }

    setPhotoUploading(true);
    try {
      const result = await uploadPhoto(file);
      if (result.success && result.url) {
        setValue('studentPhoto', result.url);
        setPhotoPreview(result.url);
        showToast('Photo uploaded successfully', 'success');
      } else {
        showToast(result.error || 'Failed to upload photo', 'error');
      }
    } catch (error) {
      showToast('Failed to upload photo', 'error');
    } finally {
      setPhotoUploading(false);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof StudentFormData,
    fileNameField?: keyof StudentFormData
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file (PDF or image)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPEG, PNG, and GIF files are allowed', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setFileUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      // Convert to base64 for mock implementation
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setValue(fieldName as any, result);
        if (fileNameField) {
          setValue(fileNameField as any, file.name);
        }
        showToast('File uploaded successfully', 'success');
        setFileUploading(prev => ({ ...prev, [fieldName]: false }));
      };
      reader.onerror = () => {
        showToast('Failed to upload file', 'error');
        setFileUploading(prev => ({ ...prev, [fieldName]: false }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Failed to upload file', 'error');
      setFileUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  /**
   * Handle file removal
   */
  const handleRemoveFile = (fieldName: keyof StudentFormData, fileNameField?: keyof StudentFormData) => {
    setValue(fieldName as any, '');
    if (fileNameField) {
      setValue(fileNameField as any, '');
    }
    showToast('File removed successfully', 'success');
  };

  /**
   * Handle form submission
   */
  const onSubmit = async (data: StudentFormData) => {
    try {
      if (isEdit && student) {
        const updatedStudent = await dispatch(updateStudent({ id: student.id, data })).unwrap();
        showToast(`Student ${SUCCESS_MESSAGES.UPDATED}`, 'success');
        onSuccess?.(updatedStudent);
      } else {
        const newStudent = await dispatch(createStudent(data)).unwrap();
        showToast(`Student ${SUCCESS_MESSAGES.CREATED}`, 'success');
        onSuccess?.(newStudent);
        // Reset form after successful creation
        reset();
        setPhotoPreview(null);
      }
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} student`, 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </Typography>

          <Grid container spacing={3}>
            {/* Photo Upload */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Student Photo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={photoPreview || undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => photoInputRef.current?.click()}
                    disabled={photoUploading}
                  >
                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Max 5MB. JPEG, PNG, GIF supported. (Optional)
                  </Typography>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{xs: 12}}>
              <Divider />
            </Grid>

            {/* Personal Information */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name *"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name *"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="fatherName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Father's Name *"
                    error={!!errors.fatherName}
                    helperText={errors.fatherName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="motherName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mother's Name *"
                    error={!!errors.motherName}
                    helperText={errors.motherName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth *"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            {/* Demographics */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Demographics
              </Typography>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="genderId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.genderId}>
                    <InputLabel>Gender *</InputLabel>
                    <Select {...field} label="Gender *">
                      <MenuItem value="">Select Gender</MenuItem>
                      {genders.map((gender) => (
                        <MenuItem key={gender.id} value={gender.id}>
                          {gender.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.genderId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.genderId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="bloodGroupId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.bloodGroupId}>
                    <InputLabel>Blood Group</InputLabel>
                    <Select {...field} label="Blood Group">
                      <MenuItem value="">Select Blood Group</MenuItem>
                      {bloodGroups.map((bloodGroup) => (
                        <MenuItem key={bloodGroup.id} value={bloodGroup.id}>
                          {bloodGroup.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bloodGroupId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.bloodGroupId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="religionId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.religionId}>
                    <InputLabel>Religion</InputLabel>
                    <Select {...field} label="Religion">
                      <MenuItem value="">Select Religion</MenuItem>
                      {religions.map((religion) => (
                        <MenuItem key={religion.id} value={religion.id}>
                          {religion.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.religionId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.religionId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="nationalityId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.nationalityId}>
                    <InputLabel>Nationality</InputLabel>
                    <Select {...field} label="Nationality">
                      <MenuItem value="">Select Nationality</MenuItem>
                      {nationalities.map((nationality) => (
                        <MenuItem key={nationality.id} value={nationality.id}>
                          {nationality.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.nationalityId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.nationalityId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Additional Information */}
            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="nidNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="NID Number"
                    error={!!errors.nidNumber}
                    helperText={errors.nidNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="brnNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Birth Registration Number (BRN)"
                    error={!!errors.brnNumber}
                    helperText={errors.brnNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{xs: 12}}>
              <Controller
                name="healthCondition"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Health Condition"
                    multiline
                    rows={3}
                    placeholder="Any physical health or specific medical condition details"
                    error={!!errors.healthCondition}
                    helperText={errors.healthCondition?.message}
                  />
                )}
              />
            </Grid>

            {/* File Uploads */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Document Uploads
              </Typography>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Student NID File
                </Typography>
                
                {/* Show uploaded file if exists */}
                <Controller
                  name="studentNidFileName"
                  control={control}
                  render={({ field }) => (
                    field.value ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={field.value}
                          variant="outlined"
                          color="success"
                          onDelete={() => handleRemoveFile('studentNidFile', 'studentNidFileName')}
                          deleteIcon={<Delete />}
                        />
                      </Box>
                    ) : <></>
                  )}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => studentNidInputRef.current?.click()}
                  disabled={fileUploading.studentNidFile}
                  fullWidth
                >
                  {fileUploading.studentNidFile ? 'Uploading...' : 'Upload Student NID'}
                </Button>
                <input
                  ref={studentNidInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, 'studentNidFile', 'studentNidFileName')}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Student Birth Registration File
                </Typography>
                
                {/* Show uploaded file if exists */}
                <Controller
                  name="studentBrnFileName"
                  control={control}
                  render={({ field }) => (
                    field.value ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={field.value}
                          variant="outlined"
                          color="success"
                          onDelete={() => handleRemoveFile('studentBrnFile', 'studentBrnFileName')}
                          deleteIcon={<Delete />}
                        />
                      </Box>
                    ) : <></>
                  )}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => studentBrnInputRef.current?.click()}
                  disabled={fileUploading.studentBrnFile}
                  fullWidth
                >
                  {fileUploading.studentBrnFile ? 'Uploading...' : 'Upload Birth Registration'}
                </Button>
                <input
                  ref={studentBrnInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, 'studentBrnFile', 'studentBrnFileName')}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Father's NID File
                </Typography>
                
                {/* Show uploaded file if exists */}
                <Controller
                  name="fatherNidFileName"
                  control={control}
                  render={({ field }) => (
                    field.value ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={field.value}
                          variant="outlined"
                          color="success"
                          onDelete={() => handleRemoveFile('fatherNidFile', 'fatherNidFileName')}
                          deleteIcon={<Delete />}
                        />
                      </Box>
                    ) : <></>
                  )}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => fatherNidInputRef.current?.click()}
                  disabled={fileUploading.fatherNidFile}
                  fullWidth
                >
                  {fileUploading.fatherNidFile ? 'Uploading...' : 'Upload Father NID'}
                </Button>
                <input
                  ref={fatherNidInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, 'fatherNidFile', 'fatherNidFileName')}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Mother's NID File
                </Typography>
                
                {/* Show uploaded file if exists */}
                <Controller
                  name="motherNidFileName"
                  control={control}
                  render={({ field }) => (
                    field.value ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={field.value}
                          variant="outlined"
                          color="success"
                          onDelete={() => handleRemoveFile('motherNidFile', 'motherNidFileName')}
                          deleteIcon={<Delete />}
                        />
                      </Box>
                    ) : <></>
                  )}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => motherNidInputRef.current?.click()}
                  disabled={fileUploading.motherNidFile}
                  fullWidth
                >
                  {fileUploading.motherNidFile ? 'Uploading...' : 'Upload Mother NID'}
                </Button>
                <input
                  ref={motherNidInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, 'motherNidFile', 'motherNidFileName')}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Digital Signature
                </Typography>
                
                {/* Show uploaded file if exists */}
                <Controller
                  name="digitalSignatureFileName"
                  control={control}
                  render={({ field }) => (
                    field.value ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={field.value}
                          variant="outlined"
                          color="success"
                          onDelete={() => handleRemoveFile('digitalSignatureFile', 'digitalSignatureFileName')}
                          deleteIcon={<Delete />}
                        />
                      </Box>
                    ) : <></>
                  )}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => digitalSignatureInputRef.current?.click()}
                  disabled={fileUploading.digitalSignatureFile}
                  fullWidth
                >
                  {fileUploading.digitalSignatureFile ? 'Uploading...' : 'Upload Digital Signature'}
                </Button>
                <input
                  ref={digitalSignatureInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, 'digitalSignatureFile', 'digitalSignatureFileName')}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            {/* Present Address */}
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Present Address
              </Typography>
            </Grid>

            <Grid size={{xs: 12}}>
              <Controller
                name="presentAddress"
                control={control}
                render={({ field }) => (
                  <AddressFields
                    value={field.value || {}}
                    onChange={field.onChange}
                    error={errors.presentAddress}
                  />
                )}
              />
            </Grid>

            {/* Permanent Address */}
            <Grid size={{xs: 12}}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Permanent Address
                </Typography>
                <Controller
                  name="sameAsPresent"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value || false}
                          onChange={field.onChange}
                        />
                      }
                      label="Same as Present"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{xs: 12}}>
              {sameAsPresent ? (
                <Alert severity="info">
                  Permanent address will be same as present address
                </Alert>
              ) : (
                <Controller
                  name="permanentAddress"
                  control={control}
                  render={({ field }) => (
                    <AddressFields
                      value={field.value || {}}
                      onChange={field.onChange}
                      error={errors.permanentAddress}
                    />
                  )}
                />
              )}
            </Grid>

            {/* Status */}
            <Grid size={{xs: 12, md: 6}}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Graduated</MenuItem>
                      <MenuItem value={STATUSES_OBJECT.INACTIVE}>Transferred</MenuItem>
                    </Select>
                    {errors.status && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{xs: 12}}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || photoUploading || Object.values(fileUploading).some(Boolean)}
                  sx={{ minWidth: 150 }}
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

StudentForm.displayName = 'StudentForm';

export { StudentForm };