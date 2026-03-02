/**
 * @file ComponentMapper.ts
 * @description Singleton registry that maps CMS component names (snake_case) to React components.
 */

import { NotFound } from '@/components/primitives/NotFound';
import { toPascalCase } from '@/utils/string-utils';

/**
 * Registers and resolves components by name. Names are normalized to PascalCase.
 * Returns NotFound when a component is missing (used by ComponentRenderer, ReferencePlaceholder).
 */
export class ComponentMapper {
  private static instance: ComponentMapper;
  private components: Record<string, React.ComponentType<any>> = {};
  private notFoundComponent: React.ComponentType<any> = NotFound;

  private constructor() { }

  static getInstance(): ComponentMapper {
    if (!ComponentMapper.instance) {
      ComponentMapper.instance = new ComponentMapper();
    }
    return ComponentMapper.instance;
  }

  /** Registers a component under PascalCase name */
  register(name: string, component: React.ComponentType<any>): void {
    this.components[toPascalCase(name)] = component;
  }

  /** Registers multiple components from a map */
  registerBulk(components: Record<string, React.ComponentType<any>>): void {
    Object.entries(components).forEach(([name, component]) => {
      this.register(name, component);
    });
  }

  /** Returns the component or NotFound if not registered */
  getComponent(name: string): React.ComponentType<any> {
    const component = this.components[toPascalCase(name)];
    return component ?? this.notFoundComponent;
  }

  /** Returns true if a component is registered */
  hasComponent(name: string): boolean {
    return !!this.components[toPascalCase(name)];
  }

  /** Returns a copy of all registered components */
  getAllComponents(): Record<string, React.ComponentType<any>> {
    return { ...this.components };
  }
}

export const componentMapperInstance = ComponentMapper.getInstance();
