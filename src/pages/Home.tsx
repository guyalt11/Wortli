import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Zap, Target, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const Home = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    // Parallax effect for background elements
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const features = [
        {
            icon: <Brain className="h-12 w-12 text-light" />,
            title: "AI-Powered Learning",
            description: "Generate vocabulary lists instantly with our AI assistant tailored to your customized learning goals."
        },
        {
            icon: <Target className="h-12 w-12 text-light" />,
            title: "Smart Practice System",
            description: "Adaptive spaced repetition ensures you review words at the perfect time for maximum retention."
        },
        {
            icon: <Zap className="h-12 w-12 text-light" />,
            title: "Track Your Progress",
            description: "Monitor your learning journey with detailed statistics and achievement tracking to stay motivated."
        },
        {
            icon: <BookOpen className="h-12 w-12 text-light" />,
            title: "Shared Library",
            description: "Access our community library with a wide range of vocabulary lists for over 50 languages."
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden font-sans selection:bg-primary/30">
            {/* Animated Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ y: y1 }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary opacity-5 rounded-full blur-[120px]"
                />
                <motion.div
                    style={{ y: y2 }}
                    className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-secondary opacity-5 rounded-full blur-[140px]"
                />
                <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-light opacity-5 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 min-h-[90vh] flex flex-col justify-center items-center py-10 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex flex-col items-center"
                    >
                        {/* Logo & Badge */}
                        <motion.div variants={itemVariants} className="mb-8 relative group">
                            <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity duration-500" />
                            <img
                                src="/logo.webp"
                                alt="Wörtli Logo"
                                className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/30 border border-light/20 backdrop-blur-md text-light text-sm font-medium shadow-lg shadow-primary/5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>The Future of Vocabulary</span>
                            </span>
                        </motion.div>

                        {/* Updated Typography - Cleaner 'Heathers' (Headers) */}
                        <motion.h1 variants={itemVariants} className="flex flex-col items-center justify-center font-extrabold tracking-tight mb-6">
                            <span className="text-6xl md:text-8xl mb-2 home-title tracking-tighter drop-shadow-sm">
                                Wörtli
                            </span>
                            <span className="text-3xl md:text-5xl lg:text-6xl text-muted-foreground/80 font-bold max-w-4xl mx-auto leading-tight">
                                <span className="btn-2 bg-clip-text text-transparent">
                                    Master Any Language Naturally & Effortlessly
                                </span>
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            Combine the power of spaced repetition and AI generation.
                            Built to make flashcards easy and fun.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
                            <Button
                                size="lg"
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto text-lg h-14 px-10 rounded-full border-2 border-dashed border-border hover:border-tertiary hover:bg-secondary hover:text-light transition-all duration-300 relative bg-background/50 backdrop-blur-sm"
                            >
                                Have an account?
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-16 sm:mt-24 animate-bounce opacity-50"
                        >
                            <ChevronDown className="w-8 h-8 text-muted-foreground" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-10 bg-background/50">

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                            Why Wörtli works
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Stop wasting time with ineffective methods. Use our science-backed approach.
                        </p>
                        <div className="container mx-auto px-4 py-20">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center text-center p-6 rounded-lg bg-gradient-dark hover:scale-105 transition-transform duration-300"
                                    >
                                        <div className="mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* CTA Section - Refined */}
            <section className="relative z-10 py-32 px-4 overflow-hidden">
                <div className="container mx-auto max-w-5xl relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-dark to-secondary rounded-[2.5rem] p-8 md:p-20 text-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden"
                    >
                        {/* Decorative background circles */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-overlay" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 mix-blend-overlay" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                                Start your journey today
                            </h2>
                            <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto font-medium">
                                Join our growing community of language enthusiasts.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => navigate('/register')}
                                className="bg-light text-primary h-16 px-12 text-xl rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                            >
                                Start Learning Now
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
