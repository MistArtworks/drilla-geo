export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="blob absolute -top-32 -left-20 w-[30rem] h-[30rem] bg-brand/15"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="blob absolute top-1/4 -right-28 w-[26rem] h-[26rem] bg-sky/15"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="blob absolute bottom-0 left-1/3 w-96 h-96 bg-gold/15"
        style={{ animationDelay: "-9s" }}
      />
    </div>
  );
}
