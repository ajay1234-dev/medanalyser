import { useState } from 'react';

const ReportList = ({ reports, onReportClick, showPatientInfo = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report =>
    report.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.ai_analysis && report.ai_analysis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-lg p-6 border border-indigo-100">
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Medical Reports
            </h3>
          </div>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
            {filteredReports.length}
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by filename or analysis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/60"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div
              key={report.report_id}
              onClick={() => onReportClick(report)}
              className="group bg-white/60 border border-gray-200 rounded-xl p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-indigo-100 p-1.5 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-700 transition-colors">
                      {report.filename}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(report.uploaded_at)}</span>
                  </div>
                  {report.ai_analysis && (
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {report.ai_analysis.substring(0, 150)}...
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-indigo-100 transition-colors">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;
