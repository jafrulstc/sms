import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Grid,
  RadioGroup,
  Radio,
  Paper,
  Divider,
  IconButton,
  FormLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import dayjs from "dayjs";

// Define UI_CONSTANTS (assuming these are globally available or defined elsewhere)
const UI_CONSTANTS = {
  DRAWER_WIDTH: 240, // Example value
  HEADER_HEIGHT: 64, // Example value
};

const STATIC_GEOGRAPHY = {
  nationality: ['Bangladesh', 'Indian', 'Pakistani', 'Other'],
  division: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'],
  district: ['Dhaka', 'Comilla', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'], // Simplified, would typically be dependent on division
  sub_district: ['Dhanmondi', 'Mirpur', 'Gulshan', 'Mohammadpur', 'Uttara'], // Simplified, would typically be dependent on district
  post_office: ['Dhanmondi', 'Mirpur', 'Gulshan', 'Mohammadpur', 'Uttara'], // Simplified
  village: ['Village1', 'Village2', 'Village3'], // Simplified
};

const BANKE_NAMES = [
  'Bangladesh Bank', 'Islami Bank Bangladesh Ltd.', 'Sonali Bank PLC', 'Janata Bank PLC', 'Agrani Bank PLC', 'Rupali Bank PLC', 'Pubali Bank Ltd.', 'Mutual Trust Bank Ltd.', 'BRAC Bank Ltd.', 'Dutch-Bangla Bank PLC'
];

// Helper component for TabPanel
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const designationOptions = [
  "Software Engineer",
  "Project Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Engineer",
];
const genderOptions = ["Male", "Female", "Other"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const educationalQualificationsOptions = ["SSC", "HSC", "Degree"];
const languageProficiencies = ["Bangla", "English", "Urdu"];

export default function TeacherRegisterForm() {
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    salary: "",
    designation: [],
    dateOfBirth: null,
    placeOfBirth: "",
    fatherName: "",
    motherName: "",
    birthCertificateNo: "",
    nationalIDNo: "",
    nationalIDFile: null,
    birthCertificateFile: null,
    presentAddress: {
      nationality: "",
      division: "",
      district: "",
      sub_district: "",
      post_office: "",
      village: "",
      detail: "",
    },
    permanentAddress: {
      nationality: "",
      division: "",
      district: "",
      sub_district: "",
      post_office: "",
      village: "",
      detail: "",
    },
    sameAsPresentAddress: false,
    mobile: "",
    email: "",
    gender: "",
    maritalStatus: "",
    emergencyContact: "",
    passportPhoto: null,
    passportPhotoPreview: null,
    educationalQualifications: [], // Array of selected qualifications and their details
    additionalCertificates: [], // Array of { name: "", file: null }
    professionalExperiences: [], // Array of experience objects
    references: [], // Array of reference objects
    bankName: "",
    bankAccountNumber: "",
    bankAccountDetails: "", // This seems redundant if account number is separate, but keeping as per prompt
    digitalSignature: null,
    dateOfJoining: null,
    noticePeriod: "",
    yearsOfExperience: "",
    expectedSalary: "",
    subjectsToTeach: "",
    languageProficiencies: [],
    computerSkills: "",
    linkedInURL: "",
    personalWebsiteURL: "",
  });

  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Special handling for address changes is done via handleAddressChange
    if (type === "checkbox") {
      if (name === "sameAsPresentAddress") {
        setFormData((prev) => ({
          ...prev,
          sameAsPresentAddress: checked,
          permanentAddress: checked ? { ...prev.presentAddress } : { nationality: "", division: "", district: "", sub_district: "", post_office: "", village: "", detail: "" },
        }));
      } else if (name === "educationalQualifications") {
        const selectedValue = value;
        setFormData((prev) => {
          const newQualifications = checked
            ? [...prev.educationalQualifications, { type: selectedValue, instituteName: "", address: { nationality: "", division: "", district: "", sub_district: "", post_office: "", village: "", detail: "" }, email: "", phone: "", certificate: null, testimonial: null }]
            : prev.educationalQualifications.filter((q) => q.type !== selectedValue);
          return { ...prev, educationalQualifications: newQualifications };
        });
      } else if (name === "languageProficiencies") {
        const selectedValue = value;
        setFormData((prev) => ({
          ...prev,
          languageProficiencies: checked
            ? [...prev.languageProficiencies, selectedValue]
            : prev.languageProficiencies.filter((lang) => lang !== selectedValue),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (addressType, field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }));
    // Clear specific address errors
    setErrors((prev) => ({ ...prev, [`${addressType}.${field}`]: "" }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (name) => (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "passportPhoto" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, passportPhotoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDynamicArrayChange = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      // If the field is part of a nested object like 'address'
      if (field.includes('.')) {
        const [parentField, nestedField] = field.split('.');
        newArray[index] = {
          ...newArray[index],
          [parentField]: {
            ...newArray[index][parentField],
            [nestedField]: value
          }
        };
      } else {
        newArray[index] = { ...newArray[index], [field]: value };
      }
      return { ...prev, [arrayName]: newArray };
    });
    // Clear error for the specific dynamic field
    setErrors((prev) => ({ ...prev, [`${arrayName}[${index}].${field}`]: "" }));
  };

  const handleDynamicArrayFileChange = (arrayName, index, field) => (e) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: file };
      return { ...prev, [arrayName]: newArray };
    });
    setErrors((prev) => ({ ...prev, [`${arrayName}[${index}].${field}`]: "" }));
  };

  const addDynamicItem = (arrayName, defaultObject) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultObject],
    }));
  };

  const removeDynamicItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      firstName: "First Name is required",
      lastName: "Last Name is required",
      bloodGroup: "Blood Group is required",
      salary: "Salary is required",
      dateOfBirth: "Date of Birth is required",
      placeOfBirth: "Place of Birth is required",
      fatherName: "Father's Name is required",
      motherName: "Mother's Name is required",
      mobile: "Mobile is required",
      email: "Email is required",
      gender: "Gender is required",
      maritalStatus: "Marital Status is required",
      emergencyContact: "Emergency Contact is required",
      passportPhoto: "Passport-size Photograph is required",
      bankName: "Bank Name is required",
      bankAccountNumber: "Bank Account Number is required",
      bankAccountDetails: "Bank Account Details are required",
      dateOfJoining: "Date of Joining is required",
      noticePeriod: "Notice Period is required",
      yearsOfExperience: "Years of Experience is required",
      expectedSalary: "Expected Salary is required",
      subjectsToTeach: "Subjects to Teach are required",
      computerSkills: "Computer/ICT Skills are required",
      linkedInURL: "LinkedIn URL is required",
    };

    for (const key in requiredFields) {
      if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0)) {
        newErrors[key] = requiredFields[key];
      }
    }

    // Address validation - Present
    if (!formData.presentAddress.nationality) newErrors["presentAddress.nationality"] = "Nationality is required";
    if (!formData.presentAddress.division) newErrors["presentAddress.division"] = "Division is required";
    if (!formData.presentAddress.district) newErrors["presentAddress.district"] = "District is required";
    if (!formData.presentAddress.sub_district) newErrors["presentAddress.sub_district"] = "Sub-District is required";
    if (!formData.presentAddress.post_office) newErrors["presentAddress.post_office"] = "Post Office is required";
    if (!formData.presentAddress.village) newErrors["presentAddress.village"] = "Village is required";
    if (!formData.presentAddress.detail) newErrors["presentAddress.detail"] = "Detail Address is required";

    // Address validation - Permanent (if not same as present)
    if (!formData.sameAsPresentAddress) {
      if (!formData.permanentAddress.nationality) newErrors["permanentAddress.nationality"] = "Nationality is required";
      if (!formData.permanentAddress.division) newErrors["permanentAddress.division"] = "Division is required";
      if (!formData.permanentAddress.district) newErrors["permanentAddress.district"] = "District is required";
      if (!formData.permanentAddress.sub_district) newErrors["permanentAddress.sub_district"] = "Sub-District is required";
      if (!formData.permanentAddress.post_office) newErrors["permanentAddress.post_office"] = "Post Office is required";
      if (!formData.permanentAddress.village) newErrors["permanentAddress.village"] = "Village is required";
      if (!formData.permanentAddress.detail) newErrors["permanentAddress.detail"] = "Detail Address is required";
    }

    // Dynamic fields validation - Educational Qualifications
    formData.educationalQualifications.forEach((qual, index) => {
      if (!qual.instituteName) newErrors[`educationalQualifications[${index}].instituteName`] = "Institute Name is required";
      if (!qual.address.nationality) newErrors[`educationalQualifications[${index}].address.nationality`] = "Nationality is required";
      if (!qual.address.division) newErrors[`educationalQualifications[${index}].address.division`] = "Division is required";
      if (!qual.address.district) newErrors[`educationalQualifications[${index}].address.district`] = "District is required";
      if (!qual.address.sub_district) newErrors[`educationalQualifications[${index}].address.sub_district`] = "Sub-District is required";
      if (!qual.address.post_office) newErrors[`educationalQualifications[${index}].address.post_office`] = "Post Office is required";
      if (!qual.address.village) newErrors[`educationalQualifications[${index}].address.village`] = "Village is required";
      if (!qual.address.detail) newErrors[`educationalQualifications[${index}].address.detail`] = "Address Detail is required";
    });

    // Dynamic fields validation - Additional Certificates
    formData.additionalCertificates.forEach((certificate, index) => {
      if (!certificate.name) newErrors[`additionalCertificates[${index}].name`] = "Certificate Name is required";
      if (!certificate.file) newErrors[`additionalCertificates[${index}].file`] = "File is required";
    });

    // Dynamic fields validation - Professional Experiences
    formData.professionalExperiences.forEach((exp, index) => {
      if (!exp.employerName) newErrors[`professionalExperiences[${index}].employerName`] = "Employer Name is required";
      if (!exp.jobTitle) newErrors[`professionalExperiences[${index}].jobTitle`] = "Job Title is required";
      if (!exp.period) newErrors[`professionalExperiences[${index}].period`] = "Period is required";
    });

    // Dynamic fields validation - References
    formData.references.forEach((ref, index) => {
      if (!ref.name) newErrors[`references[${index}].name`] = "Name is required";
      if (!ref.contact) newErrors[`references[${index}].contact`] = "Contact is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
      alert("Form submitted successfully! Check console for data.");
      // In a real application, you would send this data to an API
    } else {
      console.log("Form Validation Errors:", errors);
      alert("Please correct the form errors.");
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${UI_CONSTANTS.DRAWER_WIDTH}px)` },
          mt: `${UI_CONSTANTS.HEADER_HEIGHT}px`,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Employee Registration
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="registration tabs"
            >
              <Tab label="Register" {...a11yProps(0)} />
              <Tab label="Core" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={tabValue} index={0}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.bloodGroup}>
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      label="Blood Group"
                      onChange={handleChange}
                    >
                      {bloodGroupOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bloodGroup && (
                      <Typography color="error" variant="caption">
                        {errors.bloodGroup}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    error={!!errors.salary}
                    helperText={errors.salary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Designation</InputLabel>
                    <Select
                      multiple
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      label="Designation"
                    >
                      {designationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth *"
                      value={formData.dateOfBirth}
                      onChange={handleDateChange("dateOfBirth")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Place of Birth"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    required
                    error={!!errors.placeOfBirth}
                    helperText={errors.placeOfBirth}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father’s Name"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    error={!!errors.fatherName}
                    helperText={errors.fatherName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother’s Name"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                    error={!!errors.motherName}
                    helperText={errors.motherName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birth Certificate No."
                    name="birthCertificateNo"
                    value={formData.birthCertificateNo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="National ID No."
                    name="nationalIDNo"
                    value={formData.nationalIDNo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    National ID (Optional)
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange("nationalIDFile")}
                  />
                  {formData.nationalIDFile && (
                    <Typography variant="caption" display="block">
                      {formData.nationalIDFile.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Birth Certificate (Optional)
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange("birthCertificateFile")}
                  />
                  {formData.birthCertificateFile && (
                    <Typography variant="caption" display="block">
                      {formData.birthCertificateFile.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Address Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Present Address
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.nationality"]}>
                    <InputLabel>Nationality</InputLabel>
                    <Select
                      name="nationality"
                      value={formData.presentAddress.nationality}
                      label="Nationality"
                      onChange={handleAddressChange("presentAddress", "nationality")}
                    >
                      {STATIC_GEOGRAPHY.nationality.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.nationality"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.nationality"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.division"]}>
                    <InputLabel>Division</InputLabel>
                    <Select
                      name="division"
                      value={formData.presentAddress.division}
                      label="Division"
                      onChange={handleAddressChange("presentAddress", "division")}
                    >
                      {STATIC_GEOGRAPHY.division.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.division"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.division"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.district"]}>
                    <InputLabel>District</InputLabel>
                    <Select
                      name="district"
                      value={formData.presentAddress.district}
                      label="District"
                      onChange={handleAddressChange("presentAddress", "district")}
                    >
                      {STATIC_GEOGRAPHY.district.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.district"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.district"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.sub_district"]}>
                    <InputLabel>Sub-District</InputLabel>
                    <Select
                      name="sub_district"
                      value={formData.presentAddress.sub_district}
                      label="Sub-District"
                      onChange={handleAddressChange("presentAddress", "sub_district")}
                    >
                      {STATIC_GEOGRAPHY.sub_district.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.sub_district"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.sub_district"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.post_office"]}>
                    <InputLabel>Post Office</InputLabel>
                    <Select
                      name="post_office"
                      value={formData.presentAddress.post_office}
                      label="Post Office"
                      onChange={handleAddressChange("presentAddress", "post_office")}
                    >
                      {STATIC_GEOGRAPHY.post_office.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.post_office"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.post_office"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors["presentAddress.village"]}>
                    <InputLabel>Village</InputLabel>
                    <Select
                      name="village"
                      value={formData.presentAddress.village}
                      label="Village"
                      onChange={handleAddressChange("presentAddress", "village")}
                    >
                      {STATIC_GEOGRAPHY.village.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors["presentAddress.village"] && (
                      <Typography color="error" variant="caption">
                        {errors["presentAddress.village"]}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Detail Address"
                    name="presentAddress.detail"
                    multiline
                    rows={3}
                    value={formData.presentAddress.detail}
                    onChange={handleAddressChange("presentAddress", "detail")}
                    required
                    error={!!errors["presentAddress.detail"]}
                    helperText={errors["presentAddress.detail"]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.sameAsPresentAddress}
                        onChange={handleChange}
                        name="sameAsPresentAddress"
                      />
                    }
                    label="Same as Present Address"
                  />
                </Grid>

                {!formData.sameAsPresentAddress && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Permanent Address
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.nationality"]}>
                        <InputLabel>Nationality</InputLabel>
                        <Select
                          name="nationality"
                          value={formData.permanentAddress.nationality}
                          label="Nationality"
                          onChange={handleAddressChange("permanentAddress", "nationality")}
                        >
                          {STATIC_GEOGRAPHY.nationality.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.nationality"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.nationality"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.division"]}>
                        <InputLabel>Division</InputLabel>
                        <Select
                          name="division"
                          value={formData.permanentAddress.division}
                          label="Division"
                          onChange={handleAddressChange("permanentAddress", "division")}
                        >
                          {STATIC_GEOGRAPHY.division.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.division"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.division"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.district"]}>
                        <InputLabel>District</InputLabel>
                        <Select
                          name="district"
                          value={formData.permanentAddress.district}
                          label="District"
                          onChange={handleAddressChange("permanentAddress", "district")}
                        >
                          {STATIC_GEOGRAPHY.district.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.district"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.district"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.sub_district"]}>
                        <InputLabel>Sub-District</InputLabel>
                        <Select
                          name="sub_district"
                          value={formData.permanentAddress.sub_district}
                          label="Sub-District"
                          onChange={handleAddressChange("permanentAddress", "sub_district")}
                        >
                          {STATIC_GEOGRAPHY.sub_district.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.sub_district"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.sub_district"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.post_office"]}>
                        <InputLabel>Post Office</InputLabel>
                        <Select
                          name="post_office"
                          value={formData.permanentAddress.post_office}
                          label="Post Office"
                          onChange={handleAddressChange("permanentAddress", "post_office")}
                        >
                          {STATIC_GEOGRAPHY.post_office.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.post_office"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.post_office"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors["permanentAddress.village"]}>
                        <InputLabel>Village</InputLabel>
                        <Select
                          name="village"
                          value={formData.permanentAddress.village}
                          label="Village"
                          onChange={handleAddressChange("permanentAddress", "village")}
                        >
                          {STATIC_GEOGRAPHY.village.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors["permanentAddress.village"] && (
                          <Typography color="error" variant="caption">
                            {errors["permanentAddress.village"]}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Detail Address"
                        name="permanentAddress.detail"
                        multiline
                        rows={3}
                        value={formData.permanentAddress.detail}
                        onChange={handleAddressChange("permanentAddress", "detail")}
                        required
                        error={!!errors["permanentAddress.detail"]}
                        helperText={errors["permanentAddress.detail"]}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Contact & Other Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.gender}>
                    <FormLabel>Gender *</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      {genderOptions.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                    {errors.gender && (
                      <Typography color="error" variant="caption">
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    error={!!errors.maritalStatus}
                  >
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      label="Marital Status"
                      onChange={handleChange}
                    >
                      {maritalStatusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.maritalStatus && (
                      <Typography color="error" variant="caption">
                        {errors.maritalStatus}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    error={!!errors.emergencyContact}
                    helperText={errors.emergencyContact}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Passport-size Photograph *
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange("passportPhoto")}
                  />
                  {errors.passportPhoto && (
                    <Typography color="error" variant="caption" display="block">
                      {errors.passportPhoto}
                    </Typography>
                  )}
                  {formData.passportPhotoPreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={formData.passportPhotoPreview}
                        alt="Passport"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Educational Qualifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormGroup row>
                    {educationalQualificationsOptions.map((qual) => (
                      <FormControlLabel
                        key={qual}
                        control={
                          <Checkbox
                            name="educationalQualifications"
                            value={qual}
                            checked={formData.educationalQualifications.some(
                              (q) => q.type === qual
                            )}
                            onChange={handleChange}
                          />
                        }
                        label={qual}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                {formData.educationalQualifications.map((qual, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {qual.type} Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Institute Name"
                            value={qual.instituteName}
                            onChange={(e) =>
                              handleDynamicArrayChange(
                                "educationalQualifications",
                                index,
                                "instituteName",
                                e.target.value
                              )
                            }
                            required
                            error={!!errors[`educationalQualifications[${index}].instituteName`]}
                            helperText={errors[`educationalQualifications[${index}].instituteName`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.nationality`]}>
                            <InputLabel>Address Nationality</InputLabel>
                            <Select
                              name="address.nationality"
                              value={qual.address.nationality}
                              label="Address Nationality"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.nationality", // Pass nested field name
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.nationality.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.nationality`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.nationality`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.division`]}>
                            <InputLabel>Address Division</InputLabel>
                            <Select
                              name="address.division"
                              value={qual.address.division}
                              label="Address Division"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.division", // Pass nested field name
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.division.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.division`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.division`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.district`]}>
                            <InputLabel>Address District</InputLabel>
                            <Select
                              name="address.district"
                              value={qual.address.district}
                              label="Address District"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.district",
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.district.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.district`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.district`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.sub_district`]}>
                            <InputLabel>Address Sub-District</InputLabel>
                            <Select
                              name="address.sub_district"
                              value={qual.address.sub_district}
                              label="Address Sub-District"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.sub_district",
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.sub_district.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.sub_district`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.sub_district`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.post_office`]}>
                            <InputLabel>Address Post Office</InputLabel>
                            <Select
                              name="address.post_office"
                              value={qual.address.post_office}
                              label="Address Post Office"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.post_office",
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.post_office.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.post_office`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.post_office`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required error={!!errors[`educationalQualifications[${index}].address.village`]}>
                            <InputLabel>Address Village</InputLabel>
                            <Select
                              name="address.village"
                              value={qual.address.village}
                              label="Address Village"
                              onChange={(e) =>
                                handleDynamicArrayChange(
                                  "educationalQualifications",
                                  index,
                                  "address.village",
                                  e.target.value
                                )
                              }
                            >
                              {STATIC_GEOGRAPHY.village.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`educationalQualifications[${index}].address.village`] && (
                              <Typography color="error" variant="caption">
                                {errors[`educationalQualifications[${index}].address.village`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Detail Address"
                            multiline
                            rows={2}
                            value={qual.address.detail}
                            onChange={(e) =>
                              handleDynamicArrayChange(
                                "educationalQualifications",
                                index,
                                "address.detail",
                                e.target.value
                              )
                            }
                            required
                            error={!!errors[`educationalQualifications[${index}].address.detail`]}
                            helperText={errors[`educationalQualifications[${index}].address.detail`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={qual.email}
                            onChange={(e) =>
                              handleDynamicArrayChange(
                                "educationalQualifications",
                                index,
                                "email",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone"
                            type="tel"
                            value={qual.phone}
                            onChange={(e) =>
                              handleDynamicArrayChange(
                                "educationalQualifications",
                                index,
                                "phone",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Certificate
                          </Typography>
                          <input
                            type="file"
                            onChange={handleDynamicArrayFileChange(
                              "educationalQualifications",
                              index,
                              "certificate"
                            )}
                          />
                          {qual.certificate && (
                            <Typography variant="caption" display="block">
                              {qual.certificate.name}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Testimonial
                          </Typography>
                          <input
                            type="file"
                            onChange={handleDynamicArrayFileChange(
                              "educationalQualifications",
                              index,
                              "testimonial"
                            )}
                          />
                          {qual.testimonial && (
                            <Typography variant="caption" display="block">
                              {qual.testimonial.name}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Additional Diploma/Certificate
              </Typography>
              {formData.additionalCertificates.map((certificate, index) => (
                <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    label="Certificate Name"
                    value={certificate.name}
                    onChange={(e) =>
                      handleDynamicArrayChange(
                        "additionalCertificates",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    sx={{ flexGrow: 1 }}
                    required
                    error={!!errors[`additionalCertificates[${index}].name`]}
                    helperText={errors[`additionalCertificates[${index}].name`]}
                  />
                  <input
                    type="file"
                    onChange={handleDynamicArrayFileChange(
                      "additionalCertificates",
                      index,
                      "file"
                    )}
                  />
                  {certificate.file && (
                    <Typography variant="caption">
                      {certificate.file.name} {/* Corrected from diploma.file.name */}
                    </Typography>
                  )}
                  {errors[`additionalCertificates[${index}].file`] && (
                    <Typography color="error" variant="caption">
                      {errors[`additionalCertificates[${index}].file`]}
                    </Typography>
                  )}
                  {formData.additionalCertificates.length > 0 && (
                    <IconButton
                      onClick={() => removeDynamicItem("additionalCertificates", index)}
                      color="error"
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </Box>
              ))}
              {formData.additionalCertificates.length < 5 && (
                <Button
                  startIcon={<Add />}
                  onClick={() => addDynamicItem("additionalCertificates", { name: "", file: null })}
                >
                  Add Certificate
                </Button>
              )}

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Professional Experience
              </Typography>
              {formData.professionalExperiences.map((exp, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employer Name"
                        value={exp.employerName}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "employerName",
                            e.target.value
                          )
                        }
                        required
                        error={!!errors[`professionalExperiences[${index}].employerName`]}
                        helperText={errors[`professionalExperiences[${index}].employerName`]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Details"
                        value={exp.contactDetails}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "contactDetails",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "jobTitle",
                            e.target.value
                          )
                        }
                        required
                        error={!!errors[`professionalExperiences[${index}].jobTitle`]}
                        helperText={errors[`professionalExperiences[${index}].jobTitle`]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Period"
                        value={exp.period}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "period",
                            e.target.value
                          )
                        }
                        required
                        error={!!errors[`professionalExperiences[${index}].period`]}
                        helperText={errors[`professionalExperiences[${index}].period`]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Responsibilities"
                        multiline
                        rows={2}
                        value={exp.responsibilities}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "responsibilities",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Achievements"
                        multiline
                        rows={2}
                        value={exp.achievements}
                        onChange={(e) =>
                          handleDynamicArrayChange(
                            "professionalExperiences",
                            index,
                            "achievements",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <IconButton
                      onClick={() => removeDynamicItem("professionalExperiences", index)}
                      color="error"
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              <Button
                startIcon={<Add />}
                onClick={() =>
                  addDynamicItem("professionalExperiences", {
                    employerName: "",
                    contactDetails: "",
                    jobTitle: "",
                    period: "",
                    responsibilities: "",
                    achievements: "",
                  })
                }
              >
                Add Professional Experience
              </Button>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                References
              </Typography>
              {formData.references.map((ref, index) => (
                <Box key={index} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    label="Name"
                    value={ref.name}
                    onChange={(e) =>
                      handleDynamicArrayChange("references", index, "name", e.target.value)
                    }
                    sx={{ flexGrow: 1 }}
                    required
                    error={!!errors[`references[${index}].name`]}
                    helperText={errors[`references[${index}].name`]}
                  />
                  <TextField
                    label="Designation"
                    value={ref.designation}
                    onChange={(e) =>
                      handleDynamicArrayChange("references", index, "designation", e.target.value)
                    }
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Contact"
                    value={ref.contact}
                    onChange={(e) =>
                      handleDynamicArrayChange("references", index, "contact", e.target.value)
                    }
                    sx={{ flexGrow: 1 }}
                    required
                    error={!!errors[`references[${index}].contact`]}
                    helperText={errors[`references[${index}].contact`]}
                  />
                  {formData.references.length > 0 && (
                    <IconButton
                      onClick={() => removeDynamicItem("references", index)}
                      color="error"
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </Box>
              ))}
              {formData.references.length < 5 && (
                <Button
                  startIcon={<Add />}
                  onClick={() => addDynamicItem("references", { name: "", designation: "", contact: "" })}
                >
                  Add Reference
                </Button>
              )}

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Other Documents & Bank Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.bankName}>
                    <InputLabel>Bank Name</InputLabel>
                    <Select
                      name="bankName"
                      value={formData.bankName}
                      label="Bank Name"
                      onChange={handleChange}
                    >
                      {BANKE_NAMES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bankName && (
                      <Typography color="error" variant="caption">
                        {errors.bankName}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    required
                    error={!!errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bank Account Details (e.g., Branch, SWIFT)"
                    name="bankAccountDetails"
                    value={formData.bankAccountDetails}
                    onChange={handleChange}
                    required
                    error={!!errors.bankAccountDetails}
                    helperText={errors.bankAccountDetails}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Employment Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Digital Signature
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange("digitalSignature")}
                  />
                  {formData.digitalSignature && (
                    <Typography variant="caption" display="block">
                      {formData.digitalSignature.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Joining *"
                      value={formData.dateOfJoining}
                      onChange={handleDateChange("dateOfJoining")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!errors.dateOfJoining,
                          helperText: errors.dateOfJoining,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Notice Period"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    required
                    error={!!errors.noticePeriod}
                    helperText={errors.noticePeriod}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                    error={!!errors.yearsOfExperience}
                    helperText={errors.yearsOfExperience}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Salary"
                    name="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    required
                    error={!!errors.expectedSalary}
                    helperText={errors.expectedSalary}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Subjects to Teach"
                    name="subjectsToTeach"
                    value={formData.subjectsToTeach}
                    onChange={handleChange}
                    required
                    error={!!errors.subjectsToTeach}
                    helperText={errors.subjectsToTeach}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Special Skills & Competencies
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Language Proficiencies</FormLabel>
                    <FormGroup row>
                      {languageProficiencies.map((lang) => (
                        <FormControlLabel
                          key={lang}
                          control={
                            <Checkbox
                              name="languageProficiencies"
                              value={lang}
                              checked={formData.languageProficiencies.includes(lang)}
                              onChange={handleChange}
                            />
                          }
                          label={lang}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Computer/ICT Skills"
                    name="computerSkills"
                    multiline
                    rows={3}
                    value={formData.computerSkills}
                    onChange={handleChange}
                    required
                    error={!!errors.computerSkills}
                    helperText={errors.computerSkills}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Online Profiles
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    name="linkedInURL"
                    type="url"
                    value={formData.linkedInURL}
                    onChange={handleChange}
                    required
                    error={!!errors.linkedInURL}
                    helperText={errors.linkedInURL}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Personal Website URL"
                    name="personalWebsiteURL"
                    type="url"
                    value={formData.personalWebsiteURL}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" size="large">
                  Submit Registration
                </Button>
              </Box>
            </form>
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={1}>
            <Typography variant="h6">Core Tab Content</Typography>
            <Typography>This section is currently empty and ready for future expansion.</Typography>
          </CustomTabPanel>
        </Paper>
      </Box>
    </Box>
  );
}