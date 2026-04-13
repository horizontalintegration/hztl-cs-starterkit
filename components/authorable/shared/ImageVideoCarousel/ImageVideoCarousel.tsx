import { IImageVideoCarousel } from '@/.generated';
import { Container } from '@/components/primitives/Container/Container';
import ImageCarousel from '@/helpers/Wrappers/ImageCarousel/ImageCarousel';
import VideoCarousel from '@/helpers/Wrappers/VideoCarousel/VideoCarousel';
import { IBaseComponentProps, WithMetadata } from '@/lib/types';
import { toPascalCase } from '@/utils/string-utils';
import { getCSLPAttributes } from '@/utils/type-guards';

type IImageVideoCarouselProps = WithMetadata<IImageVideoCarousel> & IBaseComponentProps;

export const Default = (props: IImageVideoCarouselProps) => {
  const { carousel_items, carousel_full_width, carousel_type, carousel_settings, _metadata } =
    props;

  if (!carousel_items || !carousel_items?.length) return null;

  return (
    <Container
      componentName="authorable/shared/ImageVideoCarousel"
      containerBleed={carousel_full_width}
      id={_metadata?.uid}
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

const variants = {
  Default,
};

export const ImageVideoCarousel = (props: IImageVideoCarouselProps) => {
  const Component = props.component_variant
    ? variants[toPascalCase(props.component_variant) as keyof typeof variants]
    : Default;
  return <Component {...props} />;
};
