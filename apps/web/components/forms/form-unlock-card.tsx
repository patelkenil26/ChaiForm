"use client";

import { useState } from "react";
import { LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { getSafeErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";

export interface FormUnlockCardProps {
  title: string;
  description?: string | null;
  onUnlock: (password: string) => Promise<void>;
  isUnlocking?: boolean;
}

export function FormUnlockCard({
  title,
  description,
  onUnlock,
  isUnlocking = false,
}: FormUnlockCardProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter the access password");
      return;
    }
    setErrorMsg(null);
    try {
      await onUnlock(password.trim());
    } catch (err: unknown) {
      const msg = getSafeErrorMessage(err, "Incorrect password");
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border bg-card/90 backdrop-blur-md p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Lock Icon with soft ring */}
        <div className="relative mx-auto size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
          <LockIcon className="size-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
            <ShieldCheckIcon className="size-2.5 text-white" />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-mono gap-1 text-muted-foreground border-amber-500/20">
            <LockIcon className="size-3 text-amber-400" />
            Protected Form
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {description || "This form requires an access password to view questions and record responses."}
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleUnlock} className="space-y-4 pt-2">
          <div className="space-y-1.5 text-left">
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter access password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                autoFocus
                className={`text-sm pr-10 h-11 rounded-xl transition ${landingTheme.inputFocus} ${
                  errorMsg ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 size-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive font-medium px-1 animate-in fade-in">
                {errorMsg}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUnlocking || !password.trim()}
            className={`w-full h-11 rounded-xl gap-2 font-semibold text-sm transition-all shadow-md shadow-amber-500/10 ${landingTheme.primaryButton}`}
          >
            {isUnlocking ? (
              <>
                <div className="size-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying password...</span>
              </>
            ) : (
              <>
                <span>Unlock & Continue</span>
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <p className="text-[11px] text-muted-foreground pt-2 border-t font-mono">
          Contact the form creator if you do not have the password.
        </p>
      </div>
    </div>
  );
}
