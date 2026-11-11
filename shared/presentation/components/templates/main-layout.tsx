import { MainNavbar } from "../organisms/main-navbar"

export interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavbar />
      <main className="flex flex-1 flex-col px-6 pt-6 pb-16">
        <div className="mx-auto flex w-full max-w-[1232px] flex-1 flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  )
}
