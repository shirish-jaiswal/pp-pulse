function HomePage() {
  return (
    <div className="p-6 space-y-8">
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
            <li>All other games (partial integration - under developement)</li>
          </ul>
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
          {/* Cresh / Crash Games Expansion */}
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

          {/* Kibana Enhancements */}
          <div className="border rounded-xl p-4 shadow-sm bg-green-50">
            <h3 className="font-semibold">Advanced Kibana Dashboard</h3>
            <p className="text-sm text-gray-600 mt-2">
              Dynamic pre-built search filters, faster log exploration, and
              improved observability workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;