import { IHeroBannerModularBlock } from "@/.generated";
import { Container } from "@/components/primitives/Container";
import { ButtonWrapper } from "@/helpers/Wrappers/ButtonWrapper/ButtonWrapper";
import { getCSLPAttributes } from "@/utils/type-guards";
import { tv } from "tailwind-variants";

export const HeroBanner = (props: IHeroBannerModularBlock) => {

    const { base, heading, description, ctaGroupWrapper, cta } = TAILWIND_VARIANTS();
    return (
        <Container backgroundImage={props.banner_image} fullBleed={true} blockPadding={false} inlinePadding={false}>
            <div className={base()}>
                <h1 className={heading()} {...getCSLPAttributes(props.$?.banner_heading)}>{props.banner_heading}</h1>
                <p className={description()} {...getCSLPAttributes(props.$?.banner_description)}>{props.banner_description}</p>
                <div className={ctaGroupWrapper()}>
                    {props.banner_cta?.map((ctaItem, index) => {
                        return (
                            <div className={cta()} key={`${ctaItem.link?.title}-${index}`}>
                                <ButtonWrapper cta={ctaItem} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Container>
    )
}

const TAILWIND_VARIANTS = tv({
    slots: {
        base: [
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
        ],
        cta: [
            'w-full',
            'md:w-fit'
        ],
        ctaGroupWrapper: [
            'flex',
            'flex-col',
            'md:flex-row',
            'flex-wrap',
            'justify-start',
            'gap-4'
        ]
    }
})