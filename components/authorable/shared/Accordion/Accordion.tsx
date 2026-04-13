'use client';

import { useState, useCallback, useEffect } from 'react';
import { defaultVariants } from './Accordion.styles';
import { Container } from '@/components/primitives/Container/Container';
import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { getCSLPAttributes } from '@/utils/type-guards';
import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps } from '@/lib/types';
import { IComponents } from '@/.generated';
import { Col, Row } from '@/components/primitives/Grid';
import { AccordionItem } from './AccordionItem';
import { useGlobalLabels } from '@/context/GlobalLabelContext';

type AccordionProps = IComponents['accordion'] & IBaseComponentProps;

const Default = (props: AccordionProps) => {
  const { accordion_items, enable_expand_all, expand_first_item } = props;
  const [openItemUids, setOpenItemUids] = useState<Set<string>>(new Set());

  const {
    globalLabels: { expand_all_label, collapse_all_label },
  } = useGlobalLabels();

  const allExpanded =
    accordion_items && accordion_items.length > 0 && openItemUids.size === accordion_items.length;

  const { base, header, expandAllButton, expandAllChevron, itemList } = defaultVariants({
    allExpanded,
  });

  const toggleItem = useCallback((uid: string) => {
    setOpenItemUids((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setOpenItemUids(new Set());
    } else {
      setOpenItemUids(new Set(accordion_items?.map((_, index) => `accordion-item-${index}`) ?? []));
    }
  }, [allExpanded, accordion_items]);

  useEffect(() => {
    if (expand_first_item && accordion_items && accordion_items.length > 0) {
      setOpenItemUids(new Set(['accordion-item-0']));
    }
  }, [expand_first_item, accordion_items]);

  if (!accordion_items || accordion_items.length === 0) return <></>;

  return (
    <Container componentName="authorable/shared/Accordion">
      <Row>
        <Col md={8} lg={12} offsetMd={2}>
          <div className={base()}>
            {enable_expand_all && (
              <div className={header()}>
                <button
                  className={expandAllButton()}
                  onClick={toggleAll}
                  aria-expanded={allExpanded}
                  {...getCSLPAttributes(allExpanded ? collapse_all_label : expand_all_label)}
                >
                  {allExpanded ? collapse_all_label : expand_all_label}
                  <SvgIcon
                    icon="chevron-down"
                    size="xs"
                    fill="currentColor"
                    className={expandAllChevron()}
                  />
                </button>
              </div>
            )}
            <ul className={itemList()}>
              {accordion_items?.map((item, index) => (
                <AccordionItem
                  key={index}
                  {...item}
                  uid={`accordion-item-${index}`}
                  extendedProps={{ openItemUids, onToggle: toggleItem }}
                />
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const variants = {
  Default,
};

export const Accordion = (props: AccordionProps) => {
  const Component = props.component_variant
    ? variants[toPascalCase(props.component_variant) as keyof typeof variants]
    : Default;
  return <Component {...props} />;
};
