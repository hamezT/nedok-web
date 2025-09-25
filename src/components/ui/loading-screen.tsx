import * as React from "react";

interface LoadingScreenProps {
  message?: string;
  isVisible?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Đang chuyển hướng...",
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E97132]/10 to-[#92D050]/10" />

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-[#E97132]/20 rounded-full animate-spin"
               style={{ animationDuration: '2s' }}>
          </div>

          {/* Inner ring */}
          <div className="absolute inset-3 w-10 h-10 border-4 border-transparent border-t-[#92D050] rounded-full animate-spin"
               style={{ animationDuration: '1s' }}>
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#E97132] rounded-full animate-ping"
                 style={{ animationDuration: '1.5s' }}>
            </div>
          </div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#E97132] mb-2 animate-pulse">
            {message}
          </h3>
          <p className="text-sm text-gray-600 animate-pulse">
            Vui lòng chờ trong giây lát...
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-[#92D050] rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: '0.7s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
