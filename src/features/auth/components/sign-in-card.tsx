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

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInProvider = (value: "google" | "github") => {
    setIsLoading(true);
    signIn(value).finally(() => {
      setIsLoading(false);
    });
  };

  const onSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch((e) => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to Continue</CardTitle>
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
              handleSignInProvider("google");
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
              handleSignInProvider("github");
            }}
            size={"lg"}
            disabled={loading}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {"Don't"} have a account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
