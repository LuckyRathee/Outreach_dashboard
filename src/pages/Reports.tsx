export default function Reports() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
          <svg 
            className="h-12 w-12 text-primary-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Reports Coming Soon
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg">
          We're building comprehensive analytics and reporting features to help you track your outreach performance, lead engagement, and conversion metrics.
        </p>

        {/* Features List */}
        <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">What to expect:</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Outreach volume trends (emails & WhatsApp)</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Response rate analytics</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Template performance metrics</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Lead conversion funnel</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Exportable custom reports</span>
            </li>
          </ul>
        </div>

        {/* Current Data Sources */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-3">
            <strong>Current data available:</strong>
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Dashboard Metrics
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Activity Timeline
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              WhatsApp Queue
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
