import { IIframe } from '@/.generated';
import { defaultVariants } from './Iframe.styles';
import { Container } from '@/components/primitives/Container/Container';
import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps, WithMetadata } from '@/lib/types';
import { getCSLPAttributes } from '@/utils/type-guards';

const DEFAULT_HEIGHT = 500;
const MAX_WIDTH = 1140;

type IframeProps = IBaseComponentProps & WithMetadata<IIframe>;

const Default = (props: IframeProps) => {
  const { url, title, width, height, componentName, _metadata, $ } = props;
  const { base, iframeWrapper, iframe } = defaultVariants();

  if (!url) return null;

  const resolvedTitle = title?.trim() || 'Embedded content';

  const clampedWidth = typeof width === 'number' ? Math.min(width, MAX_WIDTH) : undefined;

  const wrapperStyle = clampedWidth ? { maxWidth: `${clampedWidth}px`, margin: '0 auto' } : {};
  const iframeStyle = {
    width: '100%',
    height: height ? `${height}px` : `${DEFAULT_HEIGHT}px`,
  };

  return (
    <Container componentName={componentName} id={_metadata?.uid} containerBleed>
      <div className={base()}>
        <div className={iframeWrapper()} style={wrapperStyle}>
          <iframe
            src={url}
            title={resolvedTitle}
            className={iframe()}
            style={iframeStyle}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            {...getCSLPAttributes($?.url)}
          />
        </div>
      </div>
    </Container>
  );
};

const variants = {
  Default,
};

export const Iframe = (props: IframeProps) => {
  const Component = props.component_variant
    ? variants[toPascalCase(props.component_variant) as keyof typeof variants]
    : Default;
  return <Component {...props} />;
};
