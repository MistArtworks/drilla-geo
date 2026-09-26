import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("contest_settings")
    .select("registration_open")
    .eq("id", 1)
    .single();

  const open = settings?.registration_open !== false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Reveal>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink text-center mb-3">
          Team Registration
        </h1>
        <p className="text-center font-body text-ink/60 mb-10">
          Duo teams only. Both players must confirm the requirements below.
        </p>
      </Reveal>

      {open ? (
        <RegisterForm />
      ) : (
        <Reveal>
          <GlowCard accent="gold" className="text-center">
            <p className="font-display font-bold text-xl text-gold">
              Registration is currently closed
            </p>
            <p className="mt-2 font-body text-ink/70">
              Check the bracket page to follow the contest live.
            </p>
          </GlowCard>
        </Reveal>
      )}
    </div>
  );
}
