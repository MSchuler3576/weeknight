import './globals.css';

export const metadata = {
  title: 'Weeknight — your groceries, planned into dinners',
  description: 'Snap your grocery receipt. Get 7 dinners your household will actually eat, checked for allergies and waste, and smarter every week.',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#2F4A38' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
