const typography = {
  fontFamily: '"Inter", "Satoshi", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.375rem',
    fontWeight: 600,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  body1: {
    fontSize: '0.9375rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  caption: {
    fontSize: '0.8125rem',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
} as const;

export default typography;
