import { IHeader } from '@/.generated';
import { desktopHeaderVariants } from './Header.styles';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import Link from 'next/link';

type HeaderFeaturedSectionProps = {
  featuredSection: NonNullable<IHeader['nav_level_one']>[number]['featured_section'];
  className?: string;
};

export const HeaderFeaturedSection = ({
  featuredSection,
  className,
}: HeaderFeaturedSectionProps) => {
  // Return early if feature section content and image is not provided
  if (!featuredSection?.featured_content && !featuredSection?.featured_image?.image?.url)
    return null;
  const {
    featuredSection: featuredSectionClass,
    featuredImageOverlay,
    featuredImageContent,
    featuredContent,
    featuredLink,
  } = desktopHeaderVariants();

  const analyticsProps = {
    clicktype: 'menu',
    clicklocation: 'headerNav',
    sitesection: 'SRP Promos',
    clickname: `${featuredSection.featured_content} ${featuredSection.featured_link?.title}`,
  };

  return (
    <div className={className ?? featuredSectionClass()}>
      <ImageWrapper
        image={featuredSection.featured_image}
        wrapperClassName="relative"
        imageClassName="absolute"
      >
        <div
          className={featuredImageOverlay()}
          {...getCSLPAttributes(featuredSection.$?.featured_image)}
        >
          <div className={featuredImageContent()}>
            <PlainTextWrapper
              content={featuredSection.featured_content}
              className={featuredContent()}
              cslpAttribute={featuredSection.$?.featured_content}
              tag="p"
            />
            {featuredSection.featured_link?.href && (
              <Link
                href={featuredSection.featured_link?.href}
                target={featuredSection.open_in_new_window ? '_blank' : undefined}
                rel={featuredSection.open_in_new_window ? 'noopener noreferrer' : undefined}
                className={featuredLink()}
                {...getCSLPAttributes(featuredSection.$?.featured_link)}
                {...analyticsProps}
              >
                {featuredSection.featured_link?.title}
                {featuredSection.open_in_new_window && (
                  <span aria-hidden="true">
                    <i className="fa-solid fa-arrow-up-right"></i>
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </ImageWrapper>
    </div>
  );
};
