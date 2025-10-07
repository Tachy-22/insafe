'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="/wema-logo.jpeg" 
                alt="Wema Bank" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Wema-InSafe</h1>
              {/* <p className="text-muted-foreground">Insider Threat Monitoring System</p> */}
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We&lsquo;ve sent password reset instructions to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Didn&apos;t receive the email? Check your spam folder or contact IT support.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                >
                  Try another email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            <p>© 2024 Wema Bank Nigeria. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/wema-logo.jpeg" 
              alt="Wema Bank" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">InSafe</h1>
            <p className="text-muted-foreground">Insider Threat Monitoring System</p>
            <p className="text-sm text-muted-foreground">Wema Bank Nigeria</p>
          </div>
        </div>

        {/* Reset Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we&apos;ll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending instructions...' : 'Send Reset Instructions'}
                </Button>
                
                <Button variant="outline" asChild className="w-full h-11">
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Contact Support */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs text-muted-foreground">
                Contact IT Support: support@wemabank.com
              </p>
              <p className="text-xs text-muted-foreground">
                Or call: +234 (0) 1 448 5500
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Wema Bank Nigeria. All rights reserved.</p>
          <p className="mt-1">Powered by InSafe Insider Threat Monitoring</p>
        </div>
      </div>
    </div>
  );
}