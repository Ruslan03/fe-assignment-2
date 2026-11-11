import { Identity } from "@/shared/presentation/components/molecules/identity";
import { User } from "lucide-react";
import { getCurentUserController } from "../../controller/user.controller";

const UserAvatar = () => (
    <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <User className="size-3.5" />
    </div>
)

export default async function UserInfo() {

    const { name, role } = await getCurentUserController()

    return (
        <Identity
            media={<UserAvatar />}
            title={name}
            subtitle={role}
        />
    );
}
