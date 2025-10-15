import { Lock } from "lucide-react"
import Image from "next/image"

export function SecurityPaymentBar() {
  return (
    <div className="bg-black text-white py-1.5 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            <span className="font-semibold text-xs sm:text-sm">COMPRA 100% SEGURO</span>
          </div>

          <span className="hidden sm:inline text-gray-400 text-xs">|</span>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <span className="text-[10px] sm:text-xs text-gray-300">Aceptamos:</span>

            <div className="flex items-center gap-1">
              <Image
                src="/images/design-mode/image.png"
                alt="Nequi"
                width={45}
                height={16}
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/design-mode/image.png"
                alt="Daviplata"
                width={55}
                height={16}
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/design-mode/image.png"
                alt="Mastercard"
                width={30}
                height={18}
                className="object-contain"
              />
              <span className="text-[10px] sm:text-xs">Débito/Crédito</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
