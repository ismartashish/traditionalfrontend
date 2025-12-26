const categories = [
  "Handloom",
  "Pottery",
  "Jewellery",
  "Paintings",
  "Home Decor"
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-8">
      {categories.map((c) => (
        <div
          key={c}
          className="bg-white shadow p-6 text-center rounded hover:scale-105 transition"
        >
          {c}
        </div>
      ))}
    </div>
  );
}
