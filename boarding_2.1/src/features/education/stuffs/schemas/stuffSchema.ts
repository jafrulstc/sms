// import { z } from 'zod';

// /** shared helpers */
// const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
// const trimString = z.preprocess((val) => {
//   if (typeof val === 'string') return val.trim();
//   return val;
// }, z.coerce);

// const optionalUrlSchema = z.preprocess((val) => {
//   if (val === '' || val === null || val === undefined) return undefined;
//   if (typeof val === 'string') return val.trim();
//   return val;
// }, z.string().url('Invalid URL')).optional();

// const optionalEmailOrEmpty = z.union([
//   z.string().email('Invalid email format'),
//   z.literal(''),
// ]).optional();

// /** Educational Qualification validation schema */
// const educationalQualificationSchema = z.object({
//   degreeName: trimString
//     .min(1, 'Degree name is required')
//     .max(200, 'Degree name must be less than 200 characters'),
//   institution: trimString
//     .min(1, 'Institution is required')
//     .max(200, 'Institution must be less than 200 characters'),
//   year: z
//     .string()
//     .trim()
//     .regex(/^\d{4}$/, 'Year must be a valid 4-digit year'),
//   grade: trimString
//     .min(1, 'Grade is required')
//     .max(50, 'Grade must be less than 50 characters'),
//   documentUrl: optionalUrlSchema,
// });

// /** Professional Experience validation schema */
// const professionalExperienceSchema = z.object({
//   companyName: trimString
//     .min(1, 'Company name is required')
//     .max(200, 'Company name must be less than 200 characters'),
//   jobTitle: trimString
//     .min(1, 'Job title is required')
//     .max(100, 'Job title must be less than 100 characters'),
//   startDate: z.preprocess((date) => {
//     if (typeof date === 'string') {
//       const parsed = new Date(date);
//       return isNaN(parsed.getTime()) ? date : parsed;
//     }
//     return date;
//   }, z.date({ invalid_type_error: 'Invalid start date format' })),
//   endDate: z
//     .preprocess((date) => {
//       if (date === undefined || date === null || date === '') return undefined;
//       if (typeof date === 'string') {
//         const parsed = new Date(date);
//         return isNaN(parsed.getTime()) ? date : parsed;
//       }
//       return date;
//     }, z.date({ invalid_type_error: 'Invalid end date format' }))
//     .optional(),
//   responsibilities: trimString
//     .min(1, 'Responsibilities are required')
//     .max(1000, 'Responsibilities must be less than 1000 characters'),
//   achievements: trimString
//     .max(1000, 'Achievements must be less than 1000 characters')
//     .optional(),
// });

// /** Reference validation schema */
// const referenceSchema = z.object({
//   name: trimString
//     .min(1, 'Name is required')
//     .max(100, 'Name must be less than 100 characters'),
//   relationship: trimString.min(1, 'Relationship is required'),
//   contactNumber: z.string()
//     .min(1, 'Contact number is required')
//     .regex(PHONE_REGEX, 'Invalid contact number format'),
//   email: optionalEmailOrEmpty,
//   recommendationLetterUrl: optionalUrlSchema,
// });

// /** Address validation schema */
// const addressSchema = z.object({
//   nationalityId: z.string(),
//   divisionId: z.string(),
//   districtId: z.string(),
//   subDistrictId: z.string(),
//   postOfficeId: z.string(),
//   villageId: z.string(),
// });

// /** Online Profiles validation schema */
// const onlineProfilesSchema = z.object({
//   linkedin: optionalUrlSchema,
//   personalWebsite: optionalUrlSchema,
// });

// /** Main Teacher validation schema */
// export const stuffSchema = z.object({
//   // Personal Information
//   firstName: trimString
//     .min(1, 'First name is required')
//     .max(50, 'First name must be less than 50 characters'),
//   lastName: trimString
//     .min(1, 'Last name is required')
//     .max(50, 'Last name must be less than 50 characters'),
//   dateOfBirth: z.preprocess((date) => {
//     if (typeof date === 'string') {
//       const parsed = new Date(date);
//       return isNaN(parsed.getTime()) ? date : parsed;
//     }
//     return date;
//   }, z.date({ invalid_type_error: 'Invalid date of birth format' })),
//   placeOfBirth: trimString
//     .max(100, 'Place of birth must be less than 100 characters')
//     .optional(),
//   fatherName: trimString
//     .min(1, 'Father name is required')
//     .max(100, 'Father name must be less than 100 characters'),
//   motherName: trimString
//     .max(100, 'Mother name must be less than 100 characters')
//     .optional(),
//   mobileNumber: z.string()
//     .min(1, 'Mobile number is required')
//     .regex(PHONE_REGEX, 'Invalid mobile number format'),
//   emailAddress: z.string()
//     .min(1, 'Email address is required')
//     .email('Invalid email format'),
//   emergencyContact: z.preprocess((val) => {
//     if (val === '' || val === undefined || val === null) return undefined;
//     return val;
//   }, z.string().regex(PHONE_REGEX, 'Invalid emergency contact format')).optional(),
//   photoUrl: optionalUrlSchema,

//   // Demographics
//   genderId: z.string().min(1, 'Gender is required'),
//   bloodGroupId: z.string().optional(),
//   nationalityId: z.string().min(1, 'Nationality is required'),
//   maritalStatusId: z.string().optional(),

//   // Address Information
//   presentAddress: addressSchema,
//   permanentAddress: addressSchema,
//   sameAsPresent: z.boolean().optional(),

//   // Educational Qualifications
//   educationalQualifications: z.array(educationalQualificationSchema).optional(),

//   // Professional Experience
//   professionalExperience: z.array(professionalExperienceSchema).optional(),

//   // References & Testimonials
//   references: z.array(referenceSchema).optional(),

//   // Employment Details
//   salaryExpectation: z.preprocess((val) => {
//     if (typeof val === 'string' && val.trim() !== '') return Number(val);
//     return val;
//   }, z.number().min(0, 'Salary expectation must be positive')).optional(),
//   joiningDate: z
//     .preprocess((date) => {
//       if (!date || date === '') return undefined;
//       if (typeof date === 'string') {
//         const parsed = new Date(date);
//         return isNaN(parsed.getTime()) ? date : parsed;
//       }
//       return date;
//     }, z.date({ invalid_type_error: 'Invalid joining date format' }))
//     .optional(),
//   digitalSignatureUrl: optionalUrlSchema,
//   yearsOfExperience: z.preprocess((val) => {
//     if (typeof val === 'string' && val.trim() !== '') return Number(val);
//     return val;
//   }, z.number().min(0, 'Years of experience must be positive').max(50, 'Years of experience must be less than 50')).optional(),
//   noticePeriod: trimString
//     .max(100, 'Notice period must be less than 100 characters')
//     .optional(),
//   jobRuleIds: z.array(z.string())
//     .min(1, 'At least one Job Rule is required'),

//   // Teaching Specialization
//   languageProficiencyIds: z.array(z.string()).optional(),

//   // Skills & Competencies
//   computerSkills: trimString
//     .max(500, 'Computer skills must be less than 500 characters')
//     .optional(),
//   teachingMethodology: trimString
//     .max(500, 'Teaching methodology must be less than 500 characters')
//     .optional(),
//   onlineProfiles: onlineProfilesSchema.optional(),

//   // Additional Information
//   details: trimString
//     .max(1000, 'Details must be less than 1000 characters')
//     .optional(),
//   status: z.enum(['Active', 'Inactive', 'Pending'], {
//     required_error: 'Status is required',
//   }),
// });

// export type stuffFormData = z.infer<typeof stuffSchema>;


// // import { z } from 'zod';

// // /**
// //  * Educational Qualification validation schema
// //  */
// // const educationalQualificationSchema = z.object({
// //   degreeName: z.string()
// //     .min(1, 'Degree name is required')
// //     .max(200, 'Degree name must be less than 200 characters'),
// //   institution: z.string()
// //     .min(1, 'Institution is required')
// //     .max(200, 'Institution must be less than 200 characters'),
// //   year: z.string()
// //     .min(1, 'Year is required')
// //     .regex(/^\d{4}$/, 'Year must be a valid 4-digit year'),
// //   grade: z.string()
// //     .min(1, 'Grade is required')
// //     .max(50, 'Grade must be less than 50 characters'),
// //   documentUrl: z.string().optional(),
// // });

// // /**
// //  * Professional Experience validation schema
// //  */
// // const professionalExperienceSchema = z.object({
// //   companyName: z.string()
// //     .min(1, 'Company name is required')
// //     .max(200, 'Company name must be less than 200 characters'),
// //   jobTitle: z.string()
// //     .min(1, 'Job title is required')
// //     .max(100, 'Job title must be less than 100 characters'),
// //   startDate: z.string()
// //     .min(1, 'Start date is required')
// //     .refine((date) => !isNaN(Date.parse(date)), {
// //       message: 'Invalid start date format',
// //     }),
// //   endDate: z.string()
// //     .optional()
// //     .refine((date) => !date || !isNaN(Date.parse(date)), {
// //       message: 'Invalid end date format',
// //     }),
// //   responsibilities: z.string()
// //     .min(1, 'Responsibilities are required')
// //     .max(1000, 'Responsibilities must be less than 1000 characters'),
// //   achievements: z.string()
// //     .max(1000, 'Achievements must be less than 1000 characters')
// //     .optional(),
// // });

// // /**
// //  * Reference validation schema
// //  */
// // const referenceSchema = z.object({
// //   name: z.string()
// //     .min(1, 'Name is required')
// //     .max(100, 'Name must be less than 100 characters'),
// //   relationship: z.string()
// //   .min(1, 'At least one Relation is required')
// //   ,
// //   contactNumber: z.string()
// //     .min(1, 'Contact number is required')
// //     .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid contact number format'),
// //   email: z.string()
// //     .email('Invalid email format')
// //     .optional()
// //     .or(z.literal('')),
// //   recommendationLetterUrl: z.string().optional(),
// // });

// // /**
// //  * Address validation schema
// //  */
// // const addressSchema = z.object({
// //   nationalityId: z.string(),
// //   divisionId: z.string(),
// //   districtId: z.string(),
// //   subDistrictId: z.string(),
// //   postOfficeId: z.string(),
// //   villageId: z.string(),
// // });

// // /**
// //  * Online Profiles validation schema
// //  */
// // const onlineProfilesSchema = z.object({
// //   linkedin: z.string()
// //     .url('Invalid LinkedIn URL')
// //     .optional()
// //     .or(z.literal('')),
// //   personalWebsite: z.string()
// //     .url('Invalid website URL')
// //     .optional()
// //     .or(z.literal('')),
// // });

// // /**
// //  * Main Teacher validation schema
// //  */
// // export const teacherSchema = z.object({
// //   // Personal Information
// //   firstName: z.string()
// //     .min(1, 'First name is required')
// //     .max(50, 'First name must be less than 50 characters')
// //     .trim(),
// //   lastName: z.string()
// //     .min(1, 'Last name is required')
// //     .max(50, 'Last name must be less than 50 characters')
// //     .trim(),
// //   dateOfBirth: z.string()
// //     .min(1, 'Date of birth is required')
// //     .refine((date) => !isNaN(Date.parse(date)), {
// //       message: 'Invalid date of birth format',
// //     }),
// //   placeOfBirth: z.string()
// //     .max(100, 'Place of birth must be less than 100 characters')
// //     .optional(),
// //   fatherName: z.string()
// //     .max(100, 'Father name must be less than 100 characters')
// //     .min(1, 'Father name must be grater than 1 character'),
// //   motherName: z.string()
// //     .max(100, 'Mother name must be less than 100 characters')
// //     .optional(),
// //   mobileNumber: z.string()
// //     .min(1, 'Mobile number is required')
// //     .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid mobile number format'),
// //   emailAddress: z.string()
// //     .min(1, 'Email address is required')
// //     .email('Invalid email format'),
// //   emergencyContact: z.string()
// //     .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid emergency contact format')
// //     .optional()
// //     .or(z.literal('')),
// //   photoUrl: z.string().optional(),
  
// //   // Demographics
// //   genderId: z.string()
// //   .min(1, 'At least one Gender is required'),
// //   bloodGroupId: z.string().optional(),
// //   nationalityId: z.string()
// //   .min(1, 'At least one Nationality is required'),
// //   maritalStatusId: z.string().optional(),
  
  
// //   // Address Information
// //   presentAddress: addressSchema,
// //   permanentAddress: addressSchema,
// //   sameAsPresent: z.boolean().optional(),
  
// //   // Educational Qualifications
// //   educationalQualifications: z.array(educationalQualificationSchema).optional(),
  
// //   // Professional Experience
// //   professionalExperience: z.array(professionalExperienceSchema).optional(),
  
// //   // References & Testimonials
// //   references: z.array(referenceSchema).optional(),
  
// //   // Employment Details
// //   salaryExpectation: z.number()
// //     .min(0, 'Salary expectation must be positive')
// //     .optional(),
// //   joiningDate: z.string()
// //     .refine((date) => !date || !isNaN(Date.parse(date)), {
// //       message: 'Invalid joining date format',
// //     })
// //     .optional(),
// //   digitalSignatureUrl: z.string().optional(),
// //   yearsOfExperience: z.number()
// //     .min(0, 'Years of experience must be positive')
// //     .max(50, 'Years of experience must be less than 50')
// //     .optional(),
// //   noticePeriod: z.string()
// //     .max(100, 'Notice period must be less than 100 characters')
// //     .optional(),
// //     jobRuleIds: z.array(z.string())
// //     .min(1, 'At least one Job Rule is required')
// //     , // Add jobRuleId validation
  
// //   // Teaching Specialization
// //   languageProficiencyIds: z.array(z.string()).optional(),
  
// //   // Skills & Competencies
// //   computerSkills: z.string()
// //     .max(500, 'Computer skills must be less than 500 characters')
// //     .optional(),
// //   teachingMethodology: z.string()
// //     .max(500, 'Teaching methodology must be less than 500 characters')
// //     .optional(),
// //   onlineProfiles: onlineProfilesSchema.optional(),
  
// //   // Additional Information
// //   details: z.string()
// //     .max(1000, 'Details must be less than 1000 characters')
// //     .optional(),
// //   status: z.enum(['Active', 'Inactive', 'Pending'], {
// //     required_error: 'Status is required',
// //   }),
// // })


// // export type TeacherFormData = z.infer<typeof teacherSchema>;