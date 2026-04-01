import { defaultVariants } from './Accordion.styles';
import { Container } from '@/components/primitives/Container/Container';
import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps } from '@/lib/types';
import { IAccordionModularBlock } from '@/.generated';

type AccordionProps = IAccordionModularBlock & IBaseComponentProps;

const Default = (props: AccordionProps) => {
  console.log('Accordion Props:', props);
  const { base, heading } = defaultVariants();

  return (
    <Container componentName="Accordion">
      <div className={base()}>
        <h2 className={heading()}>Accordion</h2>
      </div>
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
