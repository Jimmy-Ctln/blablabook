import background from "@/assets/hero-background.png";

export default function Hero() {
  return (
    <div className="w-full mt-6 h-96 rounded-3xl shadow-xl">
      <img
        src={background}
        alt="Photo"
        className="w-full h-full rounded-3xl object-cover object-top"
      />
    </div>
  );
}
