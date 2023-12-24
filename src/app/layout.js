import { Open_Sans } from 'next/font/google'
import './globals.css'

const sans = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'PetZ Money',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sans.className}>

        {children}

      </body>
    </html>
  )
}
