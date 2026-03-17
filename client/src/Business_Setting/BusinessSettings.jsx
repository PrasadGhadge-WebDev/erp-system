import React, { useState, useEffect } from 'react';
import {
    Building2, Mail, Phone, MapPin, Globe, Camera,
    Upload, X, Check, AlertCircle, Save, Edit2,
    Facebook, Twitter, Linkedin, Instagram, Youtube,
    CreditCard, FileText, Settings as SettingsIcon,
    DollarSign, Calendar, Clock, Image, PenTool,
    Banknote, Hash, Award, RefreshCw
} from 'lucide-react';
import {
    getBusinessSettings,
    createBusinessSettings,
    updateBusinessSettings,
    uploadLogo,
    uploadSignature
} from '../../services/businessSettingService';
import './BusinessSettings.css';

const BusinessSettings = () => {
    // State management
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('company');

    // Form state
    const [formData, setFormData] = useState({
        company_name: '',
        company_tagline: '',
        logo: {
            url: '',
            public_id: '',
            alt_text: ''
        },
        signature: {
            url: '',
            public_id: '',
            signatory_name: '',
            signatory_designation: ''
        },
        contact: {
            email: '',
            phone: [''],
            alternate_phone: [''],
            whatsapp: '',
            website: ''
        },
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zip_code: '',
            landmark: ''
        },
        social_media: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            youtube: ''
        },
        report_settings: {
            default_language: 'en',
            date_format: 'DD/MM/YYYY',
            timezone: 'UTC',
            currency: 'USD',
            fiscal_year_start: '',
            fiscal_year_end: '',
            report_footer_text: '',
            report_header_text: '',
            show_logo: true,
            show_signature: true,
            page_size: 'A4'
        },
        bank_details: {
            bank_name: '',
            account_name: '',
            account_number: '',
            ifsc_code: '',
            swift_code: '',
            branch_address: ''
        },
        tax_info: {
            gst_number: '',
            pan_number: '',
            tan_number: '',
            vat_number: ''
        }
    });

    // File upload states
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingSignature, setUploadingSignature] = useState(false);

    // Toast notification
    const [toast, setToast] = useState(null);

    // Edit mode for sections
    const [editMode, setEditMode] = useState({
        company: false,
        contact: false,
        address: false,
        social: false,
        reports: false,
        bank: false,
        tax: false
    });

    // Fetch data on mount
    useEffect(() => {
        fetchBusinessSettings();
    }, []);

    const fetchBusinessSettings = async () => {
        setIsLoading(true);
        try {
            const response = await getBusinessSettings();
            if (response && response.success) {
                setSettings(response.data);
                setFormData(prev => ({
                    ...prev,
                    ...response.data
                }));
            }
        } catch (error) {
            console.error('Error fetching business settings:', error);
            showToast('error', 'Failed to fetch business settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else if (section.includes('.')) {
            // Handle nested fields like 'contact.email'
            const [parent, child] = section.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleArrayFieldChange = (section, field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[section][field]];
            newArray[index] = value;
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: newArray
                }
            };
        });
    };

    const addArrayField = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: [...prev[section][field], '']
            }
        }));
    };

    const removeArrayField = (section, field, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: prev[section][field].filter((_, i) => i !== index)
            }
        }));
    };

    // File upload handlers
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSignatureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = async () => {
        if (!logoFile || !settings?._id) return;

        setUploadingLogo(true);
        try {
            const uploadData = new FormData();
            uploadData.append('logo', logoFile);
            uploadData.append('alt_text', formData.logo?.alt_text || '');

            const response = await uploadLogo(settings._id, uploadData);
            if (response && response.success) {
                showToast('success', 'Logo uploaded successfully');
                setLogoFile(null);
                setLogoPreview(null);
                await fetchBusinessSettings();
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            showToast('error', 'Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSignatureUpload = async () => {
        if (!signatureFile || !settings?._id) return;

        setUploadingSignature(true);
        try {
            const uploadData = new FormData();
            uploadData.append('signature', signatureFile);
            uploadData.append('signatory_name', formData.signature?.signatory_name || '');
            uploadData.append('signatory_designation', formData.signature?.signatory_designation || '');

            const response = await uploadSignature(settings._id, uploadData);
            if (response && response.success) {
                showToast('success', 'Signature uploaded successfully');
                setSignatureFile(null);
                setSignaturePreview(null);
                await fetchBusinessSettings();
            }
        } catch (error) {
            console.error('Error uploading signature:', error);
            showToast('error', 'Failed to upload signature');
        } finally {
            setUploadingSignature(false);
        }
    };

    // Save settings
    const handleSave = async () => {
        setIsSaving(true);
        try {
            let response;
            if (settings) {
                response = await updateBusinessSettings(settings._id, formData);
            } else {
                response = await createBusinessSettings(formData);
            }

            if (response && response.success) {
                showToast('success', 'Business settings saved successfully');
                await fetchBusinessSettings();
                // Turn off edit modes
                setEditMode({
                    company: false,
                    contact: false,
                    address: false,
                    social: false,
                    reports: false,
                    bank: false,
                    tax: false
                });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('error', error.response?.data?.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const toggleEditMode = (section) => {
        setEditMode(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const tabs = [
        { id: 'company', label: 'Company Info', icon: <Building2 size={18} /> },
        { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
        { id: 'address', label: 'Address', icon: <MapPin size={18} /> },
        { id: 'social', label: 'Social Media', icon: <Globe size={18} /> },
        { id: 'reports', label: 'Report Settings', icon: <FileText size={18} /> },
        { id: 'bank', label: 'Bank Details', icon: <CreditCard size={18} /> },
        { id: 'tax', label: 'Tax Info', icon: <Award size={18} /> }
    ];

    if (isLoading) {
        return (
            <div className="business-settings-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading business settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="business-settings-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>
                        <Building2 size={28} />
                        Business Settings
                    </h1>
                    <p>Manage your company information and report preferences</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw size={16} className="spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="settings-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Settings Content */}
            <div className="settings-content">
                {/* Company Info Tab */}
                {activeTab === 'company' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <Building2 size={20} />
                                Company Information
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('company')}
                            >
                                {editMode.company ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.company ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            {/* Logo Upload */}
                            <div className="logo-section">
                                <h3>Company Logo</h3>
                                <div className="logo-upload-container">
                                    <div className="logo-preview">
                                        {(logoPreview || formData.logo?.url) ? (
                                            <img
                                                src={logoPreview || formData.logo?.url}
                                                alt={formData.logo?.alt_text || "Company Logo"}
                                            />
                                        ) : (
                                            <div className="logo-placeholder">
                                                <Image size={48} />
                                                <span>No Logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="logo-upload-controls">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="logo-upload" className="btn-secondary">
                                            <Camera size={14} />
                                            Choose Image
                                        </label>
                                        {logoFile && (
                                            <button
                                                className="btn-primary"
                                                onClick={handleLogoUpload}
                                                disabled={uploadingLogo}
                                            >
                                                <Upload size={14} />
                                                {uploadingLogo ? 'Uploading...' : 'Upload'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {editMode.company && (
                                    <div className="logo-alt-input">
                                        <label>Alt Text</label>
                                        <input
                                            type="text"
                                            value={formData.logo?.alt_text || ''}
                                            onChange={(e) => handleInputChange('logo', 'alt_text', e.target.value)}
                                            placeholder="Logo description"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Signature Upload */}
                            <div className="signature-section">
                                <h3>Authorized Signature</h3>
                                <div className="signature-upload-container">
                                    <div className="signature-preview">
                                        {(signaturePreview || formData.signature?.url) ? (
                                            <img
                                                src={signaturePreview || formData.signature?.url}
                                                alt="Authorized Signature"
                                            />
                                        ) : (
                                            <div className="signature-placeholder">
                                                <PenTool size={48} />
                                                <span>No Signature</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="signature-upload-controls">
                                        <input
                                            type="file"
                                            id="signature-upload"
                                            accept="image/*"
                                            onChange={handleSignatureChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="signature-upload" className="btn-secondary">
                                            <Camera size={14} />
                                            Choose Image
                                        </label>
                                        {signatureFile && (
                                            <button
                                                className="btn-primary"
                                                onClick={handleSignatureUpload}
                                                disabled={uploadingSignature}
                                            >
                                                <Upload size={14} />
                                                {uploadingSignature ? 'Uploading...' : 'Upload'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editMode.company && (
                                    <div className="signature-details">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Signatory Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.signature?.signatory_name || ''}
                                                    onChange={(e) => handleInputChange('signature', 'signatory_name', e.target.value)}
                                                    placeholder="e.g., John Doe"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Designation</label>
                                                <input
                                                    type="text"
                                                    value={formData.signature?.signatory_designation || ''}
                                                    onChange={(e) => handleInputChange('signature', 'signatory_designation', e.target.value)}
                                                    placeholder="e.g., Managing Director"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Company Details */}
                            <div className="company-details">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    {editMode.company ? (
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => handleInputChange('root', 'company_name', e.target.value)}
                                            placeholder="Enter company name"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.company_name || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Company Tagline</label>
                                    {editMode.company ? (
                                        <input
                                            type="text"
                                            value={formData.company_tagline}
                                            onChange={(e) => handleInputChange('root', 'company_tagline', e.target.value)}
                                            placeholder="Enter company tagline"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.company_tagline || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <Mail size={20} />
                                Contact Information
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('contact')}
                            >
                                {editMode.contact ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.contact ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-group">
                                <label>Email Address</label>
                                {editMode.contact ? (
                                    <input
                                        type="email"
                                        value={formData.contact?.email || ''}
                                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                                        placeholder="info@company.com"
                                    />
                                ) : (
                                    <p className="field-value">{formData.contact?.email || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Phone Numbers</label>
                                {editMode.contact ? (
                                    <div className="array-field">
                                        {formData.contact?.phone?.map((phone, index) => (
                                            <div key={index} className="array-item">
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => handleArrayFieldChange('contact', 'phone', index, e.target.value)}
                                                    placeholder="+1 234 567 8900"
                                                />
                                                {index > 0 && (
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => removeArrayField('contact', 'phone', index)}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            className="add-btn"
                                            onClick={() => addArrayField('contact', 'phone')}
                                        >
                                            <Phone size={14} />
                                            Add Phone Number
                                        </button>
                                    </div>
                                ) : (
                                    <p className="field-value">
                                        {formData.contact?.phone?.filter(p => p).join(', ') || 'Not set'}
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>WhatsApp Number</label>
                                {editMode.contact ? (
                                    <input
                                        type="tel"
                                        value={formData.contact?.whatsapp || ''}
                                        onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
                                        placeholder="+1 234 567 8900"
                                    />
                                ) : (
                                    <p className="field-value">{formData.contact?.whatsapp || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Website</label>
                                {editMode.contact ? (
                                    <input
                                        type="url"
                                        value={formData.contact?.website || ''}
                                        onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                                        placeholder="https://www.company.com"
                                    />
                                ) : (
                                    <p className="field-value">{formData.contact?.website || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <MapPin size={20} />
                                Address Information
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('address')}
                            >
                                {editMode.address ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.address ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Street Address</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.street || ''}
                                            onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                                            placeholder="123 Business Ave"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.street || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Landmark</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.landmark || ''}
                                            onChange={(e) => handleInputChange('address', 'landmark', e.target.value)}
                                            placeholder="Near City Center"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.landmark || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.city || ''}
                                            onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                                            placeholder="New York"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.city || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>State</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.state || ''}
                                            onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                                            placeholder="NY"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.state || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.country || ''}
                                            onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                                            placeholder="USA"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.country || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    {editMode.address ? (
                                        <input
                                            type="text"
                                            value={formData.address?.zip_code || ''}
                                            onChange={(e) => handleInputChange('address', 'zip_code', e.target.value)}
                                            placeholder="10001"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.address?.zip_code || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Social Media Tab */}
                {activeTab === 'social' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <Globe size={20} />
                                Social Media Links
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('social')}
                            >
                                {editMode.social ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.social ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-group">
                                <label><Facebook size={16} /> Facebook</label>
                                {editMode.social ? (
                                    <input
                                        type="url"
                                        value={formData.social_media?.facebook || ''}
                                        onChange={(e) => handleInputChange('social_media', 'facebook', e.target.value)}
                                        placeholder="https://facebook.com/company"
                                    />
                                ) : (
                                    <p className="field-value">{formData.social_media?.facebook || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label><Twitter size={16} /> Twitter</label>
                                {editMode.social ? (
                                    <input
                                        type="url"
                                        value={formData.social_media?.twitter || ''}
                                        onChange={(e) => handleInputChange('social_media', 'twitter', e.target.value)}
                                        placeholder="https://twitter.com/company"
                                    />
                                ) : (
                                    <p className="field-value">{formData.social_media?.twitter || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label><Linkedin size={16} /> LinkedIn</label>
                                {editMode.social ? (
                                    <input
                                        type="url"
                                        value={formData.social_media?.linkedin || ''}
                                        onChange={(e) => handleInputChange('social_media', 'linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/company/company"
                                    />
                                ) : (
                                    <p className="field-value">{formData.social_media?.linkedin || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label><Instagram size={16} /> Instagram</label>
                                {editMode.social ? (
                                    <input
                                        type="url"
                                        value={formData.social_media?.instagram || ''}
                                        onChange={(e) => handleInputChange('social_media', 'instagram', e.target.value)}
                                        placeholder="https://instagram.com/company"
                                    />
                                ) : (
                                    <p className="field-value">{formData.social_media?.instagram || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label><Youtube size={16} /> YouTube</label>
                                {editMode.social ? (
                                    <input
                                        type="url"
                                        value={formData.social_media?.youtube || ''}
                                        onChange={(e) => handleInputChange('social_media', 'youtube', e.target.value)}
                                        placeholder="https://youtube.com/@company"
                                    />
                                ) : (
                                    <p className="field-value">{formData.social_media?.youtube || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Settings Tab */}
                {activeTab === 'reports' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <FileText size={20} />
                                Report Settings
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('reports')}
                            >
                                {editMode.reports ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.reports ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label><DollarSign size={16} /> Currency</label>
                                    {editMode.reports ? (
                                        <select
                                            value={formData.report_settings?.currency || 'USD'}
                                            onChange={(e) => handleInputChange('report_settings', 'currency', e.target.value)}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="AUD">AUD (A$)</option>
                                            <option value="CAD">CAD (C$)</option>
                                            <option value="AED">AED (د.إ)</option>
                                        </select>
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.currency || 'USD'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label><Calendar size={16} /> Date Format</label>
                                    {editMode.reports ? (
                                        <select
                                            value={formData.report_settings?.date_format || 'DD/MM/YYYY'}
                                            onChange={(e) => handleInputChange('report_settings', 'date_format', e.target.value)}
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.date_format || 'DD/MM/YYYY'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><Clock size={16} /> Timezone</label>
                                    {editMode.reports ? (
                                        <select
                                            value={formData.report_settings?.timezone || 'UTC'}
                                            onChange={(e) => handleInputChange('report_settings', 'timezone', e.target.value)}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Asia/Dubai">Dubai</option>
                                            <option value="Asia/Kolkata">India (IST)</option>
                                            <option value="Asia/Singapore">Singapore</option>
                                            <option value="Australia/Sydney">Sydney</option>
                                        </select>
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.timezone || 'UTC'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label><FileText size={16} /> Page Size</label>
                                    {editMode.reports ? (
                                        <select
                                            value={formData.report_settings?.page_size || 'A4'}
                                            onChange={(e) => handleInputChange('report_settings', 'page_size', e.target.value)}
                                        >
                                            <option value="A4">A4</option>
                                            <option value="Letter">Letter</option>
                                            <option value="Legal">Legal</option>
                                        </select>
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.page_size || 'A4'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fiscal Year Start</label>
                                    {editMode.reports ? (
                                        <input
                                            type="text"
                                            value={formData.report_settings?.fiscal_year_start || ''}
                                            onChange={(e) => handleInputChange('report_settings', 'fiscal_year_start', e.target.value)}
                                            placeholder="e.g., 2024-04-01"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.fiscal_year_start || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Fiscal Year End</label>
                                    {editMode.reports ? (
                                        <input
                                            type="text"
                                            value={formData.report_settings?.fiscal_year_end || ''}
                                            onChange={(e) => handleInputChange('report_settings', 'fiscal_year_end', e.target.value)}
                                            placeholder="e.g., 2025-03-31"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.report_settings?.fiscal_year_end || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Report Header Text</label>
                                {editMode.reports ? (
                                    <input
                                        type="text"
                                        value={formData.report_settings?.report_header_text || ''}
                                        onChange={(e) => handleInputChange('report_settings', 'report_header_text', e.target.value)}
                                        placeholder="e.g., Confidential Report"
                                    />
                                ) : (
                                    <p className="field-value">{formData.report_settings?.report_header_text || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Report Footer Text</label>
                                {editMode.reports ? (
                                    <input
                                        type="text"
                                        value={formData.report_settings?.report_footer_text || ''}
                                        onChange={(e) => handleInputChange('report_settings', 'report_footer_text', e.target.value)}
                                        placeholder="e.g., This is a system generated report"
                                    />
                                ) : (
                                    <p className="field-value">{formData.report_settings?.report_footer_text || 'Not set'}</p>
                                )}
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.report_settings?.show_logo}
                                        onChange={(e) => handleInputChange('report_settings', 'show_logo', e.target.checked)}
                                        disabled={!editMode.reports}
                                    />
                                    <span>Show logo on reports</span>
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.report_settings?.show_signature}
                                        onChange={(e) => handleInputChange('report_settings', 'show_signature', e.target.checked)}
                                        disabled={!editMode.reports}
                                    />
                                    <span>Show signature on reports</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bank Details Tab */}
                {activeTab === 'bank' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <Banknote size={20} />
                                Bank Details
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('bank')}
                            >
                                {editMode.bank ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.bank ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-group">
                                <label>Bank Name</label>
                                {editMode.bank ? (
                                    <input
                                        type="text"
                                        value={formData.bank_details?.bank_name || ''}
                                        onChange={(e) => handleInputChange('bank_details', 'bank_name', e.target.value)}
                                        placeholder="e.g., Chase Bank"
                                    />
                                ) : (
                                    <p className="field-value">{formData.bank_details?.bank_name || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Account Name</label>
                                {editMode.bank ? (
                                    <input
                                        type="text"
                                        value={formData.bank_details?.account_name || ''}
                                        onChange={(e) => handleInputChange('bank_details', 'account_name', e.target.value)}
                                        placeholder="e.g., TechLearn Solutions"
                                    />
                                ) : (
                                    <p className="field-value">{formData.bank_details?.account_name || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Account Number</label>
                                    {editMode.bank ? (
                                        <input
                                            type="text"
                                            value={formData.bank_details?.account_number || ''}
                                            onChange={(e) => handleInputChange('bank_details', 'account_number', e.target.value)}
                                            placeholder="Account number"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.bank_details?.account_number || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label><Hash size={16} /> IFSC Code</label>
                                    {editMode.bank ? (
                                        <input
                                            type="text"
                                            value={formData.bank_details?.ifsc_code || ''}
                                            onChange={(e) => handleInputChange('bank_details', 'ifsc_code', e.target.value)}
                                            placeholder="e.g., CHASUS33"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.bank_details?.ifsc_code || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>SWIFT Code</label>
                                    {editMode.bank ? (
                                        <input
                                            type="text"
                                            value={formData.bank_details?.swift_code || ''}
                                            onChange={(e) => handleInputChange('bank_details', 'swift_code', e.target.value)}
                                            placeholder="e.g., CHASUS33XXX"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.bank_details?.swift_code || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Branch Address</label>
                                    {editMode.bank ? (
                                        <input
                                            type="text"
                                            value={formData.bank_details?.branch_address || ''}
                                            onChange={(e) => handleInputChange('bank_details', 'branch_address', e.target.value)}
                                            placeholder="Branch address"
                                        />
                                    ) : (
                                        <p className="field-value">{formData.bank_details?.branch_address || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tax Info Tab */}
                {activeTab === 'tax' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2>
                                <Award size={20} />
                                Tax Information
                            </h2>
                            <button
                                className="edit-toggle"
                                onClick={() => toggleEditMode('tax')}
                            >
                                {editMode.tax ? <X size={16} /> : <Edit2 size={16} />}
                                {editMode.tax ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="section-body">
                            <div className="form-group">
                                <label>GST Number</label>
                                {editMode.tax ? (
                                    <input
                                        type="text"
                                        value={formData.tax_info?.gst_number || ''}
                                        onChange={(e) => handleInputChange('tax_info', 'gst_number', e.target.value)}
                                        placeholder="e.g., 22AAAAA0000A1Z5"
                                    />
                                ) : (
                                    <p className="field-value">{formData.tax_info?.gst_number || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>PAN Number</label>
                                {editMode.tax ? (
                                    <input
                                        type="text"
                                        value={formData.tax_info?.pan_number || ''}
                                        onChange={(e) => handleInputChange('tax_info', 'pan_number', e.target.value)}
                                        placeholder="e.g., AAAAA0000A"
                                    />
                                ) : (
                                    <p className="field-value">{formData.tax_info?.pan_number || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>TAN Number</label>
                                {editMode.tax ? (
                                    <input
                                        type="text"
                                        value={formData.tax_info?.tan_number || ''}
                                        onChange={(e) => handleInputChange('tax_info', 'tan_number', e.target.value)}
                                        placeholder="e.g., AAA00000A"
                                    />
                                ) : (
                                    <p className="field-value">{formData.tax_info?.tan_number || 'Not set'}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>VAT Number</label>
                                {editMode.tax ? (
                                    <input
                                        type="text"
                                        value={formData.tax_info?.vat_number || ''}
                                        onChange={(e) => handleInputChange('tax_info', 'vat_number', e.target.value)}
                                        placeholder="VAT number"
                                    />
                                ) : (
                                    <p className="field-value">{formData.tax_info?.vat_number || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' && <Check size={18} color="#059669" />}
                    {toast.type === 'error' && <AlertCircle size={18} color="#dc2626" />}
                    <span>{toast.message}</span>
                    <button className="toast-close" onClick={() => setToast(null)}>
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BusinessSettings;