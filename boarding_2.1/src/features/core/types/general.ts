import type { BaseEntity } from '~/shared/types/common';
import { Address } from '~/features/core/types/geography';

/** ============================
 * Entity interfaces (with BaseEntity)
 * ============================ */

/** Gender entity interface */
export interface Gender extends BaseEntity {
  name: string;
}

/** Blood Group entity interface */
export interface BloodGroup extends BaseEntity {
  name: string;
}

/** Residential Status entity interface */
export interface ResidentialStatus extends BaseEntity {
  name: string;
}

/** Religion entity interface */
export interface Religion extends BaseEntity {
  name: string;
}

/** Designation entity interface */
export interface Designation extends BaseEntity {
  name: string;
}

/** Relation entity interface */
export interface Relation extends BaseEntity {
  name: string;
}

/** Marital Status entity interface */
export interface MaritalStatus extends BaseEntity {
  name: string;
}

/** Stuff entity interface */

export interface JobRule extends BaseEntity{
  name: string;
}

/** Guardian entity interface */
export interface Guardian extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}

/** ============================
 * Supporting Interfaces
 * ============================ */


/** Guardian with populated address details */
export interface GuardianDetail extends Guardian {
  presentAddressDetails?: Address;
  permanentAddressDetails?: Address;
}

/** General entity types */
export type GeneralEntityType =
  | 'gender'
  | 'bloodGroup'
  | 'residentialStatus'
  | 'religion'
  | 'designation'
  | 'guardian'
  | 'relation'
  | 'maritalStatus'
  | 'jobRule';

/** General entity union type */
export type GeneralEntity =
  | Gender
  | BloodGroup
  | ResidentialStatus
  | Religion
  | Guardian
  | Designation
  | Relation
  | MaritalStatus
  | JobRule;



/** ============================
 * DTOs — Create
 * ============================ */

export interface CreateGenderDto {
  name: string;
}

export interface CreateBloodGroupDto {
  name: string;
}

export interface CreateResidentialStatusDto {
  name: string;
}

export interface CreateReligionDto {
  name: string;
}

export interface CreateDesignationDto {
  name: string;
}

export interface CreateRelationDto {
  name: string;
}

export interface CreateMaritalStatusDto {
  name: string;
}

export interface CreateJobRuleDto {
  name: string;
}

export interface CreateGuardianDto {
  name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}

/** ============================
 * DTOs — Update
 * ============================ */

export interface UpdateGenderDto {
  name?: string;
}

export interface UpdateBloodGroupDto {
  name?: string;
}

export interface UpdateResidentialStatusDto {
  name?: string;
}

export interface UpdateReligionDto {
  name?: string;
}

export interface UpdateDesignationDto {
  name?: string;
}

export interface UpdateRelationDto {
  name?: string;
}

export interface UpdateMaritalStatusDto {
  name?: string;
}

export interface UpdateJobRuleDto {
  name?: string;
}

export interface UpdateGuardianDto {
  name?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  photoUrl?: string;
  presentAddress?: Address;
  permanentAddress?: Address;
  sameAsPresent?: boolean;
  details?: string;
}


/** General filters interface */
export interface GeneralFilters {
  search?: string;
}