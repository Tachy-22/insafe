import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-accent backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" /> hi
                        <div>
                            <h1 className="text-xl font-bold text-foreground">InSafe</h1>
                            <p className="text-xs text-muted-foreground">by Wema Bank</p>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-foreground">
                            Documentation
                        </Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
