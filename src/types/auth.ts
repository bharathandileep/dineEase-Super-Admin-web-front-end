export interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

export interface ActionButtonProps {
  variant: string;
  type?: "button" | "submit";
  className: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export interface AuthLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
}
