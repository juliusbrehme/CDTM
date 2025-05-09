import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Dashboard({ children }: Props) {
  return <div className="mb-6">{children}</div>;
}
