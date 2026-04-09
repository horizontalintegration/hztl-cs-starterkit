import { IImageVideoCarousel } from '@/.generated';
import { CarouselWrapper, CarouselSlide } from '@/helpers/Wrappers/CarouselWrapper/CarouselWrapper';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import { imageCarouselVariants } from './ImageCarousel.styles';
import PlainTextWrapper from '../PlainTextWrapper/PlainTextWrapper';

const ImageCarousel = ({
  carousel_items,
}: Required<Pick<IImageVideoCarousel, 'carousel_items'>>) => {
  const { slideContent, captionBox, image, slideTitle, slideDescription, slideCtaWrapper } =
    imageCarouselVariants();

  return (
    <CarouselWrapper fade showDots showPaginationArrows ariaLabel="Image carousel">
      {carousel_items.map((item, index) => (
        <CarouselSlide key={`image-slide-${index}`} className="basis-full" fade>
          <div className={slideContent()}>
            <ImageWrapper
              image={{
                image: item.carousel_image,
                rounded_image: false,
                alternate_text: item.image_alt,
              }}
              {...getCSLPAttributes(item.$?.carousel_image)}
              imageClassName={image()}
            />

            {(item.title || item.description || item.cta) && (
              <div className={captionBox()}>
                {item.title && (
                  <div className={slideTitle()} {...getCSLPAttributes(item.$?.title)}>
                    {item.title}
                  </div>
                )}

                {item.description && (
                  <PlainTextWrapper
                    className={slideDescription()}
                    content={item.description}
                    {...getCSLPAttributes(item.$?.description)}
                  />
                )}

                {item.cta && (
                  <div className={slideCtaWrapper()}>
                    <ButtonWrapper cta={item.cta} {...getCSLPAttributes(item.$?.cta)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </CarouselSlide>
      ))}
    </CarouselWrapper>
  );
};

export default ImageCarousel;
