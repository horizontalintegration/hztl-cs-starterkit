import { IImageVideoCarousel } from '@/.generated';
import { Container } from '@/components/primitives/Container/Container';
import ImageCarousel from '@/helpers/Wrappers/ImageCarousel/ImageCarousel';
import VideoCarousel from '@/helpers/Wrappers/VideoCarousel/VideoCarousel';
import { getCSLPAttributes } from '@/utils/type-guards';

export const ImageVideoCarousel = (props: IImageVideoCarousel) => {
  const { carousel_items, carousel_full_width, carousel_type, carousel_settings } = props;

  if (!carousel_items || !carousel_items?.length) return null;

  return (
    <Container
      componentName="authorable/shared/ImageVideoCarousel"
      containerBleed={carousel_full_width}
      {...getCSLPAttributes(props.$?.carousel_items)}
    >
      {carousel_type === 'Video' ? (
        <VideoCarousel
          carousel_items={carousel_items}
          carousel_settings={carousel_settings}
          isContainerBleedCarousel={carousel_full_width}
        />
      ) : (
        <ImageCarousel
          carousel_items={carousel_items}
          isContainerBleedCarousel={carousel_full_width}
          carousel_settings={carousel_settings}
        />
      )}
    </Container>
  );
};
