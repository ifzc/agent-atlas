import type { ComponentProps } from 'react';

// Reuse the course components while keeping navigation compatible with static hosting.
export default function StaticLink({
  href,
  children,
  ...props
}: ComponentProps<'a'>) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const destination =
    href?.startsWith('/') && !href.startsWith('//') ? `${base}${href}` : href;
  return (
    <a href={destination} {...props}>
      {children}
    </a>
  );
}
