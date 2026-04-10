'use client';

import { useRef, useCallback } from 'react';
import { IImageVideoCarousel } from '@/.generated';
import { CarouselWrapper, CarouselSlide } from '@/helpers/Wrappers/CarouselWrapper/CarouselWrapper';
import ImageWrapper from '@/helpers/Wrappers/ImageWrapper/ImageWrapper';
import VimeoPlayer from '@/helpers/Wrappers/VimeoPlayer/VimeoPlayer';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { getCSLPAttributes } from '@/utils/type-guards';
import { videoCarouselVariants } from './VideoCarousel.styles';

const VideoCarousel = ({
  carousel_items,
  isContainerBleedCarousel = false,
}: Required<Pick<IImageVideoCarousel, 'carousel_items'>> & {
  isContainerBleedCarousel?: boolean;
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleSlideChange = useCallback(() => {
    // Pause all videos in the carousel by posting to all iframes
    const iframes = carouselRef.current?.querySelectorAll('iframe');
    iframes?.forEach((iframe) => {
      iframe.contentWindow?.postMessage({ method: 'pause' }, '*');
    });
  }, []);
  const { slideContent, thumbContainer, thumbImage, thumbDetails } = videoCarouselVariants();

  const thumbnails = carousel_items.map((item, index) => (
    <div key={`thumb-${index}`} className={thumbContainer()} data-video-id={item.video_id}>
      <ImageWrapper
        imageClassName={thumbImage()}
        image={{
          image: item.carousel_image,
          rounded_image: false,
          alternate_text: item.image_alt,
        }}
        showFallbackImage
      />
      {item.title && (
        <p className={thumbDetails()} {...getCSLPAttributes(item.$?.title)}>
          {item.title}
        </p>
      )}
    </div>
  ));

  return (
    <div ref={carouselRef}>
      <CarouselWrapper
        showDots
        showPaginationArrows
        thumbnails={thumbnails}
        ariaLabel="Video carousel"
        onSlideChange={handleSlideChange}
        isContainerBleedCarousel={isContainerBleedCarousel}
      >
        {carousel_items.map((item, index) => (
          <CarouselSlide key={`video-slide-${index}`} fade>
            <div className={slideContent()}>
              <VimeoPlayer
                videoId={item.video_id}
                title={item.title || `Video ${index + 1}`}
                {...getCSLPAttributes(item.$?.video_id)}
              />
            </div>
          </CarouselSlide>
        ))}
      </CarouselWrapper>
    </div>
  );
};

export default VideoCarousel;
