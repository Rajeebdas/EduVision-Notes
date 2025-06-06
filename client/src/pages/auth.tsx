import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { StickyNote, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const { data: authConfig } = useQuery({
    queryKey: ["/api/auth/config"],
    retry: false,
  });

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex-col justify-between text-primary-foreground">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
              <StickyNote className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">EduVision Notes</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Your thoughts, organized and accessible everywhere
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Create, manage, and sync your notes across all devices with our modern note-taking platform.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-300" />
            <span>Real-time sync across devices</span>
          </div>
          <div className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-300" />
            <span>Rich text editing with markdown support</span>
          </div>
          <div className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-300" />
            <span>Secure cloud storage</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <StickyNote className="text-primary-foreground h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">EduVision Notes</h1>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="text-center lg:text-left mb-6">
                <h2 className="text-3xl font-bold text-foreground">
                  {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {isLogin ? "Sign in to access your notes" : "Start organizing your notes today"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Google OAuth Button - only show if enabled */}
                {authConfig?.googleOAuthEnabled && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleAuth}
                    >
                      <img 
                        src="https://developers.google.com/identity/images/g-logo.png" 
                        alt="Google" 
                        className="w-5 h-5 mr-3" 
                      />
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background text-muted-foreground">or</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Auth Forms */}
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </div>

              <div className="text-center mt-6">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
