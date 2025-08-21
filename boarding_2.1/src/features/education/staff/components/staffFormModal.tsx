import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Avatar,
} from '@mui/material';
import { Close, Person, CloudUpload, Save } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';

import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectRelations,
  selectMaritalStatuses,
  selectDesignations,
  fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
  fetchAllAcademicEntities,
} from '~/features/core/store/academicSlice';
import {
  selectNationalities,
  fetchAllGeographyData,
} from '~/features/core/store/geographySlice';

import {
  selectStaffState, // Changed from selectTeacherState
  createStaff, // Changed from createTeacher
  updateStaff, // Changed from updateTeacher
} from '~/features/education/staff/store/staffSlice'; // Changed path and slice name

import { FormSection } from '~/shared/components/ui/FormSection';
import { FileUpload } from '~/shared/components/ui/FileUpload';
import { MultiSelectChips } from '~/shared/components/ui/MultiSelectChips';
import { DynamicFieldArray } from '~/shared/components/ui/DynamicFieldArray';
import { AddressFields } from '~/features/core/components/general/AddressFields';
import { PhoneInput } from '~/shared/components/ui/PhoneInput';

import {
  staffSchema, // Changed from teacherSchema
  type StaffFormData, // Changed from TeacherFormData
} from '~/features/education/staff/schemas/staffSchema'; // Changed path and schema name
import {
  Staff, // Changed from Teacher
  CreateStaffDto, // Changed from CreateTeacherDto
  UpdateStaffDto, // Changed from UpdateTeacherDto
} from '~/features/education/staff/types/staffType'; // Changed path and type name

import { uploadPhoto, validatePhotoFile } from '~/shared/utils/photoUpload';
import { getChangedFields } from '~/shared/utils/getChangedFields';
import { SUCCESS_MESSAGES } from '~/app/constants';

/** ---------- utilities ---------- */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`staff-edit-tabpanel-${index}`} // Changed from teacher-edit-tabpanel
    aria-labelledby={`staff-edit-tab-${index}`} // Changed from teacher-edit-tab
    {...other}
  >
    {value === index && children}
  </div>
);

/** ---------- component ---------- */

interface StaffEditModalProps { // Changed from TeacherEditModalProps
  open: boolean;
  onClose: () => void;
  /**
   * ‑ `undefined | null` ⇒ Create mode  
   * ‑ `Staff`          ⇒ Edit mode // Changed from Teacher
   */
  staff?: Staff | null; // Changed from teacher?: Teacher | null;
}


const StaffFormModal = memo(({ open, onClose, staff }: StaffEditModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  /* master‑data selectors */
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);
  const maritalStatuses = useAppSelector(selectMaritalStatuses);
  const relations = useAppSelector(selectRelations);
  const designations = useAppSelector(selectDesignations);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  const { loading } = useAppSelector(selectStaffState); // Changed from selectTeacherState

  /* fetch master‑data once where missing */
  useEffect(() => {
    dispatch(fetchAllSimpleEntities());
    dispatch(fetchAllAcademicEntities());
    dispatch(fetchAllGeographyData());
  }, [dispatch]);

  /* form */
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({ // Changed from TeacherFormData
    resolver: zodResolver(staffSchema), // Changed from teacherSchema
    defaultValues: {
      /** keep all defaults identical to Register page */
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      fatherName: '',
      motherName: '',
      mobileNumber: '',
      emailAddress: '',
      emergencyContact: '',
      nidNumber: '',
      birthRegNumber: '',
      photoUrl: '',
      genderId: '',
      bloodGroupId: '',
      religion: '',
      nationalityId: '',
      maritalStatusId: '',
      presentAddress: {},
      permanentAddress: {},
      sameAsPresent: false,
      educationalQualifications: [
        { degreeName: '', institution: '', year: '', grade: '', documentUrl: '' },
      ],
      professionalExperience: [],
      references: [],
      salaryExpectation: undefined,
      joiningDate: '',
      digitalSignatureUrl: '',
      yearsOfExperience: undefined,
      noticePeriod: '',
      designationIds: [],
      subjectIds: [],
      gradeLevelIds: [],
      languageProficiencyIds: [],
      computerSkills: '',
      teachingMethodology: '',
      onlineProfiles: { linkedin: '', personalWebsite: '' },
      details: '',
      status: 'PENDING',
    },
  });

  /* dynamic arrays */
  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } =
    useFieldArray({ control, name: 'educationalQualifications' });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } =
    useFieldArray({ control, name: 'professionalExperience' });
  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control,
    name: 'references',
  });

  /* tab state */
  const [activeTab, setActiveTab] = useState(0);
  const a11yProps = (index: number) => ({
    id: `staff-edit-tab-${index}`, // Changed from teacher-edit-tab
    'aria-controls': `staff-edit-tabpanel-${index}`, // Changed from teacher-edit-tabpanel
  });

  /* photo preview */
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  /* sync sameAsPresent */
  const sameAsPresent = watch('sameAsPresent');
  const presentAddress = watch('presentAddress');
  useEffect(() => {
    if (sameAsPresent) setValue('permanentAddress', presentAddress);
  }, [sameAsPresent, presentAddress, setValue]);

  /* initialise form on modal open / staff change */ // Changed from teacher change
  useEffect(() => {
    if (!open) return;

    if (staff) { // Changed from teacher
      const { birthRegNumber, ...restStaff } = staff as any; // Changed from teacher as any; // old typo guard
      const mapped: StaffFormData = { // Changed from TeacherFormData
        ...restStaff,
        birthRegNumber: staff.birthRegNumber ?? staff.birthRegNumber ?? '', // Changed from teacher.birthRegNumber

        salaryExpectation: staff.salaryExpectation ?? undefined, // Changed from teacher.salaryExpectation
        yearsOfExperience: staff.yearsOfExperience ?? undefined, // Changed from teacher.yearsOfExperience
      } as unknown as StaffFormData; // Changed from TeacherFormData

      reset(mapped);
      setPhotoPreview(mapped.photoUrl || null);
    } else {
      reset(); // create mode fresh
      setPhotoPreview(null);
    }
    setActiveTab(0);
  }, [open, staff, reset]); // Changed from teacher

  /** ------- photo upload -------- */
  const handlePhotoUpload = async (file: File) => {
    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      showToast(validation.error!, 'error');
      return;
    }
    const res = await uploadPhoto(file);
    if (res.success && res.url) {
      setValue('photoUrl', res.url);
      setPhotoPreview(res.url);
    } else showToast(res.error || 'Upload failed', 'error');
  };

  /** ------- submit handler -------- */
  const onSubmit = async (formData: StaffFormData) => { // Changed from TeacherFormData
    try {
      if (staff) { // Changed from teacher
        /* EDIT mode */
        const diff = getChangedFields<StaffFormData>(staff as unknown as StaffFormData, formData); // Changed from TeacherFormData

        if (Object.keys(diff).length === 0) {
          showToast('No changes detected', 'info');
          return;
        }

        await dispatch(
          updateStaff({ id: staff.id, data: diff as UpdateStaffDto }), // Changed from updateTeacher and teacher.id and UpdateTeacherDto
        ).unwrap();
        showToast(`Staff ${SUCCESS_MESSAGES.UPDATED}`, 'success'); // Changed from Teacher
      } else {
        /* CREATE mode */
        await dispatch(createStaff(formData as CreateStaffDto)).unwrap(); // Changed from createTeacher and CreateTeacherDto
        showToast(`Staff ${SUCCESS_MESSAGES.CREATED}`, 'success'); // Changed from Teacher
      }
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  /** ------- UI -------- */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{staff ? 'Edit Staff' : 'Add Staff'}</Typography> {/* Changed from Edit Teacher / Add Teacher */}
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="Personal" {...a11yProps(0)} />
            <Tab label="Education" {...a11yProps(1)} />
            <Tab label="Experience" {...a11yProps(2)} />
            <Tab label="References" {...a11yProps(3)} />
            <Tab label="Employment & Skills" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ height: '70vh', overflow: 'auto' }}>
          {/* ------------ TAB 0 : PERSONAL ------------- */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Photo */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Profile Photo">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={photoPreview || undefined} sx={{ width: 80, height: 80 }}>
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      onClick={() => photoInputRef.current?.click()}
                    >
                      Upload
                    </Button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                    />
                  </Box>
                </FormSection>
              </Grid>

              {/* Basic information */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Basic Information" required>
                  <Grid container spacing={3}>
                    {/** firstName / lastName */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="First Name *" fullWidth error={!!errors.firstName} helperText={errors.firstName?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Last Name *" fullWidth error={!!errors.lastName} helperText={errors.lastName?.message} />
                        )}
                      />
                    </Grid>

                    {/** Date / Place of birth */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Date of Birth *"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="placeOfBirth"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Place of Birth" fullWidth error={!!errors.placeOfBirth} helperText={errors.placeOfBirth?.message} />
                        )}
                      />
                    </Grid>

                    {/** Parents */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="fatherName"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Father's Name *" fullWidth error={!!errors.fatherName} helperText={errors.fatherName?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="motherName"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Mother's Name" fullWidth error={!!errors.motherName} helperText={errors.motherName?.message} />
                        )}
                      />
                    </Grid>

                    {/** Contact numbers / email */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="mobileNumber"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput {...field} label="Mobile Number *" error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="emailAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Email *" type="email" fullWidth error={!!errors.emailAddress} helperText={errors.emailAddress?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="emergencyContact"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput {...field} label="Emergency Contact *" error={!!errors.emergencyContact} helperText={errors.emergencyContact?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="nidNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Nid Number" fullWidth error={!!errors.nidNumber} helperText={errors.nidNumber?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="birthRegNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Birth Certificate Number" fullWidth error={!!errors.birthRegNumber} helperText={errors.birthRegNumber?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="healthCondition"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Health Condition" fullWidth error={!!errors.healthCondition} helperText={errors.healthCondition?.message} />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Demographics */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Demographics" required>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="genderId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.genderId}>
                            <InputLabel>Gender *</InputLabel>
                            <Select {...field} label="Gender *">
                              <MenuItem value="">Select</MenuItem>
                              {genders.map((g) => (
                                <MenuItem key={g.id} value={g.id}>
                                  {g.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.genderId && (
                              <Typography variant="caption" color="error">
                                {errors.genderId.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="bloodGroupId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Blood Group</InputLabel>
                            <Select {...field} label="Blood Group">
                              <MenuItem value="">Select</MenuItem>
                              {bloodGroups.map((bg) => (
                                <MenuItem key={bg.id} value={bg.id}>
                                  {bg.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="nationalityId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.nationalityId}>
                            <InputLabel>Nationality *</InputLabel>
                            <Select {...field} label="Nationality *">
                              <MenuItem value="">Select</MenuItem>
                              {nationalities.map((n) => (
                                <MenuItem key={n.id} value={n.id}>
                                  {n.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="maritalStatusId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.maritalStatusId}>
                            <InputLabel>Marital Status *</InputLabel>
                            <Select {...field} label="Marital Status *">
                              <MenuItem value="">Select</MenuItem>
                              {maritalStatuses.map((m) => (
                                <MenuItem key={m.id} value={m.id}>
                                  {m.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="religion"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Religion</InputLabel>
                            <Select {...field} label="Religion * ">
                              <MenuItem value="">Select</MenuItem>
                              {religions.map((rlg) => (
                                <MenuItem key={rlg.id} value={rlg.id}>
                                  {rlg.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Present / Permanent address */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Present Address" required>
                  <Controller
                    name="presentAddress"
                    control={control}
                    render={({ field }) => (
                      <AddressFields value={field.value || {}} onChange={field.onChange} error={errors.presentAddress} />
                    )}
                  />
                </FormSection>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormSection title="Permanent Address" required>
                  <FormControlLabel
                    control={
                      <Controller
                        name="sameAsPresent"
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value || false} onChange={field.onChange} />}
                      />
                    }
                    label="Same as Present Address"
                  />
                  {sameAsPresent ? (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Permanent address will mirror present address
                    </Alert>
                  ) : (
                    <Controller
                      name="permanentAddress"
                      control={control}
                      render={({ field }) => (
                        <AddressFields value={field.value || {}} onChange={field.onChange} error={errors.permanentAddress} />
                      )}
                    />
                  )}
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>

          {/* ------------ TAB 1 : EDUCATION ------------- */}
          <TabPanel value={activeTab} index={1}>
            <FormSection title="Educational Qualifications" required>
              <DynamicFieldArray
                title="Qualification"
                fields={qualificationFields}
                onAdd={() =>
                  appendQualification({ degreeName: '', institution: '', year: '', grade: '', documentUrl: '' })
                }
                onRemove={removeQualification}
                minItems={1}
                maxItems={10}
                renderField={(field, idx) => (
                  <Grid container spacing={3} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${idx}.degreeName`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Degree *" fullWidth error={!!errors.educationalQualifications?.[idx]?.degreeName} helperText={errors.educationalQualifications?.[idx]?.degreeName?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${idx}.institution`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Institution *" fullWidth error={!!errors.educationalQualifications?.[idx]?.institution} helperText={errors.educationalQualifications?.[idx]?.institution?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${idx}.year`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Year *" fullWidth error={!!errors.educationalQualifications?.[idx]?.year} helperText={errors.educationalQualifications?.[idx]?.year?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`educationalQualifications.${idx}.grade`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Result/Grade *" fullWidth error={!!errors.educationalQualifications?.[idx]?.grade} helperText={errors.educationalQualifications?.[idx]?.grade?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`educationalQualifications.${idx}.documentUrl`}
                        control={control}
                        render={({ field }) => (
                          <FileUpload value={field.value ? [field.value] : []} onChange={(v) => field.onChange(v[0] || '')} accept="application/pdf,image/*" maxFiles={1} />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </FormSection>
          </TabPanel>

          {/* ------------ TAB 2 : EXPERIENCE ------------- */}
          <TabPanel value={activeTab} index={2}>
            <FormSection title="Professional Experience">
              <DynamicFieldArray
                title="Experience"
                fields={experienceFields}
                onAdd={() =>
                  appendExperience({
                    companyName: '',
                    jobTitle: '',
                    startDate: '',
                    endDate: '',
                    responsibilities: '',
                    achievements: '',
                  })
                }
                onRemove={removeExperience}
                minItems={0}
                maxItems={10}
                renderField={(field, idx) => (
                  <Grid container spacing={3} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${idx}.companyName`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Company *" fullWidth error={!!errors.professionalExperience?.[idx]?.companyName} helperText={errors.professionalExperience?.[idx]?.companyName?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${idx}.jobTitle`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Job Title *" fullWidth error={!!errors.professionalExperience?.[idx]?.jobTitle} helperText={errors.professionalExperience?.[idx]?.jobTitle?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${idx}.startDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Start Date *" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.professionalExperience?.[idx]?.startDate} helperText={errors.professionalExperience?.[idx]?.startDate?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`professionalExperience.${idx}.endDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.professionalExperience?.[idx]?.endDate} helperText={errors.professionalExperience?.[idx]?.endDate?.message || 'Leave empty if current'} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`professionalExperience.${idx}.responsibilities`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Responsibilities *" multiline rows={3} fullWidth error={!!errors.professionalExperience?.[idx]?.responsibilities} helperText={errors.professionalExperience?.[idx]?.responsibilities?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`professionalExperience.${idx}.achievements`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Achievements" multiline rows={2} fullWidth error={!!errors.professionalExperience?.[idx]?.achievements} helperText={errors.professionalExperience?.[idx]?.achievements?.message} />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </FormSection>
          </TabPanel>

          {/* ------------ TAB 3 : REFERENCES ------------- */}
          <TabPanel value={activeTab} index={3}>
            <FormSection title="References">
              <DynamicFieldArray
                title="Reference"
                fields={referenceFields}
                onAdd={() =>
                  appendReference({ name: '', relationship: '', contactNumber: '', email: '', recommendationLetterUrl: '' })
                }
                onRemove={removeReference}
                minItems={0}
                maxItems={5}
                renderField={(field, idx) => (
                  <Grid container spacing={3} key={field.id}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${idx}.name`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Name *" fullWidth error={!!errors.references?.[idx]?.name} helperText={errors.references?.[idx]?.name?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${idx}.relationship`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.references?.[idx]?.relationship}>
                            <InputLabel>Relationship *</InputLabel>
                            <Select {...field} label="Relationship *">
                              <MenuItem value="">Select</MenuItem>
                              {relations.map((r) => (
                                <MenuItem key={r.id} value={r.name}>
                                  {r.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${idx}.contactNumber`}
                        control={control}
                        render={({ field }) => (
                          <PhoneInput {...field} label="Contact *" error={!!errors.references?.[idx]?.contactNumber} helperText={errors.references?.[idx]?.contactNumber?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`references.${idx}.email`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Email" type="email" fullWidth error={!!errors.references?.[idx]?.email} helperText={errors.references?.[idx]?.email?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`references.${idx}.recommendationLetterUrl`}
                        control={control}
                        render={({ field }) => (
                          <FileUpload value={field.value ? [field.value] : []} onChange={(v) => field.onChange(v[0] || '')} accept="application/pdf,image/*" maxFiles={1} />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </FormSection>
          </TabPanel>

          {/* ------------ TAB 4 : EMPLOYMENT & SKILLS ------------- */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              {/* Employment details */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Employment Details">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="salaryExpectation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Salary Expectation (BDT)"
                            type="number"
                            fullWidth
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            error={!!errors.salaryExpectation}
                            helperText={errors.salaryExpectation?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="joiningDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Preferred Joining Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.joiningDate}
                            helperText={errors.joiningDate?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="yearsOfExperience"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Years of Experience"
                            type="number"
                            fullWidth
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            error={!!errors.yearsOfExperience}
                            helperText={errors.yearsOfExperience?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="noticePeriod"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Notice Period" fullWidth error={!!errors.noticePeriod} helperText={errors.noticePeriod?.message} />
                        )}
                      />
                    </Grid>

                    {/* Designations */}
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="designationIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Designations *"
                            options={designations.map((d) => ({ value: d.id, label: d.name }))}
                            error={!!errors.designationIds}
                            helperText={errors.designationIds?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="digitalSignatureUrl"
                        control={control}
                        render={({ field }) => (
                          <FileUpload value={field.value ? [field.value] : []} onChange={(v) => field.onChange(v[0] || '')} accept="image/*" maxFiles={1} />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Teaching Specialisation */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Teaching Specialisation" required>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="subjectIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Subjects *"
                            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                            error={!!errors.subjectIds}
                            helperText={errors.subjectIds?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="gradeLevelIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Grade Levels *"
                            options={gradeLevels.map((gl) => ({ value: gl.id, label: gl.name }))}
                            error={!!errors.gradeLevelIds}
                            helperText={errors.gradeLevelIds?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="languageProficiencyIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectChips
                            {...field}
                            label="Language Proficiencies"
                            options={languageProficiencies.map((lp) => ({ value: lp.id, label: lp.name }))}
                            error={!!errors.languageProficiencyIds}
                            helperText={errors.languageProficiencyIds?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>

              {/* Skills & extra */}
              <Grid size={{ xs: 12 }}>
                <FormSection title="Skills & Competencies">
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="computerSkills"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Computer / ICT Skills"
                            multiline
                            rows={3}
                            fullWidth
                            error={!!errors.computerSkills}
                            helperText={errors.computerSkills?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="teachingMethodology"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Teaching Methodology Training"
                            multiline
                            rows={3}
                            fullWidth
                            error={!!errors.teachingMethodology}
                            helperText={errors.teachingMethodology?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="onlineProfiles.linkedin"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="LinkedIn" fullWidth error={!!(errors.onlineProfiles as any)?.linkedin} helperText={(errors.onlineProfiles as any)?.linkedin?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="onlineProfiles.personalWebsite"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Personal Website" fullWidth error={!!(errors.onlineProfiles as any)?.personalWebsite} helperText={(errors.onlineProfiles as any)?.personalWebsite?.message} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name="details"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Additional Details" fullWidth multiline rows={4} error={!!errors.details} helperText={errors.details?.message} />
                        )}
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading || isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? t('common.loading') : staff ? t('common.save') : t('common.add')} {/* Changed from teacher */}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

StaffFormModal.displayName = 'StaffFormModal'; // Changed from TeacherFormModal';

export { StaffFormModal }; // Changed from TeacherFormModal