import { Button } from "@/components/ui/button";
//import { StatCard } from "@/components/StatCard";
//import { FeatureCard } from "@/components/FeatureCard";
import {
    Shield,
    Users,
    AlertTriangle,
    Activity,
    Eye,
    Brain,
    TrendingUp,
    FileCheck,
    Lock,
    Zap,
    BarChart3,
    Bell
} from "lucide-react";
import heroImage from "/hero-security.jpg";

const Home = () => {
    return (
        <div className="min-h-screen bg-background w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `url('/hero-security.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/80 to-background" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                    <div className="text-center animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            <span>Enterprise Security Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
                            InSafe Admin
                            <span className="block text-primary mt-2">Security Command Center</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                            Real-time insider threat detection and monitoring for Wema Bank.
                            Protect your organization with intelligent behavioral analytics and automated response.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="gradient-hero text-primary-foreground shadow-lg hover:shadow-glow text-lg px-8">
                                <Activity className="mr-2 w-5 h-5" />
                                View Dashboard
                            </Button>
                            <Button size="lg" variant="outline" className="border-2 text-lg px-8">
                                <FileCheck className="mr-2 w-5 h-5" />
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </div>
            </section>




            {/* CTA Section */}
            {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient rounded-2xl p-12 md:p-16 text-center shadow-glow">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                        Ready to Secure Your Organization?
                    </h2>
                    <p className="text-lg text-primary-foreground max-w-2xl mx-auto mb-8">
                        Access advanced security controls and insights. Monitor threats, analyze risks, and protect your enterprise assets.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                            <Zap className="mr-2 w-5 h-5" />
                            Get Started
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8">
                            View Documentation
                        </Button>
                    </div>
                </div>
            </section> */}

            {/* Footer */}
            <footer className="border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold text-foreground">InSafe</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2024 InSafe by Wema Bank. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
