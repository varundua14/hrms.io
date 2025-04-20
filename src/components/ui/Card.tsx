import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

const Card = ({ children, className = '', title, subtitle, icon, footer }: CardProps) => {
  return (
    <div className={`bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || subtitle || icon) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card;