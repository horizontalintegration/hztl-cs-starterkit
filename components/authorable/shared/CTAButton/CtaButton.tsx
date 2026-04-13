import { Container } from '@/components/primitives/Container/Container';
import { toPascalCase } from '@/utils/string-utils';
import { IBaseComponentProps, WithMetadata } from '@/lib/types';
import { IEnhancedCta } from '@/.generated';
import { ButtonWrapper } from '@/helpers/Wrappers/ButtonWrapper/ButtonWrapper';
import { defaultVariants } from './CtaButton.styles';

type CtaButtonProps = WithMetadata<IEnhancedCta> & IBaseComponentProps;

const Default = (props: CtaButtonProps) => {
  const { componentName, _metadata } = props;
  const base = defaultVariants();

  return (
    <Container componentName={componentName} id={_metadata?.uid}>
      <div className={base}>
        <ButtonWrapper cta={props} />
      </div>
    </Container>
  );
};

const variants = {
  Default,
};

export const CtaButton = (props: CtaButtonProps) => {
  const Component = props.component_variant
    ? variants[toPascalCase(props.component_variant) as keyof typeof variants]
    : Default;
  return <Component {...props} />;
};
