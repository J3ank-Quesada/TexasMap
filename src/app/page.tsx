'use server';

import CityInfo from "@/components/cityInfo/CityInfo";

export default async function Home() {
  
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-300">
        Hello world!
      </h1>
      <CityInfo />
    </div>
  );
}
