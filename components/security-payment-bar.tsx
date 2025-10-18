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
                src="/images/nequi.jfif"
                alt="Nequi"
                width={50}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/daviplata.jfif"
                alt="Daviplata"
                width={50}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-1">
              <Image
                src="/images/mastercard.jfif"
                alt="Mastercard"
                width={50}
                height={24}
                className="h-6 w-auto object-contain"
              />
              <span className="text-[10px] sm:text-xs">Débito/Crédito</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
