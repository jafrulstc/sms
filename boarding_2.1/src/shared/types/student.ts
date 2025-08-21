import type { BaseEntity } from './common';

/**
 * Base Student interface matching the API schema
 */
export interface Student extends BaseEntity {
  firstName?: string;
  lastName?: string;
  registrationNumber?: string;
  dateOfBirth: string;
  gender?: string;
  bloodGroup?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  photoUrl?: string;
  guardianId: string;
  academicClassId: string;
  roomId?: string;
  bedId?: string;
}

/**
 * Guardian interface
 */
export interface Guardian extends BaseEntity {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  occupation?: string;
  nid?: string;
  photoUrl?: string;
}

/**
 * Academic Class interface
 */
export interface AcademicClass extends BaseEntity {
  name?: string;
  section?: string;
  academicYear?: string;
  description?: string;
  capacity: number;
  status?: string;
  students?: Student[];
}

/**
 * Create Student DTO (for hostel assignment)
 */
export interface CreateStudentDto {
  firstName?: string;
  lastName?: string;
  registrationNumber?: string;
  dateOfBirth: string;
  gender?: string;
  bloodGroup?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  photoUrl?: string;
  guardianId: string;
  academicClassId: string;
}

/**
 * Update Student DTO (for hostel management)
 */
export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  photoUrl?: string;
  roomId?: string;
  bedId?: string;
}

/**
 * Student filters for search and filtering
 */
export interface StudentFilters {
  search?: string;
  gender?: string;
  bloodGroup?: string;
  academicClass?: string;
  roomStatus?: 'assigned' | 'unassigned';
  guardian?: string;
}

/**
 * Student with detailed information (includes relations)
 */
export interface StudentDetail extends Student {
  guardian?: Guardian;
  academicClass?: AcademicClass;
  room?: {
    id: string;
    roomNumber?: string;
    floor?: string;
    building?: string;
  };
  bed?: {
    id: string;
    bedNumber?: string;
  };
}