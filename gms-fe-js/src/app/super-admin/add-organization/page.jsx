'use client'

import React, { useState } from 'react';
import { userRequest } from '@/lib/RequestMethods';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    name: yup.string().required('Organization name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    userName: yup.string().required('Username is required'),
    password: yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    phoneNumber: yup.string()
        .matches(/^\+92\d{10}$/, 'Phone number must be in format: +92XXXXXXXXXX')
        .required('Phone number is required'),
    phoneNumber2: yup.string()
        .matches(/^\+92\d{10}$/, 'Phone number must be in format: +92XXXXXXXXXX')
        .nullable(),
    province: yup.string().required('Province is required'),
    city: yup.string().required('City is required'),
    address: yup.string().required('Address Line 1 is required'),
    addressLine2: yup.string().nullable(),
    ntnNumber: yup.string()
        .matches(/^\d{7}-\d{1}$/, 'NTN number must be in format: XXXXXXX-X')
        .nullable(),
    strnNumber: yup.string()
        .matches(/^\d{13}$/, 'STRN number must be 13 digits')
        .nullable(),
    registrationDate: yup.date()
        .nullable()
        .max(new Date(), 'Registration date cannot be in the future'),
    contractExpiryDate: yup.date()
        .nullable()
        .min(yup.ref('registrationDate'), 'Contract expiry date must be after registration date'),
    roleName: yup.string().default('ORGANIZATION_ADMIN'),
});

// Define provinces and cities data
const provinces = [
    'Punjab',
    'Sindh',
    'KPK',
    'Balochistan',
    'Gilgit-Baltistan',
    'AJK',
    'Islamabad'
];

const cities = {
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    KPK: ['Peshawar', 'Abbottabad', 'Mardan', 'Kohat'],
    Balochistan: ['Quetta', 'Gwadar', 'Turbat'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza'],
    AJK: ['Muzaffarabad', 'Mirpur', 'Kotli'],
    Islamabad: ['Islamabad']
};

const AddOrganizationPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        organizationId: 'Auto-generated',
        name: '',
        userName: '',
        email: '',
        password: '',
        phoneNumber: '+92',
        phoneNumber2: '+92',
        province: '',
        city: '',
        address: '',
        addressLine2: '',
        ntnNumber: '',
        strnNumber: '',
        registrationDate: '',
        contractExpiryDate: '',
        roleName: 'ORGANIZATION_ADMIN'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };
            
            // Reset city when province changes
            if (name === 'province') {
                newData.city = '';
            }
            
            return newData;
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form data
            await validationSchema.validate(formData, { abortEarly: false });
            
            // Make API call
            const response = await userRequest.post('/organizations/register', formData);
            
            toast.success('Organization created successfully');
            router.push('/super-admin/organizations');
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Handle validation errors
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                // Handle API errors
                toast.error(error.response?.data?.message || 'Failed to create organization');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SuperAdminSidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Organization</h1>
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
                <div className="p-6 space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Organization ID */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Organization ID</span>
                                <input
                                    type="text"
                                    value={formData.organizationId}
                                    disabled
                                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500"
                                />
                            </label>

                            {/* Organization Name */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Organization Name *</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter Name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </label>
                        </div>

                        {/* Registration Numbers */}
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">NTN Number</span>
                                <input
                                    type="text"
                                    name="ntnNumber"
                                    value={formData.ntnNumber}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.ntnNumber ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter NTN number"
                                />
                                {errors.ntnNumber && <p className="mt-1 text-sm text-red-500">{errors.ntnNumber}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">STRN Number</span>
                                <input
                                    type="text"
                                    name="strnNumber"
                                    value={formData.strnNumber}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.strnNumber ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter STRN number"
                                />
                                {errors.strnNumber && <p className="mt-1 text-sm text-red-500">{errors.strnNumber}</p>}
                            </label>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Registration Date</span>
                                <input
                                    type="date"
                                    name="registrationDate"
                                    value={formData.registrationDate}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.registrationDate ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.registrationDate && <p className="mt-1 text-sm text-red-500">{errors.registrationDate}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Contract Expiry Date</span>
                                <input
                                    type="date"
                                    name="contractExpiryDate"
                                    value={formData.contractExpiryDate}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.contractExpiryDate ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.contractExpiryDate && <p className="mt-1 text-sm text-red-500">{errors.contractExpiryDate}</p>}
                            </label>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Email *</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter email"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Username *</span>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.userName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter username"
                                />
                                {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Password *</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter password"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Phone Number *</span>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                            </label>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Location</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Province *</span>
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.province ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">City *</span>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!formData.province}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.city ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select City</option>
                                    {formData.province && cities[formData.province]?.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Address Line 1 *</span>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.address ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter address"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</span>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-blue-50/10 border border-gray-200 rounded-md text-sm"
                                    placeholder="Enter additional address details"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4 rounded-b-lg">
                    <button
                        type="button"
                        onClick={() => router.push('/super-admin/organizations')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Save'}
                    </button>
                </div>
            </form>
                </div>
            </div>
        </div>
    );
};

export default AddOrganizationPage;