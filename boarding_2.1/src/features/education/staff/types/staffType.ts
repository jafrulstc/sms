import type { BaseEntity, Status } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';


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




/**
 * Staff entity interface
 */
export interface Staff extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  fatherName: string; //change
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nidNumber?: string; // change
  birthRegNumber?: string; // change
  photoUrl?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religion: string;
  healthCondition?: string;
  nationalityId: string; //change
  maritalStatusId: string; //change

  // Address Information
  presentAddress: Address; // change
  permanentAddress: Address; // change
  sameAsPresent?: boolean;

  // Educational Qualifications
  educationalQualifications: EducationalQualification[];

  // Professional Experience
  professionalExperience?: ProfessionalExperience[]; // change

  // References & Testimonials
  references?: Reference[]; // change

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  designationIds: string[]; // change

  // Teaching Specialization
  subjectIds: string[];
  gradeLevelIds: string[];
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
  status: Status; // change
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
  fatherName?: string;
  motherName?: string;
  mobileNumber: string;
  emailAddress: string;
  emergencyContact?: string;
  nidNumber?: string; // change
  birthRegNumber?: string; // change
  photoUrl?: string;

  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religion: string;
  healthCondition?: string;
  nationalityId: string; // change
  maritalStatusId?: string;


  // Address Information
  presentAddress: Address; // change
  permanentAddress: Address; // change
  sameAsPresent?: boolean;

  // Educational Qualifications
  educationalQualifications: Omit<EducationalQualification, 'id'>[];

  // Professional Experience
  professionalExperience?: Omit<ProfessionalExperience, 'id'>[]; // change

  // References & Testimonials
  references?: Omit<Reference, 'id'>[]; // change

  // Employment Details
  salaryExpectation?: number;
  joiningDate?: string;
  digitalSignatureUrl?: string;
  yearsOfExperience?: number;
  noticePeriod?: string;
  designationIds: string[];  // change

  // Teaching Specialization
  subjectIds: string[];
  gradeLevelIds: string[];
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
  status: Status; // change
}

/**
 * Update Staff DTO
 */
export interface UpdateStaffDto {
  // Personal Information
  firstName?: string;
  lastName?: string;
  // age?: number;
  dateOfBirth?: string;
  placeOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  emergencyContact?: string;
  nidNumber?: string; // change
  birthRegNumber?: string; // change
  photoUrl?: string;

  // Demographics
  genderId?: string;
  bloodGroupId?: string;
  religion?: string;
  healthCondition?: string;
  nationalityId?: string;
  maritalStatusId?: string;

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
  designationIds?: string[]; // Add designationId here

  // Teaching Specialization
  subjectIds?: string[];
  gradeLevelIds?: string[];
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
  status?: Status; // change
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
  designationIds?: string[]; // Add designationId here
}

/**
 * Staff with populated details
 */
export interface StaffDetail extends Staff {
  gender?: { id: string; name: string };
  bloodGroup?: { id: string; name: string };
  religion: string;
  healthCondition?: string;
  nidNumber?: string; // change
  birthRegNumber?: string; // change
  nationality?: { id: string; name: string };
  maritalStatus?: { id: string; name: string };
  relation?: { id: string; name: string };
  subjects?: { id: string; name: string }[];
  gradeLevels?: { id: string; name: string }[];
  languageProficiencies?: { id: string; name: string }[];
  designations?: { id: string; name: string }[]; // Add designation here
}