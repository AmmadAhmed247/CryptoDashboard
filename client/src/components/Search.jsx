import React from 'react'

const Search = ({ isDarkMode }) => {
  return (
    <div className="flex-1 mx-6 hidden xl:block">
      <input
        type="text"
        placeholder="Search coins..."
        className={`${isDarkMode ? 'bg-zinc-800 text-zinc-200 placeholder-zinc-500' : 'bg-gray-100 text-gray-700 placeholder-gray-400'} w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'border-zinc-700' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400`}
      />
    </div>
  )
}

export default Search