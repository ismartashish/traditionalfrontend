import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/* ================= HOME PAGE ================= */

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.slice(0, 8)); // featured
    });
  }, []);

  return (
    <div className="bg-gray-50">
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
      <WhyUs />
      <CTA />
    </div>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Authentic Indian <br />
          <span className="text-orange-600">
            Handcrafted Products
          </span>
        </h1>

        <p className="mt-6 text-gray-600 text-lg">
          Discover handpicked crafts, textiles & artworks directly
          from local artisans across India.
        </p>

        {/* SEARCH BAR */}
        <SearchBar />

        <div className="mt-8 flex gap-4">
          <Link
            to="/products"
            className="px-6 py-3 bg-orange-600 text-white rounded-full"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <img
        src="/hero.png"
        alt="Handcrafted Products"
        className="rounded-3xl shadow-lg"
      />
    </section>
  );
}

/* ================= CATEGORIES ================= */

function Categories() {
  const categories = [
    {
      name: "Handloom",
      img: "/categories/handloom.jpg"
    },
    {
      name: "Jewellery",
      img: "/categories/jewellery.jpg"
    },
    {
      name: "Home Decor",
      img: "/categories/home-decor.jpg"
    },
    {
      name: "Paintings",
      img: "/categories/paintings.jpg"

    },
     {     
       name: "Cultural Artifacts",
      img: "/categories/cultural.jpg"
    }
   
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((c) => (
          <Link
            key={c.name}
            to={`/products?category=${encodeURIComponent(c.name)}`}
            className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
          >
            <img
              src={c.img}
              alt={c.name}
              className="h-44 w-full object-cover group-hover:scale-105 transition"
            />
            <p className="p-4 font-semibold text-center">
              {c.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}


/* ================= FEATURED PRODUCTS ================= */

function FeaturedProducts({ products }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <Link
          to="/products"
          className="text-orange-600 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={`https://traditionalbackend.onrender.com${p.images[0]}`}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <p className="font-semibold line-clamp-1">
                {p.title}
              </p>

              <p className="text-sm text-gray-500">
                📍 {p.state}
              </p>

              <p className="mt-2 text-orange-600 font-bold">
                ₹{p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ================= WHY US ================= */

function WhyUs() {
  const features = [
    {
      title: "Direct from Artisans",
      desc: "No middlemen, fair prices"
    },
    {
      title: "Authentic Products",
      desc: "100% handmade & original"
    },
    {
      title: "Secure Payments",
      desc: "Fast & safe checkout"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl bg-gray-50 shadow"
          >
            <h3 className="font-bold text-lg">
              {f.title}
            </h3>
            <p className="text-gray-600 mt-2">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-orange-600 text-white rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-3xl font-bold">
          Start selling your craft today
        </h2>

        <Link
          to="/seller/register"
          className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold"
        >
          Become a Seller
        </Link>
      </div>
    </section>
  );
}
function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetch = async () => {
      const res = await api.get(
        `/products?search=${query}`
      );
      setResults(res.data);
    };

    fetch();
  }, [query]);

  return (
    <div className="relative max-w-2xl mt-8">
      <input
        type="text"
        placeholder="Search by product or location (e.g. Bihar, Handloom)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-6 py-3 rounded-full shadow focus:outline-none"
      />

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-xl mt-2 max-h-80 overflow-y-auto z-50">
          {results.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between"
            >
              <span className="font-medium">
                {p.title}
              </span>
              <span className="text-sm text-gray-500">
                📍 {p.state}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
