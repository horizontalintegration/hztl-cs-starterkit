import { defaultVariants } from './Accordion.styles';
import { Container } from '@/components/primitives/Container/Container';
import { toPascalCase } from '@/utils/string-utils';

// TODO: Replace 'any' with the generated CMS type once available
type AccordionProps = any;

const Default = (props: AccordionProps) => {
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
  const Component =
    variants[toPascalCase(props.component_variant) as keyof typeof variants] || Default;
  return <Component {...props} />;
};
