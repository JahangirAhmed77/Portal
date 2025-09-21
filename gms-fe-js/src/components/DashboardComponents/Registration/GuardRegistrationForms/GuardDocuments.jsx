'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, X, Check } from 'lucide-react';
import { publicRequest, userRequest } from '@/lib/RequestMethods';
import axios from 'axios';

const GuardDocuments = ({ onNext, onPrevious, onSave, initialData = {} }) => {


    const documentFields = [
        { name: 'picture', label: 'Picture (passport size)', required: true },
        { name: 'cnicFront', label: 'CNIC Front', required: true },
        { name: 'cnicBack', label: 'CNIC Back', required: true },
        { name: 'licenseFront', label: 'License Front', required: false },
        { name: 'licenseBack', label: 'License Back', required: false },
        { name: 'policeVerification', label: 'Police Verification', required: false },
        { name: 'specialBranchVerification', label: 'Special Branch Verification', required: false },
        { name: 'dischargeBook', label: 'Discharge Book', required: false },
        { name: 'NadraVeriSys', label: 'Nadra VeriSys', required: false },
        { name: 'NadraVeriSysRef1', label: 'Nadra VeriSys Ref 1', required: false },
        { name: 'NadraVeriSysRef2', label: 'Nadra VeriSys Ref 2', required: false },
        { name: 'healthCertificate', label: 'Health Certificate', required: false },
        { name: 'medicalDocument', label: 'Medical Document', required: false },
        { name: 'DDCDriving', label: 'DDC Driving', required: false },
        { name: 'educationCertificate', label: 'Education Certificate', required: false },
        { name: 'APSAATrainingCertificate', label: 'APSAA Training Certificate', required: false },
        { name: 'misc1', label: 'Misc Document 1', required: false },
        { name: 'misc2', label: 'Misc Document 2', required: false }
    ];

    const [uploadedFiles, setUploadedFiles] = useState(() => {
        const initialFiles = {};
        documentFields.forEach(field => {
            initialFiles[field.name] = initialData.guardDocuments?.[field.name] || null;
        });
        return initialFiles;
    });

    console.log(uploadedFiles)

    // Helper function to format guard documents data
    const formatGuardDocumentsData = (files, originalCNICSubmitted = initialData.guardDocuments?.originalCNICSubmitted || false, usePlaceholder = false) => {
        console.log('=== formatGuardDocumentsData DEBUG ===');
        console.log('files received:', files);
        console.log('usePlaceholder:', usePlaceholder);
        console.log('files.picture:', files.picture);
        console.log('files.cnicFront:', files.cnicFront);

        const result = {
            guardDocuments: {
                picture: files.picture ? (usePlaceholder ? 'uploaded_file_placeholder' : files.picture) : '',
                cnicFront: files.cnicFront ? (usePlaceholder ? 'uploaded_file_placeholder' : files.cnicFront) : '',
                cnicBack: files.cnicBack ? (usePlaceholder ? 'uploaded_file_placeholder' : files.cnicBack) : '',
                licenseFront: files.licenseFront ? (usePlaceholder ? 'uploaded_file_placeholder' : files.licenseFront) : '',
                licenseBack: files.licenseBack ? (usePlaceholder ? 'uploaded_file_placeholder' : files.licenseBack) : '',
                policeVerification: files.policeVerification ? (usePlaceholder ? 'uploaded_file_placeholder' : files.policeVerification) : '',
                specialBranchVerification: files.specialBranchVerification ? (usePlaceholder ? 'uploaded_file_placeholder' : files.specialBranchVerification) : '',
                dischargeBook: files.dischargeBook ? (usePlaceholder ? 'uploaded_file_placeholder' : files.dischargeBook) : '',
                NadraVeriSys: files.NadraVeriSys ? (usePlaceholder ? 'uploaded_file_placeholder' : files.NadraVeriSys) : '',
                NadraVeriSysRef1: files.NadraVeriSysRef1 ? (usePlaceholder ? 'uploaded_file_placeholder' : files.NadraVeriSysRef1) : '',
                NadraVeriSysRef2: files.NadraVeriSysRef2 ? (usePlaceholder ? 'uploaded_file_placeholder' : files.NadraVeriSysRef2) : '',
                healthCertificate: files.healthCertificate ? (usePlaceholder ? 'uploaded_file_placeholder' : files.healthCertificate) : '',
                medicalDocument: files.medicalDocument ? (usePlaceholder ? 'uploaded_file_placeholder' : files.medicalDocument) : '',
                DDCDriving: files.DDCDriving ? (usePlaceholder ? 'uploaded_file_placeholder' : files.DDCDriving) : '',
                educationCertificate: files.educationCertificate ? (usePlaceholder ? 'uploaded_file_placeholder' : files.educationCertificate) : '',
                APSAATrainingCertificate: files.APSAATrainingCertificate ? (usePlaceholder ? 'uploaded_file_placeholder' : files.APSAATrainingCertificate) : '',
                misc1: files.misc1 ? (usePlaceholder ? 'uploaded_file_placeholder' : files.misc1) : '',
                misc2: files.misc2 ? (usePlaceholder ? 'uploaded_file_placeholder' : files.misc2) : '',
                originalCNICSubmitted: originalCNICSubmitted
            }
        };

        console.log('result.guardDocuments.picture:', result.guardDocuments.picture);
        console.log('result.guardDocuments.cnicFront:', result.guardDocuments.cnicFront);
        console.log('=== END formatGuardDocumentsData DEBUG ===');

        return result;
    };

    // 1. Update validationSchema to require picture, cnicFront, cnicBack, and originalCNICSubmitted
    const validationSchema = Yup.object({
        picture: Yup.string().required('Picture is required'),
        cnicFront: Yup.string().required('CNIC Front is required'),
        cnicBack: Yup.string().required('CNIC Back is required'),
        originalCNICSubmitted: Yup.boolean()
            .required('Please select Yes or No')
            .typeError('Please select Yes or No')
    });

    const initialValues = {
        ...documentFields.reduce((acc, field) => {
            acc[field.name] = initialData.guardDocuments?.[field.name] || '';
            return acc;
        }, {}),
        originalCNICSubmitted:
            typeof initialData.guardDocuments?.originalCNICSubmitted === 'boolean'
                ? initialData.guardDocuments.originalCNICSubmitted
                : undefined
    };

    const handleSubmit = (values) => {
        console.log('=== DEBUG handleSubmit ===');
        console.log('uploadedFiles:', uploadedFiles);
        console.log('values.originalCNICSubmitted:', values.originalCNICSubmitted);

        // Structure data according to API format using helper function with actual keys
        const formattedData = formatGuardDocumentsData(uploadedFiles, values.originalCNICSubmitted, false);

        console.log('Final formattedData:', formattedData);
        console.log('=== END DEBUG ===');

        if (onNext) {
            onNext(formattedData);
        }
    };

    // 2. Update handleFileUpload to accept setFieldValue and update Formik value after upload
    const handleFileUpload = async (fieldName, event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                return;
            }

            // Validate file size (max 10MB for documents)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                return;
            }

            //We will first upload the filename and filetype only then api would make slot and return the upload url, but during this time store the key in the uploaded file, in that url we will PUT the request so that we can

            const getUploadKeyPayload =
            {

                fileName: file.name,
                fileType: file.type

            }
            console.log(getUploadKeyPayload);

            const res = await userRequest.post("/file/url", getUploadKeyPayload);

            const { key, uploadUrl } = res.data.data;
            console.log("Key: ", key);
            console.log("Upload Key: ", uploadUrl);

            const uploadFileResponse = await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (uploadFileResponse.status == 200) {
                console.log(file.name, "Uploaded")
            }

            // Update the uploaded files state
            const updatedFiles = {
                ...uploadedFiles,
                [fieldName]: key
            };

            setUploadedFiles(updatedFiles);

            // Sync Formik value
            setFieldValue(fieldName, key);

            // Auto-save the data immediately after file upload
            // This ensures persistence even without clicking continue
            const formattedData = formatGuardDocumentsData(updatedFiles);

            // Auto-save to parent component for persistence (without navigation)
            if (onSave) {
                onSave(formattedData);
            }

            // setUploadedFiles(prev => ({
            //     ...prev,
            //     [fieldName]: file
            // }));
        }
    };

    const removeFile = (fieldName) => {
        const updatedFiles = {
            ...uploadedFiles,
            [fieldName]: null
        };

        setUploadedFiles(updatedFiles);

        // Auto-save the data after file removal
        const formattedData = formatGuardDocumentsData(updatedFiles);

        // Auto-save to parent component for persistence (without navigation)
        if (onSave) {
            onSave(formattedData);
        }
    };

    // 3. Update DocumentUploadField to accept setFieldValue, error, and touched, and show error
    const DocumentUploadField = ({ field, setFieldValue, error, touched }) => {
        const file = uploadedFiles[field.name];
        const isRequired = field.required;

        // Show file.name if file is an object with a name property, otherwise show the string value
        let fileDisplayName = '';
        if (file) {
            if (typeof file === 'object' && file.name) {
                fileDisplayName = file.name;
            } else {
                fileDisplayName = file;
            }
        }

        return (
            <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={fileDisplayName}
                            placeholder={field.label + (isRequired ? ' (Required)' : ' (Optional)')}
                            readOnly
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-[#212121]"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileUpload(field.name, e, setFieldValue)}
                                className="hidden"
                                id={`upload-${field.name}`}
                            />
                            <label
                                htmlFor={`upload-${field.name}`}
                                className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer transition-colors border border-blue-200"
                                title={file ? "Replace file" : "Upload file"}
                            >
                                {file ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <Plus className="h-5 w-5 text-blue-600" />
                                )}
                            </label>
                        </div>
                        {file && (
                            <button
                                type="button"
                                onClick={() => removeFile(field.name)}
                                className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 rounded-md transition-colors border border-red-200"
                                title="Remove file"
                            >
                                <X className="h-5 w-5 text-red-600" />
                            </button>
                        )}
                    </div>
                </div>
                {/* Show error if any */}
                {error && touched && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Guard Documents</h2>
                    <div className="text-sm text-gray-500">Step 7 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
                        {/* Document Upload Grid */}
                        <div className="grid text-[13px] grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                            {documentFields.map((field) => (
                                <DocumentUploadField
                                    key={field.name}
                                    field={field}
                                    setFieldValue={setFieldValue}
                                    error={errors[field.name]}
                                    touched={touched[field.name]}
                                />
                            ))}
                        </div>

                        {/* Original CNIC Submitted Radio Buttons */}
                        <div className="flex justify-center items-center space-x-4">
                            <p className=''>Original CNIC Submitted</p>
                            <label className="flex items-center space-x-2">
                                <Field
                                    type="radio"
                                    name="originalCNICSubmitted"
                                    value="true"
                                    checked={values.originalCNICSubmitted === true}
                                    onChange={() => setFieldValue('originalCNICSubmitted', true)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Field
                                    type="radio"
                                    name="originalCNICSubmitted"
                                    value="false"
                                    checked={values.originalCNICSubmitted === false}
                                    onChange={() => setFieldValue('originalCNICSubmitted', false)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="text-sm font-medium text-gray-700">No</span>
                            </label>
                        </div>
                        {errors.originalCNICSubmitted && touched.originalCNICSubmitted && (
                            <div className="text-red-500 text-xs mt-1">{errors.originalCNICSubmitted}</div>
                        )}

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Document Upload Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Upload clear, high-quality images or PDF files</li>
                                            <li>Picture should be passport size with clear face visibility</li>
                                            <li>CNIC documents must be readable and valid</li>
                                            <li>License documents are optional but recommended if available</li>
                                            <li>Maximum file size: 10MB per document</li>
                                            <li>Supported formats: JPG, PNG, PDF</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Buttons */}
                        <div className="flex justify-center space-x-4 pt-8">
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            >
                                {isSubmitting ? 'Uploading...' : 'Continue'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default GuardDocuments;