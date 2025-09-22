'use client'

import React from 'react';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';

const AddOrganizationPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SuperAdminSidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Add New Organization</h1>
                    <div className="mt-4">
                        {/* Organization form will go here */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <p>Organization registration form coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOrganizationPage;