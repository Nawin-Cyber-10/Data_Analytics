import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Zap } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Image
                  src="/exploit-logo.svg"
                  alt="Exploit Logo"
                  width={32}
                  height={32}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Exploit Data Analytics
              </h1>
              <p className="text-gray-600 mt-1">Advanced AI-powered data analysis and reporting platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              <Zap className="w-3 h-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
