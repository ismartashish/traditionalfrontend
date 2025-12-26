const states = [
  "Bihar",
  "Uttar Pradesh",
  "Rajasthan",
  "West Bengal",
  "Tamil Nadu",
  "Gujarat",
  "Maharashtra",
  "Karnataka",
  "Punjab",
  "Odisha",
  "Assam",
  "Haryana",
  "Kerala",
  "Jharkhand",
  "Chhattisgarh",
  "Madhya Pradesh",
  "Telangana",
  "Andhra Pradesh",
  "Jammu and Kashmir",
  "Goa",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
  "Arunachal Pradesh",
  "Himachal Pradesh",
  "Uttarakhand",
  "Delhi",
  "Puducherry",
  "Daman and Diu",
];

export default function States() {
  return (
    <div className="bg-gray-100 py-12 px-8">
      <h2 className="text-2xl font-bold mb-6">
        Shop by State
      </h2>

      <div className="flex flex-wrap gap-4">
        {states.map((state) => (
          <span
            key={state}
            className="bg-white px-4 py-2 rounded-full shadow cursor-pointer hover:bg-orange-600 hover:text-white"
          >
            {state}
          </span>
        ))}
      </div>
    </div>
  );
}
