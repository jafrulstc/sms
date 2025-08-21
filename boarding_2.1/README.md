# School Management System

A comprehensive school management system built with React, TypeScript, and Material-UI, focusing on modular architecture and extensive master data management capabilities.

## 🚀 Features

### Core Modules
- **Authentication System**: Role-based access control with module permissions
- **Master Data Management**: Comprehensive data foundation for the entire system
- **Hostel Management**: Room and student management (existing)
- **Education Module**: Academic data management and teacher system (in development)

### Master Data Management
- **General Data**: Gender, Blood Group, Religion, Designation, Guardian management
- **Geography Data**: Hierarchical location management (Nationality → Division → District → Sub District → Post Office → Village)
- **Academic Data**: Education levels, academic years, groups, classes, shifts, sections, and complex mappings

### Advanced Features
- **Multi-language Support**: English, Bengali, and Arabic
- **Dark/Light Theme**: Persistent theme switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **File Upload System**: Photo and document management with validation
- **Complex Relationships**: Multi-select dropdowns and cascading filters
- **Real-time Validation**: Form validation with immediate feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React features and performance improvements
- **TypeScript** - Type safety and enhanced developer experience
- **Material-UI (MUI) v7** - Comprehensive component library
- **Redux Toolkit** - Predictable state management
- **React Hook Form + Zod** - Performant forms with schema validation
- **React Router v7** - Modern routing solution
- **TanStack React Query** - Server state management
- **i18next** - Internationalization framework

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
src/
├── app/                    # Application configuration
│   ├── providers/         # Global providers (Theme, I18n, Toast)
│   ├── store/            # Redux store configuration
│   └── constants/        # Application constants
├── features/             # Feature-based modules
│   ├── auth/            # Authentication system
│   │   ├── components/  # Auth-related components
│   │   ├── pages/       # Login and auth pages
│   │   ├── services/    # Auth API services
│   │   └── store/       # Auth Redux slice
│   ├── core/            # Master data management
│   │   ├── components/  # Master data UI components
│   │   │   ├── general/ # General data management
│   │   │   ├── geography/ # Geography data management
│   │   │   └── academic/ # Academic data management
│   │   ├── services/    # Master data API services
│   │   ├── store/       # Master data Redux slices
│   │   └── types/       # Master data TypeScript interfaces
│   ├── hostel/          # Hostel management
│   │   ├── rooms/       # Room management
│   │   └── students/    # Student management
│   └── education/       # Education module (in development)
│       └── teachers/    # Teacher management (planned)
└── shared/              # Shared utilities and components
    ├── components/      # Reusable UI components
    │   ├── layout/      # Layout components (Header, Sidebar)
    │   └── ui/          # Generic UI components
    ├── hooks/          # Custom React hooks
    ├── services/       # Shared services (i18n, API base)
    ├── types/          # Shared TypeScript types
    └── utils/          # Utility functions
```

## 🎨 Features Overview

### Authentication & Authorization
- Role-based access control
- Module-specific permissions
- Protected routes with automatic redirection
- Persistent authentication state

### Master Data Management

#### General Data
- **Gender Management**: Male, Female, Other options
- **Blood Group Management**: All standard blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Religion Management**: Major world religions with extensibility
- **Designation Management**: Job titles and roles
- **Guardian Management**: Complete guardian profiles with photo upload and address integration

#### Geography Data
- **Hierarchical Structure**: Six-level geography hierarchy
- **Dual View Modes**: Table view for editing, Tree view for visualization
- **Cascading Dropdowns**: Smart address selection with dependency management
- **Reusable Components**: Address fields component used across the system

#### Academic Data
- **Education Levels**: SSC, HSC, Degree levels with descriptions
- **Academic Years**: Time-based academic periods with date validation
- **Academic Groups**: Subject groupings (Science, Commerce, Arts) with multi-level associations
- **Academic Classes**: Class definitions with education level and group relationships
- **Shifts & Sections**: Time-based and capacity-based class divisions
- **Complex Mappings**: Advanced relationships between classes, groups, years, and shift-section combinations

### Advanced UI Features
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Theme System**: Material Design 3 with custom color palettes
- **Internationalization**: Complete translation support for multiple languages
- **File Upload**: Comprehensive file handling with validation and preview
- **Form Management**: Complex forms with dynamic fields and real-time validation
- **Data Visualization**: Tables, cards, and tree views for different data types

## 🌐 Internationalization

The application supports multiple languages:
- **English** (default)
- **Bengali** (বাংলা)
- **Arabic** (العربية)

Language preferences are persisted in localStorage and applied across all components.

## 🎨 Theming

The application includes both light and dark themes with:
- Material Design 3 principles
- Consistent color palette across all components
- Responsive typography with proper scaling
- Smooth transitions and micro-interactions
- Custom component styling for enhanced user experience

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+): Full feature set with sidebar navigation
- **Tablet** (768px - 1199px): Adapted layouts with collapsible navigation
- **Mobile** (320px - 767px): Touch-optimized interface with drawer navigation

## 🧪 Development Approach

### State Management
- **Redux Toolkit**: Simplified Redux with built-in best practices
- **Async Thunks**: Standardized async operations with loading states
- **Normalized State**: Efficient data structure for complex relationships
- **Selectors**: Memoized data access for performance optimization

### API Integration
- **Mock Services**: Development without backend dependency
- **Base API Service**: Consistent error handling and request/response formatting
- **Interceptors**: Automatic token management and error handling
- **Type Safety**: Full TypeScript integration for API responses

### Form Handling
- **React Hook Form**: Performance-optimized form management
- **Zod Validation**: Schema-based validation with TypeScript integration
- **Dynamic Fields**: Support for complex, nested, and repeating form sections
- **File Uploads**: Comprehensive file handling with validation and preview

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🔮 Upcoming Features

### Teacher Management System
- **Comprehensive Teacher Profiles**: Complete personal and professional information management
- **Advanced File Management**: Document uploads for certificates, recommendations, and signatures
- **Dynamic Form Sections**: Repeatable sections for qualifications, experience, and references
- **Master Data Integration**: Seamless integration with existing general and geography data
- **Multi-tab Interface**: Organized data entry with Register and Demo tabs

#### Teacher Management Features (In Development)
- **Personal Information Management**: Demographics, contact details, and identity documents
- **Educational Qualifications**: Certificate uploads and academic credential tracking
- **Professional Experience**: Employment history with detailed role descriptions
- **References & Testimonials**: Multiple reference management with contact verification
- **Employment Details**: Salary management, joining dates, and contract information
- **Skills & Competencies**: Teaching specializations and language proficiencies
- **Document Management**: Comprehensive file upload system for all teacher documents

#### Reusable Components Completed ✅
- **FileUpload Component**: Advanced file handling with preview and validation
- **DynamicFieldArray Component**: Repeatable form sections for complex data entry
- **FormSection Component**: Organized form layout with collapsible sections
- **MultiSelectChips Component**: Enhanced multi-select with chip display
- **PhoneInput Component**: Formatted phone number input with validation

### Enhanced Education Module
- Student enrollment and academic record management
- Class scheduling and timetable management
- Examination and grading system
- Advanced reporting and analytics
- **Teacher Management System** (In Development)

### Additional Modules
- **Accounts Management**: Fee collection, expense tracking, financial reporting
- **Library System**: Book management, borrowing system, member management
- **Transport Management**: Route planning, vehicle tracking, student transportation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This project uses mock data for development purposes. In a production environment, replace the mock API services with actual backend endpoints and implement proper authentication and authorization mechanisms.


