import './globals.css'

export const metadata = {
  title: `DoodleVerse`,
  description: `Draw with friends in a virtual space`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
