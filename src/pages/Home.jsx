import { useMemo, useState } from 'react'
import SPACES from '../data/spaces.json'
import SearchBar from '../components/SearchBar.jsx'
import SpaceCard from '../components/SpaceCard.jsx'

export default function Home() {
  const [query, setQuery] = useState('') // search input state

  // Filter spaces based on search query (name or location)
  // useMemo ensures filtering runs only when query changes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase() // normalize query
    if (!q) return SPACES // return all spaces if query is empty
    return SPACES.filter(s =>
      s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Find your next study spot</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(space => <SpaceCard key={space.id} space={space} />)}
      </div>
      {filtered.length === 0 && (
        <p className="text-davy">No spaces match your search.</p>
      )}
    </div>
  )
}
