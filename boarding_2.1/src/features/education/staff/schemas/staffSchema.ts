import { z } from 'zod';

/**
 * Educational Qualification validation schema
 */
const educationalQualificationSchema = z.object({
  degreeName: z.string()
    .min(1, 'Degree name is required')
    .max(200, 'Degree name must be less than 200 characters'),
  institution: z.string()
    .min(1, 'Institution is required')
    .max(200, 'Institution must be less than 200 characters'),
  year: z.string()
    .min(1, 'Year is required')
    .regex(/^\d{4}$/, 'Year must be a valid 4-digit year'),
  grade: z.string()
    .min(1, 'Grade is required')
    .max(50, 'Grade must be less than 50 characters'),
  documentUrl: z.string().optional(),
});

/**
 * Professional Experience validation schema
 */
const professionalExperienceSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters'),
  jobTitle: z.string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date format',
    }),
  endDate: z.string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid end date format',
    }),
  responsibilities: z.string()
    .min(1, 'Responsibilities are required')
    .max(1000, 'Responsibilities must be less than 1000 characters'),
  achievements: z.string()
    .max(1000, 'Achievements must be less than 1000 characters')
    .optional(),
});

/**
 * Reference validation schema
 */
const referenceSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  relationship: z.string()
    .min(1, 'Relationship is required')
    .max(100, 'Relationship must be less than 100 characters'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid contact number format'),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  recommendationLetterUrl: z.string().optional(),
});

/**
 * Address validation schema
 */
const addressSchema = z.object({
  nationalityId: z.string().optional(),
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  subDistrictId: z.string().optional(),
  postOfficeId: z.string().optional(),
  villageId: z.string().optional(),
});

/**
 * Online Profiles validation schema
 */
const onlineProfilesSchema = z.object({
  linkedin: z.string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  personalWebsite: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
});

/**
 * Main Staff validation schema // Changed from Teacher validation schema
 */
export const staffSchema = z.object({ // Changed from teacherSchema
  // Personal Information
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date of birth format',
    }),
  placeOfBirth: z.string()
    .max(100, 'Place of birth must be less than 100 characters')
    .optional(),
  // ব্যক্তিগত তথ্য
  fatherName: z.string() // অপশনাল → রিকোয়ার্ড
    .min(1, 'Father name is required')
    .max(100, 'Father name must be less than 100 characters'),

  motherName: z.string()
    .min(1, 'Father name is required')
    .max(100, 'Father name must be less than 100 characters')
    .optional()
  ,
  mobileNumber: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid mobile number format'),

  emailAddress: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email format'),
  emergencyContact: z.string(),
  nidNumber: z.string()
    .max(20, 'National ID number must be less than 10 characters')
    .optional(),
  birthRegNumber: z.string()
    .max(20, 'Birth registration number must be less than 10 characters')
    .optional(),

  // জনতাত্ত্বিক তথ্য
  nationalityId: z.string() // অপশনাল → রিকোয়ার্ড
    .min(1, 'Nationality is required'),
  photoUrl: z.string().optional(),
  genderId: z.string().min(1, 'Gender is required'),
  bloodGroupId: z.string().optional(),
  religion: z.string() 
    .max(20, 'Religion must be less than 20'),
  healthCondition: z.string() 
    .max(20, 'Health Condition must be less than 20')
    .optional(),
  maritalStatusId: z.string() // অপশনাল → রিকোয়ার্ড
    .min(1, 'Marital status is required'),

  // অপসারণ: nationalId, relationId

  // ঠিকানা
  presentAddress: addressSchema, // অপশনাল → রিকোয়ার্ড
  permanentAddress: addressSchema, // অপশনাল → রিকোয়ার্ড
  sameAsPresent: z.boolean().optional(),

  // Educational Qualifications
  educationalQualifications: z.array(educationalQualificationSchema),

  // পেশাগত অভিজ্ঞতা (রিকোয়ার্ড → অপশনাল)
  professionalExperience: z.array(professionalExperienceSchema).optional(),

  // রেফারেন্স (রিকোয়ার্ড → অপশনাল)
  references: z.array(referenceSchema).optional(),

  // Employment Details
  salaryExpectation: z.number()
    .min(0, 'Salary expectation must be positive')
    .optional(),
  joiningDate: z.string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Invalid joining date format',
    })
    .optional(),
  digitalSignatureUrl: z.string().optional(),
  yearsOfExperience: z.number()
    .min(0, 'Years of experience must be positive')
    .max(50, 'Years of experience must be less than 50')
    .optional(),
  noticePeriod: z.string()
    .max(100, 'Notice period must be less than 100 characters')
    .optional(),
  // চাকুরির বিবরণ
  designationIds: z.array(z.string()) // অপশনাল → রিকোয়ার্ড
    .min(1, 'At least one designation is required'),

  // Teaching Specialization
  subjectIds: z.array(z.string())
    .min(1, 'At least one subject is required'),
  gradeLevelIds: z.array(z.string())
    .min(1, 'At least one grade level is required'),
  languageProficiencyIds: z.array(z.string()),

  // Skills & Competencies
  computerSkills: z.string()
    .max(500, 'Computer skills must be less than 500 characters')
    .optional(),
  teachingMethodology: z.string()
    .max(500, 'Teaching methodology must be less than 500 characters')
    .optional(),
  onlineProfiles: onlineProfilesSchema.optional(),

  // Additional Information
  details: z.string()
    .max(1000, 'Details must be less than 1000 characters')
    .optional(),

  // স্ট্যাটাস আপডেট
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVE'], {
    required_error: 'Status is required',
  }),
}).refine((data) => {
  // If end date is provided, it should be after start date for each experience
  return !data.professionalExperience || data.professionalExperience.every(exp => {
    if (!exp.endDate) return true;
    return new Date(exp.startDate) < new Date(exp.endDate);
  });
}, {
  message: 'End date must be after start date',
  path: ['professionalExperience'],
});

export type StaffFormData = z.infer<typeof staffSchema>; // Changed from TeacherFormData