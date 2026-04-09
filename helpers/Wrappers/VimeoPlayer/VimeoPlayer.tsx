'use client';

import { JSX } from 'react';
import { vimeoPlayerVariants } from './VimeoPlayer.styles';

export interface VimeoPlayerProps {
  /** Vimeo video ID (e.g. "123456789") */
  videoId?: string;
  /** Accessible title for the iframe */
  title?: string;
  /** Allow autoplay within the embed */
  autoplay?: boolean;
  /** Loop the video */
  loop?: boolean;
  /** Show the video title overlay */
  showTitle?: boolean;
  /** Show the byline (author info) */
  showByline?: boolean;
  /** Show the portrait (author avatar) */
  showPortrait?: boolean;
  /** Additional class for the wrapper */
  className?: string;
}

const buildVimeoUrl = ({
  videoId,
  autoplay = false,
  loop = false,
  showTitle = false,
  showByline = false,
  showPortrait = false,
}: VimeoPlayerProps): string => {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    loop: loop ? '1' : '0',
    title: showTitle ? '1' : '0',
    byline: showByline ? '1' : '0',
    portrait: showPortrait ? '1' : '0',
    dnt: '1',
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
};

const VimeoPlayer = ({
  videoId,
  title = 'Vimeo video player',
  autoplay = false,
  loop = false,
  showTitle = false,
  showByline = false,
  showPortrait = false,
  className,
}: VimeoPlayerProps): JSX.Element => {
  const { wrapper, iframe } = vimeoPlayerVariants();

  if (!videoId) return <></>;

  const src = buildVimeoUrl({ videoId, autoplay, loop, showTitle, showByline, showPortrait });

  return (
    <div className={wrapper({ class: className })} data-component="helpers/wrappers/vimeoplayer">
      <iframe
        src={src}
        title={title}
        className={iframe()}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default VimeoPlayer;
