import Image from 'next/image'

const SUBCOPY =
  "We're Hardline, the first voice operations platform for the field. We get a lot of inbound right now and not a lot of spare hours, so instead of running the same intro call for the hundredth time, we put it here. Take a few minutes to see who we are. If it's a fit, we'd love to talk."

export default function Hero() {
  return (
    <section className="hl-dark hl-dark-rich">
      <div className="section-container py-20 md:py-28 animate-fade-up">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="section-label mb-5">For prospective investors</p>

            <h1 className="hl-h1 text-4xl font-black text-[color:var(--hl-text)] md:text-6xl">
              Get to know Hardline in 5 minutes.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--hl-text)]">
              {SUBCOPY}
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Image
              src="/native-phone.png"
              alt="Hardline's voice-first call interface, with live tasks and an automatic call summary"
              width={463}
              height={597}
              priority
              className="h-auto w-full max-w-[653px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
