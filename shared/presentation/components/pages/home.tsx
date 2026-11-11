import { Header } from "../molecules/header";
import MainLayout from "../templates/main-layout";
import AddMemberButton from "@/features/member/presentation/components/add-member-button";
import { MemberList } from "@/features/member/presentation/components/member-list";

export function HomePage() {
    return (
        <MainLayout>
            <Header
                title="Members Directory"
                subtitle="Manage your organization team members, cross-functional roles, and workspace access levels."
                rightContent={
                    <div>
                        <AddMemberButton />
                    </div>
                }
            />

            <MemberList />
        </MainLayout>
    );
}
