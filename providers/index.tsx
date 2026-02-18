'use client';
import { IDictionaryItems, ITheme } from '@/.generated';
import { GlobalLabelsProvider } from '@/context/GlobalLabelContext';
import { Brands } from '@/helpers/Constants/Constant';
import { BrandAndThemeProvider } from './BrandAndThemeContext';
// IMPORTANT: Register CLIENT components for client-side bundle
// This ensures ComponentMapper has client components available during hydration
import '@/temp/registered-client-only-components';

export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: {
    globalLabels: IDictionaryItems | object;
    brand?: Brands;
    theme?: NonNullable<ITheme['theme_options']>;
  };
}) {
  return (
    <BrandAndThemeProvider brand={data.brand} theme={data.theme}>
      <GlobalLabelsProvider value={data}>{children}</GlobalLabelsProvider>
    </BrandAndThemeProvider>
  );
}
