export const styleMap = {
    "roulette-red": "bg-red-700 border-red-900",
    "roulette-black": "bg-gray-800 border-gray-950",
    "roulette-tie": "bg-green-500 border-green-900",

    "baccarat-player":
        "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-blue-900 shadow-lg shadow-blue-500/30",

    "baccarat-banker":
        "bg-gradient-to-r from-red-500 via-red-400 to-red-600 border-red-900 shadow-lg shadow-red-500/30",

    "baccarat-tie":
        "bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 border-gray-900",

    "treasure-island":
        "bg-gradient-to-r from-green-500 to-green-700 border-green-900 shadow-lg shadow-green-500/30",

    crash:
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-purple-700 shadow-lg shadow-purple-500/30",

    default: "bg-gray-500 border-gray-700",
} as const;