import { z } from 'zod';
import { StatusEnum } from '~/shared/schemas/shareSchemas';

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
 * Student validation schema
 */
export const studentSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  fatherName: z.string()
    .min(1, 'Father name is required')
    .max(100, 'Father name must be less than 100 characters')
    .trim(),
  motherName: z.string()
    .min(1, 'Mother name is required')
    .max(100, 'Mother name must be less than 100 characters')
    .trim(),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date of birth format',
    }),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  healthCondition: z.string()
    .max(500, 'Health condition must be less than 500 characters')
    .optional(),
  nidNumber: z.string()
    .max(20, 'NID number must be less than 20 characters')
    .optional(),
  brnNumber: z.string()
    .max(20, 'BRN number must be less than 20 characters')
    .optional(),
  
  // Demographics
  genderId: z.string().min(1, 'Gender is required'),
  bloodGroupId: z.string().optional(),
  religionId: z.string().optional(),
  nationalityId: z.string().optional(),
  
  // Address Information
  presentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  sameAsPresent: z.boolean().optional(),
  
  // File Uploads
  studentPhoto: z.string().optional(),
  studentNidFile: z.string().optional(),
  studentBrnFile: z.string().optional(),
  fatherNidFile: z.string().optional(),
  motherNidFile: z.string().optional(),
  digitalSignatureFile: z.string().optional(),
  
  // File names for display
  studentNidFileName: z.string().optional(),
  studentBrnFileName: z.string().optional(),
  fatherNidFileName: z.string().optional(),
  motherNidFileName: z.string().optional(),
  digitalSignatureFileName: z.string().optional(),
  
  // Status
  // status: z.enum(['Active', 'Inactive', 'Graduated', 'Transferred'], {
  //   required_error: 'Status is required',
  // }),
  status: StatusEnum
});

export type StudentFormData = z.infer<typeof studentSchema>;