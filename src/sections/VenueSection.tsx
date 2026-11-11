import { useState } from "react";
import { MapPin } from "lucide-react";
import { Sprig } from "@/components/Botanical";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { useNearViewport } from "@/hooks/useMedia";

export function VenueSection() {
  const [ref, near] = useNearViewport<HTMLDivElement>("60% 0px");
  const [everNear, setEverNear] = useState(false);
  if (near && !everNear) setEverNear(true);
  const { venue, date } = wedding;

  return (
    <section id="venue" className="section-pad relative overflow-hidden bg-grey">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="text-center lg:col-span-5 lg:text-left">
          <Reveal>
            <p className="eyebrow">The Venue</p>
          </Reveal>
          <Reveal variant="heading" delay={0.08}>
            <h2 className="heading mt-5">Where Love Brings Us Together</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <Sprig className="mx-auto my-8 w-24 lg:mx-0" />
            <h3 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-medium leading-tight text-forest">
              {venue.name}
            </h3>
            <p className="mt-2 font-sans text-[1rem] text-ink">
              {venue.locality}, {venue.region}, {venue.country}
            </p>
            <p className="eyebrow mt-5">{date.long}</p>
          </Reveal>
          <Reveal delay={0.24} className="mt-9">
            <a className="btn btn-primary" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={16} strokeWidth={1.6} aria-hidden="true" />
              Open in Google Maps
            </a>
          </Reveal>
        </div>

        <Reveal variant="card" delay={0.15} className="lg:col-span-7">
          <div
            ref={ref}
            className="paper-shadow relative aspect-[4/3] w-full overflow-hidden rounded-md border-[10px] border-white bg-white lg:aspect-[16/11]"
          >
            {/* drawn placeholder — stays visible if the live map cannot load */}
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                background:
                  "linear-gradient(0deg, rgb(248 247 243 / .86), rgb(248 247 243 / .86)), repeating-linear-gradient(0deg, transparent 0 46px, rgb(168 185 168 / .7) 46px 47px), repeating-linear-gradient(90deg, transparent 0 46px, rgb(168 185 168 / .7) 46px 47px), #F8F7F3",
              }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-ivory">
                <MapPin size={20} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="mt-4 font-serif text-2xl text-forest">{venue.name}</span>
              <span className="eyebrow mt-2 !text-[0.62rem]">
                {venue.locality} · {venue.region}
              </span>
            </a>
            {everNear && (
              <iframe
                title={`Map showing ${venue.name}, ${venue.locality}, ${venue.region}`}
                src={venue.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                style={{ filter: "saturate(.75) sepia(.08)" }}
                allowFullScreen
              />
            )}
          </div>
          <p className="mt-3 text-center font-sans text-[0.72rem] text-ink/75 lg:text-right">
            Google Maps · {venue.name}, {venue.locality}, {venue.region}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
