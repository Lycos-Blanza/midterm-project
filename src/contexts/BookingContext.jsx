import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useLocalStorage('ssph_bookings', [])

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, { id: crypto.randomUUID(), ...booking }])
  }

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
