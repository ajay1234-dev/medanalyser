import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { logout } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getUserReports, getReportDetail } from '../utils/api';
import PatientCard from '../components/PatientCard';
import ReportList from '../components/ReportList';
import HealthChart from '../components/HealthChart';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const patientsData = [];
      
      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        if (userData.role === 'patient') {
          const reportsSnapshot = await getDocs(
            collection(db, 'users', doc.id, 'reports')
          );
          
          patientsData.push({
            id: doc.id,
            ...userData,
            reportCount: reportsSnapshot.size
          });
        }
      }
      
      setPatients(patientsData);
    } catch (err) {
      setError('Failed to load patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReports = async (patient) => {
    try {
      setSelectedPatient(patient);
      setSelectedReport(null);
      const response = await getUserReports(patient.id);
      setPatientReports(response.reports || []);
    } catch (err) {
      setError('Failed to load patient reports');
      console.error(err);
    }
  };

  const handleReportClick = async (report) => {
    try {
      const response = await getReportDetail(report.report_id, selectedPatient.id);
      setSelectedReport(response.report);
    } catch (err) {
      setError('Failed to load report details');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const chartData = selectedPatient && patientReports.slice(0, 5).map((report, index) => ({
    date: new Date(report.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: patientReports.length - index
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MediAnalyze</h1>
                <p className="text-sm text-gray-500 font-medium">Doctor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{currentUser?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 font-semibold"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-3 shadow-md">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {selectedPatient ? `${selectedPatient.name}'s Reports` : 'My Patients'}
          </h2>
          
          {selectedPatient && (
            <button
              onClick={() => {
                setSelectedPatient(null);
                setPatientReports([]);
                setSelectedReport(null);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Patients</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : !selectedPatient ? (
          <div>
            <div className="bg-gradient-to-br from-white to-cyan-50/30 rounded-2xl shadow-lg p-6 mb-8 border border-cyan-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Overview Statistics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">Total Patients</p>
                    <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{patients.length}</p>
                </div>
                <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">Total Reports</p>
                    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {patients.reduce((sum, p) => sum + (p.reportCount || 0), 0)}
                  </p>
                </div>
                <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600">Avg Reports</p>
                    <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {patients.length > 0 ? Math.round(patients.reduce((sum, p) => sum + (p.reportCount || 0), 0) / patients.length) : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewReports={handleViewReports}
                />
              ))}
            </div>

            {patients.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-lg">No patients found</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {selectedReport && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Report Details: {selectedReport.filename}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Extracted Text</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {selectedReport.extracted_text || 'No text extracted'}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">AI Analysis</h4>
                    <div className="bg-blue-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {selectedReport.ai_analysis || 'No analysis available'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedReport.file_url && (
                  <div className="mt-4">
                    <a
                      href={selectedReport.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Original File
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportList
                reports={patientReports}
                onReportClick={handleReportClick}
              />
              
              {chartData && (
                <HealthChart
                  data={chartData}
                  title="Patient Report Timeline"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
