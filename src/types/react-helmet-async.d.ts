declare module "react-helmet-async" {
  import type { ComponentType, ReactNode } from "react";

  export interface HelmetProviderProps {
    children?: ReactNode;
  }

  export const HelmetProvider: ComponentType<HelmetProviderProps>;

  export interface HelmetProps {
    children?: ReactNode;
  }

  export const Helmet: ComponentType<HelmetProps>;
}
