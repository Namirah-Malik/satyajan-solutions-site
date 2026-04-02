import { Metadata } from "next";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import HeroSub from "@/components/shared/HeroSub";

export const metadata: Metadata = {
    title: "Our Technology",
    description: "Discover Satyajan's patented Pulse Technology that extends battery life up to 3 times and prevents sulfation buildup in lead-acid batteries."
};

const WavyDivider = ({ flip = false }: { flip?: boolean }) => (
    <svg
        className={`w-full h-12 ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <path
            d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"
            fill="url(#wavyGradient)"
            opacity="0.12"
        />
        <defs>
            <linearGradient id="wavyGradient" x1="0" y1="0" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD600" />
                <stop offset="1" stopColor="#34D399" />
            </linearGradient>
        </defs>
    </svg>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 ${className} transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}>{children}</div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
    <div className={`relative flex items-center justify-center w-16 h-16 ${bgColor} rounded-full shadow-lg mb-3`}>
        <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`}></span>
        <Icon icon={icon} className="text-3xl text-white z-10" />
    </div>
);

const TechnologyPage = () => {
    return (
        <main className="min-h-screen">
            <HeroSub
                title="Our Technology."
                description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
                badge="Technology"
            />
            {/* Pulse Technology Section */}
            <section className="px-4 max-w-7xl mx-auto !pt-0 pb-12">
                <div className="text-start mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
                        Pulse Technology
                    </h2>
                    <p className="text-lg text-gray-600 max-w-4xl mr-auto font-medium">
                        We&apos;re often asked what makes our products better than other trickle or float chargers on the market.
                        It&apos;s easy – our patented Pulse Technology!
                    </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <GlassCard className="p-8">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4 tracking-tight">Revolutionary Battery Technology</h3>
                        <p className="text-gray-700 mb-3 font-medium">
                            In addition to charging the battery, our patented Pulse Technology removes sulfates from the battery plates
                            and prevents new ones from forming. <strong>No other chargers on the market have this technology</strong>.
                        </p>
                        <p className="text-gray-700 mb-3 font-medium">
                            Our chargers are UNIQUE in their ability to utilize this patented Pulse Technology. If you notice your
                            battery&apos;s loss of power over time you have a build-up of sulfate crystals and should use our Pulse
                            Technology to remove the sulfate crystals allowing more room for energy storage.
                        </p>
                        <div className="p-4 rounded-2xl border-l-4 border-primary shadow-md mt-4">
                            <p className="text-dark font-semibold">
                                Eliminating sulfate buildup from lead-acid battery plates improves battery performance and extends
                                battery life up to 3 times.
                            </p>
                        </div>
                    </GlassCard>
                    <GlassCard className="flex flex-col items-center justify-center p-8 text-center">
                        <PlayfulIcon icon="ph:lightning-fill" ringColor="border-primary" bgColor="bg-primary" />
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Dual Circuit Technology</h4>
                        <p className="text-gray-600 font-medium">
                            One circuit for charging PLUS a second separate circuit for Pulse Technology providing a powerful
                            one-two punch to the battery.
                        </p>
                    </GlassCard>
                </div>
                {/* What is Sulfation */}
                <GlassCard className="mb-16 p-8">
                    <h3 className="text-3xl font-bold text-primary mb-6 text-start tracking-tight">
                        What is Sulfation?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div className="flex flex-col items-center text-center p-4">
                            <PlayfulIcon icon="ph:warning-circle-fill" ringColor="border-orange-400" bgColor="bg-gradient-to-br from-orange-400 to-yellow-300" />
                            <h5 className="font-semibold text-gray-900 mb-1">Reduces Discharge Power</h5>
                            <p className="text-sm text-gray-600 font-medium">
                                Sulfates reduce the battery&apos;s ability to discharge power
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                            <PlayfulIcon icon="ph:battery-charging-fill" ringColor="border-yellow-400" bgColor="bg-gradient-to-br from-yellow-400 to-emerald-400" />
                            <h5 className="font-semibold text-gray-900 mb-1">Reduces Recharge Ability</h5>
                            <p className="text-sm text-gray-600 font-medium">
                                Sulfates reduce the battery&apos;s ability to recharge
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                            <PlayfulIcon icon="ph:clock-fill" ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-blue-400" />
                            <h5 className="font-semibold text-gray-900 mb-1">Shortens Battery Life</h5>
                            <p className="text-sm text-gray-600 font-medium">
                                80% of batteries worldwide die prematurely
                            </p>
                        </div>
                    </div>
                </GlassCard>
                {/* How Pulse Technology Works */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <GlassCard className="flex flex-col items-center justify-center p-8 text-center">
                        <PlayfulIcon icon="ph:wave-sine-fill" ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-green-400" />
                        <h4 className="text-xl font-bold text-gray-900 mb-2">High-Frequency Pulse Waveform</h4>
                        <p className="text-gray-600 font-medium">
                            25,000 pulses per second with precise amplitude and frequency control
                        </p>
                    </GlassCard>
                    <GlassCard className="p-8">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4 tracking-tight">How Pulse Technology Works</h3>
                        <p className="text-gray-700 mb-3 font-medium">
                            Pulse Technology is delivered to the battery through a circuit which is independent of the charging circuit.
                            This patented, high-frequency pulse waveform is of a specific amplitude and frequency that is precisely
                            controlled by microprocessors.
                        </p>
                        <p className="text-gray-700 mb-3 font-medium">
                            It rises rapidly in less than one microsecond to its maximum amplitude and gradually returns to zero.
                            There is no abrupt stop and no battery drain. This waveform occurs 25,000 times a second and has been
                            proven to remove sulfation from the battery plates and return the lead sulfate back to the electrolyte solution.
                        </p>
                        <div className="bg-emerald-100/60 p-4 rounded-lg border-l-4 border-emerald-600 shadow mt-4">
                            <p className="text-emerald-800 font-semibold">
                                PulseTech&apos;s patented waveform is simply the most effective method to remove damaging battery
                                sulfation and enhance battery performance available today!
                            </p>
                        </div>
                    </GlassCard>
                </div>
                {/* Scientific Validation */}
                <GlassCard className="mb-16 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <PlayfulIcon icon="ph:medal-fill" ringColor="border-blue-400" bgColor="bg-gradient-to-br from-blue-400 to-emerald-400" />
                        <h3 className="text-3xl font-bold text-emerald-800 tracking-tight">Scientifically Validated</h3>
                    </div>
                    <p className="text-gray-700 mb-6 font-medium">
                        Pulse Technology has been scientifically validated through extensive, independent test studies conducted
                        at both Oakland University and Ohio State University. The US Air Force Management Equipment and Evaluation
                        Program also conducted studies of Pulse Technology and shared their findings:
                    </p>
                    <blockquote className="border-l-4 border-blue-500 pl-6 italic text-lg text-gray-900 bg-white/30 rounded-xl p-4">
                        &quot;This evaluation indicates that many batteries previously condemned could be reclaimed if Pulse Technology
                        were used extensively; assuming there is no internal damage to battery, i.e.: plates, etc. In conclusion,
                        Pulse Technology worked by removing sulfation from the battery plates as the manufacturer claimed. It is
                        unknown exactly how long a battery will last with Pulse Technology connected, but it is estimated at least
                        eight to ten years of life can be added.&quot;
                    </blockquote>
                </GlassCard>
                {/* Cost Savings */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-2">
                            <PlayfulIcon icon="ph:currency-dollar-simple-fill" ringColor="border-yellow-400" bgColor="bg-gradient-to-br from-yellow-400 to-orange-400" />
                            <h4 className="text-xl font-bold text-gray-900 ml-2">Cost Reduction</h4>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">
                            Although the lead-acid battery is not excessively expensive, its cost goes up dramatically when you
                            include the cost of downtime, disposal and labor hours.
                        </p>
                        <p className="text-gray-700 font-medium">
                            These costs will be reduced or even eliminated by simply extending battery life and increasing battery efficiency.
                        </p>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-2">
                            <PlayfulIcon icon="ph:chart-line-up-fill" ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-green-400" />
                            <h4 className="text-xl font-bold text-gray-900 ml-2">Battery Management Program</h4>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">
                            Our Battery Management Program, which incorporates our patented Pulse Technology reduces battery
                            consumption by an <strong>average of 70%</strong>.
                        </p>
                        <p className="text-gray-700 font-medium">
                            This translates to significant cost savings and improved operational efficiency.
                        </p>
                    </GlassCard>
                </div>
            </section>
            {/* Environmental Impact Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-start mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
                            Environmentally Responsible
                        </h2>
                        <p className="text-lg text-gray-600 max-w-4xl mr-auto font-medium">
                            We&apos;re proud to help corporations and consumers meet their sustainability and environmental goals with our products.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                        <GlassCard className="p-8">
                            <h3 className="text-2xl font-bold text-emerald-800 mb-4 tracking-tight">Keeping Batteries Out of Landfills</h3>
                            <p className="text-gray-700 mb-3 font-medium">
                                Keeping lead-acid batteries operating far past traditional life cycles and out of waste stream,
                                landfills and smelters, where they can result in long lasting legacies harmful to the environment
                                if improperly recycled, is a challenge for fleet managers and individual consumers looking for green solutions.
                            </p>
                            <p className="text-gray-700 mb-3 font-medium">
                                Our Pulse Technology is a US patented and scientifically validated process which has proven to prevent
                                premature battery death and extend battery life up to five times their normal cycle.
                            </p>
                            <div className="bg-emerald-100/60 p-4 rounded-lg border-l-4 border-emerald-600 shadow mt-4">
                                <p className="text-emerald-800 font-semibold">
                                    Our Recovery Chargers also utilize Pulse Technology allowing them to recover more than 70% of
                                    batteries previously thought dead or useless.
                                </p>
                            </div>
                        </GlassCard>
                        <GlassCard className="flex flex-col items-center justify-center p-8 text-center">
                            <PlayfulIcon icon="ph:leaf-fill" ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-green-400" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Environmental Impact</h4>
                            <p className="text-gray-600 font-medium">
                                After the tire, the battery is the most expensive and difficult product to dispose of safely.
                                Yet, it is estimated that over 80% of the batteries being discarded every year are only suffering
                                from lead plates that are clogged with sulfate crystals.
                            </p>
                        </GlassCard>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <GlassCard className="flex flex-col items-center text-center p-6">
                            <PlayfulIcon icon="ph:recycle-fill" ringColor="border-blue-400" bgColor="bg-gradient-to-br from-blue-400 to-emerald-400" />
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Proper Recycling</h4>
                            <p className="text-gray-600 font-medium">
                                Even with routine maintenance lead-acid batteries will eventually need to be recycled, an energy
                                intensive procedure of sorting batteries into chemistries.
                            </p>
                        </GlassCard>
                        <GlassCard className="flex flex-col items-center text-center p-6">
                            <PlayfulIcon icon="ph:shield-check-fill" ringColor="border-emerald-400" bgColor="bg-gradient-to-br from-emerald-400 to-green-400" />
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Safety Standards</h4>
                            <p className="text-gray-600 font-medium">
                                We salute those recyclers that continuously seek improvement in extracting lead from batteries,
                                while adhering to safety standards in processing.
                            </p>
                        </GlassCard>
                        <GlassCard className="flex flex-col items-center text-center p-6">
                            <PlayfulIcon icon="ph:users-fill" ringColor="border-purple-400" bgColor="bg-gradient-to-br from-purple-400 to-blue-400" />
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Corporate Support</h4>
                            <p className="text-gray-600 font-medium">
                                We fully support companies that employ lead-acid battery management programs keeping hundreds of
                                thousands of batteries in service for longer periods of time.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </section>
            {/* Call to Action */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <GlassCard className="p-10 bg-white/60 inline-block">
                        <h2 className="text-3xl font-bold text-primary mb-4 drop-shadow-lg tracking-tight">
                            Ready to Extend Your Battery Life?
                        </h2>
                        <p className="text-dark mb-8 text-lg font-medium">
                            Don&apos;t let your battery be one of the 80% that die needlessly. Pulse Technology is the cure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/products" className="bg-primary/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary transition-colors shadow-md">
                                Learn More About Our Products
                            </Link>
                            <Link href="/contactus" className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-md">
                                Contact Us Today
                            </Link>
                        </div>
                    </GlassCard>
                </div>
            </section>
        </main>
    );
};

export default TechnologyPage;

// Add this to your global CSS or Tailwind config for slow spin:
// .animate-spin-slow { animation: spin 6s linear infinite; }