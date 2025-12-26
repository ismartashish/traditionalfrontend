export default function OrderStatusStepper({ status }) {
  const steps = ["Placed", "Shipped", "Delivered"];

  const getStepIndex = () => {
    if (status === "Cancelled") return -1;
    return steps.indexOf(status);
  };

  const activeStep = getStepIndex();

  return (
    <div className="flex items-center gap-4 mt-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`h-4 w-4 rounded-full ${
              index <= activeStep
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
          />
          <span
            className={`text-sm ${
              index <= activeStep
                ? "text-green-700 font-semibold"
                : "text-gray-400"
            }`}
          >
            {step}
          </span>

          {index < steps.length - 1 && (
            <div className="w-10 h-[2px] bg-gray-300 mx-2" />
          )}
        </div>
      ))}

      {status === "Cancelled" && (
        <span className="text-red-600 font-semibold">
          ❌ Cancelled
        </span>
      )}
    </div>
  );
}
