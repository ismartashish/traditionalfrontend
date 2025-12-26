export default function Hero() {
  return (
    <section className="bg-orange-600 text-white py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold">
        Discover India’s Traditional Art
      </h1>

      <p className="mt-4 text-lg opacity-90">
        Directly from local artisans across India
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/search?q="
          className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition"
        >
          🔍 Explore Products
        </a>
      </div>
    </section>
  );
}
