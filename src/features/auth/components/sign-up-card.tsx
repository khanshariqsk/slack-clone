import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { signIn } = useAuthActions();

  const handleSignUpProvider = (value: "google" | "github") => {
    setIsLoading(true);
    signIn(value).finally(() => {
      setIsLoading(false);
    });
  };

  const onSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to Continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-destructive/15 p-3 flex items-center rounded-md gap-x-2 tex-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onSignInSubmit}>
          <Input
            disabled={loading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <Input
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />

          <div className="flex flex-col gap-y-2 mb-4">
            <Input
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              required
            />
            <small className="text-muted-foreground text-xs ">
              Password must include 1 uppercase letter, 1 lowercase letter, and
              1 special character (e.g., @, #).
            </small>
          </div>
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={loading}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant={"outline"}
            className="w-full relative"
            onClick={() => {
              handleSignUpProvider("google");
            }}
            size={"lg"}
            disabled={loading}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            variant={"outline"}
            className="w-full relative"
            onClick={() => {
              handleSignUpProvider("github");
            }}
            size={"lg"}
            disabled={loading}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
