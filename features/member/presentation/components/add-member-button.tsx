import { Button } from "@/shared/presentation/components/atoms/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AddMemberButton() {
    return (
        <Button asChild>
            <Link href="/members/new">
                <Plus />
                Add Member
            </Link>
        </Button>
    );
}
