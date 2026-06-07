import Script from 'next/script';
import CasinoDashboard from './CasinoDashboard';

export default function DgaPage() {
  return (
    <>
      {/* Ensure 'dgaAPI.js', 'demo.js', and the 'gamescripts/' dependencies 
        are stored inside your Next.js project root '/public' directory 
        (e.g., public/dgaAPI.js) so they load correctly.
      */}
      <Script 
        src="/dgaAPI.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="/demo.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="/gamescripts/money_time.js" 
        strategy="lazyOnload" 
      />

<iframe 
  src="https://dga.pragmaticplaylive.net/demo/demo.html?casinoId=il9srgw4dna23p47&delta=true" 
  width="100%" 
  height="600px" 
  sandbox="allow-scripts allow-same-origin allow-forms"
  allow="autoplay; encrypted-media"
>
</iframe>
      <CasinoDashboard />
    </>
  );
}