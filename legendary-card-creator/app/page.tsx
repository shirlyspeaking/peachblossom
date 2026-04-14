import Script from "next/script";
import { Exo_2 } from "next/font/google";
import { LegendaryCardCreator } from "@/components/LegendaryCardCreator";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
        strategy="afterInteractive"
      />
      <LegendaryCardCreator titleFontClassName={exo2.className} />
    </>
  );
}
