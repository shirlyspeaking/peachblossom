import { Exo_2 } from "next/font/google";
import { LegendaryCardCreator } from "@/components/LegendaryCardCreator";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <>
      <LegendaryCardCreator titleFontClassName={exo2.className} />
    </>
  );
}
