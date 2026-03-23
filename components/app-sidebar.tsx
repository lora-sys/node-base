"use client";

import { useState } from "react";
import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOut,
  Loader2,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useHasActiveSubscription } from "@/app/features/subscriptions/hooks/use-subscriptions";




const menuItem = [
  {
    title: "Workflows",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isBillingActionPending, setIsBillingActionPending] = useState(false);
  const {hasActiveSubscription,isLoading} = useHasActiveSubscription();

  const handleUpgrade = async () => {
    setIsBillingActionPending(true);
    try {
      await authClient.checkout({ slug: "pro" });
    } catch (error) {
      toast.error(
        `Unable to start checkout: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsBillingActionPending(false);
    }
  };

  const handleBillingPortal = async () => {
    setIsBillingActionPending(true);
    try {
      await authClient.customer.portal();
    } catch (error) {
      toast.error(
        `Unable to open billing portal: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsBillingActionPending(false);
    }
  };
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out");
          },
        },
      });
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/workflows" prefetch>
              <Image
                src="/logo.svg"
                alt="nodebase"
                width={30}
                height={30}
              />
              <span className="font-semibold text-sm">Nodebase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItem.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarContent>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    }
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link href={item.url} prefetch>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-4 h-10 px-4"
                onClick={handleUpgrade}
                disabled={isBillingActionPending}
              >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="gap-x-4 h-10 px-4"
              onClick={handleBillingPortal}
              disabled={isBillingActionPending}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="gap-x-4 h-10 px-4"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isSigningOut ? "Signing out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
