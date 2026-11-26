import {
  Compass,
  House,
  Luggage,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  requiresAuth?: boolean;
};

type MobileNavigationItem = NavigationItem & {
  icon: LucideIcon;
};

export const desktopNavigation: NavigationItem[] = [
  {
    label: "Trang chủ",
    href: "/",
  },
  {
    label: "Khám phá",
    href: "/explore",
  },
  {
    label: "Chuyến đi",
    href: "/trips",
    // requiresAuth: true,
  },
];

export const mobileNavigation: MobileNavigationItem[] = [
  {
    label: "Trang chủ",
    href: "/",
    icon: House,
  },
  {
    label: "Khám phá",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Chuyến đi",
    href: "/trips",
    icon: Luggage,
    // requiresAuth: true,
  },
  {
    label: "Tài khoản",
    href: "/profile",
    icon: UserRound,
    requiresAuth: true,
  },
];