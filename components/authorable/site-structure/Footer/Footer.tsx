/**
 * @file Footer.tsx
 * @description Footer component that displays site-wide footer content including logo and copyright.
 * Fetches content from Contentstack CMS with support for Live Preview editing.
 * Automatically generates copyright year with fallback text.
 */

import { IFooter } from '@/.generated';
import { footerVariants } from './Footer.styles';
import { getCSLPAttributes } from '@/utils/type-guards';
import { Container } from '@/components/primitives/Container/Container';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { NavigationLinkWrapper } from '@/helpers/Wrappers/NavigationLinkWrapper/NavigationLinkWrapper';

/**
 * Footer component that renders site-wide footer content.
 * Displays logo and copyright text with automatic year generation.
 *
 * Features:
 * - CMS-managed content via Contentstack
 * - Automatic copyright year generation
 * - Logo display with responsive sizing
 * - Contentstack Live Preview integration
 * - Fallback copyright text if not provided
 * - Centered layout with responsive padding
 *
 * @param {IFooter} props - Footer data from CMS
 * @returns {JSX.Element} Rendered footer component
 */
export const Footer = ({ footer_section, social_connect_section }: IFooter) => {
  const {
    base,
    wrapper,
    sectionColumn,
    sectionHeading,
    sectionLinks,
    sectionLinkItem,
    sectionLink,
    telLink,
    socialSection,
    socialHeading,
    socialLinks,
    socialLinkItem,
    socialLinkIcon,
    legal,
    policyAndTerms,
    copyright,
  } = footerVariants();

  return (
    <Container containerBleed tag="footer" className={base()} aria-label="Site footer">
      <div className={wrapper()}>
        {footer_section?.map((section, index) => {
          const headingId = `footer-section-${index}`;
          return (
            <nav className={sectionColumn()} key={index} aria-labelledby={headingId}>
              <h5
                id={headingId}
                className={sectionHeading()}
                {...getCSLPAttributes(section.$?.section_heading)}
              >
                {section.section_heading}
              </h5>
              <ul className={sectionLinks()} aria-labelledby={headingId}>
                {section.navigation_links?.map(
                  (navLink, linkIndex) =>
                    (navLink.page_reference || navLink.link?.href) && (
                      <li
                        key={linkIndex}
                        className={`${sectionLinkItem()} ${navLink.link?.href.startsWith('tel:') && telLink()}`}
                      >
                        <NavigationLinkWrapper
                          clickLocation={section.section_heading}
                          navigationLink={navLink}
                          className={sectionLink()}
                          aria-label={
                            navLink.link?.href.startsWith('tel:')
                              ? `Call ${navLink.link.href.replace('tel:', '')}`
                              : navLink.link?.title
                          }
                          {...(navLink.link?.href.startsWith('tel:') && { tabIndex: -1 })}
                        >
                          {navLink.link?.title}
                          {navLink.link?.href.startsWith('tel:') && (
                            <strong aria-hidden="true">
                              {navLink.link.href.replace('tel:', '')}
                            </strong>
                          )}
                        </NavigationLinkWrapper>
                      </li>
                    )
                )}
              </ul>
            </nav>
          );
        })}
        <div className={socialSection()}>
          {/* Social Section Heading */}
          <h5
            id="footer-social-heading"
            className={socialHeading()}
            {...getCSLPAttributes(social_connect_section?.$?.section_heading)}
          >
            {social_connect_section?.section_heading}
          </h5>
          {/* Social Links */}
          <ul className={socialLinks()} aria-labelledby="footer-social-heading">
            {social_connect_section?.social_links?.map((linkItem, index) => {
              const isExternal =
                !linkItem.social_link?.href?.startsWith('/') &&
                !linkItem.social_link?.href?.includes('srpnet');
              return (
                linkItem.social_link && (
                  <li key={index} className={socialLinkItem()}>
                    <NavigationLinkWrapper
                      navigationLink={{
                        link: linkItem.social_link,
                        open_in_new_window: isExternal,
                        english_only_link: false,
                        $: { link: linkItem.$?.social_link },
                      }}
                      label={linkItem.social_icon_alt_text}
                      clickLocation={social_connect_section?.section_heading}
                      aria-label={`${linkItem.social_icon_alt_text}${isExternal ? ' (opens in new tab)' : ''}`}
                      shouldRenderNewTabIcon={false}
                    >
                      <img
                        src={linkItem.social_icon?.url}
                        alt=""
                        className={socialLinkIcon()}
                        {...getCSLPAttributes(linkItem.$?.social_icon)}
                        aria-hidden="true"
                      />
                    </NavigationLinkWrapper>
                  </li>
                )
              );
            })}
          </ul>
          {/* Legal Section */}
          <div className={legal()}>
            {social_connect_section?.policy_and_terms && (
              <PlainTextWrapper
                content={social_connect_section.policy_and_terms}
                {...getCSLPAttributes(social_connect_section?.$?.policy_and_terms)}
                className={policyAndTerms()}
              />
            )}
            {social_connect_section?.copyright_details && (
              <p
                {...getCSLPAttributes(social_connect_section?.$?.copyright_details)}
                className={copyright()}
              >
                {social_connect_section.copyright_details}
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
