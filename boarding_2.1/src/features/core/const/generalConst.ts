/**
 * General module constants
 */

/** General Entity Types */
export const GENERAL_ENTITIES = {
  GENDER: 'gender',
  BLOOD_GROUP: 'bloodGroup',
  RESIDENTIAL_STATUS: 'residentialStatus',
  RELIGION: 'religion',
  DESIGNATION: 'designation',
  JOB_RULE: 'jobRule',
  GUARDIAN: 'guardian',
} as const;

export type GeneralEntityType = typeof GENERAL_ENTITIES[keyof typeof GENERAL_ENTITIES];

/** Status Types */
export const STATUS_TYPES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  ARCHIVED: 'ARCHIVE',
} as const;

export type StatusType = typeof STATUS_TYPES[keyof typeof STATUS_TYPES];

/** Entity Display Names */
export const GENERAL_ENTITY_DISPLAY_NAMES = {
  [GENERAL_ENTITIES.GENDER]: 'Gender',
  [GENERAL_ENTITIES.BLOOD_GROUP]: 'Blood Group',
  [GENERAL_ENTITIES.RESIDENTIAL_STATUS]: 'Residential Status',
  [GENERAL_ENTITIES.RELIGION]: 'Religion',
  [GENERAL_ENTITIES.DESIGNATION]: 'Designation',
  [GENERAL_ENTITIES.JOB_RULE]: 'Job Rule',
  [GENERAL_ENTITIES.GUARDIAN]: 'Guardian',
} as const;