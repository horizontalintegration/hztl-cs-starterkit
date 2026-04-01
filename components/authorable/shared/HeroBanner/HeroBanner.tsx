/**
 * @file HeroBanner.tsx
 * @description Hero banner component with background image, heading, description, and call-to-action buttons.
 * Supports multiple layout variants and Contentstack Live Preview for real-time content editing.
 */

import { IHeroBannerModularBlock } from '@/.generated';
import { defaultVariants, leftAlignedSplitVariants } from './HeroBanner.styles';
import { Container } from '@/components/primitives/Container/Container';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import { toPascalCase } from '@/utils/string-utils';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';

/**
 * Default variant of the hero banner component.
 * Displays a centered banner section with a full-width background image.
 * Text content is overlaid on the background image with white text styling.
 *
 * @param {IHeroBannerModularBlock} props - Hero banner content and configuration from CMS
 * @returns {JSX.Element} Rendered default hero banner variant
 */
export const Default = (props: IHeroBannerModularBlock) => {
  const { base, heading, description, ctaGroupWrapper } = defaultVariants();

  return (
    <Container
      backgroundImage={props.banner_image}
      componentName="authorable/shared/content/hero-banner/default"
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
            <ButtonWrapper cta={ctaItem} key={`${ctaItem.link?.title}-${index}`} />
          ))}
        </div>
      </div>
    </Container>
  );
};

/**
 * Left-aligned split variant of the hero banner component.
 * Displays content on the left side with an image on the right side in a split layout.
 * Text content uses black text styling and is not overlaid on an image.
 *
 * @param {IHeroBannerModularBlock} props - Hero banner content and configuration from CMS
 * @returns {JSX.Element} Rendered left-aligned split hero banner variant
 */
export const LeftAlignedSplit = (props: IHeroBannerModularBlock) => {
  const { contentWrapper, base, heading, description, ctaGroupWrapper } =
    leftAlignedSplitVariants();

  return (
    <Container componentName="HeroBanner" containerBleed>
      <div className={contentWrapper()}>
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
              <ButtonWrapper cta={ctaItem} key={`${ctaItem.link?.title}-${index}`} />
            ))}
          </div>
        </div>
        <ImageWrapper image={props.banner_image} fetchPriority="high" />
      </div>
    </Container>
  );
};

const variants = {
  Default,
  LeftAlignedSplit,
};

/**
 * Hero banner component that displays a prominent banner section with image background.
 * Typically used at the top of pages to grab attention and drive user action.
 *
 * Features:
 * - Multiple layout variants (Default, LeftAlignedSplit)
 * - Full-width background image support (Default variant)
 * - Split layout with side-by-side content and image (LeftAlignedSplit variant)
 * - Responsive heading and description
 * - Multiple CTA buttons
 * - Contentstack Live Preview integration
 *
 * Variants:
 * - "default" - Centered banner with background image overlay and white text
 * - "left-aligned-split" - Split layout with content on left and image on right, black text
 *
 * @param {IHeroBannerModularBlock} props - Hero banner content and configuration from CMS
 * @param {string} props.component_variant - Variant name to render ("default" or "left-aligned-split")
 * @returns {JSX.Element} Rendered hero banner component based on selected variant
 */
export const HeroBanner = (props: IHeroBannerModularBlock) => {
  const Component =
    variants[toPascalCase(props.component_variant) as keyof typeof variants] || Default;
  return <Component {...props} />;
};
