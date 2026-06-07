"use client";
import {
  Dices,
  History,
  Building2,
  Users,
  Terminal
} from 'lucide-react';
import { useGetPotentialWinningsPayoutByGameName } from '@/hooks/excel-db/use-get-potential-winning-payout-details-by-game-name';

const BET_CODES = ["7", "SB:31&32"];

function HomePage() {
  const { data, isLoading } = useGetPotentialWinningsPayoutByGameName("roulette", BET_CODES);

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
          <a
            href="/portal/round-activity"
            className="border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all block group"
          >
            <div className="flex items-center gap-2.5 text-gray-900 group-hover:text-blue-600 transition-colors">
              <Dices className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">Round Activity</h2>
            </div>
            
            {/* Split List */}
            <div className="grid grid-cols-2 gap-x-2 text-sm text-gray-600 mt-3 pl-1">
              <ul className="space-y-1">
                <li>• Blackjack</li>
                <li>• Roulette</li>
                <li>• Baccarat</li>
                <li>• Sweet Bonanza</li>
              </ul>
              <ul className="space-y-1">
                <li>• Spaceman</li>
                <li>• Big Bass Crash</li>
                <li>• Highflyer</li>
                <li className="text-gray-400 italic text-xs pt-0.5">• Others (partial)</li>
              </ul>
            </div>
          </a>

          {/* Kibana - HIGHLIGHTED UNDER TESTING */}
          <a
            href="/portal/log-exp"
            className="border-2 border-blue-400 bg-blue-50/30 rounded-xl p-4 shadow-md relative overflow-hidden block hover:shadow-lg transition-all group"
          >
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg shadow-sm">
              Under Testing
            </div>
            <div className="flex items-center gap-2.5 text-blue-900 group-hover:text-blue-700 transition-colors">
              <Terminal className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">Kibana</h2>
            </div>
            <p className="text-sm text-blue-800/80 mt-3">
              Dynamic pre-built search filters, faster log exploration, and
              improved observability workflows.
            </p>
          </a>

          {/* Resolution System */}
          <a
            href="/portal/resolution-template"
            className="border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all block group"
          >
            <div className="flex items-center gap-2.5 text-gray-900 group-hover:text-blue-600 transition-colors">
              <Building2 className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">Resolution System</h2>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Automatic round resolution summary generation and template engine tools.
            </p>
          </a>

          {/* Player History */}
          <a
            href="/portal/player-history"
            className="border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all block group"
          >
            <div className="flex items-center gap-2.5 text-gray-900 group-hover:text-blue-600 transition-colors">
              <History className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">Player History</h2>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              48 hours betting timelines.
            </p>
          </a>

          {/* Casino Details */}
          <a
            href="/portal/casino-details"
            className="border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all block group"
          >
            <div className="flex items-center gap-2.5 text-gray-900 group-hover:text-blue-600 transition-colors">
              <Building2 className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">Casino Details</h2>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Game metadata configurations, brand parameters, and core casino-level details.
            </p>
          </a>

          {/* User Management */}
          <a
            href="/portal/user-management"
            className="border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all block group"
          >
            <div className="flex items-center gap-2.5 text-gray-900 group-hover:text-blue-600 transition-colors">
              <Users className="h-5 w-5 stroke-[2]" />
              <h2 className="font-semibold text-lg">User Management</h2>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Player account access controls, profiles, and structural identity variables.
            </p>
          </a>
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