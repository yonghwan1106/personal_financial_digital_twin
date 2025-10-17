import Link from 'next/link';
import { TrendingUp, Sparkles } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

export default function Logo({ variant = 'default', className = '' }: LogoProps) {
  const isCompact = variant === 'compact';
  const isFooter = variant === 'footer';

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 group ${className}`}
    >
      {/* Logo Icon */}
      <div className={`relative ${isCompact ? 'w-8 h-8' : isFooter ? 'w-10 h-10' : 'w-12 h-12'}`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl transform transition-transform group-hover:scale-105 group-hover:rotate-3"></div>

        {/* Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Chart symbol */}
            <TrendingUp className={`${isCompact ? 'w-4 h-4' : isFooter ? 'w-5 h-5' : 'w-6 h-6'} text-white transform transition-transform group-hover:translate-y-[-1px]`} />

            {/* Sparkle accent */}
            <Sparkles className={`${isCompact ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-yellow-300 absolute -top-1 -right-1 animate-pulse`} />
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </div>

      {/* Logo Text */}
      <div className={`flex flex-col ${isCompact ? 'hidden sm:flex' : ''}`}>
        <span className={`font-bold text-gray-900 ${isFooter ? 'text-white' : ''} ${isCompact ? 'text-base' : 'text-lg'} leading-tight`}>
          나의 금융 디지털트윈
        </span>
        {!isCompact && (
          <span className={`text-xs ${isFooter ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
            AI Financial Planning
          </span>
        )}
      </div>
    </Link>
  );
}
