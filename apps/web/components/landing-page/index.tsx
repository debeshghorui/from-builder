"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
    ArrowRight,
    ChevronRight,
    Zap,
    Shield,
    Sparkles,
    BarChart3,
    Users,
    Star,
    CheckCircle2,
    MousePointer2,
    Layers3,
    ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Build and deploy forms in seconds with our optimized infrastructure.",
        gradient: "from-blue-500 to-cyan-500",
        illustration: "computer-fix",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description:
            "Bank-grade encryption and compliance with SOC 2, GDPR, and HIPAA.",
        gradient: "from-purple-500 to-pink-500",
        illustration: "shield",
    },
    {
        icon: BarChart3,
        title: "Real-time Analytics",
        description:
            "Track responses, analyze trends, and get insights instantly.",
        gradient: "from-orange-500 to-red-500",
        illustration: "chart-circle",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description:
            "Work together seamlessly with real-time editing and comments.",
        gradient: "from-green-500 to-emerald-500",
        illustration: "conversation",
    },
    {
        icon: Sparkles,
        title: "AI-Powered",
        description:
            "Smart suggestions and auto-completion powered by advanced AI.",
        gradient: "from-violet-500 to-purple-500",
        illustration: "ai",
    },
    {
        icon: CheckCircle2,
        title: "100% Reliable",
        description:
            "99.99% uptime guarantee with 24/7 support and monitoring.",
        gradient: "from-yellow-500 to-orange-500",
        illustration: "icons",
    },
];

const stats = [
    { value: "10M+", label: "Forms Created" },
    { value: "500K+", label: "Active Users" },
    { value: "99.99%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Product Lead, TechCorp",
        content:
            "From Builder transformed how we collect user feedback. The analytics alone saved us weeks of work.",
        avatar: "girl-phone",
    },
    {
        name: "Marcus Johnson",
        role: "CEO, StartupXYZ",
        content:
            "The most intuitive form builder I've ever used. We onboarded our entire team in under an hour.",
        avatar: "boy-and-laptop",
    },
    {
        name: "Emily Rodriguez",
        role: "UX Designer, DesignCo",
        content:
            "Beautiful forms that match our brand perfectly. The customization options are incredible.",
        avatar: "boy-girl",
    },
];

const pricing = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for individuals",
        features: [
            "3 forms",
            "100 responses/month",
            "Basic analytics",
            "Email support",
        ],
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        description: "For growing teams",
        features: [
            "Unlimited forms",
            "10,000 responses/month",
            "Advanced analytics",
            "Priority support",
            "Custom branding",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: [
            "Everything in Pro",
            "Unlimited responses",
            "SSO & SAML",
            "Dedicated support",
            "SLA guarantee",
        ],
        popular: false,
    },
];

function FloatingElement({ delay, rotate }: { delay: number; rotate: number }) {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
                rotate: [0, rotate, 0],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
            }}
            className="absolute"
        >
            <div className="from-primary h-2 w-2 rounded-full bg-gradient-to-r to-purple-500" />
        </motion.div>
    );
}

function FeatureCard({
    feature,
    index,
}: {
    feature: (typeof features)[0];
    index: number;
}) {
    const { theme } = useTheme();
    const illustrationPath = `/tabler-illustrations/${theme === "dark" ? "dark" : "light"}/${feature.illustration}.png`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="group border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
                />
                <div className="relative p-6">
                    <div className="mb-4 h-32 w-full">
                        <Image
                            src={illustrationPath}
                            alt={feature.title}
                            width={200}
                            height={200}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                        {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {feature.description}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
        >
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
            >
                {stat.value}
            </motion.div>
            <p className="text-muted-foreground mt-2 text-sm">{stat.label}</p>
        </motion.div>
    );
}

function TestimonialCard({
    testimonial,
    index,
}: {
    testimonial: (typeof testimonials)[0];
    index: number;
}) {
    const { theme } = useTheme();
    const illustrationPath = `/tabler-illustrations/${theme === "dark" ? "dark" : "light"}/${testimonial.avatar}.png`;

    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="p-6">
                    <div className="mb-4 h-32 w-full">
                        <Image
                            src={illustrationPath}
                            alt={testimonial.name}
                            width={200}
                            height={200}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="mb-4 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        "{testimonial.content}"
                    </p>
                    <div>
                        <p className="text-sm font-semibold">
                            {testimonial.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                            {testimonial.role}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function PricingCard({
    plan,
    index,
}: {
    plan: (typeof pricing)[0];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={`border-border/50 bg-card/50 relative overflow-hidden backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl ${
                    plan.popular
                        ? "border-primary/50 shadow-primary/10 shadow-xl"
                        : ""
                }`}
            >
                {plan.popular && (
                    <div className="from-primary absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r to-purple-500 px-3 py-1 text-xs font-semibold text-white">
                        Popular
                    </div>
                )}
                <div className="p-6">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                        {plan.description}
                    </p>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.price !== "Custom" && (
                            <span className="text-muted-foreground">
                                /month
                            </span>
                        )}
                    </div>
                    <ul className="mb-6 space-y-3">
                        {plan.features.map((feature, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-2 text-sm"
                            >
                                <CheckCircle2 className="text-primary h-4 w-4" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Button
                        className={`w-full ${plan.popular ? "from-primary hover:from-primary/90 bg-gradient-to-r to-purple-500 hover:to-purple-500/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                    >
                        Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}

export function LandingPage() {
    const { theme } = useTheme();
    const heroIllustration = `/tabler-illustrations/${theme === "dark" ? "dark" : "light"}/welcome-on-board.png`;

    return (
        <main className="bg-background text-foreground min-h-screen overflow-x-clip">
            <Navbar />

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="from-primary/5 absolute -top-[50%] -left-[50%] h-[200%] w-[200%] bg-gradient-to-br via-transparent to-purple-500/5"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute -top-[50%] -right-[50%] h-[200%] w-[200%] bg-gradient-to-bl from-cyan-500/5 via-transparent to-blue-500/5"
                    />
                </div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <FloatingElement
                        key={i}
                        delay={i * 0.2}
                        rotate={Math.random() * 360}
                    />
                ))}

                <div className="relative z-10 mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-12">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="border-primary/50 bg-primary/10 text-primary mb-6">
                                <Sparkles className="mr-2 h-3 w-3" />
                                Award-Winning Design
                            </Badge>

                            <h1 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-bold tracking-tight">
                                Make forms that
                                <span className="from-primary bg-gradient-to-r via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                    {" "}
                                    inspire.
                                </span>
                            </h1>

                            <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
                                Create beautiful, responsive forms in minutes.
                                No coding required. Just drag, drop, and delight
                                your users.
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="from-primary shadow-primary/25 hover:shadow-primary/50 h-14 gap-2 bg-gradient-to-r to-purple-500 px-8 text-lg shadow-xl transition-all"
                                >
                                    <Link href="/signup">
                                        Start Free{" "}
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="border-border/50 h-14 gap-2 px-8 text-lg backdrop-blur-sm"
                                >
                                    <a href="#features">
                                        See Features{" "}
                                        <MousePointer2 className="h-5 w-5" />
                                    </a>
                                </Button>
                            </div>

                            <div className="text-muted-foreground mt-12 flex items-center justify-center gap-8 text-sm lg:justify-start">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-primary h-4 w-4" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-primary h-4 w-4" />
                                    Free forever plan
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-primary h-4 w-4" />
                                    Cancel anytime
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative h-[400px] w-full"
                            >
                                <Image
                                    src={heroIllustration}
                                    alt="Welcome illustration"
                                    width={500}
                                    height={500}
                                    className="h-full w-full object-contain drop-shadow-2xl"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <ChevronRight className="text-muted-foreground h-6 w-6 rotate-90" />
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="border-border/50 bg-muted/30 border-y backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} stat={stat} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <Badge className="border-primary/50 bg-primary/10 text-primary mb-4">
                            Features
                        </Badge>
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Everything you need to{" "}
                            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                                succeed
                            </span>
                        </h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                            Powerful features designed to help you create,
                            manage, and analyze forms with ease.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                feature={feature}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                id="testimonials"
                className="border-border/50 bg-muted/30 border-y py-24 backdrop-blur-sm"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <Badge className="border-primary/50 bg-primary/10 text-primary mb-4">
                            Testimonials
                        </Badge>
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Loved by{" "}
                            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                                thousands
                            </span>
                        </h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                            See what our customers have to say about their
                            experience with From Builder.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                testimonial={testimonial}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <Badge className="border-primary/50 bg-primary/10 text-primary mb-4">
                            Pricing
                        </Badge>
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Simple,{" "}
                            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                                transparent
                            </span>{" "}
                            pricing
                        </h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                            Choose the plan that's right for you. All plans
                            include a 14-day free trial.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pricing.map((plan, index) => (
                            <PricingCard
                                key={index}
                                plan={plan}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-border/50 bg-muted/30 border-y py-24 backdrop-blur-sm">
                <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Ready to get{" "}
                            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                                started
                            </span>
                            ?
                        </h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                            Join thousands of teams already using From Builder
                            to create amazing forms.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="from-primary shadow-primary/25 hover:shadow-primary/50 h-14 gap-2 bg-gradient-to-r to-purple-500 px-8 text-lg shadow-xl transition-all"
                            >
                                <Link href="/signup">
                                    Start Free Trial{" "}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-border/50 h-14 gap-2 px-8 text-lg backdrop-blur-sm"
                            >
                                <a href="#pricing">
                                    View Pricing <Layers3 className="h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
