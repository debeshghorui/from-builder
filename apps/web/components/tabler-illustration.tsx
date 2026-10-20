import Image from "next/image";

type TablerIllustrationProps = {
    name: string;
    alt: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
};

export function TablerIllustration({
    name,
    alt,
    className,
    sizes = "100vw",
    priority = false,
}: TablerIllustrationProps) {
    return (
        <>
            <Image
                src={`/tabler-illustrations/light/${name}.png`}
                alt={alt}
                width={1600}
                height={1200}
                sizes={sizes}
                priority={priority}
                className={`${className ?? ""} dark:hidden`}
            />
            <Image
                src={`/tabler-illustrations/dark/${name}.png`}
                alt=""
                aria-hidden="true"
                width={1600}
                height={1200}
                sizes={sizes}
                priority={priority}
                className={`hidden ${className ?? ""} dark:block`}
            />
        </>
    );
}
