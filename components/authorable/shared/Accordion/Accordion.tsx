'use client';

import { useState, useCallback } from 'react';
import { defaultVariants } from './Accordion.styles';
import { Container } from '@/components/primitives/Container/Container';
import { ReferencePlaceholder } from '@/components/primitives/ReferencePlaceholder';
import SvgIcon from '@/helpers/SvgIcon/SvgIcon';
import { getCSLPAttributes } from '@/utils/type-guards';
import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps } from '@/lib/types';
import { IAccordionModularBlock } from '@/.generated';
import { Col, Row } from '@/components/primitives/Grid';

type AccordionProps = IAccordionModularBlock & IBaseComponentProps;

const Default = (props: AccordionProps) => {
  const { reference, expand_label, collapse_label, enable_expand_all } = props;
  const [openItemUids, setOpenItemUids] = useState<Set<string>>(new Set());
  const allExpanded =
    (reference?.length ?? 0) > 0 && openItemUids.size === (reference?.length ?? 0);

  const { base, header, expandAllButton, expandAllChevron, itemList } = defaultVariants({
    allExpanded,
  });

  const toggleItem = useCallback((uid: string) => {
    setOpenItemUids((prev) => {
      if (prev.has(uid)) return new Set();
      return new Set([uid]);
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setOpenItemUids(new Set());
    } else {
      setOpenItemUids(new Set(reference?.map((item) => item.uid ?? '') ?? []));
    }
  }, [allExpanded, reference]);

  return (
    <Container componentName="Accordion">
      <Row>
        <Col md={8} offsetMd={2}>
          <div className={base()}>
            {enable_expand_all && (
              <div className={header()}>
                <button
                  className={expandAllButton()}
                  onClick={toggleAll}
                  aria-expanded={allExpanded}
                  {...getCSLPAttributes(props.$?.expand_label)}
                >
                  {allExpanded ? collapse_label : expand_label}
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
              <ReferencePlaceholder
                componentName="AccordionItem"
                references={reference ?? []}
                extendedProps={{ openItemUids, onToggle: toggleItem }}
              />
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
