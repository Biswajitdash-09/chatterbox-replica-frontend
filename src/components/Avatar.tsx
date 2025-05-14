
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface AvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = "md", 
  showStatus = false,
  className
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn("rounded-full overflow-hidden", sizeClasses[size])}>
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
            {user?.name?.charAt(0) || '?'}
          </div>
        )}
      </div>
      
      {showStatus && user?.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
