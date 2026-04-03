import { PropsWithChildren } from 'react';
import { rowVariants } from './Grid.styles';

interface RowProps {
  className?: string;
  tag?: 'div' | 'section' | 'ul' | 'ol';
}

export const Row = ({ className, tag = 'div', children }: RowProps & PropsWithChildren) => {
  const Tag = tag;
  return <Tag className={rowVariants({ class: className })}>{children}</Tag>;
};
