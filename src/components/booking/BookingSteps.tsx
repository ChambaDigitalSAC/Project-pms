'use client'

interface Step {
  id: string
  name: string
}

interface BookingStepsProps {
  steps: Step[]
  currentStep: string
}

export default function BookingSteps({ steps, currentStep }: BookingStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => {
          const isCurrent = step.id === currentStep
          const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx

          return (
            <li
              key={step.name}
              className={`${
                stepIdx !== steps.length - 1 ? 'flex-1' : ''
              } relative`}
            >
              {stepIdx !== steps.length - 1 && (
                <div
                  className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
              
              <div className="relative flex items-center justify-center group">
                <span
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white'
                      : isCurrent
                      ? 'border-2 border-indigo-600 bg-white text-indigo-600'
                      : 'border-2 border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{stepIdx + 1}</span>
                  )}
                </span>
                <span className="absolute top-10 hidden sm:block text-xs font-medium text-gray-500">
                  {step.name}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

