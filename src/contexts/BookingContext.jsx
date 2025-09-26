import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const BookingContext = createContext(null) // context for bookings

export function BookingProvider({ children }) {
  // State synced with localStorage to persist bookings
  const [bookings, setBookings] = useLocalStorage('ssph_bookings', [])

  // Add a new booking with a unique ID
  const addBooking = (booking) => {
    setBookings((prev) => [...prev, { id: crypto.randomUUID(), ...booking }])
  }

  // Remove a booking by its ID
  const cancelBooking = (id) => {
    setBookings((prev) => prev.filter(b => b.id !== id))
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  return useContext(BookingContext)
}
