import "../styles/globals.scss";
import Link from "next/link";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../prismicio";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, ...props }) => (
        <Link href={href}>
          <a {...props} />
        </Link>
      )}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <Component {...pageProps} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MXL8M803C3"
        />
        <Script id="gaScript">
          {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-MXL8M803C3');`}
        </Script>
      </PrismicPreview>
    </PrismicProvider>
  );
}

export default MyApp;
