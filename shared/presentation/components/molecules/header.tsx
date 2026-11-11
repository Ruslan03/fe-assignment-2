import { Text } from "../atoms/text";

export interface HeaderProps {
    title: string
    subtitle?: string
    rightContent?: React.ReactNode
}

export function Header({ title, subtitle, rightContent }: HeaderProps) {

    return (
        <div className="py-8 flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <Text as="h1" variant={'h1'} className="font-medium">{title}</Text>
                <Text as="h2" variant={'lead'}>{subtitle}</Text>
            </div>

            <div>
                {rightContent}
            </div>
        </div>
    );
}
