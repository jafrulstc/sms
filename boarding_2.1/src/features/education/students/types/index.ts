import type { BaseEntity, Status } from '~/shared/types/common';
import type { Address } from '~/features/core/types/geography';

/**
 * Educational File interface for file uploads
 */
export interface EducationalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
}

/**
 * Previous School Details interface
 */
export interface PreviousSchoolDetails {
  schoolName: string;
  tcNumber: string;
  tcFileUrl?: string;
  tcFileName?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  details?: string;
}

/**
 * Student entity interface
 */
export interface Student extends BaseEntity {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string; // Birth Registration Number
  
  // Demographics
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
  
  // Address Information
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  
  // File Uploads
  studentPhoto?: string;
  studentNidFile?: string;
  studentBrnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;
  
  // File names for display
  studentNidFileName?: string;
  studentBrnFileName?: string;
  fatherNidFileName?: string;
  motherNidFileName?: string;
  digitalSignatureFileName?: string;
  
  // Status
  status: Status;
  // status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
}

/**
 * Admission entity interface
 */
export interface Admission extends BaseEntity {
  // Admission Details
  admissionNumber: number;
  admissionDate: string;
  registrationNumber?: string;
  
  // Guardian Information
  guardianId?: string;
  teacherId?: string; // Used when no guardian is available
  
  // Student Information
  studentId: string;
  
  // Academic Information
  academicYearId: string;
  academicClassId: string;
  academicGroupId?: string;
  shiftId?: string;
  sectionId?: string;
  rollNumber: string;
  admissionFee: number;
  
  // Previous School Details (optional)
  previousSchoolDetails?: PreviousSchoolDetails[];
  
  // Status
  status: Status;
  // status: 'Active' | 'Inactive' | 'Cancelled' | 'Transferred';
  
  // Populated fields
  // student?: Student;
  student?: Pick<Student, 'id' | 'firstName' | 'lastName' | 'studentPhoto' > | null;
  guardian?: { id: string; name: string };
  teacher?: { id: string; firstName: string; lastName: string };
  academicYear?: { id: string; name: string };
  academicClass?: { id: string; name: string };
  academicGroup?: { id: string; name: string };
}

/**
 * Student with populated details
 */
export interface StudentDetail extends Student {
  gender?: { id: string; name: string };
  bloodGroup?: { id: string; name: string };
  religion?: { id: string; name: string };
  nationality?: { id: string; name: string };
  admissions?: Admission[];
}

/**
 * Create Student DTO
 */
export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string;
  genderId: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  studentPhoto?: string;
  studentNidFile?: string;
  studentBrnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;
  studentNidFileName?: string;
  studentBrnFileName?: string;
  fatherNidFileName?: string;
  motherNidFileName?: string;
  digitalSignatureFileName?: string;
  status: Status;
  // status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
}

/**
 * Update Student DTO
 */
export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  email?: string;
  healthCondition?: string;
  nidNumber?: string;
  brnNumber?: string;
  genderId?: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  studentPhoto?: string;
  studentNidFile?: string;
  studentBrnFile?: string;
  fatherNidFile?: string;
  motherNidFile?: string;
  digitalSignatureFile?: string;
  studentNidFileName?: string;
  studentBrnFileName?: string;
  fatherNidFileName?: string;
  motherNidFileName?: string;
  digitalSignatureFileName?: string;
  status: Status;
  // status?: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
}

/**
 * Create Admission DTO
 */
export interface CreateAdmissionDto {
  admissionDate: string;
  registrationNumber?: string;
  guardianId?: string;
  teacherId?: string;
  studentId: string;
  academicYearId: string;
  academicClassId: string;
  academicGroupId?: string;
  shiftId?: string;
  sectionId?: string;
  rollNumber: string;
  admissionFee: number;
  previousSchoolDetails?: PreviousSchoolDetails[];
  status: Status;
  // status: 'Active' | 'Inactive' | 'Cancelled' | 'Transferred';
}

/**
 * Update Admission DTO
 */
export interface UpdateAdmissionDto {
  admissionDate?: string;
  registrationNumber?: string;
  guardianId?: string;
  teacherId?: string;
  studentId?: string;
  academicYearId?: string;
  academicClassId?: string;
  academicGroupId?: string;
  shiftId?: string;
  sectionId?: string;
  rollNumber?: string;
  admissionFee?: number;
  previousSchoolDetails?: PreviousSchoolDetails[];
  status: Status;
  // status?: 'Active' | 'Inactive' | 'Cancelled' | 'Transferred';
}

/**
 * Student filters interface
 */
export interface StudentFilters {
  search?: string;
  status?: string;
  genderId?: string;
  bloodGroupId?: string;
  religionId?: string;
  nationalityId?: string;
}

/**
 * Admission filters interface
 */
export interface AdmissionFilters {
  search?: string;
  status?: string;
  academicYearId?: string;
  academicClassId?: string;
  academicGroupId?: string;
  admissionDateFrom?: string;
  admissionDateTo?: string;
}