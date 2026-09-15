export default function LoadingLogo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img 
          src="/digital-patron-logo.png" 
          alt="Digital Patron" 
          className="h-20 w-auto mx-auto mb-4"
        />
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  )
}
