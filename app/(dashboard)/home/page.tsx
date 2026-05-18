function HomePage() {
  return (
    <div className="p-6 space-y-8 min-h-[80vh] flex flex-col justify-between">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Development Status</h1>
          <p className="text-sm text-gray-500">
            Overview of all currently developed modules and features
          </p>
        </div>

        {/* Current Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Round Activity */}
          <div className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg">Round Activity</h2>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>Blackjack</li>
              <li>Roulette</li>
              <li>Baccarat</li>
              <li>Sweet Bonanza</li>
              <li>All other games (partial integration - under development)</li>
            </ul>
          </div>

          {/* Kibana Enhancements - HIGHLIGHTED UNDER DEVELOPMENT */}
          <div className="border-2 border-amber-400 bg-amber-50/50 rounded-xl p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg shadow-sm">
              Under Development
            </div>
            <h2 className="font-semibold text-lg text-amber-900 flex items-center gap-2">
              Advanced Kibana Dashboard
            </h2>
            <p className="text-sm text-amber-800 mt-2">
              Dynamic pre-built search filters, faster log exploration, and
              improved observability workflows.
            </p>
          </div>

          {/* Resolution System */}
          <div className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg">Resolution System</h2>
            <p className="text-sm text-gray-600 mt-2">
              Automatic round resolution summary generation
            </p>
          </div>

          {/* Player History */}
          <div className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg">Player History</h2>
            <p className="text-sm text-gray-600 mt-2">
              Last 24 hours betting and activity tracking
            </p>
          </div>

          {/* Casino Details */}
          <div className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg">Casino Details</h2>
            <p className="text-sm text-gray-600 mt-2">
              Game metadata, configuration, and casino-level info
            </p>
          </div>

          {/* User Details */}
          <div className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg">User Details</h2>
            <p className="text-sm text-gray-600 mt-2">
              Player profiles, identity, and account information
            </p>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Crash Games Expansion */}
            <div className="border rounded-xl p-4 shadow-sm bg-yellow-50">
              <h3 className="font-semibold">Crash Games Expansion</h3>
              <p className="text-sm text-gray-600 mt-2">
                Full integration of crash games into round activity tracking.
              </p>
            </div>

            {/* Multi Round Resolution */}
            <div className="border rounded-xl p-4 shadow-sm bg-blue-50">
              <h3 className="font-semibold">Multi-Round Resolution Summary</h3>
              <p className="text-sm text-gray-600 mt-2">
                Aggregated resolution engine to generate combined summaries across
                multiple selected game rounds for analytics and audit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Feedback Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900">Have feedback or found an issue?</h4>
            <p className="text-sm text-gray-500 mt-0.5">
              Help us improve by logging your bugs, complaints, suggestions, or feature enhancements.
            </p>
          </div>
          <a
            href="https://pragmaticplay.sharepoint.com/:x:/s/LC-TechSupport/IQCOAvurVHyKRIKIrFTNWMa2AQWAePuxEWDCSgz28qovf2w?e=Xu9Cbi&isSPOFile=1&xsdata=MDV8MDJ8fDkwMjRmOTljODA2ZTRkMjNiMzEyMDhkZWIwMGIxZGNlfDIxNGY2NTE5Y2QxOTQ3MjZhMjIxYjcwMzc4ZTg4OWY2fDB8MHw2MzkxNDE3NTg5MjQ0MDM0NzR8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKRFFTSTZJbFJsWVcxelgwRlVVRk5sY25acFkyVmZVMUJQVEU5R0lpd2lWaUk2SWpBdU1DNHdNREF3SWl3aVVDSTZJbGRwYmpNeUlpd2lRVTRpT2lKUGRHaGxjaUlzSWxkVUlqb3hNWDA9fDF8TDJOb1lYUnpMekU1T20xbFpYUnBibWRmVDBkTmVGcEVXbXBaYWxGMFRsUmpNVTVwTURCTmJWWm9URmRGZVUxRVdYUk9ha1V5VFVkSk0wNTZZM2hQUkdONFFIUm9jbVZoWkM1Mk1pOXRaWE56WVdkbGN5OHhOemM0TlRjNU1Ea3dNVFE0fDJmYjFiNTYwOGFlZjQyZDIyOTk1MDhkZWIwMGIxZGNlfDM5ZWNjZTFjNGNmMzRkMzZiZjExZGUyZDBkNjY5YWQ4&sdata=bDVaYyt4ZUZsWHgvMjZQVXJUU01WdlVoNFAvVjUxRFJZR3hrWXBnbEdobz0%3D&ovuser=214f6519-cd19-4726-a221-b70378e889f6%2Cshirish.jaiswal%40arrise.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Submit Support Request
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;