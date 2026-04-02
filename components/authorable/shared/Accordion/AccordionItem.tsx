import { accordionItemVariants } from './Accordion.styles';
import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { getCSLPAttributes } from '@/utils/type-guards';
import { IBaseComponentProps } from '@/lib/types';
import { IAccordionItem } from '@/.generated';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';

type AccordionItemProps = IAccordionItem & IBaseComponentProps;

export const AccordionItem = (props: AccordionItemProps) => {
  const { uid, title, description, extendedProps, $ } = props;
  const isOpen: boolean = extendedProps?.openItemUids?.has(uid ?? '') ?? false;

  const {
    itemWrapper,
    itemButton,
    itemTitle,
    itemChevron,
    contentWrapper,
    contentInner,
    itemContent,
  } = accordionItemVariants({ isOpen });

  return (
    <li className={itemWrapper()}>
      <button
        className={itemButton()}
        onClick={() => extendedProps?.onToggle?.(uid ?? '')}
        aria-expanded={isOpen}
      >
        <span className={itemTitle()} {...getCSLPAttributes($?.title)}>
          {title}
        </span>
        <SvgIcon icon="chevron-down" size="s" className={itemChevron()} fill="currentColor" />
      </button>
      <div className={contentWrapper()}>
        <div className={contentInner()}>
          <PlainTextWrapper
            content={description}
            className={itemContent()}
            {...getCSLPAttributes($?.description)}
          />
        </div>
      </div>
    </li>
  );
};
