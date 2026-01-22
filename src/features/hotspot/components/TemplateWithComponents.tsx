import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PackageSelector } from './PackageSelector';
import { Button } from '../../../components/ui/button';

interface TemplateWithComponentsProps {
  template: string;
  variables: Record<string, string>;
  selectedPackageId?: string;
  onPackageSelect: (packageId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * Renders a template with React component injection support
 * Supports placeholders: {{mac}}, {{profile}}, {{linkLogin}}
 * Also supports: {{packageSelector}} and {{submitButton}}
 */
export const TemplateWithComponents: React.FC<TemplateWithComponentsProps> = ({
  template,
  variables,
  selectedPackageId,
  onPackageSelect,
  onSubmit,
  isSubmitting,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const packageSelectorRootRef = useRef<Root | null>(null);
  const submitButtonRootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!containerRef.current || !template) return;

    // Replace all placeholders in the template
    let renderedContent = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      renderedContent = renderedContent.replace(regex, value || '');
    });

    // Set the rendered HTML
    containerRef.current.innerHTML = renderedContent;

    // Execute any scripts in the template
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // Inject React components into placeholders
    const packageSelectorPlaceholder = containerRef.current.querySelector('[data-package-selector]');
    if (packageSelectorPlaceholder) {
      packageSelectorPlaceholder.innerHTML = '';
      if (!packageSelectorRootRef.current) {
        packageSelectorRootRef.current = createRoot(packageSelectorPlaceholder);
      }
      packageSelectorRootRef.current.render(
        <PackageSelector
          onSelect={onPackageSelect}
          selectedPackageId={selectedPackageId}
          isLoading={isSubmitting}
        />
      );
    }

    const submitButtonPlaceholder = containerRef.current.querySelector('[data-submit-button]');
    if (submitButtonPlaceholder) {
      submitButtonPlaceholder.innerHTML = '';
      if (!submitButtonRootRef.current) {
        submitButtonRootRef.current = createRoot(submitButtonPlaceholder);
      }
      submitButtonRootRef.current.render(
        <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Connecting...' : 'Connect to Internet'}
        </Button>
      );
    }

    // Attach form submission handler
    const forms = containerRef.current.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmit();
      });
    });
  }, [template, variables, selectedPackageId, onPackageSelect, onSubmit, isSubmitting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      packageSelectorRootRef.current?.unmount();
      submitButtonRootRef.current?.unmount();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="template-container"
      style={{ minHeight: '200px' }}
    />
  );
};
