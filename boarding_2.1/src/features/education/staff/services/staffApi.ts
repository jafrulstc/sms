import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Staff, // Changed from Teacher
  CreateStaffDto, // Changed from CreateTeacherDto
  UpdateStaffDto, // Changed from UpdateTeacherDto
  StaffFilters, // Changed from TeacherFilters
  StaffDetail, // Changed from TeacherDetail, // Import StaffDetail
} from '../types/staffType'; // File path remains staffType
import type { PaginatedResponse } from '~/shared/types/common';
import { generalApi } from '~/features/core/services/generalApi'; // Import generalApi to get designations

/**
 * Mock data for development
 */
// const mockStaff: Staff[] = [ // Changed from mockTeachers: Teacher[]
//   {
//     id: 't1',
//     firstName: 'Sofiqur(Staff)',
//     lastName: 'Rahman',
//     dateOfBirth: '1985-05-15',
//     placeOfBirth: 'Dhaka, Bangladesh',
//     fatherName: 'Mohammad Rahman',
//     motherName: 'Fatima Rahman',
//     mobileNumber: '01712345678',
//     emailAddress: 'ahmed.rahman@email.com',
//     emergencyContact: '01812987654',
//     photoUrl: '',

//     // Demographics
//     genderId: 'g1', // Male
//     bloodGroupId: 'bg1', // A+
//     religion: 'r1',
//     healthCondition: 'fhgh',
//     nationalityId: 'n1', // Bangladesh
//     maritalStatusId: 'ms2', // Married

//     // Address Information
//     presentAddress: {
//       nationalityId: 'n1',
//       divisionId: 'd1',
//       districtId: 'dt1',
//       subDistrictId: 'sd1',
//       postOfficeId: 'po1',
//       villageId: 'v1',
//     },
//     permanentAddress: {
//       nationalityId: 'n1',
//       divisionId: 'd1',
//       districtId: 'dt1',
//       subDistrictId: 'sd1',
//       postOfficeId: 'po1',
//       villageId: 'v1',
//     },
//     sameAsPresent: true,

//     // Educational Qualifications
//     educationalQualifications: [
//       {
//         id: 'eq1',
//         degreeName: 'Bachelor of Science in Mathematics',
//         institution: 'University of Dhaka',
//         year: '2007',
//         grade: 'First Class',
//         documentUrl: '',
//       },
//       {
//         id: 'eq2',
//         degreeName: 'Master of Science in Mathematics',
//         institution: 'University of Dhaka',
//         year: '2009',
//         grade: 'First Class',
//         documentUrl: '',
//       },
//     ],

//     // Professional Experience
//     professionalExperience: [
//       {
//         id: 'pe1',
//         companyName: 'ABC High School',
//         jobTitle: 'Mathematics Staff', // Changed from Mathematics Teacher
//         startDate: '2010-01-01',
//         endDate: '2015-12-31',
//         responsibilities: 'Teaching mathematics to grades 9-12, preparing lesson plans, conducting assessments',
//         achievements: 'Improved student performance by 25% in board examinations',
//       },
//       {
//         id: 'pe2',
//         companyName: 'XYZ College',
//         jobTitle: 'Senior Mathematics Staff', // Changed from Senior Mathematics Teacher
//         startDate: '2016-01-01',
//         responsibilities: 'Teaching advanced mathematics, mentoring junior staff, curriculum development', // Changed from junior teachers
//         achievements: 'Developed innovative teaching methods that increased student engagement',
//       },
//     ],

//     // References
//     references: [
//       {
//         id: 'ref1',
//         name: 'Dr. Mohammad Ali',
//         relationship: 'Former Principal',
//         contactNumber: '01712111111',
//         email: 'mohammad.ali@abcschool.edu',
//         recommendationLetterUrl: '/mock/documents/recommendation-1.pdf',
//       },
//       {
//         id: 'ref2',
//         name: 'Prof. Sarah Khan',
//         relationship: 'Department Head',
//         contactNumber: '01812222222',
//         email: 'sarah.khan@xyzcollege.edu',
//       },
//     ],

//     // Employment Details
//     salaryExpectation: 50000,
//     joiningDate: '2024-01-01',
//     digitalSignatureUrl: '/mock/signatures/ahmed-signature.png',
//     yearsOfExperience: 14,
//     noticePeriod: '2 months',
//     designationIds: ['d1'], // Add designationId

//     // Teaching Specialization
//     subjectIds: ['sub1', 'sub3'], // Mathematics, Science
//     gradeLevelIds: ['gl2', 'gl3'], // Secondary, Higher Secondary
//     languageProficiencyIds: ['lp1', 'lp2'], // Bengali, English

//     // Skills & Competencies
//     computerSkills: 'Microsoft Office, Google Workspace, Educational Software',
//     teachingMethodology: 'Interactive learning, Problem-based learning, Technology integration',
//     onlineProfiles: {
//       linkedin: 'https://linkedin.com/in/ahmed-rahman',
//       personalWebsite: 'https://ahmed-math-staff.com', // Changed from ahmed-math-teacher.com
//     },

//     // Additional Information
//     details: 'Experienced mathematics staff with a passion for innovative teaching methods.', // Changed from Experienced mathematics teacher
//     status: 'ACTIVE',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 't2',
//     firstName: 'Jahangir(Staff)',
//     lastName: 'Alom',
//     dateOfBirth: '1988-08-22',
//     placeOfBirth: 'Chittagong, Bangladesh',
//     fatherName: 'Abdul Karim',
//     motherName: 'Rashida Begum',
//     mobileNumber: '01812987654',
//     emailAddress: 'fatima.begum@email.com',
//     emergencyContact: '01712345678',
//     photoUrl: '',

//     // Demographics
//     genderId: 'g2', // Female
//     bloodGroupId: 'bg3', // B+
//     religion: 'r1',
//     healthCondition: 'fhgh',
//     nationalityId: 'n1', // Bangladesh
//     maritalStatusId: 'ms1', // Single
//     // Address Information
//     presentAddress: {
//       nationalityId: 'n1',
//       divisionId: 'd1',
//       districtId: 'dt1',
//       subDistrictId: 'sd1',
//       postOfficeId: 'po1',
//       villageId: 'v1',
//     },
//     permanentAddress: {
//       nationalityId: 'n1',
//       divisionId: 'd1',
//       districtId: 'dt1',
//       subDistrictId: 'sd1',
//       postOfficeId: 'po1',
//       villageId: 'v1',
//     },
//     sameAsPresent: true,

//     // Educational Qualifications
//     educationalQualifications: [
//       {
//         id: 'eq3',
//         degreeName: 'Bachelor of Arts in English',
//         institution: 'University of Chittagong',
//         year: '2010',
//         grade: 'First Class',
//         documentUrl: '',
//       },
//     ],

//     // Professional Experience
//     professionalExperience: [
//       {
//         id: 'pe3',
//         companyName: 'DEF School',
//         jobTitle: 'English Staff', // Changed from English Teacher
//         startDate: '2011-01-01',
//         responsibilities: 'Teaching English language and literature, organizing cultural events',
//         achievements: 'Led school to win inter-school debate competition',
//       },
//     ],

//     // References
//     references: [
//       {
//         id: 'ref3',
//         name: 'Dr. Aminul Islam',
//         relationship: 'Former Supervisor',
//         contactNumber: '01713333333',
//         email: 'aminul.islam@defschool.edu',
//       },
//     ],

//     // Employment Details
//     salaryExpectation: 40000,
//     yearsOfExperience: 13,
//     noticePeriod: '1 month',
//     designationIds: ['d1'], // Add designationId

//     // Teaching Specialization
//     subjectIds: ['sub2'], // English
//     gradeLevelIds: ['gl1', 'gl2'], // Primary, Secondary
//     languageProficiencyIds: ['lp1', 'lp2'], // Bengali, English

//     // Skills & Competencies
//     computerSkills: 'Microsoft Office, Online Teaching Platforms',
//     teachingMethodology: 'Communicative approach, Literature-based learning',

//     // Additional Information
//     details: 'Dedicated English staff with expertise in language and literature.', // Changed from Dedicated English teacher
//     status: 'ACTIVE',
//     createdAt: new Date().toISOString(),
//   },
// ];


const mockStaff: Staff[] = [
  {
    id: 'st1',
    firstName: 'Hasan',
    lastName: 'Mahmud',
    religion: "r1",
    dateOfBirth: '1980-03-15',
    placeOfBirth: 'Sylhet, Bangladesh',
    fatherName: 'Mofiz Uddin',
    motherName: 'Jahanara Begum',
    mobileNumber: '+8801711991122',
    emailAddress: 'hasan.mahmud@example.com',
    emergencyContact: '+8801911445566',
    nidNumber: '1980123456789',
    birthRegNumber: '19800011223',
    photoUrl: '',

    genderId: 'g1', // Male
    bloodGroupId: 'bg7', // O+
    nationalityId: 'n1', // Bangladesh
    maritalStatusId: 'ms2', // Married

    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd3',
      districtId: 'dt3',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd3',
      districtId: 'dt3',
    },
    sameAsPresent: true,

    educationalQualifications: [
      {
        id: 'eqs1',
        degreeName: 'Diploma in Library Science',
        institution: 'Sylhet Polytechnic',
        year: '2002',
        grade: 'First Division',
        documentUrl: '',
      },
    ],

    professionalExperience: [
      {
        id: 'pes1',
        companyName: 'Sylhet Govt. College',
        jobTitle: 'Library Assistant',
        startDate: '2005-01-01',
        responsibilities: 'Managing books, records, and assisting students.',
        achievements: 'Digitized the old library catalog system.',
      },
    ],

    references: [
      {
        id: 'refs1',
        name: 'Prof. Abdul Kader',
        relationship: 'Supervisor',
        contactNumber: '+8801711552233',
        email: 'abdul.kader@sgc.edu.bd',
        recommendationLetterUrl: '',
      },
    ],

    salaryExpectation: 35000,
    joiningDate: '2025-01-01',
    digitalSignatureUrl: '',
    yearsOfExperience: 20,
    noticePeriod: '1 month',
    designationIds: ['d5'], // Librarian

    subjectIds: [], // Staff, no teaching subjects
    gradeLevelIds: [],
    languageProficiencyIds: ['lp1', 'lp2'], // Bengali, English

    computerSkills: 'Basic MS Office, Library software',
    teachingMethodology: '',
    onlineProfiles: {
      linkedin: 'https://linkedin.com/in/ahmed-rahman',
      personalWebsite: '',
    },

    details: 'Dedicated library staff with long years of service.',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },

  {
    id: 'st2',
    firstName: 'Shahidul',
    lastName: 'Islam',
    religion: "r1",
    dateOfBirth: '1975-09-22',
    placeOfBirth: 'Comilla, Bangladesh',
    fatherName: 'Abul Kashem',
    motherName: 'Nurjahan Begum',
    mobileNumber: '+8801811889900',
    emailAddress: 'shahidul.islam@example.com',
    emergencyContact: '+8801911667788',
    nidNumber: '1975123456789',
    birthRegNumber: '19750098765',
    photoUrl: '',

    genderId: 'g1',
    bloodGroupId: 'bg2', // A-
    nationalityId: 'n1',
    maritalStatusId: 'ms2',

    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    sameAsPresent: true,

    educationalQualifications: [
      {
        id: 'eqs2',
        degreeName: 'B.Com (Accounting)',
        institution: 'National University',
        year: '1996',
        grade: 'Second Class',
        documentUrl: '',
      },
    ],

    professionalExperience: [
      {
        id: 'pes2',
        companyName: 'Comilla High School',
        jobTitle: 'Accountant',
        startDate: '2000-01-01',
        responsibilities: 'Managing accounts, payroll, and financial records.',
        achievements: 'Introduced modern accounting software.',
      },
    ],

    references: [
      {
        id: 'refs2',
        name: 'Md. Rashed Khan',
        relationship: 'Headmaster',
        contactNumber: '+8801711778899',
        email: 'rashed.khan@chs.edu.bd',
        recommendationLetterUrl: '',
      },
    ],

    salaryExpectation: 40000,
    joiningDate: '2025-02-01',
    digitalSignatureUrl: '',
    yearsOfExperience: 25,
    noticePeriod: '2 months',
    designationIds: ['d4'], // Accountant

    subjectIds: [],
    gradeLevelIds: [],
    languageProficiencyIds: ['lp1', 'lp2', 'lp4'], // Bengali, English, Hindi

    computerSkills: 'Tally ERP, MS Excel, QuickBooks',
    teachingMethodology: '',
    onlineProfiles: {
      linkedin: 'https://linkedin.com/in/ahmed-rahman',
      personalWebsite: '',
    },

    details: 'Experienced accountant specialized in school finance management.',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Staff API service class
 */
class StaffApiService extends BaseApiService { // Changed from TeacherApiService
  private staff = [...mockStaff]; // Changed from teachers = [...mockTeachers]
  private mockIdCounter = 100;

  /**
   * Helper to populate designation details
   */
  // Make this method async
  private async populateStaffDetails(staff: Staff): Promise<StaffDetail> { // Changed from populateTeacherDetails(teacher: Teacher): Promise<TeacherDetail>
    const { designations } = await generalApi.getAllSimpleEntities();

    const staffDesignations = staff.designationIds.map(id => { // Changed from teacherDesignations = teacher.designationIds
      const found = designations.find(d => d.id === id);
      return found ? { id: found.id, name: found.name } : undefined;
    }).filter(Boolean) as { id: string; name: string }[];

    return {
      ...staff, // Changed from ...teacher
      designations: staffDesignations, // Changed from teacherDesignations
    };
  }

  /**
   * Get staff with pagination and filtering
   */
  async getStaff(params: { page?: number; limit?: number; filters?: StaffFilters } = {}): Promise<PaginatedResponse<StaffDetail>> { // Changed from getTeachers and TeacherDetail
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.staff]; // Changed from this.teachers

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(staff => // Changed from teacher
        staff.firstName.toLowerCase().includes(search) || // Changed from teacher.firstName
        staff.lastName.toLowerCase().includes(search) || // Changed from teacher.lastName
        staff.emailAddress.toLowerCase().includes(search) || // Changed from teacher.emailAddress
        staff.mobileNumber.includes(search) // Changed from teacher.mobileNumber
      );
    }

    if (filters.status) {
      filtered = filtered.filter(staff => staff.status === filters.status); // Changed from teacher.status
    }

    if (filters.genderId) {
      filtered = filtered.filter(staff => staff.genderId === filters.genderId); // Changed from teacher.genderId
    }

    if (filters.subjectId) {
      filtered = filtered.filter(staff => staff.subjectIds.includes(filters.subjectId!)); // Changed from teacher.subjectIds
    }

    if (filters.gradeLevelId) {
      filtered = filtered.filter(staff => staff.gradeLevelIds.includes(filters.gradeLevelId!)); // Changed from teacher.gradeLevelIds
    }

    // Designation filter আপডেট
    if (filters.designationIds && filters.designationIds.length > 0) {
      filtered = filtered.filter(staff => // Changed from teacher
        staff.designationIds.some(id => filters.designationIds!.includes(id)) // Changed from teacher.designationIds
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    // Use Promise.all to await all populateStaffDetails calls
    const dataPromises = filtered.slice(startIndex, startIndex + limit).map(t => this.populateStaffDetails(t)); // Changed from populateTeacherDetails(t)
    const data = await Promise.all(dataPromises);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Get staff by ID
   */
  async getStaffById(id: string): Promise<StaffDetail> { // Changed from getTeacherById and TeacherDetail
    await this.simulateDelay(200);
    const staff = this.staff.find(t => t.id === id); // Changed from teacher = this.teachers
    if (!staff) { // Changed from !teacher
      throw new Error('Staff not found'); // Changed from Teacher not found
    }
    // Await the asynchronous populateStaffDetails call
    return await this.populateStaffDetails(staff); // Changed from populateTeacherDetails(teacher)
  }

  /**
   * Create new staff
   */
  async createStaff(data: CreateStaffDto): Promise<Staff> { // Changed from createTeacher and CreateTeacherDto and Teacher
    await this.simulateDelay(500);

    // Generate IDs for nested arrays
    const educationalQualifications = data.educationalQualifications?.map((eq, index) => ({
      ...eq,
      id: `eq${this.mockIdCounter + index}`,
    })) || [];

    const professionalExperience = data.professionalExperience?.map((pe, index) => ({
      ...pe,
      id: `pe${this.mockIdCounter + 100 + index}`,
    })) || [];

    const references = data.references?.map((ref, index) => ({
      ...ref,
      id: `ref${this.mockIdCounter + 200 + index}`,
    })) || [];

    // Ensure required fields are present
    if (!data.fatherName) {
      throw new Error('fatherName is required');
    }

    const newStaff: Staff = { // Changed from newTeacher: Teacher
      id: `t${this.mockIdCounter++}`,
      ...data,
      // Provide default values for required fields
      fatherName: data.fatherName, // Now TypeScript knows this can't be undefined
      maritalStatusId: data.maritalStatusId ?? '', // Ensure it's always a string
      educationalQualifications,
      professionalExperience,
      references,
      createdAt: new Date().toISOString(),
    };

    this.staff = [newStaff, ...this.staff]; // Changed from this.teachers = [newTeacher, ...this.teachers]
    return newStaff; // Changed from newTeacher
  }

  /**
   * Update staff
   */
  async updateStaff(id: string, data: UpdateStaffDto): Promise<Staff> { // Changed from updateTeacher and UpdateTeacherDto and Teacher
    await this.simulateDelay(500);
    const index = this.staff.findIndex(staff => staff.id === id); // Changed from this.teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) {
      throw new Error('Staff not found'); // Changed from Teacher not found
    }

    this.staff[index] = { // Changed from this.teachers[index]
      ...this.staff[index], // Changed from this.teachers[index]
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.staff[index]; // Changed from this.teachers[index]
  }

  /**
   * Delete staff
   */
  async deleteStaff(id: string): Promise<void> { // Changed from deleteTeacher
    await this.simulateDelay(300);
    const index = this.staff.findIndex(staff => staff.id === id); // Changed from this.teachers.findIndex(teacher => teacher.id === id)
    if (index === -1) {
      throw new Error('Staff not found'); // Changed from Teacher not found
    }

    this.staff = this.staff.filter(staff => staff.id !== id); // Changed from this.teachers = this.teachers.filter(teacher => teacher.id !== id)
  }
}

export const staffApi = new StaffApiService(); // Changed from teacherApi = new TeacherApiService()