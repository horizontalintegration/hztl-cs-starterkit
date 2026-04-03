import { PropsWithChildren } from 'react';
import {
  spanMap,
  smSpanMap,
  mdSpanMap,
  lgSpanMap,
  xlSpanMap,
  startMap,
  smStartMap,
  mdStartMap,
  lgStartMap,
  xlStartMap,
} from './Grid.styles';

type ColSpan = keyof typeof spanMap;
type ColOffset = keyof typeof startMap;

interface ColProps {
  /** Default span (all breakpoints). Defaults to 12 (full width) if no breakpoint props given. */
  xs?: ColSpan;
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  /** Equivalent to Bootstrap offset-* — skips n columns by shifting col-start */
  offsetXs?: ColOffset;
  offsetSm?: ColOffset;
  offsetMd?: ColOffset;
  offsetLg?: ColOffset;
  offsetXl?: ColOffset;
  className?: string;
  tag?: 'div' | 'section' | 'article' | 'aside' | 'li';
}

export const Col = ({
  xs,
  sm,
  md,
  lg,
  xl,
  offsetXs,
  offsetSm,
  offsetMd,
  offsetLg,
  offsetXl,
  className,
  tag = 'div',
  children,
}: ColProps & PropsWithChildren) => {
  const Tag = tag;

  const classes = [
    xs ? spanMap[xs] : 'col-span-12',
    sm ? smSpanMap[sm] : undefined,
    md ? mdSpanMap[md] : undefined,
    lg ? lgSpanMap[lg] : undefined,
    xl ? xlSpanMap[xl] : undefined,
    offsetXs ? startMap[offsetXs] : undefined,
    offsetSm ? smStartMap[offsetSm] : undefined,
    offsetMd ? mdStartMap[offsetMd] : undefined,
    offsetLg ? lgStartMap[offsetLg] : undefined,
    offsetXl ? xlStartMap[offsetXl] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={classes}>{children}</Tag>;
};
