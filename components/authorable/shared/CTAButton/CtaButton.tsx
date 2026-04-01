import { Container } from '@/components/primitives/Container/Container';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { toPascalCase } from '@/utils/string-utils';

// TODO: Replace 'any' with the generated CMS type once available
type CtaButtonProps = any;

const Default = (props: CtaButtonProps) => {
  return (
    <Container componentName="CTAButton">
      <ButtonWrapper cta={props} />
    </Container>
  );
};

const variants = {
  Default,
};

export const CtaButton = (props: CtaButtonProps) => {
  const Component =
    variants[toPascalCase(props.component_variant) as keyof typeof variants] || Default;
  return <Component {...props} />;
};
