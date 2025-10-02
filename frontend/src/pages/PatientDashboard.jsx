import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { getUserReports, getReportDetail } from '../utils/api';
import { logout } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import UploadReport from '../components/UploadReport';
import ReportList from '../components/ReportList';
import HealthChart from '../components/HealthChart';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [currentUser]);

  const loadReports = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await getUserReports(currentUser.uid);
      setReports(response.reports || []);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (result) => {
    loadReports();
    setSelectedReport({
      filename: result.filename,
      extracted_text: result.extracted_text,
      ai_analysis: result.ai_analysis,
      report_id: result.report_id
    });
  };

  const handleReportClick = async (report) => {
    try {
      const response = await getReportDetail(report.report_id, currentUser.uid);
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

  const chartData = reports.slice(0, 5).map((report, index) => ({
    date: new Date(report.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: reports.length - index
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MediAnalyze</h1>
                <p className="text-sm text-gray-500 font-medium">Patient Dashboard</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadReport onUploadSuccess={handleUploadSuccess} />
          
          <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Quick Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">Total Reports</p>
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{reports.length}</p>
              </div>
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">This Week</p>
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {reports.filter(r => {
                    const date = new Date(r.uploaded_at);
                    const now = new Date();
                    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedReport && (
          <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg p-6 mb-8 border border-pink-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Analysis Results
                </h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700">{selectedReport.filename}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-800">Extracted Text</h3>
                </div>
                <div className="bg-gray-50/50 rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {selectedReport.extracted_text || 'No text extracted'}
                  </pre>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-lg font-bold text-blue-800">AI Analysis</h3>
                </div>
                <div className="bg-white/60 rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.ai_analysis || 'No analysis available'}
                  </p>
                </div>
              </div>
            </div>

            {selectedReport.file_url && (
              <div className="mt-6">
                <a
                  href={selectedReport.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Original File</span>
                </a>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportList
            reports={reports}
            onReportClick={handleReportClick}
          />
          
          <HealthChart
            data={chartData}
            title="Upload Timeline"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
