import { IHeroBannerModularBlock } from "@/.generated";
import ImageWrapper from "@/helpers/Wrappers/ImageWrapper/ImageWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";
import { tv } from "tailwind-variants";

export const HeroBanner = (props: IHeroBannerModularBlock) => {

    const { base, wrapper, container, image, heading, description } = TAILWIND_VARIANTS();
    return (
        <section className={base()}>
            <div className={wrapper()}>
                <ImageWrapper
                    image={props.banner_image}
                    fetchPriority="high"
                    loading="eager"
                    priority={true}
                    fill
                    imageClassName={image()}
                    showFallbackImage={false}
                    isFullBleed={true}
                >
                    <div className={container()}>
                        <h1 className={heading()} {...getCSLPAttributes(props.$?.banner_heading)}>{props.banner_heading}</h1>
                        <p className={description()} {...getCSLPAttributes(props.$?.banner_description)}>{props.banner_description}</p>
                    </div>
                </ImageWrapper>
            </div>
        </section>
    )
}

const TAILWIND_VARIANTS = tv({
    slots: {
        base: [
            'w-screen',
            'flex',
            'flex-col',
            'justify-center',
            'relative',
            'left-[calc(-50vw+50%)]',
            'right-[calc(-50vw+50%)]'
        ],
        wrapper: [
            'flex'
        ],
        image: [
            'z-0',
        ],
        container: [
            'w-full',
            'flex',
            'flex-col',
            'gap-4',
            'py-20',
            'px-6',
            'md:px-12',
            'xl:px-20',
            'z-10',
            'relative',
            'max-w-screen-2xl',
            'mx-auto'
        ],
        heading: [
            'text-6xl',
            'text-white',
            'font-bold',
            'tracking-wide',
            'w-full',
            'md:w-1/2',
        ],
        description: [
            'text-xl',
            'text-white',
            'w-full',
            'md:w-2/5'
        ]
    }
})