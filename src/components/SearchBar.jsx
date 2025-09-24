export default function SearchBar({ query, setQuery }) {
  return (
    <div className="card sticky top-[72px] z-40 bg-white">
      <label className="block text-sm mb-2 text-davy">
        Search by name or location
      </label>
      <input
        className="input"
        placeholder="e.g., Lipa or Peak Productivity"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}