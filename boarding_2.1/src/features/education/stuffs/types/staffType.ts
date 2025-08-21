import type { BaseEntity } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';


type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVE";
/**
 * Educational Qualification interface
 */
export interface EducationalQualification {
  id: string;
  degreeName: string;
  institution: string;
  year: string;
  grade: string;
  documentUrl?: string;
}

/**
 * Professional Experience interface
 */
export interface ProfessionalExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
  achievements?: string;
}

/**
 * Reference interface
 */
export interface Reference {
  id: string;
  name: string;
  relationship: string;
  contactNumber: string;
  email?: string;
  recommendationLetterUrl?: string;
}

export interface Skill {
  // Staff Specialization
  languageProficiencyIds: string[];

  // Skills & Competencies
  computerSkills?: string;
  teachingMethodology?: string;
  onlineProfiles?: {
    linkedin?: string;
    personalWebsite?: string;
  };

  // Additional Information
  details?: string;
}

/**
 * Staff entity interface
 */
export interface Staff extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  fatherName: string;
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  nationalityId: string;
  maritalStatusId: string;

  // Address Information
  presentAddress: Address;
  permanentAddress: Address;
  sameAsPresent?: boolean;

  // Educational Qualifications
  educationalQualifications?: EducationalQualification[];

  // Professional Experience
  professionalExperience?: ProfessionalExperience[];

  // References & Testimonials
  references?: Reference[];

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  jobRuleIds: string[]; // Add job Rule Id here
  skills: Skill;
  status: Status;
}



/**
 * Create Staff DTO
 */
export interface CreateStaffDto {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  fatherName: string;
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  nationalityId: string;
  maritalStatusId: string;

  // Address Information
  presentAddress: Address;
  permanentAddress: Address;
  sameAsPresent: boolean;

  // Educational Qualifications
  educationalQualifications?: Omit<EducationalQualification, 'id'>[];

  // Professional Experience
  professionalExperience?: Omit<ProfessionalExperience, 'id'>[];

  // References & Testimonials
  references?: Omit<Reference, 'id'>[];

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  jobRuleIds: string[];  // Add jobRuleId here

  // Staff Specialization
  languageProficiencyIds: string[];

  // Skills & Competencies
  computerSkills?: string;
  teachingMethodology?: string;
  onlineProfiles?: {
    linkedin?: string;
    personalWebsite?: string;
  };

  // Additional Information
  details?: string;
  status: Status;
}

/**
 * Update Staff DTO
 */
export interface UpdateStaffDto {
  // Personal Information
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  emergencyContact?: string;
  nationalId?: string;
  photoUrl?: string;

  // Demographics
  genderId?: string;
  bloodGroupId?: string;
  nationalityId?: string;
  maritalStatusId?: string;
  relationId?: string;

  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;

  // Educational Qualifications
  educationalQualifications?: EducationalQualification[];

  // Professional Experience
  professionalExperience?: ProfessionalExperience[];

  // References & Testimonials
  references?: Reference[];

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  jobulIds?: string[]; // Add designationId here

  // Staff Specialization

  languageProficiencyIds?: string[];

  // Skills & Competencies
  computerSkills?: string;
  teachingMethodology?: string;
  onlineProfiles?: {
    linkedin?: string;
    personalWebsite?: string;
  };

  // Additional Information
  details?: string;
  status?: Status;
}

/**
 * Staff filters interface
 */
export interface StaffFilters {
  search?: string;
  status?: string;
  genderId?: string;
  subjectId?: string;
  gradeLevelId?: string;
  jobRuleIds?: string[]; // Add jobRuleIds here
}

/**
 * Staff with populated details
 */
export interface StaffDetail extends Staff {
  gender?: { id: string; name: string };
  bloodGroup?: { id: string; name: string };
  nationality?: { id: string; name: string };
  maritalStatus?: { id: string; name: string };
  relation?: { id: string; name: string };
  languageProficiencies?: { id: string; name: string }[];
  jobRules?: { id: string; name: string }[]; // Add jobRule here
}