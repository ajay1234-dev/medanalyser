const PatientCard = ({ patient, onViewReports }) => {
  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return 'from-blue-500 to-indigo-600';
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="group bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(patient.name)} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-xl font-bold text-white">
              {getInitials(patient.name)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
              {patient.name || 'Unknown Patient'}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">{patient.email}</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{patient.reportCount || 0} reports</span>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onViewReports(patient)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 group-hover:scale-105"
        >
          <span>View Reports</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
