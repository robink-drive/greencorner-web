import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4. Only loads when NEXT_PUBLIC_GA_ID is set.
 * Lead events are fired from fireLeadConversion on form success.
 */
export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
