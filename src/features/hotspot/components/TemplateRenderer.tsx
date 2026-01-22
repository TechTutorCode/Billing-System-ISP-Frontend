import { useEffect, useRef } from 'react';

interface TemplateRendererProps {
  template: string;
  variables: Record<string, string>;
  onRenderComplete?: () => void;
}

/**
 * Renders a template with variable substitution
 * Supports placeholders: {{mac}}, {{profile}}, {{linkLogin}}, etc.
 */
export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  variables,
  onRenderComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Call render complete callback
    if (onRenderComplete) {
      onRenderComplete();
    }
  }, [template, variables, onRenderComplete]);

  return (
    <div
      ref={containerRef}
      className="template-container"
      style={{ minHeight: '200px' }}
    />
  );
};
