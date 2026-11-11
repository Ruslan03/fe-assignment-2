import UserInfo from "@user/presentation/components/user-info";
import { MainNavbar } from "../organisms/main-navbar";

export interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            <MainNavbar />
            <main className="min-h-screen bg-base-01 flex flex-col gap-8 px-8">
                {children}
            </main>
        </div>
    );
}
