import React, { memo } from 'react';
import {
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  ContactPhone,
  MonetizationOn,
  CalendarToday,
  Language,
  Computer,
  Psychology,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/app/store/hooks';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectRelations,
  selectMaritalStatuses,
} from '~/features/core/store/generalSlice';

import { selectNationalities } from '~/features/core/store/geographySlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
} from '~/features/core/store/academicSlice';
import {
  selectNationalities as selectGeographyNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
} from '~/features/core/store/geographySlice';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { Teacher } from '../types';

interface TeacherDetailsModalProps {
  open: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
}

/**
 * Teacher details modal component
 */
const StuffDetailsModal = memo(({ open, onClose, teacher }: TeacherDetailsModalProps) => {
  const { t } = useTranslation();

  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const nationalities = useAppSelector(selectNationalities);
  const religions = useAppSelector(selectReligions);
  const relations = useAppSelector(selectRelations);
  const maritalStatuses = useAppSelector(selectMaritalStatuses);
  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  // Geography data
  const geographyNationalities = useAppSelector(selectGeographyNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  if (!teacher) return null;

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Not specified';
  };

  /**
   * Get multiple entity names by IDs
   */
  const getEntityNames = (entities: any[], ids: string[]): string[] => {
    return ids.map(id => getEntityName(entities, id));
  };

  /**
   * Get address string from address object
   */
  const getAddressString = (address: any): string => {
    if (!address) return 'Not specified';

    const parts = [];
    if (address.villageId) parts.push(getEntityName(villages, address.villageId));
    if (address.postOfficeId) parts.push(getEntityName(postOffices, address.postOfficeId));
    if (address.subDistrictId) parts.push(getEntityName(subDistricts, address.subDistrictId));
    if (address.districtId) parts.push(getEntityName(districts, address.districtId));
    if (address.divisionId) parts.push(getEntityName(divisions, address.divisionId));
    if (address.nationalityId) parts.push(getEntityName(geographyNationalities, address.nationalityId));

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Teacher Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={teacher.photoUrl}
                    sx={{ width: 100, height: 100 }}
                  >
                    <Person sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {teacher.firstName} {teacher.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={teacher.status}
                        color={getStatusColor(teacher.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={`${teacher.yearsOfExperience || 0} years experience`}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{teacher.emailAddress}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{formatPhoneNumber(teacher.mobileNumber)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Place of Birth"
                      secondary={teacher.placeOfBirth || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Father's Name"
                      secondary={teacher.fatherName || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mother's Name"
                      secondary={teacher.motherName || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="National ID"
                      secondary={teacher.nationalId || 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographics */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Demographics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Gender"
                      secondary={getEntityName(genders, teacher.genderId)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Blood Group"
                      secondary={teacher.bloodGroupId ? getEntityName(bloodGroups, teacher.bloodGroupId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nationality"
                      secondary={teacher.nationalityId ? getEntityName(nationalities, teacher.nationalityId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Marital Status"
                      secondary={teacher.maritalStatusId ? getEntityName(maritalStatuses, teacher.maritalStatusId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Relation"
                      secondary={teacher.relationId ? getEntityName(relations, teacher.relationId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Contact"
                      secondary={teacher.emergencyContact ? formatPhoneNumber(teacher.emergencyContact) : 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Address Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Present Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAddressString(teacher.presentAddress)}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Permanent Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {teacher.sameAsPresent 
                        ? 'Same as present address'
                        : getAddressString(teacher.permanentAddress)
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Educational Qualifications */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Educational Qualifications
                </Typography>
                {teacher.educationalQualifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {teacher.educationalQualifications.map((qualification, index) => (
                      <Grid size={{xs: 12, md: 6}} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {qualification.degreeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {qualification.institution}
                            </Typography>
                            <Typography variant="body2">
                              Year: {qualification.year} | Grade: {qualification.grade}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No educational qualifications specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Experience */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Professional Experience
                </Typography>
                {teacher.professionalExperience.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {teacher.professionalExperience.map((experience, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {experience.jobTitle} at {experience.companyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {experience.startDate} - {experience.endDate || 'Present'}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Responsibilities:</strong> {experience.responsibilities}
                          </Typography>
                          {experience.achievements && (
                            <Typography variant="body2">
                              <strong>Achievements:</strong> {experience.achievements}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No professional experience specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* References */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <ContactPhone sx={{ mr: 1, verticalAlign: 'middle' }} />
                  References
                </Typography>
                {teacher.references.length > 0 ? (
                  <Grid container spacing={2}>
                    {teacher.references.map((reference, index) => (
                      <Grid size={{xs: 12, md: 6}} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {reference.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reference.relationship}
                            </Typography>
                            <Typography variant="body2">
                              {formatPhoneNumber(reference.contactNumber)}
                            </Typography>
                            {reference.email && (
                              <Typography variant="body2">
                                {reference.email}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No references specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Teaching Specialization */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Teaching Specialization
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 4}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Subjects
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(subjects, teacher.subjectIds).map((subjectName, index) => (
                        <Chip
                          key={index}
                          label={subjectName}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid size={{xs: 12, md: 4}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Grade Levels
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(gradeLevels, teacher.gradeLevelIds).map((levelName, index) => (
                        <Chip
                          key={index}
                          label={levelName}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid size={{xs: 12, md: 4}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Language Proficiencies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(languageProficiencies, teacher.languageProficiencyIds).map((langName, index) => (
                        <Chip
                          key={index}
                          label={langName}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Employment Details */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Employment Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Salary Expectation"
                      secondary={teacher.salaryExpectation ? `৳${teacher.salaryExpectation.toLocaleString()}` : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Joining Date"
                      secondary={teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={`${teacher.yearsOfExperience || 0} years`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Notice Period"
                      secondary={teacher.noticePeriod || 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills & Competencies */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Skills & Competencies
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Computer Skills"
                      secondary={teacher.computerSkills || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Teaching Methodology"
                      secondary={teacher.teachingMethodology || 'Not specified'}
                    />
                  </ListItem>
                  {teacher.onlineProfiles?.linkedin && (
                    <ListItem>
                      <ListItemText
                        primary="LinkedIn"
                        secondary={teacher.onlineProfiles.linkedin}
                      />
                    </ListItem>
                  )}
                  {teacher.onlineProfiles?.personalWebsite && (
                    <ListItem>
                      <ListItemText
                        primary="Personal Website"
                        secondary={teacher.onlineProfiles.personalWebsite}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Details */}
          {teacher.details && (
            <Grid size={{xs: 12}}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Additional Details
                  </Typography>
                  <Typography variant="body2">
                    {teacher.details}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Metadata */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Record Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(teacher.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  {teacher.updatedAt && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {new Date(teacher.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

StuffDetailsModal.displayName = 'StuffDetailsModal';

export { StuffDetailsModal };