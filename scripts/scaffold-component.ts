/**
 * @file scaffold-component.ts
 * @description CLI script to scaffold a new component with boilerplate files.
 * Creates a component directory with a .tsx file and a .styles.ts file,
 * following the project's established patterns (variant-based architecture with tailwind-variants).
 *
 * Usage:
 *   npx tsx scripts/scaffold-component.ts <ComponentName> [--path <relative-path>]
 *
 * Examples:
 *   npx tsx scripts/scaffold-component.ts CardBlock
 *   npx tsx scripts/scaffold-component.ts CardBlock --path components/authorable/shared/content
 *
 * Default path: components/authorable/shared/content
 */

import fs from 'fs';
import path from 'path';

const DEFAULT_PATH = 'components/authorable/shared';

const parseArgs = () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage: npx tsx scripts/scaffold-component.ts <ComponentName> [--path <relative-path>]

Arguments:
  ComponentName   PascalCase name for the component (e.g. CardBlock)

Options:
  --path, -p      Target directory relative to project root (default: ${DEFAULT_PATH})
  --help, -h      Show this help message

Examples:
  npx tsx scripts/scaffold-component.ts CardBlock
  npx tsx scripts/scaffold-component.ts CardBlock --path components/ui
`);
    process.exit(0);
  }

  const componentName = args[0];
  let targetPath = DEFAULT_PATH;

  const pathIndex = args.indexOf('--path') !== -1 ? args.indexOf('--path') : args.indexOf('-p');
  if (pathIndex !== -1 && args[pathIndex + 1]) {
    targetPath = args[pathIndex + 1];
  }

  // Validate PascalCase
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    console.error(`❌ Component name must be PascalCase (e.g. CardBlock). Got: "${componentName}"`);
    process.exit(1);
  }

  return { componentName, targetPath };
};

const generateComponentFile = (componentName: string): string => {
  return `import { defaultVariants } from './${componentName}.styles';
import { Container } from '@/components/primitives/Container/Container';
import { toPascalCase } from '@/utils/string-utils';

// TODO: Replace 'any' with the generated CMS type once available
type ${componentName}Props = any;

const Default = (props: ${componentName}Props) => {
  const { base, heading } = defaultVariants();

  return (
    <Container componentName="${componentName}">
      <div className={base()}>
        <h2 className={heading()}>${componentName}</h2>
      </div>
    </Container>
  );
};

const variants = {
  Default,
};

export const ${componentName} = (props: ${componentName}Props) => {
  const Component =
    variants[toPascalCase(props.component_variant) as keyof typeof variants] || Default;
  return <Component {...props} />;
};
`;
};

const generateStylesFile = (): string => {
  return `import { tv } from 'tailwind-variants';

export const defaultVariants = tv({
  slots: {
    base: [],
    heading: ['heading-2', 'text-textPrimary'],
  },
});
`;
};

const main = () => {
  const { componentName, targetPath } = parseArgs();
  const projectRoot = path.join(__dirname, '..');
  const componentDir = path.join(projectRoot, targetPath, componentName);

  // Check if directory already exists
  if (fs.existsSync(componentDir)) {
    console.error(`❌ Directory already exists: ${path.relative(projectRoot, componentDir)}`);
    process.exit(1);
  }

  // Create directory
  fs.mkdirSync(componentDir, { recursive: true });

  // Write component file
  const componentFilePath = path.join(componentDir, `${componentName}.tsx`);
  fs.writeFileSync(componentFilePath, generateComponentFile(componentName));

  // Write styles file
  const stylesFilePath = path.join(componentDir, `${componentName}.styles.ts`);
  fs.writeFileSync(stylesFilePath, generateStylesFile());

  const relDir = path.relative(projectRoot, componentDir);
  console.log(`✅ Scaffolded component "${componentName}":`);
  console.log(`   📄 ${relDir}/${componentName}.tsx`);
  console.log(`   🎨 ${relDir}/${componentName}.styles.ts`);
  console.log(`\nNext steps:`);
  console.log(`   1. Run "npm run gen-config" to register the component in the mapper`);
};

main();
