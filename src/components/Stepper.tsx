import { CheckCircle } from "lucide-react";

interface Step {
    number: number;
    title: string;
  }

  interface StepperProps {
    steps: Step[];
    currentStep: number;
  }

export function Stepper({ steps, currentStep }: StepperProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="position-relative py-4">
      <div
        className="position-absolute"
        style={{
          top: "39%",
          left: "2.5rem",
          right: "2.5rem",
          height: "3px",
          backgroundColor: "#dee2e6",
          transform: "translateY(-50%)",
        }}
      >
        <div
          className="h-100 bg-primary transition"
          style={{
            width: `${progress}%`,
            transition: "all 0.3s ease-in-out",
          }}
        />
      </div>

      {/* Steps */}
      <div className="position-relative d-flex justify-content-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          const paddingClasses =
            index === 0
              ? "ps-0 pe-4"
              : index === steps.length - 1
              ? "ps-4 pe-0"
              : "px-4";

          const circleClasses = `
              rounded-circle border border-2 d-flex align-items-center justify-content-center
              ${
                isCompleted
                  ? "border-primary bg-primary text-white"
                  : isCurrent
                  ? "border-primary text-white bg-primary"
                  : "border-secondary text-secondary bg-white"
              }
            `;

          const titleClasses = `
              mt-2 small fw-medium text-center text-nowrap
              ${isCompleted || isCurrent ? "text-primary" : "text-secondary"}
            `;

          return (
            <div
              key={step.number}
              className={`d-flex flex-column align-items-center ${paddingClasses}`}
            >
              <div
                className={circleClasses}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ transition: "all 0.3s ease-in-out" }}>
                  {isCompleted ? (
                    <CheckCircle size={20} className="check-icon" />
                  ) : (
                    <span className="small fw-semibold">{step.number}</span>
                  )}
                </div>
              </div>
              <span className={titleClasses}>{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
