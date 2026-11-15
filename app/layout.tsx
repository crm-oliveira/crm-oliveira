import './style.css'
export const metadata = { title: 'CRM Oliveira Soluções Imobiliária', description: 'Gestão imobiliária privada' }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html> }
