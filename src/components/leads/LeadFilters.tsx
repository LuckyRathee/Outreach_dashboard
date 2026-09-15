import Button from '../common/Button'

interface LeadFiltersProps {
  status: string
  city: string
  industry: string
  search: string
  onStatusChange: (value: string) => void
  onCityChange: (value: string) => void
  onIndustryChange: (value: string) => void
  onSearchChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'responded', label: 'Responded' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

const cityOptions = [
  { value: '', label: 'All Cities' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Mohali', label: 'Mohali' },
  { value: 'Panchkula', label: 'Panchkula' },
]

const industryOptions = [
  { value: '', label: 'All Industries' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'IT Services', label: 'IT Services' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'FinTech', label: 'FinTech' },
]

export default function LeadFilters({
  status,
  city,
  industry,
  search,
  onStatusChange,
  onCityChange,
  onIndustryChange,
  onSearchChange,
  onApply,
  onReset,
}: LeadFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Company name..."
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-xs font-medium text-gray-700 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2">
          <Button onClick={onApply} size="sm" className="flex-1">
            Apply
          </Button>
          <Button onClick={onReset} variant="secondary" size="sm" className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
