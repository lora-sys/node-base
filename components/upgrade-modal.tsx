"use client";

import { useState } from "react";
import { StarIcon, CreditCardIcon, Loader2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface UpgradeModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
	const [isPending, setIsPending] = useState(false);

	const CheckIcon = () => (
		<div className="shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
			<svg
				className="w-3 h-3 text-green-600"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fillRule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clipRule="evenodd"
				/>
			</svg>
		</div>
	);

	const handleUpgrade = async () => {
		setIsPending(true);
		try {
			await authClient.checkout({ slug: "pro" });
		} catch (error) {
			toast.error(
				`Unable to start checkout: ${error instanceof Error ? error.message : String(error)}`,
			);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-2">
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 shadow-lg">
							<StarIcon className="w-5 h-5 text-white" />
						</div>
						<DialogTitle className="text-xl font-semibold">
							Upgrade to Pro
						</DialogTitle>
					</div>
					<DialogDescription className="text-sm">
						Unlock unlimited workflows and premium features
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="rounded-lg border bg-muted/30 p-4 space-y-3">
						<div className="flex items-start gap-3">
							<CheckIcon />
							<div>
								<p className="text-sm font-medium">Unlimited Workflows</p>
								<p className="text-xs text-muted-foreground">
									Create as many workflows as you need
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<CheckIcon />
							<div>
								<p className="text-sm font-medium">Advanced Analytics</p>
								<p className="text-xs text-muted-foreground">
									Track execution metrics and performance
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<CheckIcon />
							<div>
								<p className="text-sm font-medium">Priority Support</p>
								<p className="text-xs text-muted-foreground">
									Get help when you need it
								</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						Maybe Later
					</Button>
					<Button
						onClick={handleUpgrade}
						disabled={isPending}
						className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
					>
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Processing...
							</>
						) : (
							<>
								<CreditCardIcon className="w-4 h-4 mr-2" />
								Upgrade Now
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
