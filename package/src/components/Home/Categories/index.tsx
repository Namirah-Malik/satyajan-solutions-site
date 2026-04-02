import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const Categories = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute left-0 top-0 -z-10">
        <Image
          src="/images/services/Vector.svg"
          alt="vector"
          width={800}
          height={1050}
          unoptimized={true}
          className="hidden md:block"
        />
      </div>
      <div className="container max-w-8xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10">
          <div className="col-span-1 lg:col-span-6">
            <p className="text-emerald-700 text-base font-semibold flex gap-2.5 items-center">
              <Icon icon="ph:solar-panel" className="text-2xl text-yellow-400 animate-pulse" />
              WHAT WE PROVIDE
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg mt-4">
              We&apos;ve done extensive work. See our range.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Our years of experience and dedication have resulted in a carefully curated selection of premium products across all categories
            </p>
          </div>
          <div className="col-span-1 lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden group shadow-lg border border-yellow-100 bg-white/80 backdrop-blur-md">
              <Link href="/products">
                <Image
                  src="/images/featuredproperty/solar-99.jpeg"
                  alt="solar"
                  width={680}
                  height={386}
                  className="w-full h-48 sm:h-64 lg:h-[386px] object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link href="/products" className="md:absolute w-full h-full md:bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 lg:pl-10 pb-4 lg:pb-10 group-hover:top-0 duration-500">
                <div className="flex justify-end mt-4 lg:mt-6 mr-4 lg:mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-3 lg:p-4 md:block hidden">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="md:text-white text-black text-lg lg:text-2xl">
                    SOLAR SOLUTIONS
                  </h3>
                  <p className="md:text-white/80 text-black text-xs lg:text-base leading-5 lg:leading-6">
                    Satyajan provides a wide range of solar products for retail and commercial users. Our objective is to provide customers with easy access to solar energy & reduce their dependency on traditional sources of energy. Solar products are manufactured using the most recent solar technologies to deliver optimal results. Our products are tested and certified as per leading industry certification standards and have carved a strong market position in a short span of time.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden group mt-6 lg:mt-0 shadow-lg border border-yellow-100 bg-white/80 backdrop-blur-md">
              <Link href="/products">
                <Image
                  src="/images/services/ups.png"
                  alt="jumbo"
                  width={680}
                  height={386}
                  className="w-full h-48 sm:h-64 lg:h-[386px] object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link href="/products" className="md:absolute w-full h-full md:bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 lg:pl-10 pb-4 lg:pb-10 group-hover:top-0 duration-500">
                <div className="flex justify-end mt-4 lg:mt-6 mr-4 lg:mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-3 lg:p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="md:text-white text-black text-lg lg:text-2xl">
                    JUMBO/HOME UPS
                  </h3>
                  <p className=" md:text-white/80 text-black text-xs lg:text-base leading-5 lg:leading-6">
                    Specially designed for running higher loads for longer hours, the High-Capacity UPS Jumbo Series comes with smart Overload Sense, Short Circuit Protection and Pure Sinewave Output that makes it a perfect power backup for company & home delivering what it promises – A Power-Packed Series with Uninterrupted Backup!
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden group mt-6 lg:mt-0 shadow-lg border border-yellow-100 bg-white/80 backdrop-blur-md">
              <Link href="/products">
                <Image
                  src="/images/services/Cpu.jpg"
                  alt="villas"
                  width={320}
                  height={386}
                  className="w-full h-40 sm:h-56 lg:h-[386px] object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link href="/products" className="md:absolute w-full h-full md:bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 lg:pl-10 pb-4 lg:pb-10 group-hover:top-0 duration-500">
                <div className="flex justify-end mt-4 lg:mt-6 mr-4 lg:mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-3 lg:p-4 md:block hidden">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="md:text-white text-black text-lg lg:text-2xl">
                    ONLINE UPS
                  </h3>
                  <p className="md:text-white/80 text-black text-xs lg:text-base leading-5 lg:leading-6">
                    We offers Wide Range of Online UPS from 1KVA to 40KVA based on World&apos;s Latest Technology to meet the harsh Environmental and worst Power Conditions for Applications from Small Office requirement to Space Critical Missions with wide variety of Backup Range from 5 minutes to 10 hours to meet the needs of every individual.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden group mt-6 lg:mt-0 shadow-lg border border-yellow-100 bg-white/80 backdrop-blur-md">
              <Link href="/products">
                <Image
                  src="/images/services/battries.jpg"
                  alt="office"
                  width={320}
                  height={386}
                  className="w-full h-40 sm:h-56 lg:h-[386px] object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link href="/products" className="md:absolute w-full h-full md:bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 lg:pl-10 pb-4 lg:pb-10 group-hover:top-0 duration-500">
                <div className="flex justify-end mt-4 lg:mt-6 mr-4 lg:mr-6">
                  <div className="bg-white text-dark rounded-full w-fit p-3 lg:p-4 md:block hidden">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="md:text-white text-black text-lg lg:text-2xl">
                    BATTERIES
                  </h3>
                  <p className="md:text-white/80 text-black text-xs lg:text-base leading-5 lg:leading-6">
                    We offer long-lasting tubular inverter batteries with capacities from 80Ah to 220Ah. Our batteries feature extended warranties (36-60 months) and are compatible with inverters of all brands, making them the preferred choice for reliable power backup solutions.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
