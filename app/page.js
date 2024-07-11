import MyHolisticComponent from "@/components/holistic";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MyHolisticComponent />
    </main>
  );
}
