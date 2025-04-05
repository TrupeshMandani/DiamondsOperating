import { AppProvider } from './context/AppContext'
import './globals.css'

export const metadata = {
  title: 'Diamond Processing System',
  description: 'Employee dashboard for diamond processing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}