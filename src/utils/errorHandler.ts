// Global error handler to suppress external errors
export const setupErrorHandling = () => {
  // Suppress checkout popup errors from browser extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('checkout popup')) {
      event.preventDefault();
      console.warn('Suppressed external checkout popup error:', event.reason);
      return;
    }
  });

  // Suppress checkout errors in console
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ');
    if (errorMessage.includes('checkout popup') || errorMessage.includes('No checkout popup config')) {
      // Suppress this specific error
      return;
    }
    originalError.apply(console, args);
  };
};
