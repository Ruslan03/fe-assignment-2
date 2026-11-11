import { Text } from "../atoms/text";

export interface IdentityProps {
    media: React.ReactNode
    title: string
    subtitle: string
}

export function Identity({ media, title, subtitle }: IdentityProps) {
    return (
        <div className="flex items-center gap-2 py-1">
            <div>
                {media}
            </div>
            <div className="flex flex-col">
                <Text
                    as="span"
                    variant="caption"
                    className="text-xs leading-4 font-medium text-foreground"
                >
                    {title}
                </Text>
                <Text
                    as="span"
                    variant="caption"
                    className="text-[11px] leading-[14px] font-semibold text-muted-foreground"
                >
                    {subtitle}
                </Text>
            </div>
        </div>
    );
}
