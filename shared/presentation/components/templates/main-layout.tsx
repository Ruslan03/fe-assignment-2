import UserInfo from "@/features/user/presentation/components/user-info";

export interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            <UserInfo />
            {children}
        </div>
    );
}
