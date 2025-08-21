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
import type { Staff } from '../types/staffType'; // Changed from Teacher
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

interface StaffDetailsModalProps { // Changed from TeacherDetailsModalProps
  open: boolean;
  onClose: () => void;
  staff?: Staff | null; // Changed from teacher?: Teacher | null;
}

/**
 * Staff details modal component // Changed from Teacher details modal component
 */
const StaffDetailsModal = memo(({ open, onClose, staff }: StaffDetailsModalProps) => { // Changed from TeacherDetailsModal and teacher
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

  if (!staff) return null; // Changed from !teacher

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


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Staff Details {/* Changed from Teacher Details */}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={staff.photoUrl} // Changed from teacher.photoUrl
                    sx={{ width: 100, height: 100 }}
                  >
                    <Person sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {staff.firstName} {staff.lastName} {/* Changed from teacher.firstName, teacher.lastName */}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={staff.status} // Changed from teacher.status
                        color={getStatusColor(staff.status)} // Changed from teacher.status
                        variant="outlined"
                      />
                      <Chip
                        label={`${staff.yearsOfExperience || 0} years experience`} // Changed from teacher.yearsOfExperience
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{staff.emailAddress}</Typography> {/* Changed from teacher.emailAddress */}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{formatPhoneNumber(staff.mobileNumber)}</Typography> {/* Changed from teacher.mobileNumber */}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString() : 'Not specified'} // Changed from teacher.dateOfBirth
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Place of Birth"
                      secondary={staff.placeOfBirth || 'Not specified'} // Changed from teacher.placeOfBirth
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Father's Name"
                      secondary={staff.fatherName || 'Not specified'} // Changed from teacher.fatherName
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mother's Name"
                      secondary={staff.motherName || 'Not specified'} // Changed from teacher.motherName
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="National ID"
                      secondary={staff.nidNumber || 'Not specified'} // Changed from teacher.nidNumber
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Birth Certificate Number"
                      secondary={staff.birthRegNumber || 'Not specified'} // Changed from teacher.birthRegNumber
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographics */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Demographics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Gender"
                      secondary={getEntityName(genders, staff.genderId)} // Changed from teacher.genderId
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Blood Group"
                      secondary={staff.bloodGroupId ? getEntityName(bloodGroups, staff.bloodGroupId) : 'Not specified'} // Changed from teacher.bloodGroupId
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nationality"
                      secondary={staff.nationalityId ? getEntityName(nationalities, staff.nationalityId) : 'Not specified'} // Changed from teacher.nationalityId
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Marital Status"
                      secondary={staff.maritalStatusId ? getEntityName(maritalStatuses, staff.maritalStatusId) : 'Not specified'} // Changed from teacher.maritalStatusId
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Contact"
                      secondary={staff.emergencyContact ? formatPhoneNumber(staff.emergencyContact) : 'Not specified'} // Changed from teacher.emergencyContact
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Address Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Present Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAddressString(staff.presentAddress)} {/* Changed from teacher.presentAddress */}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Permanent Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {staff.sameAsPresent // Changed from teacher.sameAsPresent
                        ? 'Same as present address'
                        : getAddressString(staff.permanentAddress) // Changed from teacher.permanentAddress
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Educational Qualifications */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Educational Qualifications
                </Typography>
                {staff.educationalQualifications.length > 0 ? ( // Changed from teacher.educationalQualifications
                  <Grid container spacing={2}>
                    {staff.educationalQualifications.map((qualification, index) => ( // Changed from teacher.educationalQualifications
                      <Grid size={{ xs: 12, md: 6 }} key={index}>
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
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Professional Experience
                </Typography>
                {}
                {staff.professionalExperience ? ( // Changed from teacher.professionalExperience
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {staff.professionalExperience.map((experience, index) => ( // Changed from teacher.professionalExperience
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
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <ContactPhone sx={{ mr: 1, verticalAlign: 'middle' }} />
                  References
                </Typography>
                {staff.references ? ( // Changed from teacher.references
                  <Grid container spacing={2}>
                    {staff.references.map((reference, index) => ( // Changed from teacher.references
                      <Grid size={{ xs: 12, md: 6 }} key={index}>
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
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Teaching Specialization
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Subjects
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(subjects, staff.subjectIds).map((subjectName, index) => ( // Changed from teacher.subjectIds
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

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Grade Levels
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(gradeLevels, staff.gradeLevelIds).map((levelName, index) => ( // Changed from teacher.gradeLevelIds
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

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Language Proficiencies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(languageProficiencies, staff.languageProficiencyIds).map((langName, index) => ( // Changed from teacher.languageProficiencyIds
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
          <Grid size={{ xs: 12, md: 6 }}>
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
                      secondary={staff.salaryExpectation ? `৳${staff.salaryExpectation.toLocaleString()}` : 'Not specified'} // Changed from teacher.salaryExpectation
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Joining Date"
                      secondary={staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : 'Not specified'} // Changed from teacher.joiningDate
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Years of Experience"
                      secondary={`${staff.yearsOfExperience || 0} years`} // Changed from teacher.yearsOfExperience
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Notice Period"
                      secondary={staff.noticePeriod || 'Not specified'} // Changed from teacher.noticePeriod
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills & Competencies */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                      secondary={staff.computerSkills || 'Not specified'} // Changed from teacher.computerSkills
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Teaching Methodology"
                      secondary={staff.teachingMethodology || 'Not specified'} // Changed from teacher.teachingMethodology
                    />
                  </ListItem>
                  {staff.onlineProfiles?.linkedin && ( // Changed from teacher.onlineProfiles
                    <ListItem>
                      <ListItemText
                        primary="LinkedIn"
                        secondary={staff.onlineProfiles.linkedin} // Changed from teacher.onlineProfiles
                      />
                    </ListItem>
                  )}
                  {staff.onlineProfiles?.personalWebsite && ( // Changed from teacher.onlineProfiles
                    <ListItem>
                      <ListItemText
                        primary="Personal Website"
                        secondary={staff.onlineProfiles.personalWebsite} // Changed from teacher.onlineProfiles
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Details */}
          {staff.details && ( // Changed from teacher.details
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Additional Details
                  </Typography>
                  <Typography variant="body2">
                    {staff.details} {/* Changed from teacher.details */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Metadata */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Record Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(staff.createdAt).toLocaleString()} {/* Changed from teacher.createdAt */}
                    </Typography>
                  </Grid>
                  {staff.updatedAt && ( // Changed from teacher.updatedAt
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {new Date(staff.updatedAt).toLocaleString()} {/* Changed from teacher.updatedAt */}
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

StaffDetailsModal.displayName = 'StaffDetailsModal'; // Changed from TeacherDetailsModal';

export { StaffDetailsModal }; // Changed from TeacherDetailsModal