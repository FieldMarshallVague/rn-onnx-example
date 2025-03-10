import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { classNames } from "../styles/helpers";

export type CustomButtonProps = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
} & Omit<TouchableOpacityProps, "children">;

export function CustomButton({
  children,
  className,
  disabled,
  isLoading,
  ...props
}: CustomButtonProps) {
  const loadingStyle = classNames({
    "opacity-50": isLoading,
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`
        bg-secondary rounded-xl min-h-[62px]
        flex flex-row justify-center items-center
        ${className}
        ${loadingStyle}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
}
