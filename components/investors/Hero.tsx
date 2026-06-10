import Image from 'next/image'

const SUBCOPY =
  "We're Hardline, the first voice operations platform for the field. Rather than give the same intro pitch for the hundredth time, we built it once."

export default function Hero() {
  return (
    <section className="hl-dark hl-dark-rich">
      <div className="section-container py-20 md:py-28 animate-fade-up">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="section-label mb-5">For prospective investors</p>

            <h1 className="hl-h1 text-4xl font-black text-[color:var(--hl-text)] md:text-6xl">
              Want 30 minutes with us? Spend 5 here first.
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
