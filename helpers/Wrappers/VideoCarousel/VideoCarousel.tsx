import { IImageVideoCarousel } from '@/.generated';
import { CarouselWrapper, CarouselSlide } from '@/helpers/Wrappers/CarouselWrapper/CarouselWrapper';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import VimeoPlayer from '@/helpers/Wrappers/VimeoPlayer/VimeoPlayer';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import { videoCarouselVariants } from './VideoCarousel.styles';

const VideoCarousel = ({
  carousel_items,
}: Required<Pick<IImageVideoCarousel, 'carousel_items'>>) => {
  const { slideContent, slideTitle, slideDescription, slideCtaWrapper, thumbImage } =
    videoCarouselVariants();

  const thumbnails = carousel_items.map((item, index) => (
    <div key={`thumb-${index}`} className={thumbImage()} data-video-id={item.video_id}>
      <ImageWrapper
        image={{
          image: item.carousel_image,
          rounded_image: false,
          alternate_text: item.image_alt,
        }}
        showFallbackImage
      />
    </div>
  ));

  return (
    <CarouselWrapper
      loop
      fade
      showDots
      showPaginationArrows
      thumbnails={thumbnails}
      ariaLabel="Video carousel"
    >
      {carousel_items.map((item, index) => (
        <CarouselSlide key={`video-slide-${index}`} className="basis-full" fade>
          <div className={slideContent()}>
            <VimeoPlayer
              videoId={item.video_id}
              title={item.title || `Video ${index + 1}`}
              {...getCSLPAttributes(item.$?.video_id)}
            />

            {(item.title || item.description || item.cta) && (
              <div>
                {item.title && (
                  <h3 className={slideTitle()} {...getCSLPAttributes(item.$?.title)}>
                    {item.title}
                  </h3>
                )}

                {item.description && (
                  <p className={slideDescription()} {...getCSLPAttributes(item.$?.description)}>
                    {item.description}
                  </p>
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

export default VideoCarousel;
