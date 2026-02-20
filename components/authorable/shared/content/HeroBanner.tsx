/**
 * @file HeroBanner.tsx
 * @description Hero banner component with background image, heading, description, and call-to-action buttons.
 * Supports Contentstack Live Preview for real-time content editing.
 */

import { tv } from 'tailwind-variants';

import { IHeroBannerModularBlock } from '@/.generated';
import { Container } from '@/components/primitives/Container';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';

/**
 * Hero banner component that displays a prominent banner section with image background.
 * Typically used at the top of pages to grab attention and drive user action.
 *
 * Features:
 * - Full-width background image support
 * - Responsive heading and description
 * - Multiple CTA buttons
 * - Contentstack Live Preview integration
 *
 * @param {IHeroBannerModularBlock} props - Hero banner content and configuration from CMS
 * @returns {JSX.Element} Rendered hero banner component
 */
export const HeroBanner = (props: IHeroBannerModularBlock) => {
    const { base, heading, description, ctaGroupWrapper, cta } = HERO_BANNER_VARIANTS();

    return (
        <Container
            backgroundImage={props.banner_image}
            fullBleed={true}
            blockPadding={false}
            inlinePadding={false}
            componentName="authorable/shared/content/main-layout"
        >
            <div className={base()} {...getCSLPAttributes(props.$?.banner_image)}>
                {/* Hero heading */}
                <h1 className={heading()} {...getCSLPAttributes(props.$?.banner_heading)}>
                    {props.banner_heading}
                </h1>

                {/* Hero description */}
                <p className={description()} {...getCSLPAttributes(props.$?.banner_description)}>
                    {props.banner_description}
                </p>

                {/* CTA buttons group */}
                <div className={ctaGroupWrapper()}>
                    {props.banner_cta?.map((ctaItem, index) => (
                        <div className={cta()} key={`${ctaItem.link?.title}-${index}`}>
                            <ButtonWrapper cta={ctaItem} />
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

/**
 * Tailwind variants for hero banner styling.
 * Provides responsive design with mobile-first approach.
 */
const HERO_BANNER_VARIANTS = tv({
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
            'mx-auto',
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
            'md:w-2/5',
        ],
        cta: [
            'w-full',
            'md:w-fit',
        ],
        ctaGroupWrapper: [
            'flex',
            'flex-col',
            'md:flex-row',
            'flex-wrap',
            'justify-start',
            'gap-4',
        ],
    },
});
