import Image from 'next/image'
import Link from 'next/link'
import { BackgroundBeams } from './bgbeam'

const Hero: React.FC = () => {
  return (
    <section className='!py-0'>
      <div className='bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative min-h-screen'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68 relative z-10'>
          <div className='relative text-center md:text-start z-10'>
            <p className='text-xm font-medium text-white'>
              SATYAJAN ENERGY SOLUTIONS
            </p>
            <h1 className='text-white text-6xl sm:text-8xl font-semibold xl:max-w-45p mt-4 mb-6'>
              Innovating the way India powers up.
            </h1>
            <div className='flex flex-col flex-wrap xs:flex-row justify-center md:justify-start gap-4'>
              <Link href="/contactus" className='px-8 py-4 border border-white bg-white text-dark duration-300 hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer'>
                Get in touch
              </Link>
              <Link href="/#services" className='px-8 py-4 border border-white bg-transparent text-white hover:bg-white hover:text-dark duration-300 text-base font-semibold rounded-full hover:cursor-pointer'>
                View Details
              </Link>
            </div>
          </div>
          <div className='hidden md:block absolute bottom-36 -right-80 z-5'>
            <Image
              src={'/images/hero/heroBanner.png'}
              alt='heroImg'
              width={1082}
              height={1016}
              priority={false}
              unoptimized={true}
              className='rounded-s-4xl shadow-sky'
            />
          </div>
        </div>
        <div className='xl:absolute bottom-0 xl:-right-68 xl:right-0 bg-white py-12 px-8 mobile:px-16 md:pl-16 rounded-2xl md:rounded-none md:rounded-tl-2xl mt-24 relative z-20'>
          <div className='grid grid-cols-2 sm:grid-cols-4 md:flex gap-16 md:gap-24 sm:text-center text-black'>
            <div className='flex flex-col sm:items-center gap-3'>
              <Image
                src={'/images/SVGs/energyefficient.svg'}
                alt='solar-panels'
                width={32}
                height={32}
                className='block'
                unoptimized={true}
              />
              <p className='text-sm sm:text-base font-normal text-inherit'>
                10000+ HAPPY CUSTOMERS
              </p>
            </div>
            <div className='flex flex-col sm:items-center gap-3'>
              <Image
                src={'/images/SVGs/smart-home-access.svg'}
                alt='energy-storage'
                width={32}
                height={32}
                className='block'
                unoptimized={true}
              />
              <p className='text-sm sm:text-base font-normal text-inherit'>
                500 + DELIVERY POINTS
              </p>
            </div>
            <div className='flex flex-col sm:items-center gap-3 col-span-2'>
              <Image
                src={'/images/SVGs/property-details.svg'}
                alt='energy-efficiency'
                width={32}
                height={32}
                className='block'
                unoptimized={true}
              />
              <p className='text-sm sm:text-base font-normal text-inherit'>
                250+ DEALERS NETWORK & PROFESSIONAL TEAMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
