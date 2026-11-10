import { Identity } from "@/shared/presentation/components/molecules/identity";
import { User } from "lucide-react";
import { getCurentUserController } from "../../controller/user.controller";

const UserAvatar = () => (
    <div className="bg-primary p-3 flex flex-wrap items-center justify-center rounded-xl">
        <div>
            <User className="text-white" />
        </div>
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
