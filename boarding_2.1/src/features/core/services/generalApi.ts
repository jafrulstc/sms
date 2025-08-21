import BaseApiService from '~/shared/services/api/baseApi';
import type {
  Gender,
  BloodGroup,
  ResidentialStatus,
  Religion,
  Designation,
  Guardian,
  CreateGenderDto,
  CreateBloodGroupDto,
  CreateResidentialStatusDto,
  CreateReligionDto,
  CreateDesignationDto,
  CreateGuardianDto,
  UpdateGenderDto,
  UpdateBloodGroupDto,
  UpdateResidentialStatusDto,
  UpdateReligionDto,
  UpdateDesignationDto,
  UpdateGuardianDto,
  GeneralFilters,
  Relation,
  MaritalStatus,
  JobRule,
  CreateRelationDto,
  UpdateRelationDto,
  CreateMaritalStatusDto,
  UpdateMaritalStatusDto,
  CreateJobRuleDto,
  UpdateJobRuleDto,
} from '~/features/core/types/general';
import type { PaginatedResponse } from '~/shared/types/common';

/**
 * Mock data for development
 */
const mockGenders: Gender[] = [
  { id: 'g1', name: 'Male', createdAt: new Date().toISOString() },
  { id: 'g2', name: 'Female', createdAt: new Date().toISOString() },
  { id: 'g3', name: 'Other', createdAt: new Date().toISOString() },
];

const mockBloodGroups: BloodGroup[] = [
  { id: 'bg1', name: 'A+', createdAt: new Date().toISOString() },
  { id: 'bg2', name: 'A-', createdAt: new Date().toISOString() },
  { id: 'bg3', name: 'B+', createdAt: new Date().toISOString() },
  { id: 'bg4', name: 'B-', createdAt: new Date().toISOString() },
  { id: 'bg5', name: 'AB+', createdAt: new Date().toISOString() },
  { id: 'bg6', name: 'AB-', createdAt: new Date().toISOString() },
  { id: 'bg7', name: 'O+', createdAt: new Date().toISOString() },
  { id: 'bg8', name: 'O-', createdAt: new Date().toISOString() },
];

const mockResidentialStatuses: ResidentialStatus[] = [
  { id: 'rs1', name: 'Resident', createdAt: new Date().toISOString() },
  { id: 'rs2', name: 'Non-Resident', createdAt: new Date().toISOString() },
  { id: 'rs3', name: 'Day Scholar', createdAt: new Date().toISOString() },
  { id: 'rs4', name: 'Hostel', createdAt: new Date().toISOString() },
];

const mockReligions: Religion[] = [
  { id: 'r1', name: 'Islam', createdAt: new Date().toISOString() },
  { id: 'r2', name: 'Christianity', createdAt: new Date().toISOString() },
  { id: 'r3', name: 'Hinduism', createdAt: new Date().toISOString() },
  { id: 'r4', name: 'Buddhism', createdAt: new Date().toISOString() },
  { id: 'r5', name: 'Judaism', createdAt: new Date().toISOString() },
  { id: 'r6', name: 'Other', createdAt: new Date().toISOString() },
];

const mockDesignations: Designation[] = [
  { id: 'd1', name: 'Teacher', createdAt: new Date().toISOString() },
  { id: 'd2', name: 'Principal', createdAt: new Date().toISOString() },
  { id: 'd3', name: 'Hostel Manager', createdAt: new Date().toISOString() },
  { id: 'd4', name: 'Accountant', createdAt: new Date().toISOString() },
  { id: 'd5', name: 'Librarian', createdAt: new Date().toISOString() },
];

const mockRelations: Relation[] = [
  { id: 'rel1', name: 'Self', createdAt: new Date().toISOString() },
  { id: 'rel2', name: 'Spouse', createdAt: new Date().toISOString() },
  { id: 'rel3', name: 'Child', createdAt: new Date().toISOString() },
  { id: 'rel4', name: 'Parent', createdAt: new Date().toISOString() },
  { id: 'rel5', name: 'Sibling', createdAt: new Date().toISOString() },
  { id: 'rel6', name: 'Other', createdAt: new Date().toISOString() },
];

const mockMaritalStatuses: MaritalStatus[] = [
  { id: 'ms1', name: 'Single', createdAt: new Date().toISOString() },
  { id: 'ms2', name: 'Married', createdAt: new Date().toISOString() },
  { id: 'ms3', name: 'Divorced', createdAt: new Date().toISOString() },
  { id: 'ms4', name: 'Widowed', createdAt: new Date().toISOString() },
  { id: 'ms5', name: 'Other', createdAt: new Date().toISOString() },
];

const mockJobRules: JobRule[] = [
  { id: 'jr1', name: 'দারোয়ান', createdAt: new Date().toISOString() },
  { id: 'jr2', name: 'বাবুর্চি', createdAt: new Date().toISOString() },
  { id: 'jr3', name: '', createdAt: new Date().toISOString() },
  { id: 'jr4', name: 'খাদেম', createdAt: new Date().toISOString() },
  { id: 'jr5', name: 'সহায়ক', createdAt: new Date().toISOString() },
];

// const mockGuardians: Guardian[] = [
//   {
//     id: 'gd1',
//     name: 'Ahmed Rahman',
//     phone: '01712345678',
//     email: 'ahmed.rahman@email.com',
//     occupation: 'Business Owner',
//     photoUrl: '',
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
//     details: 'Father of student. Available for emergency contact.',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'gd2',
//     name: 'Fatima Begum',
//     phone: '01812987654',
//     email: 'fatima.begum@email.com',
//     occupation: 'Teacher',
//     photoUrl: '',
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
//     sameAsPresent: false,
//     details: 'Mother of student. Primary contact for academic matters.',
//     createdAt: new Date().toISOString(),
//   },
// ];


const mockGuardians: Guardian[] = [
  {
    id: 'gdn1',
    name: 'Abdul Karim',
    phone: '+8801711001100',
    email: 'abdul.karim@example.com',
    occupation: 'Businessman',
    photoUrl: '',
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
      divisionId: 'd3',
      districtId: 'dt3',
    },
    sameAsPresent: false,
    details: 'Father of the student, runs a wholesale shop in Dhaka.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gdn2',
    name: 'Shamsun Nahar',
    phone: '+8801811223344',
    email: 'shamsun.nahar@example.com',
    occupation: 'Teacher',
    photoUrl: '',
    presentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
      subDistrictId: 'sd3',
      postOfficeId: 'po2',
      villageId: 'v2',
    },
    permanentAddress: {
      nationalityId: 'n1',
      divisionId: 'd2',
      districtId: 'dt3',
    },
    sameAsPresent: true,
    details: 'Mother of the student, teaches at a local school in Chittagong.',
    createdAt: new Date().toISOString(),
  },
];

/**
 * General API service class
 */
class GeneralApiService extends BaseApiService {
  private genders = [...mockGenders];
  private bloodGroups = [...mockBloodGroups];
  private residentialStatuses = [...mockResidentialStatuses];
  private religions = [...mockReligions];
  private designations = [...mockDesignations];
  private relations = [...mockRelations];
  private maritalStatuses = [...mockMaritalStatuses];
  private jobRules = [...mockJobRules];
  private guardians = [...mockGuardians];
  private mockIdCounter = 100;

  // Gender CRUD operations
  async getGenders(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Gender>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.genders];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createGender(data: CreateGenderDto): Promise<Gender> {
    await this.simulateDelay();
    const newGender: Gender = {
      id: `g${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.genders = [newGender, ...this.genders];
    return newGender;
  }

  async updateGender(id: string, data: UpdateGenderDto): Promise<Gender> {
    await this.simulateDelay();
    const index = this.genders.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Gender not found');
    
    this.genders[index] = { ...this.genders[index], ...data, updatedAt: new Date().toISOString() };
    return this.genders[index];
  }

  async deleteGender(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.genders.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Gender not found');
    
    this.genders = this.genders.filter(item => item.id !== id);
  }

  // Blood Group CRUD operations
  async getBloodGroups(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<BloodGroup>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.bloodGroups];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBloodGroup(data: CreateBloodGroupDto): Promise<BloodGroup> {
    await this.simulateDelay();
    const newBloodGroup: BloodGroup = {
      id: `bg${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.bloodGroups = [newBloodGroup, ...this.bloodGroups];
    return newBloodGroup;
  }

  async updateBloodGroup(id: string, data: UpdateBloodGroupDto): Promise<BloodGroup> {
    await this.simulateDelay();
    const index = this.bloodGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Blood Group not found');
    
    this.bloodGroups[index] = { ...this.bloodGroups[index], ...data, updatedAt: new Date().toISOString() };
    return this.bloodGroups[index];
  }

  async deleteBloodGroup(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.bloodGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Blood Group not found');
    
    this.bloodGroups = this.bloodGroups.filter(item => item.id !== id);
  }

  // Residential Status CRUD operations
  async getResidentialStatuses(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<ResidentialStatus>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.residentialStatuses];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createResidentialStatus(data: CreateResidentialStatusDto): Promise<ResidentialStatus> {
    await this.simulateDelay();
    const newResidentialStatus: ResidentialStatus = {
      id: `rs${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.residentialStatuses = [newResidentialStatus, ...this.residentialStatuses];
    return newResidentialStatus;
  }

  async updateResidentialStatus(id: string, data: UpdateResidentialStatusDto): Promise<ResidentialStatus> {
    await this.simulateDelay();
    const index = this.residentialStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Residential Status not found');
    
    this.residentialStatuses[index] = { ...this.residentialStatuses[index], ...data, updatedAt: new Date().toISOString() };
    return this.residentialStatuses[index];
  }

  async deleteResidentialStatus(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.residentialStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Residential Status not found');
    
    this.residentialStatuses = this.residentialStatuses.filter(item => item.id !== id);
  }

  // Religion CRUD operations
  async getReligions(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Religion>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.religions];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createReligion(data: CreateReligionDto): Promise<Religion> {
    await this.simulateDelay();
    const newReligion: Religion = {
      id: `r${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.religions = [newReligion, ...this.religions];
    return newReligion;
  }

  async updateReligion(id: string, data: UpdateReligionDto): Promise<Religion> {
    await this.simulateDelay();
    const index = this.religions.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Religion not found');
    
    this.religions[index] = { ...this.religions[index], ...data, updatedAt: new Date().toISOString() };
    return this.religions[index];
  }

  async deleteReligion(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.religions.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Religion not found');
    
    this.religions = this.religions.filter(item => item.id !== id);
  }

  // Designation CRUD operations
  async getDesignations(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Designation>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.designations];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createDesignation(data: CreateDesignationDto): Promise<Designation> {
    await this.simulateDelay();
    const newDesignation: Designation = {
      id: `des${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.designations = [newDesignation, ...this.designations];
    return newDesignation;
  }

  async updateDesignation(id: string, data: UpdateDesignationDto): Promise<Designation> {
    await this.simulateDelay();
    const index = this.designations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation not found');
    
    this.designations[index] = { ...this.designations[index], ...data, updatedAt: new Date().toISOString() };
    return this.designations[index];
  }

  async deleteDesignation(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.designations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Designation not found');
    
    this.designations = this.designations.filter(item => item.id !== id);
  }

  // Relation CRUD operations
  async getRelations(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Relation>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.relations];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createRelation(data: CreateRelationDto): Promise<Relation> {
    await this.simulateDelay();
    const newRelation: Relation = {
      id: `rel${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.relations = [newRelation, ...this.relations];
    return newRelation;
  }

  async updateRelation(id: string, data: UpdateRelationDto): Promise<Relation> {
    await this.simulateDelay();
    const index = this.relations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Relation not found');
    
    this.relations[index] = { ...this.relations[index], ...data, updatedAt: new Date().toISOString() };
    return this.relations[index];
  }

  async deleteRelation(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.relations.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Relation not found');
    
    this.relations = this.relations.filter(item => item.id !== id);
  }

  // Marital Status CRUD operations
  async getMaritalStatuses(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<MaritalStatus>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.maritalStatuses];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createMaritalStatus(data: CreateMaritalStatusDto): Promise<MaritalStatus> {
    await this.simulateDelay();
    const newMaritalStatus: MaritalStatus = {
      id: `ms${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.maritalStatuses = [newMaritalStatus, ...this.maritalStatuses];
    return newMaritalStatus;
  }

  async updateMaritalStatus(id: string, data: UpdateMaritalStatusDto): Promise<MaritalStatus> {
    await this.simulateDelay();
    const index = this.maritalStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Marital Status not found');
    
    this.maritalStatuses[index] = { ...this.maritalStatuses[index], ...data, updatedAt: new Date().toISOString() };
    return this.maritalStatuses[index];
  }

  async deleteMaritalStatus(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.maritalStatuses.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Marital Status not found');
    
    this.maritalStatuses = this.maritalStatuses.filter(item => item.id !== id);
  }

  // Job Rule CRUD operations
  async getJobRules(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<JobRule>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.jobRules];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createJobRule(data: CreateJobRuleDto): Promise<JobRule> {
    await this.simulateDelay();
    const newJobRule: JobRule = {
      id: `jr${this.mockIdCounter++}`,
      name: data.name,
      createdAt: new Date().toISOString(),
    };
    this.jobRules = [newJobRule, ...this.jobRules];
    return newJobRule;
  }

  async updateJobRule(id: string, data: UpdateJobRuleDto): Promise<JobRule> {
    await this.simulateDelay();
    const index = this.jobRules.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Job Rule not found');
    
    this.jobRules[index] = { ...this.jobRules[index], ...data, updatedAt: new Date().toISOString() };
    return this.jobRules[index];
  }

  async deleteJobRule(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.jobRules.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Job Rule not found');
    
    this.jobRules = this.jobRules.filter(item => item.id !== id);
  }

  // Guardian CRUD operations
  async getGuardians(params: { page?: number; limit?: number; filters?: GeneralFilters } = {}): Promise<PaginatedResponse<Guardian>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;
    
    let filtered = [...this.guardians];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.includes(search) ||
        item.occupation?.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createGuardian(data: CreateGuardianDto): Promise<Guardian> {
    await this.simulateDelay();
    const newGuardian: Guardian = {
      id: `gd${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.guardians = [newGuardian, ...this.guardians];
    return newGuardian;
  }

  async updateGuardian(id: string, data: UpdateGuardianDto): Promise<Guardian> {
    await this.simulateDelay();
    const index = this.guardians.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Guardian not found');
    
    this.guardians[index] = { ...this.guardians[index], ...data, updatedAt: new Date().toISOString() };
    return this.guardians[index];
  }

  async deleteGuardian(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.guardians.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Guardian not found');
    
    this.guardians = this.guardians.filter(item => item.id !== id);
  }

  // Get all simple entities for dropdowns
  async getAllSimpleEntities(): Promise<{
    genders: Gender[];
    bloodGroups: BloodGroup[];
    residentialStatuses: ResidentialStatus[];
    religions: Religion[];
    relations: Relation[];
    maritalStatuses: MaritalStatus[];
    jobRules: JobRule[];
    designations: Designation[];
  }> {
    await this.simulateDelay(200);
    console.log('Returning designations:', this.designations);
    return {
      genders: this.genders,
      bloodGroups: this.bloodGroups,
      residentialStatuses: this.residentialStatuses,
      religions: this.religions,
      relations: this.relations,
      maritalStatuses: this.maritalStatuses,
      jobRules: this.jobRules,
      designations: this.designations,
    };
  }
}

export const generalApi = new GeneralApiService();