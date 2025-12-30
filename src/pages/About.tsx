import { motion } from "framer-motion";
import { BookOpen, Brain, Globe, Shield, Users } from "lucide-react";
import { useEffect } from "react";

const About = () => {
    useEffect(() => {
        document.title = "About Wörtli | Our Mission for Language Learning";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Simple Hero */}
            <header className="py-20 px-4 border-b">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight home-title">
                            About Wörtli
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
                            Empowering language learners through artificial intelligence and proven memory techniques.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl py-20 px-4 space-y-24">
                {/* Section: What is Wörtli? */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-tertiary text-sm font-bold">
                            <Brain className="w-4 h-4" />
                            <span>The Concept</span>
                        </div>
                        <h2 className="text-3xl font-bold">What is Wörtli?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Wörtli is a next-generation vocabulary learning platform designed to bridge the gap between traditional flashcards and AI-powered personalization.
                            The word "Wörtli" comes from a Swiss German diminutive for "words," reflecting our focus on the small building blocks that make up a language.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We believe that language learning shouldn't be about memorizing random lists. It should be about context, relevance, and consistency.
                        </p>
                    </div>
                    <div className="p-8">
                        <div className="aspect-square flex items-center justify-center">
                            <img src="/logo.webp" alt="Wörtli Logo" className="w-48 h-48 drop-shadow-2xl" />
                        </div>
                    </div>
                </section>

                {/* Section: Who it's for */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Who is it for?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Whether you're a casual traveler or building a new life in a different country, Wörtli scales with your needs.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-8 h-8 text-tertiary" />,
                                title: "Travelers",
                                desc: "Quickly learn essential phrases for your next destination using AI to generate context-specific lists."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-tertiary" />,
                                title: "Students",
                                desc: "Supplement your formal education with a dedicated place to store and practice new vocabulary."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-tertiary" />,
                                title: "Newcomers",
                                desc: "Build your new life with confidence by mastering the local language for work, home, and community."
                            }
                        ].map((item, id) => (
                            <div key={id} className="p-6 rounded-xl border bg-card border-tertiary hover:shadow-lg transition-shadow">
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: How it works */}
                <section className="space-y-12 bg-secondary/10 p-12 rounded-3xl border border-tertiary">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold text-center">How it Works</h2>
                        <div className="space-y-8">
                            {[
                                {
                                    step: "01",
                                    title: "Generate or Import",
                                    desc: "Use our AI assistant to create lists based on topics like 'Ordering Food in Italian' or 'Business Spanish'. Or simply import your own JSON files."
                                },
                                {
                                    step: "02",
                                    title: "Practice Daily",
                                    desc: "Engage in short, focused practice sessions. Our algorithm tracks every answer to determine the optimal time for your next review."
                                },
                                {
                                    step: "03",
                                    title: "Master Context",
                                    desc: "Learn not just translations, but gender, notes, and specific usage examples that our AI provides automatically."
                                }
                            ].map((step, id) => (
                                <div key={id} className="flex gap-6">
                                    <div className="text-4xl font-black text-tertiary select-none">{step.step}</div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SEO Friendly Content Block */}
                <section className="prose prose-sm dark:prose-invert max-w-none border-t pt-12">
                    <h2 className="text-2xl font-bold mb-4">Our Technology Stack</h2>
                    <p>
                        Wörtli leverages modern web technologies to provide a fast, secure, and intuitive experience.
                        We use advanced Large Language Models (LLMs) to ensure high-quality translations and contextual information Across 50+ languages including German, Spanish, French, Italian, and many others.
                    </p>
                    <p>
                        Data security is a priority. User progress and lists are stored securely, allowing for cross-device synchronization while maintaining privacy.
                        Our spaced repetition algorithm is modeled after the SuperMemo SM-2 training methodology, adapted for modern language learning needs.
                    </p>
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p>
                            Have questions, feedback, or need support? We'd love to hear from you.
                        </p>
                        <p className="mt-2">
                            Email: <a href="mailto:wortli.app@gmail.com" className="text-tertiary font-bold hover:underline">wortli.app@gmail.com</a>
                        </p>
                    </div>
                </section>
            </main>

            {/* CTA Footer */}
            <section className="py-20 bg-gradient-dark text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Ready to start learning?</h2>
                    <p className="mb-8 text-white/80 max-w-lg mx-auto">Join thousands of others and transform how you master new languages today.</p>
                    <a href="/register" className="inline-block bg-light text-primary font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform">
                        Get Started for Free
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
