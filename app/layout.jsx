import "./globals.css";

export const metadata = {
  title: "Welcome Itzfizz",
  description: "A scroll-driven hero section built with Next.js, Tailwind CSS and GSAP.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* If JavaScript is off, show everything that would normally animate in */}
        <noscript>
          <style>{`.opacity-0{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
