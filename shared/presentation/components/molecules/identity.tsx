import { Text } from "../atoms/text";

export interface IdentityProps {
    media: React.ReactNode
    title: string
    subtitle: string
}

export function Identity({ media, title, subtitle }: IdentityProps) {
    return (
        <div className="flex gap-3 items-center">
            <div>
                {media}
            </div>
            <div className="flex flex-col">

                <Text className="font-medium">{title}</Text>
                <Text variant={'muted'} className="font-bold">{subtitle}</Text>
            </div>
        </div>
    );
}
