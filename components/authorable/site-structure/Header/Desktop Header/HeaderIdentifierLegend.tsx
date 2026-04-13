import { IDictionaryItems } from '@/.generated';
import { getCSLPAttributes } from '@/utils/type-guards';
import Image from 'next/image';
import PlainTextWrapper from '@/helpers/Wrappers/PlainTextWrapper/PlainTextWrapper';
import { desktopHeaderVariants } from '../Header.styles';

type HeaderIdentifierLegendProps = {
  globalLabels: Partial<IDictionaryItems>;
};

export const HeaderIdentifierLegend = ({ globalLabels }: HeaderIdentifierLegendProps) => {
  const { identifierLegend, identifierLegendItem, identifierIcon } = desktopHeaderVariants();

  const englishOnlyIcon = globalLabels.english_only_identifier_icon;

  const hasEnglishOnlyIcon = !!englishOnlyIcon?.url;

  return (
    <div className={identifierLegend()}>
      <span className={identifierLegendItem()}>
        <i className="fa-solid fa-arrow-up-right text-primary"></i>
        <PlainTextWrapper
          content={`= ${globalLabels.external_link_identifier_label}`}
          tag="i"
          cslpAttribute={globalLabels.$?.external_link_identifier_label}
        />
      </span>
      {hasEnglishOnlyIcon && (
        <span className={identifierLegendItem()}>
          <Image
            src={englishOnlyIcon!.url!}
            alt={englishOnlyIcon!.title ?? ''}
            width={englishOnlyIcon!.dimension?.width}
            height={englishOnlyIcon!.dimension?.height}
            className={identifierIcon()}
            {...getCSLPAttributes(globalLabels.$?.english_only_identifier_icon)}
          />
          <PlainTextWrapper
            content={`= ${globalLabels.english_only_identifier_label}`}
            tag="i"
            cslpAttribute={globalLabels.$?.english_only_identifier_label}
          />
        </span>
      )}
    </div>
  );
};
