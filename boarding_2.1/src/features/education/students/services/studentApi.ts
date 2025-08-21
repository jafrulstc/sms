import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  StudentFilters,
} from '../types';
import type { PaginatedResponse } from '~/shared/types/common';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { photos } from '../photo/studentPhoto';

/**
 * Mock data for development
 */
// const mockStudents: Student[] = [
//   {
//     id: 's1',
//     firstName: 'Rashid',
//     lastName: 'Ahmed',
//     fatherName: 'Mohammad Ahmed',
//     motherName: 'Fatima Ahmed',
//     dateOfBirth: '2008-05-15',
//     email: 'rashid.ahmed@email.com',
//     healthCondition: 'No known allergies',
//     nidNumber: '1234567890123',
//     brnNumber: 'BRN123456789',
    
//     // Demographics
//     genderId: 'g1', // Male
//     bloodGroupId: 'bg1', // A+
//     religionId: 'r1', // Islam
//     nationalityId: 'n1', // Bangladesh
    
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
    
//     // File Uploads
//     studentPhoto: '',
//     studentNidFile: '',
//     studentBrnFile: '',
//     fatherNidFile: '',
//     motherNidFile: '',
//     digitalSignatureFile: '',
//     studentNidFileName: '',
//     studentBrnFileName: '',
//     fatherNidFileName: '',
//     motherNidFileName: '',
//     digitalSignatureFileName: '',
    
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 's2',
//     firstName: 'Ayesha',
//     lastName: 'Rahman',
//     fatherName: 'Abdul Rahman',
//     motherName: 'Khadija Rahman',
//     dateOfBirth: '2009-08-22',
//     email: 'ayesha.rahman@email.com',
//     healthCondition: 'Mild asthma',
//     nidNumber: '9876543210987',
//     brnNumber: 'BRN987654321',
    
//     // Demographics
//     genderId: 'g2', // Female
//     bloodGroupId: 'bg3', // B+
//     religionId: 'r1', // Islam
//     nationalityId: 'n1', // Bangladesh
    
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
    
//     // File Uploads
//     studentPhoto: '',
//     studentNidFile: '',
//     studentBrnFile: '',
//     fatherNidFile: '',
//     motherNidFile: '',
//     digitalSignatureFile: '',
//     studentNidFileName: '',
//     studentBrnFileName: '',
//     fatherNidFileName: '',
//     motherNidFileName: '',
//     digitalSignatureFileName: '',
    
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: new Date().toISOString(),
//   },
// ];

const mockStudents: Student[] = [
  // --- previous ---
  {
    id: 'st1',
    firstName: 'Nafis',
    lastName: 'Rahman',
    fatherName: 'Abdul Karim',
    motherName: 'Shamsun Nahar',
    dateOfBirth: '2010-04-15',
    email: 'nafis.rahman@example.com',
    healthCondition: 'Healthy',
    nidNumber: '',
    brnNumber: '20100012345',
    genderId: 'g1',
    bloodGroupId: 'bg1',
    religionId: 'r1',
    nationalityId: 'n1',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
      subDistrictId: 'sd1',
      postOfficeId: 'po1',
      villageId: 'v1',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
    },
    sameAsPresent: true,
    studentPhoto: '',
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'st2',
    firstName: 'Moumita',
    lastName: 'Chowdhury',
    fatherName: 'Dipankar Chowdhury',
    motherName: 'Rina Chowdhury',
    dateOfBirth: '2011-09-05',
    email: 'moumita.chowdhury@example.com',
    healthCondition: 'Asthmatic',
    nidNumber: '',
    brnNumber: '20110054321',
    genderId: 'g2',
    bloodGroupId: 'bg3',
    religionId: 'r3',
    nationalityId: 'n1',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
      // (পূর্বের ডেটা অনুযায়ী subDistrictId ছিলো 'sd3')
      subDistrictId: 'sd3',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    sameAsPresent: false,
    studentPhoto: photos[0].url,
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },

  // --- new (4 more) ---
  {
    id: 'st3',
    firstName: 'Arif',
    lastName: 'Hossain',
    fatherName: 'Md. Habib',
    motherName: 'Rokeya Begum',
    dateOfBirth: '2010-12-01',
    email: 'arif.hossain@example.com',
    healthCondition: 'Healthy',
    nidNumber: '',
    brnNumber: '20100067890',
    genderId: 'g1',
    bloodGroupId: 'bg7', // O+
    religionId: 'r1',
    nationalityId: 'n1',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt2',     // Gazipur
      subDistrictId: 'sd3',  // Savar (consistent with dt2)
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt2',
    },
    sameAsPresent: true,
    studentPhoto: '',
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'st4',
    firstName: 'Sumaiya',
    lastName: 'Islam',
    fatherName: 'Shafiqul Islam',
    motherName: 'Nasima Akter',
    dateOfBirth: '2012-02-20',
    email: 'sumaiya.islam@example.com',
    healthCondition: 'Healthy',
    nidNumber: '',
    brnNumber: '20120011223',
    genderId: 'g2',
    bloodGroupId: 'bg5', // AB+
    religionId: 'r1',
    nationalityId: 'n1',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',     // Dhaka
      subDistrictId: 'sd2',  // Gulshan
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd1',
      districtId: 'dt1',
    },
    sameAsPresent: true,
    studentPhoto: '',
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'st5',
    firstName: 'Rakesh',
    lastName: 'Kumar',
    fatherName: 'Sanjay Kumar',
    motherName: 'Pooja Kumari',
    dateOfBirth: '2011-06-11',
    email: 'rakesh.kumar@example.com',
    healthCondition: 'Healthy',
    nidNumber: '',
    brnNumber: '20110099887',
    genderId: 'g1',
    bloodGroupId: 'bg4', // B-
    religionId: 'r3',    // Hinduism
    nationalityId: 'n2', // India
    presentAddress: {
      nationalityId: 'n2',  // India; (division/district omitted)
    },
    permanentAddress: {
      nationalityId: 'n2',
    },
    sameAsPresent: true,
    studentPhoto: '',
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'st6',
    firstName: 'Maria',
    lastName: 'Gomes',
    fatherName: 'Anthony Gomes',
    motherName: 'Lucy Gomes',
    dateOfBirth: '2010-11-02',
    email: 'maria.gomes@example.com',
    healthCondition: 'Healthy',
    nidNumber: '',
    brnNumber: '20100044556',
    genderId: 'g2',
    bloodGroupId: 'bg2', // A-
    religionId: 'r2',    // Christianity
    nationalityId: 'n1',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',  // Chittagong Division
      districtId: 'dt3', // Chittagong
      // sub-district not specified to avoid mismatch with available mockSubDistricts
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    sameAsPresent: true,
    studentPhoto: '',
    studentNidFile: '',
    studentBrnFile: '',
    fatherNidFile: '',
    motherNidFile: '',
    digitalSignatureFile: '',
    studentNidFileName: '',
    studentBrnFileName: '',
    fatherNidFileName: '',
    motherNidFileName: '',
    digitalSignatureFileName: '',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Student API service class
 */
class StudentApiService extends BaseApiService {
  private students = [...mockStudents];
  private mockIdCounter = 100;

  /**
   * Get students with pagination and filtering
   */
  async getStudents(params: { page?: number; limit?: number; filters?: StudentFilters } = {}): Promise<PaginatedResponse<Student>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.students];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(student => 
        student.firstName.toLowerCase().includes(search) ||
        student.lastName.toLowerCase().includes(search) ||
        student.fatherName.toLowerCase().includes(search) ||
        student.motherName.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        student.nidNumber?.includes(search) ||
        student.brnNumber?.includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(student => student.status === filters.status);
    }

    if (filters.genderId) {
      filtered = filtered.filter(student => student.genderId === filters.genderId);
    }

    if (filters.bloodGroupId) {
      filtered = filtered.filter(student => student.bloodGroupId === filters.bloodGroupId);
    }

    if (filters.religionId) {
      filtered = filtered.filter(student => student.religionId === filters.religionId);
    }

    if (filters.nationalityId) {
      filtered = filtered.filter(student => student.nationalityId === filters.nationalityId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: string): Promise<Student> {
    await this.simulateDelay(200);
    const student = this.students.find(s => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  /**
   * Create new student
   */
  async createStudent(data: CreateStudentDto): Promise<Student> {
    await this.simulateDelay(500);
    
    const newStudent: Student = {
      id: `s${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    this.students = [newStudent, ...this.students];
    return newStudent;
  }

  /**
   * Update student
   */
  async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
    await this.simulateDelay(500);
    const index = this.students.findIndex(student => student.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    this.students[index] = { 
      ...this.students[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return this.students[index];
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    await this.simulateDelay(300);
    const index = this.students.findIndex(student => student.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    this.students = this.students.filter(student => student.id !== id);
  }

  /**
   * Get all students for dropdown (simplified)
   */
  async getAllStudentsForDropdown(): Promise<{ id: string; firstName: string; lastName: string }[]> {
    await this.simulateDelay(200);
    return this.students.map(student => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
    }));
  }
}

export const studentApi = new StudentApiService();