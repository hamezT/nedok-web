import { ChevronRightIcon } from "lucide-react";

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isLast?: boolean;
  onClick?: () => void;
}

const BreadcrumbItem = ({ children, isLast, onClick }: BreadcrumbItemProps) => {
  return (
    <>
      <div
        className={`text-sm ${
          isLast
            ? "font-medium text-neutral-900"
            : "text-[#5c5c5c] hover:text-neutral-900 cursor-pointer"
        }`}
        onClick={!isLast ? onClick : undefined}
      >
        {children}
      </div>
      {!isLast && (
        <ChevronRightIcon className="w-4 h-4 text-[#5c5c5c] flex-shrink-0" />
      )}
    </>
  );
};

interface BreadcrumbProps {
  items: {
    label: string;
    onClick?: () => void;
  }[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          isLast={index === items.length - 1}
          onClick={item.onClick}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </nav>
  );
};
