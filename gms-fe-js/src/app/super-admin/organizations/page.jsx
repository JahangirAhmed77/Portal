'use client'

import React, { useEffect, useState } from 'react';
import { privateRequest } from '@/lib/RequestMethods';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';
import { Search, Filter, MapPin, Phone, Mail, Eye, Trash2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OrganizationsListPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleView = (id) => {
        // TODO: Implement view functionality
        console.log('View organization:', id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                await privateRequest.delete(`/organizations/${id}`);
                setOrganizations(organizations.filter(org => org.id !== id));
                toast.success('Organization deleted successfully');
            } catch (error) {
                console.error('Error deleting organization:', error);
                toast.error('Failed to delete organization');
            }
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await privateRequest.get('/organizations');
            setOrganizations(response.data.data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrganizations = organizations.filter(org =>
        org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <SuperAdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
                        <p className="mt-2 text-gray-600">Manage all registered organizations</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center w-96">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search organizations..."
                                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter size={20} className="mr-2" />
                            Filter
                        </button>
                    </div>

                    {/* Organizations List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredOrganizations.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                No organizations found
                            </div>
                        ) : (
                            filteredOrganizations.map((org) => (
                                <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Organization Info */}
                                        <div className="flex items-start space-x-4">
                                            {/* Logo/Avatar */}
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {org.organizationLogo ? (
                                                    <img
                                                        src={org.organizationLogo}
                                                        alt={org.organizationName}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <Building2 className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {org.organizationName}
                                                    </h3>
                                                    <div className="mt-1 flex items-center">
                                                        <MapPin size={16} className="text-gray-400 mr-1" />
                                                        <span className="text-sm text-gray-600">
                                                            {org.city}, {org.province}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-6">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone size={16} className="text-gray-400 mr-1" />
                                                        {org.phoneNumber1}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Mail size={16} className="text-gray-400 mr-1" />
                                                        {org.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                Active
                                            </span>
                                            <button 
                                                onClick={() => handleView(org.id)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(org.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete Organization"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationsListPage;